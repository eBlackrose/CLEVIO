export function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-5xl md:text-6xl mb-8">Terms & Conditions</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-foreground text-lg">Last updated: December 21, 2025</p>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using CLEVIO's services, you agree to be bound by these Terms and Conditions. 
              If you disagree with any part of these terms, you may not access our services.
            </p>
          </section>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">2. Service Description</h2>
            <p>
              CLEVIO operates as a financial services platform providing payroll processing through American Express, 
              tax advisory services, and financial consulting. All services are provided by properly licensed and insured professionals.
            </p>
            <p className="mt-4">
              CLEVIO is not a bank. We are a technology platform that connects businesses with licensed financial professionals 
              and facilitates payroll processing through American Express payment infrastructure.
            </p>
          </section>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">3. Professional Licensing</h2>
            <p>
              All tax advisors working through CLEVIO are licensed Certified Public Accountants (CPAs) in good standing. 
              Financial advisors maintain appropriate securities licenses as required by applicable regulations.
            </p>
          </section>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">4. Subscription Terms</h2>
            <p>
              Each service tier (Centurion Payroll™, Centurion Tax™, Centurion Advisory™) requires a 6-month minimum commitment. 
              After the initial term, subscriptions automatically convert to month-to-month billing.
            </p>
            <p className="mt-4">
              A minimum of 5 employees or contractors is required to maintain an active subscription. Services will be 
              suspended if this minimum is not met.
            </p>
          </section>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">5. Pricing and Payments</h2>
            <p>
              Pricing is based on a percentage of payroll processed: 2% for Centurion Payroll, 2% for Centurion Tax, 
              and 1% for Centurion Advisory. These percentages are cumulative if multiple tiers are selected.
            </p>
          </section>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">6. Cancellation Policy</h2>
            <p>
              You may cancel your subscription after the initial 6-month commitment period with 30 days written notice. 
              Cancellation requests must be submitted through your account dashboard.
            </p>
          </section>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">7. Limitation of Liability</h2>
            <p>
              CLEVIO and its licensed professionals maintain comprehensive professional liability insurance. However, 
              our liability is limited to the amount of fees paid in the 12 months preceding any claim.
            </p>
          </section>
          
          <section>
            <h2 className="text-foreground text-2xl mt-12 mb-4">8. Contact Information</h2>
            <p>
              For questions about these Terms and Conditions, please contact us through your account dashboard or 
              email support@clevio.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
