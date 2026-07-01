import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.MAIL_FROM || 'onboarding@resend.dev';
const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const verifyUrl = `${appUrl}/verify-email?token=${token}`;

  if (!resend) {
    console.log('\n========================================');
    console.log(`[DEV EMAIL] Verification email to: ${email}`);
    console.log(`Verification Link: ${verifyUrl}`);
    console.log('========================================\n');
    return true;
  }

  try {
    const data = await resend.emails.send({
      from: `SpentSmart <${fromEmail}>`,
      to: email,
      subject: 'Verify your email address - SpentSmart',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f766e; margin-bottom: 24px;">Welcome to SpentSmart!</h2>
          <p>Thank you for signing up. Please verify your email address to activate your account.</p>
          <div style="margin: 32px 0;">
            <a href="${verifyUrl}" style="background-color: #0f766e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
          </div>
          <p style="color: #64748b; font-size: 14px;">If you did not sign up for a SpentSmart account, you can ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">This link will expire in 24 hours.</p>
        </div>
      `
    });

    if (data.error) {
      console.error('Failed to send verification email via Resend:', data.error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  if (!resend) {
    console.log('\n========================================');
    console.log(`[DEV EMAIL] Password reset email to: ${email}`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log('========================================\n');
    return true;
  }

  try {
    const data = await resend.emails.send({
      from: `SpentSmart <${fromEmail}>`,
      to: email,
      subject: 'Reset your password - SpentSmart',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f766e; margin-bottom: 24px;">Reset your password</h2>
          <p>We received a request to reset your password. Click the button below to set a new password.</p>
          <div style="margin: 32px 0;">
            <a href="${resetUrl}" style="background-color: #0f766e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #64748b; font-size: 14px;">If you did not request a password reset, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">This link will expire in 1 hour.</p>
        </div>
      `
    });

    if (data.error) {
      console.error('Failed to send password reset email via Resend:', data.error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

export async function sendReferralEmail(email: string, subject: string, htmlContent: string): Promise<boolean> {
  if (!resend) {
    console.log('\n========================================');
    console.log(`[DEV EMAIL] Referral notification to: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML Body Content:`);
    console.log(htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
    console.log('========================================\n');
    return true;
  }

  try {
    const data = await resend.emails.send({
      from: `SpentSmart <${fromEmail}>`,
      to: email,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f766e; margin-bottom: 24px;">SpentSmart Referral Update</h2>
          ${htmlContent}
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="color: #94a3b8; font-size: 11px;">You received this email because of referral activity on your SpentSmart account.</p>
        </div>
      `
    });

    if (data.error) {
      console.error('Failed to send referral email via Resend:', data.error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error sending referral email:', error);
    return false;
  }
}

export async function sendWithdrawalStatusEmail(email: string, name: string, amount: number, status: 'approved' | 'rejected') {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Withdrawal status email not sent to:', email);
    return null;
  }

  const subject = status === 'approved' 
    ? 'Withdrawal Request Approved - SpendSmart' 
    : 'Withdrawal Request Update - SpendSmart';

  const amountStr = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);

  const message = status === 'approved'
    ? `Great news! Your withdrawal request for ${amountStr} has been approved and processed.`
    : `Unfortunately, your withdrawal request for ${amountStr} could not be processed at this time.`;

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Withdrawal Status Update</h2>
          <p>Hi ${name},</p>
          <p>${message}</p>
          <p>If you have any questions, please contact support.</p>
          <br/>
          <p>Best regards,</p>
          <p>The SpendSmart Team</p>
        </div>
      `
    });
    
    if (data.error) {
      console.error('Failed to send withdrawal status email via Resend:', data.error);
    }
    return data;
  } catch (error) {
    console.error('Error sending withdrawal status email:', error);
    return null;
  }
}

export async function sendClientPasswordUpdateEmail(email: string, name: string, password: string): Promise<boolean> {
  if (!resend) {
    console.log('\n========================================');
    console.log(`[DEV EMAIL] Password update notification email to: ${email}`);
    console.log(`Hi ${name}, your password has been reset by the Admin.`);
    console.log(`Your new password is: ${password}`);
    console.log('========================================\n');
    return true;
  }

  try {
    const data = await resend.emails.send({
      from: `SpentSmart <${fromEmail}>`,
      to: email,
      subject: 'Your password has been updated - SpentSmart',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f766e; margin-bottom: 24px;">Your password has been updated</h2>
          <p>Hi ${name},</p>
          <p>An administrator has updated your password. You can now log in using the credentials below:</p>
          <div style="margin: 24px 0; padding: 16px; background-color: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0;"><strong>New Password:</strong> <code style="font-size: 14px; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${password}</code></p>
          </div>
          <p>For security reasons, we recommend that you change this password after logging in.</p>
          <p style="color: #64748b; font-size: 14px;">If you have any questions or did not authorize this, please contact support immediately.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">This is an automated notification. Please do not reply directly to this email.</p>
        </div>
      `
    });

    if (data.error) {
      console.error('Failed to send password update email via Resend:', data.error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error sending password update email:', error);
    return false;
  }
}

