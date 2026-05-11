import json
import re

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.http import JsonResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

from . import content
from .models import HelpItem, Profile, Role
from .tokens import verification_token


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
        ctx["governorates"] = content.get_governorates(self.lang)
        return ctx


class HomeDarijaView(HomeView):
    lang = "ar-TN"


def _lang_field(request, default="en"):
    lang = request.GET.get("lang", default)
    return "ar-TN" if lang == "ar-TN" else "en"


class RolesAPI(View):
    """List roles for the join form (and any future selector)."""

    def get(self, request):
        lang = _lang_field(request)
        roles = Role.objects.filter(is_active=True)
        data = [
            {
                "slug": r.slug,
                "glyph": r.glyph,
                "name": r.name_ar if lang == "ar-TN" else r.name_en,
                "desc": r.desc_ar if lang == "ar-TN" else r.desc_en,
            }
            for r in roles
        ]
        return JsonResponse({"roles": data})


class HelpItemsAPI(View):
    """List help-with options for the join form."""

    def get(self, request):
        lang = _lang_field(request)
        items = HelpItem.objects.filter(is_active=True)
        data = [
            {
                "slug": h.slug,
                "label": h.label_ar if lang == "ar-TN" else h.label_en,
            }
            for h in items
        ]
        return JsonResponse({"items": data})


def _send_verification_email(request, user, first_name):
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = verification_token.make_token(user)
    path = reverse("landing:verify_email", kwargs={"uidb64": uidb64, "token": token})
    base = getattr(settings, "SITE_URL", "") or request.build_absolute_uri("/").rstrip("/")
    verify_url = f"{base}{path}"

    ctx = {"first_name": first_name, "verify_url": verify_url}
    subject = "Verify your Zaytouna account"
    text_body = render_to_string("landing/email/verify_account.txt", ctx)
    html_body = render_to_string("landing/email/verify_account.html", ctx)

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    msg.attach_alternative(html_body, "text/html")
    msg.send(fail_silently=False)


@method_decorator(csrf_exempt, name="dispatch")
class JoinAPI(View):
    """Create a Django user + grove Profile + send a verification email.
    The user starts with is_active=False until they click the verification link."""

    EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

    def post(self, request):
        try:
            payload = json.loads(request.body or b"{}")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)

        first = (payload.get("first_name") or "").strip()
        last = (payload.get("last_name") or "").strip()
        email = (payload.get("email") or "").strip().lower()
        password = payload.get("password") or ""
        role_slug = (payload.get("role") or "").strip()
        other_role = (payload.get("other_role") or "").strip()
        help_slugs = payload.get("helps_with") or []
        city = (payload.get("city") or "").strip()

        if not first or not last:
            return JsonResponse({"error": "First and last name are required."}, status=400)
        if not self.EMAIL_RE.match(email):
            return JsonResponse({"error": "A valid email is required."}, status=400)
        if len(password) < 8:
            return JsonResponse({"error": "Password must be at least 8 characters."}, status=400)

        User = get_user_model()
        if User.objects.filter(email__iexact=email).exists() or User.objects.filter(username=email).exists():
            return JsonResponse(
                {"error": "An account with this email already exists.", "code": "email_taken"},
                status=409,
            )

        role = None
        if role_slug and role_slug != "other":
            role = Role.objects.filter(slug=role_slug, is_active=True).first()

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first[:30],
            last_name=last[:150],
        )
        user.is_active = False
        user.save(update_fields=["is_active"])

        profile = Profile.objects.create(
            user=user,
            role=role,
            other_role=other_role[:80] if (role_slug == "other" or role is None) else "",
            city=city,
        )
        if isinstance(help_slugs, list) and help_slugs:
            profile.helps_with.set(
                HelpItem.objects.filter(slug__in=help_slugs, is_active=True)
            )

        _send_verification_email(request, user, first)

        return JsonResponse(
            {
                "ok": True,
                "name": f"{first} {last}",
                "email": email,
                "verification_sent": True,
            }
        )


class VerifyEmailView(View):
    """Activates an account if the token is valid + unused."""

    def get(self, request, uidb64, token):
        User = get_user_model()
        first_name = ""
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return render(request, "landing/verified.html",
                          {"ok": False, "reason": "Link invalid"}, status=400)

        if user.is_active:
            # already verified — show a friendly success state anyway
            return render(request, "landing/verified.html",
                          {"ok": True, "first_name": user.first_name})

        if not verification_token.check_token(user, token):
            return render(request, "landing/verified.html",
                          {"ok": False, "reason": "Link expired or invalid"}, status=400)

        user.is_active = True
        user.save(update_fields=["is_active"])
        first_name = user.first_name
        return render(request, "landing/verified.html",
                      {"ok": True, "first_name": first_name})
