from django.contrib.auth.tokens import PasswordResetTokenGenerator


class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    """Reuses PasswordResetTokenGenerator's HMAC machinery but hashes
    `is_active` instead of `last_login`, so the token is invalidated
    the moment the account becomes active (i.e. after the first use)."""

    def _make_hash_value(self, user, timestamp):
        return f"{user.pk}{timestamp}{user.is_active}{user.email}"


verification_token = EmailVerificationTokenGenerator()
