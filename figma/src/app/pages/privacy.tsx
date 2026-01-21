export function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-5xl md:text-6xl mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-foreground text-lg">Last updated: December 21, 2025</p>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">1. Information We Collect</h2>
            <p>
              We collect information necessary to provide payroll processing, tax advisory, and financial consulting services:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Business information (company name, EIN, address)</li>
              <li>Contact information (name, email, phone)</li>
              <li>Payment information (American Express card details)</li>
              <li>Employee and contractor data for payroll processing</li>
              <li>Financial information for tax and advisory services</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">2. How We Use Your Information</h2>
            <p>
              We use collected information to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Process payroll through American Express</li>
              <li>Provide tax preparation and advisory services</li>
              <li>Offer financial consulting and strategic guidance</li>
              <li>Maintain account security and prevent fraud</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Bank-level encryption for all sensitive data</li>
              <li>SOC 2 Type II certified infrastructure</li>
              <li>Regular security audits and penetration testing</li>
              <li>Multi-factor authentication options</li>
              <li>Encrypted data transmission and storage</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">4. Information Sharing</h2>
            <p>
              We share information only as necessary to provide our services:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>With licensed professionals providing your services</li>
              <li>With American Express for payment processing</li>
              <li>With tax authorities as required by law</li>
              <li>With service providers under strict confidentiality agreements</li>
            </ul>
            <p className="mt-4">
              We never sell or rent your personal information to third parties.
            </p>
          </section>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">5. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Access your personal information</li>
              <li>Request corrections to your data</li>
              <li>Request deletion of your information (subject to legal retention requirements)</li>
              <li>Opt out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">6. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide services and comply with legal obligations. 
              Tax and payroll records are typically retained for 7 years as required by IRS regulations.
            </p>
          </section>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">7. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your rights, contact our Data Protection Officer at 
              privacy@clevio.com or through your account dashboard.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
