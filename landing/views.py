from django.views.generic import TemplateView

from . import content


class HomeView(TemplateView):
    template_name = "landing/home.html"
    lang = "en"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["lang"] = self.lang
        ctx["t"] = content.TEXTS[self.lang]
        ctx["roles"] = content.get_roles(self.lang)
        ctx["members"] = content.get_members(self.lang)
        ctx["stats"] = content.STATS
        return ctx


class HomeDarijaView(HomeView):
    lang = "ar-TN"
