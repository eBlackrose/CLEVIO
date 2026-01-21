# CLEVIO User Data Flow Documentation

## Overview

The CLEVIO platform now implements persistent user data storage that flows from signup through to the dashboard settings. This ensures a seamless user experience where information entered once is automatically populated throughout the application.

## Architecture

### User Context (`/src/app/contexts/user-context.tsx`)

**Purpose**: Centralized state management for user data with localStorage persistence.

**Features**:
- React Context API for global state
- Automatic localStorage sync
- Persistent data across page reloads
- Type-safe data structure

**Data Structure**:
```typescript
interface UserData {
  companyName: string;
  email: string;
  firstName: string;
  lastName: string;
  ein?: string;
  businessAddress?: string;
  phone?: string;
}
```

**Usage**:
```typescript
import { useUser } from '../contexts/user-context';

const { userData, setUserData, updateUserData } = useUser();
```

---

## User Flow

### 1. Signup Process (`/src/app/pages/signup.tsx`)

**Step 1: Company & Email**
- User enters: Company Name, Email, Password
- Data temporarily stored in local component state

**Step 2: Personal Information**
- User enters: First Name, Last Name
- Data added to local component state

**Step 3: Confirmation & Save**
- On final "Complete Setup" button click:
  - All data saved to User Context
  - Automatically persisted to localStorage
  - User redirected to onboarding

**Data Saved**:
```javascript
{
  companyName: "Acme Corporation",
  email: "john@acme.com",
  firstName: "John",
  lastName: "Doe"
}
```

---

### 2. Settings Page (`/src/app/pages/dashboard/settings.tsx`)

#### Auto-Population
When the settings page loads:
- Reads data from User Context
- Pre-populates all form fields with saved data
- No manual entry required

#### Company Profile Section
**Fields Auto-Populated**:
- ✅ Company Name (from signup)
- EIN (empty, can be added)
- Business Address (empty, can be added)

**Save Button Behavior**:
1. **Initially**: Disabled if no changes detected
2. **User edits field**: Button becomes enabled
3. **User clicks "Save Changes"**: 
   - Shows "Saving..." state
   - Updates User Context
   - Persists to localStorage
   - Button becomes disabled again
   - Shows "All changes saved" message
4. **Until new edits**: Button stays disabled

#### Contact Information Section
**Fields Auto-Populated**:
- ✅ First Name (from signup)
- ✅ Last Name (from signup)
- ✅ Email (from signup)
- Phone (empty, can be added)

**Save Button Behavior**:
- Same smart behavior as Company Profile
- Only enabled when changes are detected
- Greys out after successful save
- Re-enables when user makes new edits

---

## Smart Save Button Logic

### Change Detection

**How It Works**:
```typescript
// Save a "snapshot" of current saved state
const [companyProfileSaved, setCompanyProfileSaved] = useState(companyProfile);

// Compare current state to saved snapshot
useEffect(() => {
  const changed = JSON.stringify(companyProfile) !== JSON.stringify(companyProfileSaved);
  setIsCompanyProfileChanged(changed);
}, [companyProfile, companyProfileSaved]);
```

### Button States

**1. Disabled (Greyed Out)**
```typescript
disabled={!isCompanyProfileChanged || isCompanySaving}
```
- No changes detected
- Currently saving

**Visual**: Reduced opacity (50%), no hover effect, cursor-not-allowed

**2. Enabled (Active)**
- User has made changes to any field
- Ready to save

**Visual**: Full color, hover effect, normal cursor

**3. Saving**
- Save operation in progress
- Button text changes to "Saving..."

**Visual**: Disabled state + loading text

**4. Saved**
- After successful save
- Shows "All changes saved" message below button
- Button returns to disabled state

---

## Data Persistence

### localStorage

**Key**: `clevio_user_data`

**Automatic Sync**:
- Every time `userData` changes in context
- Data is automatically written to localStorage
- Survives page refreshes and browser restarts

**Data Retrieval**:
```typescript
const stored = localStorage.getItem('clevio_user_data');
const userData = stored ? JSON.parse(stored) : null;
```

### Update Methods

**Full Replace** (used at signup):
```typescript
setUserData({
  companyName: "Acme Corp",
  email: "john@acme.com",
  firstName: "John",
  lastName: "Doe"
});
```

**Partial Update** (used in settings):
```typescript
updateUserData({
  phone: "(555) 123-4567",
  ein: "12-3456789"
});
```

---

## Complete User Journey Example

### Day 1: Signup
1. User visits `/signup`
2. Enters company: "Acme Corporation"
3. Enters email: "john@acme.com"
4. Enters name: "John Doe"
5. Clicks "Complete Setup"
6. **Data saved to localStorage**

### Day 2: Settings
1. User visits `/dashboard/settings`
2. **Company Profile auto-populated**:
   - Company Name: "Acme Corporation" ✓
3. **Contact Information auto-populated**:
   - First Name: "John" ✓
   - Last Name: "Doe" ✓
   - Email: "john@acme.com" ✓
