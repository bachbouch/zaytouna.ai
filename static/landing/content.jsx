// content.jsx — trilingual content + data for Zaytuna AI
// Exposes window.ZContent

const ZContent = {
  meta: {
    domain: "zaytuna.ai",
    location: { en: "Tunis, Tunisia", ar: "تونس، تونس", fr: "Tunis, Tunisie" },
  },

  nav: {
    philosophy: { en: "Philosophy", ar: "الفلسفة", fr: "Philosophie" },
    vision: { en: "Vision", ar: "الرؤية", fr: "Vision" },
    grove: { en: "The Grove", ar: "الغابة", fr: "Le Bosquet" },
    join: { en: "Join", ar: "انضم", fr: "Rejoindre" },
  },

  hero: {
    kicker: {
      en: "Zaytuna AI · Tunis · est. 2026",
      ar: "زيتونة للذكاء الاصطناعي · تونس · ٢٠٢٦",
      fr: "Zaytuna AI · Tunis · fondée en 2026",
    },
    // 3 headline variants for tweaks
    headlines: {
      rooted: {
        en: "Rooted in Tunisia,\nreaching toward the future.",
        ar: "متجذرون في تونس،\nنمتدّ نحو المستقبل.",
        fr: "Enracinés en Tunisie,\ntendus vers l'avenir.",
      },
      build: {
        en: "We are building\nTunisia's AI.",
        ar: "نحن نبني\nالذكاء الاصطناعي التونسي.",
        fr: "Nous construisons\nl'IA de la Tunisie.",
      },
      darija: {
        en: "We're not waiting.\nWe're building it ourselves.",
        ar: "ما نستناوش حدّ.\nنبنيوها بأيدينا.",
        fr: "On n'attend personne.\nOn la construit nous-mêmes.",
      },
    },
    sub: {
      en: "Foundational models for Tunisian Darija. Speech that hears us. Maps that know us. A grassroots movement for digital sovereignty.",
      ar: "نماذج أساسية للدارجة التونسية. صوت يفهمنا. خرائط تعرفنا. حركة شعبية من أجل السيادة الرقمية.",
      fr: "Des modèles fondationnels pour le darija tunisien. Une parole qui nous entend. Des cartes qui nous connaissent. Un mouvement citoyen pour la souveraineté numérique.",
    },
    cta_primary: { en: "Read the manifesto", ar: "اقرأ البيان", fr: "Lire le manifeste" },
    cta_secondary: { en: "Find your branch", ar: "اعثر على غصنك", fr: "Trouve ta branche" },
  },

  manifesto: {
    label: { en: "Manifesto", ar: "البيان", fr: "Manifeste" },
    title: {
      en: "A grove is not a factory.",
      ar: "الغابة ليست مصنعًا.",
      fr: "Un bosquet n'est pas une usine.",
    },
    body: [
      {
        en: "We will not be a market for someone else's intelligence.",
        ar: "لن نكون سوقًا لذكاء غيرنا.",
        fr: "Nous ne serons pas le marché pour l'intelligence d'autrui.",
      },
      {
        en: "We will train models that speak our Darija, read our maps, hold our memories — and answer to us.",
        ar: "سندرّب نماذج تتكلّم دارجتنا، تقرأ خرائطنا، تحفظ ذاكرتنا — وتُحاسَب أمامنا.",
        fr: "Nous entraînerons des modèles qui parlent notre darija, lisent nos cartes, portent notre mémoire — et nous rendent des comptes.",
      },
      {
        en: "Sovereignty is a language, not a slogan. It is built sentence by sentence, dataset by dataset, voice by voice.",
        ar: "السيادة لغة، لا شعار. تُبنى جملةً جملة، بيانات بيانات، صوتًا صوتًا.",
        fr: "La souveraineté est une langue, pas un slogan. Elle se construit phrase après phrase, jeu de données après jeu de données, voix après voix.",
      },
      {
        en: "We are not a startup. We are a movement — researchers and grandmothers, students and ministers, engineers and poets.",
        ar: "نحن لسنا شركة ناشئة. نحن حركة — باحثون وجدّات، طلبة ووزراء، مهندسون وشعراء.",
        fr: "Nous ne sommes pas une startup. Nous sommes un mouvement — chercheurs et grands-mères, étudiants et ministres, ingénieurs et poètes.",
      },
      {
        en: "The olive tree is patient. So is the work.",
        ar: "شجرة الزيتون صبورة. والعمل كذلك.",
        fr: "L'olivier est patient. Le travail aussi.",
      },
    ],
  },

  vision: {
    label: { en: "Vision", ar: "الرؤية", fr: "Vision" },
    title: {
      en: "Six branches.\nOne canopy.",
      ar: "ستة أغصان.\nظلٌّ واحد.",
      fr: "Six branches.\nUne seule canopée.",
    },
    pillars: [
      {
        n: "01",
        name: { en: "Language Models", ar: "النماذج اللغوية", fr: "Modèles de langue" },
        desc: {
          en: "Foundation models pretrained on Tunisian Arabic, French, English — fluent in the trilingual reality of how we actually speak.",
          ar: "نماذج أساسية مدرّبة على العربية التونسية والفرنسية والإنجليزية — تتقن واقعنا اللغوي الثلاثي.",
          fr: "Modèles fondationnels pré-entraînés sur l'arabe tunisien, le français, l'anglais — fluides dans la réalité trilingue qui est la nôtre.",
        },
      },
      {
        n: "02",
        name: { en: "Speech-to-Text", ar: "تحويل الصوت إلى نص", fr: "Parole vers texte" },
        desc: {
          en: "ASR that hears every accent of the country — from Bizerte to Tataouine, from formal Arabic to street Darija.",
          ar: "نظام تعرّف على الصوت يفهم كل لهجات البلاد — من بنزرت إلى تطاوين، من الفصحى إلى دارجة الشارع.",
          fr: "Reconnaissance vocale qui entend tous les accents — de Bizerte à Tataouine, de l'arabe classique au darija de la rue.",
        },
      },
      {
        n: "03",
        name: { en: "Text-to-Speech", ar: "تحويل النص إلى صوت", fr: "Texte vers parole" },
        desc: {
          en: "Voices in Tunisian Darija that sound like our mothers, our taxi drivers, our broadcasters. Not stilted. Not foreign.",
          ar: "أصوات بالدارجة التونسية تشبه أمّهاتنا، سائقي التاكسي، المذيعين. لا متكلّفة، لا غريبة.",
          fr: "Des voix en darija tunisien qui sonnent comme nos mères, nos chauffeurs de taxi, nos présentateurs. Ni guindées, ni étrangères.",
        },
      },
      {
        n: "04",
        name: { en: "Mapping", ar: "الخرائط", fr: "Cartographie" },
        desc: {
          en: "Geo-data sovereignty. Streets, towns, landmarks indexed by us, hosted in-country, queryable by every civic builder.",
          ar: "سيادة الجغرافيا. شوارع وقرى ومعالم نوثّقها بأنفسنا، مستضافة في البلاد، متاحة لكل بانٍ مدني.",
          fr: "Souveraineté géo-spatiale. Rues, villes, lieux indexés par nous, hébergés sur place, accessibles à tout bâtisseur civique.",
        },
      },
      {
        n: "05",
        name: { en: "Communications", ar: "الاتصالات", fr: "Communications" },
        desc: {
          en: "Translation, transcription, captioning — Tunisia in conversation with itself, and on its own terms with the world.",
          ar: "ترجمة ونسخ وعَنونة — تونس تتحاور مع نفسها، وتخاطب العالم بشروطها.",
          fr: "Traduction, transcription, sous-titrage — la Tunisie en dialogue avec elle-même, et avec le monde selon ses propres termes.",
        },
      },
      {
        n: "06",
        name: { en: "Data Sovereignty", ar: "السيادة على البيانات", fr: "Souveraineté des données" },
        desc: {
          en: "Open weights, open data, open evals — accountable to a public, not a quarterly report. The grove belongs to the village.",
          ar: "أوزان مفتوحة، بيانات مفتوحة، تقييم مفتوح — مساءلة أمام الناس، لا أمام تقرير ربعي. الغابة ملك القرية.",
          fr: "Poids ouverts, données ouvertes, évaluations ouvertes — redevables au public, pas à un rapport trimestriel. Le bosquet appartient au village.",
        },
      },
    ],
  },

  roles: {
    label: { en: "Find your branch", ar: "اعثر على غصنك", fr: "Trouve ta branche" },
    title: {
      en: "Ten ways\nto belong.",
      ar: "عشر طرقٍ\nللانتماء.",
      fr: "Dix façons\nd'appartenir.",
    },
    sub: {
      en: "Every grove needs every kind of hand. Pick a branch — or a few.",
      ar: "كل غابة تحتاج إلى كل يد. اختر غصنًا — أو أكثر.",
      fr: "Chaque bosquet a besoin de toutes les mains. Choisis une branche — ou plusieurs.",
    },
    items: [
      { id: "researcher", name: { en: "Researcher", ar: "باحث/ة", fr: "Chercheur·se" }, glyph: "R",
        desc: { en: "Architectures, scaling, evals. Publish openly. Train fearlessly.",
                ar: "بُنى، توسيع، تقييم. انشر بصراحة. درّب بلا خوف.",
                fr: "Architectures, scaling, évaluations. Publier ouvertement. Entraîner sans peur." } },
      { id: "builder", name: { en: "Builder", ar: "مهندس/ة", fr: "Bâtisseur·se" }, glyph: "B",
        desc: { en: "Ship infra, APIs, products on top of Zaytuna foundations.",
                ar: "ابنِ بنية تحتية وواجهات ومنتجات فوق أساسات زيتونة.",
                fr: "Livrer infra, API, produits au-dessus des fondations Zaytuna." } },
      { id: "philosopher", name: { en: "Philosopher", ar: "فيلسوف/ة", fr: "Philosophe" }, glyph: "Φ",
        desc: { en: "What does sovereign intelligence mean for a republic? Help us think.",
                ar: "ما معنى الذكاء السيادي لجمهورية؟ ساعدنا على التفكير.",
                fr: "Que signifie l'intelligence souveraine pour une république ? Aide-nous à penser." } },
      { id: "linguist", name: { en: "Linguist", ar: "لغوي/ة", fr: "Linguiste" }, glyph: "ل",
        desc: { en: "Map the dialects. Annotate the corpora. Defend the verb.",
                ar: "ارسم خرائط اللهجات. علِّق على المدوّنات. دافع عن الفعل.",
                fr: "Cartographier les dialectes. Annoter les corpus. Défendre le verbe." } },
      { id: "investor", name: { en: "Investor", ar: "مستثمر/ة", fr: "Investisseur·se" }, glyph: "$",
        desc: { en: "Patient capital for a public good. Multi-decade horizon.",
                ar: "رأس مال صبور لخير عام. أفق عقود.",
                fr: "Capital patient pour un bien public. Horizon de plusieurs décennies." } },
      { id: "tester", name: { en: "Tester", ar: "مختبر/ة", fr: "Testeur·se" }, glyph: "✓",
        desc: { en: "Break models in your own dialect. File the bugs we'd never find.",
                ar: "اكسر النماذج بلهجتك. سجّل الأخطاء التي لن نكتشفها.",
                fr: "Casser les modèles dans ton dialecte. Déposer les bugs qu'on ne trouverait jamais." } },
      { id: "labeler", name: { en: "Data Labeler", ar: "موسوم/ة بيانات", fr: "Annotateur·rice" }, glyph: "✎",
        desc: { en: "Transcribe a podcast. Tag a street. Voice a sentence. Get paid.",
                ar: "انسخ بودكاست. وسِّم شارعًا. سجّل جملة. تحصّل على أجرك.",
                fr: "Transcrire un podcast. Tagger une rue. Prêter sa voix. Être rémunéré·e." } },
      { id: "economist", name: { en: "Economist", ar: "اقتصادي/ة", fr: "Économiste" }, glyph: "Σ",
        desc: { en: "Model the labor, productivity, sovereignty of an AI Tunisia.",
                ar: "نمذج العمل، الإنتاجية، سيادة تونس الذكية.",
                fr: "Modéliser travail, productivité, souveraineté d'une Tunisie IA." } },
      { id: "private", name: { en: "Private Sector", ar: "القطاع الخاص", fr: "Secteur privé" }, glyph: "◉",
        desc: { en: "Adopt early. Pilot in production. Share what works.",
                ar: "تبنَّ مبكرًا. جرّب في الإنتاج. شارك ما ينجح.",
                fr: "Adopter tôt. Piloter en production. Partager ce qui marche." } },
      { id: "government", name: { en: "Government", ar: "الحكومة", fr: "Gouvernement" }, glyph: "★",
        desc: { en: "Make Zaytuna a national asset. Procure, regulate, protect.",
                ar: "اجعل زيتونة أصلًا وطنيًا. اشترِ، نظّم، احمِ.",
                fr: "Faire de Zaytuna un actif national. Acheter, réguler, protéger." } },
    ],
  },

  grove: {
    label: { en: "The Grove", ar: "الغابة", fr: "Le Bosquet" },
    title: {
      en: "The grove,\nas of today.",
      ar: "الغابة،\nاليوم.",
      fr: "Le bosquet,\naujourd'hui.",
    },
    sub: {
      en: "342 members. 14 governorates. 6 working groups. Day one.",
      ar: "٣٤٢ عضوًا. ١٤ ولاية. ٦ مجموعات عمل. اليوم الأول.",
      fr: "342 membres. 14 gouvernorats. 6 groupes de travail. Jour un.",
    },
    members: [
      { name: "Hela Ben Khalifa", role: "researcher", city: "Tunis", bio: { en: "ML PhD, ENIT. Multilingual evals.", ar: "دكتوراه تعلّم آلي، التقييمات متعدّدة اللغات.", fr: "Doctorat ML, ENIT. Évals multilingues." } },
      { name: "Mehdi Chaabane", role: "builder", city: "Sfax", bio: { en: "Ex-Instadeep. Infra & training stacks.", ar: "إنستاديب سابقًا. بنى تدريب.", fr: "Ex-Instadeep. Stacks d'entraînement." } },
      { name: "Nour Lakhal", role: "linguist", city: "Sousse", bio: { en: "Dialectology. 7 dialect atlas contributor.", ar: "علم اللهجات. أطلس سبع لهجات.", fr: "Dialectologie. Atlas des 7 parlers." } },
      { name: "Sami Trabelsi", role: "philosopher", city: "Bizerte", bio: { en: "Tech ethics, IHEC. On open futures.", ar: "أخلاقيات التقنية، إيهيك.", fr: "Éthique tech, IHEC. Futurs ouverts." } },
      { name: "Yasmine Gharbi", role: "investor", city: "Tunis", bio: { en: "Patient-capital. Maghreb deep tech.", ar: "رأس مال صبور. تقنيات المغارب.", fr: "Capital patient. Deep tech maghrébine." } },
      { name: "Karim Mejri", role: "researcher", city: "Tunis", bio: { en: "ASR. Whisper for Darija fork.", ar: "تعرّف صوتي. ويسبر-دارجة.", fr: "ASR. Fork Whisper-Darija." } },
      { name: "Amira Ben Ammar", role: "labeler", city: "Kairouan", bio: { en: "Lead annotator, voice corpus.", ar: "موسومة قائدة، مدوّنة الصوت.", fr: "Annotatrice principale, corpus voix." } },
      { name: "Ahmed Saadaoui", role: "economist", city: "Tunis", bio: { en: "Labor markets & automation.", ar: "أسواق العمل والأتمتة.", fr: "Marchés du travail et automatisation." } },
      { name: "Leïla Hammami", role: "private", city: "Tunis", bio: { en: "CTO, Maghreb Telecom Group.", ar: "م. تقنية، مجموعة المغارب للاتصالات.", fr: "CTO, Maghreb Telecom Group." } },
      { name: "Fares Belhaj", role: "government", city: "Tunis", bio: { en: "Director, MTNT digital strategy.", ar: "مدير الاستراتيجية الرقمية، وزارة الاتصالات.", fr: "Directeur, stratégie numérique MTNT." } },
      { name: "Rim Khelifi", role: "tester", city: "Tataouine", bio: { en: "Field testing in southern dialects.", ar: "اختبار ميداني للهجات الجنوب.", fr: "Tests terrain, parlers du sud." } },
      { name: "Walid Bouzid", role: "builder", city: "Monastir", bio: { en: "Open-source maintainer, geo-stack.", ar: "صيانة مفتوحة، بنية الخرائط.", fr: "Mainteneur open-source, geo-stack." } },
      { name: "Imen Souissi", role: "researcher", city: "Tunis", bio: { en: "TTS prosody, Tunisian voices.", ar: "نبر الأصوات التونسية.", fr: "Prosodie TTS, voix tunisiennes." } },
      { name: "Tarek Jendoubi", role: "linguist", city: "Gabès", bio: { en: "Berber/Amazigh corpora.", ar: "مدوّنات أمازيغية.", fr: "Corpus berbères/amazighs." } },
      { name: "Salma Dridi", role: "philosopher", city: "Mahdia", bio: { en: "Postdoc, AI & democracy.", ar: "ما بعد الدكتوراه، الذكاء والديمقراطية.", fr: "Postdoc, IA et démocratie." } },
      { name: "Hatem Zouari", role: "investor", city: "Sfax", bio: { en: "Seed across MENA. 12-yr horizon.", ar: "تمويل بذري، أفق ١٢ سنة.", fr: "Seed MENA, horizon 12 ans." } },
    ],
  },

  cta: {
    title: {
      en: "Plant something\nthat outlives us.",
      ar: "ازرع شيئًا\nيبقى بعدنا.",
      fr: "Planter quelque chose\nqui nous survivra.",
    },
    sub: {
      en: "Open call. No résumé required. Just a willingness to show up.",
      ar: "نداء مفتوح. لا سيرة ذاتية مطلوبة. فقط الاستعداد للحضور.",
      fr: "Appel ouvert. Pas de CV requis. Juste la volonté d'être présent·e.",
    },
    button: { en: "Begin →", ar: "ابدأ ←", fr: "Commencer →" },
  },

  modal: {
    title_prefix: { en: "Join as", ar: "انضم كـ", fr: "Rejoindre en tant que" },
    name: { en: "Name", ar: "الاسم", fr: "Nom" },
    email: { en: "Email", ar: "البريد", fr: "Email" },
    city: { en: "City / Governorate", ar: "المدينة / الولاية", fr: "Ville / Gouvernorat" },
    why: { en: "Why this branch?", ar: "لماذا هذا الغصن؟", fr: "Pourquoi cette branche ?" },
    submit: { en: "Plant your name", ar: "ازرع اسمك", fr: "Planter ton nom" },
    submitted_t: { en: "Welcome to the grove.", ar: "أهلًا بك في الغابة.", fr: "Bienvenue dans le bosquet." },
    submitted_b: { en: "We will write back within seven days. Inshallah, sooner.", ar: "سنردّ خلال سبعة أيام. إن شاء الله، أقرب.", fr: "Nous répondrons sous sept jours. Inch'Allah, plus vite." },
    close: { en: "Close", ar: "إغلاق", fr: "Fermer" },
  },

  footer: {
    address: { en: "Lac 2, Tunis", ar: "البحيرة ٢، تونس", fr: "Lac 2, Tunis" },
    rights: {
      en: "Open weights. Open data. Open future.",
      ar: "أوزان مفتوحة. بيانات مفتوحة. مستقبل مفتوح.",
      fr: "Poids ouverts. Données ouvertes. Avenir ouvert.",
    },
  },
};

window.ZContent = ZContent;
