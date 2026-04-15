// ── Types ─────────────────────────────────────────────────────────────────────

export interface FeeItem {
  label: string;
  amount: number; // 0 = free
}

export interface Step {
  title: string;
  detail: string;
  portal?: string;
}

export interface EligibilityCriterion {
  label: string;
  met: boolean; // default display state for the balance scale
}

export interface GuideData {
  title: string;
  role: string;
  intro: string;
  minDays: number;
  maxDays: number;
  fastTrack?: boolean;
  fees: FeeItem[];
  eligibility: EligibilityCriterion[];
  docs: string[];
  steps: Step[];
  tips: string[];
  portals: { name: string; url: string }[];
  faq: { q: string; a: string }[];
  related: GuideSlug[];
}

export interface GuideSummary {
  icon: string;
  tagline: string;
}

// ── Slug registry ──────────────────────────────────────────────────────────────

export const GUIDE_SLUGS = [
  "qid",
  "work-visa",
  "family-visa",
  "business-registration",
  "driving-licence",
  "exit-permit",
  "document-attestation",
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

// ── Summary cards (index page) ─────────────────────────────────────────────────

export const GUIDE_SUMMARIES: Record<GuideSlug, GuideSummary> = {
  qid: {
    icon: "🪪",
    tagline: "Get your Qatar Residence Permit and Qatar ID card as a sponsored expatriate.",
  },
  "work-visa": {
    icon: "💼",
    tagline: "Employer-sponsored entry visa and residence permit for new employees.",
  },
  "family-visa": {
    icon: "👨‍👩‍👧",
    tagline: "Bring your spouse and dependents to Qatar on a family residency permit.",
  },
  "business-registration": {
    icon: "🏢",
    tagline: "Register a commercial entity via MOCI's Sijilat platform — as fast as 3 days.",
  },
  "driving-licence": {
    icon: "🚗",
    tagline: "Transfer your foreign driving licence or obtain a new Qatar licence via MOI.",
  },
  "exit-permit": {
    icon: "🛫",
    tagline: "Obtain your employer's NOC and clear any travel bans before final departure.",
  },
  "document-attestation": {
    icon: "📄",
    tagline: "Get foreign documents attested by MOFA for use in Qatar legal processes.",
  },
};

// ── Guide data ─────────────────────────────────────────────────────────────────

export const GUIDES: Record<GuideSlug, GuideData> = {
  // ── QID ───────────────────────────────────────────────────────────────────────
  qid: {
    title: "Qatar ID (QID) Application",
    role: "Expatriate workers on employment visa",
    intro:
      "The Qatar ID (QID) is the primary identity document for all expatriate residents. Issued by the Ministry of Interior, it must be obtained within 30 days of arrival on a work or family visa. Your employer (sponsor) initiates the process — you cannot apply independently.",
    minDays: 14,
    maxDays: 28,
    fees: [
      { label: "Residence Permit — 1 year", amount: 100 },
      { label: "Residence Permit — 2 years", amount: 200 },
      { label: "Medical fitness examination", amount: 150 },
      { label: "QID card (included in RP fee)", amount: 0 },
      { label: "Q-Post delivery (optional)", amount: 20 },
    ],
    eligibility: [
      { label: "Have a Qatar employer as your sponsor", met: true },
      { label: "Hold a valid employment contract", met: true },
      { label: "Passport valid for 6+ months", met: true },
      { label: "Pass medical fitness examination", met: false },
      { label: "No existing Qatar residency violations", met: true },
    ],
    docs: [
      "Passport original + copy (minimum 6 months validity)",
      "Entry visa / visa stamp in passport",
      "2 passport-size photographs (white background)",
      "Employment contract (attested by MADLSA)",
      "Medical fitness certificate from an MOI-approved centre",
      "Educational/professional certificates (if required by employer)",
    ],
    steps: [
      {
        title: "Employer submits Residence Permit application",
        detail:
          "Your sponsor logs into the MOI portal (portal.moi.gov.qa) or Metrash2 app and submits the RP application. You cannot initiate this step yourself.",
      },
      {
        title: "Medical fitness examination",
        detail:
          "Visit an MOI-approved medical centre for blood tests and a physical check-up. Common venues include PHCC clinics and approved private hospitals. Results are uploaded directly.",
      },
      {
        title: "Biometric data capture",
        detail:
          "Once medical clearance is confirmed, attend your appointment at an MOI service centre or authorised typing centre to provide fingerprints and a photograph.",
      },
      {
        title: "Pay the applicable fees",
        detail:
          "Fees are paid online via the MOI portal, Hukoomi, or Metrash2. Your employer typically covers the RP fee; verify your contract terms for the medical fee.",
      },
      {
        title: "Collect your QID",
        detail:
          "Your Qatar ID is ready within a few working days of biometrics. Collect from the MOI service centre, or opt for Q-Post home delivery (QAR 20 extra).",
      },
    ],
    tips: [
      "Ensure your passport has at least 6 months remaining before your employer starts the RP process — renewal after arrival is expensive.",
      "Track application status in real time via the Metrash2 app under 'My Applications' instead of calling the MOI hotline.",
      "If your medical result requires follow-up treatment, act quickly — delayed clearance pauses your entire application.",
      "Loss of QID before collection? Report it immediately on Metrash2 to avoid a QAR 300 replacement fine.",
    ],
    portals: [
      { name: "MOI Portal", url: "https://portal.moi.gov.qa/" },
      { name: "Hukoomi", url: "https://hukoomi.gov.qa/" },
      { name: "Metrash2 (App Store)", url: "https://apps.apple.com/qa/app/metrash2/id661960506" },
    ],
    faq: [
      {
        q: "Can I apply for a QID without my employer?",
        a: "No. The Residence Permit application that leads to a QID must be initiated by your sponsor (employer or family head) via the MOI portal. You complete biometrics and collect the card, but you cannot start the process independently.",
      },
      {
        q: "How long is a QID valid?",
        a: "QIDs are issued for 1 or 2 years, tied to your Residence Permit duration, which is linked to your employment contract. Renewal is required before expiry — your employer initiates the renewal.",
      },
      {
        q: "What happens if I overstay 30 days without a QID?",
        a: "You become an overstayer, incurring a fine of QAR 200 per month and a potential travel ban. Inform your employer immediately if processing is delayed beyond 30 days of your entry date.",
      },
      {
        q: "Can I use Metrash2 to track my QID application?",
        a: "Yes. Open Metrash2 and navigate to 'My Applications' to see the current status of your RP and QID, including which stage is pending and expected completion.",
      },
    ],
    related: ["work-visa", "exit-permit", "family-visa"],
  },

  // ── Work Visa ──────────────────────────────────────────────────────────────────
  "work-visa": {
    title: "Work / Employment Visa",
    role: "Employers (PRO/HR) and incoming employees",
    intro:
      "Qatar's work visa is an employer-sponsored process: the company first obtains an entry visa for the employee, who then travels to Qatar and completes the Residence Permit process. The full cycle — from visa approval to QID in hand — typically takes 2–6 weeks.",
    minDays: 14,
    maxDays: 42,
    fees: [
      { label: "Work entry visa fee", amount: 200 },
      { label: "Residence Permit (1 year)", amount: 100 },
      { label: "Medical fitness examination", amount: 150 },
      { label: "Labour contract registration (MADLSA)", amount: 0 },
    ],
    eligibility: [
      { label: "Confirmed Qatar employer as sponsor", met: true },
      { label: "Signed employment contract", met: true },
      { label: "Relevant educational/professional qualifications", met: true },
      { label: "Clean criminal record (police clearance)", met: false },
      { label: "Passport valid for 6+ months", met: true },
      { label: "No previous Qatar visa violations", met: true },
    ],
    docs: [
      "Passport (minimum 6 months validity)",
      "Passport-size photograph (white background)",
      "Signed employment contract",
      "Attested educational certificates (degree-level roles)",
      "Police clearance certificate from home country",
      "Medical fitness certificate (completed after arrival in Qatar)",
    ],
    steps: [
      {
        title: "Employer submits work entry visa application",
        detail:
          "The company's PRO submits the visa application via the MOI portal or Metrash2, providing the employee's passport copy and contract details.",
      },
      {
        title: "Entry visa approval & employee travels to Qatar",
        detail:
          "Once approved (typically 3–7 days), the entry visa is issued. The employee books flights and arrives in Qatar before the visa validity expires.",
      },
      {
        title: "Medical fitness examination",
        detail:
          "Within days of arrival, the employee visits an MOI-approved medical centre for blood tests and a physical exam. Results are uploaded to the MOI system automatically.",
      },
      {
        title: "Biometric data capture at MOI",
        detail:
          "After medical clearance, visit an MOI service centre or typing centre for fingerprints and photograph. Employer or PRO can accompany.",
      },
      {
        title: "Residence Permit issued",
        detail:
          "The MOI processes the RP application (typically 5–10 working days after biometrics). Status visible in real time on Metrash2.",
      },
      {
        title: "Collect Qatar ID",
        detail:
          "QID is ready for collection or Q-Post delivery once the RP is issued. The employee is now a legal Qatar resident.",
      },
      {
        title: "Register labour contract with MADLSA",
        detail:
          "Within 30 days of arrival, the employer must register the employment contract with the Ministry of Labour (MADLSA) via madlsa.gov.qa. This is mandatory and free.",
      },
    ],
    tips: [
      "Attested educational certificates must be attested in the home country and then by MOFA Qatar — do this before the employee travels to save weeks.",
      "Police clearance certificates must be issued within 6 months of the visa application date; plan the timing carefully.",
      "The entry visa is usually single-entry with a 30–60 day validity. The employee must arrive before it expires.",
      "Employers who skip the MADLSA contract registration face penalties — set a calendar reminder for this step.",
    ],
    portals: [
      { name: "MOI Portal", url: "https://portal.moi.gov.qa/" },
      { name: "MADLSA (Ministry of Labour)", url: "https://www.madlsa.gov.qa/" },
      { name: "Hukoomi", url: "https://hukoomi.gov.qa/" },
    ],
    faq: [
      {
        q: "How long does it take to get a Qatar work visa?",
        a: "The entry visa typically takes 3–7 working days to approve. After arriving in Qatar, completing the medical exam, biometrics, and RP issuance takes another 2–5 weeks, making the total process 3–6 weeks.",
      },
      {
        q: "Can I change jobs after getting my QID?",
        a: "Yes. Qatar's labour law allows job changes after 1 year of service (or immediately if the employer agrees or violates the contract). You apply for a No Objection Certificate (NOC) or use the job change provisions in the Expat Labour Law amendments.",
      },
      {
        q: "Do all nationalities need attested educational certificates?",
        a: "Attestation requirements depend on the job category and the employer's internal policy. Professional roles (engineering, medicine, law, teaching) almost always require attested degrees. Check with your employer's PRO before travelling.",
      },
    ],
    related: ["qid", "family-visa", "exit-permit"],
  },

  // ── Family Visa ────────────────────────────────────────────────────────────────
  "family-visa": {
    title: "Family Visa (Joining Family)",
    role: "Qatar residents sponsoring spouse or dependants",
    intro:
      "Qatar residents earning above the MOI-specified salary threshold can sponsor their spouse, children under 25, and in some cases parents and siblings. The sponsor's employer must provide a salary certificate confirming the minimum monthly salary.",
    minDays: 14,
    maxDays: 28,
    fees: [
      { label: "Family entry visa (per person)", amount: 200 },
      { label: "Residence Permit per dependant (1 year)", amount: 100 },
      { label: "Medical fitness examination per person", amount: 150 },
    ],
    eligibility: [
      { label: "Hold a valid Qatar QID", met: true },
      { label: "Monthly salary ≥ QAR 4,000 (with accommodation) or ≥ QAR 6,000", met: false },
      { label: "Employer provides salary certificate", met: true },
      { label: "Sponsor has suitable accommodation in Qatar", met: true },
      { label: "Dependant's documents attested and translated", met: false },
    ],
    docs: [
      "Sponsor's valid QID",
      "Salary certificate from employer (original)",
      "Tenancy contract / proof of accommodation",
      "Dependant's passport (6+ months validity)",
      "Marriage certificate — attested by Qatar MOFA (for spouse)",
      "Birth certificate — attested by Qatar MOFA (for children)",
      "Passport-size photograph of each dependant",
    ],
    steps: [
      {
        title: "Obtain salary certificate from employer",
        detail:
          "Request a stamped salary certificate from your HR department. It must state your monthly basic salary and be stamped by the company.",
      },
      {
        title: "Attest family documents",
        detail:
          "Marriage and birth certificates must be attested in the home country (notary → Ministry of Foreign Affairs → Qatar Embassy) and then by Qatar's MOFA. This step is often the longest — start early.",
      },
      {
        title: "Apply for family entry visa on MOI portal",
        detail:
          "Log in to the MOI portal or Metrash2 and submit the family visa application with all supporting documents.",
      },
      {
        title: "Dependants travel to Qatar",
        detail:
          "Once the entry visa is approved, dependants book travel and arrive before visa expiry.",
      },
      {
        title: "Medical exam, biometrics and RP issuance",
        detail:
          "Each dependant completes a medical fitness examination and biometric registration at an MOI service centre. The Residence Permit and QID follow within 2–3 weeks.",
      },
    ],
    tips: [
      "Begin the MOFA attestation of marriage/birth certificates before you even submit the visa application — it can take 4–8 weeks from home countries.",
      "If your salary is just below the threshold, check if your employer can provide a formal housing letter — this may qualify you under the lower QAR 4,000 bracket.",
      "Children born in Qatar do not need an entry visa but do need their own RP — submit their birth certificate to MOI within 30 days of birth.",
      "University students (over 18) sponsored as dependants must provide an enrolment certificate renewed annually.",
    ],
    portals: [
      { name: "MOI Portal", url: "https://portal.moi.gov.qa/" },
      { name: "MOFA Qatar (Attestation)", url: "https://mofa.gov.qa/" },
      { name: "Metrash2 App", url: "https://portal.moi.gov.qa/wps/portal/MOIInternet/services/metrash" },
    ],
    faq: [
      {
        q: "What is the minimum salary to sponsor a family in Qatar?",
        a: "As of 2026, the MOI requires a minimum monthly salary of QAR 6,000, or QAR 4,000 if the sponsor's employer provides free accommodation. The employer salary certificate must confirm this.",
      },
      {
        q: "Can I sponsor my parents?",
        a: "Sponsoring parents is permitted but subject to additional approval. Parents must be over 60 years old in most cases, and the sponsor usually needs a higher salary threshold or a special NOC. Check the current MOI guidelines as rules change periodically.",
      },
      {
        q: "How long can my family stay on a visitor visa before the RP is processed?",
        a: "Family entry visas are typically valid for 30 days from arrival. You should begin the RP process immediately — apply for an extension if the RP is delayed to avoid overstay fines (QAR 200/month).",
      },
    ],
    related: ["qid", "work-visa", "document-attestation"],
  },

  // ── Business Registration ──────────────────────────────────────────────────────
  "business-registration": {
    title: "Business Registration (MOCI)",
    role: "Entrepreneurs and business owners",
    intro:
      "Qatar's commercial registration is managed by the Ministry of Commerce and Industry (MOCI) through the Sijilat online platform. For simple business activities, the process can be completed entirely online in 3–7 working days. Foreign nationals require a Qatari partner holding ≥ 51% stake unless operating in a free zone (QFC, Manateq).",
    minDays: 3,
    maxDays: 7,
    fastTrack: true,
    fees: [
      { label: "Commercial Registration (CR) fee", amount: 1000 },
      { label: "Trade name reservation", amount: 100 },
      { label: "Municipality (Baladiya) approval", amount: 200 },
      { label: "Trade licence (varies by activity)", amount: 500 },
    ],
    eligibility: [
      { label: "Qatari national OR GCC national (100% ownership)", met: false },
      { label: "Foreign national with Qatari partner (51%+) OR QFC/Manateq free zone", met: false },
      { label: "Valid QID (or passport for new arrivals)", met: true },
      { label: "Suitable commercial premises or virtual office", met: false },
      { label: "No outstanding fines or legal restrictions", met: true },
    ],
    docs: [
      "QID or passport copy of all partners",
      "Lease agreement for commercial premises (or virtual office NOC)",
      "Proposed company name (2–3 options in order of preference)",
      "Partnership agreement (if 2+ partners)",
      "No Objection Certificate from current employer (if employed)",
      "Professional licence / certification (for regulated activities e.g. medical, legal)",
    ],
    steps: [
      {
        title: "Choose business activity and legal structure",
        detail:
          "Browse the MOCI activity list on sijilat.com.qa. Common structures: Limited Liability Company (LLC), Sole Proprietorship (for Qatari nationals), or a branch of a foreign company. Choose a trade name and verify availability.",
      },
      {
        title: "Register on Sijilat and submit application",
        detail:
          "Create an account on sijilat.com.qa, upload all required documents, enter partner details, and submit the Commercial Registration application online. A case officer is assigned within 1 working day.",
      },
      {
        title: "Pay the CR and trade name fees",
        detail:
          "Pay QAR 1,000 (CR) + QAR 100 (trade name) online via Hukoomi or at an authorised payment kiosk. Keep the payment receipt.",
      },
      {
        title: "Municipality (Baladiya) approval",
        detail:
          "MOCI routes your application to the local municipality for premises approval. This step is completed automatically for most registered addresses — you pay QAR 200 and receive an inspection appointment if needed.",
      },
      {
        title: "Obtain the Commercial Registration certificate",
        detail:
          "Once all approvals are granted, MOCI issues the Commercial Registration (CR) certificate. Download it from Sijilat or collect from a MOCI service centre.",
      },
      {
        title: "Open a corporate bank account",
        detail:
          "Take your CR certificate and QIDs of all partners to a Qatar bank (QNB, CBQ, QIIB, etc.) to open a corporate current account. Required for issuing invoices and collecting payments.",
      },
    ],
    tips: [
      "Reserve your trade name before starting the full application — popular names are taken quickly and the process has to restart if your preferred name is rejected.",
      "Foreign nationals: confirm whether your business activity is restricted to Qatari-national ownership before committing to a Qatari partner arrangement.",
      "Regulated activities (food, healthcare, construction, education) require additional ministry approvals beyond MOCI — budget an extra 2–4 weeks.",
      "The QFC (Qatar Financial Centre) offers 100% foreign ownership for financial services, professional services, and tech companies — worth exploring if you qualify.",
    ],
    portals: [
      { name: "MOCI Sijilat", url: "https://www.sijilat.com.qa/" },
      { name: "MOCI Official", url: "https://www.moci.gov.qa/" },
      { name: "Qatar Financial Centre (QFC)", url: "https://www.qfc.qa/" },
      { name: "Hukoomi", url: "https://hukoomi.gov.qa/" },
    ],
    faq: [
      {
        q: "Can a foreigner own 100% of a business in Qatar?",
        a: "Yes, but only in specific free zones: Qatar Financial Centre (QFC) for professional/financial services, and Manateq free zones for industrial/logistics. Outside free zones, foreign nationals require a Qatari partner holding at least 51% of shares in most sectors.",
      },
      {
        q: "How long does a Commercial Registration last?",
        a: "A Commercial Registration (CR) is valid for 1 year and must be renewed annually via Sijilat. Failure to renew results in fines and potential blacklisting from government tenders.",
      },
      {
        q: "Do I need a physical office address?",
        a: "Yes — MOCI requires a valid commercial lease agreement. Some business centres and co-working spaces offer 'virtual office' packages that include a registered address, which are accepted for most low-risk business activities.",
      },
    ],
    related: ["qid", "document-attestation"],
  },

  // ── Driving Licence ────────────────────────────────────────────────────────────
  "driving-licence": {
    title: "Driving Licence (Qatar)",
    role: "Expatriates with or without a foreign licence",
    intro:
      "Qatar's MOI Traffic Department handles all driving licence applications. Nationals from 34 countries (including UK, USA, EU, GCC, Australia, Canada) can transfer their foreign licence directly with no tests required. All others must pass a theory exam and a road test — sometimes preceded by mandatory driving lessons.",
    minDays: 7,
    maxDays: 90,
    fees: [
      { label: "Eye test at approved optician", amount: 50 },
      { label: "Theory test (if required)", amount: 30 },
      { label: "Road test (if required)", amount: 100 },
      { label: "Driving licence issuance", amount: 100 },
      { label: "Driving lessons (per hour, if needed)", amount: 80 },
    ],
    eligibility: [
      { label: "Hold a valid Qatar QID", met: true },
      { label: "Minimum age 18 years", met: true },
      { label: "Pass eye test at an approved optician", met: true },
      { label: "Hold valid foreign licence (for direct transfer)", met: false },
      { label: "From a direct-transfer country (UK, US, EU, GCC, etc.)", met: false },
    ],
    docs: [
      "Valid Qatar QID",
      "Passport copy",
      "2 passport-size photographs",
      "Eye test certificate from an MOI-approved optician",
      "Original foreign driving licence (for transfer applicants)",
      "Certified Arabic translation of foreign licence (if not in English/Arabic)",
      "No Objection Certificate from sponsor (some employers require this)",
    ],
    steps: [
      {
        title: "Eye test at approved optician",
        detail:
          "Visit an MOI-approved optician (available at most malls and clinics). Cost is approximately QAR 50. The certificate is required for all applicants regardless of transfer eligibility.",
      },
      {
        title: "Submit documents to MOI Traffic Department",
        detail:
          "Visit an MOI Traffic Department service centre (main locations: Abu Hamour, Al Dafna) with all documents. Staff will verify your eligibility for direct transfer or advise on the test route.",
      },
      {
        title: "Theory exam (if required)",
        detail:
          "Non-transfer countries must pass a computerised theory test (30 questions, need 21+ correct). Study the Qatar traffic law booklet available on the MOI website. Tests are available in English and Arabic.",
      },
      {
        title: "Road test (if required)",
        detail:
          "Book and attend a road test at the MOI driving test centre. A certified MOI examiner accompanies you. If you fail, you may retake after a waiting period (typically 7 days).",
      },
      {
        title: "Collect Qatar driving licence",
        detail:
          "Once all tests are passed (or direct transfer confirmed), pay the QAR 100 licence fee and collect your Qatar driving licence. Valid for 10 years for most nationalities.",
      },
    ],
    tips: [
      "Check the official list of direct-transfer countries on the MOI website before planning — it is updated periodically and some nationalities were added recently.",
      "For direct transfer, your foreign licence must be valid (not expired). An expired foreign licence is NOT accepted and you will need to go through the full test process.",
      "If mandatory lessons are required, the Qatar Driving School (Abu Hamour) is the official government school — private schools are also accredited and sometimes faster.",
      "The theory test is available in English — request it in English when registering if Arabic is not your first language.",
    ],
    portals: [
      { name: "MOI Traffic Department", url: "https://portal.moi.gov.qa/" },
      { name: "Metrash2 App", url: "https://portal.moi.gov.qa/wps/portal/MOIInternet/services/metrash" },
    ],
    faq: [
      {
        q: "Which countries get a direct licence transfer in Qatar?",
        a: "As of 2026, nationals of the following countries can transfer their licence without tests: all GCC countries, UK, USA, Canada, Australia, New Zealand, South Africa, Japan, South Korea, and most EU member states. Check portal.moi.gov.qa for the full current list as it is updated periodically.",
      },
      {
        q: "Can I drive in Qatar with my international driving permit (IDP)?",
        a: "An IDP (combined with your home country licence) is accepted for tourists and short-term visitors for up to 7 days. For residents with a QID, a Qatar driving licence is mandatory — an IDP alone is not sufficient.",
      },
      {
        q: "How long is the Qatar driving licence valid?",
        a: "Qatar driving licences are valid for 10 years for most nationalities and must be renewed at the MOI Traffic Department before expiry. You will need a new eye test at renewal.",
      },
    ],
    related: ["qid", "work-visa"],
  },

  // ── Exit Permit ────────────────────────────────────────────────────────────────
  "exit-permit": {
    title: "Exit Permit / Final Exit",
    role: "Expatriates ending their stay in Qatar",
    intro:
      "Since Qatar abolished mandatory exit permits in 2020, most private-sector workers can leave Qatar without prior employer approval. However, certain employee categories (domestic workers, government employees, those under active legal disputes) still require an employer No Objection Certificate (NOC). Always verify your status before booking flights.",
    minDays: 1,
    maxDays: 3,
    fees: [
      { label: "Exit permit / NOC (standard)", amount: 0 },
      { label: "Overstay fine (QAR 200 per month, if applicable)", amount: 0 },
      { label: "Travel ban clearance fees (if applicable)", amount: 0 },
    ],
    eligibility: [
      { label: "No active travel ban on your QID", met: true },
      { label: "No outstanding court cases or legal disputes", met: true },
      { label: "No unpaid government fines (traffic, overstay, etc.)", met: true },
      { label: "Employer has not filed a travel ban (rare)", met: true },
      { label: "Final salary and end-of-service benefits received (for final exit)", met: false },
    ],
    docs: [
      "Valid Qatar QID",
      "Passport",
      "Confirmed outbound air ticket",
      "Employer NOC / release letter (for domestic workers and government employees)",
      "Final salary certificate (for gratuity claims after departure)",
    ],
    steps: [
      {
        title: "Check for travel bans on your QID",
        detail:
          "Before booking flights, log into Metrash2 → 'Inquiries' → 'Travel Ban Check' to confirm no ban is active on your QID. This takes under 2 minutes.",
      },
      {
        title: "Clear any outstanding fines",
        detail:
          "Pay any outstanding traffic fines, municipality violations, or overstay penalties via Metrash2 or Hukoomi. Unpaid fines can trigger a travel ban at the airport.",
      },
      {
        title: "Obtain employer NOC (if required)",
        detail:
          "If you are a domestic worker, government employee, or there is a legal dispute in progress, request a formal No Objection Certificate (NOC) from your employer. This is typically issued within 1–3 working days.",
      },
      {
        title: "Cancel Qatar ID and Residence Permit",
        detail:
          "Your employer's PRO must cancel your RP via the MOI portal or Metrash2. This should be done on or around your departure date — your QID is voided upon exit.",
      },
    ],
    tips: [
      "Check travel ban status at least 5–7 days before departure — resolving a dispute or paying a fine takes time and you do not want to miss your flight.",
      "Collect your end-of-service gratuity, final salary, and vacation pay settlement before your QID is cancelled — recovering money owed after leaving Qatar is very difficult.",
      "Return your accommodation, company assets (laptop, car), and surrender your company SIM card before the final exit to avoid disputes.",
      "Keep a copy of your employment contract, payslips, and MADLSA labour card after departure in case of future legal claims.",
    ],
    portals: [
      { name: "MOI Portal (Travel Ban Check)", url: "https://portal.moi.gov.qa/" },
      { name: "Metrash2 App", url: "https://portal.moi.gov.qa/wps/portal/MOIInternet/services/metrash" },
      { name: "MADLSA (Labour disputes)", url: "https://www.madlsa.gov.qa/" },
    ],
    faq: [
      {
        q: "Do I still need an exit permit to leave Qatar?",
        a: "For most private-sector workers, no — Qatar abolished mandatory exit permits in 2020. You can leave freely. Exceptions: domestic workers, government employees, and anyone subject to a court-ordered travel ban still require employer approval or judicial clearance.",
      },
      {
        q: "What is a travel ban and how do I check for one?",
        a: "A travel ban is a legal order preventing you from leaving Qatar. It can be issued by courts (for civil or criminal cases), employers (disputed), or government agencies (unpaid fines). Check via Metrash2 → Inquiries → Travel Ban Check, or visit an MOI service centre.",
      },
      {
        q: "Can I return to Qatar after a final exit?",
        a: "Yes, provided you are not banned from re-entry and your new employer obtains a fresh work visa for you. There is no mandatory cooling-off period for most nationalities, but check your specific contract terms.",
      },
    ],
    related: ["qid", "work-visa", "document-attestation"],
  },

  // ── Document Attestation ───────────────────────────────────────────────────────
  "document-attestation": {
    title: "Document Attestation (MOFA)",
    role: "Expatriates needing attested foreign documents for Qatar",
    intro:
      "Foreign documents (degrees, marriage certificates, birth certificates, police clearances) must be attested through a chain of authorities before they are legally recognised in Qatar. The chain: originating country authorities → Qatar Embassy in that country → Qatar Ministry of Foreign Affairs (MOFA). MOFA's attestation is the final and most important step.",
    minDays: 3,
    maxDays: 5,
    fastTrack: true,
    fees: [
      { label: "MOFA attestation — standard (per document)", amount: 150 },
      { label: "MOFA attestation — express 1-day (per document)", amount: 300 },
      { label: "Certified Arabic translation (if required)", amount: 100 },
    ],
    eligibility: [
      { label: "Document is original or officially certified copy", met: true },
      { label: "Document has been attested in the country of origin", met: false },
      { label: "Attested by Qatar Embassy in country of origin", met: false },
      { label: "Holder has a valid Qatar QID or entry visa", met: true },
    ],
    docs: [
      "Original document (degree certificate, marriage cert, birth cert, etc.)",
      "Notarised copy from the issuing authority in the home country",
      "Attestation stamp from home country's Ministry of Foreign Affairs",
      "Attestation stamp from Qatar Embassy in the home country",
      "Valid Qatar QID (or passport for new arrivals)",
      "Certified Arabic translation (for non-Arabic/English documents)",
    ],
    steps: [
      {
        title: "Attestation in the country of origin",
        detail:
          "The document must first be attested locally: notary public → relevant ministry (e.g. Ministry of Education for degrees, Ministry of Interior for police clearances) → the national Ministry of Foreign Affairs.",
      },
      {
        title: "Qatar Embassy attestation (in home country)",
        detail:
          "After home-country attestation, submit the document to the Qatar Embassy or Consulate in your home country for their stamp. This confirms the home-country attestation is genuine.",
      },
      {
        title: "Arabic translation (if needed)",
        detail:
          "If the document is not in Arabic or English, obtain a certified Arabic translation from a licensed translator in Qatar or the home country. This is required for most legal uses in Qatar.",
      },
      {
        title: "Submit to Qatar MOFA for final attestation",
        detail:
          "Visit the Qatar Ministry of Foreign Affairs (MOFA) building in West Bay or submit online via mofa.gov.qa. Submit the document, QID, and translation. Choose standard (3–5 days) or express (1 day) service.",
      },
      {
        title: "Collect attested document from MOFA",
        detail:
          "Collect from the MOFA service centre or receive by courier. The MOFA stamp is the final legal attestation — your document is now valid for use in Qatar government processes.",
      },
    ],
    tips: [
      "Start the home-country attestation chain 6–8 weeks before you need the document in Qatar — the home-country steps are the most time-consuming.",
      "Qatar Embassies abroad sometimes have long queues or limited appointment availability — book online or check their website for walk-in hours well in advance.",
      "For educational certificates specifically, some countries have an 'apostille' system (Hague Convention countries). Qatar is NOT a Hague Convention member — apostille is NOT a substitute for the full attestation chain.",
      "Keep 2–3 notarised copies of all important documents before starting attestation — the originals are kept at various checkpoints and can be delayed.",
    ],
    portals: [
      { name: "MOFA Qatar", url: "https://mofa.gov.qa/" },
      { name: "Hukoomi (MOFA services)", url: "https://hukoomi.gov.qa/" },
    ],
    faq: [
      {
        q: "Does Qatar accept apostille instead of full attestation?",
        a: "No. Qatar is not a member of the Hague Apostille Convention. An apostille stamp from your home country is not a substitute for the full attestation chain (home country MFA → Qatar Embassy → Qatar MOFA). You must complete all three levels.",
      },
      {
        q: "How long does the full attestation process take?",
        a: "The home-country portion (local notary → home MFA → Qatar Embassy) can take 2–8 weeks depending on the country and document type. The Qatar MOFA step takes 3–5 days standard or 1 day express. Plan for 4–10 weeks total.",
      },
      {
        q: "Can I use a typing centre or PRO service for attestation?",
        a: "Yes. Many typing centres and PRO services in Qatar manage the MOFA submission step on your behalf for a service fee (typically QAR 100–200 on top of official fees). They do not handle the home-country steps.",
      },
    ],
    related: ["work-visa", "family-visa", "business-registration"],
  },
};
