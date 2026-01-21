# 🧪 CLEVIO Manual QA Checklist

**Purpose:** Verify all features work end-to-end before production deployment  
**Time Required:** 2-3 hours  
**Tester:** ___________________  
**Date:** ___________________  

---

## **🚀 SETUP**

### **Prerequisites**
```bash
# Terminal 1 - Start Backend
cd /home/leo/Project/CLEVIO/figma/server
npm run dev

# Terminal 2 - Start Frontend
cd /home/leo/Project/CLEVIO/figma
npm run dev

# Browser
# Open: http://localhost:5173
# Open DevTools (F12)
```

**Verify Startup:**
- [ ] Backend console shows: `Server running on port 3001`
- [ ] Backend console shows: `JWT_SECRET validated ✅`
- [ ] Frontend loads without errors
- [ ] No console errors in browser DevTools

---

## **1. AUTHENTICATION FLOW** (15 minutes)

### **1.1 User Signup**
- [ ] **Navigate** to http://localhost:5173
- [ ] **Click** "Sign Up" or "Get Started"
- [ ] **Fill form:**
  - Email: `test1@qatest.com`
  - Password: `Test123!`
  - First Name: `QA`
  - Last Name: `Tester`
  - Company Name: `QA Test Company`
- [ ] **Submit** form
- [ ] **Verify:** Success message appears
- [ ] **Verify:** Message says "Check backend console for OTP"

### **1.2 OTP Verification**
- [ ] **Check** Terminal 1 (backend)
- [ ] **Find** OTP code (6 digits) in console logs
- [ ] **Copy** OTP code: `______`
- [ ] **Enter** OTP in frontend
- [ ] **Submit**
- [ ] **Verify:** Redirects to `/dashboard`
- [ ] **Verify:** Dashboard loads

### **1.3 JWT Token Storage**
- [ ] **Open** DevTools → Application → Local Storage
- [ ] **Verify** keys exist:
  - [ ] `authToken` (starts with `eyJ...`)
  - [ ] `userEmail` = `test1@qatest.com`
  - [ ] `userLoggedIn` = `true`
- [ ] **Copy** authToken for later: `_______________`

### **1.4 API Calls with JWT**
- [ ] **Open** DevTools → Network tab
- [ ] **Click** any dashboard menu item (e.g., "Company")
- [ ] **Find** API call in Network tab
- [ ] **Click** request → **Headers** tab
- [ ] **Verify:** `Authorization: Bearer eyJ...` header present ✅

### **1.5 Logout**
- [ ] **Click** "Logout" button
- [ ] **Verify:** Redirects to home page
- [ ] **Check** Local Storage
- [ ] **Verify:** `authToken` deleted ✅
- [ ] **Verify:** `userLoggedIn` = false or deleted

### **1.6 Login (Existing User)**
- [ ] **Click** "Sign In"
- [ ] **Enter:**
  - Email: `test1@qatest.com`
  - Password: `Test123!`
- [ ] **Submit**
- [ ] **Check** backend console for OTP
- [ ] **Enter** OTP
- [ ] **Verify:** Logged in successfully
- [ ] **Verify:** New JWT token stored

---

## **2. SECURITY TESTING** (10 minutes)

### **2.1 Unauthorized Access - No Token**
- [ ] **Delete** `authToken` from Local Storage
- [ ] **Try** to visit: http://localhost:5173/dashboard
- [ ] **Verify:** Redirects to `/signin` ✅

### **2.2 Unauthorized Access - Invalid Token**
- [ ] **Set** `authToken` = `invalid-fake-token`
- [ ] **Try** to visit: http://localhost:5173/dashboard  
- [ ] **Verify:** Redirects to `/signin` or shows error ✅

### **2.3 Direct API Call - No Token**
```bash
curl http://localhost:3001/api/user/me
```
- [ ] **Verify:** Returns `401 Unauthorized` ✅
- [ ] **Verify:** Message: "No token provided"

### **2.4 Direct API Call - Invalid Token**
```bash
curl http://localhost:3001/api/user/me \
  -H "Authorization: Bearer invalid-token"
```
- [ ] **Verify:** Returns `401 Unauthorized` ✅
- [ ] **Verify:** Message: "Invalid token"

