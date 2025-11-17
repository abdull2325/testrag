import json
from typing import Dict

SETTINGS_FILE = "./admin_settings.json"


def load_settings() -> Dict:
    """Load admin settings from JSON file."""
    try:
        with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        # Default settings
        return {
            "welcomeMessage": "Bună! Cu ce te pot ajuta?",
            "fallbackMessage": "Ne pare rău, nu am găsit un răspuns adecvat în baza noastră de cunoștințe.",
            "toneInstructions": "Răspunde într-un ton prietenos și profesional, în limba română. Fii clar și concis.",
            "admin_user": "admin",
        }


def save_settings(data: Dict):
    """Save admin settings to JSON file."""
    with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
