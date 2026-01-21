/**
 * Script to systematically fix TypeScript errors
 */

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../src/server.ts');
let content = fs.readFileSync(serverPath, 'utf8');
let changeCount = 0;

console.log('🔧 Fixing TypeScript errors systematically...\n');

// Fix 1: Add Promise<any> to all auth endpoints without it
const authEndpoints = [
  '/api/user/signup',
  '/api/user/login',
  '/api/user/verify-2fa',
  '/api/user/resend-otp',
  '/api/admin/login'
];

authEndpoints.forEach(endpoint => {
  const before = content;
  const escapedPath = endpoint.replace(/\//g, '\\/');
  const regex = new RegExp(`app\\.post\\('${escapedPath}'.*?async \\(req, res\\) =>`, 'g');
  content = content.replace(regex, (match) => {
    if (!match.includes('Promise<any>')) {
      return match.replace('async (req, res) =>', 'async (req, res): Promise<any> =>');
    }
    return match;
  });
  if (content !== before) {
    changeCount++;
    console.log(`✅ Fixed ${endpoint} return type`);
  }
});

// Fix 2: Add explicit returns to all route handlers
content = content.replace(
  /(\s+res\.status\(\d+\)\.json\([^)]+\);)\s*\n(\s+)\}/g,
  (match, statusLine, indent) => {
    if (!statusLine.includes('return ')) {
      changeCount++;
      return statusLine.replace('res.status', `${indent}return res.status`) + `\n${indent}}`;
    }
    return match;
  }
);
console.log(`✅ Added explicit return statements`);

// Fix 3: Cast all error types in catch blocks  
const errorPatterns = [
  {
    from: /} catch \((error|emailError)\) \{([^}]*?)\1\.message/gs,
    to: (match, varName) => {
      if (match.includes('as Error')) return match;
      changeCount++;
      return match.replace(
        `} catch (${varName}) {`,
        `} catch (${varName}) {\n    const err = ${varName} as Error & { response?: any };`
      ).replace(new RegExp(`${varName}\\.message`, 'g'), 'err.message')
        .replace(new RegExp(`${varName}\\.response`, 'g'), 'err.response')
        .replace(new RegExp(`${varName}\\.stack`, 'g'), 'err.stack');
    }
  }
];

errorPatterns.forEach(pattern => {
  const matches = content.match(pattern.from);
  if (matches) {
    matches.forEach(match => {
      const varName = match.match(/catch \((.*?)\)/)[1];
      if (!match.includes('as Error')) {
        const fixed = pattern.to(match, varName);
        content = content.replace(match, fixed);
      }
    });
  }
});
console.log(`✅ Fixed error type casting`);

// Fix 4: Replace req.user with email in non-protected login routes
content = content.replace(
  /where: \{ id: req\.user!\.id \},\s*\n\s*include: \{ company: true \}\s*\n\s*\}\);\s*\n\s*\n\s*console\.log\(`User lookup:/,
  `where: { email },
      include: { company: true }
    });
    
    console.log(\`User lookup:`
);
console.log('✅ Fixed user lookup in login');

// Fix 5: Fix string array types in PUT /api/team/:id
content = content.replace(
  /const \{ id \} = req\.params;\s*\n\s*const \{ fullName, email: memberEmail,/,
  `const { id } = req.params;
    const { fullName, email: memberEmail,`
);

content = content.replace(
  /email: memberEmail,\s*\n\s*type,/g,
  `email: Array.isArray(memberEmail) ? memberEmail[0] : memberEmail,
      type,`
);
console.log('✅ Fixed string array types');

// Save
fs.writeFileSync(serverPath, content, 'utf8');

console.log(`\n✅ Applied ${changeCount} fixes!`);
console.log('Run: npm run typecheck');
