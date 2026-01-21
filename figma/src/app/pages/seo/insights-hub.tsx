import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, TrendingUp, DollarSign, Shield } from 'lucide-react';
import { SEOHead } from '../../components/seo-head';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
}

export function InsightsHubPage() {
  const featuredArticle: Article = {
    slug: 'maximizing-amex-rewards-payroll',
    title: 'How to Maximize American Express Rewards on Business Payroll',
    excerpt: 'A comprehensive guide to earning 6-figure rewards annually by processing payroll through AMEX. Learn which cards offer the best earning rates, how to structure spending, and real-world ROI calculations from businesses of different sizes.',
    category: 'AMEX Strategy',
    date: 'December 15, 2025',
    readTime: '8 min read',
    author: 'Sarah Mitchell, CPA',
  };
  
  const articles: Article[] = [
    {
      slug: 'tax-strategies-small-business-2025',
      title: '10 Tax Strategies Every Small Business Owner Should Know in 2025',
      excerpt: 'From Section 179 deductions to QBI optimization, discover actionable tax strategies that reduce liability while staying compliant. Licensed CPA insights for businesses with 5-50 employees.',
      category: 'Tax Planning',
      date: 'December 12, 2025',
      readTime: '12 min read',
      author: 'James Chen, CFP',
    },
    {
      slug: 'payroll-compliance-multistate-employers',
      title: 'Payroll Compliance for Multi-State Employers: What You Need to Know',
      excerpt: 'Managing employees across multiple states introduces complex compliance requirements. Learn about varying tax rates, unemployment insurance, and state-specific regulations that impact your payroll.',
      category: 'Compliance',
      date: 'December 10, 2025',
      readTime: '10 min read',
      author: 'Michael Torres, CPA',
    },
    {
      slug: 'cash-flow-optimization-growing-businesses',
      title: 'Cash Flow Optimization Techniques for Growing Businesses',
      excerpt: 'Strategic approaches to managing working capital, timing payments, and leveraging credit intelligently. Real examples from companies that improved cash position by 30%+ without additional revenue.',
      category: 'Financial Strategy',
      date: 'December 8, 2025',
      readTime: '9 min read',
      author: 'Sarah Mitchell, CPA',
    },
    {
      slug: 'employee-vs-contractor-classification',
      title: 'Employee vs. Contractor Classification: Avoiding Costly Mistakes',
      excerpt: 'Misclassifying workers can result in back taxes, penalties, and legal issues. Understand the IRS criteria, state-specific rules, and best practices for proper worker classification.',
      category: 'Compliance',
      date: 'December 5, 2025',
      readTime: '7 min read',
      author: 'James Chen, CFP',
    },
    {
      slug: 'retirement-plans-small-business-owners',
      title: 'Choosing the Right Retirement Plan for Small Business Owners',
      excerpt: 'SEP IRA, Solo 401(k), or defined benefit plan? Compare retirement plan options based on contribution limits, tax benefits, administrative complexity, and suitability for different business structures.',
      category: 'Financial Planning',
      date: 'December 3, 2025',
      readTime: '11 min read',
      author: 'Michael Torres, CPA',
    },
    {
      slug: 'understanding-payroll-tax-obligations',
      title: 'Understanding Your Business Payroll Tax Obligations',
      excerpt: 'A complete breakdown of federal, state, and local payroll taxes including FICA, FUTA, SUTA, and income tax withholding. Learn filing schedules, payment deadlines, and penalty avoidance strategies.',
      category: 'Tax Planning',
      date: 'November 28, 2025',
      readTime: '8 min read',
      author: 'Sarah Mitchell, CPA',
    },
  ];
  
  const categories = [
    { name: 'AMEX Strategy', count: 8 },
    { name: 'Tax Planning', count: 15 },
    { name: 'Compliance', count: 12 },
    { name: 'Financial Strategy', count: 10 },
    { name: 'Financial Planning', count: 9 },
  ];
  
  return (
    <>
      <SEOHead
        title="Business Financial Insights | CLEVIO Resource Hub"
        description="Expert insights on AMEX payroll rewards, business tax planning, compliance strategies, and financial management from licensed CPAs and advisors."
        keywords="business financial insights, payroll best practices, tax planning tips, AMEX rewards strategy, small business finance"
        canonicalUrl="https://clevio.com/insights"
      />
      
      <div className="min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-16 px-6 lg:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
                Financial Insights for Business Leaders
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Strategic guidance on payroll management, tax optimization, and financial planning from 
                licensed CPAs and financial advisors. Actionable insights for growing businesses.
              </p>
            </div>
          </div>
        </section>
        
        {/* Featured Article */}
        <section className="pb-16 px-6">
          <div className="max-w-[1200px] mx-auto">
            <Link 
              to={`/insights/${featuredArticle.slug}`}
              className="block p-8 lg:p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl hover:border-primary/40 transition-all group"
            >
              <div className="flex items-center gap-2 text-sm text-primary mb-4">
                <TrendingUp className="w-4 h-4" />
                <span style={{ fontWeight: 600 }}>Featured Article</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl mb-4 group-hover:text-primary transition-colors">
                {featuredArticle.title}
              </h2>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {featuredArticle.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{featuredArticle.date}</span>
                </div>
                <span>{featuredArticle.readTime}</span>
                <span>By {featuredArticle.author}</span>
              </div>
              
              <div className="inline-flex items-center gap-2 text-primary mt-6 group-hover:gap-3 transition-all">
                Read full article <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </section>
        
        {/* Articles Grid */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="sticky top-24 space-y-6">
                  <div>
                    <h3 className="mb-4" style={{ fontWeight: 600 }}>Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          to={`/insights/category/${category.name.toLowerCase().replace(' ', '-')}`}
                          className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-card transition-all"
                        >
                          <span>{category.name}</span>
                          <span className="text-xs text-muted-foreground">({category.count})</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-6 bg-card border border-border rounded-xl">
                    <h3 className="mb-3" style={{ fontWeight: 600 }}>Get Insights by Email</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Receive monthly financial insights and tax tips directly in your inbox.
                    </p>
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg mb-3 text-sm"
                    />
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm">
                      Subscribe
                    </button>
                  </div>
                </div>
              </aside>
              
              {/* Articles */}
              <div className="flex-1">
                <h2 className="text-2xl mb-6">Recent Articles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <Link
                      key={article.slug}
                      to={`/insights/${article.slug}`}
                      className="block p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
                    >
                      <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-3" style={{ fontWeight: 600 }}>
                        {article.category}
                      </div>
                      
                      <h3 className="text-xl mb-3 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        By {article.author}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Quick Links */}
        <section className="py-16 px-6">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl text-center mb-12">Popular Topics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/insights/category/amex-strategy"
                className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-2 group-hover:text-primary transition-colors">
                  AMEX Rewards Strategy
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Maximize rewards on payroll and business expenses. Card comparisons, earning optimization, 
                  and ROI calculations.
                </p>
              </Link>
              
              <Link
                to="/insights/category/tax-planning"
                className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-2 group-hover:text-primary transition-colors">
                  Tax Planning & Strategy
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Reduce tax liability legally and strategically. Entity optimization, deductions, credits, 
                  and year-round planning tips.
                </p>
              </Link>
              
              <Link
                to="/insights/category/compliance"
                className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl mb-2 group-hover:text-primary transition-colors">
                  Compliance & Best Practices
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Stay compliant with federal and state regulations. Worker classification, multi-state payroll, 
                  and audit preparation.
                </p>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 px-6 bg-accent/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-6">
              Get Personalized Financial Guidance
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              These insights are helpful, but your business deserves customized advice. Work with licensed 
              CPAs and financial advisors who understand your specific situation.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-lg"
            >
              Schedule a Consultation
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
