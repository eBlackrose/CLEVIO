# CLEVIO Employee Data Persistence

## Issue Resolution

**Problem**: Employee data entered during onboarding (Step 3) was not being saved. After completing signup, users would see 3 generic placeholder employees instead of the actual team members they had entered during onboarding.

**Solution**: Implemented full employee data persistence from onboarding through to the dashboard using the centralized User Context system with localStorage.

---

## Architecture

### Data Flow

```
Onboarding Step 3 (Add Employees)
    ↓
Employee Context (UserContext)
    ↓
localStorage (Persistent)
    ↓
Dashboard Employees Page (Auto-populated)
```

---

## Implementation Details

### 1. Extended User Context

**File**: `/src/app/contexts/user-context.tsx`

**Added Employee Interface**:
```typescript
interface Employee {
  id: string;
  name: string;
  email: string;
  type: 'employee' | 'contractor';
  bankStatus?: 'connected' | 'pending';
  payrollStatus?: 'active' | 'inactive';
}
```

**Extended UserData Interface**:
```typescript
interface UserData {
  companyName: string;
  email: string;
  firstName: string;
  lastName: string;
  ein?: string;
  businessAddress?: string;
  phone?: string;
  employees?: Employee[];          // NEW
  amexCard?: {                     // NEW
    last4: string;
    name: string;
  };
  selectedTiers?: {                // NEW
    payroll: boolean;
    tax: boolean;
    advisory: boolean;
  };
}
```

---

### 2. Onboarding Page Updates

**File**: `/src/app/pages/onboarding.tsx`

**Key Changes**:

1. **Import User Context**:
```typescript
import { useUser } from '../contexts/user-context';
const { updateUserData } = useUser();
```

2. **Save Employee Data on Completion**:
```typescript
const completeOnboarding = () => {
  // Save all onboarding data to user context
  updateUserData({
    employees: employees.map(emp => ({
      ...emp,
      bankStatus: 'pending' as const,
      payrollStatus: 'inactive' as const,
    })),
    amexCard: {
      last4: amexData.cardNumber.slice(-4),
      name: amexData.name,
    },
    selectedTiers,
  });
  
  // Navigate to dashboard
  navigate('/dashboard');
};
```

**What Gets Saved**:
- All 5+ employees with their names, emails, and types
- Each employee automatically assigned:
  - `bankStatus: 'pending'` (needs to connect bank account)
  - `payrollStatus: 'inactive'` (not yet active on payroll)
- AMEX card last 4 digits and cardholder name
- Selected service tiers (Payroll, Tax, Advisory)

---

### 3. Employees Page Updates

**File**: `/src/app/pages/dashboard/employees.tsx`

**Key Changes**:

1. **Import User Context**:
```typescript
import { useUser } from '../../contexts/user-context';
const { userData, updateUserData } = useUser();
```

2. **Initialize from Saved Data**:
```typescript
const [employees, setEmployees] = useState<Employee[]>([]);

// Sync with userData on mount and when userData changes
useEffect(() => {
  if (userData?.employees && userData.employees.length > 0) {
    setEmployees(userData.employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      type: emp.type,
      bankStatus: emp.bankStatus || 'pending',
      payrollStatus: emp.payrollStatus || 'inactive',
    })));
  }
}, [userData]);
```

3. **Save New Employees to Context**:
```typescript
const handleAddEmployee = (e: React.FormEvent) => {
  e.preventDefault();
  const employee: Employee = {
    id: Date.now().toString(),
    name: newEmployee.name,
    email: newEmployee.email,
    type: newEmployee.type,
    bankStatus: 'pending',
    payrollStatus: 'inactive',
  };
  const updatedEmployees = [...employees, employee];
  setEmployees(updatedEmployees);
  
  // Save to user context
  updateUserData({ employees: updatedEmployees });
  
  setNewEmployee({ name: '', type: 'employee', email: '', bankAccount: '' });
  setIsAddingEmployee(false);
};
```

