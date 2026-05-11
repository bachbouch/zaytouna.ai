from django.views.generic import TemplateView

from . import content


class HomeView(TemplateView):
    template_name = "landing/home.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["manifesto"] = content.MANIFESTO
        ctx["pillars"] = content.PILLARS
        ctx["roles"] = content.ROLES
        ctx["members"] = content.MEMBERS
        ctx["marquee_words"] = content.MARQUEE_WORDS
        ctx["stats"] = content.STATS
        return ctx
