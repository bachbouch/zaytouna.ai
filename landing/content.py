import math

# ── Role positions (lang-independent geometry) ───────────
_ROLE_GEOM = [
    ("researcher",   -162.0, "R"),
    ("builder",      -139.4, "B"),
    ("philosopher",  -116.8, "Φ"),
    ("sociologist",   -94.2, "Ψ"),
    ("linguist",      -71.6, "ل"),
    ("investor",      -49.0, "$"),
    ("tester",        -26.4, "✓"),
    ("labeler",        -3.8, "✎"),
    ("economist",      18.8, "Σ"),
    ("entrepreneur",   41.4, "▲"),
    ("government",     64.0, "★"),
]

def _positions():
    """Node + label geometry. Labels float radially outside the orbit so they
    don't overlap each other; text-anchor flows with the node's angle."""
    out = {}
    for rid, angle, glyph in _ROLE_GEOM:
        a = math.radians(angle)
        cos_a, sin_a = math.cos(a), math.sin(a)
        # Node (on the orbital ring)
        nx = cos_a * 290
        ny = sin_a * 260 - 60
        # Label (pushed further out radially)
        lx = cos_a * 410
        ly = sin_a * 350 - 60
        # Anchor: side labels read outward away from the centre
        if cos_a > 0.1:
            anchor = "start"; lx += 6
        elif cos_a < -0.1:
            anchor = "end";   lx -= 6
        else:
            anchor = "middle"
        # Vertical nudge: top-of-orbit labels lift further; bottom labels drop
        if sin_a < -0.85:
            ly -= 18
        elif sin_a < -0.5:
            ly -= 6
        elif sin_a > 0.85:
            ly += 24
        elif sin_a > 0.5:
            ly += 14
        else:
            ly += 4
        out[rid] = {
            "id": rid,
            "glyph": glyph,
            "x": round(nx, 1),
            "y": round(ny, 1),
            "label_x": round(lx, 1),
            "label_y": round(ly, 1),
            "text_anchor": anchor,
        }
    return out

ROLE_POS = _positions()
STATS = {"members": 342, "governorates": 14, "groups": 6}

# 24 Tunisian governorates (slug, English, Arabic)
GOVERNORATES = [
    ("tunis",        "Tunis",        "تونس"),
    ("ariana",       "Ariana",       "أريانة"),
    ("ben-arous",    "Ben Arous",    "بن عروس"),
    ("manouba",      "Manouba",      "منوبة"),
    ("nabeul",       "Nabeul",       "نابل"),
    ("zaghouan",     "Zaghouan",     "زغوان"),
    ("bizerte",      "Bizerte",      "بنزرت"),
    ("beja",         "Béja",         "باجة"),
    ("jendouba",     "Jendouba",     "جندوبة"),
    ("kef",          "Le Kef",       "الكاف"),
    ("siliana",      "Siliana",      "سليانة"),
    ("sousse",       "Sousse",       "سوسة"),
    ("monastir",     "Monastir",     "المنستير"),
    ("mahdia",       "Mahdia",       "المهدية"),
    ("sfax",         "Sfax",         "صفاقس"),
    ("kairouan",     "Kairouan",     "القيروان"),
    ("kasserine",    "Kasserine",    "القصرين"),
    ("sidi-bouzid",  "Sidi Bouzid",  "سيدي بوزيد"),
    ("gabes",        "Gabès",        "قابس"),
    ("medenine",     "Medenine",     "مدنين"),
    ("tataouine",    "Tataouine",    "تطاوين"),
    ("gafsa",        "Gafsa",        "قفصة"),
    ("tozeur",       "Tozeur",       "توزر"),
    ("kebili",       "Kebili",       "قبلي"),
]

def get_governorates(lang):
    return [
        {"slug": slug, "name": ar if lang == "ar-TN" else en}
        for slug, en, ar in GOVERNORATES
    ]

