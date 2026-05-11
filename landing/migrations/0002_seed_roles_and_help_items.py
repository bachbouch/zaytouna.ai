from django.db import migrations


# Match the layout in landing.content.ROLE_GEOM / ROLE_LABELS
SEED_ROLES = [
    ("researcher",   -162, "R", "Researcher",     "باحث",
     "Architectures, scaling, evals. Publish openly. Train fearlessly.",
     "هندسة، تكبير، تقييم. انشر بصراحة. درّب بلا خوف."),
    ("builder",      -136, "B", "Builder",        "مهندس",
     "Ship infra, APIs, products on top of Zaytouna foundations.",
     "ابني بنية تحتية، واجهات، و منتجات فوق أساسات زيتونة."),
    ("philosopher",  -110, "Φ", "Philosopher",    "فيلسوف",
     "What does sovereign intelligence mean for a republic? Help us think.",
     "شنوّة معنى الذكاء السيادي لبلاد كاملة؟ عاوننا نفكّرو."),
    ("sociologist",  -98,  "Ψ", "Sociologist",    "عالم اجتماع",
     "Study how AI reshapes Tunisian society, labor, and community. Tell us what we miss.",
     "ادرس كيفاش الذكاء الاصطناعي يبدّل المجتمع التونسي، الخدمة، و الناس. قول لينا اللي ناسينا."),
    ("linguist",     -86,  "ل", "Linguist",       "لغوي",
     "Map the dialects. Annotate the corpora. Defend the verb.",
     "ارسم خريطة اللهجات. وسّم المدوّنات. دافع على الكلمة."),
    ("investor",     -62,  "$", "Investor",       "مستثمر",
     "Patient capital for a public good. Multi-decade horizon.",
     "فلوس صبورة لخير عام. أفق عقود، موش ربعيات."),
    ("tester",       -38,  "✓", "Tester",         "مختبر",
     "Break models in your own dialect. File the bugs we'd never find.",
     "كسّر النماذج بلهجتك. اعطينا الأخطاء اللي ما نلقاوهمش."),
    ("labeler",      -14,  "✎", "Data Labeler",   "موسّم بيانات",
     "Transcribe a podcast. Tag a street. Voice a sentence. Get paid.",
     "انسخ بودكاست. وسّم زنقة. سجّل جملة. تتخلّص."),
    ("economist",     12,  "Σ", "Economist",      "اقتصادي",
     "Model the labor, productivity, sovereignty of an AI Tunisia.",
     "نمذج العمل، الإنتاجية، و السيادة في تونس الذكاء."),
    ("entrepreneur",  38,  "▲", "Entrepreneur",   "رائد أعمال",
     "Build companies on Zaytouna foundations. Ship, scale, hire, share what works.",
     "ابني شركات فوق أساسات زيتونة. اطلق، كبّر، شغّل، و شارك اللي يخدم."),
    ("government",    64,  "★", "Government",     "الحكومة",
     "Make Zaytouna a national asset. Procure, regulate, protect.",
     "خلّي زيتونة أصل وطني. اشتري، نظّم، احمي."),
]

SEED_HELP_ITEMS = [
    ("contribute_data",      "Contribute datasets or historical archives",
                              "أعطي بيانات أو أرشيف تاريخي"),
    ("annotate_voice",       "Annotate or record voice samples",
                              "وسّم أو سجّل عيّنات صوتية"),
    ("test_dialect",         "Test models in your own dialect",
                              "جرّب النماذج بلهجتك"),
    ("translate_docs",       "Translate documentation into Darija or French",
                              "ترجم الوثائق للدارجة أو الفرنسية"),
    ("write_code",           "Write code, ship features, fix bugs",
                              "اكتب كود، ضيف خصائص، صلّح أخطاء"),
    ("research_publish",     "Publish research, share evaluations",
                              "انشر بحوث، شارك تقييمات"),
    ("donate_compute",       "Donate compute or hosting",
                              "تبرّع بالحوسبة أو الاستضافة"),
    ("connect_network",      "Open doors — intros, partnerships, networks",
                              "افتح أبواب — معارف، شراكات، شبكات"),
    ("organize_events",      "Help organise meetups or workshops",
                              "نظّم لقاءات أو ورشات"),
    ("amplify_message",      "Amplify the message — talks, articles, social",
                              "وصّل الرسالة — محاضرات، مقالات، شبكات"),
    ("fund",                 "Fund the work",
                              "موّل الخدمة"),
    ("just_show_up",         "Just show up — I'll figure out where I fit",
                              "ندخل في الموضوع — نلقى بلاصتي"),
]


def seed(apps, schema_editor):
    Role = apps.get_model("landing", "Role")
    HelpItem = apps.get_model("landing", "HelpItem")

    for order, (slug, angle, glyph, name_en, name_ar, desc_en, desc_ar) in enumerate(SEED_ROLES):
        Role.objects.update_or_create(
            slug=slug,
            defaults=dict(
                name_en=name_en, name_ar=name_ar,
                desc_en=desc_en, desc_ar=desc_ar,
                glyph=glyph, angle=angle, order=order, is_active=True,
            ),
        )

    for order, (slug, label_en, label_ar) in enumerate(SEED_HELP_ITEMS):
        HelpItem.objects.update_or_create(
            slug=slug,
            defaults=dict(
                label_en=label_en, label_ar=label_ar,
                order=order, is_active=True,
            ),
        )


def unseed(apps, schema_editor):
    apps.get_model("landing", "Role").objects.all().delete()
    apps.get_model("landing", "HelpItem").objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [("landing", "0001_initial")]
    operations = [migrations.RunPython(seed, unseed)]
