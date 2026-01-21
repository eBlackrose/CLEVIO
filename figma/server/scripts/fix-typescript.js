/**
 * Script to fix TypeScript errors in server.ts
 */

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../src/server.ts');
let content = fs.readFileSync(serverPath, 'utf8');

console.log('🔧 Fixing TypeScript errors...\n');

// Fix 1: Add Promise<any> to login endpoint
content = content.replace(
  /app\.post\('\/api\/user\/login', authLimiter, async \(req, res\) =>/g,
  "app.post('/api/user/login', authLimiter, async (req, res): Promise<any> =>"
);
console.log('✅ Fixed login endpoint return type');

// Fix 2: Fix user lookup to use email instead of req.user
content = content.replace(
  /where: \{ id: req\.user!\.id \},\s*\n\s*include: \{ company: true \}\s*\n\s*\}\);\s*\n\s*\n\s*console\.log\(`User lookup:/,
  `where: { email },
      include: { company: true }
    });
    
    console.log(\`User lookup:`
);
console.log('✅ Fixed user lookup in login endpoint');

// Fix 3: Cast all error types in catch blocks
content = content.replace(
  /} catch \(error\) \{\s*\n\s*console\.error\(`❌ Email sending failed:`, error\.message\);/g,
  `} catch (error) {
      const err = error as Error & { response?: any };
      console.error(\`❌ Email sending failed:\`, err.message);`
);

content = content.replace(
  /if \(error\.response\) \{/g,
  'if (err.response) {'
);

content = content.replace(
  /console\.error\('SendGrid response:', error\.response\.body\);/g,
  "console.error('SendGrid response:', err.response.body);"
);

console.log('✅ Fixed error type casting in catch blocks');

// Fix 4: Add explicit returns
content = content.replace(
  /res\.status\(500\)\.json\(\{ message: 'Internal server error' \}\); return;/g,
  "return res.status(500).json({ message: 'Internal server error' });"
);
console.log('✅ Fixed return statements');

// Save the file
fs.writeFileSync(serverPath, content, 'utf8');

console.log('\n✅ All TypeScript fixes applied!');
console.log('Run: npm run typecheck to verify');
