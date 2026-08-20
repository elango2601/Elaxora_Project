import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { type, to, data } = await request.json();

    if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
      console.warn('Resend API key missing, simulating email send.');
      return NextResponse.json({ success: true, simulated: true });
    }

    let subject = '';
    let html = '';

    if (type === 'WELCOME') {
      subject = 'Welcome to Elaxora Solutions! 🚀';
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #fbbf24;">Welcome to Elaxora Solutions!</h1>
          <p style="color: #d4d4d8; font-size: 16px; line-height: 1.6;">Hi there,</p>
          <p style="color: #d4d4d8; font-size: 16px; line-height: 1.6;">Thank you for creating an account with Elaxora Solutions. We are excited to help you build your custom projects!</p>
          <div style="margin: 30px 0;">
            <a href="https://elaxorasolutions.com/student/login" style="background: linear-gradient(135deg, #d97706 0%, #fbbf24 100%); color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">Access Your Portal</a>
          </div>
          <p style="color: #a1a1aa; font-size: 14px;">If you have any questions, just reply to this email.</p>
        </div>
      `;
    } else if (type === 'ENQUIRY') {
      subject = `Your Enquiry was Received! (${data.enqShortId})`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #fbbf24;">Enquiry Received!</h1>
          <p style="color: #d4d4d8; font-size: 16px; line-height: 1.6;">Hi ${data.name},</p>
          <p style="color: #d4d4d8; font-size: 16px; line-height: 1.6;">We have successfully received your project enquiry.</p>
          <div style="background: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #a1a1aa; font-size: 14px;">Enquiry ID:</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #fbbf24;">${data.enqShortId}</p>
          </div>
          <p style="color: #d4d4d8; font-size: 16px; line-height: 1.6;">Our engineers are reviewing your requirements and will generate a price quote shortly. You can track this in your Student Dashboard.</p>
          <p style="color: #a1a1aa; font-size: 14px;">Thank you for choosing Elaxora Solutions.</p>
        </div>
      `;
    }

    const { data: responseData, error } = await resend.emails.send({
      from: 'Elaxora Solutions <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
