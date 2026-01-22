import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/navigation';
import { Footer } from './components/footer';
import { DashboardLayout } from './components/dashboard-nav';
import { AdminLayout } from './components/admin-nav';
import { AdminProtectedRoute } from './components/admin-protected-route';
import { ProtectedRoute } from './components/protected-route';
import { UserProvider } from './contexts/user-context';
import { AdminProvider } from './contexts/admin-context';
import { AdminDataProvider } from './contexts/admin-data-context';
import { Toaster } from './components/ui/sonner';
// Mock backend removed - using real backend API (see config/api.ts)
import { HomePage } from './pages/home';
import { PricingPage } from './pages/pricing';
import { PricingWithDisclosuresPage } from './pages/pricing-with-disclosures';
import { HowItWorksPage } from './pages/how-it-works';
import { FAQsPage } from './pages/faqs';
import { SignUpPage } from './pages/signup';
import { SignInPage } from './pages/signin';
import { PortalPage } from './pages/portal';
import { TermsPage } from './pages/terms';
import { PrivacyPage } from './pages/privacy';
import { CompliancePage } from './pages/compliance';
import { DisclosureExamplesPage } from './pages/disclosure-examples';
import { OnboardingPage } from './pages/onboarding';
import { ModalDemoPage } from './pages/modal-demo';
import { PitchPage } from './pages/pitch';
import { DashboardOverview } from './pages/dashboard/overview';
import { PayrollPage } from './pages/dashboard/payroll';
import { EmployeesPage } from './pages/dashboard/employees';
import { ServicesPage } from './pages/dashboard/services';
import { AdvisoryPage } from './pages/dashboard/advisory';
import { PaymentsPage } from './pages/dashboard/payments';
import { SettingsPage } from './pages/dashboard/settings';
import { AdminLogin } from './pages/admin/admin-login';
import { AdminOverview } from './pages/admin/admin-overview';
import { AdminClients } from './pages/admin/admin-clients';
import { AdminCompliance } from './pages/admin/admin-compliance';
import { AdminAdvisory } from './pages/admin/admin-advisory';

function App() {
  return (
    <UserProvider>
      <AdminProvider>
        <AdminDataProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background text-foreground">
              {/* Background decoration */}
              <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
              </div>
              
              <Toaster position="top-right" />
              
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                  <>
                    <Navigation />
                    <main>
                      <HomePage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/pricing" element={
                  <>
                    <Navigation />
                    <main>
                      <PricingPage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/pricing-with-disclosures" element={
                  <>
                    <Navigation />
                    <main>
                      <PricingWithDisclosuresPage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/how-it-works" element={
                  <>
                    <Navigation />
                    <main>
                      <HowItWorksPage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/faqs" element={
                  <>
                    <Navigation />
                    <main>
                      <FAQsPage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/signup" element={
                  <>
                    <Navigation />
                    <main>
                      <SignUpPage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/signin" element={
                  <>
                    <Navigation />
                    <main>
                      <SignInPage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/portal" element={
                  <>
                    <Navigation />
                    <main>
                      <PortalPage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/terms" element={
                  <>
                    <Navigation />
                    <main>
                      <TermsPage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/privacy" element={
                  <>
                    <Navigation />
                    <main>
                      <PrivacyPage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/compliance" element={
                  <>
                    <Navigation />
                    <main>
                      <CompliancePage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/disclosure-examples" element={
                  <>
                    <Navigation />
                    <main>
                      <DisclosureExamplesPage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/onboarding" element={
                  <>
                    <Navigation />
                    <main>
                      <OnboardingPage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/modal-demo" element={
                  <>
                    <Navigation />
                    <main>
                      <ModalDemoPage />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/pitch" element={
                  <>
                    <main>
                      <PitchPage />
                    </main>
                  </>
                } />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardOverview /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/payroll" element={<ProtectedRoute><DashboardLayout><PayrollPage /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/employees" element={<ProtectedRoute><DashboardLayout><EmployeesPage /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/services" element={<ProtectedRoute><DashboardLayout><ServicesPage /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/advisory" element={<ProtectedRoute><DashboardLayout><AdvisoryPage /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/payments" element={<ProtectedRoute><DashboardLayout><PaymentsPage /></DashboardLayout></ProtectedRoute>} />
                <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminProtectedRoute><AdminLayout><AdminOverview /></AdminLayout></AdminProtectedRoute>} />
                <Route path="/admin/clients" element={<AdminProtectedRoute><AdminLayout><AdminClients /></AdminLayout></AdminProtectedRoute>} />
                <Route path="/admin/compliance" element={<AdminProtectedRoute><AdminLayout><AdminCompliance /></AdminLayout></AdminProtectedRoute>} />
                <Route path="/admin/advisory" element={<AdminProtectedRoute><AdminLayout><AdminAdvisory /></AdminLayout></AdminProtectedRoute>} />
              </Routes>
            </div>
          </BrowserRouter>
        </AdminDataProvider>
      </AdminProvider>
    </UserProvider>
  );
}

export default App;