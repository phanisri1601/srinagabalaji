// Email service using Firebase's built-in email functionality
// Firebase provides free email sending with generous limits

export interface EmailService {
  sendOTP: (email: string, otp: string) => Promise<boolean>;
}

// Firebase Email Service - FREE and built-in
export const firebaseEmailService: EmailService = {
  async sendOTP(email: string, otp: string): Promise<boolean> {
    try {
      console.log(`📧 Sending OTP via Firebase to ${email}: ${otp}`);
      
      // Option 1: Use Firebase Functions (Recommended)
      const firebaseFunctionResponse = await fetch('https://your-project-name.cloudfunctions.net/sendOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          otp: otp,
          subject: 'Your OTP Code for Naga Balaji Tiffin',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center;">
                <h1 style="margin: 0 0 20px 0; font-size: 24px;">🍱 Naga Balaji Tiffin</h1>
                <h2 style="margin: 0 0 10px 0; font-size: 18px;">Your OTP Code</h2>
                <div style="background: white; color: #10b981; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 3px; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="margin: 20px 0 0 0; color: #6b7280;">This code will expire in 10 minutes.</p>
                <p style="margin: 0; color: #9ca3af; font-size: 14px;">If you didn't request this, please ignore this email.</p>
              </div>
            </div>
          `
        })
      });

      if (firebaseFunctionResponse.ok) {
        console.log('Email sent successfully via Firebase Functions');
        return true;
      }

      // Option 2: Use Firebase Extensions (Easiest)
      const extensionResponse = await fetch('https://us-central1-your-project-name.cloudfunctions.net/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          message: {
            subject: 'Your OTP Code for Naga Balaji Tiffin',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center;">
                  <h1 style="margin: 0 0 20px 0; font-size: 24px;">🍱 Naga Balaji Tiffin</h1>
                  <h2 style="margin: 0 0 10px 0; font-size: 18px;">Your OTP Code</h2>
                  <div style="background: white; color: #10b981; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 3px; margin: 20px 0;">
                    ${otp}
                  </div>
                  <p style="margin: 20px 0 0 0; color: #6b7280;">This code will expire in 10 minutes.</p>
                  <p style="margin: 0; color: #9ca3af; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                </div>
              </div>
            `
          }
        })
      });

      if (extensionResponse.ok) {
        console.log('Email sent successfully via Firebase Extension');
        return true;
      }

      // Option 3: Use Resend API (Alternative)
      const resendResponse = await fetch('https://api.resend.com/v1/email', {
        method: 'POST',
        headers: {
          'Authorization': 're_api_key_here',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: [email],
          subject: 'Your OTP Code for Naga Balaji Tiffin',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center;">
                <h1 style="margin: 0 0 20px 0; font-size: 24px;">🍱 Naga Balaji Tiffin</h1>
                <h2 style="margin: 0 0 10px 0; font-size: 18px;">Your OTP Code</h2>
                <div style="background: white; color: #10b981; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 3px; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="margin: 20px 0 0 0; color: #6b7280;">This code will expire in 10 minutes.</p>
                <p style="margin: 0; color: #9ca3af; font-size: 14px;">If you didn't request this, please ignore this email.</p>
              </div>
            </div>
          `
        })
      });

      if (resendResponse.ok) {
        console.log('Email sent successfully via Resend');
        return true;
      }

      console.error('All Firebase email services failed');
      return false;

    } catch (error) {
      console.error('Firebase email service error:', error);
      return false;
    }
  }
};

// Development version - shows OTP in console
export const developmentEmailService: EmailService = {
  async sendOTP(email: string, otp: string): Promise<boolean> {
    console.log(`📧 Firebase Development Mode: OTP for ${email}: ${otp}`);
    console.log('In production, this will be sent via Firebase email service');
    console.log('Firebase Free Tier: 100 emails/day, 1 email/second');
    return true; // For development
  }
};

// Auto-select service based on environment
export const emailService: EmailService = 
  process.env.NODE_ENV === 'production' 
    ? firebaseEmailService 
    : developmentEmailService;
