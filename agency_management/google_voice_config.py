import json

# Load Google Voice configuration from a JSON file
def load_google_voice_config(file_path):
    with open(file_path, 'r') as f:
        config = json.load(f)
    return config

# Analyze the configuration and return a summary
def analyze_google_voice_config(config):
    summary = {
        "total_accounts": len(config.get("accounts", [])),
        "active_accounts": sum(1 for acc in config.get("accounts", []) if acc.get("active")),
        "settings": config.get("settings", {})
    }
    return summary

if __name__ == "__main__":
    # Example usage: analyze configuration from a provided file path
    import sys
    if len(sys.argv) < 2:
        print("Usage: python google_voice_config.py <config_file.json>")
        sys.exit(1)
    cfg = load_google_voice_config(sys.argv[1])
    analysis = analyze_google_voice_config(cfg)
    print("Google Voice Configuration Analysis:")
    print(analysis)
