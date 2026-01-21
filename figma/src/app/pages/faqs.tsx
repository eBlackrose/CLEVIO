import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

export function FAQsPage() {
  const faqs = [
    {
      question: 'How does payroll via AMEX work?',
      answer: 'CLEVIO processes your payroll payments through your connected American Express card. When you run payroll, the funds are charged to your AMEX account and distributed to your employees and contractors. This allows you to earn rewards on payroll while maintaining professional payment infrastructure.',
    },
    {
      question: 'What security and compliance measures are in place?',
      answer: 'All services are provided by properly licensed and insured professionals. Your AMEX card information is encrypted using bank-level security. We comply with all relevant financial regulations and maintain SOC 2 Type II certification. All tax advisors are licensed CPAs, and financial advisors hold appropriate licenses.',
    },
    {
      question: 'What are the licensing and insurance details?',
      answer: 'CLEVIO operates as a licensed financial services platform. All tax professionals are licensed CPAs in good standing. Financial advisors maintain appropriate securities licenses. The platform carries comprehensive E&O insurance and professional liability coverage.',
    },
    {
      question: 'What are the contract terms?',
      answer: 'Each service tier requires a 6-month minimum commitment. After the initial term, your subscription automatically converts to month-to-month billing with no long-term lock-in. You can cancel with 30 days notice after the initial commitment period.',
    },
    {
      question: 'Who is CLEVIO designed for?',
      answer: 'CLEVIO is built for sophisticated founders, CFOs, and finance teams who want the flexibility of AMEX payroll processing combined with access to licensed financial and tax professionals. Ideal for companies with 5+ team members who value strategic financial guidance.',
    },
    {
      question: 'Why is there a 5-person minimum?',
      answer: 'The 5-person minimum ensures that our percentage-based pricing model provides value for both you and our licensed professionals. It allows us to deliver high-quality advisory services while maintaining economic efficiency.',
    },
    {
      question: 'Can I change my service tiers?',
      answer: 'Yes, you can add service tiers at any time. Removing tiers is subject to your current commitment period. Any changes to your subscription will be reflected in your next billing cycle.',
    },
    {
      question: 'How quickly can I start running payroll?',
      answer: 'Once your account is verified and you\'ve added your AMEX card and minimum team members, you can typically run your first payroll within 24-48 hours.',
    },
  ];
  
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about CLEVIO
          </p>
        </div>
        
        <Accordion.Root type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <Accordion.Item 
              key={index} 
              value={`item-${index}`}
              className="border border-border rounded-xl overflow-hidden bg-card"
            >
              <Accordion.Header>
                <Accordion.Trigger className="flex items-center justify-between w-full p-6 text-left hover:bg-accent/50 transition-colors group">
                  <span className="text-lg pr-4">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-6 pb-6 text-muted-foreground">
                {faq.answer}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </div>
  );
}
