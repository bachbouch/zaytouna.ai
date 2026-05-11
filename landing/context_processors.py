from django.conf import settings


def community(request):
    """Surfaces COMMUNITY_* URLs from settings to every template as
    `community.telegram` / `community.discord` / `community.huggingface`."""
    return {
        "community": {
            "telegram": getattr(settings, "COMMUNITY_TELEGRAM", ""),
            "discord": getattr(settings, "COMMUNITY_DISCORD", ""),
            "huggingface": getattr(settings, "COMMUNITY_HUGGINGFACE", ""),
        }
    }
