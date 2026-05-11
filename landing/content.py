import math

MANIFESTO = [
    "We will not be a market for someone else's intelligence.",
    "We will train models that speak our Darija, read our maps, hold our memories — and answer to us.",
    "Sovereignty is a language, not a slogan. It is built sentence by sentence, dataset by dataset, voice by voice.",
    "We are not a startup. We are a collective.",
    "The olive tree is patient. So is the work.",
]

PILLARS = [
    {
        "n": "01",
        "name": "Language Models",
        "desc": "Foundation models pretrained on Tunisian Arabic, French, English — fluent in the trilingual reality of how we actually speak.",
    },
    {
        "n": "02",
        "name": "Speech-to-Text",
        "desc": "ASR that hears every accent of the country — from Bizerte to Tataouine, from formal Arabic to street Darija.",
    },
    {
        "n": "03",
        "name": "Text-to-Speech",
        "desc": "Voices in Tunisian Darija that sound like our mothers, our taxi drivers, our broadcasters. Not stilted. Not foreign.",
    },
    {
        "n": "04",
        "name": "Mapping",
        "desc": "Geo-data sovereignty. Streets, towns, landmarks indexed by us, hosted in-country, queryable by every civic builder.",
    },
    {
        "n": "05",
        "name": "Communications",
        "desc": "Translation, transcription, captioning — Tunisia in conversation with itself, and on its own terms with the world.",
    },
    {
        "n": "06",
        "name": "Data Sovereignty",
        "desc": "Open weights, open data, open evals — accountable to a public, not a quarterly report. The grove belongs to the village.",
    },
]

_ROLE_ANGLES = [-162, -136, -110, -86, -62, -38, -14, 12, 38, 64]

_ROLES_RAW = [
    ("researcher", "Researcher", "R", "Architectures, scaling, evals. Publish openly. Train fearlessly."),
    ("builder", "Builder", "B", "Ship infra, APIs, products on top of Zaytouna foundations."),
    ("philosopher", "Philosopher", "Φ", "What does sovereign intelligence mean for a republic? Help us think."),
    ("linguist", "Linguist", "ل", "Map the dialects. Annotate the corpora. Defend the verb."),
    ("investor", "Investor", "$", "Patient capital for a public good. Multi-decade horizon."),
    ("tester", "Tester", "✓", "Break models in your own dialect. File the bugs we'd never find."),
    ("labeler", "Data Labeler", "✎", "Transcribe a podcast. Tag a street. Voice a sentence. Get paid."),
    ("economist", "Economist", "Σ", "Model the labor, productivity, sovereignty of an AI Tunisia."),
    ("private", "Private Sector", "◉", "Adopt early. Pilot in production. Share what works."),
    ("government", "Government", "★", "Make Zaytouna a national asset. Procure, regulate, protect."),
]

def _role_positions():
    out = []
    for i, (rid, name, glyph, desc) in enumerate(_ROLES_RAW):
        a = math.radians(_ROLE_ANGLES[i])
        x = math.cos(a) * 290
        y = math.sin(a) * 260 - 60
        out.append({"id": rid, "name": name, "glyph": glyph, "desc": desc, "x": round(x, 1), "y": round(y, 1)})
    return out

ROLES = _role_positions()

MEMBERS = [
    {"name": "Hela Ben Khalifa", "role": "researcher", "city": "Tunis", "bio": "ML PhD, ENIT. Multilingual evals."},
    {"name": "Mehdi Chaabane", "role": "builder", "city": "Sfax", "bio": "Ex-Instadeep. Infra & training stacks."},
    {"name": "Nour Lakhal", "role": "linguist", "city": "Sousse", "bio": "Dialectology. 7 dialect atlas contributor."},
    {"name": "Sami Trabelsi", "role": "philosopher", "city": "Bizerte", "bio": "Tech ethics, IHEC. On open futures."},
    {"name": "Yasmine Gharbi", "role": "investor", "city": "Tunis", "bio": "Patient-capital. Maghreb deep tech."},
    {"name": "Karim Mejri", "role": "researcher", "city": "Tunis", "bio": "ASR. Whisper for Darija fork."},
    {"name": "Amira Ben Ammar", "role": "labeler", "city": "Kairouan", "bio": "Lead annotator, voice corpus."},
    {"name": "Ahmed Saadaoui", "role": "economist", "city": "Tunis", "bio": "Labor markets & automation."},
    {"name": "Leïla Hammami", "role": "private", "city": "Tunis", "bio": "CTO, Maghreb Telecom Group."},
    {"name": "Fares Belhaj", "role": "government", "city": "Tunis", "bio": "Director, MTNT digital strategy."},
    {"name": "Rim Khelifi", "role": "tester", "city": "Tataouine", "bio": "Field testing in southern dialects."},
    {"name": "Walid Bouzid", "role": "builder", "city": "Monastir", "bio": "Open-source maintainer, geo-stack."},
    {"name": "Imen Souissi", "role": "researcher", "city": "Tunis", "bio": "TTS prosody, Tunisian voices."},
    {"name": "Tarek Jendoubi", "role": "linguist", "city": "Gabès", "bio": "Berber/Amazigh corpora."},
    {"name": "Salma Dridi", "role": "philosopher", "city": "Mahdia", "bio": "Postdoc, AI & democracy."},
    {"name": "Hatem Zouari", "role": "investor", "city": "Sfax", "bio": "Seed across MENA. 12-yr horizon."},
]

MARQUEE_WORDS = ["sovereignty", "darija", "open weights", "Tunisia", "collective", "the grove", "patience", "roots"]

def _member_initials(name):
    parts = [p for p in name.split() if p]
    return "".join(p[0] for p in parts[:2]).upper()

for m in MEMBERS:
    m["initials"] = _member_initials(m["name"])

ROLE_NAME_BY_ID = {r["id"]: r["name"] for r in ROLES}
for m in MEMBERS:
    m["role_name"] = ROLE_NAME_BY_ID.get(m["role"], m["role"])

STATS = {
    "members": 342,
    "governorates": 14,
    "groups": 6,
}
