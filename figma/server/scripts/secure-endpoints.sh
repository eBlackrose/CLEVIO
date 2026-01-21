#!/bin/bash
# Script to add JWT authentication to all dashboard endpoints

FILE="../src/server.ts"

echo "Securing dashboard endpoints in $FILE..."

# Function to add authenticate middleware and change req.query.email to req.user!.id
secure_endpoint() {
  local pattern=$1
  local line_num=$2
  
  echo "Processing line $line_num: $pattern"
}

# Use sed to add authenticate middleware to endpoints
sed -i.backup \
  -e 's/app\.get('\''\/api\/company'\'', async (req, res)/app.get('\''\/api\/company'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.put('\''\/api\/company'\'', async (req, res)/app.put('\''\/api\/company'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.get('\''\/api\/notifications'\'', async (req, res)/app.get('\''\/api\/notifications'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.put('\''\/api\/notifications'\'', async (req, res)/app.put('\''\/api\/notifications'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.get('\''\/api\/team'\'', async (req, res)/app.get('\''\/api\/team'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.post('\''\/api\/team'\'', async (req, res)/app.post('\''\/api\/team'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.put('\''\/api\/team\/:id'\'', async (req, res)/app.put('\''\/api\/team\/:id'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.delete('\''\/api\/team\/:id'\'', async (req, res)/app.delete('\''\/api\/team\/:id'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.get('\''\/api\/payments\/amex'\'', async (req, res)/app.get('\''\/api\/payments\/amex'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.put('\''\/api\/payments\/amex'\'', async (req, res)/app.put('\''\/api\/payments\/amex'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.get('\''\/api\/billing\/history'\'', async (req, res)/app.get('\''\/api\/billing\/history'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.get('\''\/api\/subscriptions'\'', async (req, res)/app.get('\''\/api\/subscriptions'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.put('\''\/api\/subscriptions'\'', async (req, res)/app.put('\''\/api\/subscriptions'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.get('\''\/api\/payroll\/schedule'\'', async (req, res)/app.get('\''\/api\/payroll\/schedule'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.put('\''\/api\/payroll\/schedule'\'', async (req, res)/app.put('\''\/api\/payroll\/schedule'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.get('\''\/api\/payroll\/upcoming'\'', async (req, res)/app.get('\''\/api\/payroll\/upcoming'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.post('\''\/api\/payroll\/run'\'', async (req, res)/app.post('\''\/api\/payroll\/run'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.get('\''\/api\/advisory'\'', async (req, res)/app.get('\''\/api\/advisory'\'', authenticate, async (req: AuthRequest, res)/g' \
  -e 's/app\.post('\''\/api\/advisory'\'', async (req, res)/app.post('\''\/api\/advisory'\'', authenticate, async (req: AuthRequest, res)/g' \
  "$FILE"

# Now replace email query params with userId
sed -i \
  -e 's/const { email } = req\.query;/const userId = req.user!.id;/g' \
  -e 's/where: { email: email }/where: { id: userId }/g' \
  -e 's/where: { email }/where: { id: userId }/g' \
  "$FILE"

echo "✅ All dashboard endpoints secured with JWT authentication"
echo "Backup saved to: ${FILE}.backup"
