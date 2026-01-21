import { Shield, Lock, Award, FileText, CheckCircle2, Building2, Users, CreditCard } from 'lucide-react';
import { ExpandableDisclosure, TrustBadge, DisclaimerBox, LegalFooter } from '../components/disclosures';

export function CompliancePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl mb-6">Trust & Compliance</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We believe transparency builds trust. Here's everything you need to know about how CLEVIO 
            is licensed, insured, and committed to protecting your business.
          </p>
        </div>
      </section>
      
      {/* Trust Badges */}
      <section className="py-12 px-6 bg-accent/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TrustBadge
              icon="shield"
              label="SOC 2 Type II"
              description="Independently audited security controls"
            />
            <TrustBadge
              icon="lock"
              label="PCI DSS Level 1"
              description="Highest standard for payment security"
            />
            <TrustBadge
              icon="award"
              label="Licensed Professionals"
              description="CPAs and advisors in all 50 states"
            />
            <TrustBadge
              icon="file"
              label="$5M E&O Coverage"
              description="Professional liability insurance"
            />
          </div>
        </div>
      </section>
      
      {/* Main Disclosures */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl mb-8 text-center">Complete Disclosures</h2>
          
          <div className="space-y-4">
            {/* Not a Bank */}
            <ExpandableDisclosure
              title="CLEVIO is Not a Bank"
              summary="We partner with licensed banking institutions to provide payment services."
              icon="shield"
            >
              <p>
                CLEVIO Financial Services, LLC is a financial technology platform and is not a bank. 
                We do not hold banking licenses and do not provide banking services directly.
              </p>
              
              <p>
                <strong>Banking Partner:</strong> Payment processing and fund movement services are provided 
                through our partnership with licensed financial institutions that are Members FDIC. Your funds 
                are held at these partner banks, not at CLEVIO.
              </p>
              
              <p>
                <strong>FDIC Insurance:</strong> Funds held at our partner banks are eligible for FDIC insurance 
                up to $250,000 per depositor, per insured bank, for each account ownership category. FDIC insurance 
                does not cover investment products or services offered through CLEVIO.
              </p>
              
              <p>
                <strong>Our Role:</strong> CLEVIO provides the technology platform, user interface, and coordinates 
                payroll processing. We work with regulated partners to ensure all banking activities meet federal 
                and state requirements.
              </p>
            </ExpandableDisclosure>
            
            {/* Payment Processing */}
            <ExpandableDisclosure
              title="American Express Payment Processing"
              summary="How we enable AMEX-powered payroll and what it means for your business."
              icon="file"
            >
              <p>
                CLEVIO enables businesses to process payroll payments through American Express commercial card products. 
                This service is subject to approval by American Express and compliance with their policies.
              </p>
              
              <p>
                <strong>Card Verification:</strong> Your American Express card must be verified and in good standing. 
                We perform verification checks during onboarding and periodically thereafter to ensure payment capability.
              </p>
              
              <p>
                <strong>Transaction Fees:</strong> Our service fee is a transparent percentage of payroll volume as 
                disclosed in your service agreement. American Express may assess separate fees based on your card agreement. 
                Review your AMEX cardholder terms for complete fee information.
              </p>
              
              <p>
                <strong>Payment Timing:</strong> Payroll funds are charged to your American Express card according to 
                your selected payroll schedule. Standard processing time applies, and funds must be available on your 
                card at the time of processing.
              </p>
              
              <p>
                <strong>Rewards & Benefits:</strong> Earning rates, reward categories, and card benefits are determined 
                solely by American Express and your specific card agreement. CLEVIO does not guarantee any particular 
                reward earning rate or benefit eligibility.
              </p>
            </ExpandableDisclosure>
            
            {/* Tax Services */}
            <ExpandableDisclosure
              title="Tax Advisory Services"
              summary="Provided by licensed CPAs with appropriate state credentials and insurance."
              icon="award"
            >
              <p>
                Tax preparation, filing, and advisory services are provided exclusively by licensed Certified Public 
                Accountants (CPAs) or Enrolled Agents (EAs) who maintain active credentials in good standing.
              </p>
              
              <p>
                <strong>State Licensing:</strong> All tax professionals providing services through CLEVIO hold valid 
                licenses in the states where they practice. We verify credentials during onboarding and monitor license 
                status continuously.
              </p>
              
              <p>
                <strong>Professional Standards:</strong> Our tax professionals adhere to the American Institute of CPAs 
                (AICPA) Code of Professional Conduct and applicable state board regulations. They maintain continuing 
                education requirements and professional liability insurance.
              </p>
              
              <p>
                <strong>Scope of Service:</strong> Centurion Tax™ services include payroll tax compliance, quarterly 
                filings, annual returns, and tax planning consultation. Services do not include personal tax returns, 
                audit representation, or legal advice unless specifically contracted.
              </p>
              
              <p>
                <strong>Liability:</strong> Professional errors and omissions insurance with $5,000,000 coverage 
                protects clients in the event of professional mistakes. This coverage is maintained separately from 
                CLEVIO's general liability insurance.
              </p>
            </ExpandableDisclosure>
            
            {/* Financial Advisory */}
            <ExpandableDisclosure
              title="Financial Advisory Services"
              summary="Strategic guidance from licensed financial professionals."
              icon="award"
            >
              <p>
                Financial planning and advisory services are provided by licensed financial advisors who maintain 
                appropriate credentials including CFP®, CFA, or equivalent professional designations.
              </p>
              
              <p>
                <strong>Licensing & Registration:</strong> Advisors maintain licenses as required by state securities 
                regulators. Where applicable, advisors are registered with the SEC or state securities authorities as 
                investment adviser representatives.
              </p>
              
              <p>
                <strong>Fiduciary Duty:</strong> When providing investment advice, our advisors act in a fiduciary 
                capacity and are obligated to act in your best interest. This includes disclosure of any conflicts 
                of interest and transparent fee arrangements.
              </p>
              
              <p>
                <strong>Services Provided:</strong> Centurion Advisory™ includes financial planning consultation, 
                cash flow optimization strategies, capital deployment planning, and business financial structure 
                recommendations. We do not manage investment portfolios or sell investment products.
              </p>
              
              <p>
                <strong>Not Investment Advice:</strong> Unless you have a separate investment advisory agreement, 
                information provided through CLEVIO is for educational and planning purposes only and should not 
                be considered specific investment recommendations.
              </p>
            </ExpandableDisclosure>
            
            {/* Data Security */}
            <ExpandableDisclosure
              title="Data Security & Privacy"
              summary="How we protect your sensitive business and financial information."
              icon="lock"
            >
              <p>
                CLEVIO maintains institutional-grade security controls to protect your data. We undergo regular 
                third-party audits and maintain industry-leading certifications.
              </p>
              
              <p>
                <strong>SOC 2 Type II Certification:</strong> We complete annual SOC 2 Type II audits conducted by 
                independent certified public accounting firms. These audits verify our security, availability, and 
                confidentiality controls meet rigorous standards.
              </p>
              
              <p>
                <strong>PCI DSS Compliance:</strong> As a Level 1 PCI DSS compliant service provider (the highest 
                level), we maintain strict controls over payment card data. We undergo quarterly network scans and 
                annual on-site assessments to maintain compliance.
              </p>
              
              <p>
                <strong>Data Encryption:</strong> All data is encrypted in transit using TLS 1.3 or higher. Data at 
                rest is encrypted using AES-256 encryption. Encryption keys are managed through secure key management 
                systems with regular rotation.
              </p>
              
              <p>
                <strong>Access Controls:</strong> We employ role-based access controls, multi-factor authentication, 
                and the principle of least privilege. All access to sensitive systems is logged and monitored.
              </p>
              
              <p>
                <strong>Data Retention:</strong> We retain your data according to legal and regulatory requirements. 
                You can request data deletion subject to our retention obligations. See our Privacy Policy for complete 
                information about data handling practices.
              </p>
              
              <p>
                <strong>Incident Response:</strong> We maintain a formal security incident response program. In the 
                event of a data breach affecting your information, we will notify you in accordance with applicable 
                state and federal breach notification laws.
              </p>
            </ExpandableDisclosure>
            
            {/* Regulatory Compliance */}
            <ExpandableDisclosure
              title="Regulatory Oversight & Compliance"
              summary="The regulations we follow and agencies that oversee our operations."
              icon="shield"
            >
              <p>
                CLEVIO operates under multiple regulatory frameworks depending on the services provided. We maintain 
                compliance programs to ensure adherence to all applicable laws and regulations.
              </p>
              
              <p>
                <strong>Payment Services:</strong> Our payment processing activities are conducted through licensed 
                partners subject to oversight by federal banking regulators including the OCC, Federal Reserve, and FDIC.
              </p>
              
              <p>
                <strong>Tax Services:</strong> Tax professionals are subject to oversight by state boards of accountancy 
                and the IRS Office of Professional Responsibility for Enrolled Agents. They must comply with Circular 230 
                regulations governing practice before the IRS.
              </p>
              
              <p>
                <strong>Advisory Services:</strong> Financial advisors are subject to oversight by state securities 
                regulators and, where applicable, the Securities and Exchange Commission (SEC). We comply with applicable 
                provisions of the Investment Advisers Act of 1940.
              </p>
              
              <p>
                <strong>Anti-Money Laundering (AML):</strong> We maintain an AML compliance program including customer 
                identification procedures, suspicious activity monitoring, and reporting obligations under the Bank Secrecy Act.
              </p>
              
              <p>
                <strong>Consumer Protection:</strong> We comply with consumer protection regulations including truth in 
                advertising, fair lending practices where applicable, and electronic fund transfer regulations.
              </p>
            </ExpandableDisclosure>
            
            {/* Service Commitments */}
            <ExpandableDisclosure
              title="Service Commitments & Limitations"
              summary="What we commit to providing and the limitations of our service."
              icon="file"
            >
              <p>
                CLEVIO is committed to providing reliable, professional payroll and financial services. However, 
                it's important to understand what we do and do not guarantee.
              </p>
              
              <p>
                <strong>Service Availability:</strong> We target 99.9% platform uptime but cannot guarantee 
                uninterrupted service. We maintain redundant systems and disaster recovery capabilities to minimize 
                disruption. Scheduled maintenance is performed during off-peak hours when possible.
              </p>
              
              <p>
                <strong>Payment Processing:</strong> While we process payroll according to your schedule, actual 
                payment timing depends on American Express processing, banking hours, and federal holidays. We recommend 
                scheduling payroll with adequate lead time to ensure timely payment.
              </p>
              
              <p>
                <strong>Tax Compliance:</strong> Our tax professionals work diligently to ensure accurate filings, 
                but you remain ultimately responsible for the accuracy of information provided to us and for your tax 
                obligations. We recommend reviewing all filings before submission.
              </p>
              
              <p>
                <strong>Advisory Services:</strong> Financial advice is based on information you provide and professional 
                judgment at the time given. Market conditions, regulations, and your circumstances may change. You should 
                consult with your advisor before taking action based on prior recommendations.
              </p>
              
              <p>
                <strong>No Guarantee of Results:</strong> We cannot guarantee specific financial outcomes, tax savings, 
                or rewards earning. Results depend on numerous factors including your business operations, American Express 
                policies, and tax law changes.
              </p>
              
              <p>
                <strong>Third-Party Services:</strong> We integrate with American Express and other third-party services. 
                We are not responsible for changes to third-party terms, service interruptions, or policy modifications 
                by partners.
              </p>
            </ExpandableDisclosure>
            
            {/* Minimum Requirements */}
            <ExpandableDisclosure
              title="Service Requirements & Eligibility"
              summary="Business requirements to use CLEVIO services."
              icon="file"
            >
              <p>
                To ensure our service model works effectively and complies with partner requirements, all clients 
                must meet minimum eligibility criteria.
              </p>
              
              <p>
                <strong>Employee Minimum:</strong> Your business must maintain at least 5 employees to use CLEVIO 
                services. This minimum ensures the economics of percentage-based pricing work for your business and 
                meets our partner requirements.
              </p>
              
              <p>
                <strong>Commitment Period:</strong> All service tiers require a 6-month minimum commitment. This allows 
                us to provide consistent advisory support and amortize onboarding costs. Early termination fees may apply 
                if you end service before the commitment period concludes.
              </p>
              
              <p>
                <strong>American Express Card:</strong> You must have an active American Express commercial card in 
                good standing with sufficient credit to cover payroll obligations. We verify card status during onboarding 
                and may request updated verification periodically.
              </p>
              
              <p>
                <strong>Business Entity:</strong> CLEVIO serves business entities including corporations, LLCs, and 
                partnerships. We currently do not serve sole proprietors without employees or independent contractors 
                paying themselves.
              </p>
              
              <p>
                <strong>Geographic Limitations:</strong> Services are currently available to businesses operating in 
                the United States with employees in US states and territories. We may have limited availability for 
                certain states or industries due to licensing or partner restrictions.
              </p>
            </ExpandableDisclosure>
          </div>
        </div>
      </section>
      
      {/* Commitment Statement */}
      <section className="py-16 px-6 bg-accent/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Our Commitment to You</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Transparency, security, and professional excellence in everything we do.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Clear Communication</h3>
              <p className="text-muted-foreground leading-relaxed">
                No hidden fees, no confusing jargon. We explain our fees, services, and limitations 
                in plain language before you commit.
              </p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Institutional Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bank-grade security infrastructure, regular third-party audits, and industry-leading 
                certifications protect your sensitive data.
              </p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Licensed Professionals</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every CPA, EA, and financial advisor on our platform maintains active licenses, 
                continuing education, and professional liability insurance.
              </p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Regulatory Compliance</h3>
              <p className="text-muted-foreground leading-relaxed">
                We operate within established regulatory frameworks and work with licensed partners 
                to ensure all services meet federal and state requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact & Resources */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 lg:p-12">
            <h2 className="text-2xl mb-6">Questions About Compliance?</h2>
            
            <p className="text-muted-foreground leading-relaxed mb-8">
              We're committed to transparency. If you have questions about our licenses, insurance, security 
              practices, or regulatory compliance, our team is here to help.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Compliance Inquiries</div>
                <a href="mailto:compliance@clevio.com" className="text-primary hover:underline">
                  compliance@clevio.com
                </a>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Security Questions</div>
                <a href="mailto:security@clevio.com" className="text-primary hover:underline">
                  security@clevio.com
                </a>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border">
              <div className="text-sm text-muted-foreground mb-4">Additional Resources</div>
              <div className="flex flex-wrap gap-4">
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                <a href="#" className="text-primary hover:underline">Data Processing Agreement</a>
                <a href="#" className="text-primary hover:underline">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Legal Footer */}
      <section className="py-12 px-6 bg-accent/30">
        <div className="max-w-4xl mx-auto">
          <LegalFooter />
          
          <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
            Last Updated: December 21, 2025
          </div>
        </div>
      </section>
    </div>
  );
}