---

## Complete User Journey

### Step-by-Step Flow

**Day 1: Onboarding**

1. User completes signup → reaches onboarding
2. **Step 1**: Welcome screen → Continue
3. **Step 2**: Enter AMEX card details → Continue
4. **Step 3**: Add team members:
   ```
   Employee 1: "Sarah Johnson" (sarah@acme.com) - Employee
   Employee 2: "Michael Chen" (michael@acme.com) - Contractor  
   Employee 3: "Emily Rodriguez" (emily@acme.com) - Employee
   Employee 4: "David Kim" (david@acme.com) - Employee
   Employee 5: "Lisa Park" (lisa@acme.com) - Contractor
   ```
   - Counter shows: "5 of 5 added"
   - Green checkmark appears
   - Continue button activates
5. **Step 4**: Select service tiers → Complete Setup
6. **Saved to localStorage**:
   ```json
   {
     "companyName": "Acme Corporation",
     "email": "john@acme.com",
     "firstName": "John",
     "lastName": "Doe",
     "employees": [
       {
         "id": "1640000001",
         "name": "Sarah Johnson",
         "email": "sarah@acme.com",
         "type": "employee",
         "bankStatus": "pending",
         "payrollStatus": "inactive"
       },
       // ... 4 more employees
     ],
     "amexCard": {
       "last4": "0126",
       "name": "John Doe"
     },
     "selectedTiers": {
       "payroll": true,
       "tax": true,
       "advisory": false
     }
   }
   ```

**Day 1 (Later): Dashboard Visit**

1. User navigates to `/dashboard/employees`
2. **Page loads employee data from localStorage**
3. **Display shows**:
   - ✅ "Minimum Requirement Met" (green banner)
   - "You have 5 team members. Services are now available."
   - Table/cards showing all 5 employees with:
     - Names from onboarding
     - Email addresses from onboarding
     - Type (Employee/Contractor) from onboarding
     - Bank Status: "Pending" (yellow badge)
     - Payroll Status: "Inactive" (grey badge)

**Day 2: Add More Employees**

1. User clicks "Add Team Member"
2. Adds: "Robert Martinez" (robert@acme.com) - Employee
3. Clicks "Add Member"
4. **Employee count updates**: 6 team members
5. **Data automatically saved to localStorage**
6. Page refresh shows all 6 employees

---

## Data Persistence Behavior

### localStorage Key
```
clevio_user_data
```

### What's Stored
```json
{
  "companyName": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "ein": "string (optional)",
  "businessAddress": "string (optional)",
  "phone": "string (optional)",
  "employees": [
    {
      "id": "unique-timestamp",
      "name": "Full Name",
      "email": "email@company.com",
      "type": "employee | contractor",
      "bankStatus": "connected | pending",
      "payrollStatus": "active | inactive"
    }
  ],
  "amexCard": {
    "last4": "1234",
    "name": "Cardholder Name"
  },
  "selectedTiers": {
    "payroll": true,
    "tax": boolean,
    "advisory": boolean
  }
}
```

### Persistence Guarantees

✅ **Survives**:
- Page refreshes (F5)
- Browser restarts
- Navigation between pages
- Session timeouts

❌ **Cleared by**:
- Manual localStorage clear
- Browser cache clear
- Private/Incognito mode close
- Different browser/device

---

## Before vs After Comparison

### BEFORE (Broken)

**Onboarding Step 3**:
```
User adds:
- Sarah Johnson
- Michael Chen
- Emily Rodriguez  
- David Kim
- Lisa Park

(5 employees, can proceed)
```

**Dashboard Employees Page**:
```
Shows 3 generic employees:
- Generic Employee 1
- Generic Employee 2  
- Generic Employee 3

❌ User's actual data is LOST
❌ User must re-enter all 5 employees
```

---

### AFTER (Fixed)

