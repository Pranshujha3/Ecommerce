import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.RESEND_API){
    process.exit(1);
}

const resend = new Resend(process.env.RESEND_API);
console.log("Current API Key:", process.env.RESEND_API_KEY);

const sendEmail = async({sendTo, subject, html}) => {
    try {
        const { data, error } = await resend.emails.send({
    from: "binkeyit <onboarding@resend.dev>",
    to: "pranshujha3@gmail.com",
    subject: subject,
    html: html,
        });
          if (error) {
    return console.error({ error });
  }

  return data

    } catch (error) {
        console.log(error)
    }
}

export default sendEmail
