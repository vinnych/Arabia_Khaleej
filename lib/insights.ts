import { redis } from './redis';

export interface InsightItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: 'gcc' | 'expat';
  language: 'en' | 'ar' | 'regional';
  image?: string;
  tags?: string[];
  content?: string;
}

/**
 * Hardcoded Base Articles
 */
export const PREMIUM_ARTICLES: Record<string, InsightItem[]> = {
  en: [
    {
      id: "prem-1",
      slug: "cinema-excellence-women",
      title: "The Art of Performance: Leading Movie Actresses of the GCC",
      description: "A refined look at the iconic movie actresses shaping the regional film industry with grace and artistic depth.",
      link: "/insights/cinema-excellence-women",
      pubDate: "2026-04-30T10:00:00Z",
      source: "Arabia Khaleej Premium",
      category: "gcc",
      language: "en",
      image: "/images/insights/cinema-actress.png",
      tags: ["entertainment", "women", "cinema", "lifestyle"],
      content: `# The Art of Performance: Leading Movie Actresses of the GCC

The Gulf Cooperation Council (GCC) region is currently experiencing a profound cultural renaissance, a transformation that is reshaping the artistic identity of the Middle East. At the forefront of this movement is the cinematic industry, which has evolved from a nascent local interest into a sophisticated global force. This evolution is not just about state-of-the-art studios or multimillion-dollar budgets; it is about the storytellers. Specifically, it is about the women of the Gulf who, through their performances on the silver screen, are redefining the narrative of their nations.

## The Historical Foundation: From Stage to Screen

To understand the current success of Gulf actresses, one must look back at the theatrical traditions of Kuwait and the United Arab Emirates. In the 1960s and 70s, theater was the primary medium for social commentary. It was here that legends like **Hayat Al-Fahad** and **Suad Abdullah** built their legacies. Known as the "Giants of Gulf Drama," these women pioneered female performance in a time when the industry was still finding its footing.

Their transition from the stage to television, and eventually to film, provided the blueprint for the modern GCC actress. They proved that performance could be a tool for social progress, tackling complex themes of family, tradition, and the friction of modernization. Today, their influence is seen in every young actress who steps onto a set in Riyadh, Abu Dhabi, or Doha.

## The Saudi Renaissance: A Global Breakout

The most dramatic shift in regional cinema has undoubtedly occurred in Saudi Arabia. With the lifting of the cinema ban in 2018, a floodgate of creative energy was released. **Fatima Al-Banawi** emerged as a central figure in this new era. Her role in *Barakah Meets Barakah* was more than just a performance; it was a cultural moment. Al-Banawi, who is also a social researcher and writer, brings a layer of intellectual depth to her roles that resonates with a global audience. She represents the "New Saudi"—sophisticated, educated, and unapologetically artistic.

Similarly, **Ahd Kamel** has bridged the gap between local storytelling and international production. Her work in the BAFTA-nominated *Wadjda* and the Netflix series *Collateral* has shown that GCC actresses possess the range and skill to compete on any stage. Kamel’s success is a testament to the fact that the stories of the Gulf are universal, touching on themes of ambition, identity, and the human spirit.

## The Emirati and Qatari Impact: Innovation and Vision

In the UAE and Qatar, the focus has been on creating a sustainable ecosystem for film. The Dubai International Film Festival (DIFF) and the Doha Film Institute (DFI) have been instrumental in providing platforms for female talent. Emirati actresses like **Samira Ahmed** and newer talents have benefited from a system that values technical excellence and creative risk-taking.

Qatar’s investment in the arts has also fostered a generation of "visual poets." Here, the line between acting, directing, and producing is often blurred. Women are not just taking roles; they are creating them. This holistic approach to cinema ensures that the female perspective is woven into the very fabric of the production, rather than being an afterthought.

## Profiles in Excellence: Shaping the Narrative

### Fatima Al-Banawi: The Intellectual Muse
Fatima’s approach to acting is deeply rooted in her background in psychology and social work. When she takes on a role, she isn't just reciting lines; she is conducting a study of the human condition. Her performances are characterized by a subtle intensity that has made her a favorite of both local directors and international festival circuits.

### Mila Al-Zahrani: The Leading Lady of the New Era
Mila Al-Zahrani’s performance in *The Perfect Candidate* (directed by Haifaa al-Mansour) was a powerhouse display of talent. Playing a young doctor who runs for local office, Al-Zahrani captured the spirit of a nation in transition. Her ability to convey both vulnerability and iron-clad determination has established her as one of the most important actresses of her generation.

## Challenges and Triumphs: Navigating a Changing Landscape

Despite the rapid growth, the path for actresses in the GCC is not without its challenges. Navigating the balance between cultural expectations and artistic freedom requires grace and persistence. However, these challenges have only served to sharpen the resolve of the region’s talent. The "Gulf style" of acting is becoming recognized for its authenticity—a raw, honest portrayal of life that avoids the clichés often associated with Middle Eastern cinema in the West.

## The Future: A Sustainable Legacy

The future of Gulf cinema lies in the hands of these women. As more film schools open in the region and government support for the creative arts continues to grow, the next generation of actresses will enter an industry that is more robust and globally integrated than ever before. 

We are moving toward a time when a "GCC film" is a mark of quality recognized at Cannes, Venice, and the Oscars. And at the center of that recognition will be the actresses—the women who dared to perform, who dared to tell their stories, and who, in doing so, changed the world’s perception of the Gulf forever.

The Art of Performance in the GCC is no longer a silent beauty; it is a loud, vibrant, and essential part of the global cinematic conversation. As we look forward to the next decade, one thing is certain: the leading ladies of the Gulf have only just begun.`
    },
    {
      id: "prem-2",
      slug: "saudi-vision-2030-neom",
      title: "The Line: Redefining Urban Living in the Heart of Tabuk",
      description: "How Saudi Arabia's $500 billion mega-city NEOM is setting a new global standard for sustainable urbanism and cognitive technology.",
      link: "/insights/saudi-vision-2030-neom",
      pubDate: "2026-04-29T14:30:00Z",
      source: "Arabia Khaleej Premium",
      category: "gcc",
      language: "en",
      image: "/images/insights/neom.png",
      tags: ["economy", "vision2030", "technology", "sustainability"],
      content: `# The Line: Redefining Urban Living in the Heart of Tabuk

NEOM is not just a city; it is a blueprint for how people and planet can coexist in harmony. At its heart lies 'The Line' — a 170km long cognitive city that operates on 100% renewable energy and preserves 95% of the surrounding nature. It is the centerpiece of Saudi Vision 2030, a project so ambitious that it challenges the very definition of a "city" in the 21st century.

## A Revolution in Urbanism: The End of the Sprawl

Traditional cities are designed for cars, leading to urban sprawl, long commutes, and significant environmental footprints. The Line flips this script entirely. By building vertically and linearly, NEOM eliminates the need for roads, cars, and the emissions that come with them. It is a mirrored architectural marvel that stretches across the desert, mountains, and coast of northwestern Saudi Arabia, yet it occupies a footprint of just 34 square kilometers.

The design is based on the concept of "Zero Gravity Urbanism." This approach layers city functions vertically while giving people the possibility of moving seamlessly in three dimensions (up, down, or across) to access them. Unlike simple tall buildings, this concept layers public parks and pedestrian areas, schools, homes, and places for work, so that one can effortlessly reach all daily needs within five minutes.

## The Cognitive City: Intelligence Beyond Smart

While many modern cities are described as "smart," The Line is "cognitive." In a smart city, technology is used to improve existing infrastructure. In a cognitive city, technology *is* the infrastructure. The Line uses Artificial Intelligence and data science to provide services and infrastructure that anticipate the needs of its residents. 

Data is the lifeblood of The Line. With the consent of residents, AI systems will analyze environmental data, traffic patterns (for the high-speed rail), and utility usage to optimize the city's performance in real-time. This level of integration ensures that the city is always evolving, becoming more efficient and responsive to the human experience with every passing second.

Everything you need is within a five-minute walk. For longer distances, an ultra-high-speed transit system will transport residents from end to end in just 20 minutes. This means that for the first time in modern history, the concept of a "commute" will become a relic of the past, freeing up hours of time every day for leisure, family, and personal growth.

## Sustainability: A Global Beacon for Green Technology

The Line is built on a foundation of 100% renewable energy. This is not just a goal; it is a requirement. Solar, wind, and hydrogen power will fuel the city's every need. Furthermore, the city’s design protects the surrounding environment. By consolidating the urban footprint into a narrow line, 95% of the land within NEOM will be preserved for nature.

Water management is another area where The Line leads the world. Through advanced desalination techniques and a "zero-liquid-discharge" policy, the city will recycle 100% of its wastewater. This circular economy approach ensures that not a single drop is wasted, a critical innovation for a region where water is a precious resource.

## Economic Impact: Powering the Kingdom’s Future

As a cornerstone of Vision 2030, NEOM is expected to contribute $48 billion to the Kingdom’s GDP and create 380,000 jobs by 2030. But the impact goes beyond numbers. NEOM is designed to be a hub for innovation, attracting the world’s brightest minds in sectors like biotech, media, and manufacturing.

By providing a regulatory environment that is designed specifically for innovation, NEOM will allow for the testing of new technologies and business models that would be impossible elsewhere. It is a living laboratory for the future of work and industry.

## Living in the Future: The Resident Experience

What does it feel like to live in The Line? Imagine waking up in a home where the temperature and lighting are perfectly tuned to your circadian rhythm. You step outside onto a balcony that overlooks a lush, vertical garden. Your child’s school is three levels down, accessible by a glass-walled elevator that offers views of the Red Sea.

Your workplace is a short walk through a park that is kept cool by natural ventilation and advanced cooling technologies. After work, you meet friends at a restaurant that sources its produce from vertical farms located within the city walls. The food is fresh, the air is clean, and the pace of life is dictated by human needs, not the demands of a combustion engine.

## Conclusion: A Testament to Human Ambition

The Line is more than an engineering project; it is a statement of hope. It is a testament to the Kingdom's ambition to lead the world in green technology and futuristic living. While the project has its skeptics, the sheer scale of the vision is a reminder that humanity has the capacity to solve the greatest challenges of our time—if we are brave enough to dream.

As the first sections of The Line begin to rise from the sands of Tabuk, the world is watching. Saudi Arabia is not just building a city; it is building the future. And for those who will call it home, life will never be the same again.`
    },
    {
      id: "prem-3",
      slug: "uae-mars-mission-legacy",
      title: "Beyond the Horizon: The UAE's Journey to the Red Planet",
      description: "Celebrating the success of the Hope Probe and the Emirates Mars Mission as it continues to provide groundbreaking data to the global scientific community.",
      link: "/insights/uae-mars-mission-legacy",
      pubDate: "2026-04-28T09:00:00Z",
      source: "Arabia Khaleej Premium",
      category: "gcc",
      language: "en",
      image: "/images/insights/uae-mars.png",
      tags: ["technology", "space", "innovation"],
      content: `# Beyond the Horizon: The UAE's Journey to the Red Planet

The Hope Probe has been orbiting Mars since early 2021, providing the first complete picture of the Martian atmosphere. This mission marks a historic milestone for the Arab world, proving that ambition and scientific excellence know no boundaries. It is not just a mission for the United Arab Emirates, but a message of hope for the entire region—a testament to what can be achieved when a nation invests in its youth and its future.

## A Visionary Leap: From Desert Sands to Deep Space

The Emirates Mars Mission (EMM) was announced in 2014, with the goal of reaching Mars by the UAE’s 50th anniversary in 2021. For a nation that was founded only five decades ago, the jump from developing infrastructure and energy sectors to interplanetary exploration was nothing short of miraculous. However, for the UAE leadership, it was a logical step in the country's evolution toward a knowledge-based economy.

The project was managed by the Mohammed bin Rashid Space Centre (MBRSC) and developed in collaboration with international academic partners. This collaborative approach was key; the UAE did not want to simply buy a spacecraft, but to build one alongside experts, ensuring that the knowledge and skills remained within the Emirati scientific community.

## The Hope Probe: A Scientific Powerhouse

The spacecraft itself, named 'Al-Amal' (Hope), is roughly the size and weight of a small car. It carries three sophisticated scientific instruments:
1.  **EXI (Emirates exploration Imager)**: A multi-band camera capable of taking high-resolution images of Mars while measuring water ice and ozone in the lower atmosphere.
2.  **EMIRS (Emirates Mars InfraRed Spectrometer)**: An instrument that measures the distribution of dust, ice clouds, and water vapor in the lower Martian atmosphere.
3.  **EMUS (Emirates Mars Ultraviolet Spectrometer)**: Designed to measure the global characteristics and variability of hydrogen and oxygen in the Martian upper atmosphere.

Together, these instruments provide a unique perspective. Unlike previous missions that focused on specific locations or times of day, Hope orbits Mars in a high, elliptical path that allows it to capture a "weather map" of the entire planet every few days. This allows scientists to see how dust storms, clouds, and temperature changes move across the planet over the course of a Martian year.

## A Global Scientific Contribution: Open Data for the World

One of the most remarkable aspects of the Emirates Mars Mission is its commitment to open science. From the very beginning, the UAE pledged to share all data collected by the Hope Probe with the global scientific community without any embargo.

To date, the mission has shared over 2.5 terabytes of data with more than 200 scientific institutions worldwide. This data has led to groundbreaking discoveries about the Martian atmosphere, including the observation of the "discrete aurora"—a mysterious phenomenon in the Martian night sky that had never been seen in such detail before. By studying the relationship between the upper and lower layers of the atmosphere, the mission is helping scientists understand why Mars is losing its atmosphere to space, a key question in understanding the planet's history and potential for past life.

## Inspiring a Generation: The "Hope" Effect

Beyond the scientific and technical achievements, the primary goal of the mission was to inspire the youth of the UAE and the wider Arab world. The mission was launched with the slogan "The Arab World to Mars," and its impact on education has been profound.

Since the mission’s inception, there has been a significant increase in the number of students enrolling in STEM (Science, Technology, Engineering, and Mathematics) programs across the region. The mission has shown that Arab scientists and engineers can lead world-class projects, breaking down stereotypes and fostering a new sense of pride and ambition. The team behind the mission was notably young, with an average age of 27, and 34% of the team were women—a figure far higher than the global average for space missions.

## The Legacy of Hope: Reclaiming the Golden Age

The Emirates Mars Mission is often cited as a modern-day revival of the "Golden Age" of Arab science, a period when the Arab world was the global center of mathematical, astronomical, and medical inquiry. By reaching the Red Planet, the UAE has sent a powerful message: that the region is ready to reclaim its place at the forefront of human discovery.

The success of Hope has paved the way for even more ambitious projects, including the recently announced mission to explore the asteroid belt and the "Mars 2117" project, which aims to build the first human settlement on Mars within the next century.

## Conclusion: A Mission That Never Ends

As the Hope Probe continues its silent vigil around Mars, its legacy is already written in the hearts of millions. It has proven that the impossible is possible with vision, collaboration, and persistence. The mission's success is not measured only in the data it sends back, but in the dreams it has ignited. 

For the UAE, the journey to Mars was never the destination—it was the beginning of a new chapter in human history. A chapter where a small nation from the desert can look up at the stars and say, with full confidence, "We are here."`
    },
    {
      id: "prem-4",
      slug: "qatar-sports-legacy-hub",
      title: "The Sports Capital: Qatar's Evolution Post-2022",
      description: "Exploring how Qatar has leveraged its World Cup infrastructure to become the world's premier destination for high-performance training and international athletics.",
      link: "/insights/qatar-sports-legacy-hub",
      pubDate: "2026-04-27T11:20:00Z",
      source: "Arabia Khaleej Premium",
      category: "gcc",
      language: "en",
      image: "/images/insights/qatar-sports.png",
      tags: ["sports", "legacy", "tourism"],
      content: `# The Sports Capital: Qatar's Legacy Post-2022

Following the success of the FIFA World Cup 2022, Qatar has transformed its state-of-the-art stadiums and facilities into a sustainable sports ecosystem. This is not just about the memory of a tournament; it is about the birth of a global sports powerhouse. Today, Qatar stands as the world's premier destination for high-performance training, sports medicine, and international athletics.

## Beyond the Final Whistle: A Strategy for Permanence

When Qatar won the bid to host the World Cup in 2010, the global community was skeptical. How could a small peninsula in the Gulf host the world’s largest sporting event? The answer lay in a clear, long-term vision that extended far beyond the final match at Lusail Stadium. The strategy was to build an ecosystem, not just a set of venues.

Every stadium was designed with a post-tournament purpose. For example, the iconic Stadium 974, constructed from shipping containers, was designed to be completely dismantled and repurposed—a global first in sustainable tournament architecture. Other stadiums have seen their seating capacities reduced, with the extra space being converted into community hubs, hotels, and schools, ensuring that the infrastructure serves the people of Qatar for decades to come.

## The Heart of Performance: Aspire Zone and Beyond

At the center of Qatar’s sports excellence is the Aspire Zone, a 2.5 square kilometer complex that includes the Aspire Academy for Sports Excellence, Aspetar (the world-leading sports medicine hospital), and the Khalifa International Stadium.

Aspetar, in particular, has become a global magnet for elite athletes. From Premier League footballers to Olympic sprinters, the world’s best travel to Doha to benefit from cutting-edge sports science and rehabilitation. The integration of high-level coaching, medical expertise, and state-of-the-art facilities in a single location provides an environment for performance optimization that is virtually unmatched anywhere else in the world.

## A Destination for Global Elite Training

In recent years, Qatar has become the preferred winter training ground for many of the world's top football clubs, including Bayern Munich, Paris Saint-Germain, and various national teams. The combination of perfect winter weather, privacy, and world-class pitches allows teams to prepare for the second half of their seasons in optimal conditions.

But it’s not just about football. The Lusail International Circuit has become a staple of the Formula 1 and MotoGP calendars, while the Khalifa International Tennis and Squash Complex hosts some of the most prestigious tournaments on the ATP and WTA tours. Qatar has shown that it has the operational expertise to host any sport, at any scale, with flawless execution.

## Sports Diplomacy: Building Bridges Through Competition

For Qatar, sport is also a vital tool for diplomacy and national branding. By hosting major events like the Asian Cup, the World Aquatics Championships, and the upcoming 2027 FIBA Basketball World Cup, Qatar is positioning itself as a neutral ground where the world can come together through the universal language of competition.

This "sports diplomacy" helps build international relationships and promotes a positive image of the region. It also fosters a culture of health and wellness within the local population, as young Qataris are inspired by seeing the world's best athletes compete in their own backyard.

## Future Ambitions: The Path to the Olympics?

The success of the 2022 World Cup has naturally led to speculation about Qatar’s next move. Many analysts believe that the ultimate goal is to bring the Olympic Games to the Middle East for the first time. With the infrastructure already in place and a proven track record of hosting large-scale events, Doha is a strong contender for future editions of the Games.

Beyond the Olympics, Qatar is investing heavily in the "business of sport." The Qatar Investment Authority (QIA) has taken stakes in major global sports entities, further integrating the nation into the global sports economy.

## Conclusion: A Masterclass in Vision and Investment

The journey of Qatar from a regional state to a global sports powerhouse is a masterclass in strategic investment. It shows what can be achieved when a clear vision is backed by the resources and the political will to see it through. 

Today, as you walk through the Aspire Zone or visit the shores of Lusail, you don't just see stadiums; you see the legacy of a nation that dared to think big. Qatar’s sports legacy is not a chapter that ended in December 2022—it is a story that is still being written, and the world is eagerly waiting to see what the next chapter holds.`
    },
  ],
  ar: [
    {
      id: "prem-1-ar",
      slug: "cinema-excellence-women",
      title: "فن الأداء: أبرز ممثلات السينما في دول الخليج",
      description: "نظرة راقية على ممثلات السينما اللواتي يشكلن صناعة الأفلام الإقليمية بالنعمة والعمق الفني.",
      link: "/insights/cinema-excellence-women",
      pubDate: "2026-04-30T10:00:00Z",
      source: "عربية خليج بريميوم",
      category: "gcc",
      language: "ar",
      image: "/images/insights/cinema-actress.png",
      tags: ["entertainment", "women", "cinema", "lifestyle"],
      content: `# فن الأداء: أبرز ممثلات السينما في دول مجلس التعاون الخليجي

تشهد منطقة دول مجلس التعاون الخليجي حالياً نهضة ثقافية عميقة، وهي تحول يعيد صياغة الهوية الفنية للشرق الأوسط. وفي طليعة هذه الحركة تأتي الصناعة السينمائية، التي تطورت من مجرد اهتمام محلي ناشئ إلى قوة عالمية متطورة. هذا التطور لا يتعلق فقط بالاستوديوهات الحديثة أو الميزانيات التي تبلغ ملايين الدولارات؛ بل يتعلق برواة القصص. وتحديداً، يتعلق الأمر بنساء الخليج اللواتي، من خلال أدائهن على الشاشة الفضية، يَعِدْنَ تعريف رواية أممهن.

## الأساس التاريخي: من المسرح إلى الشاشة

لفهم النجاح الحالي للممثلات الخليجيات، يجب على المرء أن ينظر إلى التقاليد المسرحية في الكويت والإمارات العربية المتحدة. في الستينيات والسبعينيات، كان المسرح هو الوسيلة الأساسية للتعليق الاجتماعي. وهنا بنت أساطير مثل **حياة الفهد** و**سعاد عبد الله** إرثهما. عُرفت هاتان المرأتان بـ "عمالقة الدراما الخليجية"، وقد رادتا الأداء النسائي في وقت كانت فيه الصناعة لا تزال تتحسس خطواتها.

قدم انتقالهن من المسرح إلى التلفزيون، وفي النهاية إلى السينما، المخطط للممثلة الخليجية الحديثة. لقد أثبتن أن الأداء يمكن أن يكون أداة للتقدم الاجتماعي، حيث تناولن موضوعات معقدة تتعلق بالأسرة والتقاليد واحتكاك التحديث. اليوم، يظهر تأثيرهن في كل ممثلة شابة تخطو إلى موقع تصوير في الرياض أو أبو ظبي أو الدوحة.

## النهضة السعودية: انطلاقة عالمية

مما لا شك فيه أن التحول الأكثر دراماتيكية في السينما الإقليمية قد حدث في المملكة العربية السعودية. ومع رفع الحظر عن السينما في عام 2018، انطلقت موجة عارمة من الطاقة الإبداعية. برزت **فاطمة البنوي** كشخصية محورية في هذا العصر الجديد. كان دورها في فيلم *بركة يقابل بركة* أكثر من مجرد أداء؛ لقد كانت لحظة ثقافية. تجلب البنوي، وهي أيضاً باحثة اجتماعية وكاتبة، طبقة من العمق الفكري لأدوارها يتردد صداها لدى جمهور عالمي. إنها تمثل "السعودية الجديدة" — المتطورة والمتعلمة والفنية بلا خجل.

وبالمثل، جسدت **عهد كامل** الفجوة بين سرد القصص المحلي والإنتاج الدولي. أظهر عملها في فيلم *وجدة* المرشح لجائزة بافتا ومسلسل *Collateral* على نتفليكس أن الممثلات الخليجيات يمتلكن المدى والمهارة للمنافسة على أي مسرح. إن نجاح كامل هو شهادة على حقيقة أن قصص الخليج عالمية، وتلامس موضوعات الطموح والهوية والروح الإنسانية.

## التأثير الإماراتي والقطري: ابتكار ورؤية

في الإمارات وقطر، كان التركيز على إنشاء نظام بيئي مستدام للفيلم. كان مهرجان دبي السينمائي الدولي ومؤسسة الدوحة للأفلام فعالين في توفير منصات للمواهب النسائية. استفادت الممثلات الإماراتيات مثل **سميرة أحمد** والمواهب الأحدث من نظام يقدر التميز التقني والمخاطرة الإبداعية.

كما عزز استثمار قطر في الفنون جيلاً من "الشعراء البصريين". هنا، غالباً ما يتلاشى الخط الفاصل بين التمثيل والإخراج والإنتاج. النساء لا يأخذن أدواراً فحسب؛ بل يصنعنها. يضمن هذا النهج الشامل للسينما أن المنظور النسائي منسوج في نسيج الإنتاج، بدلاً من أن يكون فكرة لاحقة.

## ملامح التميز: صياغة الرواية

### فاطمة البنوي: الملهمة الفكرية
نهج فاطمة في التمثيل متجذر بعمق في خلفيتها في علم النفس والعمل الاجتماعي. عندما تأخذ دوراً، فهي لا تقوم فقط بتلاوة السطور؛ إنها تجري دراسة للحالة الإنسانية. تتميز عروضها بكثافة خفية جعلتها مفضلة لدى كل من المخرجين المحليين ودوائر المهرجانات الدولية.

### ميلا الزهراني: بطلة العصر الجديد
كان أداء ميلا الزهراني في فيلم *المرشحة المثالية* (من إخراج هيفاء المنصور) عرضاً قوياً للموهبة. من خلال لعب دور طبيبة شابة تترشح لمنصب محلي، جسدت الزهراني روح أمة في مرحلة انتقال. إن قدرتها على نقل كل من الضعف والتصميم الحديدي جعلتها واحدة من أهم الممثلات في جيلها.

## التحديات والانتصارات: التنقل في مشهد متغير

على الرغم من النمو السريع، فإن الطريق للممثلات في دول مجلس التعاون الخليجي لا يخلو من التحديات. يتطلب التنقل في التوازن بين التوقعات الثقافية والحرية الفنية نعمة وإصراراً. ومع ذلك، لم تكن هذه التحديات إلا لتقوية عزيمة مواهب المنطقة. أصبح "الأسلوب الخليجي" في التمثيل معترفاً به لأصالته — تصوير خام وصادق للحياة يتجنب الكليشيهات المرتبطة غالباً بالسينما الشرق أوسطية في الغرب.

## المستقبل: إرث مستدام

مستقبل السينما الخليجية يكمن في أيدي هؤلاء النساء. مع افتتاح المزيد من مدارس السينما في المنطقة واستمرار الدعم الحكومي للفنون الإبداعية، سيدخل الجيل القادم من الممثلات صناعة أكثر قوة وتكاملاً عالمياً من أي وقت مضى.

نحن نتحرك نحو وقت تكون فيه "أفلام دول مجلس التعاون الخليجي" علامة على الجودة المعترف بها في كان وفينيسيا والأوسكار. وفي قلب هذا الاعتراف ستكون الممثلات — النساء اللواتي تجرأن على الأداء، وتجرأن على رواية قصصهن، وبذلك غيرن نظرة العالم للخليج إلى الأبد.

لم يعد فن الأداء في دول مجلس التعاون الخليجي جمالاً صامتاً؛ إنه جزء صاخب وحيوي وأساسي من المحادثة السينمائية العالمية. وبينما نتطلع إلى العقد القادم، هناك شيء واحد مؤكد: بطلات الخليج قد بدأن للتو.`
    },
    {
      id: "prem-2-ar",
      slug: "saudi-vision-2030-neom",
      title: "ذا لاين: إعادة تعريف الحياة الحضرية في قلب تبوك",
      description: "كيف تضع مدينة نيوم العملاقة بقيمة 500 مليار دولار معياراً عالمياً جديداً للتحضر المستدام والتكنولوجيا الإدراكية.",
      link: "/insights/saudi-vision-2030-neom",
      pubDate: "2026-04-29T14:30:00Z",
      source: "عربية خليج بريميوم",
      category: "gcc",
      language: "ar",
      image: "/images/insights/neom.png",
      tags: ["economy", "vision2030", "technology", "sustainability"],
      content: `# ذا لاين: إعادة تعريف الحياة الحضرية في قلب تبوك

نيوم ليست مجرد مدينة؛ إنها مخطط لكيفية تعايش الناس والكوكب في وئام. في قلبها يكمن 'ذا لاين' — وهي مدينة إدراكية بطول 170 كم تعمل بطاقة متجددة بنسبة 100٪ وتحافظ على 95٪ من الطبيعة المحيطة. إنها القطعة المركزية في رؤية السعودية 2030، وهو مشروع طموح للغاية لدرجة أنه يتحدى التعريف ذاته لـ "المدينة" في القرن الحادي والعشرين.

## ثورة في العمران: نهاية التوسع الأفقي

صُممت المدن التقليدية للسيارات، مما أدى إلى التوسع الحضري العشوائي، والرحلات الطويلة للعمل، وبصمة بيئية كبيرة. يقلب 'ذا لاين' هذا السيناريو تماماً. من خلال البناء عمودياً وخطياً، يلغي 'ذا لاين' الحاجة إلى الطرق والسيارات والانبعاثات الناتجة عنها. إنها أعجوبة معمارية مرآتية تمتد عبر الصحراء والجبال وساحل شمال غرب المملكة العربية السعودية، ومع ذلك فهي تشغل مساحة 34 كيلومتراً مربعاً فقط.

يعتمد التصميم على مفهوم "عمران الجاذبية الصفرية". يوزع هذا النهج وظائف المدينة في طبقات عمودية بينما يمنح الناس إمكانية التحرك بسلاسة في ثلاثة أبعاد (لأعلى أو لأسفل أو عبرها) للوصول إليها. على عكس المباني الشاهقة البسيطة، يوزع هذا المفهوم المتنزهات العامة والمناطق المخصصة للمشاة والمدارس والمنازل وأماكن العمل في طبقات، بحيث يمكن للمرء الوصول بسهولة إلى جميع الاحتياجات اليومية في غضون خمس دقائق.

## المدينة الإدراكية: ذكاء يتجاوز المدن الذكية

بينما تُوصف العديد من المدن الحديثة بأنها "ذكية"، فإن 'ذا لاين' هي مدينة "إدراكية". في المدينة الذكية، تُستخدم التكنولوجيا لتحسين البنية التحتية الحالية. في المدينة الإدراكية، التكنولوجيا *هي* البنية التحتية. يستخدم 'ذا لاين' الذكاء الاصطناعي وعلوم البيانات لتوفير الخدمات والبنية التحتية التي تتوقع احتياجات سكانها.

البيانات هي شريان الحياة في 'ذا لاين'. بموافقة السكان، ستقوم أنظمة الذكاء الاصطناعي بتحليل البيانات البيئية، وأنماط الحركة (للقطار فائق السرعة)، واستخدام المرافق لتحسين أداء المدينة في الوقت الفعلي. يضمن هذا المستوى من التكامل أن المدينة تتطور دائماً، وتصبح أكثر كفاءة واستجابة للتجربة الإنسانية مع كل ثانية تمر.

كل ما تحتاجه يقع على بعد خمس دقائق سيراً على الأقدام. وللمسافات الأطول، سينقل نظام النقل فائق السرعة السكان من طرف إلى آخر في 20 دقيقة فقط. وهذا يعني أنه لأول مرة في التاريخ الحديث، سيصبح مفهوم "التنقل للعمل" من مخلفات الماضي، مما يوفر ساعات من الوقت كل يوم للترفيه والأسرة والنمو الشخصي.

## الاستدامة: منارة عالمية للتكنولوجيا الخضراء

بُني 'ذا لاين' على أساس من الطاقة المتجددة بنسبة 100٪. هذا ليس مجرد هدف؛ إنه متطلب. ستغذي الطاقة الشمسية والرياح والهيدروجين كل احتياجات المدينة. علاوة على ذلك، يحمي تصميم المدينة البيئة المحيطة. من خلال دمج البصمة الحضرية في خط ضيق، سيتم الحفاظ على 95٪ من الأراضي داخل نيوم للطبيعة.

إدارة المياه هي مجال آخر يقود فيه 'ذا لاين' العالم. من خلال تقنيات التحلية المتقدمة وسياسة "صفر تصريف للسوائل"، ستعيد المدينة تدوير 100٪ من مياه الصرف الصحي. يضمن نهج الاقتصاد الدائري هذا عدم إهدار قطرة واحدة، وهو ابتكار حيوي لمنطقة تعتبر فيها المياه مورداً ثميناً.

## التأثير الاقتصادي: تعزيز مستقبل المملكة

باعتبارها حجر الزاوية في رؤية 2030، من المتوقع أن تساهم نيوم بمبلغ 48 مليار دولار في الناتج المحلي الإجمالي للمملكة وتوفر 380 ألف وظيفة بحلول عام 2030. لكن التأثير يتجاوز الأرقام. صُممت نيوم لتكون مركزاً للابتكار، وتجذب ألمع العقول في العالم في قطاعات مثل التكنولوجيا الحيوية والإعلام والتصنيع.

من خلال توفير بيئة تنظيمية مصممة خصيصاً للابتكار، ستسمح نيوم باختبار تقنيات ونماذج أعمال جديدة قد تكون مستحيلة في مكان آخر. إنها مختبر حي لمستقبل العمل والصناعة.

## العيش في المستقبل: تجربة السكان

كيف تشعر بالعيش في 'ذا لاين'؟ تخيل أنك تستيقظ في منزل حيث يتم ضبط درجة الحرارة والإضاءة بشكل مثالي ليتناسب مع إيقاعك البيولوجي. تخرج إلى شرفة تطل على حديقة عمودية مورقة. تقع مدرسة طفلك على بعد ثلاثة مستويات للأسفل، ويمكن الوصول إليها بواسطة مصعد زجاجي يوفر مناظر خلابة للبحر الأحمر.

يقع مكان عملك على بعد مسافة قصيرة سيراً على الأقدام عبر حديقة تظل باردة بفضل التهوية الطبيعية وتقنيات التبريد المتقدمة. بعد العمل، تلتقي بالأصدقاء في مطعم يحصل على منتجاته من المزارع العمودية الموجودة داخل جدران المدينة. الطعام طازج، والهواء نظيف، ووتيرة الحياة تمليها الاحتياجات البشرية، وليس متطلبات محرك الاحتراق.

## الخاتمة: شهادة على الطموح البشري

'ذا لاين' هو أكثر من مجرد مشروع هندسي؛ إنه بيان أمل. إنه شهادة على طموح المملكة في قيادة العالم في التكنولوجيا الخضراء والحياة المستقبلية. وبينما يواجه المشروع مشككين، فإن حجم الرؤية يذكرنا بأن البشرية لديها القدرة على حل أعظم تحديات عصرنا — إذا كنا شجعاناً بما يكفي للحلم.

بينما تبدأ الأقسام الأولى من 'ذا لاين' في الارتفاع من رمال تبوك، يراقب العالم. المملكة العربية السعودية لا تبني مدينة فحسب؛ إنها تبني المستقبل. وبالنسبة لأولئك الذين سيسمونها وطناً، لن تكون الحياة هي نفسها أبداً مرة أخرى.`
    },
    {
      id: "prem-3-ar",
      slug: "uae-mars-mission-legacy",
      title: "ما وراء الأفق: رحلة الإمارات إلى الكوكب الأحمر",
      description: "الاحتفاء بنجاح مسبار الأمل ومهمة الإمارات لاستكشاف المريخ وهي تواصل تقديم بيانات رائدة للمجتمع العلمي العالمي.",
      link: "/insights/uae-mars-mission-legacy",
      pubDate: "2026-04-28T09:00:00Z",
      source: "عربية خليج بريميوم",
      category: "gcc",
      language: "ar",
      image: "/images/insights/uae-mars.png",
      tags: ["technology", "space", "innovation"],
      content: `# ما وراء الأفق: مهمة الإمارات لاستكشاف المريخ

يدور مسبار الأمل حول المريخ منذ أوائل عام 2021، حيث يقدم أول صورة كاملة للغلاف الجوي للمريخ. تمثل هذه المهمة علامة تاريخية للعالم العربي، تثبت أن الطموح والتميز العلمي لا يعرفان حدوداً. إنها ليست مجرد مهمة لدولة الإمارات العربية المتحدة، بل هي رسالة أمل للمنطقة بأسرها — شهادة على ما يمكن تحقيقه عندما تستثمر أمة في شبابها ومستقبلها.

## قفزة رؤيوية: من رمال الصحراء إلى الفضاء العميق

أُعلن عن مهمة الإمارات للمريخ (EMM) في عام 2014، بهدف الوصول إلى المريخ بحلول الذكرى الخمسين لتأسيس دولة الإمارات في عام 2021. بالنسبة لأمة تأسست قبل خمسة عقود فقط، لم تكن القفزة من تطوير البنية التحتية وقطاعات الطاقة إلى استكشاف الكواكب أقل من إعجاز. ومع ذلك، بالنسبة للقيادة الإماراتية، كانت خطوة منطقية في تطور البلاد نحو اقتصاد قائم على المعرفة.

أدار المشروع مركز محمد بن راشد للفضاء (MBRSC) وتم تطويره بالتعاون مع شركاء أكاديميين دوليين. كان هذا النهج التعاوني أساسياً؛ لم تكن الإمارات ترغب في مجرد شراء مركبة فضائية، بل في بناء واحدة جنباً إلى جنب مع الخبراء، لضمان بقاء المعرفة والمهارات داخل المجتمع العلمي الإماراتي.

## مسبار الأمل: قوة علمية ضاربة

المركبة الفضائية نفسها، المسماة "الأمل"، تقارب في حجمها ووزنها سيارة صغيرة. وتحمل ثلاثة أجهزة علمية متطورة:
1.  **EXI (كاميرا الاستكشاف الرقمية)**: كاميرا متعددة النطاقات قادرة على التقاط صور عالية الدقة للمريخ مع قياس الجليد المائي والأوزون في الغلاف الجوي السفلي.
2.  **EMIRS (المقياس الطيفي بالأشعة تحت الحمراء)**: جهاز يقيس توزيع الغبار وسحب الجليد وبخار الماء في الغلاف الجوي السفلي للمريخ.
3.  **EMUS (المقياس الطيفي بالأشعة فوق البنفسجية)**: مصمم لقياس الخصائص العالمية وتغير الهيدروجين والأكسجين في الغلاف الجوي العلوي للمريخ.

معاً، توفر هذه الأجهزة منظوراً فريداً. على عكس المهام السابقة التي ركزت على مواقع أو أوقات محددة من اليوم، يدور مسبار الأمل حول المريخ في مسار بيضاوي عالٍ يسمح له بالتقاط "خريطة طقس" للكوكب بأكمله كل بضعة أيام. وهذا يسمح للعلماء برؤية كيف تتحرك العواصف الترابية والسحب وتغيرات درجات الحرارة عبر الكوكب على مدار عام مريخي كامل.

## مساهمة علمية عالمية: بيانات مفتوحة للعالم

من أبرز جوانب مهمة الإمارات للمريخ هو التزامها بالعلم المفتوح. منذ البداية، تعهدت الإمارات بمشاركة جميع البيانات التي جمعها مسبار الأمل مع المجتمع العلمي العالمي دون أي حظر.

حتى الآن، شاركت المهمة أكثر من 2.5 تيرابايت من البيانات مع أكثر من 200 مؤسسة علمية حول العالم. أدت هذه البيانات إلى اكتشافات رائدة حول الغلاف الجوي للمريخ، بما في ذلك ملاحظة "الشفق المنفصل" — وهي ظاهرة غامضة في سماء المريخ الليلية لم يسبق رؤيتها بهذا التفصيل من قبل. من خلال دراسة العلاقة بين الطبقات العليا والسفلى من الغلاف الجوي، تساعد المهمة العلماء على فهم سبب فقدان المريخ لغلافه الجوي في الفضاء، وهو سؤال رئيسي في فهم تاريخ الكوكب وإمكانيات وجود حياة سابقة فيه.

## إلهام جيل: تأثير "الأمل"

بعيداً عن الإنجازات العلمية والتقنية، كان الهدف الأساسي للمهمة هو إلهام شباب الإمارات والعالم العربي الأوسع. أُطلقت المهمة بشعار "العرب إلى المريخ"، وكان تأثيرها على التعليم عميقاً.

منذ بداية المهمة، كانت هناك زيادة كبيرة في عدد الطلاب المسجلين في برامج العلوم والتكنولوجيا والهندسة والرياضيات (STEM) في جميع أنحاء المنطقة. أظهرت المهمة أن العلماء والمهندسين العرب يمكنهم قيادة مشاريع عالمية المستوى، مما كسر الصور النمطية وعزز شعوراً جديداً بالفخر والطموح. كان الفريق الذي يقف وراء المهمة شاباً بشكل ملحوظ، بمتوسط عمر 27 عاماً، وكانت 34٪ من الفريق نساء — وهي نسبة أعلى بكثير من المتوسط العالمي لمهام الفضاء.

## إرث الأمل: استعادة العصر الذهبي

غالباً ما يُشار إلى مهمة الإمارات للمريخ كإحياء معاصر لـ "العصر الذهبي" للعلوم العربية، وهي فترة كان فيها العالم العربي المركز العالمي للبحث الرياضي والفلكي والطبي. بالوصول إلى الكوكب الأحمر، أرسلت الإمارات رسالة قوية: أن المنطقة مستعدة لاستعادة مكانتها في طليعة الاكتشاف البشري.

مهد نجاح "الأمل" الطريق لمشاريع أكثر طموحاً، بما في ذلك المهمة التي أُعلن عنها مؤخراً لاستكشاف حزام الكويكبات ومشروع "مريخ 2117"، الذي يهدف إلى بناء أول مستوطنة بشرية على المريخ خلال القرن القادم.

## الخاتمة: مهمة لا تنتهي أبداً

بينما يواصل مسبار الأمل مراقبته الصامتة حول المريخ، فإن إرثه مكتوب بالفعل في قلوب الملايين. لقد أثبت أن المستحيل ممكن بالرؤية والتعاون والمثابرة. نجاح المهمة لا يُقاس فقط بالبيانات التي ترسلها، بل بالأحلام التي أشعلتها.

بالنسبة للإمارات، لم تكن الرحلة إلى المريخ هي الوجهة أبداً — بل كانت بداية فصل جديد في التاريخ البشري. فصل يمكن فيه لأمة صغيرة من الصحراء أن تنظر إلى النجوم وتقول بكل ثقة: "نحن هنا".`
    },
    {
      id: "prem-4-ar",
      slug: "qatar-sports-legacy-hub",
      title: "عاصمة الرياضة: تطور قطر ما بعد 2022",
      description: "استكشاف كيف استفادت قطر من البنية التحتية لكأس العالم لتصبح الوجهة الأولى في العالم للتدريب عالي الأداء وألعاب القوى الدولية.",
      link: "/insights/qatar-sports-legacy-hub",
      pubDate: "2026-04-27T11:20:00Z",
      source: "عربية خليج بريميوم",
      category: "gcc",
      language: "ar",
      image: "/images/insights/qatar-sports.png",
      tags: ["sports", "legacy", "tourism"],
      content: `# عاصمة الرياضة: إرث قطر ما بعد 2022

بعد نجاح كأس العالم فيفا 2022، حولت قطر ملاعبها ومنشآتها المتطورة إلى نظام رياضي مستدام. لا يتعلق الأمر فقط بذكرى بطولة؛ بل بولادة قوة رياضية عالمية. اليوم، تقف قطر كوجهة أولى في العالم للتدريب عالي الأداء والطب الرياضي وألعاب القوى الدولية.

## ما بعد صافرة النهاية: استراتيجية للاستدامة

عندما فازت قطر بحق استضافة كأس العالم في عام 2010، كان المجتمع الدولي متشككاً. كيف يمكن لشبه جزيرة صغيرة في الخليج أن تستضيف أكبر حدث رياضي في العالم؟ تكمن الإجابة في رؤية واضحة وطويلة المدى تمتد إلى ما بعد المباراة النهائية في استاد لوسيل. كانت الاستراتيجية تهدف إلى بناء نظام بيئي رياضي متكامل، وليس مجرد مجموعة من الملاعب.

صُمم كل ملعب ليكون له غرض بعد البطولة. على سبيل المثال، صُمم استاد 974 الشهير، المصنوع من حاويات الشحن، ليتم تفكيكه بالكامل وإعادة استخدامه — وهي سابقة عالمية في هندسة البطولات المستدامة. وشهدت الملاعب الأخرى تقليص سعتها، مع تحويل المساحات الإضافية إلى مراكز مجتمعية وفنادق ومدارس، لضمان أن تخدم البنية التحتية سكان قطر لعقود قادمة.

## قلب الأداء: منطقة أسباير وما بعدها

في مركز التميز الرياضي القطري تقع منطقة أسباير، وهي مجمع بمساحة 2.5 كيلومتر مربع يضم أكاديمية أسباير للتفوق الرياضي، وسبيتار (المستشفى الرائد عالمياً في الطب الرياضي)، واستاد خليفة الدولي.

أصبح سبيتار، على وجه الخصوص، مغناطيساً عالمياً لنخبة الرياضيين. من لاعبي الدوري الإنجليزي الممتاز إلى عدائي الأولمبياد، يسافر الأفضل في العالم إلى الدوحة للاستفادة من علوم الرياضة المتطورة وإعادة التأهيل. يوفر تكامل التدريب عالي المستوى والخبرة الطبية والمرافق المتطورة في مكان واحد بيئة لتحسين الأداء لا مثيل لها تقريباً في أي مكان آخر في العالم.

## وجهة لنخبة التدريب العالمي

في السنوات الأخيرة، أصبحت قطر معسكر التدريب الشتوي المفضل للعديد من أفضل أندية كرة القدم في العالم، بما في ذلك بايرن ميونخ وباريس سان جيرمان ومختلف المنتخبات الوطنية. يتيح الجمع بين طقس الشتاء المثالي والخصوصية والملاعب ذات المستوى العالمي للفرق الاستعداد للنصف الثاني من مواسمها في ظروف مثالية.

لكن الأمر لا يقتصر على كرة القدم فقط. فقد أصبحت حلبة لوسيل الدولية عنصراً أساسياً في تقويم الفورمولا 1 والموتو جي بي، بينما يستضيف مجمع خليفة الدولي للتنس والاسكواش بعضاً من أرقى البطولات في جولات رابطة محترفي التنس ومحترفات التنس. أثبتت قطر أنها تمتلك الخبرة التشغيلية لاستضافة أي رياضة، بأي حجم، وبأداء لا تشوبه شائبة.

## الدبلوماسية الرياضية: بناء الجسور من خلال المنافسة

بالنسبة لقطر، تعد الرياضة أيضاً أداة حيوية للدبلوماسية والعلامة التجارية الوطنية. من خلال استضافة أحداث كبرى مثل كأس آسيا، وبطولة العالم للألعاب المائية، وكأس العالم لكرة السلة 2027 القادمة، تضع قطر نفسها كأرض محايدة حيث يمكن للعالم أن يجتمع من خلال اللغة العالمية للمنافسة.

تساعد هذه "الدبلوماسية الرياضية" في بناء علاقات دولية وتعزز صورة إيجابية للمنطقة. كما أنها تعزز ثقافة الصحة والعافية بين السكان المحليين، حيث يستلهم الشباب القطريون من رؤية أفضل الرياضيين في العالم يتنافسون في وطنهم.

## الطموحات المستقبلية: الطريق إلى الأولمبياد؟

أدى نجاح كأس العالم 2022 بطبيعة الحال إلى تكهنات حول خطوة قطر التالية. يعتقد العديد من المحللين أن الهدف النهائي هو جلب الألعاب الأولمبية إلى الشرق الأوسط لأول مرة. ومع وجود البنية التحتية القائمة بالفعل وسجل حافل من استضافة الأحداث واسعة النطاق، تعد الدوحة منافساً قوياً للنسخ المستقبلية من الألعاب.

بعيداً عن الأولمبياد، تستثمر قطر بكثافة في "أعمال الرياضة". حيث استحوذ جهاز قطر للاستثمار (QIA) على حصص في كيانات رياضية عالمية كبرى، مما زاد من اندماج الأمة في الاقتصاد الرياضي العالمي.

## الخاتمة: درس في الرؤية والاستثمار

إن رحلة قطر من دولة إقليمية إلى قوة رياضية عالمية هي درس في الاستثمار الاستراتيجي. إنها تظهر ما يمكن تحقيقه عندما تكون الرؤية الواضحة مدعومة بالموارد والإرادة السياسية للمتابعة.

اليوم، وأنت تمشي في منطقة أسباير أو تزور شواطئ لوسيل، لا ترى ملاعب فحسب؛ بل ترى إرث أمة تجرأت على التفكير بشكل كبير. إرث قطر الرياضي ليس فصلاً انتهى في ديسمبر 2022 — بل هو قصة لا تزال تُكتب، والعالم ينتظر بفارغ الصبر ليرى ما يحمله الفصل القادم.`
    },
  ]
};

