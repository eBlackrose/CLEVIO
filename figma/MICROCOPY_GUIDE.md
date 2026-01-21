# CLEVIO Microcopy System Guide

## Overview

This microcopy system maintains CLEVIO's brand voice across all user touchpoints. Every piece of copy reinforces **trust, clarity, and control**.

## Core Principles

### 1. Calm & Professional
- **Never alarmist** - No red warning states for routine information
- **Never pushy** - No urgency tactics or FOMO language
- **Always measured** - Professional tone without being cold

### 2. Clear & Specific
- **Explain the why** - Not just what, but why it matters
- **Provide context** - Help users understand their options
- **Be concrete** - Specific numbers, dates, and outcomes

### 3. Trust-Building
- **Acknowledge limitations** - "We cannot guarantee AMEX rewards" is more trustworthy than overpromising
- **Transparent about requirements** - Explain 6-month commitment honestly
- **Educational** - Teach users about payroll, taxes, and compliance

---

## Button Copy Examples

### ✅ Good - Specific & Action-Oriented
```typescript
"Create Secure Account"
"Confirm Payroll"
"Add AMEX Card"
"Schedule Advisory Session"
"Activate Services"
```

### ❌ Avoid - Vague or Salesy
```typescript
"Sign Up Now!" (too urgent)
"Get Started Today!" (generic)
"Submit" (unclear what happens)
"Click Here" (not descriptive)
"Unlock Premium Features!" (salesy)
```

---

## Error Messages

### Structure
Every error message has:
1. **What happened** (clear, blame-free explanation)
2. **How to fix it** (specific resolution steps)
3. **Optional action** (retry button, contact support, etc.)

### ✅ Good Examples

**Card Declined**
```
Message: "Your American Express card was declined"
Resolution: "This may be due to insufficient credit, card verification requirements, 
or AMEX security measures. Contact AMEX or use your backup payment method."
```

**Missing Employee Info**
```
Message: "[Employee Name] is missing direct deposit information"
Resolution: "Add their bank account and routing number in the employee profile, 
or contact them to provide this information."
```

**Session Expired**
```
Message: "Your session has expired for security"
Resolution: "Sign in again to continue. We automatically sign you out after 
2 hours of inactivity."
```

### ❌ Avoid - Blame Language or Unclear Fixes
```
"Error 401: Unauthorized"
"Invalid input"
"Something went wrong"
"Payment failed. Try again."
```

---

## Locked State Messages

When features are unavailable due to business rules, explain **why** and **what to do**.

### ✅ Good Examples

**Minimum Employees**
```
Title: "Add at least 5 employees to activate payroll"
Description: "CLEVIO services are designed for businesses with 5+ employees. 
This ensures our percentage-based pricing provides value for your business."
Action: "Add Employees"
```

**Service Tier Required**
```
Title: "Add Centurion Tax™ to schedule CPA consultations"
Description: "Strategic tax planning sessions are included with Centurion Tax™. 
Upgrade your service to work with a licensed CPA."
Action: "Add Tax Services"
```

**During Commitment Period**
```
Title: "This service is active during your commitment period"
Description: "You can modify or cancel this service after your 6-month commitment 
concludes on [DATE]. Early termination options are available if needed."
Action: "Contact Support"
```

### ❌ Avoid - Vague or Negative Framing
```
"Feature locked"
"Upgrade required"
"You don't have access to this"
"Premium only"
```

---

## Helper Text & Tooltips

### Helper Text (Always Visible)
Appears below form fields. Explains **what to enter** or **why it's needed**.

```typescript
Email: "Use your business email. You'll receive payroll confirmations 
and tax documents here."

EIN: "Your 9-digit Employer Identification Number from the IRS. 
Format: XX-XXXXXXX"

AMEX Card: "Enter your American Express business card number. 
Personal cards are not eligible."
```

### Tooltips (On Hover/Click)
Provide deeper context about **concepts** or **why we need something**.

