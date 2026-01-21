/**
 * CLEVIO Microcopy System
 * 
 * Tone Guidelines:
 * - Calm and professional
 * - Confident without being pushy
 * - Clear and specific
 * - Never alarmist or fear-based
 * - Educational, not salesy
 */

export const microcopy = {
  // ============================================================================
  // BUTTON COPY
  // ============================================================================
  buttons: {
    // Primary actions
    createAccount: 'Create Secure Account',
    signIn: 'Sign In to Your Account',
    getStarted: 'Get Started',
    continueToNext: 'Continue',
    saveChanges: 'Save Changes',
    confirmAction: 'Confirm',
    
    // Payroll actions
    reviewPayroll: 'Review Payroll',
    confirmPayroll: 'Confirm Payroll',
    schedulePayroll: 'Schedule Payroll Run',
    approvePayroll: 'Approve & Process',
    viewPayrollHistory: 'View All Payroll Runs',
    exportPayrollData: 'Export Payroll Data',
    
    // AMEX & payment
    addAmexCard: 'Add AMEX Card',
    verifyCard: 'Verify Card',
    updatePaymentMethod: 'Update Payment Method',
    switchToBank: 'Use Bank Account This Time',
    
    // Employee management
    addEmployee: 'Add Employee',
    addMultipleEmployees: 'Import Employees',
    updateEmployee: 'Update Employee Details',
    inviteEmployee: 'Send Invitation',
    
    // Services & subscriptions
    activateServices: 'Activate Services',
    upgradeTier: 'Add This Service',
    scheduleAdvisory: 'Schedule Advisory Session',
    contactCPA: 'Message Your CPA',
    bookConsultation: 'Book Consultation',
    
    // Settings & account
    updateProfile: 'Update Profile',
    changePassword: 'Change Password',
    enableMFA: 'Enable Two-Factor Authentication',
    downloadReport: 'Download Report',
    exportData: 'Export Your Data',
    
    // Cancellations (neutral, not negative)
    cancel: 'Cancel',
    goBack: 'Go Back',
    notNow: 'Not Now',
    reviewLater: 'Review Later',
  },
  
  // ============================================================================
  // LOCKED STATE MESSAGES
  // ============================================================================
  lockedStates: {
    minimumEmployees: {
      title: 'Add at least 5 employees to activate payroll',
      description: 'CLEVIO services are designed for businesses with 5+ employees. This ensures our percentage-based pricing provides value for your business.',
      action: 'Add Employees',
    },
    
    requiresPayrollTier: {
      title: 'Centurion Payroll™ required for this feature',
      description: 'Tax and Advisory services build on our core payroll platform. Activate Centurion Payroll™ to access this feature.',
      action: 'View Pricing',
    },
    
    requiresTaxTier: {
      title: 'Add Centurion Tax™ to schedule CPA consultations',
      description: 'Strategic tax planning sessions are included with Centurion Tax™. Upgrade your service to work with a licensed CPA.',
      action: 'Add Tax Services',
    },
    
    requiresAdvisoryTier: {
      title: 'Add Centurion Advisory™ for financial planning',
      description: 'Work with licensed financial advisors for cash flow optimization and strategic planning. Available as an add-on service.',
      action: 'Add Advisory Services',
    },
    
    duringCommitmentPeriod: {
      title: 'This service is active during your commitment period',
      description: 'You can modify or cancel this service after your 6-month commitment concludes on [DATE]. Early termination options are available if needed.',
      action: 'Contact Support',
    },
    
    pendingVerification: {
      title: 'Account verification in progress',
      description: 'We\'re verifying your business information and AMEX card. This typically takes 1-2 business days. We\'ll email you when complete.',
      action: 'Check Status',
    },
    
    insufficientAmexCredit: {
      title: 'Insufficient AMEX credit for this payroll',
      description: 'Your American Express card doesn\'t have enough available credit for this payroll amount. You can use your backup bank account or pay down your AMEX balance.',
      action: 'Use Bank Account',
    },
  },
  
  // ============================================================================
  // ERROR MESSAGES
  // ============================================================================
  errors: {
    // Authentication errors
    invalidCredentials: {
      message: 'Email or password doesn\'t match our records',
      resolution: 'Check your credentials and try again, or use "Forgot password" to reset.',
    },
    
    accountLocked: {
      message: 'Your account has been temporarily locked for security',
      resolution: 'This happens after multiple failed sign-in attempts. Wait 30 minutes or contact support to unlock immediately.',
    },
    
    sessionExpired: {
      message: 'Your session has expired for security',
      resolution: 'Sign in again to continue. We automatically sign you out after 2 hours of inactivity.',
    },
    
    // AMEX card errors
    cardDeclined: {
      message: 'Your American Express card was declined',
      resolution: 'This may be due to insufficient credit, card verification requirements, or AMEX security measures. Contact AMEX or use your backup payment method.',
    },
    
    cardVerificationFailed: {
      message: 'We couldn\'t verify your AMEX card',
      resolution: 'Check that you entered the correct card number, expiration, and security code. If information is correct, contact AMEX to ensure the card is active.',
    },
    
    cardExpired: {
      message: 'The AMEX card on file has expired',
      resolution: 'Update your card information with your new card details, or add a different payment method.',
    },
    
    // Payroll errors
    payrollAlreadyProcessed: {
      message: 'This payroll has already been processed',
      resolution: 'You can view the processed payroll details in your payroll history, but cannot modify or re-run it.',
    },
    
    invalidPayrollDate: {
      message: 'This payment date isn\'t available',
      resolution: 'Choose a business day at least 3 days in the future. This allows time for AMEX processing and direct deposit coordination.',
    },
    
    employeeMissingBankInfo: {
      message: '[Employee Name] is missing direct deposit information',
      resolution: 'Add their bank account and routing number in the employee profile, or contact them to provide this information.',
    },
    
    // Tax calculation errors
    taxCalculationError: {
      message: 'We couldn\'t calculate taxes for this payroll',
      resolution: 'This is usually due to missing employee W-4 information. Review employee tax details and ensure all required fields are complete.',
    },
    
    multiStateTaxIssue: {
      message: 'Tax calculation needs CPA review',
      resolution: 'Multi-state tax situations can be complex. Your CPA will review this payroll before processing to ensure compliance.',
    },
    
    // Employee errors
    duplicateEmployee: {
      message: 'An employee with this Social Security number already exists',
      resolution: 'Check your employee list to see if this person is already in your system. If this is a different employee, verify the SSN is correct.',
    },
    
    invalidSSN: {
      message: 'This Social Security number format isn\'t valid',
      resolution: 'SSN should be 9 digits in the format XXX-XX-XXXX. Check for typos and try again.',
    },
    
    // Service errors
    serviceUnavailable: {
      message: 'CLEVIO services are temporarily unavailable',
      resolution: 'We\'re experiencing technical difficulties and working to restore service. Check status.clevio.com for updates or contact support.',
    },
    
    maintenanceMode: {
      message: 'Scheduled maintenance in progress',
      resolution: 'We\'re performing system updates and will be back shortly. Maintenance typically completes within 1 hour.',
    },
    
    // Validation errors
    requiredFieldMissing: {
      message: 'Please complete all required fields',
      resolution: 'Fields marked with an asterisk (*) must be filled in before continuing.',
    },
    
    invalidEmailFormat: {
      message: 'Email address format isn\'t valid',
      resolution: 'Enter a valid email address like name@company.com',
    },
    
    invalidPhoneFormat: {
      message: 'Phone number format isn\'t valid',
      resolution: 'Enter a 10-digit US phone number',
    },
    
    passwordTooWeak: {
      message: 'Password doesn\'t meet security requirements',
      resolution: 'Use at least 12 characters with a mix of uppercase, lowercase, numbers, and symbols.',
    },
  },
  
  // ============================================================================
  // TOOLTIPS
  // ============================================================================
  tooltips: {
    // Fees & pricing
    serviceFeePricing: 'Our service fee is a transparent percentage of your monthly payroll volume. The exact amount is calculated and shown before each payroll run. There are no hidden fees or per-employee charges.',
    
    amexProcessingFee: 'You pay CLEVIO\'s service fee. American Express may assess separate fees based on your card agreement—review your AMEX terms for details.',
    
    effectiveCost: 'Your net cost after AMEX rewards. Actual rewards depend on your card\'s earning rate and are not guaranteed by CLEVIO.',
    
    commitmentPeriod: 'All CLEVIO services require a 6-month minimum commitment. This allows us to provide consistent advisory support and ensures you receive the full benefit of our onboarding process.',
    
    earlyTermination: 'You may end service before 6 months by paying the remaining service fees through your commitment end date. Contact support to discuss options.',
    
    // AMEX & payments
    amexRewardsDisclaimer: 'Rewards earned are based on your American Express card agreement. CLEVIO does not control or guarantee specific earning rates, categories, or benefits.',
    
    whyAmexRequired: 'AMEX-powered payroll is how we enable you to earn rewards on payroll expenses. It\'s our core value proposition—turning a cost center into an earning opportunity.',
    
    backupPaymentMethod: 'Used if your AMEX card is declined or you choose to pay via bank transfer for a specific payroll. We never charge this account without your explicit approval.',
    
    cardVerification: 'We verify your card with a small temporary authorization (typically $1) that\'s reversed within 24 hours. This confirms the card is active and in good standing.',
    
    // Employee management
    minimumEmployees: 'Our percentage-based pricing is designed for businesses with established payroll operations. The 5-employee minimum ensures the economics work for both your business and our service delivery.',
    
    contractorVsEmployee: 'Employees receive W-2s and have taxes withheld. Contractors receive 1099s and handle their own taxes. Misclassification can result in penalties—contact your CPA if unsure.',
    
    w4Information: 'Form W-4 tells us how much federal income tax to withhold from each paycheck. Employees complete this when hired and can update it anytime their situation changes.',
    
    directDeposit: 'Employees provide their bank account and routing number for direct deposit. We coordinate ACH transfers so funds arrive on your specified payment date.',
    
    // Tax services
    cpaCertification: 'Certified Public Accountants maintain active state licenses, complete 40+ hours of annual continuing education, and carry professional liability insurance.',
    
    quarterlyTaxFiling: 'Form 941 reports federal income tax withheld, Social Security, and Medicare taxes quarterly. Late filing can result in penalties—we handle this automatically with Centurion Tax™.',
    
    taxEstimatedPayments: 'If you owe more than $1,000 in taxes annually, the IRS requires quarterly estimated payments to avoid penalties. Your CPA calculates and reminds you of payment amounts.',
    
    section179Deduction: 'Section 179 lets you deduct the full cost of qualifying equipment purchases (up to $1.16M for 2024) in the year purchased, rather than depreciating over time.',
    
    // Advisory services
    fiduciaryDuty: 'Fiduciary advisors are legally required to put your interests first. This is a higher standard than "suitable" advice and ensures recommendations prioritize your benefit.',
    
    advisoryScope: 'Financial advisors provide strategic planning, cash flow optimization, and structure recommendations. We do not manage investment portfolios or sell financial products.',
    
    cfpDesignation: 'Certified Financial Planner® professionals meet rigorous education, examination, experience, and ethics requirements. They maintain certification through ongoing education.',
    
    // Security & compliance
    soc2Certification: 'SOC 2 Type II is an independent audit of our security controls, verified annually by certified public accounting firms. Reports are available to customers under NDA.',
    
    pciCompliance: 'PCI DSS Level 1 is the highest payment security standard, required for large payment processors. We undergo quarterly scans and annual on-site assessments.',
    
    dataEncryption: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). This is the same encryption used by major banks and financial institutions.',
    
    mfaRequired: 'Two-factor authentication adds a second verification step beyond your password, significantly reducing account compromise risk. We require MFA for all users.',
    
    // Compliance
    stateUnemployment: 'State Unemployment Tax (SUTA) rates vary by state and your business\'s history. We calculate this automatically based on your employees\' work locations.',
    
    multiStateCompliance: 'Employees working in different states require separate tax calculations for each state. We handle this automatically—no action needed from you.',
  },
  
  // ============================================================================
  // HELPER TEXT
  // ============================================================================
  helperText: {
    // Account creation
    emailAddress: 'Use your business email. You\'ll receive payroll confirmations and tax documents here.',
    
    securePassword: 'Minimum 12 characters with uppercase, lowercase, numbers, and symbols. We recommend using a password manager.',
    
    businessEIN: 'Your 9-digit Employer Identification Number from the IRS. Format: XX-XXXXXXX',
    
    // AMEX setup
    amexCardNumber: 'Enter your American Express business card number. Personal cards are not eligible.',
    
    cardExpiration: 'We\'ll remind you to update card information 30 days before expiration.',
    
    backupAccount: 'Provide a business bank account for backup payments or if you prefer bank transfer for a specific payroll.',
    
    // Employee setup
    employeeSSN: 'Required for tax reporting and W-2 generation. Stored encrypted and never shared.',
    
    employeeDOB: 'Used for identity verification and certain tax calculations. Format: MM/DD/YYYY',
    
    employeeSalary: 'Annual salary for salaried employees. For hourly employees, enter hourly rate and we\'ll calculate based on hours worked.',
    
    payFrequency: 'How often you pay this employee. Most common: bi-weekly (every 2 weeks) or semi-monthly (twice per month).',
    
    // Payroll
    payrollDate: 'Date employees will receive funds in their bank accounts. Must be at least 3 business days from today.',
    
    hoursWorked: 'For hourly employees, enter total hours including regular time and overtime. Overtime (40+ hours) is calculated automatically.',
    
    bonusPayment: 'One-time payments like bonuses, commissions, or reimbursements. Taxed differently than regular wages.',
    
    // Tax information
    federalWithholding: 'Based on employee W-4 form. Employees can update W-4 anytime to adjust withholding.',
    
    stateWithholding: 'Calculated based on state W-4 (if applicable) and state tax tables. Some states don\'t have income tax.',
    
    ficaTaxes: 'Social Security (6.2%) and Medicare (1.45%) are required federal payroll taxes. Employer and employee each pay half.',
    
    // Services
    payrollOnlyService: 'Core CLEVIO service. Includes AMEX-powered payment processing, automated tax calculations, direct deposit, and compliance monitoring.',
    
    taxAdvisoryService: 'Add licensed CPA support for quarterly tax planning, annual filing, and year-round consultation. +2% of monthly payroll.',
    
    financialAdvisoryService: 'Add licensed financial advisor for strategic planning, cash flow optimization, and business structure guidance. +1% of monthly payroll.',
  },
  
  // ============================================================================
  // EMPTY STATES
  // ============================================================================
  emptyStates: {
    noEmployees: {
      title: 'Add your first employee to get started',
      description: 'You\'ll need at least 5 employees to run payroll through CLEVIO. Start by adding your team members with their compensation and tax information.',
      action: 'Add Employee',
    },
    
    noPayrollHistory: {
      title: 'No payroll runs yet',
      description: 'Once you process your first payroll, you\'ll see a complete history here with details, reports, and exports for each run.',
      action: 'Schedule First Payroll',
    },
    
    noScheduledPayrolls: {
      title: 'No upcoming payroll scheduled',
      description: 'Schedule your next payroll run to see it here. We\'ll remind you 24 hours before processing.',
      action: 'Schedule Payroll',
    },
    
    noAdvisorySessions: {
      title: 'Schedule your first advisory session',
      description: 'Meet with your licensed financial advisor to discuss cash flow, strategic planning, or business structure optimization.',
      action: 'Book Session',
    },
    
    noTaxDocuments: {
      title: 'No tax documents available yet',
      description: 'Quarterly filings and annual tax documents will appear here once generated by your CPA.',
      action: 'View Tax Calendar',
    },
    
    noNotifications: {
      title: 'You\'re all caught up',
      description: 'We\'ll notify you here about payroll confirmations, upcoming deadlines, and important account updates.',
      action: null,
    },
  },
  
  // ============================================================================
  // SUCCESS MESSAGES
  // ============================================================================
  success: {
    accountCreated: 'Welcome to CLEVIO. Check your email to verify your account.',
    
    employeeAdded: 'Employee added successfully. You can now include them in payroll runs.',
    
    amexCardVerified: 'Your American Express card has been verified and is ready for payroll processing.',
    
    payrollScheduled: 'Payroll scheduled for [DATE]. We\'ll send a reminder 24 hours before processing.',
    
    payrollProcessed: 'Payroll processed successfully. Employees will receive funds on [DATE]. Your AMEX card has been charged.',
    
    serviceActivated: '[SERVICE NAME] activated. Your new features are now available.',
    
    profileUpdated: 'Your profile has been updated.',
    
    passwordChanged: 'Password changed successfully. Use your new password next time you sign in.',
    
    mfaEnabled: 'Two-factor authentication is now active. You\'ll need your authenticator app to sign in.',
    
    advisoryBooked: 'Advisory session scheduled for [DATE] at [TIME] with [ADVISOR NAME].',
    
    exportComplete: 'Your data export is ready. Download will begin automatically.',
  },
  
  // ============================================================================
  // LOADING STATES
  // ============================================================================
  loading: {
    processingPayroll: 'Processing payroll...',
    verifyingCard: 'Verifying your AMEX card...',
    calculatingTaxes: 'Calculating federal and state taxes...',
    loadingEmployees: 'Loading your team...',
    generatingReport: 'Generating your report...',
    savingChanges: 'Saving your changes...',
    authenticating: 'Signing you in securely...',
  },
  
  // ============================================================================
  // CONFIRMATION DIALOGS
  // ============================================================================
  confirmations: {
    processPayroll: {
      title: 'Confirm payroll for [DATE]',
      message: 'This will charge $[AMOUNT] to your AMEX card ending in [XXXX] and initiate direct deposits to [COUNT] employees. Payroll cannot be modified after processing.',
      confirm: 'Confirm & Process Payroll',
      cancel: 'Review Again',
    },
    
    removeEmployee: {
      title: 'Remove [EMPLOYEE NAME]?',
      message: 'This removes the employee from your active roster. Their payroll history will be preserved for tax records, but they won\'t appear in future payroll runs.',
      confirm: 'Remove Employee',
      cancel: 'Cancel',
    },
    
    cancelService: {
      title: 'Cancel [SERVICE NAME]',
      message: 'You\'re currently in a 6-month commitment period. Canceling now requires payment of remaining fees ($[AMOUNT]). Your commitment ends on [DATE].',
      confirm: 'Proceed with Cancellation',
      cancel: 'Keep Service',
    },
    
    deleteAccount: {
      title: 'Delete your CLEVIO account',
      message: 'This permanently deletes your account and all data after required retention periods. Tax records will be retained for 7 years per IRS requirements. This action cannot be undone.',
      confirm: 'Delete Account',
      cancel: 'Cancel',
    },
    
    switchPaymentMethod: {
      title: 'Use bank account for this payroll?',
      message: 'Your AMEX card will not be charged for this payroll run. Your bank account ending in [XXXX] will be debited instead. You will not earn AMEX rewards on this transaction.',
      confirm: 'Use Bank Account',
      cancel: 'Keep Using AMEX',
    },
  },
  
  // ============================================================================
  // ONBOARDING MICROCOPY
  // ============================================================================
  onboarding: {
    step1: {
      title: 'Welcome to CLEVIO',
      subtitle: 'Let\'s set up your account in about 10 minutes',
    },
    
    step2: {
      title: 'Verify your American Express card',
      subtitle: 'This enables AMEX-powered payroll so you can earn rewards',
    },
    
    step3: {
      title: 'Add your team',
      subtitle: 'Import employees or add them one at a time',
    },
    
    step4: {
      title: 'Choose your services',
      subtitle: 'Payroll is required. Tax and Advisory are optional add-ons.',
    },
    
    step5: {
      title: 'You\'re all set',
      subtitle: 'Schedule your first payroll run whenever you\'re ready',
    },
  },
};

export type MicrocopyKey = keyof typeof microcopy;
