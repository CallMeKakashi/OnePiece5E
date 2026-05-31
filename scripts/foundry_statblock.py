#!/usr/bin/env python3
"""Convert Foundry actor JSON (dnd5e) to Obsidian Fantasy Statblocks markdown.

Accepts workshop JSON (embedded items) or live LevelDB export from foundry-read-actor.mjs.
"""

from __future__ import annotations

import html
import json
import math
import re
from pathlib import Path
from typing import Any

VAULT = Path(__file__).resolve().parents[1]
FOUNDRY_JSON = VAULT / "Foundry" / "actors-json"

ABILITY_ORDER = ("str", "dex", "con", "int", "wis", "cha")
SKILL_NAMES = {
    "acr": "Acrobatics",
    "ani": "Animal Handling",
    "arc": "Arcana",
    "ath": "Athletics",
    "dec": "Deception",
    "his": "History",
    "ins": "Insight",
    "itm": "Intimidation",
    "inv": "Investigation",
    "med": "Medicine",
    "nat": "Nature",
    "prc": "Perception",
    "prf": "Performance",
    "per": "Persuasion",
    "rel": "Religion",
    "slt": "Sleight of Hand",
    "ste": "Stealth",
    "sur": "Survival",
}


def load_actor(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def ability_mod(score: int) -> int:
    return math.floor((score - 10) / 2)


def get_ability(data: dict, key: str) -> tuple[int, int]:
    ab = data.get("system", {}).get("abilities", {}).get(key, {})
    if "mod" in ab and ab["mod"] is not None:
        val = ab.get("value")
        score = int(val) if val is not None else 10 + int(ab["mod"]) * 2
        return score, int(ab["mod"])
    score = int(ab.get("value", 10))
    return score, ability_mod(score)


def build_item_id_map(items: list[Any]) -> dict[str, str]:
    """Map Foundry item _id suffixes to display names for enricher resolution."""
    out: dict[str, str] = {}
    for item in items:
        if not isinstance(item, dict):
            continue
        iid = item.get("_id") or item.get("id")
        name = item.get("name", "")
        if iid and name:
            out[iid] = name
            out[iid.lstrip(".")] = name
    return out


def resolve_foundry_enrichers(text: str, item_map: dict[str, str] | None) -> str:
    if not text:
        return text

    def item_repl(match: re.Match[str]) -> str:
        ref = match.group(1).strip().lstrip(".")
        return item_map.get(ref, "") if item_map else ""

    text = re.sub(r"\[\[/item\s+([^\]]+)\]\]", item_repl, text)
    text = re.sub(r"\[\[lookup\s+@name\s+lowercase\]\]", "it", text, flags=re.I)
    text = re.sub(r"\[\[lookup[^\]]*\]\]", "", text)
    text = re.sub(r"\[\[[@/][^\]]*\]\]", "", text)
    return text


def clean_html(text: Any, item_map: dict[str, str] | None = None) -> str:
    if isinstance(text, dict):
        text = text.get("value") or text.get("text") or ""
    if not isinstance(text, str):
        text = str(text) if text is not None else ""
    text = html.unescape(text)
    text = resolve_foundry_enrichers(text, item_map)
    text = re.sub(r"@UUID\[[^\]]+\]\{[^}]+\}", "", text)
    text = re.sub(
        r"&Reference\[([^\]]*)\](?:\{[^}]*\})?",
        lambda m: m.group(1).split()[0],
        text,
    )
    text = re.sub(r"Reference\[[^\]]*\](?:\{[^}]*\})?", "", text)
    text = re.sub(r"</p>\s*<p>", ". ", text, flags=re.I)
    text = re.sub(r"<br\s*/?>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    text = text.replace("\u2019", "'").replace("\u2014", "-")
    text = re.sub(r"\bThe it makes\b", "It makes", text)
    text = re.sub(r"\bThe makes\b", "It makes", text)
    text = re.sub(r"\bthe\s+'s\b", "its", text, flags=re.I)
    text = re.sub(r"\bit's next turn\b", "its next turn", text, flags=re.I)
    text = re.sub(r"\bthe its\b", "its", text, flags=re.I)
    text = re.sub(r"\bmakes another\s+\.", "makes another saving throw.", text)
    text = re.sub(r"\bmakes a\s+\.", "makes a saving throw.", text)
    text = re.sub(r"\bmust make an\s+\.", "must make a saving throw.", text)
    text = re.sub(r"([A-Za-z]+)\s+\(\s*\)", r"\1", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def yaml_scalar(value: str) -> str:
    """Quote strings so Fantasy Statblocks YAML stays valid."""
    value = clean_html(value)
    if not value:
        return '""'
    if re.search(r'[:#\[\]{}&*!|>"\'\\]', value) or value.startswith(("-", " ")):
        return json.dumps(value, ensure_ascii=False)
    return value


def format_speed(movement: dict[str, Any]) -> str:
    if not movement:
        return "30 ft."
    parts: list[str] = []
    for mode in ("walk", "burrow", "climb", "fly", "swim"):
        if mode in movement and movement[mode]:
            parts.append(f"{mode} {movement[mode]} ft.")
    return ", ".join(parts) if parts else "30 ft."


def format_saves_skills(system: dict[str, Any], mods: dict[str, int]) -> tuple[list[str], list[str]]:
    saves: list[str] = []
    skills: list[str] = []
    for key, abbr in SKILL_NAMES.items():
        sk = system.get("skills", {}).get(key, {})
        if not sk:
            continue
        prof = sk.get("value", 0)
        if not prof:
            continue
        ability = sk.get("ability", key[:3] if len(key) == 3 else "dex")
        if ability not in mods:
            ability = "dex"
        bonus = mods[ability] + prof * 2
        skills.append(f"- {abbr}: {bonus:+d}")
    return saves, skills


def resolve_ac(attrs: dict[str, Any], data: dict[str, Any] | None = None) -> int:
    ac = attrs.get("ac", {})
    if isinstance(ac, dict):
        if ac.get("flat") is not None:
            return int(ac["flat"])
        if ac.get("value") is not None:
            return int(ac["value"])
        if data:
            from_items = ac_from_equipped_items(data)
            if from_items is not None:
                return from_items
        _, dex_mod = get_ability(data or {"system": {"abilities": {}}}, "dex")
        return 10 + dex_mod
    if isinstance(ac, (int, float)):
        return int(ac)
    return 10


def ac_from_equipped_items(data: dict[str, Any]) -> int | None:
    armor_base: int | None = None
    dex_cap: int | None = 0
    shield = 0
    for item in data.get("items", []):
        if not isinstance(item, dict):
            continue
        sys = item.get("system", {})
        if not sys.get("equipped"):
            continue
        ac_obj = sys.get("armor") or {}
        if item.get("type") == "equipment" and ac_obj.get("type") == "shield":
            shield = max(shield, int(ac_obj.get("value") or 0))
            continue
        if ac_obj.get("value") is not None:
            armor_base = max(armor_base or 0, int(ac_obj["value"]))
            if ac_obj.get("dex") is None:
                dex_cap = None
            else:
                dex_cap = int(ac_obj["dex"])
    if armor_base is None and not shield:
        return None
    _, dex_mod = get_ability(data, "dex")
    dex_add = dex_mod if dex_cap is None else min(dex_mod, dex_cap)
    base = armor_base if armor_base is not None else 10
    return base + dex_add + shield


def proficiency_bonus(cr: Any) -> int:
    try:
        cr_f = float(cr)
    except (TypeError, ValueError):
        return 2
    if cr_f < 5:
        return 2
    if cr_f < 9:
        return 3
    if cr_f < 13:
        return 4
    if cr_f < 17:
        return 5
    if cr_f < 21:
        return 6
    if cr_f < 25:
        return 7
    if cr_f < 29:
        return 8
    return 9


def activity_text(act: dict[str, Any]) -> str:
    desc = act.get("description") or {}
    if isinstance(desc, dict):
        return clean_html(desc.get("value") or desc.get("chatFlavor") or "")
    return clean_html(str(desc))


def resolve_bonus_token(bonus: Any, data: dict[str, Any], ability: str = "str") -> str:
    if not bonus:
        return ""
    bonus_s = str(bonus).strip()
    if bonus_s in ("@mod", "@abilities.str.mod", "@abilities.dex.mod"):
        key = "str" if "str" in bonus_s else "dex"
        _, mod = get_ability(data, key)
        return f"+{mod}" if mod >= 0 else str(mod)
    if bonus_s.startswith("@abilities.") and bonus_s.endswith(".mod"):
        key = bonus_s.split(".")[1]
        _, mod = get_ability(data, key)
        return f"+{mod}" if mod >= 0 else str(mod)
    return bonus_s


def format_damage_part(
    part: Any, data: dict[str, Any] | None = None, ability: str = "str"
) -> str:
    if isinstance(part, list) and len(part) >= 2:
        return f"{part[0]} {part[1]}".strip()
    if not isinstance(part, dict):
        return ""
    custom = part.get("custom") or {}
    if custom.get("enabled") and custom.get("formula"):
        return clean_html(str(custom["formula"]))
    n, d = part.get("number"), part.get("denomination")
    if n is None or d is None:
        return ""
    expr = f"{n}d{d}"
    bonus = part.get("bonus")
    if bonus and data:
        bonus_s = resolve_bonus_token(bonus, data, ability)
        if bonus_s not in ("0", ""):
            expr += f" {bonus_s}" if bonus_s.startswith(("+", "-")) else f"+{bonus_s}"
    elif bonus:
        bonus_s = str(bonus).strip()
        if bonus_s.startswith("@"):
            expr += f" {bonus_s}"
        elif bonus_s not in ("0", ""):
            expr += bonus_s if bonus_s.startswith(("+", "-")) else f"+{bonus_s}"
    types = part.get("types") or []
    if types:
        expr += f" {types[0]}"
    return expr.strip()


def format_save_activity(act: dict[str, Any], data: dict[str, Any]) -> list[str]:
    lines: list[str] = []
    save = act.get("save") or {}
    dc_block = save.get("dc") or {}
    dc_val = dc_block.get("formula") or dc_block.get("value")
    calc = (dc_block.get("calculation") or "").lower()
    if isinstance(dc_val, (int, float)):
        lines.append(f"DC {int(dc_val)}")
    elif dc_val or calc:
        prof = proficiency_bonus(data.get("system", {}).get("details", {}).get("cr"))
        ability_key = calc if calc in ABILITY_ORDER else "wis"
        if calc in ABILITY_ORDER:
            _, mod = get_ability(data, calc)
        elif "cha" in str(dc_val).lower():
            _, mod = get_ability(data, "cha")
        elif "int" in str(dc_val).lower():
            _, mod = get_ability(data, "int")
        elif "con" in str(dc_val).lower():
            _, mod = get_ability(data, "con")
        else:
            _, mod = get_ability(data, ability_key)
        lines.append(f"DC {8 + mod + prof}")
    abilities = save.get("ability") or []
    if abilities:
        lines.append(f"{abilities[0].upper()} save")
    rng = act.get("range") or {}
    if rng.get("value"):
        lines.append(f"Range: {rng['value']} ft.")
    return lines


def infer_weapon_ability(sys: dict[str, Any], act: dict[str, Any] | None = None) -> str:
    attack = (act or {}).get("attack") or {}
    ability = attack.get("ability")
    if ability:
        return str(ability)
    props = sys.get("properties") or []
    if any(p in ("fin", "finesse") for p in props) or "fin" in str(props).lower():
        return "dex"
    wtype = (sys.get("type") or {}).get("value", "")
    if "ranged" in str(wtype).lower() or "rng" in str(wtype).lower():
        return "dex"
    return "str"


def format_weapon_damage_sys(sys: dict[str, Any], data: dict[str, Any]) -> list[str]:
    lines: list[str] = []
    ability = infer_weapon_ability(sys)
    dmg = sys.get("damage") or {}
    base = dmg.get("base")
    if isinstance(base, dict) and base.get("number"):
        lines.append(f"Hit: {format_damage_part(base, data, ability)}")
    ver = dmg.get("versatile")
    if isinstance(ver, dict) and ver.get("number"):
        lines.append(f"Versatile: {format_damage_part(ver, data, ability)}")
    return lines


def format_equipment_trait(item: dict[str, Any]) -> str | None:
    sys = item.get("system", {})
    arm = sys.get("armor") or {}
    if arm.get("value") is None:
        raw = sys.get("description", "")
        if isinstance(raw, dict):
            desc = clean_html(raw.get("value") or "")
        else:
            desc = clean_html(str(raw))
        desc = re.sub(r"^[\s.]+", "", desc).strip()
        return desc or None
    note = f"AC {arm['value']}"
    dex = arm.get("dex")
    if dex is not None:
        note += f" + Dex (max {dex})"
    base = (sys.get("type") or {}).get("baseItem", "")
    if base == "chainshirt" or "chain" in item.get("name", "").lower():
        note = f"Medium armor. {note}"
    elif base == "shield" or "shield" in item.get("name", "").lower():
        shield_desc = clean_html(
            (sys.get("description") or {}).get("value", "")
            if isinstance(sys.get("description"), dict)
            else ""
        )
        note = f"+2 AC (shield). {shield_desc}".strip()
    return note


def format_attack_activity(
    act: dict[str, Any], data: dict[str, Any], sys: dict[str, Any] | None = None
) -> list[str]:
    lines: list[str] = []
    attack = act.get("attack") or {}
    ability = infer_weapon_ability(sys or {}, act)
    _, mod = get_ability(data, ability)
    prof = proficiency_bonus(data.get("system", {}).get("details", {}).get("cr"))
    bonus_raw = attack.get("bonus")
    if bonus_raw not in (None, ""):
        try:
            to_hit = int(bonus_raw)
        except (TypeError, ValueError):
            to_hit = mod + prof
    else:
        to_hit = mod + prof
    atype = attack.get("type") or {}
    atk_kind = atype.get("value") if isinstance(atype, dict) else ""
    if atk_kind == "ranged":
        label = "Ranged Weapon Attack"
    elif atk_kind == "melee":
        label = "Melee Weapon Attack"
    elif sys and "thr" in (sys.get("properties") or []):
        label = "Melee or Ranged Weapon Attack"
    else:
        label = "Melee Weapon Attack"
    lines.append(f"{label}: +{to_hit} to hit")
    damage = act.get("damage") or {}
    hit_added = False
    for part in damage.get("parts") or []:
        formatted = format_damage_part(part, data, ability)
        if formatted:
            lines.append(f"Hit: {formatted}")
            hit_added = True
    if not hit_added and sys:
        lines.extend(format_weapon_damage_sys(sys, data))
    if sys:
        rng = sys.get("range") or {}
        if rng.get("value") and "thr" in (sys.get("properties") or []):
            long = rng.get("long") or rng["value"]
            lines.append(f"Range: {rng['value']}/{long} ft.")
    return lines


def format_activity_lines(sys: dict[str, Any], data: dict[str, Any]) -> list[str]:
    lines: list[str] = []
    seen: set[str] = set()
    for act in (sys.get("activities") or {}).values():
        if not isinstance(act, dict):
            continue
        chunk: list[str] = []
        text = activity_text(act)
        if text:
            chunk.append(text)
        act_type = act.get("type")
        if act_type == "attack" or act.get("attack"):
            chunk.extend(format_attack_activity(act, data, sys))
        elif act_type == "save" or act.get("save"):
            chunk.extend(format_save_activity(act, data))
        healing = act.get("healing") or {}
        if healing.get("number") and healing.get("denomination") and not text:
            chunk.append(
                f"Healing: {healing['number']}d{healing['denomination']}"
            )
        elif (
            healing.get("custom", {}).get("enabled")
            and healing.get("custom", {}).get("formula")
            and not text
        ):
            chunk.append(f"Healing: {healing['custom']['formula']}")
        damage = act.get("damage") or {}
        atk = act.get("attack") or {}
        abil = atk.get("ability") or "str"
        for part in damage.get("parts") or []:
            formatted = format_damage_part(part, data, abil)
            if formatted and not any(formatted in line for line in chunk):
                chunk.append(f"Damage: {formatted}")
        roll = act.get("roll") or {}
        formula = roll.get("formula")
        if formula:
            chunk.append(f"Roll: {formula}")
        block = ". ".join(chunk).strip()
        if block and block not in seen:
            seen.add(block)
            lines.append(block)
    return lines


def resolve_creature_type(details: dict[str, Any]) -> str:
    dtype = details.get("type", "humanoid")
    if isinstance(dtype, dict):
        return dtype.get("value") or dtype.get("custom") or "humanoid"
    return str(dtype) if dtype else "humanoid"


def is_passive_feat(sys: dict[str, Any]) -> bool:
    """True when a feat item has no attack/save/damage activities (traits only)."""
    for act in (sys.get("activities") or {}).values():
        if not isinstance(act, dict):
            continue
        if act.get("type") in ("attack", "save") or act.get("attack") or act.get("save"):
            return False
        if act.get("damage", {}).get("parts"):
            return False
    return True


def enrich_save_in_desc(
    desc: str, sys: dict[str, Any], data: dict[str, Any]
) -> tuple[str, dict[str, Any] | None]:
    """Inject ability + DC into generic 'a saving throw' text from save activities."""
    for act in (sys.get("activities") or {}).values():
        if not isinstance(act, dict) or not (
            act.get("type") == "save" or act.get("save")
        ):
            continue
        abilities = (act.get("save") or {}).get("ability") or []
        if not abilities or not re.search(r"\ba saving throw\b", desc, re.I):
            return desc, act
        save_bits = format_save_activity(act, data)
        dc_part = next((b for b in save_bits if b.startswith("DC")), None)
        if not dc_part:
            return desc, act
        abil = str(abilities[0]).upper()
        desc = re.sub(
            r"\ba saving throw\b",
            f"a {abil} saving throw ({dc_part})",
            desc,
            count=1,
            flags=re.I,
        )
        return desc, act
    return desc, None


def format_items(
    items: list[Any], data: dict[str, Any]
) -> tuple[list[str], list[str], list[str]]:
    traits: list[str] = []
    actions: list[str] = []
    bonus: list[str] = []
    item_map = build_item_id_map(items)
    for item in items:
        if not isinstance(item, dict):
            continue
        name = item.get("name", "Feature")
        sys = item.get("system", {})
        item_type = item.get("type", "")
        if item_type == "equipment":
            eq = format_equipment_trait(item)
            if eq:
                traits.append(
                    f"- name: {yaml_scalar(name)}\n  desc: {yaml_scalar(eq)}"
                )
            continue
        raw_desc = sys.get("description", "")
        raw_val = (
            raw_desc.get("value") or ""
            if isinstance(raw_desc, dict)
            else raw_desc or ""
        )
        if isinstance(raw_val, str) and "[[lookup" in raw_val:
            raw_val = resolve_foundry_enrichers(raw_val, item_map)
        if isinstance(raw_desc, dict):
            desc = clean_html(raw_val, item_map)
        else:
            desc = clean_html(raw_val, item_map)
        desc = re.sub(r"^[\s.]+", "", desc).strip()
        save_act: dict[str, Any] | None = None
        if desc and re.search(r"\bsaving throw\b", desc, re.I):
            desc, save_act = enrich_save_in_desc(desc, sys, data)
        if re.search(r"within\s+feet|DC\s*,", desc, re.I):
            desc = re.sub(
                r"Wisdom Saving Throw:\s*DC\s*,.*?(?=Failure:|$)",
                "",
                desc,
                flags=re.I,
            ).strip()
        if desc and re.search(r"\bFailure:", desc, re.I) and not re.search(
            r"\bDC\s*\d+", desc, re.I
        ):
            for act in (sys.get("activities") or {}).values():
                if isinstance(act, dict) and (
                    act.get("type") == "save" or act.get("save")
                ):
                    save_bits = format_save_activity(act, data)
                    rng = (act.get("range") or {}).get("value", "")
                    opener = f"Wisdom Saving Throw: {save_bits[0]}."
                    if rng:
                        opener += f" One creature within {rng} ft."
                    desc = f"{opener} {desc}".strip()
                    break
        action_type = sys.get("actionType", "")
        attack = sys.get("attackBonus")
        damage_parts = sys.get("damage", {}).get("parts", [])
        lines = [desc] if desc else []
        if attack is not None:
            lines.append(f"Attack: +{attack}")
        save = sys.get("save", {})
        if save.get("dc"):
            lines.append(
                f"Save: {save.get('ability', 'dex').upper()} DC {save['dc']}"
            )
        for part in damage_parts:
            if isinstance(part, list) and len(part) >= 2:
                lines.append(f"Damage: {part[0]} {part[1]}")
            elif isinstance(part, dict):
                formatted = format_damage_part(part, data)
                if formatted:
                    lines.append(f"Damage: {formatted}")
        activity_lines = format_activity_lines(sys, data)
        if save_act:
            save_bits = format_save_activity(save_act, data)
            activity_lines = [
                ln
                for ln in activity_lines
                if ln.strip() not in save_bits
                and not re.match(r"^DC\s*\d+", ln.strip(), re.I)
                and not re.match(r"^(WIS|DEX|STR|INT|CON|CHA)\s+save", ln.strip(), re.I)
                and not ln.strip().lower().startswith("range:")
            ]
        if desc:
            dl = desc.lower()
            activity_lines = [
                ln for ln in activity_lines if ln.strip().lower() not in dl
            ]
        if desc and re.search(r"\bDC\s*\d+", desc, re.I):
            activity_lines = [
                ln
                for ln in activity_lines
                if not re.match(r"^DC\s*\d+", ln.strip(), re.I)
                and not re.match(r"^(WIS|DEX|STR|INT|CON|CHA)\s+save", ln.strip(), re.I)
                and not ln.strip().lower().startswith("range:")
            ]
        if desc and re.search(r"\bregain|\bheal", desc, re.I):
            activity_lines = [
                ln
                for ln in activity_lines
                if not ln.strip().lower().startswith("healing:")
            ]
        lines.extend(activity_lines)
        if item_type == "weapon" and not any(
            "to hit" in ln.lower() for ln in lines
        ):
            for act in (sys.get("activities") or {}).values():
                if isinstance(act, dict) and (
                    act.get("type") == "attack" or act.get("attack")
                ):
                    lines.extend(format_attack_activity(act, data, sys))
                    break
            for wd in format_weapon_damage_sys(sys, data):
                if wd not in lines and not any(
                    wd.split(": ", 1)[-1] in ln for ln in lines
                ):
                    lines.append(wd)
        block = ". ".join(lines).strip()
        block = re.sub(r"\.{2,}", ".", block)
        if block in (".", ". .", ""):
            block = ""
        if len(block) > 480:
            block = block[:477] + "..."
        if not block:
            block = "(See Foundry for activity details.)"
        entry = f"- name: {yaml_scalar(name)}\n  desc: {yaml_scalar(block)}"
        if action_type in ("mwak", "rwak", "msak", "rsak"):
            actions.append(entry)
        elif "bonus" in name.lower():
            bonus.append(entry)
        elif item_type in ("weapon", "feat", "spell"):
            if item_type == "feat" and is_passive_feat(sys):
                traits.append(entry)
            else:
                actions.append(entry)
        else:
            traits.append(entry)
    return traits, actions, bonus


def foundry_to_statblock(data: dict[str, Any]) -> str:
    system = data.get("system", {})
    details = system.get("details", {})
    attrs = system.get("attributes", {})
    traits_sys = system.get("traits", {})

    scores: list[int] = []
    mods: dict[str, int] = {}
    for key in ABILITY_ORDER:
        s, m = get_ability(data, key)
        scores.append(s)
        mods[key] = m

    ac = resolve_ac(attrs, data)
    hp = attrs.get("hp", {})
    hp_val = hp.get("value", hp.get("max", "?"))
    hp_max = hp.get("max", hp_val)

    cr = details.get("cr", "?")
    dtype = resolve_creature_type(details)
    align = details.get("alignment", "unaligned")
    size = traits_sys.get("size", "med")
    size_map = {
        "tiny": "tiny",
        "sm": "small",
        "med": "medium",
        "lg": "large",
        "huge": "huge",
        "grg": "gargantuan",
    }

    lines = ["```statblock"]
    lines.append(f"name: {yaml_scalar(str(data.get('name', 'Unknown')))}")
    lines.append(f"size: {size_map.get(size, size)}")
    lines.append(f"type: {dtype}")
    lines.append(f"alignment: {align}")
    lines.append(f"ac: {ac}")
    if hp_max != hp_val:
        lines.append(f"hp: {hp_val} ({hp_max})")
    else:
        lines.append(f"hp: {hp_val}")
    lines.append(f"speed: {format_speed(attrs.get('movement', {}))}")
    lines.append(f"stats: [{', '.join(str(s) for s in scores)}]")
    if cr != "?":
        lines.append(f"cr: {cr}")

    senses = attrs.get("senses", {})
    if senses.get("darkvision"):
        lines.append(f"senses: darkvision {senses['darkvision']} ft.")
    if senses.get("passive"):
        lines.append(f"passive: {senses['passive']}")

    for resist in ("di", "dr", "dv", "ci"):
        block = traits_sys.get(resist, {}).get("value", [])
        if block:
            label = {
                "di": "damage_immunities",
                "dr": "damage_resistances",
                "dv": "damage_vulnerabilities",
                "ci": "condition_immunities",
            }[resist]
            lines.append(f"{label}: {', '.join(block)}")

    saves, skills = format_saves_skills(system, mods)
    if saves:
        lines.append("saves:")
        lines.extend(saves)
    if skills:
        lines.append("skills:")
        lines.extend(skills)

    traits, actions, bonus = format_items(data.get("items", []), data)
    if traits:
        lines.append("traits:")
        lines.extend(traits)
    if actions:
        lines.append("actions:")
        lines.extend(actions)
    if bonus:
        lines.append("bonus_actions:")
        lines.extend(bonus)

    lines.append("```")
    return "\n".join(lines)


def main() -> int:
    import sys

    path = Path(sys.argv[1]) if len(sys.argv) > 1 else FOUNDRY_JSON / "leon.json"
    data = load_actor(path)
    print(foundry_to_statblock(data))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