```typescript
Service Fee: "Our service fee is a transparent percentage of your monthly 
payroll volume. The exact amount is calculated and shown before each payroll 
run. There are no hidden fees or per-employee charges."

AMEX Rewards: "Rewards earned are based on your American Express card agreement. 
CLEVIO does not control or guarantee specific earning rates, categories, or benefits."

Fiduciary Duty: "Fiduciary advisors are legally required to put your interests 
first. This is a higher standard than 'suitable' advice and ensures recommendations 
prioritize your benefit."
```

---

## Empty States

When a section has no content yet, **guide the user** to the next step.

### ✅ Good Structure

```
Title: Clear, action-oriented headline
Description: Brief explanation of what will appear here and why it's valuable
Action: Single, clear next step (or null if no action available)
```

**Example: No Employees Yet**
```
Title: "Add your first employee to get started"
Description: "You'll need at least 5 employees to run payroll through CLEVIO. 
Start by adding your team members with their compensation and tax information."
Action: "Add Employee"
```

**Example: All Caught Up**
```
Title: "You're all caught up"
Description: "We'll notify you here about payroll confirmations, upcoming 
deadlines, and important account updates."
Action: null
```

---

## Success Messages

Keep success messages **brief and specific** about what happened.

### ✅ Good Examples
```
"Employee added successfully. You can now include them in payroll runs."

"Payroll scheduled for March 15. We'll send a reminder 24 hours before processing."

"Your AMEX card has been verified and is ready for payroll processing."
```

### ❌ Avoid - Generic or Over-Enthusiastic
```
"Success!"
"Done!"
"Awesome! Everything worked!"
"You're all set! 🎉"
```

---

## Loading States

Tell users **what's happening** during processing.

### ✅ Good - Specific Activity
```
"Processing payroll..."
"Verifying your AMEX card..."
"Calculating federal and state taxes..."
"Generating your report..."
```

### ❌ Avoid - Vague or Cute
```
"Please wait..."
"Loading..."
"Hang tight!"
"Working our magic..."
```

---

## Confirmation Dialogs

Before **irreversible actions**, show:
1. **Clear title** - What they're about to do
2. **Detailed message** - Consequences and specifics
3. **Two buttons** - One to proceed, one to cancel

### ✅ Good Example: Process Payroll

```
Title: "Confirm payroll for March 15"
Message: "This will charge $87,450 to your AMEX card ending in 1009 and 
initiate direct deposits to 12 employees. Payroll cannot be modified after processing."
Confirm: "Confirm & Process Payroll"
Cancel: "Review Again"
```

### ✅ Good Example: Switch Payment Method

```
Title: "Use bank account for this payroll?"
Message: "Your AMEX card will not be charged for this payroll run. Your bank 
account ending in 4523 will be debited instead. You will not earn AMEX rewards 
on this transaction."
Confirm: "Use Bank Account"
Cancel: "Keep Using AMEX"
```

---

## Special Cases

### AMEX Rewards Disclaimers

Always clarify that **CLEVIO doesn't control AMEX rewards**.

**Tooltip**
```
"Rewards earned are based on your American Express card agreement. 
CLEVIO does not control or guarantee specific earning rates, categories, or benefits."
```

**Example Calculation Footer**
```
*Actual rewards depend on your American Express card's earning structure. 
This example assumes 1.5% earning rate. Some AMEX cards offer higher rates 
in specific categories or with annual spending bonuses.
```

### Commitment Period Language

Be **transparent and fair** about the 6-month commitment.

**Tooltip**
```
"All CLEVIO services require a 6-month minimum commitment. This allows us 
to provide consistent advisory support and ensures you receive the full benefit 
of our onboarding process."
```

**Early Termination**
```
"You may end service before 6 months by paying the remaining service fees 
through your commitment end date. Contact support to discuss options."
```

### Licensed Professional Credentials

Always mention **specific credentials** to build trust.

```
"Licensed CPAs maintain active state licenses, complete 40+ hours of annual 
continuing education, and carry professional liability insurance."

"CFP® professionals meet rigorous education, examination, experience, and 
ethics requirements."

"All professionals maintain appropriate state licensing and insurance coverage."
```

