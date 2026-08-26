export type PublishStatus = "Draft" | "Published" | "Hidden";
export type LegalStatus = "Draft" | "Published" | "Archived";

export interface FaqItem { id: string; question: string; answer: string; category: string; order: number; status: PublishStatus; updatedAt: string; }
export interface LegalVersion { version: number; updatedBy: string; date: string; status: LegalStatus; note: string; content: string; }
export interface LegalPage { id: string; title: string; slug: string; description: string; content: string; effectiveDate: string; updatedAt: string; updatedBy: string; status: LegalStatus; versions: LegalVersion[]; }
export interface Job { id: string; title: string; department: string; location: string; type: string; shortDescription: string; description: string; responsibilities: string; requirements: string; applicationLink: string; status: "Draft" | "Open" | "Closed"; }
export interface OrderedItem { id: string; title: string; description: string; details: string; active: boolean; order: number; }
export interface PressAsset { id: string; name: string; category: string; dataUrl: string; active: boolean; }
export interface BrandColor { id: string; name: string; hex: string; order: number; }
export interface CompanyPage { id: "careers" | "sponsor-program" | "press-kit"; title: string; status: PublishStatus; updatedAt: string; }
export interface Activity { id: string; admin: string; action: string; content: string; date: string; }

export interface WebsiteContentState {
  faqs: FaqItem[];
  legal: LegalPage[];
  companyPages: CompanyPage[];
  careers: { intro: string; description: string; cta: string; emptyMessage: string; jobs: Job[] };
  sponsor: { headline: string; intro: string; benefits: string; cta: string; contact: string; opportunities: OrderedItem[]; packages: OrderedItem[] };
  press: { about: string; shortDescription: string; extendedDescription: string; typography: string; guidelines: string; pressEmail: string; contactName: string; phone: string; instructions: string; assets: PressAsset[]; colors: BrandColor[] };
  activity: Activity[];
}

const now = "2026-08-20";
export const defaultWebsiteContent: WebsiteContentState = {
  faqs: [
    { id: "faq-1", question: "How do I register for a tournament?", answer: "Open an active competition, review its eligibility rules, and complete registration from your player dashboard.", category: "Tournaments", order: 1, status: "Published", updatedAt: now },
    { id: "faq-2", question: "Can I create or join a team?", answer: "Yes. Players can create teams, invite members, or accept an invitation from an existing team.", category: "Teams", order: 2, status: "Published", updatedAt: now },
    { id: "faq-3", question: "How are prizes distributed?", answer: "Prize allocations are published on each competition page. Eligible winners are contacted for settlement details after results are approved.", category: "Prizes", order: 3, status: "Draft", updatedAt: now },
  ],
  legal: ["Terms of Service", "Privacy Policy", "Refund Policy", "Fair Play Policy"].map((title, index) => ({ id: `legal-${index + 1}`, title, slug: title.toLowerCase().replaceAll(" ", "-"), description: `Public ${title.toLowerCase()} for Short Circuit Arena.`, content: `# ${title}\n\nAdd the approved legal content for this document here.`, effectiveDate: now, updatedAt: now, updatedBy: "SCA Admin", status: index < 2 ? "Published" : "Draft", versions: [{ version: 1, updatedBy: "SCA Admin", date: now, status: index < 2 ? "Published" : "Draft", note: "Initial document", content: `# ${title}` }] })),
  companyPages: [
    { id: "careers", title: "Careers", status: "Draft", updatedAt: now },
    { id: "sponsor-program", title: "Sponsor Program", status: "Published", updatedAt: now },
    { id: "press-kit", title: "Press Kit", status: "Draft", updatedAt: now },
  ],
  careers: { intro: "Build the future of competitive gaming with SCA.", description: "Manage the public careers introduction and current opportunities.", cta: "View open positions", emptyMessage: "There are no open positions at this time. Please check back soon.", jobs: [] },
  sponsor: { headline: "Partner with Short Circuit Arena", intro: "Create meaningful competitive gaming experiences with SCA.", benefits: "Brand visibility\nCommunity reach\nCompetition integration", cta: "Become a partner", contact: "", opportunities: [{ id: "opp-1", title: "Tournament Sponsorship", description: "Support a standalone SCA competition.", details: "", active: true, order: 1 }], packages: [{ id: "pkg-1", title: "Community Partner", description: "A flexible partnership package.", details: "Contact Us for Pricing", active: true, order: 1 }] },
  press: { about: "", shortDescription: "", extendedDescription: "", typography: "", guidelines: "", pressEmail: "", contactName: "", phone: "", instructions: "", assets: [], colors: [{ id: "color-1", name: "SCA Mint", hex: "#32D9BC", order: 1 }] },
  activity: [],
};

const STORAGE_KEY = "sca-website-content-v1";
export const loadWebsiteContent = (): WebsiteContentState => {
  try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? { ...defaultWebsiteContent, ...JSON.parse(saved) } : defaultWebsiteContent; }
  catch { return defaultWebsiteContent; }
};
export const saveWebsiteContent = (state: WebsiteContentState) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
export const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
