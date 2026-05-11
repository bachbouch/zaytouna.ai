import math

# ── Role positions (lang-independent geometry) ───────────
_ROLE_GEOM = [
    ("researcher",   -162, "R"),
    ("builder",      -136, "B"),
    ("philosopher",  -110, "Φ"),
    ("sociologist",   -98, "Ψ"),
    ("linguist",      -86, "ل"),
    ("investor",      -62, "$"),
    ("tester",        -38, "✓"),
    ("labeler",       -14, "✎"),
    ("economist",      12, "Σ"),
    ("entrepreneur",   38, "▲"),
    ("government",     64, "★"),
]

def _positions():
    out = {}
    for rid, angle, glyph in _ROLE_GEOM:
        a = math.radians(angle)
        out[rid] = {
            "id": rid,
            "glyph": glyph,
            "x": round(math.cos(a) * 290, 1),
            "y": round(math.sin(a) * 260 - 60, 1),
        }
    return out

ROLE_POS = _positions()
STATS = {"members": 342, "governorates": 14, "groups": 6}

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
        "footer": {
            "address": "zaytouna.ai · Lac 2, Tunis",
            "rights":  "Open weights. Open data. Open future.",
            "copy":    "© 2026 — Zaytouna Foundation",
        },
        "marquee": ["sovereignty", "darija", "open weights", "Tunisia", "collective", "the grove", "patience", "roots"],
    },

    "ar-TN": {
        "html_lang": "ar",
        "dir": "rtl",
        "switch_url": "/",
        "switch_label": "English",
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
        "footer": {
            "address": "zaytouna.ai · بحيرة 2، تونس",
            "rights":  "أوزان مفتوحة. بيانات مفتوحة. مستقبل مفتوح.",
            "copy":    "© 2026 — مؤسسة زيتونة",
        },
        "marquee": ["سيادة", "دارجة", "أوزان مفتوحة", "تونس", "جماعة", "الغابة", "صبر", "جذور"],
    },
}
