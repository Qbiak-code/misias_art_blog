/**
 * contact-message service
 */

import { factories } from '@strapi/strapi';
import { Resend } from 'resend';

export default factories.createCoreService('api::contact-message.contact-message', ({ strapi }) => ({

  async forwardToArtist(contactMessage) {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'hello@misiaart.com';
    const artistEmail = process.env.ARTIST_EMAIL || 'artist@misiaart.com';

    if (!resendApiKey) {
      strapi.log.warn('RESEND_API_KEY not configured, skipping artist notification');
      return;
    }

    const resend = new Resend(resendApiKey);

    const { name, email, subject, message } = contactMessage;
    const emailSubject = subject ? `Contact Message: ${subject}` : `Contact Message from ${name}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #e1e5e9; padding-bottom: 10px;">
          New Contact Message
        </h2>
        
        <div style="background: #d1edff; border: 1px solid #0ea5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>✅ This message has been reviewed and approved by your admin.</strong></p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          <p><strong>Original Date:</strong> ${new Date(contactMessage.createdAt).toLocaleString()}</p>
          <p><strong>Forwarded:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background: white; padding: 20px; border-left: 4px solid #f4a6cd; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Message:</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #333;">How to Reply:</h3>
          <p style="line-height: 1.6;">
            You can reply directly to this email to respond to ${name}. 
            Your response will go directly to their email address: <strong>${email}</strong>
          </p>
          <p style="font-size: 0.9rem; color: #666; margin-top: 15px;">
            This message was sent through your art portfolio website and has been pre-screened by your admin.
          </p>
        </div>
      </div>
    `;

    const textContent = `
New Contact Message (Admin Approved)
✅ This message has been reviewed and approved by your admin.

From: ${name}
Email: ${email}
${subject ? `Subject: ${subject}` : ''}
Original Date: ${new Date(contactMessage.createdAt).toLocaleString()}
Forwarded: ${new Date().toLocaleString()}

Message:
${message}

How to Reply:
You can reply directly to this email to respond to ${name}.
Your response will go directly to their email address: ${email}

This message was sent through your art portfolio website and has been pre-screened by your admin.
    `;

    await resend.emails.send({
      from: fromEmail,
      to: artistEmail,
      replyTo: email, // Allow direct reply to the original sender
      subject: emailSubject,
      html: htmlContent,
      text: textContent,
    });

    strapi.log.info(`Contact message forwarded to artist from ${name} (${email})`);
  }
}));
