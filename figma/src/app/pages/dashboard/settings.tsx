import { useState, useEffect } from 'react';
import { Building, User, Bell, Shield, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../../contexts/user-context';

export function SettingsPage() {
  const { userData, updateUserData } = useUser();
  
  // Company Profile state
  const [companyProfile, setCompanyProfile] = useState({
    companyName: userData?.companyName || '',
    ein: userData?.ein || '',
    businessAddress: userData?.businessAddress || '',
  });
  const [companyProfileSaved, setCompanyProfileSaved] = useState(companyProfile);
  const [isCompanyProfileChanged, setIsCompanyProfileChanged] = useState(false);
  const [isCompanySaving, setIsCompanySaving] = useState(false);
  
  // Contact Information state
  const [contactInfo, setContactInfo] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
  });
  const [contactInfoSaved, setContactInfoSaved] = useState(contactInfo);
  const [isContactInfoChanged, setIsContactInfoChanged] = useState(false);
  const [isContactSaving, setIsContactSaving] = useState(false);
  
  // AMEX Card state
  const [amexCard, setAmexCard] = useState({
    last4: userData?.amexCard?.last4 || '',
    name: userData?.amexCard?.name || '',
  });
  const [amexCardSaved, setAmexCardSaved] = useState(amexCard);
  const [isAmexCardChanged, setIsAmexCardChanged] = useState(false);
  const [isAmexSaving, setIsAmexSaving] = useState(false);
  const [isEditingAmex, setIsEditingAmex] = useState(false);
  
  // Sync with userData when it changes
  useEffect(() => {
    if (userData) {
      const newCompanyProfile = {
        companyName: userData.companyName || '',
        ein: userData.ein || '',
        businessAddress: userData.businessAddress || '',
      };
      const newContactInfo = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
      };
      const newAmexCard = {
        last4: userData.amexCard?.last4 || '',
        name: userData.amexCard?.name || '',
      };
      
      setCompanyProfile(newCompanyProfile);
      setCompanyProfileSaved(newCompanyProfile);
      setContactInfo(newContactInfo);
      setContactInfoSaved(newContactInfo);
      setAmexCard(newAmexCard);
      setAmexCardSaved(newAmexCard);
    }
  }, [userData]);
  
  // Check if company profile changed
  useEffect(() => {
    const changed = JSON.stringify(companyProfile) !== JSON.stringify(companyProfileSaved);
    setIsCompanyProfileChanged(changed);
  }, [companyProfile, companyProfileSaved]);
  
  // Check if contact info changed
  useEffect(() => {
    const changed = JSON.stringify(contactInfo) !== JSON.stringify(contactInfoSaved);
    setIsContactInfoChanged(changed);
  }, [contactInfo, contactInfoSaved]);
  
  // Check if AMEX card changed
  useEffect(() => {
    const changed = JSON.stringify(amexCard) !== JSON.stringify(amexCardSaved);
    setIsAmexCardChanged(changed);
  }, [amexCard, amexCardSaved]);
  
  // Validation helpers
  const isEINValid = (ein: string): boolean => {
    const digits = ein.replace(/\D/g, '');
    return digits.length === 9;
  };
  
  const isPhoneValid = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10;
  };
  
  const formatEIN = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    }
    return digits;
  };
  
  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    return digits;
  };
  
  // Required field checks
  const isCompanyProfileComplete = companyProfile.companyName && 
                                   companyProfile.ein && 
                                   isEINValid(companyProfile.ein) &&
                                   companyProfile.businessAddress;
  
  const isContactInfoComplete = contactInfo.phone && isPhoneValid(contactInfo.phone);
  
  const handleCompanyProfileSave = async () => {
    // Validation before save
    if (!companyProfile.ein || !isEINValid(companyProfile.ein)) {
      toast.error('Please enter a valid 9-digit EIN');
      return;
    }
    
    if (!companyProfile.businessAddress) {
      toast.error('Please enter your business address');
      return;
    }
    
    setIsCompanySaving(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('authToken');
      const userEmail = localStorage.getItem('userEmail');
      
      const response = await fetch(`${apiUrl}/api/company`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userEmail,
          name: companyProfile.companyName,
          ein: companyProfile.ein.replace(/\D/g, ''),
          businessAddress: companyProfile.businessAddress,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update company profile');
      }
      
      // Update local user data
      updateUserData({
        companyName: companyProfile.companyName,
        ein: companyProfile.ein,
        businessAddress: companyProfile.businessAddress,
      });
      
      // Mark as saved
      setCompanyProfileSaved(companyProfile);
      setIsCompanyProfileChanged(false);
      
      // Show success toast
      toast.success('Company profile updated successfully');
    } catch (error: any) {
      console.error('Error saving company profile:', error);
      toast.error(error.message || 'Failed to update company profile');
    } finally {
      setIsCompanySaving(false);
    }
  };
  
  const handleContactInfoSave = async () => {
    // Validation before save
    if (contactInfo.phone && !isPhoneValid(contactInfo.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    setIsContactSaving(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('authToken');
      const userEmail = localStorage.getItem('userEmail');
      
      const response = await fetch(`${apiUrl}/api/company`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userEmail,
          phone: contactInfo.phone?.replace(/\D/g, ''),
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update contact information');
      }
      
      // Update local user data
      updateUserData({
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone,
      });
      
      // Mark as saved
      setContactInfoSaved(contactInfo);
      setIsContactInfoChanged(false);
      
      // Show success toast
      toast.success('Contact information updated successfully');
    } catch (error: any) {
      console.error('Error saving contact info:', error);
      toast.error(error.message || 'Failed to update contact information');
    } finally {
      setIsContactSaving(false);
    }
  };
  
  const handleAmexCardSave = async () => {
    setIsAmexSaving(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${apiUrl}/api/payments/amex`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          last4: amexCard.last4,
          cardName: amexCard.name,
          token: 'mock_token', // In production, use real Stripe/AMEX token
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update payment method');
      }
      
      // Update local user data
      updateUserData({
        amexCard: {
          last4: amexCard.last4,
          name: amexCard.name,
        },
      });
      
      // Mark as saved
      setAmexCardSaved(amexCard);
      setIsAmexCardChanged(false);
      setIsEditingAmex(false);
      
      // Show success toast
      toast.success('AMEX card details updated successfully');
    } catch (error: any) {
      console.error('Error saving AMEX card:', error);
      toast.error(error.message || 'Failed to update payment method');
    } finally {
      setIsAmexSaving(false);
    }
  };
  
  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        
        <div className="space-y-6">
          {/* Company Profile */}
          <div className="p-8 bg-card border border-border rounded-xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <Building className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-xl mb-1">Company Profile</h3>
                  <p className="text-sm text-muted-foreground">Your business information</p>
                </div>
              </div>
              {!isCompanyProfileComplete && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-yellow-600">Incomplete</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyProfile.companyName}
                  onChange={(e) => setCompanyProfile(prev => ({ ...prev, companyName: e.target.value }))}
                  className={`w-full px-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    !companyProfile.companyName ? 'border-red-500/30' : 'border-border'
                  }`}
                  placeholder="Your Company Inc."
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">
                  EIN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyProfile.ein}
                  onChange={(e) => setCompanyProfile(prev => ({ ...prev, ein: formatEIN(e.target.value) }))}
                  className={`w-full px-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    !companyProfile.ein || !isEINValid(companyProfile.ein) ? 'border-red-500/30' : 'border-border'
                  }`}
                  placeholder="XX-XXXXXXX"
                  maxLength={10}
                />
                {!companyProfile.ein ? (
                  <p className="mt-1 text-xs text-red-500">EIN required for tax compliance</p>
                ) : !isEINValid(companyProfile.ein) ? (
                  <p className="mt-1 text-xs text-red-500">Must be 9 digits (XX-XXXXXXX)</p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">Format: XX-XXXXXXX (9 digits)</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm mb-2">
                  Business Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyProfile.businessAddress}
                  onChange={(e) => setCompanyProfile(prev => ({ ...prev, businessAddress: e.target.value }))}
                  className={`w-full px-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    !companyProfile.businessAddress ? 'border-red-500/30' : 'border-border'
                  }`}
                  placeholder="123 Main Street, San Francisco, CA 94102"
                />
                {!companyProfile.businessAddress && (
                  <p className="mt-1 text-xs text-red-500">Full business address required</p>
                )}
              </div>
            </div>
            
            <button
              onClick={handleCompanyProfileSave}
              disabled={!isCompanyProfileChanged || isCompanySaving}
              className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
            >
              {isCompanySaving ? 'Saving...' : 'Save Changes'}
            </button>
            
            {!isCompanyProfileChanged && !isCompanySaving && companyProfile.companyName && (
              <p className="mt-3 text-sm text-green-600">
                ✓ All changes saved
              </p>
            )}
          </div>
          
          {/* Contact Information */}
          <div className="p-8 bg-card border border-border rounded-xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <User className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-xl mb-1">Contact Information</h3>
                  <p className="text-sm text-muted-foreground">Your personal details</p>
                </div>
              </div>
              {!isContactInfoComplete && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-yellow-600">Incomplete</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">First Name</label>
                <input
                  type="text"
                  value={contactInfo.firstName}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="John"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Last Name</label>
                <input
                  type="text"
                  value={contactInfo.lastName}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="john@company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                  className={`w-full px-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    !contactInfo.phone || !isPhoneValid(contactInfo.phone) ? 'border-red-500/30' : 'border-border'
                  }`}
                  placeholder="(555) 123-4567"
                  maxLength={14}
                />
                {!contactInfo.phone ? (
                  <p className="mt-1 text-xs text-red-500">Phone number required</p>
                ) : !isPhoneValid(contactInfo.phone) ? (
                  <p className="mt-1 text-xs text-red-500">Must be 10 digits (XXX) XXX-XXXX</p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">Format: (XXX) XXX-XXXX</p>
                )}
              </div>
            </div>
            
            <button
              onClick={handleContactInfoSave}
              disabled={!isContactInfoChanged || isContactSaving}
              className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
            >
              {isContactSaving ? 'Saving...' : 'Save Changes'}
            </button>
            
            {!isContactInfoChanged && !isContactSaving && contactInfo.firstName && (
              <p className="mt-3 text-sm text-green-600">
                ✓ All changes saved
              </p>
            )}
          </div>
          
          {/* AMEX Card */}
          <div className="p-8 bg-card border border-border rounded-xl">
            <div className="flex items-start gap-4 mb-6">
              <CreditCard className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-xl mb-1">AMEX Card</h3>
                <p className="text-sm text-muted-foreground">Manage your AMEX card for payroll processing</p>
              </div>
            </div>
            
            {amexCard.last4 ? (
              <div className="mb-6 p-6 bg-accent rounded-lg">
                <div className="flex items-center gap-4">
                  <CreditCard className="w-10 h-10 text-primary" />
                  <div className="flex-1">
                    <div className="mb-1">American Express</div>
                    <div className="text-sm text-muted-foreground">
                      •••• •••• •••• {amexCard.last4}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {amexCard.name}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-6 bg-accent border border-dashed border-border rounded-lg text-center">
                <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No AMEX card on file</p>
              </div>
            )}
            
            {isEditingAmex ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={amexCard.name}
                      onChange={(e) => setAmexCard(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Last 4 Digits</label>
                    <input
                      type="text"
                      value={amexCard.last4}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setAmexCard(prev => ({ ...prev, last4: value }));
                      }}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="1234"
                      maxLength={4}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditingAmex(false);
                      setAmexCard(amexCardSaved);
                    }}
                    className="px-6 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAmexCardSave}
                    disabled={!isAmexCardChanged || isAmexSaving}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                  >
                    {isAmexSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setIsEditingAmex(true)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
              >
                {amexCard.last4 ? 'Update Card Details' : 'Add AMEX Card'}
              </button>
            )}
            
            {!isEditingAmex && !isAmexCardChanged && !isAmexSaving && amexCard.last4 && (
              <p className="mt-3 text-sm text-green-600">
                ✓ Card details saved
              </p>
            )}
          </div>
          
          {/* Notification Preferences */}
          <div className="p-8 bg-card border border-border rounded-xl">
            <div className="flex items-start gap-4 mb-6">
              <Bell className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-xl mb-1">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">Manage how you receive updates</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Payroll reminders', desc: 'Get notified before payroll runs' },
                { label: 'Advisory session reminders', desc: 'Reminders 24 hours before sessions' },
                { label: 'Payment confirmations', desc: 'Confirmation when payments are processed' },
                { label: 'Monthly reports', desc: 'Monthly financial summaries' },
              ].map((item, i) => (
                <label key={i} className="flex items-center justify-between p-4 bg-accent rounded-lg cursor-pointer hover:bg-accent/70 transition-colors">
                  <div>
                    <div className="mb-1">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              ))}
            </div>
          </div>
          
          {/* Security */}
          <div className="p-8 bg-card border border-border rounded-xl">
            <div className="flex items-start gap-4 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-xl mb-1">Security & Authentication</h3>
                <p className="text-sm text-muted-foreground">Manage your account security</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <button className="w-full p-4 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all text-left">
                <div className="mb-1">Change Password</div>
                <div className="text-sm text-muted-foreground">Update your account password</div>
              </button>
              
              <button className="w-full p-4 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all text-left">
                <div className="mb-1">Enable Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
              </button>
              
              <button className="w-full p-4 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all text-left">
                <div className="mb-1">Active Sessions</div>
                <div className="text-sm text-muted-foreground">View and manage logged-in devices</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
