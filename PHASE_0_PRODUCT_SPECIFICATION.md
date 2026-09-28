# PHASE 0 PRODUCT SPECIFICATION
## Project: PRACHAR (Phygital Publicity & Digital Identity Platform)
**Document Version:** 1.0.0 (Phase 0 Baseline)  
**Status:** READY FOR AUDIT  
**Date:** September 2026  
**Primary Sources:**
1. Handwritten Product/Website Blueprint (Project Owner)
2. Existing Publication & Business Artifact: `"BOOK COVER BBSR.docx"`

---

## 1. Executive Summary

**PRACHAR** is evolving from a localized, print-based monthly advertisement booklet in Bhubaneswar, Odisha, into a modern **Phygital Publicity & Digital Identity Platform**. 

The existing operation publishes a physical advertising booklet distributed free across Bhubaneswar ("ମାଗଣା ବଣ୍ଟନ" / Free Distribution) under the registered banner of **PRACHAR - Phygital Publicity** (A Unit of *Saroswati Khabar*, PRGI Reg No. `ORORI/25/A3295`). The platform currently serves local micro-, small-, and medium-sized enterprises (MSMEs), individual service professionals, retail merchants, and local community members announcing commercial offers, greetings, and events.

The new product bridges the physical and digital worlds:
- **Digital Identity & Micro-Profiles:** Allows individuals and businesses to claim a permanent, verified digital identity (`/u/:username`) featuring contact actions, service lists, business catalogs, location maps, and social links.
- **Physical-to-Digital Interactivity:** Connects physical touchpoints (NFC/smart cards and printed QR codes on business cards, storefronts, and within the monthly print booklet) directly to dynamic public profiles.
- **Hyper-Local Advertising Engine:** Digitalizes the booking, submission, and publication of classified and display advertisements—unifying print placements (B&W Mini-Quarter to Full Colour Page) with high-traffic digital discovery.
- **Regional Pride & Rooted Identity:** Anchor the platform visually and culturally in Odisha, starting with Bhubaneswar as the flagship hub before expanding to other commercial clusters across the state.

This Phase 0 document consolidates all historical business data, blueprints, technological considerations, and functional boundaries to serve as the single source of truth prior to any engineering implementation.

---

## 2. Product Vision & Mission

### 2.1 The Core Problem
1. **Hyper-Local Marketing Inefficiency:** Small business owners, freelance contractors, and local service providers in Bhubaneswar rely on word-of-mouth, physical pamphlets, or fragmented WhatsApp posts. Physical visiting cards are easily lost, out-of-date, and incapable of showing live offers or dynamic portfolios.
2. **Disconnected Print Advertising:** Traditional local print media lacks measurable attribution, digital interactivity, and instant user conversion actions (e.g., tap-to-call, tap-to-WhatsApp, live GPS navigation).
3. **High Digital Adoption Friction:** Non-technical local entrepreneurs find building custom websites or managing complex digital marketing suites too expensive, intimidating, and difficult to maintain.

### 2.2 The Solution: "Phygital Publicity"
PRACHAR delivers a **unified phygital ecosystem**:
- **Physical Front:** Tangible touchpoints including the high-circulation monthly booklet distributed across neighborhoods, paired with physical smart cards and scannable QR stickers.
- **Digital Core:** Lightning-fast, mobile-optimized web profiles, dynamic QR routing, instant messaging CTAs, AI-assisted content creation, and real-time scan analytics.
- **Local Network Effect:** Community-first advertising where local enterprises and residents discover each other, announce life milestones (birthdays, wedding anniversaries, festival greetings), and drive local commerce.

### 2.3 Value Propositions by Segment
- **For Micro & Local Businesses:** An instant, professional digital presence with zero hosting headache, combined with affordable physical-print exposure across Bhubaneswar.
- **For Individual Professionals & Executives:** A sleek, reusable digital visiting card with tap/scan sharing that updates in real time.
- **For Local Residents / Consumers:** A centralized, trustworthy local directory and monthly digest to find reliable neighborhood services, exclusive discounts, and community announcements.
- **For PRACHAR Operations:** Automated ad booking, verified digital payments, streamlined print edition proofing, and scalable platform governance.

---

## 3. Source Consolidation & Source-of-Truth Matrix

This matrix establishes absolute traceability for every core requirement, distinguishing confirmed historical data from blueprint concepts and areas requiring clarification.

| Req ID | Domain / Feature | Source | Source Evidence / Extraction | Interpretation & Scope | Confidence | Status | Clarification Required |
|---|---|---|---|---|---|---|---|
| **SRC-01** | Brand Identity: PRACHAR | Word Doc & Blueprint | Word Doc: "ପ୍ରଚାର", "PRACHAR", "PHYGITAL PUBLICITY" | Core platform brand name and descriptor | High | CONFIRMED | None |
| **SRC-02** | Print Circulation & Frequency | Word Doc | Word Doc: "ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା", "FREE DISTRIBUTION" | Monthly publication distributed free in local areas | High | CONFIRMED | Exact distribution points and print run volume |
| **SRC-03** | Existing Ad Packages (P1–P5) | Word Doc | Word Doc Table: P1 (550/1500), P2 (1030/3000), P3 (2050/6000), P4 (4100/12000), P5 (6000/15000) | 5 structured print display tiers with 1-edition and 3-edition pricing | High | CONFIRMED | None (Prices must be preserved) |
| **SRC-04** | Monthly Ad Cutoff Date | Word Doc | Word Doc: "Cutoff date for all advertisement is 18TH of every month" | Strict monthly publication deadline | High | CONFIRMED | Digital ad cutoff vs print ad cutoff |
| **SRC-05** | Legal & Press Registrations | Word Doc | Word Doc: PRGI ORORI/25/A3295; Udyam: UDYAM-OD-04-0039313; TLs: 2022/2025 | Registered unit of *Saroswati Khabar*, published in BBSR | High | CONFIRMED | Verification of current trade license renewals |
| **SRC-06** | Key Personnel & Contacts | Word Doc | Chief Editor: Ashutosh Mahalik; Owner: Purusottam Sahu; Printer: Chandan Printers | Editorial, operational, and printing chain of custody | High | CONFIRMED | Roles of personnel in digital administration |
| **SRC-07** | Ad Categories & Greetings | Word Doc | Odia text: Business/Service, Offers/News, Festival greetings, Birthday/Anniversary | Both commercial and personal/social greeting ads supported | High | CONFIRMED | Standardized digital categories vs custom print copy |
| **SRC-08** | Payment Modes (Existing) | Word Doc | Word Doc: "Charges of display advertisement should be in all digital mode, Phone Pay, Cash" | Hybrid cash/UPI manual payment acceptance | High | CONFIRMED | Moving to automated Razorpay UPI gateway for digital |
| **SRC-09** | Jurisdiction & Legal Disclaimer | Word Doc | Word Doc: "Any dispute subject to Odisha Jurisdiction only"; Advertiser liability waiver | Legal terms for advertising submissions | High | CONFIRMED | Digital Terms of Service drafting |
| **SRC-10** | Odisha Hero Map & BBSR Highlight | Blueprint & Prompt | Explicit requirement: Visual Odisha map with animated Bhubaneswar pulse | Hero section regional anchoring visual | High | CONFIRMED | Interactive hover states vs static SVG animation |
| **SRC-11** | Digital Profile / Card (`/u/:slug`) | Blueprint | Handwritten architecture: Digital profile, QR link, contact actions | Public-facing responsive micro-website for users | High | CONFIRMED | Slug reservation rules and custom domains |
| **SRC-12** | Dynamic QR System | Blueprint | Handwritten flow: Physical/Digital Card -> QR -> Permanent URL -> Profile | 302/dynamic redirection QR engine | High | CONFIRMED | QR generation format (SVG/PNG) & error correction |
| **SRC-13** | Physical Smart Card | Blueprint & Prompt | Concept of physical companion card with QR/NFC | Physical NFC/PVC card paired to digital account | Medium | IMPLIED / REQUIRES CLARIFICATION | Card manufacturing, fulfillment, pricing, and activation flow |
| **SRC-14** | Interactive Product "Demo" | Blueprint | Blueprint section: "Demo" | Demonstration capability on public website | Medium | REQUIRES CLARIFICATION | Is it an interactive card builder, video tour, or sample profile? |
| **SRC-15** | AI Content Assistant | Blueprint & Prompt | AI assistance for copy, bios, and greetings | OpenAI API integration for local business copy | Medium | IMPLIED / PROPOSED | Token cost model and Odia language generation accuracy |
| **SRC-16** | Blog & Local Editorial | Blueprint | Blueprint navigation: "Blog" / Articles | CMS for local news, announcements, and SEO content | Medium | IMPLIED | Editorial ownership and posting cadence |

---

## 4. Existing PRACHAR Business Model

The following business facts and parameters are extracted verbatim from `"BOOK COVER BBSR.docx"` and reflect the operating reality of the business:

### 4.1 Publication & Legal Metadata
- **Publication Name (Odia):** ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା — ପ୍ରଚାର ("Our Locality's Monthly Advertisement Booklet — PRACHAR")
- **Brand Title:** PRACHAR — PHYGITAL PUBLICITY
- **Legal Parent Entity:** A Unit of *Saroswati Khabar*
- **Press Registrar General of India (PRGI) Registration:** `ORORI/25/A3295`
- **MSME / Udyam Registration:** `UDYAM-OD-04-0039313`
- **Trade License Numbers:** 
  - `TL/BDG/2022-09-26/016028`
  - `TL/BPL/2025-10-10/071702`
