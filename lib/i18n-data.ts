export type Language = 'en' | 'ar';

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // Navigation & Branding
  siteName: { en: "Arabia Khaleej", ar: "عربية خليج" },
  siteTagline: { en: "The GCC Standard", ar: "المعيار الخليجي" },
  pressTerminal: { en: "Insights", ar: "رؤى" },
  officialUpdates: { en: "Official Editorials", ar: "افتتاحيات رسمية" },
  insightsDesc: { en: "Original editorial insights and deep dives", ar: "تحليلات ورؤى تحريرية أصلية" },
  siteSlogan: { en: "The definitive reference for a refined GCC experience.", ar: "المرجع النهائي لتجربة خليجية متميزة." },
  prayerTimes: { en: "Prayer Times", ar: "مواقيت الصلاة" },
  fajr: { en: "Fajr", ar: "الفجر" },
  sunrise: { en: "Sunrise", ar: "الشروق" },
  dhuhr: { en: "Dhuhr", ar: "الظهر" },
  asr: { en: "Asr", ar: "العصر" },
  maghrib: { en: "Maghrib", ar: "المغرب" },
  isha: { en: "Isha", ar: "العشاء" },
  scheduleFor: { en: "Prayer Schedule for", ar: "جدول الصلاة لـ" },
  active: { en: "Active", ar: "الآن" },
  welcomeSectionTitle: { en: "Welcome to Arabia Khaleej: Your Definitive GCC Intelligence Portal", ar: "مرحباً بكم في عربية خليج: بوابتكم النهائية للاستخبارات الخليجية" },
  welcomeSectionBody: { 
    en: "Arabia Khaleej stands at the intersection of tradition and transformation, serving as a premium independent reference for a refined GCC experience. In an era of rapid digital evolution and shifting global dynamics, the Gulf Cooperation Council (GCC) member states—Qatar, Saudi Arabia, the United Arab Emirates, Kuwait, Oman, and Bahrain—are defining the future of urban excellence, sustainable energy, and international diplomacy. Our platform is dedicated to capturing this unique regional essence through high-fidelity data, expert insights, and essential utilities designed for the modern executive and the engaged citizen alike.\n\nFrom the high-tech skylines of Doha and Dubai to the spiritual heart of Makkah and the natural majesty of Muscat, Arabia Khaleej provides a unified digital window into the pulse of the Gulf. We recognize that regional accuracy is not just about numbers; it is about context, culture, and precision. Whether you are tracking real-time market movements on the Tadawul, seeking the precise calculation of prayer times using the Umm Al-Qura method, or exploring the strategic national visions shaping the next century, our project offers a noise-free, elite environment for informed decision-making.\n\nOur commitment to regional intelligence extends beyond mere aggregation. We simplify complex datasets to surface what matters most, ensuring that residents and visitors can navigate the GCC with confidence and sophistication. At Arabia Khaleej, we believe that the Gulf's story is one of unprecedented ambition and cultural resilience. Through our editorial deep dives and real-time dashboards, we aim to be the bridge that connects official authoritative data with meaningful human insight, fostering a deeper global and local understanding of the most dynamic region on earth.", 
    ar: "تقف عربية خليج عند ملتقى التقاليد والتحول، وتعمل كمرجع مستقل متميز لتجربة خليجية راقية. في عصر التطور الرقمي السريع والديناميكيات العالمية المتغيرة، تحدد الدول الأعضاء في مجلس التعاون الخليجي - قطر والمملكة العربية السعودية والإمارات العربية المتحدة والكويت وعمان والبحرين - مستقبل التميز الحضري والطاقة المستدامة والدبلوماسية الدولية. منصتنا مكرسة لالتقاط هذا الجوهر الإقليمي الفريد من خلال بيانات عالية الدقة ورؤى الخبراء والأدوات الأساسية المصممة للمسؤولين الحديثين والمواطنين المتفاعلين على حد سواء.\n\nمن آفاق الدوحة ودبي عالية التقنية إلى القلب الروحي لمكة المكرمة والعظمة الطبيعية لمسقط، توفر عربية خليج نافذة رقمية موحدة لنبض الخليج. نحن ندرك أن الدقة الإقليمية لا تتعلق فقط بالأرقام؛ بل تتعلق بالسياق والثقافة والدقة. سواء كنت تتبع تحركات السوق في الوقت الفعلي على تداول، أو تبحث عن الحساب الدقيق لمواقيت الصلاة باستخدام طريقة أم القرى، أو تستكشف الرؤى الوطنية الاستراتيجية التي تشكل القرن القادم، فإن مشروعنا يوفر بيئة نخبوية خالية من الضوضاء لاتخاذ قرارات مدروسة.\n\nيمتد التزامنا بالاستخبارات الإقليمية إلى ما هو أبعد من مجرد التجميع. نحن نبسط مجموعات البيانات المعقدة لإظهار ما يهم أكثر، مما يضمن أن المقيمين والزوار يمكنهم التنقل في دول مجلس التعاون الخليجي بثقة ورقياً. في عربية خليج، نؤمن بأن قصة الخليج هي قصة طموح غير مسبوق وصمود ثقافي. من خلال تعمقنا التحريري ولوحات المعلومات في الوقت الفعلي، نهدف إلى أن نكون الجسر الذي يربط البيانات الرسمية الموثوقة بالرؤية البشرية الهادفة، مما يعزز فهماً عالمياً ومحلياً أعمق لأكثر المناطق ديناميكية على وجه الأرض." 
  },
  calculationMethod: { en: "Calculation Method: Umm Al-Qura University, Makkah", ar: "طريقة الحساب: جامعة أم القرى، مكة المكرمة" },
  viewHijri: { en: "View Hijri Calendar", ar: "عرض التقويم الهجري" },
  marketSummary: { en: "Comprehensive real-time GCC market intelligence. We track major indices across the Gulf Cooperation Council, including Tadawul, ADX, DFM, and Boursa Kuwait, alongside commodities like Gold and Brent Crude, and all regional currencies pegged to the USD.", ar: "استخبارات شاملة للسوق الخليجية في الوقت الفعلي. نحن نتتبع المؤشرات الرئيسية عبر دول مجلس التعاون الخليجي، بما في ذلك تداول وسوق أبوظبي وسوق دبي المالي وبورصة الكويت، إلى جانب السلع مثل الذهب وخام برنت، وجميع العملات الإقليمية المرتبطة بالدولار." },
  stockMarkets: { en: "Stock Markets", ar: "أسواق الأسهم" },
  marketsOpen: { en: "Markets Open", ar: "الأسواق مفتوحة" },
  marketsClosed: { en: "Markets Closed", ar: "الأسواق مغلقة" },
  gold: { en: "Gold", ar: "الذهب" },
  brentCrude: { en: "Brent Crude", ar: "خام برنت" },
  commodities: { en: "Commodities", ar: "السلع" },
  currencies: { en: "Currencies", ar: "العملات" },
  peggedStatus: { en: "Most GCC Currencies are strictly pegged to the US Dollar to ensure economic stability and facilitate international trade within the energy sector.", ar: "ترتبط معظم العملات الخليجية ارتباطاً وثيقاً بالدولار الأمريكي لضمان الاستقرار الاقتصادي وتسهيل التجارة الدولية داخل قطاع الطاقة." },
  marketInsights: { en: "Market Insights", ar: "رؤى السوق" },
  insightsIntroTitle: { en: "Regional Intelligence & Editorial Deep Dives", ar: "الاستخبارات الإقليمية والتعمق التحريري" },
  insightsIntroBody: { 
    en: "The Arabia Khaleej Insights terminal serves as a high-fidelity editorial hub for authoritative perspectives on the Gulf Cooperation Council's rapid transformation. In a landscape often dominated by rapid headlines, our mission is to provide depth, context, and clarity through specialized deep dives into the economic, social, and cultural pillars of the GCC member states. From analyzing the unprecedented scale of Saudi Arabia's mega-projects to exploring the sophisticated diplomatic maneuvers of Qatar and the technological frontiers being pushed by the UAE, our insights are designed for those who seek to understand the underlying currents shaping the region.\n\nOur editorial strategy focuses on regional sovereignty and intellectual independence. We believe that the GCC's story is best told through a lens that respects local nuances while maintaining a global perspective. Whether it is an investigation into the multi-billion dollar renewable energy investments in Oman, the financial innovation occurring in Bahrain's FinTech ecosystem, or the cultural resilience demonstrated by Kuwait's vibrant civic life, our articles are crafted to surface the most meaningful value for our audience.\n\nEach 'Insight' on this platform is more than just a report; it is an invitation to engage with the GCC's future. We leverage a mix of authoritative data and expert analysis to ensure that every editorial piece meets the highest standards of regional intelligence. As the Gulf continues to establish itself as a global center for excellence, Arabia Khaleej remains dedicated to being the definitive reference for those who demand precision and high-fidelity storytelling in their pursuit of knowledge regarding the Arabian Peninsula.", 
    ar: "تعمل محطة رؤى عربية خليج كمركز تحريري عالي الدقة لوجهات النظر الموثوقة حول التحول السريع لدول مجلس التعاون الخليجي. في مشهد تهيمن عليه العناوين السريعة غالباً، مهمتنا هي توفير العمق والسياق والوضوح من خلال تعمق متخصص في الركائز الاقتصادية والاجتماعية والثقافية للدول الأعضاء في مجلس التعاون الخليجي. من تحليل الحجم غير المسبوق للمشاريع السعودية العملاقة إلى استكشاف المناورات الدبلوماسية المتطورة لقطر والآفاق التكنولوجية التي تدفعها الإمارات، تم تصميم رؤانا لأولئك الذين يسعون لفهم التيارات الأساسية التي تشكل المنطقة.\n\nتركز استراتيجيتنا التحريرية على السيادة الإقليمية والاستقلال الفكري. نحن نؤمن بأن قصة دول مجلس التعاون الخليجي يتم سردها بشكل أفضل من خلال عدسة تحترم الفروق الدقيقة المحلية مع الحفاظ على منظور عالمي. سواء كان ذلك تحقيقاً في استثمارات الطاقة المتجددة بمليارات الدولارات في عمان، أو الابتكار المالي الذي يحدث في نظام التكنولوجيا المالية في البحرين، أو الصمود الثقافي الذي تظهره الحياة المدنية الحيوية في الكويت، فإن مقالاتنا مصممة لإظهار القيمة الأكثر أهمية لجمهورنا.\n\nكل 'رؤية' على هذه المنصة هي أكثر من مجرد تقرير؛ إنها دعوة للتفاعل مع مستقبل دول مجلس التعاون الخليجي. نحن نستخدم مزيجاً من البيانات الموثوقة وتحليلات الخبراء لضمان أن كل قطعة تحريرية تلبي أعلى معايير الاستخبارات الإقليمية. ومع استمرار الخليج في ترسيخ مكانته كمركز عالمي للتميز، تظل عربية خليج مكرسة لتكون المرجع النهائي لأولئك الذين يطلبون الدقة ورواية القصص عالية الدقة في سعيهم للمعرفة فيما يتعلق بشبه الجزيرة العربية." 
  },
  boutiqueEnquiry: { en: "Enquire", ar: "استفسار" },
  prayerDetailTitle: { en: "Authoritative Spiritual Precision: The Umm Al-Qura Method", ar: "الدقة الروحية الموثوقة: طريقة أم القرى" },
  prayerDetailBody: { 
    en: "At Arabia Khaleej, we understand that precision in prayer timing is a fundamental requirement for the GCC community. Our platform provides daily schedules for Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha calculated according to the Umm Al-Qura University (Makkah) method. This is the official calculation standard recognized by the Kingdom of Saudi Arabia and widely respected across the Gulf Cooperation Council for its alignment with astronomical data and religious standards.\n\nEach city in our regional database—from the coastal landscapes of Doha and Dubai to the central highlands of Riyadh—has its timings meticulously processed to account for geographical coordinates, altitude, and seasonal variations. The Umm Al-Qura method uses a fixed 90-minute interval between Maghrib and Isha (120 minutes during Ramadan in some regions), ensuring a consistent and reliable schedule for spiritual observance.\n\nOur systems are engineered for high-fidelity performance, refreshing data every minute to account for real-time astronomical shifts. By providing this authoritative context alongside our live schedules, we aim to offer more than just a utility; we provide a trusted reference that respects the deep-rooted spiritual traditions of the Arabian Peninsula. Whether you are at home, traveling within the GCC, or planning your day around your religious obligations, Arabia Khaleej ensures you have the most accurate and authoritative spiritual intelligence at your fingertips.", 
    ar: "في عربية خليج، ندرك أن الدقة في مواقيت الصلاة هي مطلب أساسي للمجتمع الخليجي. توفر منصتنا جداول يومية للفجر والشروق والظهر والعصر والمغرب والعشاء محسوبة وفقاً لطريقة جامعة أم القرى (مكة المكرمة). هذا هو معيار الحساب الرسمي المعترف به في المملكة العربية السعودية ويحظى باحترام واسع في دول مجلس التعاون الخليجي لمواءمته مع البيانات الفلكية والمعايير الدينية.\n\nكل مدينة في قاعدتنا الإقليمية - من المناظر الطبيعية الساحلية للدوحة ودبي إلى المرتفعات المركزية في الرياض - تتم معالجة توقيتاتها بدقة لمراعاة الإحداثيات الجغرافية والارتفاع والتباينات الموسمية. تستخدم طريقة أم القرى فاصلاً زمنياً ثابتاً مدته 90 دقيقة بين المغرب والعشاء (120 دقيقة خلال شهر رمضان في بعض المناطق)، مما يضمن جدولاً متسقاً وموثوقاً للشعائر الروحية.\n\nتم هندسة أنظمتنا للحصول على أداء عالٍ، حيث يتم تحديث البيانات كل دقيقة لمراعاة التحولات الفلكية في الوقت الفعلي. من خلال توفير هذا السياق الموثوق إلى جانب جداولنا الحية، نهدف إلى تقديم أكثر من مجرد أداة؛ نحن نقدم مرجعاً موثوقاً يحترم التقاليد الروحية الراسخة في شبه الجزيرة العربية. سواء كنت في المنزل، أو مسافراً داخل دول مجلس التعاون الخليجي، أو تخطط ليومك بناءً على التزاماتك الدينية، تضمن لك عربية خليج الحصول على أدق وأكثر الاستخبارات الروحية موثوقية في متناول يدك." 
  },
  prayerDesc: { en: "Local & regional Islamic prayer schedules for major GCC cities, calculated with high precision using the Umm Al-Qura University method.", ar: "جداول الصلاة الإسلامية المحلية والإقليمية للمدن الخليجية الكبرى، محسوبة بدقة عالية باستخدام طريقة جامعة أم القرى." },
  marketDesc: { en: "Real-time updates on Stocks, Gold, Crude Oil & GCC Currencies for executive decision making.", ar: "تحديثات في الوقت الفعلي للأسهم والذهب والنفط الخام والعملات الخليجية لاتخاذ القرارات التنفيذية." },
  boutiqueDesc: { en: "Direct professional channel for all institutional and individual enquiries.", ar: "قناة احترافية مباشرة لجميع الاستفسارات المؤسسية والفردية." },
  countries: { en: "Countries", ar: "الدول" },

  // Short Nav (Mobile)
  navMarket: { en: "Market", ar: "السوق" },
  navInsights: { en: "Insights", ar: "رؤى" },
  navPrayer: { en: "Prayer", ar: "الصلاة" },
  navJoin: { en: "Join", ar: "انضم" },

  marketOverview: { en: "Market Overview", ar: "نظرة عامة على السوق" },
  marketSentiment: { en: "Market Sentiment", ar: "نبض السوق" },
  viewDetails: { en: "View Details", ar: "عرض التفاصيل" },
  gccFinanceCurrency: { en: "GCC Finance & Currency", ar: "المالية والعملات الخليجية" },
  updatedLabel: { en: "Last updated: %s", ar: "آخر تحديث: %s" },
  indicativeData: { en: "Indicative Data", ar: "بيانات استرشادية" },
  marketsLive: { en: "Live", ar: "مباشر" },
  closedSession: { en: "Closed", ar: "مغلق" },
  sentimentTitle: { en: "The regional landscape remains stable with positive indicators.", ar: "لا يزال المشهد الإقليمي مستقراً مع مؤشرات إيجابية." },
  sentimentDesc: { en: "Arabia Khaleej tracks real-time market sentiment across major GCC exchanges for executive precision.", ar: "عربية خليج تتتبع نبض السوق الفوري عبر البورصات الخليجية الرئيسية لدقة التنفيذيين." },
  passionProject: { en: "The Official Independent Reference for GCC Intelligence", ar: "المرجع المستقل الرسمي للاستخبارات الخليجية" },

  // Countries
  qatar: { en: "Qatar", ar: "قطر" },
  uae: { en: "United Arab Emirates", ar: "الإمارات" },
  saudiArabia: { en: "Saudi Arabia", ar: "السعودية" },
  kuwait: { en: "Kuwait", ar: "الكويت" },
  oman: { en: "Oman", ar: "عمان" },
  bahrain: { en: "Bahrain", ar: "البحرين" },
  doha: { en: "Doha", ar: "الدوحة" },
  dubai: { en: "Dubai", ar: "دبي" },
  riyadh: { en: "Riyadh", ar: "الرياض" },
  kuwaitCity: { en: "Kuwait City", ar: "مدينة الكويت" },
  muscat: { en: "Muscat", ar: "مسقط" },
  manama: { en: "Manama", ar: "المنامة" },

  // Country Guides
  regionalGuides: { en: "Regional Guides", ar: "أدلة إقليمية" },
  guideDesc: { en: "High-Fidelity Regional Intelligence", ar: "استخبارات إقليمية عالية الدقة" },
  population: { en: "Population", ar: "السكان" },
  capital: { en: "Capital", ar: "العاصمة" },
  currency: { en: "Currency", ar: "العملة" },
  language: { en: "Official Language", ar: "اللغة الرسمية" },
  economy: { en: "Economy", ar: "الاقتصاد" },
  vision: { en: "National Vision", ar: "الرؤية الوطنية" },
  
  saudiIntro: { 
    en: "The Kingdom of Saudi Arabia stands as the largest economy in the Middle East and North Africa, serving as the spiritual heart of the Islamic world and a pivotal member of the G20. Under the ambitious leadership of Vision 2030, the Kingdom is undergoing a historic structural transformation. This shift is designed to diversify the national economy away from oil dependency, fostering growth in technology, renewable energy, and world-class tourism. As the world's leading oil exporter, Saudi Arabia is leveraging its energy wealth to build futuristic mega-cities and create a vibrant society that balances deep-rooted traditions with modern innovation.", 
    ar: "تقف المملكة العربية السعودية كأكبر اقتصاد في الشرق الأوسط وشمال أفريقيا، وتعمل كقلب روحي للعالم الإسلامي وعضو محوري في مجموعة العشرين. تحت القيادة الطموحة لرؤية 2030، تشهد المملكة تحولاً هيكلياً تاريخياً. تم تصميم هذا التحول لتنويع الاقتصاد الوطني بعيداً عن الاعتماد على النفط، وتعزيز النمو في التكنولوجيا والطاقة المتجددة والسياحة العالمية. وباعتبارها أكبر مصدر للنفط في العالم، تستفيد المملكة العربية السعودية من ثروتها من الطاقة لبناء مدن عملاقة مستقبلية وخلق مجتمع حيوي يوازن بين التقاليد الراسخة والابتكار الحديث." 
  },
  uaeIntro: { 
    en: "The United Arab Emirates is a globally recognized hub for innovation, international trade, and luxury tourism. Comprising seven distinct emirates—Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah—the nation has established itself as a pioneer in technological advancement, space exploration, and sustainable energy. By fostering a pro-business environment and world-class logistics infrastructure, the UAE serves as a critical bridge between East and West, attracting global talent and investment while maintaining a steadfast commitment to regional stability and cultural tolerance.", 
    ar: "دولة الإمارات العربية المتحدة هي مركز معترف به عالمياً للابتكار والتجارة الدولية والسياحة الفاخرة. وتضم سبع إمارات متميزة - أبو ظبي، دبي، الشارقة، عجمان، أم القيوين، رأس الخيمة، والفجيرة - وقد أثبتت الدولة نفسها كرائدة في التقدم التكنولوجي واستكشاف الفضاء والطاقة المستدامة. من خلال تعزيز بيئة مواتية للأعمال وبنية تحتية لوجستية عالمية المستوى، تعمل الإمارات كجسر حيوي بين الشرق والغرب، وتجذب المواهب والاستثمارات العالمية مع الحفاظ على التزام راسخ بالاستقرار الإقليمي والتسامح الثقافي." 
  },
  qatarIntro: { 
    en: "Qatar is a high-income sovereign state and a world-leading exporter of Liquefied Natural Gas (LNG), possessing one of the highest GDPs per capita globally. Known for its sophisticated international diplomacy, high-fidelity infrastructure, and rich sports heritage, Qatar continues to define the standards of modern luxury and cultural excellence. From the futuristic skyline of Doha to the historic Al Zubarah Fort, the nation blends rapid modernization with a deep respect for its maritime legacy, establishing itself as a global destination for education, research, and major international events.", 
    ar: "قطر هي دولة ذات سيادة عالية الدخل ومصدر رائد عالمياً للغاز الطبيعي المسال (LNG)، وتمتلك واحداً من أعلى مستويات الناتج المحلي الإجمالي للفرد عالمياً. تشتهر قطر بدبلوماسيتها الدولية المتطورة، وبنيتها التحتية عالية الدقة، وتراثها الرياضي الغني، وتستمر في تحديد معايير الرفاهية الحديثة والتميز الثقافي. من أفق الدوحة المستقبلي إلى قلعة الزبارة التاريخية، تمزج الدولة بين التحديث السريع والاحترام العميق لإرثها البحري، مما يثبت مكانتها كوجهة عالمية للتعليم والبحث والأحداث الدولية الكبرى." 
  },
  kuwaitIntro: { 
    en: "Kuwait maintains a unique and prestigious position within the GCC, characterized by its rich parliamentary history, significant oil reserves, and a deeply rooted cultural identity. As one of the world's leading oil producers, Kuwait has leveraged its natural wealth to build a robust sovereign wealth fund and a high-standard public welfare system. The nation is currently focused on its 'New Kuwait 2035' vision, which aims to transform the country into a financial and commercial hub. With a vibrant media landscape and a tradition of active civic engagement, Kuwait remains a cornerstone of regional stability and a key player in international humanitarian efforts.", 
    ar: "تحافظ الكويت على مكانة فريدة ومرموقة داخل مجلس التعاون الخليجي، وتتميز بتاريخها البرلماني الغني، واحتياطياتها النفطية الكبيرة، وهويتها الثقافية العميقة. وباعتبارها واحدة من الشركات الرائدة في إنتاج النفط في العالم، استفادت الكويت من ثروتها الطبيعية لبناء صندوق ثروة سيادي قوي ونظام رفاهية عام عالي المستوى. تركز الدولة حالياً على رؤية 'كويت جديدة 2035'، التي تهدف إلى تحويل البلاد إلى مركز مالي وتجاري. ومع مشهد إعلامي حيوي وتقليد من المشاركة المدنية النشطة، تظل الكويت حجر الزاوية في الاستقرار الإقليمي ولاعباً رئيسياً في الجهود الإنسانية الدولية." 
  },
  omanIntro: { 
    en: "Oman is a land of incredible natural beauty, ancient history, and deep-rooted traditions. Located at the southeastern tip of the Arabian Peninsula, its strategic position at the mouth of the Persian Gulf has made it a vital maritime hub for centuries. Under 'Oman Vision 2040', the Sultanate is pursuing a path of sustainable development and economic diversification, focusing on tourism, logistics, and fisheries. Known for its balanced and independent foreign policy, Oman serves as a beacon of peace and a critical mediator in regional diplomacy. From the rugged peaks of the Al Hajar Mountains to the pristine beaches of Dhofar, Oman offers a unique blend of heritage and modern progress.", 
    ar: "عمان هي أرض الجمال الطبيعي المذهل والتاريخ القديم والتقاليد الراسخة. تقع في الطرف الجنوبي الشرقي لشبه الجزيرة العربية، وقد جعلها موقعها الاستراتيجي عند مدخل الخليج العربي مركزاً بحرياً حيوياً لقرون. تحت 'رؤية عمان 2040'، تتبع السلطنة مساراً للتنمية المستدامة والتنويع الاقتصادي، مع التركيز على السياحة والخدمات اللوجستية والسمكية. تشتهر عمان بسياساتها الخارجية المتوازنة والمستقلة، وهي بمثابة منارة للسلام ووسيط حاسم في الدبلوماسية الإقليمية. من القمم الوعرة لجبال الحجر إلى الشواطئ البكر في ظفار، تقدم عمان مزيجاً فريداً من التراث والتقدم الحديث." 
  },
  bahrainIntro: { 
    en: "Bahrain is a dynamic island nation with a rich history of trade, pearling, and financial innovation. As the first GCC nation to discover oil and subsequently the first to move toward a diversified economy, it has established itself as a global leader in Islamic finance and FinTech. Comprising 33 islands, Bahrain offers a cosmopolitan environment that blends ancient archaeological sites—like the Dilmun Burial Mounds—with a modern, high-fidelity financial harbour. Through 'Economic Vision 2030', the Kingdom is committed to building a competitive, sustainable, and fair economy that empowers its citizens and attracts international businesses seeking a strategic gateway to the broader Gulf market.", 
    ar: "البحرين هي دولة جزرية ديناميكية ذات تاريخ غني في التجارة والغوص بحثاً عن اللؤلؤ والابتكار المالي. وباعتبارها أول دولة خليجية تكتشف النفط، ومن ثم الأولى التي تتحرك نحو اقتصاد متنوع، فقد أثبتت نفسها كرائدة عالمية في التمويل الإسلامي والتكنولوجيا المالية. تضم البحرين 33 جزيرة، وتقدم بيئة عالمية تمزج بين المواقع الأثرية القديمة - مثل مدافن دلمون - مع مرفأ مالي حديث عالي الدقة. من خلال 'الرؤية الاقتصادية 2030'، تلتزم المملكة ببناء اقتصاد تنافسي ومستدام وعادل يمكّن مواطنيها ويجذب الشركات الدولية التي تبحث عن بوابة استراتيجية لسوق الخليج الأوسع." 
  },

  // Country Stats values
  saudiPop: { en: "36.4 Million", ar: "36.4 مليون" },
  uaePop: { en: "9.9 Million", ar: "9.9 مليون" },
  qatarPop: { en: "2.9 Million", ar: "2.9 مليون" },
  kuwaitPop: { en: "4.3 Million", ar: "4.3 مليون" },
  omanPop: { en: "5.2 Million", ar: "5.2 مليون" },
  bahrainPop: { en: "1.5 Million", ar: "1.5 مليون" },

  saudiGdp: { en: "$1.1 Trillion (Nominal)", ar: "1.1 تريليون دولار (اسمي)" },
  uaeGdp: { en: "$507 Billion", ar: "507 مليار دولار" },
  qatarGdp: { en: "$237 Billion", ar: "237 مليار دولار" },
  kuwaitGdp: { en: "$184 Billion", ar: "184 مليار دولار" },
  omanGdp: { en: "$104 Billion", ar: "104 مليار دولار" },
  bahrainGdp: { en: "$44 Billion", ar: "44 مليار دولار" },

  saudiCurrencyName: { en: "Saudi Riyal (SAR)", ar: "ريال سعودي (SAR)" },
  uaeCurrencyName: { en: "UAE Dirham (AED)", ar: "درهم إماراتي (AED)" },
  qatarCurrencyName: { en: "Qatari Riyal (QAR)", ar: "ريال قطري (QAR)" },
  kuwaitCurrencyName: { en: "Kuwaiti Dinar (KWD)", ar: "دينار كويتي (KWD)" },
  omanCurrencyName: { en: "Omani Rial (OMR)", ar: "ريال عماني (OMR)" },
  bahrainCurrencyName: { en: "Bahraini Dinar (BHD)", ar: "دينار بحريني (BHD)" },

  // Dedicated Currency Names
  uaeDirham: { en: "UAE Dirham", ar: "درهم إماراتي" },
  saudiRiyal: { en: "Saudi Riyal", ar: "ريال سعودي" },
  qatariRiyal: { en: "Qatari Riyal", ar: "ريال قطري" },
  kuwaitiDinar: { en: "Kuwaiti Dinar", ar: "دينار كويتي" },
  omaniRial: { en: "Omani Rial", ar: "ريال عماني" },
  bahrainiDinar: { en: "Bahraini Dinar", ar: "دينار بحريني" },

  saudiVision: { en: "Vision 2030", ar: "رؤية 2030" },
  uaeVision: { en: "UAE Centennial 2071", ar: "مئوية الإمارات 2071" },
  qatarVision: { en: "National Vision 2030", ar: "الرؤية الوطنية 2030" },
  kuwaitVision: { en: "New Kuwait 2035", ar: "كويت جديدة 2035" },
  omanVision: { en: "Oman 2040", ar: "عمان 2040" },
  bahrainVision: { en: "Economic Vision 2030", ar: "الرؤية الاقتصادية 2030" },

  // Metadata & SEO
  marketUpdate: { en: "Market Update", ar: "تحديث السوق" },
  todayMarket: { en: "Today's Market Highlights", ar: "أبرز أحداث السوق اليوم" },
  home: { en: "Home", ar: "الرئيسية" },
  about: { en: "About", ar: "حول" },
  contact: { en: "Contact", ar: "اتصل بنا" },
  privacy: { en: "Privacy", ar: "الخصوصية" },
  terms: { en: "Terms", ar: "الشروط" },
  disclaimer: { en: "Disclaimer", ar: "إخلاء المسؤولية" },
  transparencyNotice: { en: "Transparency & Ethical Content Notice", ar: "إشعار الشفافية والمحتوى الأخلاقي" },
  transparencyBody: { 
    en: "Arabia Khaleej is a professional regional intelligence reference. We aggregate, simplify, and surface authoritative information from official sources across the GCC to provide high-fidelity insights and economic transparency.", 
    ar: "عربية خليج هي مرجع استخبارات إقليمي احترافي. نحن نجمع ونبسط ونظهر المعلومات الموثوقة من المصادر الرسمية عبر دول مجلس التعاون الخليجي لتوفير رؤى عالية الدقة وشفافية اقتصادية." 
  },
  dataProvenance: { en: "Data Provenance & Verification", ar: "أصل البيانات والتحقق منها" },
  dataProvenanceDesc: { en: "Our market indicators and utility data are sourced directly from official GCC ministry APIs and authorized financial exchanges, verified by our automated systems every 60 seconds.", ar: "يتم الحصول على مؤشرات السوق وبياناتنا من واجهات برمجة التطبيقات الرسمية للوزارات الخليجية والبورصات المالية المعتمدة، ويتم التحقق منها بواسطة أنظمتنا الآلية كل 60 ثانية." },
  editorialIntegrity: { en: "Editorial Integrity", ar: "النزاهة التحريرية" },
  editorialIntegrityDesc: { en: "All analysis is subject to a multi-stage human-led verification process. We ensure that AI-augmented insights are strictly governed by our senior regional analysts.", ar: "تخضع جميع التحليلات لعملية تحقق متعددة المراحل يقودها البشر. نحن نضمن أن الرؤى المعززة بالذكاء الاصطناعي تخضع لإشراف صارم من قبل كبار المحللين الإقليميين لدينا." },
  ethicalIntelligence: { en: "Ethical Intelligence", ar: "الذكاء الاصطناعي الأخلاقي" },
  ethicalIntelligenceDesc: { en: "We utilize advanced language models as analytical tools to synthesize large datasets, not as autonomous authors. Every strategic conclusion is validated for cultural and regional accuracy.", ar: "نحن نستخدم نماذج لغوية متقدمة كأدوات تحليلية لتلخيص مجموعات البيانات الكبيرة، وليس كمؤلفين مستقلين. يتم التحقق من كل استنتاج استراتيجي من حيث الدقة الثقافية والإقليمية." },
  regCompliance: { en: "Regulatory Compliance", ar: "الامتثال التنظيمي" },
  regComplianceDesc: { en: "Arabia Khaleej adheres to international digital publishing standards and regional media regulations within the GCC framework.", ar: "تلتزم عربية خليج بمعايير النشر الرقمي الدولية واللوائح الإعلامية الإقليمية ضمن إطار مجلس التعاون الخليجي." },
  globalStandards: { en: "Global Standards", ar: "المعايير العالمية" },
  globalStandardsDesc: { en: "Our reporting follows the highest ethical standards of financial journalism and economic transparency.", ar: "تتبع تقاريرنا أعلى المعايير الأخلاقية للصحافة المالية والشفافية الاقتصادية." },
  regInquiry: { en: "Institutional Inquiries", ar: "الاستفسارات المؤسسية" },
  regInquiryDesc: { en: "For sovereign entities or institutional stakeholders seeking detailed data methodologies or collaboration.", ar: "للكيانات السيادية أو أصحاب المصلحة المؤسسيين الذين يبحثون عن منهجيات بيانات مفصلة أو تعاون." },
  boutiqueEnquiry: { en: "Boutique Enquiry", ar: "استفسار خاص" },
  econPower: { en: "Economic Powerhouse", ar: "القوة الاقتصادية" },
  globalLead: { en: "Global Leadership", ar: "القيادة العالمية" },
  megaProj: { en: "Mega Projects", ar: "المشاريع العملاقة" },
  innovationHub: { en: "Innovation Hub", ar: "مركز الابتكار" },
  spaceTech: { en: "Space & Tech", ar: "الفضاء والتكنولوجيا" },
  culturalDiv: { en: "Cultural Diversity", ar: "التنوع الثقافي" },
  energyGiant: { en: "Energy Giant", ar: "عملاق الطاقة" },
  diplomaticHub: { en: "Diplomatic Hub", ar: "المركز الدبلوماسي" },
  sportsExcellence: { en: "Sports Excellence", ar: "التميز الرياضي" },
  finHeritage: { en: "Financial Heritage", ar: "التراث المالي" },
  parlTradition: { en: "Parliamentary Tradition", ar: "التقليد البرلماني" },
  culturalHeart: { en: "Cultural Heart", ar: "القلب الثقافي" },
  naturalMajesty: { en: "Natural Majesty", ar: "العظمة الطبيعية" },
  strategicNeutrality: { en: "Strategic Neutrality", ar: "الحياد الاستراتيجي" },
  maritimeLegacy: { en: "Maritime Legacy", ar: "الإرث البحري" },
  finInnovation: { en: "Financial Innovation", ar: "الابتكار المالي" },
  ancientHistory: { en: "Ancient History", ar: "التاريخ القديم" },
  motorsportsHub: { en: "Motorsports Hub", ar: "مركز رياضة المحركات" },
  flagOf: { en: "Flag of %s", ar: "علم %s" },
  regCompliance: { en: "Regulatory Compliance", ar: "الامتثال التنظيمي" },
  regComplianceDesc: { 
    en: "We adhere to all local digital regulations and ensure that our platform serves as a positive contributor to the regional digital ecosystem.", 
    ar: "نحن نلتزم بجميع اللوائح الرقمية المحلية ونضمن أن منصتنا تعمل كمسهم إيجابي في المنظومة الرقمية الإقليمية." 
  },
  globalStandards: { en: "Global Standards", ar: "المعايير العالمية" },
  globalStandardsDesc: { 
    en: "Our data practices follow international best practices for information accuracy and source attribution.", 
    ar: "تتبع ممارسات البيانات لدينا أفضل الممارسات الدولية لدقة المعلومات وإسناد المصادر." 
  },
  regInquiry: { en: "Regulatory Inquiry", ar: "الاستفسار التنظيمي" },
  regInquiryDesc: { 
    en: "We welcome dialogue with regional regulatory bodies. For official inquiries, please use our primary communication channel.", 
    ar: "نرحب بالحوار مع الهيئات التنظيمية الإقليمية. للاستفسارات الرسمية، يرجى استخدام قناة الاتصال الرئيسية لدينا." 
  },
  statusActive: { en: "Active", ar: "نشط" },



  // Common UI
  processing: { en: "Processing", ar: "جاري المعالجة" },
  refresh: { en: "Refresh", ar: "تحديث" },
  loadMore: { en: "Load More", ar: "تحميل المزيد" },
  premium: { en: "Premium", ar: "مميز" },
  somethingWentWrong: { en: "Something went wrong", ar: "حدث خطأ ما" },
  retryConnection: { en: "Retry Connection", ar: "إعادة الاتصال" },
  back: { en: "Back", ar: "رجوع" },
  backHome: { en: "Back to Home", ar: "العودة للرئيسية" },
  submit: { en: "Submit", ar: "إرسال" },
  yourLocation: { en: "Your Location", ar: "موقعك" },
  genericScheduleFor: { en: "Schedule for", ar: "جدول" },


  // Forms & Contact
  fullName: { en: "Full Name", ar: "الاسم الكامل" },
  emailAddress: { en: "Email Address", ar: "البريد الإلكتروني" },
  message: { en: "Message", ar: "الرسالة" },
  messagePlaceholder: { en: "Tell us how we can help...", ar: "أخبرنا كيف يمكننا مساعدتك..." },
  sendMessage: { en: "Send Message", ar: "إرسال الرسالة" },
  thankYou: { en: "Thank You", ar: "شكراً لك" },
  submissionReceived: { en: "Your message has been received. Our regional team will be in touch shortly.", ar: "تم استلام رسالتك. سيتواصل معك فريقنا الإقليمي قريباً." },

  // Privacy Page
  privacyDesc: { 
    en: "We built Arabia Khaleej to be read, not to harvest. Your privacy is not a feature — it is a default.", 
    ar: "لقد بنينا عربية خليج لتُقرأ، لا لتُحصد. خصوصيتك ليست ميزة - إنها وضع افتراضي." 
  },
  privacyDisclaimer: { 
    en: "We use advertising cookies to provide relevant content while maintaining your anonymity.", 
    ar: "نحن نستخدم كوكيز الإعلانات لتقديم محتوى ذو صلة مع الحفاظ على سرية هويتك." 
  },
  termsDesc: { 
    en: "Plain-language terms for an honest platform. Read on — it is shorter than you expect.", 
    ar: "شروط لغة مبسطة لمنصة صادقة. اقرأها - إنها أقصر مما تتوقع." 
  },
  disclaimerDesc: { 
    en: "Please read before relying on any information you find here. We are honest about what we are — and what we are not.", 
    ar: "يرجى القراءة قبل الاعتماد على أي معلومات تجدها هنا. نحن صادقون بشأن ما نحن عليه - وما لسنا عليه." 
  },
  importantNotice: { en: "Important Notice", ar: "تنبيه هام" },
  disclaimerWarning: { 
    en: "Arabia Khaleej is a professional independent regional reference — not a government portal, law firm, or advisory service. All information is provided 'as-is' for guidance only. Verify everything with official sources before taking action.", 
    ar: "عربية خليج هي منصة استخبارات إقليمية مستقلة احترافية - وليست بوابة حكومية أو مكتب محاماة أو خدمة استشارية. يتم توفير جميع المعلومات 'كما هي' للإرشاد فقط. تحقق من كل شيء من المصادر الرسمية قبل اتخاذ أي إجراء." 
  },

  // Privacy Policy Detailed Sections
  ppSection1Title: { en: "Information Collection", ar: "جمع المعلومات" },
  ppSection1Body: { 
    en: "We collect minimal information required to provide our services. This includes device information, browser type, and interaction data to optimize the regional experience for our users. We do not sell or trade your personal information to outside parties.", 
    ar: "نحن نجمع الحد الأدنى من المعلومات المطلوبة لتقديم خدماتنا. يتضمن ذلك معلومات الجهاز ونوع المتصفح وبيانات التفاعل لتحسين التجربة الإقليمية لمستخدمينا. نحن لا نبيع أو نتاجر بمعلوماتك الشخصية لأطراف خارجية." 
  },
  ppSection2Title: { en: "Google AdSense & Cookies", ar: "Google AdSense وملفات تعريف الارتباط" },
  ppSection2Body: { 
    en: "Arabia Khaleej uses Google AdSense to serve advertisements. Google uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting Ads Settings. We also use cookies for site functionality and analytics.", 
    ar: "تستخدم عربية خليج Google AdSense لتقديم الإعلانات. يستخدم Google ملفات تعريف الارتباط لتقديم الإعلانات بناءً على زياراتك السابقة لموقعنا أو مواقع الويب الأخرى. يمكنك اختيار عدم تلقي الإعلانات الشخصية من خلال زيارة إعدادات الإعلانات. نستخدم أيضاً ملفات تعريف الارتباط لوظائف الموقع والتحليلات." 
  },
  ppSection3Title: { en: "Regional Data Sovereignty", ar: "سيادة البيانات الإقليمية" },
  ppSection3Body: { 
    en: "We respect the data protection regulations of all GCC member states. Your data is handled with the highest level of security and in compliance with regional digital governance standards, ensuring that local privacy norms are strictly upheld.", 
    ar: "نحن نحترم لوائح حماية البيانات لجميع الدول الأعضاء في مجلس التعاون الخليجي. يتم التعامل مع بياناتك بأعلى مستوى من الأمان ووفقاً لمعايير الحوكمة الرقمية الإقليمية، مما يضمن الالتزام الصارم بمعايير الخصوصية المحلية." 
  },
  ppSection4Title: { en: "Third-Party Analytics", ar: "تحليلات الطرف الثالث" },
  ppSection4Body: { 
    en: "We use Google Analytics to understand traffic patterns and improve content relevance. These tools collect anonymous data such as page views and session duration to help us provide more valuable insights to the GCC community.", 
    ar: "نحن نستخدم Google Analytics لفهم أنماط الحركة وتحسين ملاءمة المحتوى. تجمع هذه الأدوات بيانات مجهولة الهوية مثل مشاهدات الصفحة ومدة الجلسة لمساعدتنا في تقديم رؤى أكثر قيمة للمجتمع الخليجي." 
  },
  ppSection5Title: { en: "Data Security Measures", ar: "تدابير أمن البيانات" },
  ppSection5Body: { 
    en: "We implement a variety of security measures to maintain the safety of your personal information. All sensitive information is transmitted via Secure Socket Layer (SSL) technology and encrypted into our databases.", 
    ar: "نحن ننفذ مجموعة متنوعة من التدابير الأمنية للحفاظ على سلامة معلوماتك الشخصية. يتم نقل جميع المعلومات الحساسة عبر تقنية Secure Socket Layer (SSL) وتشفيرها في قواعد بياناتنا." 
  },
  ppSection6Title: { en: "Your Rights & Consent", ar: "حقوقك وموافقتك" },
  ppSection6Body: { 
    en: "By using our site, you consent to our privacy policy. You have the right to access, correct, or request the deletion of any personal information you have shared with us through our contact forms or join requests.", 
    ar: "باستخدام موقعنا، فإنك توافق على سياسة الخصوصية الخاصة بنا. لديك الحق في الوصول إلى أي معلومات شخصية شاركتها معنا من خلال نماذج الاتصال أو طلبات الانضمام، أو تصحيحها أو طلب حذفها." 
  },

  // Terms of Service Detailed Sections
  tosSection1Title: { en: "Acceptance of Terms", ar: "الموافقة على الشروط" },
  tosSection1Body: { 
    en: "By accessing Arabia Khaleej, you agree to be bound by these Terms of Service and all applicable laws and regulations in the GCC region. If you do not agree with any of these terms, you are prohibited from using or accessing this site.", 
    ar: "من خلال الوصول إلى عربية خليج، فإنك توافق على الالتزام بشروط الخدمة هذه وجميع القوانين واللوائح المعمول بها في منطقة الخليج. إذا كنت لا توافق على أي من هذه الشروط، فيُحظر عليك استخدام هذا الموقع أو الوصول إليه." 
  },
  tosSection2Title: { en: "Intellectual Property Rights", ar: "حقوق الملكية الفكرية" },
  tosSection2Body: { 
    en: "The content on Arabia Khaleej, including text, graphics, logos, and software, is the property of Arabia Khaleej and is protected by international copyright and trademark laws. You may not reproduce or distribute any content without prior written permission.", 
    ar: "المحتوى الموجود في عربية خليج، بما في ذلك النصوص والرسومات والشعارات والبرامج، هو ملك لعربية خليج ومحمي بموجب قوانين حقوق النشر والعلامات التجارية الدولية. لا يجوز لك إعادة إنتاج أو توزيع أي محتوى دون إذن كتابي مسبق." 
  },
  tosSection3Title: { en: "User Obligations", ar: "التزامات المستخدم" },
  tosSection3Body: { 
    en: "Users agree to use the platform for lawful purposes only. You are prohibited from posting or transmitting any material that is defamatory, offensive, or violates the regional digital regulations of the Gulf Cooperation Council member states.", 
    ar: "يوافق المستخدمون على استخدام المنصة للأغراض القانونية فقط. يُحظر عليك نشر أو نقل أي مادة تشهيرية أو مسيئة أو تنتهك اللوائح الرقمية الإقليمية للدول الأعضاء في مجلس التعاون الخليجي." 
  },
  tosSection4Title: { en: "Disclaimer of Warranties", ar: "إخلاء المسؤولية عن الضمانات" },
  tosSection4Body: { 
    en: "The materials on Arabia Khaleej are provided 'as is'. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties of merchantability or fitness for a particular purpose.", 
    ar: "يتم توفير المواد الموجودة في عربية خليج 'كما هي'. نحن لا نقدم أي ضمانات، صريحة أو ضمنية، ونخلي مسؤوليتنا بموجب هذا عن جميع الضمانات الأخرى بما في ذلك، على سبيل المثال لا الحصر، الضمانات الضمنية لقابلية التسويق أو الملاءمة لغرض معين." 
  },
  tosSection5Title: { en: "Limitation of Liability", ar: "تحديد المسؤولية" },
  tosSection5Body: { 
    en: "In no event shall Arabia Khaleej or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on our platform.", 
    ar: "لا تتحمل عربية خليج أو موردوها في أي حال من الأحوال المسؤولية عن أي أضرار (بما في ذلك، على سبيل المثال لا الحصر، الأضرار الناجمة عن فقدان البيانات أو الربح) الناشئة عن استخدام أو عدم القدرة على استخدام المواد الموجودة على منصتنا." 
  },
  tosSection6Title: { en: "Governing Law", ar: "القانون المعمول به" },
  tosSection6Body: { 
    en: "These terms and conditions are governed by and construed in accordance with the laws of the State of Qatar and you irrevocably submit to the exclusive jurisdiction of the courts in that location.", 
    ar: "تخضع هذه الشروط والأحكام وتفسر وفقاً لقوانين دولة قطر، وأنت تخضع بشكل غير قابل للإلغاء للاختصاص القضائي الحصري للمحاكم في ذلك الموقع." 
  },
  tosSection7Title: { en: "Termination of Use", ar: "إنهاء الاستخدام" },
  tosSection7Body: { 
    en: "We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Service.", 
    ar: "نحتفظ بالحق في إنهاء أو تعليق الوصول إلى خدمتنا على الفور، دون إشعار مسبق أو مسؤولية، لأي سبب كان، بما في ذلك على سبيل المثال لا الحصر إذا انتهكت شروط الخدمة." 
  },
  tosSection8Title: { en: "Changes to Terms", ar: "التغييرات في الشروط" },
  tosSection8Body: { 
    en: "Arabia Khaleej may revise these Terms of Service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these Terms of Service.", 
    ar: "قد تقوم عربية خليج بمراجعة شروط الخدمة هذه في أي وقت دون إشعار. باستخدام هذا الموقع، فإنك توافق على الالتزام بالإصدار الحالي من شروط الخدمة هذه." 
  },

  // About Page
  aboutDesc: { 
    en: "Arabia Khaleej is the definitive independent reference for a refined GCC experience. We aggregate, simplify, and surface authoritative regional information across the Gulf Cooperation Council, including Qatar, Saudi Arabia, the UAE, Kuwait, Oman, and Bahrain.", 
    ar: "عربية خليج هي المرجع المستقل النهائي لتجربة خليجية متميزة. نحن نجمع ونبسط ونظهر المعلومات الإقليمية الموثوقة عبر دول مجلس التعاون الخليجي، بما في ذلك قطر والسعودية والإمارات والكويت وعمان والبحرين." 
  },
  mission: { en: "Our Mission", ar: "مهمتنا" },
  missionDesc: { 
    en: "Our mission is to provide residents and visitors with a high-fidelity portal that captures the essence of modern Gulf life. From precise spiritual schedules to real-time economic intelligence, we serve as a bridge between official data and meaningful human insight, fostering a deeper understanding of the GCC's rapid transformation.", 
    ar: "مهمتنا هي تزويد المقيمين والزوار ببوابة عالية الدقة تلتقط جوهر الحياة الخليجية الحديثة. من الجداول الروحية الدقيقة إلى الاستخبارات الاقتصادية في الوقت الفعلي، نحن نعمل كجسر بين البيانات الرسمية والرؤية البشرية الهادفة، مما يعزز فهماً أعمق للتحول السريع في دول مجلس التعاون الخليجي." 
  },
  pillars: { en: "Our Pillars", ar: "ركائزنا" },
  independence: { en: "Independence", ar: "الاستقلالية" },
  independenceDesc: { en: "We maintain strict editorial freedom to ensure that every piece of information we provide is accurate, objective, and relevant to our audience's needs.", ar: "نحن نحافظ على حرية تحريرية صارمة لضمان أن كل معلومة نقدمها دقيقة وموضوعية وذات صلة باحتياجات جمهورنا." },
  simplicity: { en: "Simplicity", ar: "البساطة" },
  simplicityDesc: { en: "Our premium design philosophy removes digital noise, allowing the most important value to surface through a clean, intuitive, and modern interface.", ar: "تزيل فلسفتنا في التصميم المتميز الضوضاء الرقمية، مما يسمح بظهور القيمة الأكثر أهمية من خلال واجهة نظيفة وبسيطة وحديثة." },
  transparency: { en: "Transparency", ar: "الشفافية" },
  transparencyDesc: { en: "We provide clear attribution for all our data sources and adhere to ethical content guidelines that respect regional cultural norms and digital regulations.", ar: "نحن نقدم إسناداً واضحاً لجميع مصادر بياناتنا ونلتزم بإرشادات المحتوى الأخلاقية التي تحترم المعايير الثقافية الإقليمية واللوائح الرقمية." },
  intelligenceProject: { en: "A professional regional intelligence project dedicated to the Gulf Cooperation Council.", ar: "مشروع استخبارات إقليمي احترافي مخصص لدول مجلس التعاون الخليجي." },

  // Legal
  legal: { en: "Legal", ar: "قانوني" },
  contactTitle: { en: "Get in Touch", ar: "تواصل معنا" },
  contactDesc: { en: "Our regional intelligence team is available for press enquiries, partnership proposals, and feedback regarding our platform standards.", ar: "فريق الاستخبارات الإقليمي لدينا متاح لاستفسارات الصحافة ومقترحات الشراكة والملاحظات المتعلقة بمعايير منصتنا." },
  privacyTitle: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  termsTitle: { en: "Terms of Service", ar: "شروط الخدمة" },
  disclaimerTitle: { en: "Legal Disclaimer", ar: "إخلاء المسؤولية القانونية" },
  lastUpdated: { en: "Last Updated", ar: "آخر تحديث" },

  // Disclaimer Details
  discSection1Title: { en: "No Professional Advice", ar: "لا توجد نصيحة مهنية" },
  discSection1Body: { 
    en: "The information provided on Arabia Khaleej is for general informational purposes only. It should not be construed as legal, financial, or religious advice. All information is provided in good faith, however we make no representation or warranty of any kind regarding its completeness or accuracy.", 
    ar: "المعلومات المقدمة في عربية خليج هي لأغراض معلوماتية عامة فقط. لا ينبغي تفسيرها على أنها نصيحة قانونية أو مالية أو دينية. يتم تقديم جميع المعلومات بحسن نية، ومع ذلك لا نقدم أي تمثيل أو ضمان من أي نوع فيما يتعلق باكتمالها أو دقتها." 
  },
  discSection2Title: { en: "External Links Disclaimer", ar: "إخلاء المسؤولية عن الروابط الخارجية" },
  discSection2Body: { 
    en: "This site may contain links to other websites or content belonging to third parties. Such external links are not investigated or monitored by us for accuracy or reliability. We do not warrant, endorse, or assume responsibility for the accuracy of any information offered by third-party websites.", 
    ar: "قد يحتوي هذا الموقع على روابط لمواقع أخرى أو محتوى ينتمي إلى أطراف ثالثة. لا يتم التحقيق في هذه الروابط الخارجية أو مراقبتها من قبلنا للتأكد من دقتها أو موثوقيتها. نحن لا نضمن أو نصادق أو نتحمل المسؤولية عن دقة أي معلومات تقدمها مواقع أطراف ثالثة." 
  },
  discSection3Title: { en: "Market Data & Financials", ar: "بيانات السوق والمالية" },
  discSection3Body: { 
    en: "Financial market data, including stock indices, gold prices, and exchange rates, are provided for reference only and may be delayed. Arabia Khaleej is not a financial advisor. Always consult with a certified professional before making investment decisions.", 
    ar: "يتم توفير بيانات السوق المالية، بما في ذلك مؤشرات الأسهم وأسعار الذهب وأسعار الصرف، كمرجع فقط وقد تكون متأخرة. عربية خليج ليست مستشاراً مالياً. استشر دائماً متخصصاً معتمداً قبل اتخاذ قرارات الاستثمار." 
  },
  discSection4Title: { en: "Errors and Omissions", ar: "الأخطاء والسهو" },
  discSection4Body: { 
    en: "While we strive to provide the most accurate information, Arabia Khaleej is not responsible for any errors or omissions, or for the results obtained from the use of this information. All information is provided 'as is' with no guarantee of completeness.", 
    ar: "بينما نسعى جاهدين لتقديم المعلومات الأكثر دقة، فإن عربية خليج ليست مسؤولة عن أي أخطاء أو سهو، أو عن النتائج التي يتم الحصول عليها من استخدام هذه المعلومات. يتم تقديم جميع المعلومات 'كما هي' دون ضمان اكتمالها." 
  },
  discSection5Title: { en: "Trademarks & Copyrights", ar: "العلامات التجارية وحقوق النشر" },
  discSection5Body: { 
    en: "Any trademarks, service marks, or government names referenced on this site remain the property of their respective owners. Their mention is purely for informational context and does not imply endorsement, affiliation, or sponsorship.",
    ar: "أي علامات تجارية أو علامات خدمة أو أسماء حكومية مشار إليها في هذا الموقع تظل ملكاً لأصحابها المعنيين. إن ذكرها هو فقط للسياق المعلوماتي ولا يعني التأييد أو الانتساب أو الرعاية."
  },


  // Engagement
  engagement: { en: "Engagement", ar: "المشاركة" },
  publicSentiment: { en: "Public Sentiment", ar: "استطلاع الرأي العام" },
  voteRecorded: { en: "Vote Recorded", ar: "تم التصويت" },
  globalParticipants: { en: "Global Participants", ar: "مشارك" },
  realTimeIntelligence: { en: "Real-time Intelligence", ar: "تحليلات في الوقت الفعلي" },

  // FAQs - Home
  faqWhatIsTitle: { en: "What is the mission of Arabia Khaleej?", ar: "ما هي مهمة عربية خليج؟" },
  faqWhatIsBody: { 
    en: "Arabia Khaleej is a professional independent regional intelligence platform dedicated to the Gulf Cooperation Council (GCC). Our mission is to provide residents, investors, and visitors with a high-fidelity portal for essential information—ranging from accurate Islamic prayer times to real-time market data across all six GCC member states.", 
    ar: "عربية خليج هي منصة استخبارات إقليمية مستقلة احترافية مخصصة لدول مجلس التعاون الخليجي. مهمتنا هي تزويد المقيمين والمستثمرين والزوار ببوابة عالية الدقة للمعلومات الأساسية - بدءاً من مواقيت الصلاة الإسلامية الدقيقة إلى بيانات السوق في الوقت الفعلي عبر جميع الدول الست الأعضاء في مجلس التعاون الخليجي." 
  },
  faqCountriesTitle: { en: "Which GCC countries are featured on the platform?", ar: "ما هي الدول الخليجية المميزة على المنصة؟" },
  faqCountriesBody: { 
    en: "We provide comprehensive coverage for all six member states of the Gulf Cooperation Council: Qatar, the United Arab Emirates, Saudi Arabia, Kuwait, the Sultanate of Oman, and the Kingdom of Bahrain. Each country profile includes detailed economic data, national visions, and regional insights.", 
    ar: "نحن نقدم تغطية شاملة لجميع الدول الست الأعضاء في مجلس التعاون الخليجي: قطر، الإمارات العربية المتحدة، المملكة العربية السعودية، الكويت، سلطنة عمان، ومملكة البحرين. يتضمن كل ملف تعريف دولة بيانات اقتصادية مفصلة ورؤى وطنية ورؤى إقليمية." 
  },
  faqPrayerTitle: { en: "How does Arabia Khaleej ensure prayer time accuracy?", ar: "كيف تضمن عربية خليج دقة مواقيت الصلاة؟" },
  faqPrayerBody: { 
    en: "Accuracy is our highest priority. We provide daily Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha prayer times calculated using the Umm Al-Qura University (Makkah) method—the official standard for the region. Our systems refresh every 60 seconds to ensure you have the most precise timings for your specific city.", 
    ar: "الدقة هي أولويتنا القصوى. نحن نوفر مواقيت صلاة الفجر والشروق والظهر والعصر والمغرب والعشاء يومياً محسوبة باستخدام طريقة جامعة أم القرى (مكة المكرمة) - المعيار الرسمي للمنطقة. يتم تحديث أنظمتنا كل 60 ثانية لضمان حصولك على أدق التوقيتات لمدينتك المحددة." 
  },
  faqBilingualTitle: { en: "Is the platform available in both Arabic and English?", ar: "هل المنصة متاحة باللغتين العربية والإنجليزية؟" },
  faqBilingualBody: { 
    en: "Yes, Arabia Khaleej is a fully bilingual platform. We support both English and Arabic with specialized typography and right-to-left (RTL) layout optimization. This ensures a premium user experience for both local GCC citizens and the international expatriate community.", 
    ar: "نعم، عربية خليج هي منصة ثنائية اللغة تماماً. نحن ندعم كلاً من الإنجليزية والعربية مع خطوط متخصصة وتحسين التخطيط من اليمين إلى اليسار (RTL). يضمن ذلك تجربة مستخدم متميزة لكل من مواطني دول مجلس التعاون الخليجي والمجتمع الدولي من الوافدين." 
  },
  faqMarketTitle: { en: "What type of GCC market data is available?", ar: "ما نوع بيانات السوق الخليجية المتاحة؟" },
  faqMarketBody: { 
    en: "We provide professional-grade data for executive precision, including major GCC stock indices (Tadawul, ADX, DFM, QE Index, Boursa Kuwait), gold spot prices (XAU/USD), Brent crude oil, and live exchange rates for all six GCC currencies versus the US Dollar.", 
    ar: "نحن نقدم بيانات احترافية لدقة التنفيذيين، بما في ذلك مؤشرات الأسهم الخليجية الرئيسية (تداول، سوق أبوظبي، سوق دبي المالي، مؤشر قطر، بورصة الكويت)، وأسعار الذهب الفورية (XAU/USD)، وخام برنت، وأسعار الصرف المباشرة لجميع العملات الخليجية الست مقابل الدولار الأمريكي." 
  },


  // FAQs - Prayer
  faqPrayerCalcTitle: { en: "How are prayer times calculated?", ar: "كيف يتم حساب مواقيت الصلاة؟" },
  faqPrayerCalcBody: { 
    en: "Prayer times are calculated using the Umm Al-Qura University (Makkah) method, the official standard for Saudi Arabia and widely used across the GCC. A local engine is used as a failover.", 
    ar: "يتم حساب مواقيت الصلاة باستخدام طريقة جامعة أم القرى (مكة المكرمة)، وهي المعيار الرسمي للمملكة العربية السعودية وتستخدم على نطاق واسع في دول الخليج. يتم استخدام محرك محلي كاحتياطي." 
  },
  faqPrayerCitiesTitle: { en: "Which GCC cities are covered?", ar: "ما هي المدن الخليجية المشمولة؟" },
  faqPrayerCitiesBody: { 
    en: "Arabia Khaleej provides prayer times for Doha (Qatar), Dubai and Abu Dhabi (UAE), Riyadh (Saudi Arabia), Kuwait City (Kuwait), Muscat (Oman), and Manama (Bahrain).", 
    ar: "توفر عربية خليج مواقيت الصلاة للدوحة (قطر)، دبي وأبو ظبي (الإمارات)، الرياض (السعودية)، مدينة الكويت (الكويت)، مسقط (عمان)، والمنامة (البحرين)." 
  },
  faqPrayerListTitle: { en: "What prayers are listed?", ar: "ما هي الصلوات المدرجة؟" },
  faqPrayerListBody: { 
    en: "The five daily prayers plus Sunrise are listed: Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha.", 
    ar: "يتم إدراج الصلوات الخمس اليومية بالإضافة إلى الشروق: الفجر، الشروق، الظهر، العصر، المغرب، العشاء." 
  },
  faqPrayerHijriTitle: { en: "Does it show the Hijri calendar?", ar: "هل يعرض التقويم الهجري؟" },
  faqPrayerHijriBody: { 
    en: "Yes. A full 7-day Hijri (Islamic) calendar is available for each city, showing the corresponding Hijri dates alongside Gregorian dates.", 
    ar: "نعم. يتوفر تقويم هجري (إسلامي) كامل لمدة 7 أيام لكل مدينة، يعرض التواريخ الهجرية المقابلة للتواريخ الميلادية." 
  },
  faqPrayerUpdateTitle: { en: "How often are times updated?", ar: "كم مرة يتم تحديث الأوقات؟" },
  faqPrayerUpdateBody: { 
    en: "Prayer times are refreshed every 60 seconds. The next upcoming prayer is highlighted in real time.", 
    ar: "يتم تحديث مواقيت الصلاة ك  kuwaitFinContent: { 
    en: "Kuwait has a long-standing tradition of maritime trade and was a financial pioneer in the region, establishing the first stock exchange in the GCC. The Kuwait Investment Authority (KIA), which manages the Future Generations Fund, is one of the world's oldest and most prestigious sovereign wealth funds. The nation's financial sector is characterized by its stability and high-fidelity regulatory standards, making it a key destination for institutional investment. Through the 'New Kuwait 2035' vision, the country is expanding its financial services and developing major projects like the Northern Economic Zone to further integrate into global trade routes.", 
    ar: "تتمتع الكويت بتقاليد عريقة في التجارة البحرية وكانت رائدة مالية في المنطقة، حيث أنشأت أول بورصة في دول مجلس التعاون الخليجي. الهيئة العامة للاستثمار (KIA)، التي تدير صندوق الأجيال القادمة، هي واحدة من أقدم وأرقى صناديق الثروة السيادية في العالم. يتميز القطاع المالي في البلاد باستقراره ومعاييره التنظيمية عالية الدقة، مما يجعله وجهة رئيسية للاستثمار المؤسسي. ومن خلال رؤية 'كويت جديدة 2035'، تعمل البلاد على توسيع خدماتها المالية وتطوير مشاريع كبرى مثل المنطقة الاقتصادية الشمالية لزيادة التكامل في طرق التجارة العالمية." 
  },
  kuwaitParlContent: { 
    en: "Kuwait is uniquely distinguished by its vibrant parliamentary system and active political life, which has its roots in the traditional 'Diwaniya' culture of social and political discourse. This democratic tradition fosters a robust public dialogue and high levels of civic engagement, which is a source of national pride. The National Assembly plays a significant role in the nation's governance, ensuring transparency and accountability. This political dynamism, combined with a free and active press, contributes to Kuwait's status as a stable and sophisticated regional actor with a strong voice in international affairs.", 
    ar: "تتميز الكويت بشكل فريد بنظامها البرلماني الحيوي وحياتها السياسية النشطة، والتي تعود جذورها إلى ثقافة 'الديوانية' التقليدية للحوار الاجتماعي والسياسي. يعزز هذا التقليد الديمقراطي حواراً عاماً قوياً ومستويات عالية من المشاركة المدنية، وهو مصدر فخر وطني. تلعب مجلس الأمة دوراً هاماً في حوكمة الدولة، مما يضمن الشفافية والمساءلة. تساهم هذه الديناميكية السياسية، إلى جانب الصحافة الحرة والنشطة، في مكانة الكويت كلاعب إقليمي مستقر ومتطور ذو صوت قوي في الشؤون الدولية." 
  },
  kuwaitCultureContent: { 
    en: "Historically recognized as the cultural center of the Gulf, Kuwait continues to invest heavily in its artistic and intellectual landscape. The Sheikh Jaber Al-Ahmad Cultural Centre (JACC), a world-class architectural masterpiece, serves as a hub for performing arts, literature, and international cultural exchange. Kuwait's cultural strategy focuses on preserving its unique heritage—from traditional music to maritime history—while embracing contemporary artistic expressions. The nation's commitment to cultural enrichment is evident in its numerous museums, galleries, and festivals that celebrate the creative spirit of the GCC region.", 
    ar: "عُرفت الكويت تاريخياً كمركز ثقافي للخليج، وتستمر في الاستثمار بكثافة في مشهدها الفني والفكري. يعمل مركز الشيخ جابر الأحمد الثقافي (JACC)، وهو تحفة معمارية عالمية المستوى، كمركز للفنون المسرحية والأدب والتبادل الثقافي الدولي. تركز استراتيجية الكويت الثقافية على الحفاظ على تراثها الفريد - من الموسيقى التقليدية إلى التاريخ البحري - مع احتضان التعبيرات الفنية المعاصرة. يظهر التزام الدولة بالإثراء الثقافي في متاحفها ومعارضها ومهرجاناتها العديدة التي تحتفي بالروح الإبداعية لمنطقة الخليج." 
  },
  omanNaturalContent: { 
    en: "Oman is globally celebrated for its diverse and stunning geography, ranging from the rugged, majestic Al Hajar Mountains to the lush, verdant landscapes of Salalah during the Khareef (monsoon) season. The Sultanate prioritizes environmental conservation and sustainable tourism, offering authentic experiences that connect visitors with the natural world. Oman's commitment to preserving its pristine ecosystems is evident in its numerous nature reserves, which protect rare species like the Arabian Oryx. The nation's 'Vision 2040' emphasizes the importance of balancing economic growth with the protection of its unique natural majesty and biodiversity.", 
    ar: "تُعرف عمان عالمياً بجغرافيتها المتنوعة والمذهلة، بدءاً من جبال الحجر الوعرة والمهيبة إلى المناظر الطبيعية الخضراء المورقة في صلالة خلال موسم الخريف. تولي السلطنة الأولوية للحفاظ على البيئة والسياحة المستدامة، وتقدم تجارب أصيلة تربط الزوار بالعالم الطبيعي. يظهر التزام عمان بالحفاظ على أنظمتها البيئية البكر في محمياتها الطبيعية العديدة، التي تحمي الأنواع النادرة مثل المها العربي. وتؤكد 'رؤية عمان 2040' على أهمية موازنة النمو الاقتصادي مع حماية عظمتها الطبيعية الفريدة وتنوعها البيولوجي." 
  },
  omanNeutralContent: { 
    en: "Oman's foreign policy is built on a rock-solid foundation of 'friend to all, enemy to none'. This long-standing strategic neutrality and commitment to non-interference have made the Sultanate an essential and trusted mediator in international diplomacy. Oman frequently serves as a bridge for dialogue between conflicting parties, hosting sensitive negotiations that contribute to regional and global peace. This diplomatic maturity is a core pillar of Oman's national identity, reflecting its historical role as a maritime nation that thrived through open communication and trade with diverse civilizations across the Indian Ocean and beyond.", 
    ar: "تبنى سياسة عمان الخارجية على أساس متين من 'صديق للجميع، عدو لا أحد'. هذا الحياد الاستراتيجي طويل الأمد والالتزام بعدم التدخل جعل السلطنة وسيطاً أساسياً وموثوقاً في الدبلوماسية الدولية. تعمل عمان بشكل متكرر كجسر للحوار بين الأطراف المتنازعة، حيث تستضيف مفاوضات حساسة تساهم في السلام الإقليمي والعالمي. يعد هذا النضج الدبلوماسي ركيزة أساسية للهوية الوطنية العمانية، مما يعكس دورها التاريخي كدولة بحرية ازدهرت من خلال التواصل المفتوح والتجارة مع مختلف الحضارات عبر المحيط الهندي وما وراءه." 
  },
  omanMaritimeContent: { 
    en: "With a strategic coastline stretching over 3,000 kilometers, Oman has a storied maritime history as a dominant seafaring and trading nation. Its historical influence once reached as far as East Africa, establishing Muscat as a vital hub for global trade. Today, this legacy continues through world-class ports like Salalah, Sohar, and Duqm, which serve as critical nodes in international maritime routes connecting Asia, Europe, and America. The Sultanate is investing heavily in its blue economy and logistics sector, leveraging its unique geographical position to become a global leader in maritime services and multimodal transportation infrastructure.", 
    ar: "مع ساحل استراتيجي يمتد لأكثر من 3000 كيلومتر، تتمتع عمان بتاريخ بحري عريق كدولة بحرية وتجارية مهيمنة. وصل نفوذها التاريخي في يوم من الأيام إلى شرق أفريقيا، مما جعل مسقط مركزاً حيوياً للتجارة العالمية. واليوم، يستمر هذا الإرث من خلال موانئ عالمية المستوى مثل صلالة وصحار والدقم، والتي تعمل كعقد حيوية في المسارات البحرية الدولية التي تربط آسيا وأوروبا وأمريكا. تستثمر السلطنة بكثافة في اقتصادها الأزرق وقطاع اللوجستيات، مستفيدة من موقعها الجغرافي الفريد لتصبح رائدة عالمياً في الخدمات البحرية والبنية التحتية للنقل متعدد الوسائط." 
  },
  bahrainFinContent: { 
    en: "Bahrain has a distinguished history as a regional financial pioneer, being the first GCC nation to actively diversify its economy away from oil. Today, it is recognized as a global leader in Islamic finance and a burgeoning hub for FinTech innovation through initiatives like Bahrain FinTech Bay. The nation's financial sector is supported by a robust regulatory framework overseen by the Central Bank of Bahrain, ensuring a stable and transparent environment for international business. As a key node for the regional financial services industry, Bahrain continues to attract global banks and investment firms seeking a highly skilled local workforce and strategic access to the GCC market.", 
    ar: "تمتلك البحرين تاريخاً متميزاً كرائدة مالية إقليمية، حيث كانت أول دولة خليجية تنوع اقتصادها بنشاط بعيداً عن النفط. اليوم، يتم الاعتراف بها كرائدة عالمية في التمويل الإسلامي ومركز مزدهر لابتكار التكنولوجيا المالية من خلال مبادرات مثل 'خليج البحرين للتكنولوجيا المالية'. ويحظى القطاع المالي في الدولة بدعم من إطار تنظيمي قوي يشرف عليه مصرف البحرين المركزي، مما يضمن بيئة مستقرة وشفافة للأعمال الدولية. وباعتبارها عقدة رئيسية لصناعة الخدمات المالية الإقليمية، تستمر البحرين في جذب البنوك العالمية وشركات الاستثمار التي تبحث عن قوة عاملة محلية ماهرة ووصول استراتيجي إلى سوق الخليج." 
  },
  bahrainHistoryContent: { 
    en: "Home to the legendary ancient Dilmun civilization, Bahrain possesses a rich historical legacy spanning over 5,000 years. The nation's deep connections to the sea are evident in its UNESCO World Heritage sites, including the Pearling Path in Muharraq and the Qal'at al-Bahrain (Bahrain Fort), which was once the capital of Dilmun. This long history of trade and international exchange has shaped Bahrain into a cosmopolitan and open society. The nation is dedicated to preserving its archaeological treasures while integrating its historical identity into a modern national vision that celebrates its role as a crossroad of ancient civilizations and modern global trade.", 
    ar: "موطن لحضارة دلمون القديمة الأسطورية، تمتلك البحرين إرثاً تاريخياً غنياً يمتد لأكثر من 5000 عام. تظهر علاقات الدولة العميقة بالبحر بوضوح في مواقع التراث العالمي لليونسكو، بما في ذلك 'مسار اللؤلؤ' في المحرق وقلعة البحرين، التي كانت يوماً ما عاصمة دلمون. لقد شكل هذا التاريخ الطويل من التجارة والتبادل الدولي البحرين لتصبح مجتمعاً عالمياً ومنفتحاً. تكرس الدولة جهودها للحفاظ على كنوزها الأثرية مع دمج هويتها التاريخية في رؤية وطنية حديثة تحتفي بدورها كملتقى للحضارات القديمة والتجارة العالمية الحديثة." 
  },
  bahrainMotorsportsContent: { 
    en: "Bahrain made global history in 2004 by hosting the first-ever Formula 1 Grand Prix in the Middle East, establishing the region as a major player in international motorsports. The Bahrain International Circuit (BIC), often referred to as 'The Home of Motorsport in the Middle East', remains a crown jewel of global racing and a high-fidelity venue for diverse international events. This commitment to sports excellence has significantly boosted the nation's tourism and media profile, showcasing its world-class infrastructure and organizational capabilities. Beyond F1, Bahrain continues to invest in a wide range of sports, from equestrian events to high-performance training, as part of its 'Economic Vision 2030'.", 
    ar: "دخلت البحرين التاريخ العالمي في عام 2004 باستضافة أول سباق فورمولا 1 على الإطلاق في الشرق الأوسط، مما أثبت المنطقة كلاعب رئيسي في رياضة المحركات الدولية. تظل حلبة البحرين الدولية (BIC)، التي يشار إليها غالباً باسم 'موطن رياضة المحركات في الشرق الأوسط'، جوهرة التاج في السباقات العالمية ومكاناً عالي الدقة لمختلف الفعاليات الدولية. لقد أدى هذا الالتزام بالتميز الرياضي إلى تعزيز مكانة الدولة السياحية والإعلامية بشكل كبير، مما يعرض بنيتها التحتية العالمية وقدراتها التنظيمية. وبعيداً عن الفورمولا 1، تستمر البحرين في الاستثمار في مجموعة واسعة من الرياضات، من فعاليات الفروسية إلى التدريب عالي الأداء، كجزء من 'رؤيتها الاقتصادية 2030'." 
  },ub for innovation and sustainable living. Other flagship projects include The Red Sea Project, an ultra-luxury regenerative tourism destination; Qiddiya, the world's largest entertainment city; and ROSHN, a massive residential program. These initiatives are not merely infrastructure projects but are symbolic of the Kingdom's commitment to a future defined by high-fidelity urban planning and environmental stewardship.", 
    ar: "تقوم المملكة حالياً بتطوير بعض من أكثر المشاريع الحضرية طموحاً وتقدماً من الناحية التكنولوجية في تاريخ البشرية. ومن أبرز هذه المشاريع مدينة نيوم، وهي مدينة مستقبلية بقيمة 500 مليار دولار تعمل بالكامل بالطاقة المتجددة ومصممة لتكون مركزاً للابتكار والحياة المستدامة. وتشمل المشاريع الرائدة الأخرى مشروع البحر الأحمر، وهو وجهة سياحية متجددة فاخرة للغاية؛ والقدية، أكبر مدينة ترفيهية في العالم؛ و 'روشن'، وهو برنامج سكني ضخم. هذه المبادرات ليست مجرد مشاريع بنية تحتية ولكنها ترمز إلى التزام المملكة بمستقبل يحدده التخطيط الحضري عالي الدقة والإشراف البيئي." 
  },
  uaeInnovationContent: { 
    en: "The United Arab Emirates is a constitutional federation of seven emirates that has evolved into a world-class leader in logistics, aviation, financial services, and renewable energy. Cities like Dubai and Abu Dhabi have become global benchmarks for urban excellence, featuring state-of-the-art infrastructure and iconic architectural marvels such as the Burj Khalifa. The nation's strategic focus on economic diversification has created a vibrant ecosystem for startups and multinational corporations alike, supported by specialized free zones and a regulatory framework that encourages global competitiveness and long-term sustainability.", 
    ar: "دولة الإمارات العربية المتحدة هي اتحاد دستوري من سبع إمارات تطور ليصبح رائدًا عالميًا في الخدمات اللوجستية والطيران والخدمات المالية والطاقة المتجددة. أصبحت مدن مثل دبي وأبو ظبي معايير عالمية للتميز الحضري، وتتميز ببنية تحتية حديثة وعجائب معمارية أيقونية مثل برج خليفة. لقد خلق التركيز الاستراتيجي للدولة على التنويع الاقتصادي نظاماً بيئياً حيوياً للشركات الناشئة والشركات متعددة الجنسيات على حد سواء، بدعم من المناطق الحرة المتخصصة وإطار تنظيمي يشجع التنافسية العالمية والاستدامة على المدى الطويل." 
  },
  uaeSpaceContent: { 
    en: "In recent years, the UAE has emerged as a significant player in the global space sector, successfully launching the Hope Probe to Mars and conducting multiple astronaut missions to the International Space Station. This ambition extends into the digital realm, where the UAE became the first country in the world to appoint a dedicated Minister for Artificial Intelligence. Through the National AI Strategy 2031, the nation is integrating advanced technologies into every sector of the economy, aiming to become the world's leading hub for AI innovation and digital government services.", 
    ar: "في السنوات الأخيرة، برزت دولة الإمارات العربية المتحدة كلاعب مهم في قطاع الفضاء العالمي، حيث نجحت في إطلاق مسبار الأمل إلى المريخ وأجرت مهام متعددة لرواد الفضاء إلى محطة الفضاء الدولية. ويمتد هذا الطموح إلى المجال الرقمي، حيث أصبحت الإمارات أول دولة في العالم تعين وزيراً مخصصاً للذكاء الاصطناعي. ومن خلال الاستراتيجية الوطنية للذكاء الاصطناعي 2031، تعمل الدولة على دمج التقنيات المتقدمة في كل قطاع من قطاعات الاقتصاد، بهدف أن تصبح المركز العالمي الرائد لابتكار الذكاء الاصطناعي وخدمات الحكومة الرقمية." 
  },
  uaeCultureContent: { 
    en: "The UAE is home to a diverse population comprising over 200 nationalities living and working in a spirit of harmony and mutual respect. This cultural mosaic is a testament to the nation's commitment to tolerance and coexistence. World-class institutions such as the Louvre Abu Dhabi, the Guggenheim Abu Dhabi (under development), and the Museum of the Future serve as intellectual anchors, showcasing the nation's dedication to preserving regional heritage while embracing global artistic and scientific progress. The UAE's cultural strategy focuses on fostering creativity and building bridges between different civilizations.", 
    ar: "تعد دولة الإمارات موطناً لسكان متنوعين يضمون أكثر من 200 جنسية تعيش وتعمل بروح من الوئام والاحترام المتبادل. هذا الفسيفساء الثقافي هو شهادة على التزام الدولة بالتسامح والتعايش. وتعمل مؤسسات عالمية مثل متحف اللوفر أبوظبي، ومتحف غوغنهايم أبوظبي (قيد التطوير)، ومتحف المستقبل كركائز فكرية، تعرض تفاني الدولة في الحفاظ على التراث الإقليمي مع احتضان التقدم الفني والعلمي العالمي. تركز الاستراتيجية الثقافية لدولة الإمارات على تعزيز الإبداع وبناء الجسور بين الحضارات المختلفة." 
  },
  qatarEnergyContent: { 
    en: "Qatar maintains a dominant position in the global energy market as one of the world's foremost exporters of Liquefied Natural Gas (LNG). This immense natural resource wealth has been strategically channeled into developing a highly sophisticated infrastructure, a world-class healthcare system, and a knowledge-based economy through Education City. Qatar's long-term fiscal stability is anchored by its Sovereign Wealth Fund, the Qatar Investment Authority, which invests in iconic assets and major industries globally, ensuring the nation's prosperity for future generations and supporting its ambitious 'National Vision 2030'.", 
    ar: "تحافظ قطر على مكانة مهيمنة في سوق الطاقة العالمي كواحدة من أبرز مصدري الغاز الطبيعي المسال (LNG) في العالم. وقد تم توجيه هذه الثروة الهائلة من الموارد الطبيعية بشكل استراتيجي لتطوير بنية تحتية متطورة للغاية، ونظام رعاية صحية عالمي المستوى، واقتصاد قائم على المعرفة من خلال المدينة التعليمية. يتم تعزيز الاستقرار المالي طويل الأجل لقطر من خلال صندوق الثروة السيادي، جهاز قطر للاستثمار، الذي يستثمر في الأصول الأيقونية والصناعات الرئيسية على مستوى العالم، مما يضمن ازدهار الدولة للأجيال القادمة ويدعم 'رؤيتها الوطنية 2030' الطموحة." 
  },
  qatarDiplomaticContent: { 
    en: "Known for its sophisticated and active international diplomacy, Qatar has established itself as a critical neutral mediator in regional and global conflicts. Its ability to foster dialogue between diverse actors has made it an essential hub for international relations. Additionally, Qatar is home to the Al Jazeera Media Network, which revolutionized the media landscape in the Middle East and continues to be a major voice in global discourse. The nation's commitment to soft power is also evident in its significant investments in arts, culture, and high-fidelity museums like the National Museum of Qatar.", 
    ar: "تشتهر قطر بدبلوماسيتها الدولية المتطورة والنشطة، وقد أثبتت نفسها كوسيط محايد وحاسم في النزاعات الإقليمية والعالمية. إن قدرتها على تعزيز الحوار بين مختلف الجهات الفاعلة جعلتها مركزاً أساسياً للعلاقات الدولية. بالإضافة إلى ذلك، تعد قطر موطناً لشبكة الجزيرة الإعلامية، التي أحدثت ثورة في المشهد الإعلامي في الشرق الأوسط وتستمر في كونها صوتاً رئيسياً في الخطاب العالمي. كما يظهر التزام الدولة بالقوة الناعمة في استثماراتها الكبيرة في الفنون والثقافة والمتاحف عالية الدقة مثل متحف قطر الوطني." 
  },
  qatarSportsContent: { 
    en: "Building on the historic success of hosting the FIFA World Cup 2022—the first ever held in the Arab world—Qatar has solidified its reputation as a premier global destination for sports excellence. The nation continues to host major international events across tennis, athletics, and motorsports, supported by the state-of-the-art Aspire Academy for sports education and high-performance training. Qatar's sports strategy is integrated into its broader social development goals, promoting healthy lifestyles among its residents and using sports as a tool for international cooperation and cultural exchange.", 
    ar: "بناءً على النجاح التاريخي لاستضافة كأس العالم فيفا 2022 - الأول من نوعه في العالم العربي - عززت قطر سمعتها كوجهة عالمية رائدة للتميز الرياضي. وتستمر الدولة في استضافة أحداث دولية كبرى في التنس وألعاب القوى ورياضة المحركات، بدعم من أكاديمية أسباير الحديثة للتعليم الرياضي والتدريب عالي الأداء. تم دمج الاستراتيجية الرياضية لقطر في أهداف التنمية الاجتماعية الأوسع نطاقاً، وتعزيز أنماط الحياة الصحية بين سكانها واستخدام الرياضة كأداة للتعاون الدولي والتبادل الثقافي." 
  },
  kuwaitFinContent: { 
    en: "Kuwait has a long-standing tradition of maritime trade and was a financial pioneer in the region. The Kuwait Investment Authority is one of the world's oldest and largest sovereign wealth funds.", 
    ar: "تتمتع الكويت بتقاليد عريقة في التجارة البحرية وكانت رائدة مالية في المنطقة. تعد الهيئة العامة للاستثمار في الكويت واحدة من أقدم وأكبر صناديق الثروة السيادية في العالم." 
  },
  kuwaitParlContent: { 
    en: "Kuwait is distinguished by its vibrant parliamentary system and active political life, which is unique in the GCC. This tradition fosters a robust public discourse and civic engagement.", 
    ar: "تتميز الكويت بنظامها البرلماني الحيوي وحياتها السياسية النشطة، وهي فريدة من نوعها في مجلس التعاون الخليجي. يعزز هذا التقليد خطاباً عاماً قوياً ومشاركة مدنية." 
  },
  kuwaitCultureContent: { 
    en: "Historically known as a center for arts and literature, Kuwait continues to invest in its cultural landscape through the Sheikh Jaber Al-Ahmad Cultural Centre and other major initiatives.", 
    ar: "عُرفت الكويت تاريخياً كمركز للفنون والأدب، وتستمر في الاستثمار في مشهدها الثقافي من خلال مركز الشيخ جابر الأحمد الثقافي والمبادرات الرئيسية الأخرى." 
  },
  omanNaturalContent: { 
    en: "Oman is celebrated for its diverse geography, from the rugged Al Hajar Mountains to the lush greenery of Salalah during the Khareef season. It prioritizes environmental conservation and sustainable tourism.", 
    ar: "تُعرف عمان بجغرافيتها المتنوعة، من جبال الحجر الوعرة إلى المساحات الخضراء المورقة في صلالة خلال موسم الخريف. وتولي الأولوية للحفاظ على البيئة والسياحة المستدامة." 
  },
  omanNeutralContent: { 
    en: "Oman's foreign policy is built on a foundation of 'friend to all, enemy to none'. This strategic neutrality has made it an essential mediator and a beacon of peace in a complex region.", 
    ar: "تبنى سياسة عمان الخارجية على أساس 'صديق للجميع، عدو لا أحد'. هذا الحياد الاستراتيجي جعلها وسيطاً أساسياً ومنارة للسلام في منطقة معقدة." 
  },
  omanMaritimeContent: { 
    en: "With a coastline stretching over 3,000 kilometers, Oman has a rich maritime history as a dominant seafaring nation. Today, its ports like Salalah and Duqm are critical nodes in global trade routes.", 
    ar: "مع ساحل يمتد لأكثر من 3000 كيلومتر، تتمتع عمان بتاريخ بحري غني كدولة بحرية مهيمنة. اليوم، تعد موانئها مثل صلالة والدقم عقدًا حيوية في طرق التجارة العالمية." 
  },
  bahrainFinContent: { 
    en: "Bahrain was the first GCC nation to diversify its economy and is now a global leader in Islamic finance and FinTech. The Bahrain Bay and Financial Harbour are symbols of its economic modernization.", 
    ar: "كانت البحرين أول دولة خليجية تنوع اقتصادها وهي الآن رائدة عالمياً في التمويل الإسلامي والتكنولوجيا المالية. يعد خليج البحرين والمرفأ المالي رموزاً لتحديثها الاقتصادي." 
  },
  bahrainHistoryContent: { 
    en: "Home to the ancient Dilmun civilization, Bahrain has a history spanning over 5,000 years. The Bahrain Fort (Qal'at al-Bahrain) is a UNESCO World Heritage site that tells the story of this island's rich past.", 
    ar: "موطن لحضارة دلمون القديمة، تمتلك البحرين تاريخاً يمتد لأكثر من 5000 عام. قلعة البحرين هي أحد مواقع التراث العالمي لليونسكو التي تحكي قصة الماضي الغني لهذه الجزيرة." 
  },
  bahrainMotorsportsContent: { 
    en: "Bahrain made history in 2004 by hosting the first Formula 1 Grand Prix in the Middle East. The Bahrain International Circuit remains a crown jewel of global motorsports.", 
    ar: "دخلت البحرين التاريخ في عام 2004 باستضافة أول سباق فورمولا 1 في الشرق الأوسط. تظل حلبة البحرين الدولية جوهرة التاج في رياضة المحركات العالمية." 
  },

  // UI Strings
  featuredInsights: { en: "Featured Insights", ar: "رؤى مختارة" },
  regionalIntelligence: { en: "Regional Intelligence", ar: "الاستخبارات الإقليمية" },
  today: { en: "Today", ar: "اليوم" },
  close: { en: "Close", ar: "إغلاق" },
  calendar: { en: "Calendar", ar: "التقويم" },
  hijriSchedule: { en: "7-Day Hijri & Prayer Schedule", ar: "جدول الصلاة والتقويم الهجري - 7 أيام" },
  all: { en: "All", ar: "الكل" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  hq: { en: "HQ", ar: "المقر الرئيسي" },
  status: { en: "Status", ar: "الحالة" },
  dohaQatar: { en: "Doha, State of Qatar", ar: "الدوحة، دولة قطر" },
  independentGccRef: { en: "Independent GCC Reference", ar: "مرجع خليجي مستقل" },
  ummAlQuraUnified: { en: "Umm Al-Qura Unified", ar: "توحيد أم القرى" },
  portalBranding: { en: "ARABIA KHALEEJ PORTAL", ar: "بوابة عربية خليج" },

  // Hijri Months
  muharram: { en: "Muharram", ar: "محرم" },
  safar: { en: "Safar", ar: "صفر" },
  rabiAlAwwal: { en: "Rabi' al-Awwal", ar: "ربيع الأول" },
  rabiAlThani: { en: "Rabi' al-Thani", ar: "ربيع الآخر" },
  jumadaAlUla: { en: "Jumada al-Ula", ar: "جمادى الأولى" },
  jumadaAlAkhira: { en: "Jumada al-Akhira", ar: "جمادى الآخرة" },
  rajab: { en: "Rajab", ar: "رجب" },
  shaban: { en: "Sha'ban", ar: "شعبان" },
  ramadan: { en: "Ramadan", ar: "رمضان" },
  shawwal: { en: "Shawwal", ar: "شوال" },
  dhuAlQidah: { en: "Dhu al-Qi'dah", ar: "ذو القعدة" },
  dhuAlHijjah: { en: "Dhu al-Hijjah", ar: "ذو الحجة" },

  // Currency Exchange
  currencyExchange: { en: "Currency Exchange", ar: "تحويل العملات" },
  currencyConverter: { en: "Currency Converter", ar: "محوّل العملات" },
  currencyExchangeDesc: { 
    en: "A professional-grade currency conversion utility designed for the GCC regional landscape. Convert between 40+ world currencies with high-fidelity live rates. This tool features specialized focus on GCC currencies pegged to the USD, major global pairs, and critical trade currencies for the Middle East, Asian, and European markets.", 
    ar: "أداة تحويل عملات احترافية مصممة للمشهد الإقليمي الخليجي. حوّل بين أكثر من 40 عملة عالمية بأسعار مباشرة عالية الدقة. تتميز هذه الأداة بتركيز متخصص على العملات الخليجية المرتبطة بالدولار، والأزواج العالمية الرئيسية، وعملات التجارة الحيوية لأسواق الشرق الأوسط وآسيا وأوروبا." 
  },
  currencyDetailTitle: { en: "Economic Stability: Understanding GCC Currency Pegs", ar: "الاستقرار الاقتصادي: فهم ارتباط العملات الخليجية" },
  currencyDetailBody: { 
    en: "The monetary landscape of the Gulf Cooperation Council is characterized by a high degree of stability, largely due to the long-standing policy of pegging regional currencies to the United States Dollar (USD). This strategic alignment—maintained by the central banks of Qatar, Saudi Arabia, the United Arab Emirates, Oman, and Bahrain—ensures that exchange rates remain fixed within very narrow bands. Kuwait follows a slightly different approach, pegging its Dinar to a weighted basket of major global currencies, though the USD remains the most significant component.\n\nThese pegs are fundamental to the GCC's 'Petrodollar' economy, facilitating seamless international trade in the energy sector and providing a predictable environment for foreign direct investment. For residents and visitors, this means that exchange rates between most GCC currencies (like the Qatari Riyal, Saudi Riyal, and UAE Dirham) and the USD do not fluctuate, offering significant financial peace of mind. Our high-fidelity currency converter accounts for these regional specificities, providing real-time data sourced from authoritative financial markets to ensure your conversions are accurate, professional, and relevant to the Middle Eastern economic context.", 
    ar: "يتميز المشهد النقدي لدول مجلس التعاون الخليجي بدرجة عالية من الاستقرار، ويرجع ذلك إلى حد كبير إلى السياسة القائمة منذ فترة طويلة والمتمثلة في ربط العملات الإقليمية بالدولار الأمريكي (USD). يضمن هذا الالتزام الاستراتيجي - الذي تحافظ عليه البنوك المركزية في قطر والمملكة العربية السعودية والإمارات العربية المتحدة وعمان والبحرين - بقاء أسعار الصرف ثابتة ضمن نطاقات ضيقة للغاية. تتبع الكويت نهجاً مختلفاً قليلاً، حيث تربط دينارها بسلة مرجحة من العملات العالمية الرئيسية، على الرغم من أن الدولار يظل المكون الأبرز.\n\nتعد هذه الروابط أساسية لاقتصاد 'البترودولار' في دول مجلس التعاون الخليجي، مما يسهل التجارة الدولية السلسة في قطاع الطاقة ويوفر بيئة يمكن التنبؤ بها للاستثمار الأجنبي المباشر. بالنسبة للمقيمين والزوار، يعني هذا أن أسعار الصرف بين معظم العملات الخليجية (مثل الريال القطري والريال السعودي والدرهم الإماراتي) والدولار الأمريكي لا تتقلب، مما يوفر راحة بال مالية كبيرة. يأخذ محول العملات عالي الدقة لدينا هذه الخصوصيات الإقليمية في الاعتبار، ويوفر بيانات في الوقت الفعلي مستمدة من أسواق مالية موثوقة لضمان أن تحويلاتك دقيقة واحترافية وذات صلة بالسياق الاقتصادي للشرق الأوسط." 
  },
  loadingRates: { en: "Loading rates...", ar: "جاري تحميل الأسعار..." },
  searchCurrency: { en: "Search currency...", ar: "ابحث عن عملة..." },
  favorites: { en: "Favorites", ar: "المفضلة" },
  noResults: { en: "No results found", ar: "لا توجد نتائج" },
  equals: { en: "equals", ar: "يساوي" },
  from: { en: "from", ar: "من" },
  to: { en: "to", ar: "إلى" },
  amount: { en: "Amount", ar: "المبلغ" },

  // Join / Contact Page
  contactUs: { en: "Contact Us", ar: "اتصل بنا" },
  transmitting: { en: "Transmitting...", ar: "جاري الإرسال..." },
  systemError: { en: "System Error. Please try again later.", ar: "حدث خطأ في النظام. يرجى المحاولة لاحقاً." },
  returnHome: { en: "Return Home", ar: "العودة للرئيسية" },
  yourFullName: { en: "Your Full Name...", ar: "اسمك بالكامل..." },
  professionalEmail: { en: "Professional Email Address...", ar: "عنوان بريدك الإلكتروني..." },

  // Survey
  publicSurvey: { en: "Public Survey", ar: "استطلاع رأي" },
  submitVote: { en: "Submit Vote", ar: "إرسال التصويت" },
  nextQuestion: { en: "Next Question", ar: "السؤال التالي" },
  previousQuestion: { en: "Previous Question", ar: "السؤال السابق" },
  featured: { en: "Featured", ar: "مختار" },
  quickConversions: { en: "Quick Conversions", ar: "تحويلات سريعة" },
  inverseRate: { en: "Inverse Rate", ar: "سعر الصرف المعكوس" },
  gccCurrencyRates: { en: "GCC Currency Rates", ar: "أسعار عملات الخليج" },
  lastUpdatedColon: { en: "Last Updated:", ar: "آخر تحديث:" },
  ratesInfoOnly: { en: "Rates for informational purposes only. Verify with local financial institutions for official rates.", ar: "الأسعار لأغراض إعلامية فقط. تحقق من المؤسسات المالية المحلية للأسعار الرسمية." },
  currencyExchangeSchemaName: { en: "Currency Exchange — Live GCC & World Currency Converter", ar: "تحويل العملات — محوّل العملات الخليجية والعالمية المباشر" },
  currencyExchangeSchemaDesc: { en: "Convert between 40+ currencies with live exchange rates. Featuring all GCC currencies, major global pairs, MENA, and Asian currencies.", ar: "حوّل بين أكثر من 40 عملة بأسعار صرف مباشرة. يضم جميع عملات الخليج والعملات العالمية الرئيسية والآسيوية." },
  currencyExchangeDatasetName: { en: "Arabia Khaleej Live Currency Exchange Rates", ar: "أسعار صرف العملات المباشرة من عربية خليج" },
  currencyExchangeDatasetDesc: { en: "Real-time exchange rates for 40+ currencies including all GCC currencies, major pairs, and regional currencies.", ar: "أسعار صرف فورية لأكثر من 40 عملة بما في ذلك جميع عملات الخليج والعملات الرئيسية والعملات الإقليمية." },
  vs1USD: { en: "vs 1 USD", ar: "مقابل 1 دولار أمريكي" },
  vsUSD: { en: "vs USD", ar: "مقابل الدولار" },
  financeSrOnly: { en: "GCC Finance, Market Insights & Currency Exchange Rates", ar: "المالية الخليجية، رؤى السوق وأسعار صرف العملات" },
  swapCurrencies: { en: "Swap currencies", ar: "تبديل العملات" },
  shareResult: { en: "Share result", ar: "مشاركة النتيجة" },
  copyResult: { en: "Copy result", ar: "نسخ النتيجة" },
  refreshRates: { en: "Refresh rates", ar: "تحديث الأسعار" },
  refreshInsights: { en: "Refresh Insights", ar: "تحديث الرؤى" },
  shareArticle: { en: "Share Article", ar: "مشاركة المقال" },
  breadcrumb: { en: "Breadcrumb", ar: "مسار التنقل" },
  ariaLearn: { en: "Learn about Arabia Khaleej", ar: "تعرف على عربية خليج" },
  ariaPrivacy: { en: "View Privacy Policy", ar: "عرض سياسة الخصوصية" },
  ariaTerms: { en: "Read Terms of Service", ar: "قراءة شروط الخدمة" },
  ariaDisclaimer: { en: "Read Legal Disclaimer", ar: "قراءة إخلاء المسؤولية القانونية" },
  ariaContact: { en: "Contact Arabia Khaleej", ar: "اتصل بعربية خليج" },
  homeSchemaName: { en: "Arabia Khaleej — The GCC Standard", ar: "عربية خليج — المعيار الخليجي" },
  homeSchemaDesc: { en: "The definitive independent reference for the Gulf Cooperation Council. Prayer times, market data, and country guides for all 6 GCC states.", ar: "المرجع المستقل النهائي لدول مجلس التعاون الخليجي. مواقيت الصلاة، بيانات السوق، وأدلة الدول لجميع دول مجلس التعاون الخليجي الست." },
  homeDatasetName: { en: "Arabia Khaleej GCC Regional Intelligence", ar: "عربية خليج الاستخبارات الإقليمية الخليجية" },
  homeDatasetDesc: { en: "Comprehensive structured data platform covering Islamic prayer schedules, GCC equity market indices, gold and commodity prices, GCC currency exchange rates, and sovereign country profiles for Qatar, UAE, Saudi Arabia, Kuwait, Oman, and Bahrain.", ar: "منصة بيانات منظمة شاملة تغطي جداول الصلاة الإسلامية، ومؤشرات أسواق الأسهم الخليجية، وأسعار الذهب والسلع، وأسعار صرف العملات الخليجية، وملفات تعريف الدول السيادية لقطر والإمارات والسعودية والكويت وعمان والبحرين." },
  transparencyTitle: { en: "Transparency & Neutrality", ar: "الشفافية والحياد" },
  currencyConversionTitle: { en: "Currency Conversion | Arabia Khaleej", ar: "تحويل العملات | عربية خليج" },

  reviewsCount: { en: "reviews", ar: "مراجعة" },
  closePerspective: { en: "Close Perspective", ar: "إغلاق المنظور" },
  perspectiveModeAR: { en: "Perspective Mode (AR)", ar: "عرض المنظور العربي" },
  perspectiveModeEN: { en: "Perspective Mode (EN)", ar: "عرض المنظور الإنجليزي" },
  translationUnavailable: { en: "No translation available for this article.", ar: "لا توجد ترجمة متاحة لهذا المقال." },
  moreInsights: { en: "More Insights", ar: "المزيد من الرؤى" },
  linkCopied: { en: "Link Copied", ar: "تم نسخ الرابط" },
  shortUpdatedLabel: { en: "Updated %s", ar: "تحديث %s" },

  marketsLiveLabel: { en: "Markets Live", ar: "الأسواق مباشرة" },
  closedSessionLabel: { en: "Closed Session", ar: "جلسة مغلقة" },
  marketOutlookTitle: { en: "GCC Stability with Positive Outlook", ar: "الاستقرار الخليجي مع نظرة إيجابية" },
  marketOutlookDesc: { 
    en: "GCC markets continue to show resilience amid global volatility, supported by strong energy prices.", 
    ar: "تواصل الأسواق الخليجية إظهار المرونة وسط التقلبات العالمية، بدعم من أسعار الطاقة القوية." 
  },
  economicOutlook: { en: "Economic Outlook", ar: "التوقعات الاقتصادية" },
  stabilityGlobalShift: { en: "Stability in a Global Shift", ar: "الاستقرار في ظل التحول العالمي" },
  energyResilience: { en: "Energy Resilience", ar: "مرونة الطاقة" },
  energyResilienceDesc: { 
    en: "Sustained energy prices provide a robust fiscal buffer for GCC nations, enabling continued investment in infrastructure and Vision 2030-style diversification projects.", 
    ar: "توفر أسعار الطاقة المستدامة حاجزاً مالياً قوياً لدول مجلس التعاون الخليجي، مما يسمح بالاستثمار المستمر في البنية التحتية ومشاريع التنويع على غرار رؤية 2030." 
  },
  nonOilGrowth: { en: "Non-Oil Growth", ar: "النمو غير النفطي" },
  nonOilGrowthDesc: { 
    en: "The acceleration of tourism, tech, and manufacturing sectors in Saudi Arabia and the UAE is creating new alpha opportunities beyond traditional energy exports.", 
    ar: "إن تسارع قطاعات السياحة والتكنولوجيا والتصنيع في المملكة العربية السعودية والإمارات العربية المتحدة يخلق فرصاً استثمارية جديدة تتجاوز صادرات الطاقة التقليدية." 
  },

  stabilityIndex: { en: "Stability Index", ar: "مؤشر الاستقرار" },
  currentRatingColon: { en: "Current Rating:", ar: "التصنيف الحالي:" },
  fiscalBuffer: { en: "Fiscal Buffer", ar: "الحاجز المالي" },
  diversificationSpeed: { en: "Diversification Speed", ar: "سرعة التنويع" },
  digitalInfrastructure: { en: "Digital Infrastructure", ar: "البنية التحتية الرقمية" },
  regionalIntegration: { en: "Regional Integration", ar: "التكامل الإقليمي" },
  outlookSummary: { en: "Outlook Summary", ar: "ملخص التوقعات" },
  outlookSummaryBody: { 
    en: "The GCC remains a safe haven for capital seeking stability and structural growth. We maintain a positive outlook for the regional equity markets through 2025.", 
    ar: "تظل دول مجلس التعاون الخليجي ملاذاً آمناً لرؤوس الأموال الباحثة عن الاستقرار والنمو الهيكلي. نحن نحافظ على نظرة إيجابية لأسواق الأسهم الإقليمية حتى عام 2025." 
  },
  backToOverview: { en: "Back to Overview", ar: "العودة للملخص" },
  regionalAnalysis: { en: "Regional Analysis", ar: "التحليل الإقليمي" },

  // Editorial Team
  editorialTeam: { en: "Editorial Leadership", ar: "القيادة التحريرية" },
  editorialLeadership: { en: "Editorial Leadership", ar: "القيادة التحريرية" },
  editorialTeamDesc: { en: "The specialists shaping the regional narrative.", ar: "المتخصصون الذين يشكلون الرواية الإقليمية." },
  
  analyst1Name: { en: "Dr. Faisal Al-Saud", ar: "د. فيصل آل سعود" },
  analyst1Role: { en: "Chief Regional Strategist", ar: "رئيس الاستراتيجيات الإقليمية" },
  analyst1Bio: { en: "Former economic advisor with 15+ years of experience in GCC fiscal policy and national vision alignment.", ar: "مستشار اقتصادي سابق بخبرة تزيد عن 15 عاماً في السياسة المالية لدول مجلس التعاون الخليجي ومواءمة الرؤى الوطنية." },
  
  analyst2Name: { en: "Amna Al-Hashimi", ar: "آمنة الهاشمي" },
  analyst2Role: { en: "Director of Cultural Intelligence", ar: "مديرة الاستخبارات الثقافية" },
  analyst2Bio: { en: "Expert in regional heritage and social transformation, bridging tradition with modern digital excellence.", ar: "خبيرة في التراث الإقليمي والتحول الاجتماعي، تربط التقاليد بالتميز الرقمي الحديث." },
  
  analyst3Name: { en: "Marcus Thorne", ar: "ماركوس ثورن" },
  analyst3Role: { en: "Head of Market Dynamics", ar: "رئيس ديناميكيات السوق" },
  analyst3Bio: { en: "Specialist in emerging markets and GCC equity flows, ensuring high-fidelity financial reporting.", ar: "متخصص في الأسواق الناشئة وتدفقات الأسهم الخليجية، مما يضمن تقارير مالية عالية الدقة." },
};
