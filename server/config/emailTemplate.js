import nodemailer from "nodemailer";
export const sendEmailtoUser = (link, email, res) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Email Verification Request",
        html: `
        <html lang="en-US">
            <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>Reset Password Email Template</title>
                <meta name="description" content="Reset Password Email Template.">
            </head>
            <body>
                <p>Please click on the below link to verify your account.</p>
                <a href="${link}" style="background:#20e277;text-decoration:none;">Verify Email</a>
            </body>
        </html>`,
    };

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(400).json({ message: "Error sending email" });
        }
        return res.status(200).json({ message: "Email Sent" });
    });
};