- **Distribution Model:** 100% Free Distribution ("ମାଗଣା ବଣ୍ଟନ") across Bhubaneswar neighborhoods.

### 4.2 Key Personnel & Physical Location
- **Chief Editor:** Ashutosh Mahalik  
  - *Address:* Plot No. - ……………….., BJB Nagar, Bhubaneswar, Odisha  
  - *Contact Phone:* `+91 7978943757`  
  - *Email:* `asutoshamahalik@gmail.com`
- **Published & Owned By:** Purusottam Sahu  
  - *Address:* BJB Nagar, Bhubaneswar, Odisha  
  - *Contact Phone:* `+91 9178898844`  
  - *Email:* `pracharbbsr1@gmail.com`
- **Printed At:** Chandan Printers  
  - *Address:* Plot No-3, Gopabandhu Chhak, Unit-3, Bhubaneswar, Khordha, Odisha, PIN - 751003
- **General Inquiry / Booking Numbers:** `+91 7077011733` / `+91 9178898844`
- **Official Inquiries Email:** `PRACHARBBSR1@GMAIL.COM`

### 4.3 Existing Advertisement Offerings & Social Messages
The print publication accepts four distinct classifications of advertisements and greetings:
1. **Business & Service Advertisements:** Commercial promotions for local shops, workshops, clinics, tuition centers, trades, and professional services (`ବ୍ୟବସାୟ ଓ ସେବା ର ବିଜ୍ଞାପନ`).
2. **Business Offers & News:** Timely retail announcements, discounts, stock arrivals, branch openings, or seasonal clearances (`ବ୍ୟବସାୟ ର ନୁଆଁ ଅଫର ଓ ଖବର`).
3. **Festival Greetings:** Warm wishes placed by businesses or prominent citizens during Durga Puja, Raja, Ratha Yatra, Diwali, Nuakhai, etc. (`ପର୍ବ ପର୍ବାଣି ର ଶୁଭେଚ୍ଛା`).
4. **Personal Milestones:** Family and community announcements including Birthdays and Wedding Anniversaries (`ଜନ୍ମଦିନ / ବିବାହ ବାର୍ଷିକୀ ର ଶୁଭେଚ୍ଛା`).

### 4.4 Existing Rate Card (Print Edition)
*Note: All monetary figures are in Indian Rupees (INR). These rates are established historical rates and MUST NOT be altered without business authorization.*

| Package Code | Advertisement Format / Size | 1st Edition Single-Issue Rate (₹) | 3-Edition Scheme Rate (₹) | Implied Savings / Edition |
|:---:|:---|:---:|:---:|:---:|
| **P1** | B&W MINI-QUARTER | ₹550 | ₹1,500 | Save ₹150 (₹500/ed) |
| **P2** | B&W QUARTER | ₹1,030 | ₹3,000 | Save ₹90 (₹1,000/ed) |
| **P3** | B&W HALF PAGE | ₹2,050 | ₹6,000 | Save ₹150 (₹2,000/ed) |
| **P4** | B&W FULL PAGE | ₹4,100 | ₹12,000 | Save ₹300 (₹4,000/ed) |
| **P5** | COLOUR FULL PAGE | ₹6,000 | ₹15,000 | Save ₹3,000 (₹5,000/ed) |

### 4.5 Standard Operating Terms & Conditions (Verbatim)
1. **Advertiser Autonomy & Liability:** *"All advertisements, logos, photos, material, claims given, in the messages are solely from the Advertisers on their free will."*
2. **Strict Monthly Deadline:** *"Cutoff date for all advertisement is 18TH of every month."*
3. **Payment Terms:** *"Charges of display advertisement should be in all digital mode, Phone Pay, Cash."*
4. **Editorial Discretion:** *"The right to acceptance of matter is reserved with us."*
5. **Legal Jurisdiction:** *"Any dispute subject to Odisha Jurisdiction only."*

---

## 5. Digital Product Model & Synergy Evaluation

How does the new digital web application relate to the existing PRACHAR publication?

### 5.1 Strategic Model Evaluation
- **Option A: Digital Version of the Booklet (E-Paper/PDF Flipbook):**  
  *Pros:* Simple to implement; mimics existing print layouts.  
  *Cons:* Poor mobile UX, zero search engine discoverability, no interactive tap-to-call, minimal valuation upside.  
  *Verdict:* **Rejected as standalone product.** (Can exist purely as an archived PDF download utility).
- **Option B: Digital Profile SaaS Platform Operating Independently:**  
  *Pros:* High tech valuation, clean SaaS metrics.  
  *Cons:* Abandons PRACHAR's existing registered legal entity, local print distribution advantage, and established local advertiser relationships in Bhubaneswar.  
  *Verdict:* **Sub-optimal.**
- **Option C: An Independent Platform Owned by PRACHAR:**  
  *Pros:* Clean separation of print and tech.  
  *Cons:* Misses cross-pollination where print ads drive digital traffic and digital users buy print ads.  
  *Verdict:* **Sub-optimal.**
- **Option D: Unified "Phygital" Hybrid Ecosystem (PRACHAR Booklet + Digital Identity & Ad Platform):**  
  *Pros:* Directly honors the coined descriptor **"PHYGITAL PUBLICITY"**. Every print ad features a dynamic QR code leading to the advertiser's PRACHAR digital profile. Every digital subscriber can bundle print distribution into their local outreach.  
  *Verdict:* **RECOMMENDED ARCHITECTURAL FOUNDATION.**

### 5.2 [BUSINESS DECISION REQUIRED]
The project owner and leadership must formally decide between:
1. **Integrated Phygital Bundle:** Every physical print ad (P1–P5) automatically receives a complimentary 30-day Digital Profile (`/u/:business-name`) with an interactive QR code printed on their booklet space.
2. **A la Carte Digital Upsell:** Print ads and digital profiles are sold as distinct line items, with bundled discounts.
*Recommendation:* Launch MVP with **Integrated Phygital Bundle** to rapidly populate the digital directory with hundreds of active Bhubaneswar merchant profiles from Day 1.

---

## 6. User Types & Role-Based Access Control (RBAC) Matrix

| User Role | Description / Purpose | Key Permissions | Accessible Areas | Data Visibility |
|---|---|---|---|---|
| **Public Visitor** | Unauthenticated resident, consumer, or prospective client | Read public profiles, scan QRs, view ads, read blog, test demo, initiate contact (call/WhatsApp) | Public Landing, Hero, Odisha Map, `/u/:slug`, `/blog`, `/advertise`, `/contact` | Public business/personal info only; no internal analytics or private contact details |
| **Registered User / Profile Owner** | Individual professional or local entrepreneur with a digital profile | Create/edit profile, manage contact buttons, generate QR codes, view personal scan analytics, request physical card | User Dashboard (`/dashboard`), Profile Editor (`/dashboard/profile`), My QR (`/dashboard/qr`) | Own profile data, private lead clicks, own scan count, own billing history |
| **Advertiser / Business Owner** | Commercial entity booking display advertisements (digital or print) | All Profile Owner rights + submit ad copy/creatives, select ad packages (P1–P5), pay via Razorpay, view ad metrics | Advertiser Portal (`/dashboard/ads`), Ad Submission (`/advertise/book`), Invoice Center | Own ad creative status, approval logs, ad impression/click telemetry, tax invoices |
| **Editorial & Operations Staff** | PRACHAR operational team members reviewing submissions and booklet layouts | Review ad submissions, approve/reject copy, generate print compilation sheets, verify payments | Internal Portal (`/admin/review`, `/admin/print-batches`) | Ad submissions, uploaded artwork, advertiser contact info, edition assignment |
| **Platform Administrator** | Technical and business leadership managing system integrity | Full administrative authority: user moderation, package pricing configuration, analytics, audit logs | Master Console (`/admin/*`), Security, CMS, Financials, AI Usage logs | System-wide database access, financial reconciliation, security audit logs |

---

## 7. Complete Website Information Architecture

