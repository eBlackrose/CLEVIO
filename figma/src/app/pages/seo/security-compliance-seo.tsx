import { Link } from 'react-router-dom';
import { Shield, Lock, CheckCircle2, FileText, Award, Building2 } from 'lucide-react';
import { SEOHead } from '../../components/seo-head';

export function SecurityComplianceSEOPage() {
  return (
    <>
      <SEOHead
        title="Security & Compliance | SOC 2 Certified Payroll Platform"
        description="Enterprise-grade security for business payroll. SOC 2 Type II certified, PCI DSS Level 1 compliant, with bank-level encryption and licensed professional oversight."
        keywords="payroll security, SOC 2 compliance, PCI DSS payroll, secure payroll processing, data encryption, business data security"
        canonicalUrl="https://clevio.com/security-compliance"
      />
      
      <div className="min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-16 px-6 lg:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              
              <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
                Enterprise Security for Your Business Payroll
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Bank-grade security infrastructure, independent audits, and regulatory compliance that 
                protects your sensitive payroll data and employee information.
              </p>
            </div>
          </div>
        </section>
        
        {/* Trust Indicators */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-card border border-border rounded-xl text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl" style={{ fontWeight: 600 }}>
                  <Shield className="w-8 h-8" />
                </div>
                <div className="text-2xl mb-2" style={{ fontWeight: 600 }}>SOC 2 Type II</div>
                <div className="text-sm text-muted-foreground">Independently Audited</div>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl" style={{ fontWeight: 600 }}>
                  <Lock className="w-8 h-8" />
                </div>
                <div className="text-2xl mb-2" style={{ fontWeight: 600 }}>PCI DSS Level 1</div>
                <div className="text-sm text-muted-foreground">Payment Card Security</div>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl" style={{ fontWeight: 600 }}>
                  <Award className="w-8 h-8" />
                </div>
                <div className="text-2xl mb-2" style={{ fontWeight: 600 }}>$5M Insurance</div>
                <div className="text-sm text-muted-foreground">Professional Liability</div>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-xl text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl" style={{ fontWeight: 600 }}>
                  <Building2 className="w-8 h-8" />
                </div>
                <div className="text-2xl mb-2" style={{ fontWeight: 600 }}>50 States</div>
                <div className="text-sm text-muted-foreground">Licensed Professionals</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Security Measures */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">
                How We Protect Your Payroll Data
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Multi-layered security controls designed for sensitive financial information
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl mb-4">Data Encryption</h3>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">In Transit:</strong> All data transmitted between 
                    your browser and our servers uses TLS 1.3 encryption, the most current and secure protocol 
                    available. This is the same encryption used by banks and financial institutions.
                  </p>
                  <p>
                    <strong className="text-foreground">At Rest:</strong> Sensitive data stored in our 
                    databases is encrypted using AES-256 encryption. Encryption keys are managed through 
                    AWS Key Management Service with automatic rotation and hardware security modules (HSMs).
                  </p>
                  <p>
                    <strong className="text-foreground">Payment Data:</strong> American Express card numbers 
                    are tokenized immediately upon entry and never stored in plain text. We use PCI-compliant 
                    payment processors for all card transactions.
                  </p>
                </div>
              </div>
              
              <div className="p-8 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl mb-4">Access Controls</h3>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Multi-Factor Authentication:</strong> All user accounts 
                    require MFA using authenticator apps or hardware security keys. SMS-based MFA is discouraged 
                    due to security limitations.
                  </p>
                  <p>
                    <strong className="text-foreground">Role-Based Permissions:</strong> Access to payroll data, 
                    employee information, and financial records is controlled through granular role-based permissions. 
                    Users only see data necessary for their role.
                  </p>
                  <p>
                    <strong className="text-foreground">Audit Logging:</strong> Every access to sensitive data, 
                    configuration change, and payroll action is logged with timestamps and user identification. 
                    Logs are retained for 7 years and monitored for suspicious activity.
                  </p>
                </div>
              </div>
              
              <div className="p-8 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl mb-4">Infrastructure Security</h3>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Cloud Infrastructure:</strong> We use Amazon Web Services 
                    (AWS) infrastructure with redundant data centers, DDoS protection, and 99.99% uptime SLA. 
                    All infrastructure is located in SSAE-18 certified facilities within the United States.
                  </p>
                  <p>
                    <strong className="text-foreground">Network Segmentation:</strong> Our application, database, 
                    and payment processing systems operate in separate network segments with strict firewall rules 
                    controlling traffic between segments.
                  </p>
                  <p>
                    <strong className="text-foreground">Vulnerability Management:</strong> Automated vulnerability 
                    scanning runs continuously. Critical vulnerabilities are patched within 24 hours. We participate 
                    in responsible disclosure programs and maintain a bug bounty with security researchers.
                  </p>
                </div>
              </div>
              
              <div className="p-8 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl mb-4">Incident Response</h3>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">24/7 Monitoring:</strong> Security Operations Center (SOC) 
                    monitors systems around the clock for anomalies, intrusion attempts, and security events. 
                    Automated alerting ensures rapid response to potential incidents.
                  </p>
                  <p>
                    <strong className="text-foreground">Incident Response Plan:</strong> We maintain a formal incident 
                    response plan with defined procedures for detection, containment, eradication, and recovery from 
                    security incidents. The plan is tested quarterly through tabletop exercises.
                  </p>
                  <p>
                    <strong className="text-foreground">Breach Notification:</strong> In the unlikely event of a data 
                    breach affecting your information, we will notify you within 72 hours in accordance with applicable 
                    state and federal breach notification laws.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Compliance Certifications */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12">
              Independent Audits & Certifications
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-card border border-border rounded-xl">
                <h3 className="text-2xl mb-4">SOC 2 Type II Certification</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  SOC 2 (Service Organization Control 2) Type II is an independent audit of our security, 
                  availability, processing integrity, confidentiality, and privacy controls. Unlike Type I 
                  which examines design, Type II validates that controls operate effectively over time.
                </p>
                <div className="p-4 bg-accent/50 rounded-lg mb-4">
                  <div className="text-sm mb-2" style={{ fontWeight: 600 }}>What SOC 2 Type II Covers:</div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Access controls and authentication mechanisms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Encryption implementation and key management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Change management and development practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Backup and disaster recovery procedures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Vendor management and third-party risk assessment</span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our SOC 2 Type II report is available to customers under NDA. Audits are conducted annually 
                  by independent certified public accounting firms.
                </p>
              </div>
              
              <div className="p-8 bg-card border border-border rounded-xl">
                <h3 className="text-2xl mb-4">PCI DSS Level 1 Compliance</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  PCI DSS (Payment Card Industry Data Security Standard) Level 1 is the highest level of 
                  payment security certification, required for organizations processing over 6 million card 
                  transactions annually. This is the same standard maintained by major payment processors.
                </p>
                <div className="p-4 bg-accent/50 rounded-lg mb-4">
                  <div className="text-sm mb-2" style={{ fontWeight: 600 }}>PCI DSS Requirements:</div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Secure network infrastructure with firewall protection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Strong encryption for cardholder data transmission and storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Vulnerability management and regular security testing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Strict access control and monitoring procedures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Information security policy and employee training</span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  We undergo quarterly network scans by Approved Scanning Vendors (ASVs) and annual on-site 
                  assessments by Qualified Security Assessors (QSAs).
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Professional Compliance */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12">
              Professional Licensing & Insurance
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-card border border-border rounded-xl">
                <h3 className="text-2xl mb-4">Licensed Tax Professionals</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Every CPA and Enrolled Agent providing tax services through CLEVIO maintains active licenses 
                  in good standing with state boards of accountancy or IRS Office of Professional Responsibility.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">State Licensing</div>
                      <div className="text-sm text-muted-foreground">
                        CPAs are licensed by state boards with verification of education, examination, and 
                        experience requirements
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Continuing Education</div>
                      <div className="text-sm text-muted-foreground">
                        40+ hours annually of professional education to maintain licenses and stay current 
                        with tax law changes
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Professional Standards</div>
                      <div className="text-sm text-muted-foreground">
                        Adherence to AICPA Code of Professional Conduct and applicable state board regulations
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="p-8 bg-card border border-border rounded-xl">
                <h3 className="text-2xl mb-4">Professional Liability Insurance</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  CLEVIO maintains $5,000,000 in professional errors and omissions (E&O) insurance coverage 
                  for all advisory services provided through our platform.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Coverage Scope</div>
                      <div className="text-sm text-muted-foreground">
                        Protects clients against professional mistakes in tax preparation, financial advice, 
                        and payroll processing
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Claims Process</div>
                      <div className="text-sm text-muted-foreground">
                        Direct claims handling through our insurance carrier with no deductible for clients
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Carrier Rating</div>
                      <div className="text-sm text-muted-foreground">
                        Coverage provided by A.M. Best A-rated insurance carrier with proven claims-paying ability
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Privacy */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-8">
              Your Data Privacy Rights
            </h2>
            <div className="p-8 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground leading-relaxed mb-6">
                We believe you should maintain control over your business data. CLEVIO adheres to data privacy 
                principles that respect your ownership and control.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2" style={{ fontWeight: 600 }}>Data Ownership</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your payroll data, employee information, and financial records belong to you, not CLEVIO. 
                    We are a processor of your data, acting only on your instructions.
                  </p>
                </div>
                
                <div>
                  <h3 className="mb-2" style={{ fontWeight: 600 }}>Data Portability</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Export your complete data set at any time in standard formats (CSV, JSON, PDF). If you leave 
                    CLEVIO, we provide your data within 30 days at no charge.
                  </p>
                </div>
                
                <div>
                  <h3 className="mb-2" style={{ fontWeight: 600 }}>Data Deletion</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Request deletion of your data subject to our legal retention obligations for tax records 
                    (7 years) and payroll documentation. We delete non-required data within 90 days of request.
                  </p>
                </div>
                
                <div>
                  <h3 className="mb-2" style={{ fontWeight: 600 }}>No Data Selling</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We will never sell your data to third parties. We do not use your data for advertising, 
                    data brokerage, or any purpose beyond providing payroll and financial services to you.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border text-center">
                <Link to="/privacy" className="text-primary hover:underline">
                  Read our complete Privacy Policy →
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-6">
              Questions About Our Security?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our security and compliance team is available to answer questions and provide detailed information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:security@clevio.com"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-lg"
              >
                Contact Security Team
              </a>
              <Link
                to="/compliance"
                className="px-8 py-4 bg-card border border-border rounded-xl hover:bg-accent transition-all text-lg"
              >
                View All Disclosures
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
