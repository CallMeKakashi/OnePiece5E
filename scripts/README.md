# Discord export script
Copy-Item discord-channels.example.json discord-channels.json
# Edit discord-channels.json with your channel IDs

python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# Set DISCORD_BOT_TOKEN in ../.env

python discord_export.py
python discord_export.py --channels 1234567890123456789
