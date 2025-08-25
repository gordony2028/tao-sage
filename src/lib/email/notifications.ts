import { Resend } from 'resend';
import type { SupportTicket } from '@/types/support';

const resend = new Resend(process.env.RESEND_API_KEY);

// Your admin email - update this to your actual email
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'support@yourdomain.com';

/**
 * Send email notification when a new support ticket is created
 */
export async function sendNewTicketNotification(ticket: SupportTicket) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured - email notification skipped');
    return;
  }

  try {
    console.log(`[EMAIL DEBUG] Sending notification for ticket ${ticket.id}`);
    console.log(`[EMAIL DEBUG] Admin email: ${ADMIN_EMAIL}`);
    console.log(
      `[EMAIL DEBUG] Resend API key: ${
        process.env.RESEND_API_KEY ? 'Set' : 'Missing'
      }`
    );

    const priorityEmoji = {
      low: '🟢',
      normal: '🟡',
      high: '🟠',
      urgent: '🔴',
    }[ticket.priority];

    const categoryEmoji = {
      technical: '🔧',
      billing: '💳',
      feature_request: '✨',
      consultation_help: '🔮',
      cultural_question: '📿',
      general: '💬',
    }[ticket.category];

    const result = await resend.emails.send({
      from: 'Sage Support <onboarding@resend.dev>', // Using Resend's default domain
      to: [ADMIN_EMAIL],
      subject: `${priorityEmoji} New Support Ticket: ${ticket.subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b7355, #7ba05b); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎧 New Support Ticket</h1>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 20px;">
              <h2 style="color: #374151; margin: 0 0 10px 0;">${categoryEmoji} ${
                ticket.subject
              }</h2>
              
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 6px; font-size: 14px;">
                <div><strong>Priority:</strong> ${priorityEmoji} ${
                  ticket.priority.charAt(0).toUpperCase() +
                  ticket.priority.slice(1)
                }</div>
                <div><strong>Category:</strong> ${categoryEmoji} ${ticket.category.replace(
                  '_',
                  ' '
                )}</div>
                <div><strong>User:</strong> ${
                  ticket.user_name || 'Unknown'
                }</div>
                <div><strong>Email:</strong> ${ticket.user_email}</div>
                <div><strong>Tier:</strong> ${
                  ticket.subscription_tier === 'sage_plus'
                    ? '⭐ Sage+'
                    : '🆓 Free'
                }</div>
                <div><strong>Ticket ID:</strong> #${ticket.id.slice(0, 8)}</div>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin: 0 0 10px 0;">Message:</h3>
              <div style="background: #f9fafb; padding: 15px; border-radius: 6px; white-space: pre-wrap; line-height: 1.5;">
${ticket.message}
              </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: ${
              ticket.subscription_tier === 'sage_plus' ? '#fef3c7' : '#f3f4f6'
            }; border-radius: 6px;">
              <p style="margin: 0; font-size: 14px; color: #374151;">
                <strong>Response SLA:</strong> ${
                  ticket.subscription_tier === 'sage_plus'
                    ? '⏰ 24 hours (Priority Support)'
                    : '📅 48-72 hours (Standard Support)'
                }
              </p>
            </div>

            <div style="margin-top: 20px; text-align: center;">
              <a href="http://localhost:3000/admin/support/tickets/${
                ticket.id
              }" 
                 style="background: #8b7355; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
                View in Admin Dashboard
              </a>
            </div>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px;">
            <p>Sage - I Ching Life Guidance | Support Notification</p>
          </div>
        </div>
      `,
    });

    console.log(
      `✅ Support ticket notification sent for ticket #${ticket.id.slice(0, 8)}`
    );
    console.log(
      `[EMAIL DEBUG] Resend response:`,
      JSON.stringify(result, null, 2)
    );
  } catch (error) {
    console.error('❌ Failed to send support ticket email:', error);
    if (error instanceof Error) {
      console.error('❌ Email error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
  }
}

/**
 * Send email notification when a support ticket receives a reply
 */
export async function sendTicketReplyNotification(
  ticket: SupportTicket,
  replyMessage: string,
  senderType: 'user' | 'admin'
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured - email notification skipped');
    return;
  }

  try {
    if (senderType === 'user') {
      // Notify admin of user reply
      await resend.emails.send({
        from: 'Sage Support <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        subject: `💬 Reply on Ticket: ${ticket.subject}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #3b82f6; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">💬 New Reply on Support Ticket</h1>
            </div>
            
            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 15px 0;"><strong>Ticket:</strong> ${
                ticket.subject
              } (#${ticket.id.slice(0, 8)})</p>
              <p style="margin: 0 0 15px 0;"><strong>User:</strong> ${
                ticket.user_name || ticket.user_email
              }</p>
              
              <div style="background: #f9fafb; padding: 15px; border-radius: 6px; white-space: pre-wrap; line-height: 1.5;">
${replyMessage}
              </div>

              <div style="margin-top: 20px; text-align: center;">
                <a href="http://localhost:3000/admin/support/tickets/${
                  ticket.id
                }" 
                   style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Reply in Admin Dashboard
                </a>
              </div>
            </div>
          </div>
        `,
      });
    }
  } catch (error) {
    console.error('Failed to send reply notification email:', error);
  }
}
