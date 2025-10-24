import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your preferred email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Rate limiting (simple implementation)
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    // You can implement more sophisticated rate limiting here

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      replyTo: email, // Allow direct reply to sender
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0; text-align: center;">New Contact Form Submission</h2>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <h3 style="color: #333;">Message</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
              <p style="margin: 0; color: #1976d2; font-size: 14px;">
                <strong>Note:</strong> This message was sent from your portfolio contact form. 
                You can reply directly to this email to respond to ${name}.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
        
        ---
        This message was sent from your portfolio contact form.
        You can reply directly to this email to respond to ${name}.
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to the sender
    const confirmationOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Mohammed Bel Ouarraq',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0; text-align: center;">Message Received!</h2>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin-top: 0;">Hello ${name},</h3>
              <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
              
              <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #1976d2;">Your Message Summary:</h4>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</p>
              </div>
              
              <p>I typically respond within 24 hours. If you have any urgent inquiries, feel free to reach out via:</p>
              <ul>
                <li>📧 Email: medbelouarraq@gmail.com</li>
                <li>📱 Phone: +212 688 191 812</li>
                <li>💼 LinkedIn: <a href="https://www.linkedin.com/in/mohammed-bel-ouarraq-554057218/" style="color: #0077b5;">Mohammed Bel Ouarraq</a></li>
              </ul>
              
              <p>Best regards,<br><strong>Mohammed Bel Ouarraq</strong><br>Computer Science Engineering Student</p>
            </div>
          </div>
        </div>
      `,
      text: `
        Hello ${name},
        
        Thank you for reaching out! I've received your message and will get back to you as soon as possible.
        
        Your Message Summary:
        Subject: ${subject}
        Message: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}
        
        I typically respond within 24 hours. If you have any urgent inquiries, feel free to reach out via:
        - Email: medbelouarraq@gmail.com
        - Phone: +212 688 191 812
        - LinkedIn: Mohammed Bel Ouarraq
        
        Best regards,
        Mohammed Bel Ouarraq
        Computer Science Engineering Student
      `,
    };

    await transporter.sendMail(confirmationOptions);

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