# ── Role labels per language ─────────────────────────────
ROLE_LABELS = {
    "en": {
        "researcher":   {"name": "Researcher",   "desc": "Architectures, scaling, evals. Publish openly. Train fearlessly."},
        "builder":      {"name": "Builder",      "desc": "Ship infra, APIs, products on top of Zaytouna foundations."},
        "philosopher":  {"name": "Philosopher",  "desc": "What does sovereign intelligence mean for a republic? Help us think."},
        "sociologist":  {"name": "Sociologist",  "desc": "Study how AI reshapes Tunisian society, labor, and community. Tell us what we miss."},
        "linguist":     {"name": "Linguist",     "desc": "Map the dialects. Annotate the corpora. Defend the verb."},
        "investor":     {"name": "Investor",     "desc": "Patient capital for a public good. Multi-decade horizon."},
        "tester":       {"name": "Tester",       "desc": "Break models in your own dialect. File the bugs we'd never find."},
        "labeler":      {"name": "Data Labeler", "desc": "Transcribe a podcast. Tag a street. Voice a sentence. Get paid."},
        "economist":    {"name": "Economist",    "desc": "Model the labor, productivity, sovereignty of an AI Tunisia."},
        "entrepreneur": {"name": "Entrepreneur", "desc": "Build companies on Zaytouna foundations. Ship, scale, hire, share what works."},
        "government":   {"name": "Government",   "desc": "Make Zaytouna a national asset. Procure, regulate, protect."},
    },
    "ar-TN": {
        "researcher":   {"name": "باحث",          "desc": "هندسة، تكبير، تقييم. انشر بصراحة. درّب بلا خوف."},
        "builder":      {"name": "مهندس",         "desc": "ابني بنية تحتية، واجهات، و منتجات فوق أساسات زيتونة."},
        "philosopher":  {"name": "فيلسوف",        "desc": "شنوّة معنى الذكاء السيادي لبلاد كاملة؟ عاوننا نفكّرو."},
        "sociologist":  {"name": "عالم اجتماع",   "desc": "ادرس كيفاش الذكاء الاصطناعي يبدّل المجتمع التونسي، الخدمة، و الناس. قول لينا اللي ناسينا."},
        "linguist":     {"name": "لغوي",          "desc": "ارسم خريطة اللهجات. وسّم المدوّنات. دافع على الكلمة."},
        "investor":     {"name": "مستثمر",        "desc": "فلوس صبورة لخير عام. أفق عقود، موش ربعيات."},
        "tester":       {"name": "مختبر",         "desc": "كسّر النماذج بلهجتك. اعطينا الأخطاء اللي ما نلقاوهمش."},
        "labeler":      {"name": "موسّم بيانات",   "desc": "انسخ بودكاست. وسّم زنقة. سجّل جملة. تتخلّص."},
        "economist":    {"name": "اقتصادي",       "desc": "نمذج العمل، الإنتاجية، و السيادة في تونس الذكاء."},
        "entrepreneur": {"name": "رائد أعمال",    "desc": "ابني شركات فوق أساسات زيتونة. اطلق، كبّر، شغّل، و شارك اللي يخدم."},
        "government":   {"name": "الحكومة",       "desc": "خلّي زيتونة أصل وطني. اشتري، نظّم، احمي."},
    },
}