### **2.5 Direct API Call - Valid Token**
```bash
# Use token from step 1.3
curl http://localhost:3001/api/user/me \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```
- [ ] **Verify:** Returns `200 OK` ✅
- [ ] **Verify:** Returns user data

---

## **3. COMPANY PROFILE** (10 minutes)

- [ ] **Login** as `test1@qatest.com`
- [ ] **Navigate** to "Company" page
- [ ] **Verify:** Form shows "Complete Your Company Profile"

### **3.1 Create Company Profile**
- [ ] **Fill:**
  - Company Name: `QA Test Company`
  - EIN: `12-3456789`
  - Address: `123 Test St`
  - City: `TestCity`
  - State: `CA`
  - ZIP: `90210`
  - Phone: `555-1234`
- [ ] **Click** "Save"
- [ ] **Verify:** Success toast appears
- [ ] **Verify:** Form shows saved data

### **3.2 Update Company Profile**
- [ ] **Change** Phone to `555-9999`
- [ ] **Click** "Save"
- [ ] **Verify:** Success toast
- [ ] **Refresh** page (F5)
- [ ] **Verify:** Phone = `555-9999` (persists)

---

## **4. TEAM MANAGEMENT** (15 minutes)

- [ ] **Navigate** to "Employees & Contractors"
- [ ] **Verify:** Shows empty state or existing employees

### **4.1 Add Employee**
- [ ] **Click** "Add Team Member"
- [ ] **Fill:**
  - Full Name: `John Doe`
  - Email: `john@test.com`
  - Type: `Employee`
  - Salary: `75000`
  - Bank Name: `Test Bank`
  - Routing: `123456789`
  - Account Last 4: `1234`
  - SSN Last 4: `5678`
- [ ] **Click** "Add"
- [ ] **Verify:** John Doe appears in list
- [ ] **Verify:** Status = Active

### **4.2 Add 4 More Employees**
*Note: Need 5+ for Advisory/Payroll features*

- [ ] Add `Jane Smith` (Employee, $80000)
- [ ] Add `Bob Johnson` (Employee, $70000)
- [ ] Add `Alice Williams` (Contractor, $65000)
- [ ] Add `Charlie Brown` (Employee, $85000)
- [ ] **Verify:** 5 total team members shown

### **4.3 Edit Employee**
- [ ] **Click** Edit on `John Doe`
- [ ] **Change** Salary to `78000`
- [ ] **Save**
- [ ] **Verify:** Salary updated

### **4.4 Delete Employee**
- [ ] **Click** Delete on `Charlie Brown`
- [ ] **Confirm** deletion
- [ ] **Verify:** Charlie removed from list
- [ ] **Verify:** 4 team members remain

---

## **5. SUBSCRIPTIONS & TIERS** (15 minutes)

- [ ] **Navigate** to "Services & Subscriptions"
- [ ] **Verify:** Shows 3 service toggles

### **5.1 Enable Payroll**
- [ ] **Toggle** "Payroll Services" **ON**
- [ ] **Verify:** Success message
- [ ] **Verify:** Shows "6-month commitment" notice
- [ ] **Check** Network tab → Request has `Bearer` token ✅

### **5.2 Try to Disable Payroll Immediately**
- [ ] **Toggle** "Payroll Services" **OFF**
- [ ] **Verify:** Error message appears ✅
- [ ] **Verify:** Message mentions "6-month commitment"
- [ ] **Verify:** Toggle stays **ON** (cannot disable)

### **5.3 Enable Tax Services**
- [ ] **Toggle** "Tax Services" **ON**
- [ ] **Verify:** Success message
- [ ] **Verify:** Both Payroll and Tax now ON

### **5.4 Enable Advisory**
- [ ] **Toggle** "Advisory Services" **ON**
- [ ] **Verify:** Success message
- [ ] **Verify:** All three services ON

### **5.5 Disable Tax (No Commitment)**
- [ ] **Toggle** "Tax Services" **OFF**
- [ ] **Verify:** Can disable immediately (no commitment) ✅
- [ ] **Verify:** Tax turns OFF

---

## **6. PAYROLL SCHEDULING** (10 minutes)

- [ ] **Navigate** to "Payroll"
- [ ] **Verify:** Shows scheduling options

