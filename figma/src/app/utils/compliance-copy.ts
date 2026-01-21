/**
 * CLEVIO Compliance-Safe Copy System
 * 
 * All copy has been reviewed for:
 * - No implied AMEX endorsement or partnership claims
 * - No guaranteed rewards or benefits
 * - Clear "not a bank" positioning
 * - Distinction between advisory and execution
 * - Accurate licensing and insurance claims
 * - Appropriate disclaimers and disclosures
 */

export const complianceCopy = {
  // ============================================================================
  // CORE POSITIONING STATEMENTS (Legal-Safe)
  // ============================================================================
  positioning: {
    amexPayroll: {
      approved: 'Process payroll payments using your American Express business card and potentially earn rewards based on your card agreement.',
      avoid: 'Earn AMEX rewards on payroll', // Implies guarantee
    },
    
    amexRelationship: {
      approved: 'CLEVIO enables payroll processing through American Express cards. CLEVIO is not affiliated with, endorsed by, or sponsored by American Express.',
      avoid: 'Partnered with American Express', // Implies partnership
    },
    
    bankingServices: {
      approved: 'CLEVIO is a financial services platform, not a bank. Banking services are provided by partner financial institutions, Members FDIC.',
      avoid: 'CLEVIO provides banking services', // Misrepresents status
    },
    
    advisoryRole: {
      approved: 'Licensed tax and financial professionals provide strategic guidance. Implementation of recommendations is at your discretion.',
      avoid: 'We manage your finances', // Implies execution control
    },
    
    licensingClaims: {
      approved: 'Tax services are provided by licensed CPAs and Enrolled Agents maintaining active credentials in applicable jurisdictions.',
      avoid: 'CPAs licensed in all states', // May not be accurate for every advisor
    },
  },
  
  // ============================================================================
  // REQUIRED DISCLAIMERS (Must appear in specified locations)
  // ============================================================================
  disclaimers: {
    // Footer (appears on every page)
    footer: {
      short: 'CLEVIO is a financial services platform, not a bank. Banking services provided by partner institutions, Members FDIC. Tax and advisory services provided by licensed professionals.',
      
      full: `CLEVIO is a financial services platform operated by CLEVIO Financial Services, LLC. CLEVIO is not a bank, lender, or financial institution. Banking and payment processing services are provided through partner financial institutions, Members FDIC.

Tax advisory services are provided by licensed Certified Public Accountants (CPAs) and Enrolled Agents (EAs) who maintain active credentials in applicable jurisdictions. Financial advisory services are provided by licensed financial professionals. All professionals carry appropriate professional liability insurance.

CLEVIO is not affiliated with, endorsed by, or sponsored by American Express. American Express is a registered trademark of American Express Company. Rewards, benefits, and card terms are determined solely by American Express and your specific card agreement. CLEVIO does not control, guarantee, or modify American Express earning rates, reward categories, or card benefits.`,
    },
    
    // AMEX-specific (appears near AMEX payment features)
    amexRewards: {
      inline: 'Rewards eligibility, earning rates, and benefits are determined solely by American Express based on your specific card agreement. CLEVIO does not guarantee any particular reward earnings.',
      
      tooltip: 'American Express determines all aspects of rewards programs including earning rates, bonus categories, and benefit eligibility. CLEVIO provides the technology to process payroll through AMEX cards but does not control or influence reward structures. Actual rewards depend on your card type, account standing, and AMEX policies.',
      
      calculations: '*Example calculations are for illustration only and assume a specific earning rate. Actual rewards vary by card type and American Express policies. CLEVIO does not guarantee rewards earnings and is not responsible for changes to AMEX reward programs.',
    },
    
    // Tax services (appears before tax service activation)
    taxServices: {
      jurisdictional: 'Tax services are subject to professional licensing in applicable jurisdictions. Your assigned CPA or EA will hold appropriate state licenses for the jurisdictions where services are provided.',
      
      scope: 'Tax advisory services include professional guidance and preparation. You retain ultimate responsibility for accuracy of information provided and for your tax obligations. CPAs provide advice based on information you supply and applicable tax law as understood at the time of service.',
      
      representation: 'IRS representation and state tax authority representation are included subject to the professional judgment of your assigned CPA. Complex matters may require referral to specialized tax counsel.',
    },
    
    // Advisory services (appears before advisory service activation)
    advisoryServices: {
      fiduciary: 'When providing investment-related advice, advisors act in a fiduciary capacity and are obligated to act in your best interest. This obligation applies to investment advice and does not extend to non-advisory services.',
      
      scope: 'Financial advisory services include strategic planning consultation and recommendations. CLEVIO does not manage investment portfolios, execute trades, or provide insurance products. Implementation of recommendations is your responsibility.',
      
      notInvestmentAdvice: 'General business and financial planning information provided through CLEVIO is for educational purposes. Specific investment recommendations require a separate advisory agreement with a licensed investment adviser representative.',
    },
    
    // Insurance & liability (appears on compliance page)
    insurance: {
      coverage: 'Professional errors and omissions insurance with $5,000,000 coverage is maintained for tax and advisory services. Coverage applies to professional services rendered through CLEVIO and is subject to policy terms and conditions.',
      
      limitations: 'Professional liability insurance covers errors and omissions by licensed professionals. It does not cover market losses, business performance, tax law changes, or force majeure events.',
    },
    
    // Data & security (appears on signup, settings)
    dataPrivacy: {
      ownership: 'You retain ownership of all payroll data, employee information, and business records. CLEVIO acts as a data processor and handles your data only as necessary to provide services.',
      
      retention: 'Payroll and tax records are retained for seven (7) years to comply with IRS and state record retention requirements. Other data may be deleted upon request subject to legal obligations.',
      
      sharing: 'CLEVIO does not sell, rent, or share your data with third parties for marketing purposes. Data is shared only with service providers necessary to deliver payroll and financial services (banking partners, tax authorities as required by law).',
    },
  },
  
  // ============================================================================
  // COMPLIANT COPY REPLACEMENTS
  // ============================================================================
  compliantCopy: {
    // Home page hero
    heroHeadline: {
      compliant: 'Process Business Payroll Using American Express',
      original: 'AMEX-Powered Payroll', // Implies partnership
    },
    
    heroSubheadline: {
      compliant: 'Process payroll payments with your American Express business card while accessing licensed financial professionals for tax and strategic guidance.',
      original: 'Turn payroll into rewards with AMEX while working with CPAs', // Implies guaranteed rewards
    },
    
    // Value propositions
    valueProps: {
      rewards: {
        compliant: 'Process payroll through your American Express card to potentially earn rewards based on your card agreement terms.',
        original: 'Earn valuable AMEX rewards on every payroll', // Promises rewards
      },
      
      professionals: {
        compliant: 'Access to licensed CPAs, Enrolled Agents, and financial advisors maintaining appropriate state credentials and professional liability insurance.',
        original: 'Work with the best CPAs and advisors', // Subjective claim
      },
      
      security: {
        compliant: 'SOC 2 Type II certified security controls, independently audited annually by certified public accounting firms.',
        original: 'Bank-grade security', // Vague, implies banking
      },
    },
    
    // Pricing page
    pricing: {
      feeDescription: {
        compliant: 'Service fees are calculated as a percentage of monthly payroll volume and include all processing, compliance, and professional services. AMEX may assess separate fees under your card agreement.',
        original: 'Simple percentage fee with no hidden costs', // Could be misleading about AMEX fees
      },
      
      roiExample: {
        compliant: 'Example net cost calculation assumes a specific AMEX earning rate for illustration purposes. Actual rewards depend on your card type and American Express policies, which CLEVIO does not control.',
        original: 'See how much you could save with AMEX rewards', // Implies guaranteed savings
      },
    },
    
    // Service descriptions
    services: {
      payroll: {
        compliant: 'Automated payroll processing with payment facilitation through American Express business cards or ACH bank transfer. Includes tax calculations, compliance monitoring, and direct deposit coordination.',
        original: 'AMEX rewards payroll platform', // Overemphasizes AMEX rewards
      },
      
      tax: {
        compliant: 'Strategic tax planning and preparation services provided by licensed CPAs and Enrolled Agents. Services are subject to professional licensing in applicable jurisdictions.',
        original: 'Expert tax services that maximize deductions', // Overpromises results
      },
      
      advisory: {
        compliant: 'Financial planning consultation and strategic recommendations from licensed financial professionals. You retain discretion over implementation of recommendations.',
        original: 'Professional wealth management', // Implies investment management
      },
    },
    
    // Onboarding
    onboarding: {
      amexStep: {
        compliant: 'Connect your American Express business card to enable card-based payroll processing. Personal cards are not eligible. Card information is encrypted and tokenized.',
        original: 'Add your AMEX to start earning rewards', // Promises rewards
      },
      
      commitmentExplanation: {
        compliant: 'CLEVIO services include a 6-month minimum service period. This commitment allows us to provide consistent professional support and ensures you receive full value from onboarding. Early termination options are available with applicable fees.',
        original: 'Lock in your rate for 6 months', // Could imply rate guarantee
      },
    },
    
    // Marketing claims
    marketing: {
      comparison: {
        compliant: 'Unlike traditional payroll services, CLEVIO enables payment processing through American Express cards, allowing cardholders to potentially earn rewards based on their card agreements.',
        original: 'The only payroll service that earns you AMEX points', // Absolute claim, promises rewards
      },
      
      professionalClaim: {
        compliant: 'Tax and advisory services are provided by professionals who maintain current licenses, continuing education requirements, and professional liability insurance in applicable jurisdictions.',
        original: 'Top-rated CPAs and advisors', // Subjective, unverifiable
      },
    },
  },
  
  // ============================================================================
  // TOOLTIP DISCLAIMERS (Legal clarifications)
  // ============================================================================
  tooltipDisclaimers: {
    amexEarnings: 'American Express determines reward structures. CLEVIO processes payments but does not control earning rates, bonus categories, or reward eligibility. Consult your AMEX card agreement for terms.',
    
    taxSavings: 'Tax strategies are based on current tax law and your specific situation. Results vary by individual circumstances. You are responsible for accuracy of information provided and final tax liability.',
    
    licensedProfessionals: 'Professional credentials are verified at onboarding and monitored continuously. Services are subject to licensing in applicable jurisdictions. Not all professionals may be licensed in all states.',
    
    fdicInsurance: 'FDIC insurance applies to funds held at partner banks, not CLEVIO. Coverage limits are $250,000 per depositor, per insured bank, for each account ownership category.',
    
    fiduciaryDuty: 'Fiduciary duty applies when providing investment advice under applicable regulations. Not all services constitute investment advice subject to fiduciary standards.',
    
    professionalLiability: 'Professional liability insurance covers errors and omissions by licensed professionals within policy terms. Policy limits, deductibles, and exclusions apply.',
    
    soc2Certification: 'SOC 2 Type II reports are available to customers under NDA. Certification covers specified control objectives and does not guarantee security against all threats.',
  },
  
  // ============================================================================
  // SUBSCRIPTION CONFIRMATION DISCLOSURES
  // ============================================================================
  subscriptionDisclosures: {
    beforeActivation: {
      title: 'Service Agreement Acknowledgment',
      items: [
        'CLEVIO is not a bank. Payment processing services are provided through partner financial institutions, Members FDIC.',
        'Tax services are provided by licensed CPAs/EAs subject to jurisdictional licensing. You retain ultimate responsibility for tax filings and accuracy.',
        'Advisory services include recommendations and guidance only. You retain discretion over implementation.',
        'American Express determines all reward terms. CLEVIO does not guarantee earnings and is not affiliated with American Express.',
        'Services include a 6-month minimum commitment. Early termination is available subject to applicable fees.',
        'Professional liability insurance covers services within policy terms. Insurance does not guarantee outcomes or results.',
      ],
      acknowledgment: 'I understand and agree to these terms',
    },
    
    amexActivation: {
      title: 'American Express Payment Processing',
      content: 'By connecting your American Express card, you authorize CLEVIO to charge your card for payroll and service fees. CLEVIO is not affiliated with American Express. Rewards eligibility and earning rates are determined solely by American Express based on your card agreement. CLEVIO does not guarantee, control, or influence American Express reward programs.',
      acknowledgment: 'I understand AMEX determines all reward terms',
    },
  },
  
  // ============================================================================
  // TRUST INDICATORS (Legally Accurate)
  // ============================================================================
  trustIndicators: {
    security: {
      soc2: {
        label: 'SOC 2 Type II Certified',
        description: 'Independently audited security controls verified annually',
        disclaimer: 'Certification covers specified controls. Reports available under NDA.',
      },
      
      pciDss: {
        label: 'PCI DSS Level 1 Compliant',
        description: 'Highest payment card security standard',
        disclaimer: 'Compliance verified through quarterly scans and annual assessments.',
      },
      
      encryption: {
        label: '256-Bit Encryption',
        description: 'Data encrypted in transit and at rest',
        disclaimer: 'Encryption using industry-standard protocols (TLS 1.3, AES-256).',
      },
    },
    
    professional: {
      cpaLicensing: {
        label: 'Licensed CPAs & EAs',
        description: 'Active state licenses and continuing education',
        disclaimer: 'Licensing verified in applicable jurisdictions. Not all professionals licensed in all states.',
      },
      
      insurance: {
        label: '$5M E&O Insurance',
        description: 'Professional liability coverage',
        disclaimer: 'Coverage subject to policy terms, limits, and exclusions.',
      },
      
      fiduciary: {
        label: 'Fiduciary Advisors',
        description: 'When providing investment advice',
        disclaimer: 'Fiduciary duty applies to investment advice under applicable regulations.',
      },
    },
    
    regulatory: {
      notABank: {
        label: 'Not a Bank',
        description: 'Financial services platform',
        disclaimer: 'Banking services provided by partner institutions, Members FDIC.',
      },
      
      stateCompliance: {
        label: '50-State Coverage',
        description: 'Professionals licensed in applicable jurisdictions',
        disclaimer: 'Service availability subject to professional licensing and state regulations.',
      },
    },
  },
};

// ============================================================================
// COMPLIANCE CHECKLIST (For new copy)
// ============================================================================
export const complianceChecklist = {
  questions: [
    'Does this copy imply CLEVIO is affiliated with, endorsed by, or partnered with American Express?',
    'Does this copy guarantee or promise specific AMEX rewards, points, or benefits?',
    'Does this copy imply CLEVIO provides banking services or is a bank?',
    'Does this copy claim CLEVIO manages money, executes trades, or controls financial decisions?',
    'Does this copy make absolute claims about licensing (e.g., "licensed in all 50 states")?',
    'Does this copy promise specific tax savings or financial outcomes?',
    'Does this copy make superlative claims we cannot verify (e.g., "best", "top-rated")?',
    'Does this copy adequately distinguish between advisory services and execution?',
    'Are required disclaimers present for material claims?',
    'Is the copy clear that customers retain responsibility for decisions and accuracy?',
  ],
  
  approvalRequired: [
    'Any new AMEX-related positioning',
    'Any new claims about professional credentials',
    'Any new claims about security or compliance certifications',
    'Any new tax or financial outcome promises',
    'Any new comparison to competitors',
    'Any changes to subscription terms or commitments',
  ],
};

export type ComplianceCopyKey = keyof typeof complianceCopy;
