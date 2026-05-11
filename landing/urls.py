from django.urls import path

from .views import (
    HelpItemsAPI,
    HomeDarijaView,
    HomeView,
    JoinAPI,
    RolesAPI,
    VerifyEmailView,
)

app_name = "landing"

urlpatterns = [
    path("", HomeView.as_view(), name="home"),
    path("tn/", HomeDarijaView.as_view(), name="home_ar"),
    path("api/roles/", RolesAPI.as_view(), name="api_roles"),
    path("api/help-items/", HelpItemsAPI.as_view(), name="api_help_items"),
    path("api/join/", JoinAPI.as_view(), name="api_join"),
    path("verify/<uidb64>/<token>/", VerifyEmailView.as_view(), name="verify_email"),
]