### **6.1 Set Weekly Schedule**
- [ ] **Select** Frequency: `Weekly`
- [ ] **Select** Day of Week: `Friday`
- [ ] **Click** "Save Schedule"
- [ ] **Verify:** Success message
- [ ] **Verify:** Shows "Next Payroll: [date]"

### **6.2 Change to Biweekly**
- [ ] **Select** Frequency: `Biweekly`
- [ ] **Select** Day: `Friday`
- [ ] **Save**
- [ ] **Verify:** Next payroll date updates

### **6.3 View Upcoming Payroll**
- [ ] **Check** "Upcoming Payroll" section
- [ ] **Verify:** Shows payroll date
- [ ] **Verify:** Shows employee count (should match team)
- [ ] **Verify:** Shows total amount estimate

### **6.4 Run Payroll (Mock)**
*Note: Requires AMEX card*
- [ ] **Click** "Run Payroll" (if available)
- [ ] **If blocked:** Verify error about missing payment method ✅

---

## **7. ADVISORY SESSIONS** (10 minutes)

- [ ] **Navigate** to "Advisory Sessions"

### **7.1 Test Business Rule (< 5 Team Members)**
*Skip if you already have 5+ members*
- [ ] **With < 5 team members:**
- [ ] **Try** to book session
- [ ] **Verify:** Error: "Requires 5+ team members" ✅

### **7.2 Add Team Members (If Needed)**
- [ ] **Add employees** until you have 5+
- [ ] **Go back** to Advisory

### **7.3 Book Advisory Session**
- [ ] **Click** "Book Session" or "Schedule"
- [ ] **Fill:**
  - Type: `Tax Advisory`
  - Date: [Future date]
  - Time: `2:00 PM`
  - Duration: `60` minutes
- [ ] **Submit**
- [ ] **Verify:** Session appears in list
- [ ] **Verify:** Status = "Scheduled"

### **7.4 View Sessions**
- [ ] **Check** sessions list
- [ ] **Verify:** Shows session details
- [ ] **Verify:** Date/time correct

---

## **8. PAYMENT METHODS (AMEX)** (5 minutes)

- [ ] **Navigate** to "Payments" or "Billing"

### **8.1 Add AMEX Card**
- [ ] **Click** "Add Card" or "Connect AMEX"
- [ ] **Fill:**
  - Card Number: `4111 1111 1111 1111` (test)
  - Card Name: `QA Test Card`
  - Expiry Month: `12`
  - Expiry Year: `2026`
- [ ] **Save**
- [ ] **Verify:** Card appears
- [ ] **Verify:** Last 4: `1111`
- [ ] **Verify:** Status = Connected

### **8.2 Update Card**
- [ ] **Edit** card
- [ ] **Change** Card Name to `Updated Test Card`
- [ ] **Save**
- [ ] **Verify:** Name updated

---

## **9. BILLING HISTORY** (5 minutes)

- [ ] **Navigate** to "Billing History"
- [ ] **Verify:** Shows history (may be empty for new account)
- [ ] **If empty:** Note "No transactions yet" ✅

---

## **10. NOTIFICATION PREFERENCES** (5 minutes)

- [ ] **Navigate** to "Notifications" or "Settings"
- [ ] **Verify:** Shows preference toggles

### **10.1 Update Preferences**
- [ ] **Toggle** "Payroll Reminders" OFF
- [ ] **Toggle** "Advisory Reminders" ON
- [ ] **Toggle** "Payment Confirmations" ON
- [ ] **Toggle** "Monthly Reports" OFF
- [ ] **Save**
- [ ] **Verify:** Success message
- [ ] **Refresh** page
- [ ] **Verify:** Settings persisted

---

## **11. NAVIGATION & UX** (10 minutes)

### **11.1 Menu Navigation**
- [ ] **Click** each menu item
- [ ] **Verify:** Each page loads without errors
- [ ] **Verify:** No console errors
- [ ] **Verify:** Breadcrumbs/titles correct

### **11.2 Back Button**
- [ ] **Navigate** through pages
- [ ] **Use** browser back button
- [ ] **Verify:** Navigation works correctly

### **11.3 Direct URL Access**
- [ ] **While logged in**, visit directly:
  - [ ] http://localhost:5173/dashboard/company
  - [ ] http://localhost:5173/dashboard/team
  - [ ] http://localhost:5173/dashboard/payroll
- [ ] **Verify:** Each loads correctly