4. User adds EIN: "12-3456789"
5. **Save button activates** (was greyed out)
6. User clicks "Save Changes"
7. Button shows "Saving..."
8. **Data updated in localStorage**
9. Button greys out again
10. "All changes saved" appears

### Day 3: User Returns
1. User visits `/dashboard/settings`
2. **All previous data still populated**:
   - Company Name: "Acme Corporation"
   - EIN: "12-3456789" (from Day 2)
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john@acme.com"
3. User adds phone: "(555) 123-4567"
4. **Save button activates only for Contact Info**
5. Saves successfully
6. Both sections now show complete data

---

## Technical Implementation Details

### React Hooks Used

**useState**: Component-level state for form fields
```typescript
const [companyProfile, setCompanyProfile] = useState({...});
```

**useEffect**: Change detection and data sync
```typescript
useEffect(() => {
  // Detect if data changed
}, [companyProfile, companyProfileSaved]);
```

**useContext**: Global user data access
```typescript
const { userData, updateUserData } = useUser();
```

### State Management Strategy

**Separation of Concerns**:
1. **Local State**: Current form field values
2. **Saved State**: Last saved snapshot (for comparison)
3. **Global Context**: Persisted user data

**Why This Approach**:
- Allows real-time change detection
- Enables smart button enable/disable
- Prevents unnecessary saves
- Provides clear user feedback

---

## Validation & Error Handling

### Form Validation

**Signup Page**:
- Required fields enforced via HTML5 `required` attribute
- Email format validation via `type="email"`
- Cannot proceed to next step without completing current step

**Settings Page**:
- No required fields (user can save partial data)
- Changes only saved when user explicitly clicks "Save Changes"

### Error States

**Save Failed** (Future Enhancement):
```typescript
try {
  await saveToServer();
  setCompanyProfileSaved(companyProfile);
} catch (error) {
  // Show error message
  // Keep button enabled
  // Allow retry
}
```

---

## Future Enhancements

### Potential Additions

1. **Server Sync**
   - POST data to API on save
   - GET data from API on load
   - Merge localStorage with server data

2. **Validation Rules**
   - EIN format validation (XX-XXXXXXX)
   - Phone number formatting
   - Required field indicators

3. **Auto-Save**
   - Debounced auto-save after X seconds
   - Visual indicator of unsaved changes
   - Draft state management

4. **Audit Trail**
   - Track when fields were last updated
   - Show "Last saved" timestamp
   - Change history

5. **Multi-User Support**
   - Different localStorage keys per user
   - User ID-based data isolation

---

## Testing the Flow

### Manual Test Steps

**Test 1: Fresh Signup**
1. Clear localStorage: `localStorage.clear()`
2. Visit `/signup`
3. Complete all steps
4. Navigate to `/dashboard/settings`
5. **Verify**: All fields populated from signup

**Test 2: Save Button State**
1. Go to `/dashboard/settings`
2. **Verify**: Save buttons disabled (greyed out)
3. Edit Company Name
4. **Verify**: Save button enabled
5. Click "Save Changes"
6. **Verify**: Button shows "Saving..." then disabled
7. **Verify**: "All changes saved" appears

**Test 3: Persistence**
1. Go to `/dashboard/settings`
2. Add EIN and Business Address
3. Save changes
4. Refresh page (F5)
5. **Verify**: EIN and Business Address still populated

**Test 4: Partial Updates**
1. Edit only First Name in Contact Info
2. **Verify**: Only Contact Info save button enables
3. **Verify**: Company Profile save button stays disabled
4. Save Contact Info
5. **Verify**: Only Contact Info changes saved

---

## Code Examples

### Reading User Data
```typescript
import { useUser } from '../contexts/user-context';

function MyComponent() {
  const { userData } = useUser();
  
  return (
    <div>
      Welcome, {userData?.firstName} {userData?.lastName}!
      <br />
      Company: {userData?.companyName}
    </div>
  );
}
```

### Updating User Data
```typescript
import { useUser } from '../contexts/user-context';

function ProfileEditor() {
  const { updateUserData } = useUser();
  
  const handleSave = () => {
    updateUserData({
      phone: newPhoneNumber,
      businessAddress: newAddress
    });
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

### Checking if Data Exists
```typescript
import { useUser } from '../contexts/user-context';

function Dashboard() {
  const { userData } = useUser();
  
  if (!userData) {
    return <Redirect to="/signup" />;
  }
  
  return <div>Dashboard content...</div>;
}
```

---

## Troubleshooting

### Issue: Data Not Persisting
**Cause**: localStorage might be disabled or full
**Solution**: Check browser settings, clear old data

### Issue: Save Button Always Disabled
**Cause**: Change detection not working
**Solution**: Verify state updates are creating new objects (not mutating)

### Issue: Old Data Showing After Signup
**Cause**: localStorage not cleared between users
**Solution**: Clear localStorage on logout

### Issue: Settings Not Pre-Populated
**Cause**: User Context not wrapped around app
**Solution**: Verify `<UserProvider>` wraps routes in App.tsx

---

This implementation provides a seamless, professional user experience where data flows naturally from signup through settings, with intelligent save button behavior that prevents unnecessary operations and provides clear user feedback.
