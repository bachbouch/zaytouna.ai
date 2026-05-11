from django.urls import path

from .views import HomeView, HomeDarijaView

app_name = "landing"

urlpatterns = [
    path("", HomeView.as_view(), name="home"),
    path("tn/", HomeDarijaView.as_view(), name="home_ar"),
]
