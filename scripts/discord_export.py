#!/usr/bin/env python3
"""Export selected Discord channels to Obsidian-friendly markdown files."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import discord
from dotenv import load_dotenv


SCRIPT_DIR = Path(__file__).resolve().parent
VAULT_ROOT = SCRIPT_DIR.parent
DEFAULT_CONFIG = SCRIPT_DIR / "discord-channels.json"
DEFAULT_OUTPUT = VAULT_ROOT / "Discord" / "exports"


def slugify(value: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", value, flags=re.UNICODE)
    slug = re.sub(r"[\s_-]+", "-", slug.strip().lower())
    return slug or "channel"


def load_channel_config(config_path: Path, selected_ids: set[str] | None) -> list[dict]:
    if not config_path.exists():
        raise FileNotFoundError(
            f"Config not found: {config_path}\n"
            f"Copy {SCRIPT_DIR / 'discord-channels.example.json'} to {config_path} "
            "and add your channel IDs."
        )

    with config_path.open(encoding="utf-8") as handle:
        payload = json.load(handle)

    channels = payload.get("channels", [])
    if not channels:
        raise ValueError(f"No channels listed in {config_path}")

    if selected_ids:
        channels = [channel for channel in channels if str(channel["id"]) in selected_ids]
        missing = selected_ids - {str(channel["id"]) for channel in channels}
        if missing:
            raise ValueError(
                "These channel IDs were not found in the config: "
                + ", ".join(sorted(missing))
            )

    for channel in channels:
        if "id" not in channel:
            raise ValueError(f"Channel entry missing id: {channel}")

    return channels


def format_embed(embed: discord.Embed) -> str:
    lines = ["**Embed:**"]
    if embed.title:
        lines.append(f"- Title: {embed.title}")
    if embed.description:
        lines.append(f"- Description: {embed.description}")
    if embed.url:
        lines.append(f"- URL: {embed.url}")
    for field in embed.fields:
        lines.append(f"- {field.name}: {field.value}")
    return "\n".join(lines)


def format_attachments(message: discord.Message) -> str:
    if not message.attachments:
        return ""

    lines = ["", "**Attachments:**"]
    for attachment in message.attachments:
        lines.append(f"- [{attachment.filename}]({attachment.url})")
    return "\n".join(lines)


def format_reply(message: discord.Message) -> str:
    if not message.reference or not message.reference.resolved:
        return ""

    referenced = message.reference.resolved
    if not isinstance(referenced, discord.Message):
        return ""

    preview = referenced.content.replace("\n", " ").strip()
    if len(preview) > 180:
        preview = preview[:177] + "..."

    author = getattr(referenced.author, "display_name", "unknown")
    return f"\n> **Reply to {author}:** {preview}\n"


def format_message(message: discord.Message) -> str:
    timestamp = message.created_at.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    author = message.author.display_name
    edited = " *(edited)*" if message.edited_at else ""

    parts = [f"### {timestamp} — {author}{edited}", ""]

    reply = format_reply(message)
    if reply:
        parts.append(reply.strip())
        parts.append("")

    content = message.content.strip()
    if content:
        parts.append(content)
    elif not message.attachments and not message.embeds:
        parts.append("*(no text content)*")

    attachment_block = format_attachments(message)
    if attachment_block:
        parts.append(attachment_block)

    for embed in message.embeds:
        parts.append("")
        parts.append(format_embed(embed))

    parts.append("")
    parts.append("---")
    parts.append("")
    return "\n".join(parts)


def build_markdown(
    channel: discord.abc.Messageable,
    channel_config: dict,
    exported_at: datetime,
    messages: list[discord.Message],
) -> str:
    channel_name = getattr(channel, "name", str(channel_config["id"]))
    slug = channel_config.get("slug") or slugify(channel_name)
    description = channel_config.get("description", "")

    header = [
        "---",
        f"discord_channel_id: {channel_config['id']}",
        f"discord_channel_name: {channel_name}",
        f"export_slug: {slug}",
        f"exported_at: {exported_at.isoformat()}",
        "source: discord",
        "status: draft",
        "---",
        "",
        f"# Discord export: {channel_name}",
        "",
    ]

    if description:
        header.extend([description, ""])

    header.extend(
        [
            f"- Messages exported: {len(messages)}",
            f"- Channel ID: `{channel_config['id']}`",
            "",
            "---",
            "",
        ]
    )

    body = "".join(format_message(message) for message in messages)
    return "\n".join(header) + body


async def fetch_messages(channel: discord.abc.Messageable, label: str) -> list[discord.Message]:
    messages: list[discord.Message] = []
    async for message in channel.history(limit=None, oldest_first=True):
        messages.append(message)
        if len(messages) % 500 == 0:
            print(f"  ... fetched {len(messages)} messages from #{label}", flush=True)
    return messages


def export_channels(
    token: str,
    channels: list[dict],
    output_dir: Path,
) -> list[Path]:
    intents = discord.Intents.default()
    intents.message_content = True

    written: list[Path] = []
    exported_at = datetime.now(timezone.utc)

    class ExportClient(discord.Client):
        async def on_ready(self) -> None:
            nonlocal written

            output_dir.mkdir(parents=True, exist_ok=True)

            for channel_config in channels:
                channel_id = int(channel_config["id"])
                channel = await self.fetch_channel(channel_id)

                if not isinstance(channel, discord.abc.Messageable):
                    raise TypeError(f"Channel {channel_id} is not messageable")

                channel_name = getattr(channel, "name", str(channel_id))
                print(f"Exporting #{channel_name} ({channel_id})...", flush=True)
                messages = await fetch_messages(channel, channel_name)

                slug = channel_config.get("slug") or slugify(channel_name)
                if slug.startswith("channel-"):
                    slug = slugify(channel_name)

                output_path = output_dir / f"{slug}.md"
                output_path.write_text(
                    build_markdown(channel, channel_config, exported_at, messages),
                    encoding="utf-8",
                )
                written.append(output_path)
                print(f"  Wrote {len(messages)} messages to {output_path}", flush=True)

            await self.close()

    client = ExportClient(intents=intents)
    client.run(token)
    return written


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Export selected Discord channels to markdown files."
    )
    parser.add_argument(
        "--config",
        type=Path,
        default=DEFAULT_CONFIG,
        help=f"Channel config JSON (default: {DEFAULT_CONFIG})",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Output directory (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--channels",
        nargs="*",
        help="Optional channel IDs to export (must exist in config). Exports all config channels if omitted.",
    )
    parser.add_argument(
        "--token-env",
        default="DISCORD_BOT_TOKEN",
        help="Environment variable containing the Discord bot token (default: DISCORD_BOT_TOKEN)",
    )
    return parser.parse_args()


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")

    load_dotenv(VAULT_ROOT / ".env")
    args = parse_args()

    token = os.getenv(args.token_env)
    if not token:
        print(
            f"Missing bot token. Set {args.token_env} in the environment or in {VAULT_ROOT / '.env'}.",
            file=sys.stderr,
        )
        return 1

    selected_ids = set(args.channels) if args.channels else None

    try:
        channels = load_channel_config(args.config.resolve(), selected_ids)
    except (FileNotFoundError, ValueError) as error:
        print(error, file=sys.stderr)
        return 1

    try:
        written = export_channels(token, channels, args.output.resolve())
    except discord.LoginFailure:
        print("Discord login failed. Check your bot token.", file=sys.stderr)
        return 1
    except discord.Forbidden as error:
        print('Discord permission error:', error, file=sys.stderr)
        return 1
    except discord.HTTPException as error:
        print(f"Discord API error: {error}", file=sys.stderr)
        return 1

    print(f"Done. Exported {len(written)} channel(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