---

## Tone Guide by Context

### Onboarding
- **Welcoming** without being overly enthusiastic
- **Guiding** through each step clearly
- **Educational** about what's needed and why

```
Good: "Let's set up your account in about 10 minutes"
Avoid: "You're going to love this!"
```

### Errors
- **Factual** about what happened
- **Helpful** with specific solutions
- **Never blaming** the user

```
Good: "This payment date isn't available"
Avoid: "You selected an invalid date"
```

### Locked Features
- **Clear** about requirements
- **Fair** about why they exist
- **Actionable** next steps

```
Good: "Add at least 5 employees to activate payroll"
Avoid: "You need more employees"
```

### Success States
- **Specific** about what was accomplished
- **Next steps** if applicable
- **Brief** - don't oversell the win

```
Good: "Payroll processed. Employees will receive funds on March 15."
Avoid: "Amazing! Your payroll is complete!"
```

---

## Implementation Tips

### 1. Import from Central Source
```typescript
import { microcopy } from '@/utils/microcopy';

<button>{microcopy.buttons.confirmPayroll}</button>
```

### 2. Use Components for Consistency
```typescript
<ErrorMessage error={microcopy.errors.cardDeclined} />
<LockedState lockedState={microcopy.lockedStates.minimumEmployees} />
<Tooltip content={microcopy.tooltips.serviceFeePricing}>
```

### 3. Parameterize Dynamic Content
```typescript
const message = microcopy.success.payrollScheduled.replace('[DATE]', 'March 15');
```

### 4. Keep Copy in One Place
Never hardcode copy in components. Always reference the microcopy system so updates propagate everywhere.

---

## Review Checklist

Before adding new microcopy, ask:

- [ ] Is it **calm** without being cold?
- [ ] Is it **specific** without being overwhelming?
- [ ] Does it **explain why**, not just what?
- [ ] Is it **free of blame** language?
- [ ] Does it provide **clear next steps**?
- [ ] Is it **honest** about limitations?
- [ ] Would I want to read this if I were the user?

---

## Examples in Context

### Payroll Confirmation Flow

**Step 1: Review Screen**
```
Heading: "Review payroll for March 15"
Helper: "Check all amounts before processing. Payroll cannot be modified once confirmed."
Button: "Confirm & Process Payroll"
```

**Step 2: Confirmation Dialog**
```
Title: "Confirm payroll for March 15"
Message: "This will charge $87,450 to your AMEX card ending in 1009 and initiate 
direct deposits to 12 employees. Payroll cannot be modified after processing."
Confirm: "Confirm & Process Payroll"
Cancel: "Review Again"
```

**Step 3: Processing State**
```
Loading: "Processing payroll..."
```

**Step 4: Success**
```
Success: "Payroll processed successfully. Employees will receive funds on March 15. 
Your AMEX card has been charged."
```

### Error Recovery Flow

**Error Occurs**
```
Message: "Your American Express card was declined"
Resolution: "This may be due to insufficient credit, card verification requirements, 
or AMEX security measures. Contact AMEX or use your backup payment method."
```

**User Switches to Bank**
```
Title: "Use bank account for this payroll?"
Message: "Your AMEX card will not be charged for this payroll run. Your bank 
account ending in 4523 will be debited instead. You will not earn AMEX rewards 
on this transaction."
```

**Success with Bank**
```
Success: "Payroll processed via bank account. Employees will receive funds on March 15."
```

---

## Voice & Tone Summary

**CLEVIO sounds like:**
- A knowledgeable financial advisor
- Calm and measured
- Transparent about costs and commitments
- Educational without being condescending
- Professional without being stuffy

**CLEVIO never sounds like:**
- A salesperson pushing upgrades
- Alarmist about security or compliance
- Cute or overly casual
- Vague or evasive about fees
- Blame-oriented when things go wrong

This microcopy system ensures every interaction reinforces trust and professionalism.