# ── Member directory (names + cities shared, bios per-lang) ─
_MEMBERS_RAW = [
    ("Hela Ben Khalifa",   "researcher",  "Tunis",     "ML PhD, ENIT. Multilingual evals.",            "دكتورا في الذكاء الآلي، تقييمات متعددة اللغات."),
    ("Mehdi Chaabane",     "builder",     "Sfax",      "Ex-Instadeep. Infra & training stacks.",       "إنستاديب قبل. تدريب و بنية."),
    ("Nour Lakhal",        "linguist",    "Sousse",    "Dialectology. 7 dialect atlas contributor.",   "علم اللهجات. أطلس السبع لهجات."),
    ("Sami Trabelsi",      "philosopher", "Bizerte",   "Tech ethics, IHEC. On open futures.",          "أخلاقيات التقنية، إيهيك. مستقبل مفتوح."),
    ("Yasmine Gharbi",     "investor",    "Tunis",     "Patient-capital. Maghreb deep tech.",          "رأس مال صبور. تقنيات المغارب."),
    ("Karim Mejri",        "researcher",  "Tunis",     "ASR. Whisper for Darija fork.",                "تعرّف صوتي. فورك ويسبر للدارجة."),
    ("Amira Ben Ammar",    "labeler",     "Kairouan",  "Lead annotator, voice corpus.",                "موسّمة قائدة، مدوّنة الصوت."),
    ("Ahmed Saadaoui",     "economist",   "Tunis",     "Labor markets & automation.",                  "أسواق الخدمة و الأتمتة."),
    ("Leïla Hammami",      "entrepreneur","Tunis",     "Founder, Maghreb Telecom Group.",              "مؤسّسة، مجموعة المغارب للاتصالات."),
    ("Sondes Karoui",      "sociologist", "Tunis",     "Sociologist, ENS. Digital culture & labor.",   "عالمة اجتماع، إيناس. الثقافة الرقمية و الخدمة."),
    ("Fares Belhaj",       "government",  "Tunis",     "Director, MTNT digital strategy.",             "مدير الاستراتيجية الرقمية، وزارة الاتصالات."),
    ("Rim Khelifi",        "tester",      "Tataouine", "Field testing in southern dialects.",          "اختبار ميداني للهجات الجنوب."),
    ("Walid Bouzid",       "builder",     "Monastir",  "Open-source maintainer, geo-stack.",           "صيانة مفتوحة، بنية الخرائط."),
    ("Imen Souissi",       "researcher",  "Tunis",     "TTS prosody, Tunisian voices.",                "نبر الأصوات التونسية."),
    ("Tarek Jendoubi",     "linguist",    "Gabès",     "Berber/Amazigh corpora.",                      "مدوّنات أمازيغية."),
    ("Salma Dridi",        "philosopher", "Mahdia",    "Postdoc, AI & democracy.",                     "ما بعد الدكتورا، الذكاء و الديمقراطية."),
    ("Hatem Zouari",       "investor",    "Sfax",      "Seed across MENA. 12-yr horizon.",             "تمويل بذري، أفق 12 سنة."),
]

def _initials(name):
    parts = [p for p in name.split() if p]
    return "".join(p[0] for p in parts[:2]).upper()

def get_members(lang):
    labels = ROLE_LABELS[lang]
    out = []
    for name, role, city, bio_en, bio_ar in _MEMBERS_RAW:
        out.append({
            "name": name, "city": city, "role": role,
            "role_name": labels[role]["name"],
            "bio": bio_ar if lang == "ar-TN" else bio_en,
            "initials": _initials(name),
        })
    return out

def get_roles(lang):
    labels = ROLE_LABELS[lang]
    out = []
    for rid, _, _ in _ROLE_GEOM:
        out.append({**ROLE_POS[rid], **labels[rid]})
    return out

