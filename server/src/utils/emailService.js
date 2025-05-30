const { Resend } = require("resend");

// Don't initialize Resend in test environment or if no API key
const resend =
  process.env.NODE_ENV !== "test" && process.env.RESEND_KEY
    ? new Resend(process.env.RESEND_KEY)
    : null;

/**
 * Email service for sending various types of emails
 */
class EmailService {
  /**
   * Send password reset email
   * @param {string} email - Recipient email address
   * @param {string} resetToken - Password reset token
   * @param {string} username - User's username
   */
  static async sendPasswordResetEmail(email, resetToken, username) {
    try {
      // In test environment, simulate successful email sending
      if (process.env.NODE_ENV === "test") {
        console.log(
          `[TEST] Would send password reset email to ${email} for ${username}`
        );
        return { success: true, messageId: "test-message-id" };
      }

      // Check if Resend is configured
      if (!resend) {
        throw new Error("Email service not configured - missing RESEND_KEY");
      }

      const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset - Hack The World</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              background-color: #ffffff;
              color: #1a1a1a;
              margin: 0;
              padding: 20px;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border: 2px solid #16a34a;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(22, 163, 74, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #16a34a;
              padding-bottom: 20px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #16a34a;
              text-shadow: none;
              margin-bottom: 8px;
            }
            .tagline {
              color: #374151;
              font-size: 14px;
              margin: 0;
            }
            .content {
              line-height: 1.7;
              color: #1f2937;
            }
            .content h2 {
              color: #16a34a;
              font-size: 24px;
              margin-bottom: 20px;
              border-bottom: 1px solid #d1fae5;
              padding-bottom: 10px;
            }
            .reset-button {
              display: inline-block;
              background: linear-gradient(135deg, #16a34a, #22c55e);
              color: #ffffff;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin: 25px 0;
              text-align: center;
              box-shadow: 0 4px 6px rgba(22, 163, 74, 0.3);
              transition: all 0.3s ease;
            }
            .reset-button:hover {
              background: linear-gradient(135deg, #15803d, #16a34a);
              box-shadow: 0 6px 8px rgba(22, 163, 74, 0.4);
            }
            .security-notice {
              background: linear-gradient(135deg, #fef3c7, #fde68a);
              border-left: 4px solid #f59e0b;
              padding: 20px;
              margin: 25px 0;
              border-radius: 0 6px 6px 0;
              color: #92400e;
            }
            .security-notice h3 {
              color: #d97706;
              margin-top: 0;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
            }
            .security-notice ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            .security-notice li {
              margin: 8px 0;
            }
            .url-box {
              background-color: #f3f4f6;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              padding: 12px;
              word-break: break-all;
              color: #16a34a;
              font-weight: 600;
              margin: 15px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
            .cyber-accent {
              color: #16a34a;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️ HACK THE WORLD</div>
              <p class="tagline">Cybersecurity Learning Platform</p>
            </div>

            <div class="content">
              <h2>🔐 Password Reset Request</h2>

              <p>Hello <strong class="cyber-accent">${username}</strong>,</p>

              <p>We received a request to reset your password for your <span class="cyber-accent">Hack The World</span> account. If you made this request, click the button below to reset your password:</p>

              <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button" target="_blank" style="color: !#ffffff;">🔑 RESET PASSWORD</a>
              </div>

              <p>Or copy and paste this link into your browser:</p>
              <div class="url-box">${resetUrl}</div>

              <div class="security-notice">
                <h3>⚠️ Security Notice</h3>
                <ul>
                  <li><strong>This link will expire in 10 minutes</strong> for security</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                  <li>Always verify the URL before entering your password</li>
                </ul>
              </div>

              <p>If the button doesn't work, you can also reset your password by going to the login page and clicking "Forgot Password".</p>

              <p><strong>Stay secure,</strong><br>
              <span class="cyber-accent">The Hack The World Team</span> 🚀</p>
            </div>

            <div class="footer">
              <p>This email was sent to <strong>${email}</strong></p>
              <p>© 2025 Hack The World. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textContent = `
🛡️ HACK THE WORLD - Password Reset Request

Hello ${username},

We received a request to reset your password for your Hack The World account.

Reset your password by clicking this link:
${resetUrl}

⚠️ SECURITY NOTICE:
- This link expires in 10 minutes
- If you didn't request this reset, ignore this email
- Never share this link with anyone

Stay secure,
The Hack The World Team

---
This email was sent to ${email}
© 2025 Hack The World. All rights reserved.
      `;

      const { data, error } = await resend.emails.send({
        from: "Terminal Hacks <noreply@terminalhacks.space>",
        to: [email],
        subject: "🛡️ Password Reset - Hack The World",
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        console.error("Email sending error:", error);
        throw new Error("Failed to send password reset email");
      }

      console.log("Password reset email sent successfully:", data);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error("Email service error:", error);
      throw error;
    }
  }

  /**
   * Send password reset confirmation email
   * @param {string} email - Recipient email address
   * @param {string} username - User's username
   */
  static async sendPasswordResetConfirmationEmail(email, username) {
    try {
      // In test environment, simulate successful email sending
      if (process.env.NODE_ENV === "test") {
        console.log(
          `[TEST] Would send password reset confirmation email to ${email} for ${username}`
        );
        return { success: true, messageId: "test-confirmation-message-id" };
      }

      // Check if Resend is configured
      if (!resend) {
        throw new Error("Email service not configured - missing RESEND_KEY");
      }

      const loginUrl = `${process.env.CLIENT_URL}/login`;
      const dashboardUrl = `${process.env.CLIENT_URL}/dashboard`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset Successful - Hack The World</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              background-color: #ffffff;
              color: #1a1a1a;
              margin: 0;
              padding: 20px;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border: 2px solid #16a34a;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(22, 163, 74, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #16a34a;
              padding-bottom: 20px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #16a34a;
              text-shadow: none;
              margin-bottom: 8px;
            }
            .tagline {
              color: #374151;
              font-size: 14px;
              margin: 0;
            }
            .content {
              line-height: 1.7;
              color: #1f2937;
            }
            .content h2 {
              color: #16a34a;
              font-size: 24px;
              margin-bottom: 20px;
              border-bottom: 1px solid #d1fae5;
              padding-bottom: 10px;
            }
            .success-banner {
              background: linear-gradient(135deg, #d1fae5, #a7f3d0);
              border: 2px solid #16a34a;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
              text-align: center;
              color: #065f46;
            }
            .success-banner h3 {
              color: #16a34a;
              margin-top: 0;
              margin-bottom: 10px;
              font-size: 20px;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #16a34a, #22c55e);
              color: #ffffff;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin: 15px 10px;
              text-align: center;
              box-shadow: 0 4px 6px rgba(22, 163, 74, 0.3);
            }
            .cta-button:hover {
              background: linear-gradient(135deg, #15803d, #16a34a);
              box-shadow: 0 6px 8px rgba(22, 163, 74, 0.4);
            }
            .security-tips {
              background: linear-gradient(135deg, #eff6ff, #dbeafe);
              border-left: 4px solid #3b82f6;
              padding: 20px;
              margin: 25px 0;
              border-radius: 0 6px 6px 0;
              color: #1e40af;
            }
            .security-tips h3 {
              color: #2563eb;
              margin-top: 0;
              margin-bottom: 15px;
            }
            .security-tips ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            .security-tips li {
              margin: 8px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
            .cyber-accent {
              color: #16a34a;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛡️ HACK THE WORLD</div>
              <p class="tagline">Cybersecurity Learning Platform</p>
            </div>

            <div class="content">
              <div class="success-banner">
                <h3>✅ Password Reset Successfully!</h3>
                <p>Your password has been securely updated.</p>
              </div>

              <h2>🔐 Security Confirmation</h2>

              <p>Hello <strong class="cyber-accent">${username}</strong>,</p>

              <p>This email confirms that your password for your <span class="cyber-accent">Hack The World</span> account has been <strong>successfully reset</strong> on <strong>${new Date().toLocaleString()}</strong>.</p>

              <p>You can now log in with your new password and continue your cybersecurity learning journey:</p>

              <div style="text-align: center;">
                <a href="${dashboardUrl}" class="cta-button">🚀 GO TO DASHBOARD</a>
                <a href="${loginUrl}" class="cta-button">🔑 LOGIN PAGE</a>
              </div>

              <div class="security-tips">
                <h3>🛡️ Security Best Practices</h3>
                <ul>
                  <li><strong>Use a unique password</strong> that you don't use anywhere else</li>
                  <li><strong>Enable two-factor authentication</strong> when available</li>
                  <li><strong>Never share your password</strong> with anyone</li>
                  <li><strong>Log out from shared devices</strong> after use</li>
                  <li><strong>Report suspicious activity</strong> immediately</li>
                </ul>
              </div>

              <p><strong>If you did not initiate this password reset</strong>, please contact our security team immediately at <a href="mailto:security@terminalhacks.space" style="color: #dc2626; font-weight: bold;">security@terminalhacks.space</a></p>

              <p><strong>Keep hacking securely,</strong><br>
              <span class="cyber-accent">The Hack The World Team</span> 🚀</p>
            </div>

            <div class="footer">
              <p>This email was sent to <strong>${email}</strong></p>
              <p>© 2025 Hack The World. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textContent = `
🛡️ HACK THE WORLD - Password Reset Confirmation

✅ PASSWORD RESET SUCCESSFULLY!

Hello ${username},

This email confirms that your password for your Hack The World account has been successfully reset on ${new Date().toLocaleString()}.

You can now log in with your new password:
${loginUrl}

🛡️ SECURITY BEST PRACTICES:
- Use a unique password that you don't use anywhere else
- Enable two-factor authentication when available
- Never share your password with anyone
- Log out from shared devices after use
- Report suspicious activity immediately

⚠️ If you did not initiate this password reset, please contact our security team immediately at security@terminalhacks.space

Keep hacking securely,
The Hack The World Team

---
This email was sent to ${email}
© 2025 Hack The World. All rights reserved.
      `;

      const { data, error } = await resend.emails.send({
        from: "Terminal Hacks <noreply@terminalhacks.space>",
        to: [email],
        subject: "✅ Password Reset Successful - Hack The World",
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        console.error(
          "Password reset confirmation email sending error:",
          error
        );
        throw new Error("Failed to send password reset confirmation email");
      }

      console.log("Password reset confirmation email sent successfully:", data);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error("Email service error:", error);
      throw error;
    }
  }

  /**
   * Send welcome email to new users
   * @param {string} email - Recipient email address
   * @param {string} username - User's username
   */
  static async sendWelcomeEmail(email, username) {
    try {
      // In test environment, simulate successful email sending
      if (process.env.NODE_ENV === "test") {
        console.log(
          `[TEST] Would send welcome email to ${email} for ${username}`
        );
        return { success: true, messageId: "test-welcome-message-id" };
      }

      // Check if Resend is configured
      if (!resend) {
        throw new Error("Email service not configured - missing RESEND_KEY");
      }

      const dashboardUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard`;
      const loginUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/login`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Hack The World</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #ffffff;
              color: #1f2937;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #059669 0%, #047857 100%);
              color: #ffffff;
              text-align: center;
              padding: 40px 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 8px;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            .tagline {
              font-size: 16px;
              color: #d1fae5;
              margin: 0;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 24px;
              color: #065f46;
              margin-bottom: 20px;
              font-weight: 600;
            }
            .intro-text {
              font-size: 16px;
              color: #374151;
              margin-bottom: 30px;
            }
            .features-section {
              background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
              border: 2px solid #bbf7d0;
              border-radius: 8px;
              padding: 25px;
              margin: 30px 0;
            }
            .features-title {
              font-size: 20px;
              color: #065f46;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .features-list {
              list-style: none;
              padding: 0;
            }
            .features-list li {
              background-color: #ffffff;
              margin: 8px 0;
              padding: 12px 15px;
              border-radius: 6px;
              border-left: 4px solid #059669;
              color: #374151;
              font-weight: 500;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .cta-section {
              text-align: center;
              margin: 40px 0;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #059669 0%, #047857 100%);
              color: #ffffff;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
              margin: 10px;
              box-shadow: 0 4px 6px rgba(5, 150, 105, 0.3);
              transition: all 0.3s ease;
            }
            .cta-button:hover {
              background: linear-gradient(135deg, #047857 0%, #065f46 100%);
              transform: translateY(-2px);
              box-shadow: 0 6px 8px rgba(5, 150, 105, 0.4);
            }
            .welcome-message {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
              text-align: center;
            }
            .cyber-accent {
              color: #059669;
              font-weight: bold;
            }
            .footer {
              background-color: #f8fafc;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              padding: 25px 30px;
              color: #6b7280;
              font-size: 14px;
            }
            .footer strong {
              color: #374151;
            }
            @media (max-width: 600px) {
              .content { padding: 30px 20px; }
              .header { padding: 30px 20px; }
              .logo { font-size: 28px; }
              .greeting { font-size: 22px; }
              .cta-button {
                display: block;
                margin: 10px 0;
                width: 100%;
                max-width: 280px;
                margin-left: auto;
                margin-right: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo">🛡️ HACK THE WORLD</div>
              <p class="tagline">Elite Cybersecurity Learning Platform</p>
            </div>

            <div class="content">
              <h1 class="greeting">Welcome aboard, ${username}! 🎯</h1>

              <p class="intro-text">
                You've just joined the most comprehensive cybersecurity learning platform designed for hackers, security professionals, and aspiring cybersecurity experts. Get ready to hack your way to expertise!
              </p>

              <div class="features-section">
                <h2 class="features-title">🚀 What's waiting for you:</h2>
                <ul class="features-list">
                  <li>🎮 Interactive security games and challenges with real-time scoring</li>
                  <li>🔬 Hands-on labs with real-world cybersecurity scenarios</li>
                  <li>📚 Progressive learning paths from beginner to expert levels</li>
                  <li>🏆 Achievement system, badges, and global leaderboards</li>
                  <li>🖥️ Terminal-based learning experiences with actual tools</li>
                  <li>🎯 Personalized curriculum based on your skill level</li>
                </ul>
              </div>

              <div class="welcome-message">
                <p><strong>🎊 Your cybersecurity journey starts here!</strong></p>
                <p>From penetration testing to threat analysis, from cryptography to network security – master it all through practical, hands-on learning.</p>
              </div>

              <div class="cta-section">
                <a href="${dashboardUrl}" class="cta-button">🚀 START LEARNING</a>
                <a href="${loginUrl}" class="cta-button">🔑 LOGIN TO PLATFORM</a>
              </div>

              <p style="color: #374151; text-align: center; margin-top: 30px;">
                Ready to begin your cybersecurity adventure? Your elite training starts now! 💪
              </p>

              <p style="margin-top: 30px; color: #374151;">
                <strong>Happy hacking,</strong><br>
                <span class="cyber-accent">The Hack The World Team</span> 🚀
              </p>
            </div>

            <div class="footer">
              <p>This email was sent to <strong>${email}</strong></p>
              <p>© 2025 Hack The World. All rights reserved.</p>
              <p>If you have any questions, contact us at <a href="mailto:support@terminalhacks.space" style="color: #059669;">support@terminalhacks.space</a></p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textContent = `
🛡️ HACK THE WORLD - Welcome to Elite Cybersecurity Training!

🎯 WELCOME ABOARD, ${username}!

You've just joined the most comprehensive cybersecurity learning platform designed for hackers, security professionals, and aspiring cybersecurity experts.

🚀 WHAT'S WAITING FOR YOU:
• 🎮 Interactive security games and challenges with real-time scoring
• 🔬 Hands-on labs with real-world cybersecurity scenarios
• 📚 Progressive learning paths from beginner to expert levels
• 🏆 Achievement system, badges, and global leaderboards
• 🖥️ Terminal-based learning experiences with actual tools
• 🎯 Personalized curriculum based on your skill level

🎊 Your cybersecurity journey starts here!
From penetration testing to threat analysis, from cryptography to network security – master it all through practical, hands-on learning.

Ready to begin your cybersecurity adventure? Your elite training starts now!

🚀 Start Learning: ${dashboardUrl}
🔑 Login to Platform: ${loginUrl}

Happy hacking,
The Hack The World Team 🚀

---
This email was sent to ${email}
© 2025 Hack The World. All rights reserved.
If you have any questions, contact us at support@terminalhacks.space
      `;

      const { data, error } = await resend.emails.send({
        from: "Terminal Hacks <noreply@terminalhacks.space>",
        to: [email],
        subject:
          "🛡️ Welcome to Hack The World - Your Elite Cybersecurity Journey Begins!",
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        console.error("Welcome email sending error:", error);
        throw new Error("Failed to send welcome email");
      }

      console.log("Welcome email sent successfully:", data);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error("Email service error:", error);
      throw error;
    }
  }
}

module.exports = EmailService;