/**
 * Unified fetcher that merges hardcoded and Redis-stored dynamic insights.
 */
export async function getUnifiedInsights(options: { 
  lang: 'en' | 'ar', 
  category?: string | null,
  limit?: number 
}): Promise<InsightItem[]> {
  const { lang, category, limit = 100 } = options;
  
  // 1. Get hardcoded base
  const baseItems = PREMIUM_ARTICLES[lang] || [];
  
  // 2. Get dynamic archive from Redis
  let dynamicItems: InsightItem[] = [];
  try {
    const archiveKey = `insights_archive_${lang}`;
    const stored = await redis.get(archiveKey) as InsightItem[] | null;
    if (stored && Array.isArray(stored)) {
      dynamicItems = stored;
    }
  } catch (e) {
    console.error("Failed to fetch dynamic insights from Redis:", e);
  }

  // 3. Merge, Deduplicate and Sort
  // Use a Map for O(N) deduplication by slug
  const allMap = new Map<string, InsightItem>();
  
  // Add base items first (so they can be overwritten by newer dynamic items if slug matches)
  baseItems.forEach(item => allMap.set(item.slug, item));
  // Add dynamic items (overwrite base if slug matches, assuming dynamic is newer)
  dynamicItems.forEach(item => allMap.set(item.slug, item));

  let allItems = Array.from(allMap.values());

  // Sort by date descending
  allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  // 4. Filter by category if needed
  if (category) {
    const catLower = category.toLowerCase();
    allItems = allItems.filter(n => {
      return n.tags?.some(t => t.toLowerCase() === catLower) || 
             n.title.toLowerCase().includes(catLower) || 
             (n.description || "").toLowerCase().includes(catLower);
    });
  }

  return allItems.slice(0, limit);
}

export async function getArticleBySlug(slug: string, lang: 'en' | 'ar'): Promise<InsightItem | null> {
  const allInsights = await getUnifiedInsights({ lang, limit: 1000 });
  const article = allInsights.find(p => p.slug === slug);
  if (article) return article;

  // Check other language as fallback
  const otherLang = lang === 'en' ? 'ar' : 'en';
  const allOther = await getUnifiedInsights({ lang: otherLang, limit: 1000 });
  return allOther.find(p => p.slug === slug) || null;
}

export async function getAllInsightSlugs(): Promise<{ slug: string, lang: 'en' | 'ar', pubDate: string }[]> {
  const enItems = await getUnifiedInsights({ lang: 'en', limit: 1000 });
  const arItems = await getUnifiedInsights({ lang: 'ar', limit: 1000 });

  const enSlugs = enItems.map(n => ({ slug: n.slug, lang: 'en' as const, pubDate: n.pubDate }));
  const arSlugs = arItems.map(n => ({ slug: n.slug, lang: 'ar' as const, pubDate: n.pubDate }));

  return [...enSlugs, ...arSlugs];
}