**Onboarding Step 3**:
```
User adds:
- Sarah Johnson
- Michael Chen
- Emily Rodriguez
- David Kim
- Lisa Park

(5 employees, can proceed)
✅ Data saved to localStorage
```

**Dashboard Employees Page**:
```
Shows actual employees:
- Sarah Johnson (employee) - Pending - Inactive
- Michael Chen (contractor) - Pending - Inactive
- Emily Rodriguez (employee) - Pending - Inactive
- David Kim (employee) - Pending - Inactive
- Lisa Park (contractor) - Pending - Inactive

✅ All data preserved
✅ No re-entry needed
✅ Proper status badges
```

---

## Technical Details

### State Management

**Local Component State** (Onboarding):
```typescript
const [employees, setEmployees] = useState<Employee[]>([]);
```
- Holds employees during onboarding session
- Allows add/remove before completion
- Validated for 5-employee minimum

**Global Context State** (UserContext):
```typescript
const [userData, setUserDataState] = useState<UserData | null>(() => {
  const stored = localStorage.getItem('clevio_user_data');
  return stored ? JSON.parse(stored) : null;
});
```
- Persisted on onboarding completion
- Automatically synced to localStorage
- Available across all pages

**Dashboard State** (Employees Page):
```typescript
const [employees, setEmployees] = useState<Employee[]>([]);

useEffect(() => {
  if (userData?.employees && userData.employees.length > 0) {
    setEmployees(userData.employees);
  }
}, [userData]);
```
- Initialized from UserContext
- Syncs when userData changes
- Allows additional employees to be added

---

### Validation & Business Rules

**Minimum Employee Requirement**:
```typescript
const employeesComplete = employees.length >= 5;
const hasMinimum = employees.length >= 5;
```

**Onboarding**:
- Continue button disabled until 5 employees added
- Counter shows: "X of 5 added"
- Green checkmark when requirement met

**Dashboard**:
- Red warning banner if < 5 employees
- Green success banner if ≥ 5 employees
- "Add X more to activate services" message

---

### Status Field Defaults

**New Employees from Onboarding**:
```typescript
{
  bankStatus: 'pending',    // Needs to connect bank account
  payrollStatus: 'inactive' // Not yet active on payroll
}
```

**New Employees from Dashboard**:
```typescript
{
  bankStatus: 'pending',    // Needs to connect bank account
  payrollStatus: 'inactive' // Not yet active on payroll  
}
```

These defaults ensure new employees go through proper setup before being included in payroll.

---

## Error Handling

### No Saved Data Scenario

**If `userData.employees` is empty or null**:
```typescript
useEffect(() => {
  if (userData?.employees && userData.employees.length > 0) {
    setEmployees(userData.employees);
  }
  // If no data, employees stays [] (empty array)
}, [userData]);
```

**Result**: Empty state UI shown:
- "No Team Members Yet" message
- "Add your first employee or contractor to get started"
- "Add Team Member" button

### Migration from Old Data

**If user completed onboarding before this update**:
- Old localStorage won't have `employees` field
- Employees page shows empty state
- User can add employees manually
- New employees will be properly saved

---

## Future Enhancements

### Potential Additions

1. **Employee Edit Functionality**
   ```typescript
   const handleEditEmployee = (id: string, updates: Partial<Employee>) => {
     const updatedEmployees = employees.map(emp => 
       emp.id === id ? { ...emp, ...updates } : emp
     );
     setEmployees(updatedEmployees);
     updateUserData({ employees: updatedEmployees });
   };
   ```

2. **Employee Removal**
   ```typescript
   const handleRemoveEmployee = (id: string) => {
     const updatedEmployees = employees.filter(emp => emp.id !== id);
     setEmployees(updatedEmployees);
     updateUserData({ employees: updatedEmployees });
   };
   ```

3. **Bulk Import**
   - CSV upload
   - Parse employee data
   - Add all at once

4. **Bank Account Connection**
   - Update `bankStatus` to 'connected'
   - Store bank account last 4 digits
   - Enable for payroll

