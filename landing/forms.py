from django import forms
from django.contrib.auth.forms import AuthenticationForm


class EmailAuthenticationForm(AuthenticationForm):
    """Login with email (stored as `username` in our User model)."""

    username = forms.EmailField(
        label="Email",
        widget=forms.EmailInput(
            attrs={"autocomplete": "email", "autofocus": True, "placeholder": ""}
        ),
    )
    error_messages = {
        **AuthenticationForm.error_messages,
        "invalid_login": "Email and password don't match. Try again.",
        "inactive": "Your account isn't verified yet — check your email for the activation link.",
    }
