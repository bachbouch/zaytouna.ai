from django.db import migrations


# Evenly-spaced (22.6° gap) across the same -162° to +64° arc as before.
NEW_ANGLES = {
    "researcher":   -162.0,
    "builder":      -139.4,
    "philosopher":  -116.8,
    "sociologist":   -94.2,
    "linguist":      -71.6,
    "investor":      -49.0,
    "tester":        -26.4,
    "labeler":        -3.8,
    "economist":      18.8,
    "entrepreneur":   41.4,
    "government":     64.0,
}

PREVIOUS_ANGLES = {
    "researcher":   -162,
    "builder":      -136,
    "philosopher":  -110,
    "sociologist":   -98,
    "linguist":      -86,
    "investor":      -62,
    "tester":        -38,
    "labeler":       -14,
    "economist":      12,
    "entrepreneur":   38,
    "government":     64,
}


def update_angles(apps, schema_editor, source):
    Role = apps.get_model("landing", "Role")
    for slug, angle in source.items():
        Role.objects.filter(slug=slug).update(angle=angle)


def forwards(apps, schema_editor):
    update_angles(apps, schema_editor, NEW_ANGLES)


def backwards(apps, schema_editor):
    update_angles(apps, schema_editor, PREVIOUS_ANGLES)


class Migration(migrations.Migration):
    dependencies = [("landing", "0002_seed_roles_and_help_items")]
    operations = [migrations.RunPython(forwards, backwards)]
