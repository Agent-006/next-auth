import User from '@/models/user.model';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({email, emailType, userID}:any)=> {
    try {
        const hashedToken = await bcryptjs.hash(userID.toString(), 10);

        if(emailType === 'VERIFY'){
          await User.findByIdAndUpdate(
            userID,
            {
              verifyToken: hashedToken,
              verifyTokenExpiry: Date.now() + 3600000
            }
          )
        } else if(emailType === 'RESET'){
          await User.findByIdAndUpdate(
            userID,
            {
              forgotPasswordToken: hashedToken,
              forgotPasswordTokenExpiry: Date.now() + 3600000
            }
          )
        }
        
        
        const transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "54bbae44950389", // ❌
            pass: "1ca495e5a23218" // ❌
          }
        });

        const verifyMail = `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to
        ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
        or copy and paste the link below in your browser.
        <br>
        ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
        </p>`

        const resetMail = `<p>Click <a href="${process.env.DOMAIN}/forgotpassword?token=${hashedToken}">here</a> to
        ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
        or copy and paste the link below in your browser.
        <br>
        ${process.env.DOMAIN}/forgotpassword?token=${hashedToken}
        </p>`

        const mainOptions = {
          from: 'sagarghosh0610@gmail.com', // sender address
          to: email, // list of receivers
          subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", //Subject line
          html: emailType === "VERIFY" ? verifyMail : resetMail, // html body
        }

        const mailResponse = await transport.sendMail(mainOptions)

        return mailResponse;
    } catch (error:any) {
        throw new Error(error.message)
    }
}