```
[Public Website Root: prachar.in]
│
├── / (Home / Hero Section with Interactive Odisha Map & BBSR Highlight)
│   ├── Value Pillars (Physical Print + Dynamic Digital)
│   ├── Live Feature Showcase (Digital Visiting Card & Tap Actions)
│   ├── How Phygital Works (Print Booklet -> QR Code -> Mobile Profile)
│   ├── Featured Local Businesses (Bhubaneswar Highlights)
│   ├── Interactive Demo Sandbox
│   ├── Pricing & Ad Packages Snapshot
│   └── Testimonials & Local Trust Signals
│
├── /about (Brand Heritage, Saroswati Khabar, Legal Registrations, Leadership)
│   ├── Editorial Team (Purusottam Sahu, Ashutosh Mahalik)
│   ├── Legal Disclosures (PRGI Reg, MSME Udyam, Trade Licenses)
│   └── Printing Details (Chandan Printers, Unit-3, Bhubaneswar)
│
├── /product (Digital Identity, Smart Cards, Dynamic QRs Explained)
│   ├── Digital Card Features (One-tap WhatsApp, Call, Maps, Socials)
│   ├── Physical NFC Card Options (Materials, Ordering, Pairing)
│   └── Enterprise & Team Directory Solutions [FUTURE]
│
├── /services (Comprehensive Phygital Offerings)
│   ├── Monthly Print Booklet Distribution ("ମାଗଣା ବଣ୍ଟନ")
│   ├── Commercial Advertising & Lead Generation
│   └── Community Greetings (Festivals, Birthdays, Anniversaries)
│
├── /advertise (Advertising Hub & Self-Service Booking)
│   ├── Package Comparison (P1 through P5)
│   ├── Print Submission Guidelines (18th of month cutoff)
│   ├── Online Ad Submission Wizard
│   └── Rate Card & Edition Schemes (1st Edition vs 3-Edition Scheme)
│
├── /blog (Local Insights, Business Growth Tips, Community Announcements)
│   ├── Categories: Local Business, Digital Marketing, Bhubaneswar Spotlight
│   └── Article View (`/blog/:slug`) with Schema.org NewsArticle markup
│
├── /demo (Live Interactive Simulator)
│   └── Interactive Mobile Device Frame simulating a live `/u/demo-profile`
│
├── /contact (Official Editorial & Office Channels)
│   ├── Direct Phone Lines (7077011733 / 9178898844)
│   ├── Office Email (PRACHARBBSR1@GMAIL.COM)
│   └── Location Address: BJB Nagar, Bhubaneswar, Odisha
│
├── /u/:username (Public Responsive Digital Profile / Card)
│   ├── Bio, Avatar/Logo, Designation, Company
│   ├── Action Grid: Call, WhatsApp, Email, Save to Contacts (vCard)
│   ├── Google Maps Location Embed & Directions
│   ├── Services & Catalog Grid
│   └── Verified PRACHAR Phygital Badge
│
├── /qr/:qrCodeId (Dynamic Tracking Redirect -> 302 to `/u/:username`)
│
├── /auth (Authentication Flow)
│   ├── /login (Mobile OTP / Email Magic Link / Password)
│   └── /register (Claim vanity `/u/:username` handle)
│
└── /dashboard (Secure User & Advertiser Workspace)
    ├── /profile (Edit bio, links, business info, logo)
    ├── /qr (Download high-res vector SVG/PNG QR codes)
    ├── /analytics (Scans, click-through rates, top devices)
    ├── /ads (Manage print and digital ad bookings)
    └── /orders (Invoices, payment receipts via Razorpay)
```

---

## 8. Hero Section Specification

The Hero section is the emotional and conceptual centerpiece of the platform, immediately communicating regional authority, technological sophistication, and the bridge between physical Odisha and the digital world.

```
+-----------------------------------------------------------------------------------------+
|                                    NAVIGATION BAR                                       |
|  [PRACHAR Logo]       Product   Services   Advertise   Blog   Demo       [Get Your Card]|
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|       LEFT COLUMN (55% Desktop)                     RIGHT COLUMN (45% Desktop)          |
|                                                                                         |
|   [Badge: #1 Phygital Network of Odisha]          +---------------------------------+   |
|                                                   |        VISUAL ODISHA MAP        |   |
|   HEADING:                                        |                                 |   |
|   Empowering Bhubaneswar’s                        |            /\                   |   |
|   Local Businesses with                           |           /  \      Odisha      |   |
|   Phygital Publicity.                             |     /\   /    \     Contour     |   |
|                                                   |    /  \_/      \                |   |
|   SUBHEADING:                                     |   |             \               |   |
|   From our widely read monthly print booklet      |   |       ( * )  | <[BHUBANESWAR|   |
|   to dynamic QR-powered digital profiles.         |    \     BBSR    /    PULSE PIN]|   |
|   Get discovered, connect with local customers,   |     \___        /               |   |
|   and grow your local presence.                   |         \______/                |   |
|                                                   |                                 |   |
|   PRIMARY CTA:                                    |   [Interactive Floating Card:   |   |
|   [ Create Your Digital Card -> ]                 |    "Bhubaneswar Edition Live"]  |   |
|                                                   +---------------------------------+   |
|   SECONDARY CTA:                                                                        |
|   [ Explore Advertising Packages ]                                                      |
|                                                                                         |
|   TRUST BAR:                                                                            |
|   [Free Print Distribution]  *  [PRGI Registered]  *  [BJB Nagar, Bhubaneswar]          |
+-----------------------------------------------------------------------------------------+
```

### 8.1 Visual Hierarchy & Copywriting
1. **Context Tagline / Chip:** `ଆମ ଅଂଚଳ ର ପ୍ରଚାର • Odisha’s Premier Phygital Network`
2. **Primary Heading (H1):** `Bhubaneswar's Trusted Publicity Platform — Now Powered by Digital Identity.`
3. **Supporting Body:** `Connect your business card, physical storefront, and print advertisement to an interactive digital presence. Distributed free across Bhubaneswar, accessible to the world with a single QR scan.`
4. **Primary Call to Action (CTA):** `Claim Your Profile Handle` (Navigates to `/auth/register`)
5. **Secondary CTA:** `Book Print Ad (Cutoff: 18th)` (Navigates to `/advertise`)
6. **Social Proof Badges:** 
   - `PRGI Reg: ORORI/25/A3295`
   - `Bhubaneswar Monthly Circulation`
   - `100% Free Doorstep & Commercial Distribution`

---

## 9. Odisha & Bhubaneswar Visual Map Experience

### 9.1 Strategic Rationale: Why the Map Exists
1. **Grounding in Local Pride:** PRACHAR’s motto is *"ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା"* (Our Locality’s Monthly Advertising Booklet). The state map provides an immediate emotional and cultural anchor for Odisha’s entrepreneurship.
2. **Clarifying the Phygital Launchpad:** Highlighting **Bhubaneswar** visually signifies that the capital city is the active operational epicenter of PRACHAR’s first edition, while the surrounding Odisha outline communicates future state-wide scalability (Cuttack, Puri, Rourkela, Berhampur, Sambalpur).

### 9.2 Conceptual Visual Sequencing (Phase 0 Definition)
*Note: This sequence defines the UX intent for future UI implementation; it is NOT implemented in Phase 0.*

1. **Stage 1 (Contour Initialization):** The geographic silhouette of Odisha renders with an elegant, glowing stroke in clean SVG vector format.
2. **Stage 2 (Topography & Regional Tone):** The state fill gently transitions into a deep modern palette (e.g., slate/indigo with warm regional terracotta or copper accents).
3. **Stage 3 (Bhubaneswar Pin Drop & Radiant Pulse):** A precise coordinate marker anchors at Bhubaneswar (approx. latitude 20.2961° N, longitude 85.8245° E). A radar pulse radiates outwards.
4. **Stage 4 (Phygital Connectivity Beam):** A glowing data vector projects from the Bhubaneswar pin toward a floating preview of the PRACHAR Digital Profile and print booklet cover.
5. **Stage 5 (Hero Copy Focus):** The visual balance stabilizes, drawing the user’s eye naturally to the primary headline and conversion CTA.
6. **Stage 6 (Scroll Parallax):** Upon downward scrolling, the map scales subtly and pans into the background, anchoring the "About Bhubaneswar Circulation" section.

### 9.3 Device & Performance Specifications
- **Desktop (Viewport >= 1024px):** Map occupies 45%–50% right split with interactive coordinate tooltips and smooth GSAP timeline transitions.
- **Mobile (Viewport < 768px):** Map is positioned above or directly behind the hero copy as a non-blocking background visual element with reduced complexity.
- **Accessibility / Reduced Motion:** If `prefers-reduced-motion: reduce` is active, skip all GSAP path drawing and radar pulses; render the complete SVG map statically with Bhubaneswar pre-highlighted.
- **Format:** Strictly vector SVG (under 30KB minified). **Raster PNG/JPG maps are prohibited** for the hero visual to avoid blurring on Retina displays and heavy layout shifts.

---

## 10. Digital Profile / Digital Card System (`/u/:username`)

The Digital Profile is a high-speed, mobile-first micro-website that represents the user or merchant when their QR code is scanned or URL is shared.

### 10.1 Complete Data Structure

```
+---------------------------------------------------------------------------------+
|                               DIGITAL PROFILE SPEC                              |
+--------------------+---------------------+--------------------------------------+
| Field Name         | Classification      | Description / Formatting             |
+--------------------+---------------------+--------------------------------------+
| Full Name / Title  | REQUIRED            | Individual or Business Name          |
| Username / Slug    | REQUIRED            | Unique vanity URL handle (/u/:slug)  |
| Profile Type       | REQUIRED            | Individual / Professional / Business |
| Category           | REQUIRED            | e.g., Electrician, Restaurant, Clinic|
| City / Locality    | REQUIRED            | Default: Bhubaneswar (Khordha)       |
| Primary Phone      | REQUIRED            | Click-to-Call (+91 standard)        |
| WhatsApp Number    | REQUIRED            | Click-to-WhatsApp pre-filled chat    |
| Avatar / Logo      | OPTIONAL (Default)  | High-res square image (WebP)         |
| Cover Banner       | OPTIONAL            | 16:9 contextual banner image         |
| Designation / Role | OPTIONAL            | e.g., Chief Consultant, Proprietor   |
| Company / Brand    | OPTIONAL            | Associated corporate identity        |
| About / Bio        | OPTIONAL            | 500-char markdown/rich text summary  |
| Email Address      | OPTIONAL            | Click-to-Email mailto link           |
| Website URL        | OPTIONAL            | Outbound link with rel="noopener"    |
| Physical Address   | OPTIONAL            | Postal address + Landmark in BBSR    |
| Google Map Pin     | OPTIONAL            | Latitude/Longitude for GPS nav       |
| Services / Catalog | OPTIONAL            | Repeatable cards (Title, Price, Pic) |
| Social Media Links | OPTIONAL            | Instagram, Facebook, LinkedIn, X     |
| vCard Download     | SYSTEM GENERATED    | One-click `.vcf` contact save file   |
| PRACHAR Badge      | SYSTEM GENERATED    | "Verified Phygital Partner" pill     |
| Custom Domain      | FUTURE ENHANCEMENT  | CNAME mapping (e.g., mybusiness.com) |
| Payment QR / UPI ID| FUTURE ENHANCEMENT  | Direct customer P2P payment launch   |
+--------------------+---------------------+--------------------------------------+
```