# ── Per-language text strings ────────────────────────────
TEXTS = {
    "en": {
        "html_lang": "en",
        "dir": "ltr",
        "switch_url": "/tn/",
        "switch_label": "بالدارجة",
        "login_label": "Sign in",
        "logout_label": "Sign out",
        "brand": {"name": "Zaytouna", "tag": "AI"},
        "meta": {
            "title": "Zaytouna AI — Rooted in Tunisia, reaching toward the future.",
            "description": "Foundational AI for Tunisia — Darija language models, sovereign speech, mapping, and data. A grassroots collective for digital sovereignty.",
        },
        "nav": {
            "philosophy": "Philosophy",
            "vision": "Vision",
            "grove": "The Grove",
            "join": "Join",
        },
        "hero": {
            "kicker": "Zaytouna AI · Tunis · est. 2026",
            "coord": "36.806°N · 10.181°E · TUNIS",
            "badge": "Founding chapter · 2026",
            "title": "Rooted in Tunisia, reaching toward the future.",
            "sub": "Foundational models for Tunisian Darija. Speech that hears us. Maps that know us. A grassroots collective for digital sovereignty.",
            "cta_primary": "Read the manifesto",
            "cta_secondary": "Find your branch →",
            "scroll_hint": "Scroll to read the manifesto",
            "stats_labels": {"members": "Members", "governorates": "Governorates", "groups": "Working groups"},
        },
        "manifesto": {
            "label": "Manifesto",
            "title": "Working in the open.",
            "of": "of",
            "items": [
                "We will not be a market for someone else's intelligence.",
                "We will train models that speak our Darija, read our maps, hold our memories — and answer to us.",
                "Sovereignty is a language, not a slogan. It is built sentence by sentence, dataset by dataset, voice by voice.",
                "We are not a startup. We are a volunteer collective.",
                "The olive tree is patient. So is the work.",
            ],
        },
        "vision": {
            "label": "Vision",
            "title": "Six branches. One trunk.",
            "pillars": [
                ("01", "Language Models",  "Foundation models pretrained on Tunisian Arabic, French, English — fluent in the trilingual reality of how we actually speak."),
                ("02", "Speech-to-Text",   "ASR that hears every accent of the country — from Bizerte to Tataouine, from formal Arabic to street Darija."),
                ("03", "Text-to-Speech",   "Voices in Tunisian Darija that sound like our mothers, our taxi drivers, our broadcasters. Not stilted. Not foreign."),
                ("04", "Mapping",          "Geo-data sovereignty. Streets, towns, landmarks indexed by us, hosted in-country, queryable by every civic builder."),
                ("05", "Communications",   "Email, social, real-time messaging — sovereign communication products so our conversations, identity, and data stay on Tunisian ground."),
                ("06", "Data Sovereignty", "Open weights, open data, open evals — accountable to a public, not a quarterly report. The grove belongs to the village."),
            ],
        },
        "roles": {
            "label": "Find your branch",
            "title": "Ten ways to belong.",
            "sub": "Every grove needs every kind of hand. Pick a branch — or a few.",
        },
        "grove": {
            "label": "The Grove",
            "title": "The grove, as of today.",
            "all": "All",
        },
        "cta": {
            "title_html": 'Plant something that <span class="emph">o</span>ut<span class="emph">live</span>s us.',
            "sub": "Open call. No résumé required. Just a willingness to show up.",
            "button": "Begin →",
        },
        "modal": {
            "join_as": "Join as",
            "name": "Name",
            "email": "Email",
            "city": "City / Governorate",
            "why": "Why this branch?",
            "submit": "Plant your name",
            "welcome": "Welcome to the grove.",
            "followup": "We will write back within seven days. Inshallah, sooner.",
        },
        "join_flow": {
            "step_label": "Step",
            "of_label": "of",
            "q1_eyebrow": "01 · You",
            "q1_title": "First, your name.",
            "q1_hint": "How should we address you?",
            "q1_first": "First name",
            "q1_last": "Last name",
            "q2_eyebrow": "02 · Branch",
            "q2_title": "What best describes you?",
            "q2_hint": "Pick the closest match — you can change it later.",
            "q2_other": "Other",
            "q2_other_placeholder": "Describe yourself in a few words",
            "q3_eyebrow": "03 · Help",
            "q3_title": "What can you help with?",
            "q3_hint": "Check anything that sounds like you. Pick as many as fit.",
            "q4_eyebrow": "04 · Account",
            "q4_title": "Create your account.",
            "q4_hint": "So you can log in later and pick up where you left off.",
            "q4_city": "City or governorate (optional)",
            "q4_email": "Email",
            "q4_password": "Password — at least 8 characters",
            "btn_continue": "Continue",
            "btn_back": "Back",
            "btn_submit": "Plant your name",
            "kbd_enter": "press Enter ↵",
            "success_title": "Check your email.",
            "success_body": "We sent a verification link to your inbox. Click it within 3 days to activate your account and join the grove.",
            "success_close": "Close",
            "err_required": "This field is required.",
            "err_email": "Enter a valid email address.",
            "err_password": "Password must be at least 8 characters.",
            "err_role": "Pick a branch — or write your own.",
            "err_server": "Something went wrong. Try again in a moment.",
        },
        "footer": {
            "address": "zaytouna.ai · Lac 2, Tunis",
            "rights":  "Open weights. Open data. Open future.",
            "copy":    "© 2026 — Zaytouna Foundation",
        },
        "community": {
            "talk_cta": "Talk to us on",
            "build_cta": "See the work on",
            "hint": "Until we self-host our own, talk to the grove on:",
            "telegram": "Telegram",
            "discord": "Discord",
            "huggingface": "Hugging Face",
        },
        "marquee": ["sovereignty", "darija", "open weights", "Tunisia", "collective", "the grove", "patience", "roots"],
    },

    "ar-TN": {
        "html_lang": "ar",
        "dir": "rtl",
        "switch_url": "/",
        "switch_label": "English",
        "login_label": "دخول",
        "logout_label": "خروج",
        "brand": {"name": "زيتونة", "tag": "AI"},
        "draft_banner": "هاذي نسخة سريعة بالدارجة — اقتراحاتك مرحب بيها.",
        "meta": {
            "title": "زيتونة — متجذرين في تونس",
            "description": "نماذج أساسية للدارجة التونسية، صوت، خرائط، و بيانات. تجمّع شعبي للسيادة الرقمية.",
        },
        "nav": {
            "philosophy": "فلسفة",
            "vision": "رؤية",
            "grove": "الغابة",
            "join": "انضم",
        },
        "hero": {
            "kicker": "زيتونة · تونس · 2026",
            "coord": "36.806°N · 10.181°E · تونس",
            "badge": "أوّل فصل · 2026",
            "title": "نبنيو مستقبل تونس بالتونسي.",
            "sub": "نماذج تحكي دارجتنا. صوت يسمعنا. خرائط تعرفنا. جماعة من الناس، للسيادة الرقمية متاعنا.",
            "cta_primary": "اقرى البيان",
            "cta_secondary": "← اختار غصنك",
            "scroll_hint": "زيد للأسفل باش تقرى البيان",
            "stats_labels": {"members": "أعضاء", "governorates": "ولايات", "groups": "فرق خدمة"},
        },
        "manifesto": {
            "label": "البيان",
            "title": "خدمة تشاركية بالشفافية.",
            "of": "من",
            "items": [
                "ما نقبلوش نكونو سوق لذكاء غيرنا.",
                "باش ندرّبو نماذج تحكي بدارجتنا، تقرى خرائطنا، تحفظ ذاكرتنا — و تجاوب علينا.",
                "السيادة فعل، موش شعار. تتبنى كلمة بكلمة، بيانات ببيانات، صوت بصوت.",
                "احنا موش ستارت-آب. احنا مجموعة متطوعة.",
                "شجرة الزيتون صبورة. و الخدمة كيف كيف.",
            ],
        },
        "vision": {
            "label": "الرؤية",
            "title": "ستة أغصان.\nجذع واحد.",
            "pillars": [
                ("01", "النماذج اللغوية",       "نماذج مدرّبة على الدارجة، الفرنسية، و الإنڨليزية — تفهم كيفاش نحكيو في الحقيقة."),
                ("02", "من الصوت للنص",         "نظام يفهم في كل لهجات البلاد — من بنزرت لتطاوين، من الفصحى لدارجة الزنقة."),
                ("03", "من النص للصوت",         "أصوات بالدارجة كيف أمّاتنا، سواقة التاكسي، و المذيعين. ما هيش متكلّفة. ما هيش غريبة."),
                ("04", "الخرائط",              "سيادة على البيانات الجغرافية. الشوارع، البلدان، المعالم — احنا اللي نوثقوها، مستضافة هوني، متاحة لكل من يبني."),
                ("05", "الاتصالات",            "إيمايل، شبكات اجتماعية، رسائل فورية — منتجات تواصل سيادية، باش الحديث متاعنا و معطياتنا يبقاو عندنا."),
                ("06", "السيادة على البيانات", "أوزان مفتوحة، بيانات مفتوحة، تقييم مفتوح — نحاسبو الناس، موش تقرير ربعي. الغابة متاع الناس."),
            ],
        },
        "roles": {
            "label": "اختار غصنك",
            "title": "عشرة طرق\nباش تكون معانا.",
            "sub": "كل غابة محتاجة كل يد. اختار غصن — ولا أكثر.",
        },
        "grove": {
            "label": "الغابة",
            "title": "الغابة،\nفي وقتنا هذا.",
            "all": "الكل",
        },
        "cta": {
            "title_html": 'ازرع <span class="emph">زيتونة</span> تكبر بعدنا.',
            "sub": "نداء مفتوح. ما تلزمش سيرة ذاتية. كان عندك خاطر تجي، اهلا بيك.",
            "button": "← يلا نبداو",
        },
        "modal": {
            "join_as": "انضم كـ",
            "name": "الاسم",
            "email": "البريد",
            "city": "المدينة / الولاية",
            "why": "علاش هذا الغصن بالذات؟",
            "submit": "ازرع اسمك",
            "welcome": "مرحبا بيك في الغابة.",
            "followup": "نجاوبوك في ظرف أسبوع. إن شاء الله قبل.",
        },
        "join_flow": {
            "step_label": "خطوة",
            "of_label": "من",
            "q1_eyebrow": "01 · أنت",
            "q1_title": "نبداو باسمك.",
            "q1_hint": "كيفاش نناديوك؟",
            "q1_first": "الاسم",
            "q1_last": "اللقب",
            "q2_eyebrow": "02 · الغصن",
            "q2_title": "أش يشبهك أكثر؟",
            "q2_hint": "اختار الأقرب — تنجم تبدّل بعد.",
            "q2_other": "غير ذلك",
            "q2_other_placeholder": "وصّف روحك في كلمات",
            "q3_eyebrow": "03 · المساعدة",
            "q3_title": "بأش تنجم تعاون؟",
            "q3_hint": "اختار كل اللي يشبهك. باش ما باش يكون عدد.",
            "q4_eyebrow": "04 · الحساب",
            "q4_title": "اعمل حسابك.",
            "q4_hint": "باش تنجم تدخل لاحقاً و تكمل من وين وقفت.",
            "q4_city": "المدينة أو الولاية (اختياري)",
            "q4_email": "البريد الإلكتروني",
            "q4_password": "كلمة السر — على الأقل 8 أحرف",
            "btn_continue": "كمّل",
            "btn_back": "رجوع",
            "btn_submit": "ازرع اسمك",
            "kbd_enter": "اضغط Enter ↵",
            "success_title": "شوف إيميلك.",
            "success_body": "بعثنالك لينك تثبيت في الإيميل. اضغط عليه قبل 3 أيام باش يتفعّل حسابك و تنضم للغابة.",
            "success_close": "غلق",
            "err_required": "هذا الحقل ضروري.",
            "err_email": "ادخل بريد إلكتروني صحيح.",
            "err_password": "كلمة السر لازم 8 أحرف على الأقل.",
            "err_role": "اختار غصن — ولا اكتب وصفك.",
            "err_server": "وقعت مشكلة. عاود من جديد.",
        },
        "footer": {
            "address": "zaytouna.ai · بحيرة 2، تونس",
            "rights":  "أوزان مفتوحة. بيانات مفتوحة. مستقبل مفتوح.",
            "copy":    "© 2026 — مؤسسة زيتونة",
        },
        "community": {
            "talk_cta": "تكلّم معانا في",
            "build_cta": "شوف الخدمة في",
            "hint": "حتى نستضيفوها بأنفسنا، نلقاو الناس في:",
            "telegram": "تيليجرام",
            "discord": "ديسكورد",
            "huggingface": "Hugging Face",
        },
        "marquee": ["سيادة", "دارجة", "أوزان مفتوحة", "تونس", "جماعة", "الغابة", "صبر", "جذور"],
    },
}
