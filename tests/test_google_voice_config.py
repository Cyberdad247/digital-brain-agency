import unittest
from agency_management.google_voice_config import analyze_google_voice_config

class TestGoogleVoiceConfig(unittest.TestCase):
    def setUp(self):
        self.sample_config = {
            "accounts": [
                {"id": 1, "active": True},
                {"id": 2, "active": False},
                {"id": 3, "active": True}
            ],
            "settings": {
                "voicemail_enabled": True,
                "ring_duration": 25
            }
        }

    def test_analyze_configuration(self):
        summary = analyze_google_voice_config(self.sample_config)
        self.assertEqual(summary["total_accounts"], 3)
        self.assertEqual(summary["active_accounts"], 2)
        self.assertTrue(summary["settings"]["voicemail_enabled"])
        self.assertEqual(summary["settings"]["ring_duration"], 25)

if __name__ == '__main__':
    unittest.main()
