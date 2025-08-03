/**
 * Contact message lifecycle hooks
 */

import { Resend } from 'resend';

export default {
  async afterCreate(event) {
    console.log('🎯 CONTACT MESSAGE LIFECYCLE - afterCreate triggered');
    const { result } = event;
    
    try {
      console.log('Contact message created:', JSON.stringify(result, null, 2));
      
      // Send admin notification
      await sendAdminNotification(result);
      console.log('✅ Admin notification sent successfully from lifecycle');
      
    } catch (error) {
      console.error('❌ Failed to send admin notification from lifecycle:', error);
      strapi.log.error('Failed to send admin notification:', error);
    }
  },
};

async function sendAdminNotification(contactMessage) {
  console.log('=== LIFECYCLE: SEND ADMIN NOTIFICATION ===');
  
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@misiaart.com';

  console.log('Email config:');
  console.log('- API Key exists:', !!resendApiKey);
  console.log('- From email:', fromEmail);
  console.log('- Admin email:', adminEmail);

  if (!resendApiKey) {
    console.log('❌ No RESEND_API_KEY found, skipping admin notification');
    return;
  }

  const resend = new Resend(resendApiKey);

  const { name, email, subject, message } = contactMessage;
  const emailSubject = 'New Contact Message Needs Review';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #e1e5e9; padding-bottom: 10px;">
        New Contact Message - Admin Review Required
      </h2>
      
      <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>⚠️ This message needs your review before forwarding to the artist.</strong></p>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <p><strong>Received:</strong> ${new Date(contactMessage.createdAt).toLocaleString()}</p>
      </div>

      <div style="background: white; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Message:</h3>
        <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>

      <div style="margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #333;">Next Steps:</h3>
        <ol style="line-height: 1.6;">
          <li>Review the message above for appropriateness</li>
          <li>Go to your <a href="${process.env.STRAPI_ADMIN_URL || 'http://localhost:1337/admin'}" style="color: #007bff;">Strapi admin panel</a></li>
          <li>Find this contact message and use the "Forward to Artist" action</li>
          <li>Or handle it directly by replying to: ${email}</li>
        </ol>
      </div>
    </div>
  `;

  const textContent = `
New Contact Message - Admin Review Required
⚠️ This message needs your review before forwarding to the artist.

From: ${name}
Email: ${email}
${subject ? `Subject: ${subject}` : ''}
Received: ${new Date(contactMessage.createdAt).toLocaleString()}

Message:
${message}

Next Steps:
1. Review the message above for appropriateness
2. Go to your Strapi admin panel: ${process.env.STRAPI_ADMIN_URL || 'http://localhost:1337/admin'}
3. Find this contact message and use the "Forward to Artist" action
4. Or handle it directly by replying to: ${email}
  `;

  console.log('About to send email with Resend...');
  console.log('Email params:', {
    from: fromEmail,
    to: adminEmail,
    subject: emailSubject
  });

  const emailResult = await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: emailSubject,
    html: htmlContent,
    text: textContent,
  });

  console.log('✅ Email sent successfully!', emailResult);
}