### 10.2 Profile Action Hierarchy (Mobile First)
When a customer scans a card, the top 400px of their smartphone screen must immediately reveal:
1. Avatar, Verified Checkmark, Business Name, and Tagline.
2. **Instant Contact Quick-Bar (Sticky Grid):**
   - `[ Call Now ]` (Direct `tel:` protocol)
   - `[ WhatsApp ]` (`https://wa.me/91XXXXXXXXXX?text=Hi%20found%20you%20on%20Prachar`)
   - `[ Location / Maps ]` (Direct Google Maps navigation launch)
   - `[ Save Contact ]` (Instant `.vcf` file generation)
3. Tabbed sections below: **About**, **Services & Pricing**, **Special Offers**, and **Photo Gallery**.

---

## 11. QR System Architecture

The QR engine acts as the immutable physical bridge. To ensure that printed materials (business cards, metal cards, monthly magazine inserts, shop banners) never become obsolete, all QR codes must use a **permanent dynamic redirection model**.

```
[ PHYSICAL ARTIFACT ]            [ RESOLUTION SERVER ]             [ CLIENT DESTINATION ]
┌──────────────────┐             ┌─────────────────────┐           ┌────────────────────┐
│ Printed QR Code  │   Scanned   │  GET /qr/:codeUuid  │  HTTP 302 │  GET /u/:username  │
│  or NFC Chip     ├────────────►│  1. Log Scan Event  ├──────────►│  Render Live       │
│  (Pointed to     │             │  2. Lookup User Map │           │  Responsive Web    │
│   Permanent URL) │             │  3. Issue 302 Redirect          │  Digital Profile   │
└──────────────────┘             └─────────────────────┘           └────────────────────┘
```

### 11.1 QR Technical Lifecycle & Rules
1. **Dynamic Resolution URL:** The physical QR code encodes an immutable system URL:  
   `https://prachar.in/qr/a7c3-4f9e-b2d1`
2. **Decoupled Username Changes:** If the user updates their public handle from `/u/puri-sweets` to `/u/puri-sweets-bbsr`, the printed QR code remains 100% functional. The administrative backend updates the database pointer instantly.
3. **Scan Telemetry Pipeline:** When the `/qr/:codeUuid` endpoint receives a GET request, it asynchronously registers an `AnalyticsEvent` (Timestamp, User-Agent, Referrer, IP hash for unique visitor estimation) before returning an immediate `302 Found` redirect header to the current public profile URL.
4. **Vector Asset Export:** Profile owners can download their dynamic QR code in vector formats (`SVG`, `PDF`) for professional commercial printing and high-res raster (`PNG` at 300 DPI) for digital sharing.
5. **Security & Anti-Abuse:** Rate limit resolution requests per IP to thwart automated scrape bots; block redirect loops; ensure QR tokens are cryptographic UUIDs with sufficient entropy.

---

## 12. Physical Card Specification

### 12.1 Card Meaning in the PRACHAR Product
The Physical Card is an optional, tangible luxury asset that complements the digital profile. It serves as an in-person icebreaker for executives, shopkeepers, sales agents, and doctors.

### 12.2 Lifecycle & Status State Machine
```
[ UNCONFIGURED / INVENTORY ] 
        │ 
        ▼ (Factory printing of QR / NFC encoding)
[ ISSUED / SHIPPED ] 
        │ 
        ▼ (User receives card & logs into dashboard)
[ ACTIVATION FLOW: Claim Code Entry ] 
        │ 
        ▼
[ ACTIVE (Paired to /u/:username) ] ◄── (Normal Operation)
        │
        ├──► [ SUSPENDED ] (Temporarily locked by user if misplaced)
        │
        └──► [ DECOMMISSIONED / REPLACED ] (Reported lost; new card paired)
```

### 12.3 Physical Specifications & Clarification Flags
- **Card Tier 1 (Classic Matte PVC):** Standard credit card size (CR80, 85.60 × 53.98 mm), 300-micron matte finish with high-contrast printed dynamic QR code.
- **Card Tier 2 (Smart NFC Card):** NTAG213 / NTAG216 embedded NFC chip encoded with the permanent `/qr/:uuid` URL, with dual-sided thermal transfer printing.
- **Card Tier 3 (Premium Matte Metal):** Stainless steel / brass finish with laser-etched QR and companion NFC embedded module [FUTURE PROPOSAL].
- **[REQUIRES CLARIFICATION]:**
  - Will physical cards be produced in-house via Chandan Printers or outsourced to specialized plastic card fabricators?
  - Will the physical card be bundled free with the 3-Edition print scheme (e.g. Packages P3/P4/P5) or sold strictly as a standalone add-on?

---

## 13. Advertising System & Workflow

The advertising module represents PRACHAR's core commercial engine, transitioning from manual telephone/paper receipts to a unified phygital booking portal.

### 13.1 Existing Business Process vs. Proposed Digital Workflow

```
+----------------------------------------------------------------------------------------------------+
|                                    ADVERTISING WORKFLOW COMPARISON                                 |
+------------------------------------+---------------------------------------------------------------+
| EXISTING MANUAL PROCESS (Word Doc) | PROPOSED DIGITAL WORKFLOW (Phase 1 MVP)                       |
+------------------------------------+---------------------------------------------------------------+
| 1. Client calls 7077011733         | 1. Advertiser navigates to /advertise                         |
| 2. Verbal or paper negotiation     | 2. Selects package (P1–P5) & Edition Scheme (Single/3-Edition)|
| 3. Hand-delivers photos/text       | 3. Uploads logo, copy, banner; or uses AI Assistant to draft  |
| 4. Pays via Cash or PhonePe manual | 4. Automated checkout via Razorpay (UPI, Cards, NetBanking)   |
| 5. Cutoff strictly 18th of month   | 5. Automated countdown to 18th cutoff; assigns edition number |
| 6. Manual review by Chief Editor   | 6. Operational queue: Editorial approve/reject/request change |
| 7. Chandan Printers print booklet  | 7. Digital ad goes live immediately; print bundle queued for  |
| 8. Free local neighborhood delivery|    monthly booklet batch layout export (PDF/InDesign)         |
| 9. Zero analytics to advertiser    | 8. Advertiser dashboard displays digital impressions & clicks |
+------------------------------------+---------------------------------------------------------------+
```

### 13.2 Editorial Governance & Acceptance Rules
In compliance with the historical business mandate (*"The right to acceptance of matter is reserved with us"* and *"Any dispute subject to Odisha Jurisdiction only"*):
- Every advertisement submission enters an `UNDER_REVIEW` state.
- Administrators can accept, reject, or request revisions on text and creatives.
- Prohibited categories: Misleading financial schemes, unauthorized medical cures, defamatory content, or offensive text violating Indian press laws.

---

## 14. Existing Advertising Packages (Rate Card)

These packages and rates represent the established foundation of PRACHAR and must be integrated cleanly into the digital portal.

### 14.1 Verbatim Print Packages (Confirmed)

```
+------------------------------------------------------------------------------------+
|                     EXISTING PRACHAR ADVERTISING PACKAGES                          |
+---------+--------------------+------------------+------------------+---------------+
| PACKAGE | DETAILS / SIZE     | 1ST EDITION (₹)  | SCHEME 3 ED. (₹) | SAVINGS (₹)   |
+---------+--------------------+------------------+------------------+---------------+
| P1      | B&W MINI-QUARTER   | ₹550             | ₹1,500           | Save ₹150     |
| P2      | B&W QUARTER        | ₹1,030           | ₹3,000           | Save ₹90      |
| P3      | B&W HALF PAGE      | ₹2,050           | ₹6,000           | Save ₹150     |
| P4      | B&W FULL PAGE      | ₹4,100           | ₹12,000          | Save ₹300     |
| P5      | COLOUR FULL PAGE   | ₹6,000           | ₹15,000          | Save ₹3,000   |
+---------+--------------------+------------------+------------------+---------------+
* Additional Conditions:
  - All claims, logos, and materials submitted under advertiser free will.
  - Cutoff date: 18th of every calendar month.
  - Accepted digital payments: PhonePe, UPI, Cash (Historical) -> Razorpay (Digital Platform).
  - Jurisdiction: Odisha Jurisdiction only.
```

### 14.2 Future Digital Advertising Tiers (Proposed)
*Note: These packages represent a FUTURE BUSINESS PROPOSAL and do not alter existing P1–P5 print packages.*

| Digital Package | Display Placement | Duration | Proposed Inclusions | Status |
|---|---|---|---|---|
| **D1: Profile Boost** | Top of category in Bhubaneswar directory | 30 Days | Highlighted badge, featured search result | FUTURE PROPOSAL |
| **D2: Home Banner** | Featured rotation on `/` Home & Explore | 15 Days | Top-strip banner with direct tap-to-WhatsApp | FUTURE PROPOSAL |
| **D3: Greeting Blast** | Dedicated full-width banner on Festive days | 7 Days | Custom festive banner (Raja, Puja, Diwali) | FUTURE PROPOSAL |
| **Phygital Combo P-D**| Print P3/P4/P5 + Digital Profile Pro | Per Edition | Print booklet placement + 30-day verified digital card | PROPOSED MVP COMBO |

---

## 15. Blog & Local Content System

