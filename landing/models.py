from django.conf import settings
from django.db import models


class Role(models.Model):
    """A way to belong — populated in seed migration and editable via admin."""
    slug = models.SlugField(unique=True, max_length=50)
    name_en = models.CharField(max_length=80)
    name_ar = models.CharField(max_length=80)
    desc_en = models.TextField()
    desc_ar = models.TextField()
    glyph = models.CharField(max_length=8, blank=True)
    angle = models.FloatField(default=0)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.slug


class HelpItem(models.Model):
    """Concrete actions a member can offer to help with."""
    slug = models.SlugField(unique=True, max_length=80)
    label_en = models.CharField(max_length=160)
    label_ar = models.CharField(max_length=160)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.slug


class Profile(models.Model):
    """Grove-specific data attached to an auth user."""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="grove_profile",
    )
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    other_role = models.CharField(max_length=80, blank=True)
    helps_with = models.ManyToManyField(HelpItem, blank=True)
    city = models.CharField(max_length=80, blank=True)
    bio = models.TextField(blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile<{self.user.email or self.user.username}>"