### **11.4 Logged Out URL Access**
- [ ] **Logout**
- [ ] **Try** to visit: http://localhost:5173/dashboard
- [ ] **Verify:** Redirects to `/signin` ✅

---

## **12. ERROR HANDLING** (10 minutes)

### **12.1 Network Error Simulation**
- [ ] **Login**
- [ ] **Open** DevTools → Network → Throttling
- [ ] **Set** to "Offline"
- [ ] **Try** to save company profile
- [ ] **Verify:** Error message appears
- [ ] **Verify:** User-friendly error (not crash)
- [ ] **Set** back to "Online"

### **12.2 Invalid Data**
- [ ] **Try** to add employee with:
  - Invalid email: `not-an-email`
  - **Verify:** Validation error ✅
- [ ] **Try** to set payroll with:
  - Invalid date
  - **Verify:** Validation error ✅

### **12.3 Session Expiry**
*Note: Token expires in 7 days*
- [ ] **Manually edit** `authToken` in Local Storage
- [ ] **Change** one character
- [ ] **Try** to navigate
- [ ] **Verify:** Gets 401 and redirects to login ✅

---

## **13. MULTI-USER TESTING** (10 minutes)

### **13.1 Create Second User**
- [ ] **Open** Incognito/Private window
- [ ] **Visit** http://localhost:5173
- [ ] **Signup** as `test2@qatest.com`
- [ ] **Complete** OTP verification

### **13.2 Verify Data Isolation**
- [ ] **In User 1:** Add employee "Test Employee 1"
- [ ] **In User 2:** Check team list
- [ ] **Verify:** User 2 does NOT see User 1's employee ✅
- [ ] **Verify:** Each user sees only their own data

---

## **14. PERFORMANCE** (5 minutes)

### **14.1 Load Times**
- [ ] **Refresh** dashboard
- [ ] **Time:** _____ seconds (should be < 3s)
- [ ] **Check** Network tab → All XHR requests
- [ ] **Verify:** Most requests < 1s

### **14.2 Large Data**
- [ ] **Add** 10+ employees
- [ ] **Navigate** to team page
- [ ] **Verify:** Loads without lag
- [ ] **Verify:** Scrolling smooth

---

## **15. BROWSER COMPATIBILITY** (Optional, 15 minutes)

**Test in multiple browsers:**

### **Chrome**
- [ ] All features work
- [ ] No console errors

### **Firefox**
- [ ] All features work
- [ ] No console errors

### **Safari** (if Mac)
- [ ] All features work
- [ ] No console errors

### **Edge**
- [ ] All features work
- [ ] No console errors

---

## **16. MOBILE RESPONSIVENESS** (Optional, 10 minutes)

- [ ] **Open** DevTools → Device toolbar (Ctrl+Shift+M)
- [ ] **Select** device: iPhone 12 Pro
- [ ] **Test:**
  - [ ] Login works
  - [ ] Dashboard loads
  - [ ] Navigation menu works
  - [ ] Forms are usable
  - [ ] Buttons are clickable

---

## **📊 SUMMARY**

### **Results**
- **Total Checks:** 150+
- **Passed:** _____ / _____
- **Failed:** _____ / _____
- **Blocked:** _____ / _____

### **Critical Issues Found**
1. ___________________________________
2. ___________________________________
3. ___________________________________

### **Minor Issues Found**
1. ___________________________________
2. ___________________________________
3. ___________________________________

### **Notes**
_________________________________________
_________________________________________
_________________________________________

---

## **✅ SIGN-OFF**

**QA Tester:** ___________________  
**Date:** ___________________  
**Signature:** ___________________  

**Status:**
- [ ] ✅ **APPROVED** - Ready for production
- [ ] ⚠️ **APPROVED WITH NOTES** - Minor issues, can deploy
- [ ] ❌ **REJECTED** - Critical issues, cannot deploy

**Recommendation:**
_________________________________________
_________________________________________

---

## **🎯 PASS CRITERIA**

**To approve for production:**
- ✅ 0 critical bugs
- ✅ < 5 minor bugs
- ✅ All authentication flows work
- ✅ JWT tokens working properly
- ✅ Business rules enforced
- ✅ Data isolation verified
- ✅ No security vulnerabilities found

**If ANY critical bug found → REJECTED**

