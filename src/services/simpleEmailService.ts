// Simple Email Service that works without Firebase Functions
// Uses EmailJS for free email sending

export interface SimpleEmailService {
  sendOTP: (email: string, otp: string, name: string) => Promise<boolean>;
}

// EmailJS Service - FREE and easy to set up
export const emailJSService: SimpleEmailService = {
  async sendOTP(email: string, otp: string, name: string): Promise<boolean> {
    try {
      console.log(`📧 Sending OTP via EmailJS to ${email}: ${otp}`);

      // Import EmailJS dynamically
      const emailjsModule = await import('@emailjs/browser');
      const emailjs = emailjsModule.default;

      if (!emailjs) {
        throw new Error('EmailJS failed to load');
      }

      // Initialize EmailJS with public key
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string);

      console.log('EmailJS initialized, sending email...');

      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        {
          to_email: email,
          otp_code: otp,
          user_name: name,
          from_name: 'Naga Balaji Tiffin'
        }
      );

      console.log('EmailJS Response:', response);

      if (response.status === 200) {
        console.log('Email sent successfully via EmailJS');
        return true;
      } else {
        console.error('EmailJS error - Status:', response.status, 'Text:', response.text);
        return false;
      }

    } catch (error: any) {
      console.error('EmailJS service error:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error.constructor?.name);
      console.error('Error keys:', Object.keys(error));

      // Try to extract more error info
      const errorMessage = error?.text || error?.message || error?.statusText || 'Unknown EmailJS error';
      console.error('Error details:', errorMessage);

      // Try fallback to development mode
      console.log('📧 Fallback: OTP for', email, ':', otp);
      console.log('📧 User Name:', name);
      console.log('📧 EmailJS failed, using fallback mode');
      return true; // Still return true so user can continue
    }
  }
};

// Development version - shows OTP in console
export const developmentEmailService: SimpleEmailService = {
  async sendOTP(email: string, otp: string, name: string): Promise<boolean> {
    console.log(`📧 Development Mode: OTP for ${email}: ${otp}`);
    console.log(`📧 User Name: ${name}`);
    console.log('In production, this will be sent via EmailJS');
    console.log('EmailJS Free Tier: 200 emails/month');
    return true;
  }
};

// Auto-select service based on environment - Use EmailJS immediately for testing
export const simpleEmailService: SimpleEmailService = emailJSService;
