import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",// Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
    },
});

export const sendOtpMail = async (email, otp) => {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: process.env.USER_EMAIL, // sender address
        to: `${email}`, // list of receivers
        subject: "OTP - Happy Inspector", // Subject line
        html: `<p>Enter <b>${otp}</b> in the app to Verify your email address and complete signup.</p> <br/> <p>This code <b>expires in 60 sec.</b></p>`, // html body
    });

    // console.log("Message sent: %s", info.messageId);
}

// sendOtpMail().catch(console.error);