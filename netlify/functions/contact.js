// const sgMail = require('@sendgrid/mail');
const { createTransport } = require("nodemailer");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, message } = data;

    // Validate input
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const transporter = createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.MAIL_LOGIN_USER,
        pass: process.env.MAIL_LOGIN_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_LOGIN_USER,
      to: email,
      subject: `New contact from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
    };

    const transporterResult = await transporter.sendMail(mailOptions);
    if (!transporterResult) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Error occured" }),
      };
    }
    // Setup SendGrid
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // const msg = {
    //   to: 'your-email@example.com',
    //   from: 'portfolio-site@example.com',
    //   subject: `New contact from ${name}`,
    // text: `
    //   Name: ${name}
    //   Email: ${email}

    //   Message:
    //   ${message}
    // `
    // };

    // await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