5. **Payroll Activation**
   - Update `payrollStatus` to 'active'
   - Include in payroll runs
   - Show in payroll UI

---

## Testing Checklist

### Manual Testing Steps

**Test 1: Fresh Onboarding**
1. ✅ Clear localStorage: `localStorage.clear()`
2. ✅ Complete signup
3. ✅ Enter 5 employees in onboarding
4. ✅ Complete onboarding
5. ✅ Navigate to `/dashboard/employees`
6. ✅ Verify all 5 employees appear with correct data

**Test 2: Employee Count Validation**
1. ✅ Add 4 employees in onboarding
2. ✅ Verify "Continue" button is disabled
3. ✅ Verify counter shows "4 of 5 added"
4. ✅ Add 5th employee
5. ✅ Verify "Continue" button enables
6. ✅ Verify green checkmark appears

**Test 3: Data Persistence**
1. ✅ Complete onboarding with 5 employees
2. ✅ Go to dashboard employees page
3. ✅ Verify 5 employees shown
4. ✅ Refresh page (F5)
5. ✅ Verify 5 employees still shown
6. ✅ Close and reopen browser
7. ✅ Verify 5 employees still shown

**Test 4: Add More Employees**
1. ✅ Complete onboarding with 5 employees
2. ✅ Go to dashboard employees page
3. ✅ Click "Add Team Member"
4. ✅ Add 6th employee
5. ✅ Verify count updates to 6
6. ✅ Refresh page
7. ✅ Verify all 6 employees persist

**Test 5: Employee Types**
1. ✅ Add 3 employees and 2 contractors in onboarding
2. ✅ Complete onboarding
3. ✅ Go to dashboard
4. ✅ Verify type badges show correctly:
   - "Employee" for employees
   - "Contractor" for contractors

**Test 6: Status Badges**
1. ✅ Complete onboarding
2. ✅ Go to dashboard employees page
3. ✅ Verify all employees show:
   - Bank Status: "Pending" (grey/yellow)
   - Payroll Status: "Inactive" (grey)

---

## Troubleshooting

### Issue: Employees Not Appearing After Onboarding

**Diagnosis**:
1. Check browser console for errors
2. Inspect localStorage: `localStorage.getItem('clevio_user_data')`
3. Verify JSON contains `employees` array

**Common Causes**:
- UserProvider not wrapping app correctly
- localStorage disabled in browser
- Browser in private/incognito mode

**Solution**:
- Verify `<UserProvider>` in App.tsx
- Enable localStorage in browser settings
- Use regular browser mode

### Issue: Employee Count Shows 0 on Dashboard

**Diagnosis**:
1. Check if `userData.employees` exists
2. Verify useEffect dependency array
3. Check for console errors

**Common Causes**:
- userData not loaded yet
- employees array is empty in localStorage
- useEffect not triggering

**Solution**:
- Add loading state while userData loads
- Verify onboarding completion saved data
- Check useEffect dependencies include `userData`

### Issue: New Employees Not Saving

**Diagnosis**:
1. Check if `updateUserData` is being called
2. Verify employee object structure
3. Check localStorage after adding

**Common Causes**:
- updateUserData not imported
- Employee object missing required fields
- localStorage full or disabled

**Solution**:
- Import and use updateUserData from useUser
- Ensure all required fields present
- Clear old localStorage data if needed

---

## Summary

The employee data persistence system now provides:

✅ **Seamless onboarding** - Enter employees once during setup
✅ **Automatic saving** - Data persists to localStorage on completion  
✅ **Dashboard auto-population** - No re-entry needed
✅ **Persistent storage** - Survives refreshes and browser restarts
✅ **Expandable** - Can add more employees after onboarding
✅ **Type-safe** - TypeScript interfaces prevent errors
✅ **Status tracking** - Bank and payroll status for each employee
✅ **Minimum enforcement** - 5-employee requirement validated

Users no longer lose their employee data between onboarding and the dashboard!
