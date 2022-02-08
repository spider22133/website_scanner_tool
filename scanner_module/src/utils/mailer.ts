import nodemailer from 'nodemailer';
import { Website } from '@interfaces/website.interface';

const mailer = async (website: Website, status: number, msg: string) => {
  // Generate test SMTP service account from ethereal.email
  const testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'error@web-tool.com',
    to: 'e.schlosser.de@gmail.de',
    subject: `Fehler ist auf ${website.name} aufgetreten`,
    text: `Status code: ${status}; Website name: ${website.name}; Error message: ${msg}; Website URL: ${website.url};`, // plain text body
    html: `<b>Status code: ${status}</b><br><p>Website name: ${website.name}</p><br><p>Website URL: ${website.url}</p><br><p>Error message: ${msg}</p>`, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Preview only available when sending through an Ethereal account
  // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

export default mailer;
