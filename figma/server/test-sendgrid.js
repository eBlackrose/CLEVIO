/**
 * SendGrid Integration Test Script
 * 
 * This script tests if your SendGrid API key is working correctly.
 * Run: node test-sendgrid.js
 */

import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('\n🧪 ═══════════════════════════════════════════════════════');
console.log('   SendGrid Integration Test');
console.log('═══════════════════════════════════════════════════════\n');

// Check if API key is configured
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ ERROR: SENDGRID_API_KEY not found in .env file');
  console.log('\nPlease add your API key to /server/.env:');
  console.log('SENDGRID_API_KEY=SG.your_key_here\n');
  process.exit(1);
}

if (!process.env.SENDGRID_FROM_EMAIL) {
  console.error('❌ ERROR: SENDGRID_FROM_EMAIL not found in .env file');
  console.log('\nPlease add your verified sender email to /server/.env:');
  console.log('SENDGRID_FROM_EMAIL=your-verified-email@example.com\n');
  process.exit(1);
}

console.log('✅ Configuration found:');
console.log(`   API Key: ${process.env.SENDGRID_API_KEY.substring(0, 15)}...`);
console.log(`   From Email: ${process.env.SENDGRID_FROM_EMAIL}\n`);

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Test email configuration
const testEmail = {
  to: process.env.SENDGRID_FROM_EMAIL, // Send to yourself for testing
  from: process.env.SENDGRID_FROM_EMAIL,
  subject: '✅ CLEVIO SendGrid Integration Test',
  text: 'If you receive this email, your SendGrid integration is working correctly!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #000;">✅ Success!</h1>
      <p style="font-size: 16px;">Your CLEVIO SendGrid integration is working correctly.</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>API Key:</strong> Configured ✅</p>
        <p style="margin: 10px 0 0 0;"><strong>Sender Email:</strong> ${process.env.SENDGRID_FROM_EMAIL} ✅</p>
      </div>
      <p style="color: #666; font-size: 14px;">
        You can now use the CLEVIO backend server to send 2FA verification codes via email.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">
        This is a test email from the CLEVIO Financial Services Platform.
      </p>
    </div>
  `,
};

console.log('📧 Sending test email...');
console.log(`   To: ${testEmail.to}`);
console.log(`   From: ${testEmail.from}`);
console.log(`   Subject: ${testEmail.subject}\n`);

// Send the email
sgMail
  .send(testEmail)
  .then(() => {
    console.log('✅ ═══════════════════════════════════════════════════════');
    console.log('   EMAIL SENT SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('📬 Check your inbox at:', process.env.SENDGRID_FROM_EMAIL);
    console.log('   (Also check spam/junk folder if not in inbox)\n');
    console.log('🎉 SendGrid integration is working!');
    console.log('   You can now start the CLEVIO backend server.\n');
    console.log('Next steps:');
    console.log('   1. Verify you received the test email');
    console.log('   2. Run: npm run dev (to start the backend server)');
    console.log('   3. Update /src/app/config/api.ts: USE_REAL_BACKEND = true');
    console.log('   4. Sign in to CLEVIO and receive 2FA codes via email!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ ═══════════════════════════════════════════════════════');
    console.error('   EMAIL SENDING FAILED');
    console.error('═══════════════════════════════════════════════════════\n');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('\nSendGrid Response:');
      console.error(JSON.stringify(error.response.body, null, 2));
    }
    
    console.log('\n🔧 Troubleshooting:\n');
    
    if (error.code === 401 || error.message.includes('Unauthorized')) {
      console.log('❌ API Key Invalid');
      console.log('   - Check your API key is correct in /server/.env');
      console.log('   - Regenerate a new API key in SendGrid dashboard if needed\n');
    }
    
    if (error.code === 403 || error.message.includes('Forbidden')) {
      console.log('❌ Sender Email Not Verified');
      console.log('   - Go to SendGrid dashboard');
      console.log('   - Settings → Sender Authentication');
      console.log('   - Verify your sender email address');
      console.log(`   - Current sender: ${process.env.SENDGRID_FROM_EMAIL}\n`);
    }
    
    if (error.message.includes('does not contain a valid address')) {
      console.log('❌ Invalid Email Address');
      console.log('   - Update SENDGRID_FROM_EMAIL in /server/.env');
      console.log('   - Use a valid email address\n');
    }
    
    console.log('📚 SendGrid Documentation:');
    console.log('   https://docs.sendgrid.com/for-developers/sending-email/api-getting-started\n');
    
    process.exit(1);
  });
