from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path

from landing.forms import EmailAuthenticationForm

# Auth URLs live at the root (un-namespaced) so Django's built-in
# {% url 'login' %} / 'password_reset_done' / etc. resolve correctly.
auth_patterns = [
    path(
        "login/",
        auth_views.LoginView.as_view(
            template_name="landing/auth/login.html",
            authentication_form=EmailAuthenticationForm,
            redirect_authenticated_user=True,
        ),
        name="login",
    ),
    path(
        "logout/",
        auth_views.LogoutView.as_view(next_page="/"),
        name="logout",
    ),
    path(
        "password-reset/",
        auth_views.PasswordResetView.as_view(
            template_name="landing/auth/password_reset.html",
            subject_template_name="landing/email/password_reset_subject.txt",
            email_template_name="landing/email/password_reset.txt",
            html_email_template_name="landing/email/password_reset.html",
            success_url="/password-reset/done/",
        ),
        name="password_reset",
    ),
    path(
        "password-reset/done/",
        auth_views.PasswordResetDoneView.as_view(
            template_name="landing/auth/password_reset_done.html",
        ),
        name="password_reset_done",
    ),
    path(
        "password-reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(
            template_name="landing/auth/password_reset_confirm.html",
            success_url="/password-reset/complete/",
        ),
        name="password_reset_confirm",
    ),
    path(
        "password-reset/complete/",
        auth_views.PasswordResetCompleteView.as_view(
            template_name="landing/auth/password_reset_complete.html",
        ),
        name="password_reset_complete",
    ),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    *auth_patterns,
    path("", include("landing.urls", namespace="landing")),
]
