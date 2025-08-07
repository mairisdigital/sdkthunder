import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// POST - Sūtīt e-pastu no kontaktformas
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validācija
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Visi obligātie lauki ir nepieciešami' },
        { status: 400 }
      );
    }

    // Email validācija
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Nepareizs e-pasta formāts' },
        { status: 400 }
      );
    }

    // SMTP konfigurācija
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // E-pasta saturs administratoram
    const adminMailOptions = {
      from: `"SDKThunder Kontaktforma" <${process.env.SMTP_USER}>`,
      to: ['imants@sdkthunder.com', 'andrejs@sdkthunder.com'],
      subject: subject ? `Kontaktforma: ${subject}` : 'Jauna ziņa no SDKThunder mājas lapas',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #dc2626; margin: 0;">SDKThunder</h2>
            <p style="color: #666; margin: 5px 0;">Jauna ziņa no mājas lapas</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Kontaktinformācija</h3>
            <p><strong>Vārds:</strong> ${name}</p>
            <p><strong>E-pasts:</strong> ${email}</p>
            <p><strong>Temats:</strong> ${subject || 'Nav norādīts'}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #dc2626; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Ziņa</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
            <p>Šī ziņa tika nosūtīta no SDKThunder mājas lapas kontaktformas</p>
            <p>Laiks: ${new Date().toLocaleString('lv-LV', { timeZone: 'Europe/Riga' })}</p>
          </div>
        </div>
      `,
      replyTo: email
    };

    // Apstiprinājuma e-pasts sūtītājam
    const confirmationMailOptions = {
      from: `"SDKThunder" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Paldies par ziņu - SDKThunder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #dc2626; margin: 0;">SDKThunder</h2>
          </div>
          
          <h3 style="color: #333;">Sveiks, ${name}!</h3>
          
          <p style="line-height: 1.6; color: #555;">
            Paldies, ka sazinājies ar mums! Mēs esam saņēmuši tavu ziņu un drīzumā ar tevi sazināsimies.
          </p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #333; margin-top: 0;">Tava ziņa:</h4>
            <p style="margin: 0; font-style: italic;">"${message.substring(0, 150)}${message.length > 150 ? '...' : ''}"</p>
          </div>
          
          <p style="line-height: 1.6; color: #555;">
            Ja tev ir steidzams jautājums, vari sazināties ar mums arī tieši:
          </p>
          
          <ul style="color: #555;">
            <li>📧 imants@sdkthunder.com</li>
            <li>📧 andrejs@sdkthunder.com</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #dc2626; font-weight: bold; margin: 0;">
              Viens par visiem, visi par vienu!
            </p>
          </div>
          
          <div style="text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
            <p>Ar cieņu, SDKThunder komanda</p>
          </div>
        </div>
      `
    };

    // Sūtām e-pastus
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(confirmationMailOptions)
    ]);

    return NextResponse.json(
      { 
        success: true, 
        message: 'E-pasts veiksmīgi nosūtīts!' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Kļūda sūtot e-pastu. Lūdzu, mēģiniet vēlreiz.' },
      { status: 500 }
    );
  }
}
