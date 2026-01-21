const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../src/server.ts');
let content = fs.readFileSync(serverPath, 'utf-8');

console.log('Fixing TypeScript errors...\n');

// Fix 1: Cast error and emailError to Error type
content = content.replace(/} catch \(error\) \{/g, '} catch (error: unknown) {');
content = content.replace(/} catch \(emailError\) \{/g, '} catch (emailError: unknown) {');

// Fix 2: Add const err = error as Error; after each catch
content = content.replace(
  /} catch \((error|emailError): unknown\) \{\s*\n\s*console\./g,
  (match, varName) => `} catch (${varName}: unknown) {\n    const err = ${varName} as Error;\n    console.`
);

// Fix 3: Replace error.message and error.stack with err.message and err.stack
content = content.replace(/error\.message/g, 'err.message');
content = content.replace(/error\.stack/g, 'err.stack');
content = content.replace(/emailError\.message/g, 'err.message');
content = content.replace(/emailError\.response/g, '(err as any).response');

// Fix 4: Fix async handlers with Promise<void> return type and explicit returns
const asyncHandlers = [
  /app\.post\('\/api\/user\/signup',[\s\S]*?async \(req: Request, res: Response\)/g,
  /app\.post\('\/api\/user\/login',[\s\S]*?async \(req: Request, res: Response\)/g,
  /app\.post\('\/api\/user\/verify-2fa',[\s\S]*?async \(req: Request, res: Response\)/g,
  /app\.post\('\/api\/user\/resend-otp',[\s\S]*?async \(req: Request, res: Response\)/g,
  /app\.post\('\/api\/admin\/login',[\s\S]*?async \(req: AuthRequest, res: Response\)/g,
];

// Fix 5: Add Promise<void> return type to async route handlers
content = content.replace(
  /async \(req: (Request|AuthRequest), res: Response\):/g,
  'async (req: $1, res: Response): Promise<void> =>'
);

// Fix 6: Fix string | string[] type issues in query params
content = content.replace(
  /const email: string \| undefined = req\.query\.email;/g,
  'const email: string | undefined = typeof req.query.email === "string" ? req.query.email : undefined;'
);

// Fix 7: Fix line 552 - req.user type issue  
content = content.replace(
  /(firstName: user\.firstName,)/g,
  '$1\n      lastName: user.lastName,'
);

// Write the fixed content back
fs.writeFileSync(serverPath, content, 'utf-8');

console.log('✅ TypeScript fixes applied!');
console.log('Run npm run typecheck to verify.');
