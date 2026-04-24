const nodemailer = require('nodemailer');

require('dotenv').config();

const sendEmail = async (email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {

                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS
            }
        });

        // Link yang akan diklik user di email
        const verificationLink = `http://localhost:5000/users/verifikasi-email?token=${token}`;

        await transporter.sendMail({
            from: `"EduCourse App" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Verifikasi Akun EduCourse App Anda",
            html: `
                <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #1a202c;">Selamat datang di EduCourse! 🚀</h2>
                    <p style="color: #4a5568; line-height: 1.6;">Terima kasih telah mendaftar. Untuk mulai belajar dan mengamankan akun Anda, silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationLink}" style="background-color: #3ECF4C; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verifikasi Email Saya</a>
                    </div>
                    
                    <p style="color: #718096; font-size: 12px;">Atau copy dan paste link berikut di browser Anda:<br>
                    <a href="${verificationLink}" style="color: #3182ce; word-break: break-all;">${verificationLink}</a></p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="color: #a0aec0; font-size: 11px; text-align: center;">Jika Anda tidak merasa mendaftar di EduCourse, abaikan email ini.</p>
                </div>
            `
        });
        console.log(`Email verifikasi berhasil dikirim ke: ${email}`);
    } catch (error) {
        console.error("Gagal mengirim email verifikasi:", error);
    }
};

module.exports = sendEmail;