### 15.1 Purpose & Alignment
The Blog is not a generic tech journal; it is a **hyper-local editorial engine** that supports PRACHAR’s identity as an informative community publication ("ଆମ ଅଂଚଳ ର ଖବର").

### 15.2 Structural Requirements
- **Categories:** 
  1. *Bhubaneswar Business Spotlight:* In-depth profiles of local craftsmen, shops, and startups.
  2. *Festivals & Cultural Heritage:* Celebrating Odisha's heritage (Raja Parba, Ratha Yatra, Boita Bandana, Durga Puja).
  3. *Local Business Guides:* Practical tips for local merchants on digital marketing, customer service, and tax registration (Udyam, GST).
  4. *PRACHAR Edition Releases:* Monthly announcements highlighting new booklet issues, delivery zones, and community winners.
- **Editorial Capabilities:** Multi-author publishing, draft/publish lifecycle, Open Graph social share image generation, tag indexing, and automated RSS/Sitemap feeds for search engines.

---

## 16. Interactive Demo System

### 16.1 Analysis of Blueprint's "Demo" Concept
The blueprint specifically features a "Demo" navigational anchor. In the context of a Phygital Card and Advertising platform, what must this be?

1. **Evaluation of Options:**
   - *Option 1: Static Video Tour:* Low engagement; quickly becomes outdated.
   - *Option 2: Passive Screenshot Carousel:* Boring, does not showcase interactive mobile actions.
   - *Option 3: Interactive Sandbox Simulator:* A split-screen UI on desktop (or tabbed on mobile) featuring a live smartphone device mockup. Visitors can click buttons (Call, WhatsApp, Save Contact, Change Theme) to experience firsthand how their customers will interact with their profile.
2. **Phase 0 Determination:**  
   **Interactive Sandbox Simulator** is the confirmed vision for the `/demo` page and the homepage demo widget.
3. **[REQUIRES CLARIFICATION]:**  
   Should the Demo allow an unauthenticated visitor to temporarily type their own name and phone number to preview an instant mock profile before signing up? (*Recommended: Yes, as a high-conversion lead generation tool*).

---

## 17. AI Assistant System

To maintain architectural discipline and prevent budget overruns, the AI integration is strictly limited to high-value, practical text generation utilities that solve real customer friction.

```
+-------------------------------------------------------------------------------------------------------+
|                                      AI CAPABILITY MATRIX                                             |
+----------------------+--------------------+--------------------+--------------------+-----------------+
| Feature Name         | Target User        | Inputs             | Generated Output   | MVP vs Future   |
+----------------------+--------------------+--------------------+--------------------+-----------------+
| AI Bio & Tagline     | Profile Owners /   | Business category, | Concise 2-sentence | MUST HAVE (MVP) |
| Generator            | Local Merchants    | key services, city | professional bio   |                 |
+----------------------+--------------------+--------------------+--------------------+-----------------+
| Ad Copy Assistant    | Advertisers booking| Offer type, discount| Punchy 50-word ad  | SHOULD HAVE     |
|                      | P1–P5 or digital   | percentage, dates  | copy for print/web |                 |
+----------------------+--------------------+--------------------+--------------------+-----------------+
| Bilingual Greetings  | Residents placing  | Occasion (Birthday,| Festive greeting in| LATER (Phase 2) |
| Creator (Odia/Eng)   | social ads         | Anniversary, Raja) | Odia & English     |                 |
+----------------------+--------------------+--------------------+--------------------+-----------------+
| Automated Review     | Operational Admin  | Submitted text     | Flagged keywords,  | LATER (Phase 3) |
| & Moderation Check   |                    |                    | profanity, claims  |                 |
+----------------------+--------------------+--------------------+--------------------+-----------------+
```

### 17.1 Technical & Cost Boundaries
- **Engine:** OpenAI API (`gpt-4o-mini` or current cost-efficient model) wrapped behind backend API endpoints (`/api/ai/generate-bio`).
- **Safeguards:** Strict rate-limiting (e.g., maximum 5 AI generations per registered user per day); server-side prompt engineering with system instructions forbidding hallucinated claims and enforcing concise output.

---

## 18. Analytics & Telemetry Engine

### 18.1 Telemetry Events Framework
```
[User Action] ──► [Client Beacon / Endpoint] ──► [Event Processing Service] ──► [Aggregated Metric]
1. Scan Physical QR   --> GET /qr/:id (Backend)    --> Log QR_SCAN               --> Total Scans
2. View Web Profile   --> GET /u/:slug (Next.js)   --> Log PROFILE_VIEW          --> Total Views
3. Click Call Button  --> POST /api/analytics/ev   --> Log CLICK_CALL            --> Lead Actions
4. Click WhatsApp     --> POST /api/analytics/ev   --> Log CLICK_WHATSAPP        --> Direct Inquiries
5. Download vCard     --> POST /api/analytics/ev   --> Log VCARD_DOWNLOAD        --> Contacts Saved
6. Click Google Maps  --> POST /api/analytics/ev   --> Log MAP_DIRECTIONS        --> Store Visits
```

### 18.2 MVP vs. Advanced Scope
- **MVP Analytics (Must Have):** Lifetime scan count, lifetime unique profile views, total call clicks, total WhatsApp clicks. Displayed simply in the user dashboard.
- **Advanced Analytics (Later):** Geo-location heatmaps, device/browser distributions, time-of-day peak charts, ad impression conversion rates.

---

## 19. Platform Administration System

The Administrative Back-Office allows the PRACHAR operations team to manage print runs, review digital profiles, and reconcile payments.

```
+---------------------------------------------------------------------------------+
|                          ADMINISTRATIVE CONSOLE MODULES                         |
+--------------------+------------------------------------------------------------+
| Module             | Core Capabilities & Operations                             |
+--------------------+------------------------------------------------------------+
| User Management    | View users, ban fraudulent accounts, reset passwords, OTP  |
| Profile Moderation | Review public profiles, suspend inappropriate slugs/content|
| Ad Booking Pipeline| Queue of submissions for 18th cutoff; approve/reject copy  |
| Print Batch Export | Compile accepted P1–P5 ads into high-res print export list |
| Package Pricing    | Adjust active rates, create promotional seasonal discounts |
| Financials / Orders| Razorpay transaction logs, manual cash payment approvals   |
| CMS & Blog Editor  | Draft, edit, schedule, and publish blog articles & notices |
| AI Monitoring      | Track token consumption, cost per user, generation logs    |
| Audit Logging      | Immutable logs of all administrative state alterations     |
+--------------------+------------------------------------------------------------+
```

---

## 20. Security & Compliance Architecture

1. **Authentication & Identity:**
   - Mobile Phone Number + One-Time Password (OTP) via SMS as primary Indian user authentication.
   - Fallback to Email + Secure Password with bcrypt hashing (work factor 12).
   - Stateless JWT tokens with short lifespan (15 mins access token) and secure, HTTP-only, SameSite refresh tokens stored in Redis.
2. **Authorization & RBAC:**
   - Spring Security method-level annotations (`@PreAuthorize("hasRole('ADMIN')")`).
   - Profile modification restricted strictly to the authenticated resource owner.
3. **Data Protection & Privacy (DPDP Act 2023 Compliance):**
   - User phone numbers and personal emails are protected against automated scraping (e.g., telephone numbers rendered behind click-to-reveal or obfuscated in raw HTML).
   - Right to erasure: Users can deactivate or permanently delete their profiles.
4. **Payment Security:**
   - PCI-DSS compliance via Razorpay checkout modal; zero raw card numbers or UPI PINs touch PRACHAR servers.
   - Cryptographic signature validation for all Razorpay payment webhooks.
