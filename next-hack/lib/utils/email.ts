import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'noreply@terminal-hacks.space',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@terminal-hacks.space',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
};

// Email templates
export const emailTemplates = {
  passwordReset: (resetLink: string, username: string) => ({
    subject: '🔐 Password Reset Request - Terminal Hacks',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Terminal Hacks</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              background-color: #0a0a0a; 
              color: #00ff41; 
              margin: 0; 
              padding: 20px; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #1a1a1a; 
              border: 2px solid #00ff41; 
              border-radius: 8px; 
              padding: 30px; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
            }
            .logo { 
              font-size: 24px; 
              font-weight: bold; 
              color: #00ff41; 
              margin-bottom: 10px; 
            }
            .content { 
              line-height: 1.6; 
              margin-bottom: 30px; 
            }
            .button { 
              display: inline-block; 
              background-color: #00ff41; 
              color: #000000; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 4px; 
              font-weight: bold; 
              margin: 20px 0; 
            }
            .warning { 
              background-color: #2a1a00; 
              border-left: 4px solid #ff6b00; 
              padding: 15px; 
              margin: 20px 0; 
              color: #ffcc99; 
            }
            .footer { 
              text-align: center; 
              font-size: 12px; 
              color: #666; 
              margin-top: 30px; 
            }
            .code { 
              background-color: #000; 
              border: 1px solid #333; 
              padding: 10px; 
              border-radius: 4px; 
              font-family: 'Courier New', monospace; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔐 TERMINAL HACKS</div>
              <div>Cybersecurity Learning Platform</div>
            </div>
            
            <div class="content">
              <h2>Password Reset Request</h2>
              
              <p>Hello <strong>${username}</strong>,</p>
              
              <p>We received a request to reset your password for your Terminal Hacks account. If you made this request, click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">🔄 RESET PASSWORD</a>
              </div>
              
              <div class="warning">
                <strong>⚠️ SECURITY NOTICE:</strong><br>
                • This link expires in 10 minutes<br>
                • If you didn't request this reset, ignore this email<br>
                • Your password remains unchanged unless you click the link<br>
                • Never share your password reset link with anyone
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <div class="code">${resetLink}</div>
            </div>
            
            <div class="footer">
              <p>Terminal Hacks - Cybersecurity Learning Platform<br>
              This is an automated email. Please do not reply.</p>
              
              <p>If you have questions, contact us at ${EMAIL_CONFIG.replyTo}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Password Reset Request - Terminal Hacks

Hello ${username},

We received a request to reset your password for your Terminal Hacks account.

Reset your password: ${resetLink}

This link expires in 10 minutes.

If you didn't request this reset, ignore this email.

Terminal Hacks - Cybersecurity Learning Platform
    `,
  }),

  passwordResetConfirmation: (username: string) => ({
    subject: '✅ Password Successfully Reset - Terminal Hacks',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Confirmation - Terminal Hacks</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              background-color: #0a0a0a; 
              color: #00ff41; 
              margin: 0; 
              padding: 20px; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #1a1a1a; 
              border: 2px solid #00ff41; 
              border-radius: 8px; 
              padding: 30px; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
            }
            .logo { 
              font-size: 24px; 
              font-weight: bold; 
              color: #00ff41; 
              margin-bottom: 10px; 
            }
            .content { 
              line-height: 1.6; 
              margin-bottom: 30px; 
            }
            .success { 
              background-color: #001a0a; 
              border-left: 4px solid #00ff41; 
              padding: 15px; 
              margin: 20px 0; 
              color: #99ffcc; 
            }
            .footer { 
              text-align: center; 
              font-size: 12px; 
              color: #666; 
              margin-top: 30px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✅ TERMINAL HACKS</div>
              <div>Cybersecurity Learning Platform</div>
            </div>
            
            <div class="content">
              <h2>Password Successfully Reset</h2>
              
              <p>Hello <strong>${username}</strong>,</p>
              
              <div class="success">
                <strong>✅ SUCCESS:</strong><br>
                Your password has been successfully reset and updated.
              </div>
              
              <p>Your account is now secured with your new password. You can continue learning cybersecurity on Terminal Hacks.</p>
              
              <p><strong>Security Best Practices:</strong></p>
              <ul>
                <li>Use a unique password for each account</li>
                <li>Enable two-factor authentication when available</li>
                <li>Regularly update your passwords</li>
                <li>Never share your login credentials</li>
              </ul>
              
              <p>If you didn't make this change or notice any suspicious activity, please contact our support team immediately.</p>
            </div>
            
            <div class="footer">
              <p>Terminal Hacks - Cybersecurity Learning Platform<br>
              This is an automated email. Please do not reply.</p>
              
              <p>If you have questions, contact us at ${EMAIL_CONFIG.replyTo}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Password Successfully Reset - Terminal Hacks

Hello ${username},

Your password has been successfully reset and updated.

Your account is now secured with your new password.

If you didn't make this change, please contact support immediately.

Terminal Hacks - Cybersecurity Learning Platform
    `,
  }),

  welcome: (username: string, displayName: string) => ({
    subject: '🚀 Welcome to Terminal Hacks - Start Your Cybersecurity Journey!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Terminal Hacks</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              background-color: #0a0a0a; 
              color: #00ff41; 
              margin: 0; 
              padding: 20px; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #1a1a1a; 
              border: 2px solid #00ff41; 
              border-radius: 8px; 
              padding: 30px; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
            }
            .logo { 
              font-size: 28px; 
              font-weight: bold; 
              color: #00ff41; 
              margin-bottom: 10px; 
            }
            .content { 
              line-height: 1.6; 
              margin-bottom: 30px; 
            }
            .button { 
              display: inline-block; 
              background-color: #00ff41; 
              color: #000000; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 4px; 
              font-weight: bold; 
              margin: 20px 0; 
            }
            .features { 
              background-color: #002200; 
              border: 1px solid #00ff41; 
              border-radius: 4px; 
              padding: 20px; 
              margin: 20px 0; 
            }
            .footer { 
              text-align: center; 
              font-size: 12px; 
              color: #666; 
              margin-top: 30px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🚀 WELCOME TO TERMINAL HACKS</div>
              <div>The Ultimate Cybersecurity Learning Platform</div>
            </div>
            
            <div class="content">
              <h2>Welcome aboard, ${displayName}!</h2>
              
              <p>Congratulations on joining Terminal Hacks! You've just taken the first step toward mastering cybersecurity.</p>
              
              <div class="features">
                <h3>🎯 What you can do now:</h3>
                <ul>
                  <li>🏗️ <strong>Start with Beginner Phase</strong> - Build your foundation</li>
                  <li>🧪 <strong>Interactive Labs</strong> - Hands-on practice in safe environments</li>
                  <li>🎮 <strong>Cybersecurity Games</strong> - Learn through engaging challenges</li>
                  <li>📺 <strong>Video Tutorials</strong> - Expert-led cybersecurity courses</li>
                  <li>🏆 <strong>Track Progress</strong> - Monitor your learning journey</li>
                  <li>🔥 <strong>Build Streaks</strong> - Maintain consistent learning habits</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="${EMAIL_CONFIG.baseUrl}/overview" class="button">🎯 START LEARNING</a>
              </div>
              
              <p><strong>Pro Tips for Success:</strong></p>
              <ul>
                <li>Set aside 30 minutes daily for consistent progress</li>
                <li>Join our community discussions and ask questions</li>
                <li>Complete labs to reinforce theoretical knowledge</li>
                <li>Track your streak to stay motivated</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>Terminal Hacks - Cybersecurity Learning Platform<br>
              Username: <strong>${username}</strong></p>
              
              <p>Need help? Contact us at ${EMAIL_CONFIG.replyTo}</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to Terminal Hacks!

Hello ${displayName},

Congratulations on joining Terminal Hacks! You've just taken the first step toward mastering cybersecurity.

Start learning: ${EMAIL_CONFIG.baseUrl}/overview

Your username: ${username}

Need help? Contact us at ${EMAIL_CONFIG.replyTo}

Terminal Hacks - Cybersecurity Learning Platform
    `,
  }),
};

// Email service class
export class EmailService {
  static async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    username: string
  ): Promise<void> {
    const resetLink = `${EMAIL_CONFIG.baseUrl}/reset-password?token=${resetToken}`;
    const { subject, html, text } = emailTemplates.passwordReset(resetLink, username);

    try {
      const result = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: email,
        subject,
        html,
        text,
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log('✅ Password reset email sent:', result.data?.id);
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  static async sendPasswordResetConfirmationEmail(
    email: string,
    username: string
  ): Promise<void> {
    const { subject, html, text } = emailTemplates.passwordResetConfirmation(username);

    try {
      const result = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: email,
        subject,
        html,
        text,
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log('✅ Password reset confirmation email sent:', result.data?.id);
    } catch (error) {
      console.error('❌ Failed to send password reset confirmation email:', error);
      // Don't throw error for confirmation emails
    }
  }

  static async sendWelcomeEmail(
    email: string,
    username: string,
    displayName: string
  ): Promise<void> {
    const { subject, html, text } = emailTemplates.welcome(username, displayName);

    try {
      const result = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: email,
        subject,
        html,
        text,
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log('✅ Welcome email sent:', result.data?.id);
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      // Don't throw error for welcome emails
    }
  }
}

export default EmailService;