5. **Infrastructure Hardening:**
   - Nginx reverse proxy with SSL/TLS (Let's Encrypt automated renewal).
   - Strict rate limiting on auth endpoints (5 OTP requests per hour per IP/phone).
   - File upload validation: Enforce MIME-type verification, maximum 5MB size, stripped EXIF metadata, and virus scanning prior to S3 persistence.

---

## 21. Conceptual Database Domain Model

*Note: Conceptual domain modeling only. No physical database tables or migrations are created in Phase 0.*

```
                 ┌────────────────────────────────────────────────────────┐
                 │                          User                          │
                 │ ────────────────────────────────────────────────────── │
                 │  id (UUID, PK)                                         │
                 │  phone_number (VARCHAR, Unique)                        │
                 │  email (VARCHAR, Unique, Nullable)                     │
                 │  password_hash (VARCHAR, Nullable)                     │
                 │  role (ENUM: VISITOR, USER, ADVERTISER, STAFF, ADMIN)  │
                 │  created_at, updated_at (TIMESTAMP)                   │
                 └──────────────────────────┬─────────────────────────────┘
                                            │ 1:1
                                            ▼
                 ┌────────────────────────────────────────────────────────┐
                 │                        Profile                         │
                 │ ────────────────────────────────────────────────────── │
                 │  id (UUID, PK)                                         │
                 │  user_id (UUID, FK -> User)                            │
                 │  username_slug (VARCHAR, Unique)                       │
                 │  display_name (VARCHAR)                                │
                 │  category (VARCHAR)                                    │
                 │  tagline, bio (TEXT)                                   │
                 │  phone, whatsapp (VARCHAR)                             │
                 │  avatar_url, banner_url (VARCHAR)                      │
                 │  address_text, city (VARCHAR)                          │
                 │  latitude, longitude (DECIMAL)                         │
                 │  status (ENUM: DRAFT, ACTIVE, SUSPENDED)               │
                 └──────────────┬──────────────────────────┬──────────────┘
                                │ 1:N                      │ 1:1
                                ▼                          ▼
┌─────────────────────────────────────────┐  ┌────────────────────────────────────────┐
│              ProfileService             │  │                 QRCode                 │
│ ─────────────────────────────────────── │  │ ────────────────────────────────────── │
│  id (UUID, PK)                          │  │  id (UUID, PK)                         │
│  profile_id (UUID, FK -> Profile)       │  │  profile_id (UUID, FK -> Profile)      │
│  title, description (VARCHAR)           │  │  code_uuid (VARCHAR, Unique)           │
│  price_inr (DECIMAL, Nullable)          │  │  target_url (VARCHAR)                  │
│  image_url (VARCHAR)                    │  │  qr_image_url (VARCHAR)                │
└─────────────────────────────────────────┘  │  scan_count (BIGINT)                   │
                                             └──────────────────┬─────────────────────┘
                                                                │ 1:N
                                                                ▼
                                             ┌────────────────────────────────────────┐
                                             │             AnalyticsEvent             │
                                             │ ────────────────────────────────────── │
                                             │  id (UUID, PK)                         │
                                             │  qr_code_id (UUID, FK -> QRCode)       │
                                             │  event_type (SCAN, CALL, WA, MAP, VIEW)│
                                             │  ip_hash, user_agent (VARCHAR)         │
                                             │  created_at (TIMESTAMP)                │
                                             └────────────────────────────────────────┘

                                ┌─────────────────────────────────────────┐
                                │          AdvertisementPackage           │
                                │ ─────────────────────────────────────── │
                                │  id (UUID, PK)                          │
                                │  code (VARCHAR: P1, P2, P3, P4, P5, D1) │
                                │  name (VARCHAR)                         │
                                │  edition_type (SINGLE, THREE_EDITION)   │
                                │  price_inr (DECIMAL)                    │
                                └────────────────────┬────────────────────┘
                                                     │ 1:N
                                                     ▼
┌──────────────────────────────────┐   ┌──────────────────────────────────────────┐
│              Order               │   │              Advertisement               │
│ ──────────────────────────────── │   │ ──────────────────────────────────────── │
│  id (UUID, PK)                   ├──►│  id (UUID, PK)                           │
│  user_id (UUID, FK -> User)      │   │  order_id (UUID, FK -> Order)            │
│  package_id (UUID, FK -> Package)│   │  package_id (UUID, FK -> Package)        │
│  total_amount_inr (DECIMAL)      │   │  edition_month, edition_year (INTEGER)   │
│  status (PENDING, PAID, FAILED)  │   │  creative_image_url, copy_text (TEXT)    │
│  razorpay_order_id (VARCHAR)     │   │  approval_status (PENDING, APPR, REJ)    │
└────────────────┬─────────────────┘   └──────────────────────────────────────────┘
                 │ 1:1
                 ▼
┌──────────────────────────────────┐
│             Payment              │
│ ──────────────────────────────── │
│  id (UUID, PK)                   │
│  order_id (UUID, FK -> Order)    │
│  amount_inr (DECIMAL)            │
│  payment_method (UPI, CARD, CASH)│
│  razorpay_payment_id (VARCHAR)   │
│  status (SUCCESS, FAILED)        │
└──────────────────────────────────┘
```

---

## 22. API Domain Model & Endpoint Contract

All endpoints follow standard REST principles with JSON request/response payloads and JWT bearer authorization.

```
AUTH & USER SUBSYSTEM:
  POST   /api/auth/otp/send              -> Request mobile OTP
  POST   /api/auth/otp/verify            -> Verify OTP, issue access & refresh tokens
  POST   /api/auth/login                 -> Authenticate via password fallback
  POST   /api/auth/refresh               -> Renew expired access token
  GET    /api/users/me                   -> Retrieve current authenticated session

PROFILES & PUBLIC MICRO-SITES:
  GET    /api/profiles/claim-check/:slug -> Check if vanity username is available
  GET    /api/profiles/:slug             -> Fetch full public profile by slug
  PUT    /api/profiles/me                -> Update authenticated user's profile
  POST   /api/profiles/me/services       -> Add service item to profile catalog
  DELETE /api/profiles/me/services/:id   -> Remove service item

QR CODE SUBSYSTEM:
  GET    /qr/:codeUuid                   -> Public redirector (logs scan, returns 302 to /u/:slug)
  GET    /api/qr/me                      -> Get QR code details and vector asset links
  POST   /api/qr/regenerate              -> Regenerate QR asset styling

ADVERTISING & PACKAGES:
  GET    /api/packages                   -> List all active print & digital ad packages (P1–P5)
  POST   /api/advertisements/submit      -> Submit ad creative & text copy for review
  GET    /api/advertisements/me          -> View personal ad booking history and approval status

COMMERCE & PAYMENTS:
  POST   /api/orders/create              -> Create order for ad package or physical card
  POST   /api/payments/razorpay/verify   -> Verify cryptographic payment signature
  POST   /api/payments/webhook           -> Razorpay server-to-server webhook listener

ANALYTICS:
  POST   /api/analytics/event            -> Client-side action beacon (call, WhatsApp, vCard click)
  GET    /api/analytics/me/summary       -> Aggregated metrics for profile dashboard

AI ASSISTANT:
  POST   /api/ai/generate-bio            -> Generate business summary from basic inputs
  POST   /api/ai/generate-ad-copy        -> Generate promotional copy for print/digital ad

BLOG & EDITORIAL:
  GET    /api/blog/posts                 -> List published articles (paginated)
  GET    /api/blog/posts/:slug           -> Read specific blog article

ADMIN CONSOLE (/api/admin/*):
  GET    /api/admin/ads/pending          -> Queue of ad submissions awaiting review
  PATCH  /api/admin/ads/:id/status       -> Approve or reject submission with editorial notes
  GET    /api/admin/editions/export      -> Compile monthly print edition manifest (18th cutoff)
  GET    /api/admin/metrics              -> System-wide operational and financial KPIs
```

---

## 23. Technical Architecture & Technology Stack Evaluation

### 23.1 Comprehensive Stack Assessment

```
+---------------------------------------------------------------------------------------------------------+
|                                    TECHNOLOGY STACK EVALUATION MATRIX                                   |
+-------------------+---------------------+---------------------------------+-----------------------------+
| Layer             | Proposed Technology | Evaluation & Fit Assessment     | Final Phase 0 Status        |
+-------------------+---------------------+---------------------------------+-----------------------------+
| Frontend Web      | Next.js (App Router)| EXCEPTIONAL FIT. Essential for  | CONFIRMED                   |
|                   | React, TypeScript   | SSR/SSG of public profiles,     |                             |
|                   | Tailwind CSS        | lightning TTFB, and SEO schema. |                             |
+-------------------+---------------------+---------------------------------+-----------------------------+
| UI Componentry    | shadcn/ui           | EXCELLENT. Accessible, headless,| CONFIRMED                   |
|                   | Radix UI primitives | zero runtime styling lock-in.   |                             |
+-------------------+---------------------+---------------------------------+-----------------------------+
| Animation Engine  | GSAP + Lenis        | REQUIRED for timeline SVG Odisha| CONFIRMED (With reduced-    |
|                   |                     | map drawing and smooth scroll.  | motion performance guards)  |
+-------------------+---------------------+---------------------------------+-----------------------------+
| Backend Runtime   | Java 21             | ROBUST & SECURE. Enterprise-    | DUAL-EVALUATED (See below)  |
| & Framework       | Spring Boot 3.x     | grade banking/security. Higher  |                             |
|                   | Spring Security     | memory overhead on VPS.         |                             |
+-------------------+---------------------+---------------------------------+-----------------------------+
| Primary Database  | PostgreSQL 16+      | PERFECT FIT. ACID transactions, | CONFIRMED                   |
|                   | Flyway Migration    | relational integrity, JSONB.    |                             |
+-------------------+---------------------+---------------------------------+-----------------------------+
| Cache & Session   | Redis               | ESSENTIAL. Token blacklisting,  | CONFIRMED                   |
|                   |                     | rate-limiting, profile caching. |                             |
+-------------------+---------------------+---------------------------------+-----------------------------+
| Object Storage    | S3-compatible       | REQUIRED. AWS S3 or Cloudflare  | CONFIRMED                   |
|                   | (Cloudflare R2/MinIO| R2 for zero egress fees on QRs  |                             |
|                   |  or AWS S3)         | and user photo assets.          |                             |
+-------------------+---------------------+---------------------------------+-----------------------------+
| Payment Gateway   | Razorpay            | ESSENTIAL. #1 gateway for India,| CONFIRMED                   |
|                   |                     | native UPI, PhonePe, QR pay.    |                             |
+-------------------+---------------------+---------------------------------+-----------------------------+
| AI Engine         | OpenAI API          | COST-EFFECTIVE. gpt-4o-mini     | CONFIRMED                   |
|                   |                     | wrapped behind backend proxy.   |                             |
+-------------------+---------------------+---------------------------------+-----------------------------+
| Infrastructure    | Ubuntu 22.04 LTS,   | STANDARD & RELIABLE. Container  | CONFIRMED                   |
|                   | Docker, Nginx, VPS  | isolation, simple horizontal run|                             |
+-------------------+---------------------+---------------------------------+-----------------------------+
```

### 23.2 In-Depth Evaluation of the Backend Proposal (Spring Boot vs. Node.js/Next.js)
- **The Current Proposal:** Java 21 + Spring Boot 3.
- **Concern:** A dual-runtime stack (Next.js TypeScript on frontend, Java on backend) introduces:
  1. Two separate builds, two test pipelines, and duplicate TypeScript/Java DTO definitions.
  2. Memory footprint: A Spring Boot JVM process typically consumes 350MB–600MB idle RAM, whereas an entry-level Ubuntu VPS (2GB RAM) will simultaneously run PostgreSQL, Redis, Nginx, Next.js, and Spring Boot.
- **Evaluation:**
  - *If the development team has established Java enterprise proficiency:* Keep Spring Boot. It provides unmatched transactional durability for orders, financial ledgers, and complex batch compiling for print editions.
  - *If the team is lean and full-stack JavaScript-oriented:* Consider Next.js Route Handlers or a NestJS/Express TypeScript backend.
- **Phase 0 Recommendation:** Retain **Java 21 + Spring Boot** as the primary enterprise architecture target, but design all API schemas cleanly via OpenAPI so the frontend can interact agnostically with either runtime.

---

## 24. SEO & Organic Discovery Strategy

To ensure Bhubaneswar merchants gain maximum Google search visibility, all public endpoints will adhere to strict technical SEO guidelines:

1. **Structured Data (Schema.org JSON-LD):**
   - Public Profiles (`/u/:slug`): `LocalBusiness`, `ProfessionalService`, or `Person` schema with `telephone`, `addressLocality: "Bhubaneswar"`, `addressRegion: "Odisha"`, `priceRange`, and `geo` coordinates.
   - Blog Posts (`/blog/:slug`): `NewsArticle` or `BlogPosting` with `headline`, `author`, `datePublished`, and `publisher: "PRACHAR"`.
2. **Metadata & Open Graph Protocol:**
   - Dynamic server-rendered `<title>`: `{Business Name} | Phygital Profile | PRACHAR Bhubaneswar`
   - Automated dynamic Open Graph image generation (`/api/og?name=...`) for high-impact link previews on WhatsApp, Facebook, and LinkedIn.
3. **Indexation Control:**
   - Fully automated XML sitemap (`/sitemap.xml`) updated upon each new profile and blog publication.
   - Standard `/robots.txt` allowing public indexation of `/`, `/about`, `/services`, `/advertise`, `/blog/*`, and `/u/*`, while strictly blocking `/dashboard/*`, `/admin/*`, and `/api/*`.

---

## 25. Performance Engineering Strategy

### 25.1 Hero Odisha Map Performance Protocol
The animated Odisha map must look stunning without sacrificing Google Core Web Vitals (Largest Contentful Paint < 2.5s, Cumulative Layout Shift < 0.1):
1. **Format:** Pure optimized vector SVG path data. Inlined or fetched as an unblocked lightweight asset (<30KB).
2. **Execution Timing:** Lazy-load GSAP animations after the critical HTML and initial paint have stabilized.
3. **GPU Offloading:** All CSS transforms and SVG path drawing animations must use hardware-accelerated properties (`transform: translate3d`, `opacity`, `will-change: transform`).
4. **Motion Fallbacks:** Honor `@media (prefers-reduced-motion: reduce)` by immediately displaying the fully rendered map without timeline animation.

### 25.2 Asset & Bundle Optimization
- Next.js automatic image optimization for all uploaded business logos and banners, serving modern AVIF/WebP formats with explicit width/height to prevent layout shifts.
- Font delivery using `next/font` for local caching of fonts without external Google CDN blocking calls.

---

## 26. Accessibility (WCAG 2.1 AA Compliance)

1. **Color Contrast:** All text must strictly satisfy minimum contrast ratios of **4.5:1** for standard text and **3:1** for large headings and interactive buttons.
2. **Keyboard Navigation:** Every interactive element (navigation links, contact buttons, modal dialogs, package selector cards) must feature visible, high-contrast `:focus-visible` outline rings.
3. **Screen Reader Support:**
   - The animated Odisha map must include `role="img"` and `aria-label="Stylized map of Odisha highlighting Bhubaneswar"`.
   - Contact buttons must feature descriptive screen reader text (e.g., `aria-label="Call Puri Sweets at 9178898844"`).
4. **Accessible Forms:** All inputs in the ad booking wizard and profile editor must have associated `<label>` tags and clear error announcements (`aria-invalid`, `aria-describedby`).

---

## 27. Responsive Design Breakpoints & Layout Adapters

```
+-----------------------------------------------------------------------------------------+
|                               RESPONSIVE BREAKPOINT MATRIX                              |
+-------------------+-------------+-------------------------------------------------------+
| Device Category   | Viewport    | Layout Adaptations & Behavioral Rules                 |
+-------------------+-------------+-------------------------------------------------------+
| Mobile Portrait   | 320px–639px | Single column vertical stack. Fixed bottom CTA bar.   |
|                   |             | Hero map scales down behind/above copy.               |
|                   |             | Profile shows sticky quick-action call/WhatsApp strip.|
+-------------------+-------------+-------------------------------------------------------+
| Tablet            | 640px–1023px| 2-column balanced grid for services and ad packages.   |
|                   |             | Collapsible hamburger navigation.                     |
+-------------------+-------------+-------------------------------------------------------+
| Desktop           | 1024px–1439p| Full 55/45 split hero with animated Odisha map on right|
|                   |             | Sticky sidebar in user dashboard.                     |
+-------------------+-------------+-------------------------------------------------------+
| Large Desktop     | >= 1440px   | Container max-width capped at 1280px or 1400px.       |
|                   |             | Ultra-crisp vector scaling for regional map graphics. |
+-------------------+-------------+-------------------------------------------------------+
```

---

## 28. Strict MVP Scope Definition

To ensure rapid delivery, avoid premature complexity, and test market adoption with real Bhubaneswar merchants, the MVP scope is strictly demarcated:

```
+-----------------------------------------------------------------------------------------+
|                                    MVP SCOPE CLASSIFICATION                             |
+------------------------------------+----------------------------------------------------+
| MUST HAVE (MVP Release)            | SHOULD HAVE (MVP Polish / Fast Follow)             |
+------------------------------------+----------------------------------------------------+
| - Public Landing with Odisha Map   | - AI Bio & Tagline Generator                       |
|   and Bhubaneswar highlight        | - Interactive Device Demo on /demo page            |
| - Responsive Digital Profile (/u/) | - PDF print edition archive viewer                 |
| - Dynamic QR Generation & Redirect | - SMS notification on ad approval/rejection        |
| - Phone OTP / Email Authentication | - Basic invoice PDF generation                     |
| - Self-Service Ad Booking for P1–P5|                                                    |
| - Razorpay Payment Integration     |                                                    |
| - Admin Ad Approval Queue          |                                                    |
| - Basic Scan & Click Analytics     |                                                    |
+------------------------------------+----------------------------------------------------+
| LATER (Phase 2 & Phase 3)          | NOT REQUIRED (Out of Scope for Initial Platform)   |
+------------------------------------+----------------------------------------------------+
| - Custom domain CNAME mapping      | - Full e-commerce shopping cart with logistics    |
| - Metal smart card NFC fulfillment | - In-app real-time video chat                      |
| - In-depth geographic heatmaps     | - Multi-state regional language localization       |
| - Pure digital ad auction bidding  |   (beyond Odia and English)                        |
| - Multi-city portals (Cuttack, etc)| - Cryptocurrency or Web3 token integrations        |
+------------------------------------+----------------------------------------------------+
```

---

## 29. Multi-Phase Future Roadmap

```
PHASE 0: Foundations & Product Specification [CURRENT PHASE]
  ├── Consolidate all historical and blueprint sources
  ├── Formulate complete architecture, data models, and specifications
  └── Exit Criteria: Independent external audit approval

PHASE 1: Core MVP Build & Local Launch (Bhubaneswar Hub)
  ├── Objective: Deliver end-to-end working software for Bhubaneswar market
  ├── Deliverables: Next.js frontend, Spring Boot API, PostgreSQL, Redis, Razorpay
  ├── Features: Hero with Odisha/BBSR map, Profiles, Dynamic QRs, P1–P5 booking
  ├── Testing: Unit, integration, Razorpay sandbox end-to-end, cross-browser
  └── Exit Criteria: 100 live verified local merchant profiles in Bhubaneswar

PHASE 2: Phygital Expansion & Physical Card Integration
  ├── Objective: Streamline physical NFC card distribution and AI creative tools
  ├── Deliverables: Physical smart card inventory module, AI ad copy assistant
  ├── Features: NFC card pairing flow, Odia/English festival greeting templates
  └── Exit Criteria: First batch of 500 physical smart cards delivered to clients

PHASE 3: Regional Rollout across Odisha
  ├── Objective: Replicate the Bhubaneswar success model across key Odisha cities
  ├── Deliverables: Multi-city directory segmentation (Cuttack, Puri, Rourkela, Berhampur)
  ├── Features: City-specific hero map selection, regional edition management
  └── Exit Criteria: Operational editions launched in at least 3 Odisha urban centers
```

---

## 30. Proposed Repository Architecture

```
prachar-platform/
├── .github/                      # CI/CD workflows (lint, test, build, deploy)
├── docs/                         # Architecture diagrams, specifications, Phase 0 specs
│   └── PHASE_0_PRODUCT_SPECIFICATION.md
├── frontend/                     # Next.js 14+ App Router Project
│   ├── public/                   # Static assets, SVG Odisha map, favicon
│   ├── src/
│   │   ├── app/                  # App Router: /, /u/[slug], /advertise, /dashboard
│   │   ├── components/           # UI components, Hero, Map, Cards (shadcn/ui)
│   │   ├── hooks/                # Custom React hooks (useAnalytics, useAuth)
│   │   ├── lib/                  # Utilities, API client, formatting helpers
│   │   └── types/                # TypeScript interface definitions
│   ├── tailwind.config.ts        # Tailwind design tokens and breakpoints
│   ├── package.json
│   └── tsconfig.json
├── backend/                      # Java 21 / Spring Boot 3 Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/prachar/
│   │   │   │   ├── config/       # Security, Redis, S3, CORS configuration
│   │   │   │   ├── controller/   # REST Controllers (/api/auth, /api/profiles, etc.)
│   │   │   │   ├── dto/          # Request & Response data transfer objects
│   │   │   │   ├── model/        # JPA Entities (User, Profile, Order, Ad, etc.)
│   │   │   │   ├── repository/   # Spring Data JPA repositories
│   │   │   │   └── service/      # Business logic, Razorpay, AI, QR generator
│   │   │   └── resources/
│   │   │       ├── db/migration/ # Flyway SQL migration scripts (V1__init.sql)
│   │   │       └── application.yml
│   │   └── test/                 # JUnit 5 & Mockito integration tests
│   ├── pom.xml                   # Maven dependencies
│   └── Dockerfile
├── infrastructure/               # DevOps & Deployment orchestration
│   ├── docker-compose.yml        # PostgreSQL, Redis, Backend, Frontend, Nginx
│   ├── nginx/                    # Reverse proxy configuration & SSL certbot hooks
│   └── scripts/                  # Automated backup and deployment scripts
└── README.md
```

---

## 31. Requirement Traceability Matrix

| Req ID | Requirement Description | Source | Priority | Phase | Dependency | Status |
|---|---|---|---|---|---|---|
| **REQ-01** | Brand Name: PRACHAR (Phygital Publicity) | Word Doc | P0 | MVP | None | Confirmed |
| **REQ-02** | Print Packages P1–P5 with verbatim pricing | Word Doc | P0 | MVP | REQ-01 | Confirmed |
| **REQ-03** | 18th of month ad submission cutoff | Word Doc | P1 | MVP | REQ-02 | Confirmed |
| **REQ-04** | Legal jurisdiction: Odisha jurisdiction only | Word Doc | P0 | MVP | Legal terms | Confirmed |
| **REQ-05** | Hero visual with Odisha Map & BBSR highlight | Blueprint | P0 | MVP | Next.js/SVG | Confirmed |
| **REQ-06** | Digital Profile (`/u/:username`) micro-site | Blueprint | P0 | MVP | Auth / DB | Confirmed |
| **REQ-07** | Dynamic QR code generation & 302 routing | Blueprint | P0 | MVP | REQ-06 | Confirmed |
| **REQ-08** | Click-to-Call, WhatsApp, Save Contact CTAs | Blueprint | P0 | MVP | REQ-06 | Confirmed |
| **REQ-09** | Razorpay online payment integration | Blueprint | P0 | MVP | REQ-02 | Confirmed |
| **REQ-10** | Admin portal for ad review and approval | Word Doc | P0 | MVP | REQ-02, REQ-09 | Confirmed |
| **REQ-11** | Interactive device demo sandbox | Blueprint | P1 | MVP | REQ-06 | Confirmed |
| **REQ-12** | AI Bio & Ad Copy generator | Blueprint | P1 | MVP | OpenAI API | Confirmed |
| **REQ-13** | Localized blog & community announcement CMS | Blueprint | P2 | Phase 1/2 | Admin auth | Confirmed |
| **REQ-14** | Physical NFC/PVC card manufacturing & pairing | Blueprint | P2 | Phase 2 | REQ-06, REQ-07 | Clarification |
| **REQ-15** | Regional multi-city expansion across Odisha | Strategic | P3 | Phase 3 | REQ-05, REQ-02 | Future |

---

## 32. Risk Assessment & Mitigation Plan

```
+----------------------------------------------------------------------------------------------------+
|                                    RISK MANAGEMENT MATRIX                                          |
+-------------------+----------------+-------------+-------------------------------------------------+
| Risk Category     | Risk Event     | Severity /  | Mitigation Strategy                             |
|                   |                | Probability |                                                 |
+-------------------+----------------+-------------+-------------------------------------------------+
| UX & Performance  | Complex SVG    | High /      | Use simplified geometric path contours; enforce |
|                   | Odisha map lag | Medium      | will-change CSS; disable animation on mobile and|
|                   | on mobile      |             | when prefers-reduced-motion is active.          |
+-------------------+----------------+-------------+-------------------------------------------------+
| Operational       | Advertisers    | High /      | Hard automated countdown timers on web UI; auto-|
|                   | miss 18th print| High        | rollover of submissions after 18th 23:59 IST    |
|                   | cutoff date    |             | to the following month's edition.               |
+-------------------+----------------+-------------+-------------------------------------------------+
| Financial /       | Razorpay Webhook| High /     | Idempotent webhook processing using unique      |
| Payment           | drop or failure| Low         | transaction IDs; automated poll/reconciliation  |
|                   | to mark ad paid|             | fallback cron job in Spring Boot backend.       |
+-------------------+----------------+-------------+-------------------------------------------------+
| Content / Legal   | Advertiser     | High /      | Mandatory disclaimer checkbox (as per Word doc);|
|                   | uploads illicit| Medium      | human editorial approval gate before any ad or  |
|                   | or untrue ad   |             | profile is published.                           |
+-------------------+----------------+-------------+-------------------------------------------------+
| Security          | QR link vanity | Medium /    | Cryptographic UUID dynamic URLs (/qr/:uuid);    |
|                   | slug squatting | Medium      | reserve prominent commercial brand names;       |
|                   | or brute force |             | rate-limit resolution endpoints.                |
+-------------------+----------------+-------------+-------------------------------------------------+
| System Sizing     | JVM memory     | Medium /    | Configure JVM heap limits (-Xms256m -Xmx512m);  |
|                   | exhaustion on  | High        | monitor with Docker memory quotas; fall back to |
|                   | small VPS      |             | Node.js backend if memory constraints dictate.  |
+-------------------+----------------+-------------+-------------------------------------------------+
```

---

## 33. Categorized Open Questions & Ambiguities

### A. Business & Commercial Decisions
1. **[BUSINESS DECISION REQUIRED] Print + Digital Packaging:** Will purchasers of print ads (P1–P5) receive a digital card profile for free, or will digital profiles be sold as a separate subscription (e.g. ₹499/year)?
2. **Physical Card Pricing:** What will be the retail price point for the physical NFC/PVC card? Will it be bundled with the 3-Edition Scheme (₹1,500–₹15,000)?
3. **Cash Collection Protocol:** The Word document states charges can be paid in cash. How will local agents collecting cash deposit it and have their digital submissions approved in the software?

### B. Product & Design Decisions
4. **[REQUIRES CLARIFICATION] Demo Page Interactivity:** Should the `/demo` page allow anonymous users to type custom text and generate a temporary working preview, or will it only showcase a pre-populated showcase profile (e.g. "Puri Sweets BBSR")?
5. **Map Interactivity:** On desktop, should hovering over other Odisha districts (Cuttack, Puri, Sambalpur) show an informational tooltip such as *"Coming Soon in Phase 3"*, or should the rest of the map remain purely decorative?

### C. Legal & Content Decisions
6. **PRGI Compliance on Digital Advertising:** Does the PRGI registration (`ORORI/25/A3295`) have specific digital masthead disclosure requirements that must appear in the website footer alongside Chandan Printers' details?
7. **Advertiser Invoicing:** Does the business require automated GST invoicing (B2B) for corporate advertisers, or are basic retail receipts sufficient for MVP?

### D. Technical & Operations Decisions
8. **SMS Gateway Selection:** For mobile OTP login in India, which DLT-registered SMS provider will be utilized (e.g., Fast2SMS, MSG91, Twilio India)?
9. **Physical Card Fulfillment:** Who manages physical card encoding, packaging, and local courier delivery in Bhubaneswar?

---

## 34. Phase 0 Exit Criteria

Phase 0 is considered officially complete when the following conditions are validated:
1. **Full Traceability:** Every business fact from `"BOOK COVER BBSR.docx"` (packages, pricing, editorial names, PRGI reg, Chandan Printers, terms) is accounted for with zero unauthorized alterations.
2. **Visual Intent Documented:** The Odisha map and Bhubaneswar highlight hero concept is thoroughly articulated in structure, purpose, animation stages, and performance constraints without premature implementation.
3. **Architecture Defined:** A modular, scalable technology stack and conceptual entity model are established, supporting MVP goals without unnecessary microservice bloat.
4. **Zero Code Rule Respected:** No production source code, package installations, or database migrations have been executed during Phase 0.

---

============================================================
## PHASE 0 STATUS
============================================================

**Status:**  
READY FOR AUDIT

**Implementation:**  
NOT STARTED (Phase 0 strictly maintained)

**Outstanding Clarifications:**  
1. Bundling decision: Free digital profile with P1–P5 print ad or separate pricing model.  
2. Physical card pricing, manufacturing partner, and fulfillment logistics.  
3. Unauthenticated interactive capabilities of the `/demo` simulator.  
4. Preferred Indian SMS gateway provider for mobile OTP authentication.  
5. Hardware specs of the target Ubuntu VPS to validate Spring Boot JVM memory allocation.

**Architecture Confidence:**  
HIGH (Solid separation of concerns, robust schema, and well-vetted tech stack)

**MVP Definition:**  
READY (Clear boundaries established between Must-Haves and Future Roadmap)

**Next Required Input:**  
EXTERNAL AUDIT REPORT & PROJECT OWNER APPROVAL (Do not proceed to Phase 1 until review is completed)

============================================================
