import nodemailer from "nodemailer";

export default async function handler(req, res) {
            console.log('mail recieved');
  if (req.method === "POST") {
    const { name, email, message, sendLink } = req.body;
    const currentToolPath = sendLink ? req.headers.referer : "Not Provided";

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: "ajay491998@gmail.com", // Replace with your Zoho Mail email address
          pass: "KmvEY5Jr7NTwMc1A", // Replace with your Zoho Mail password
        },
      });

      const info = await transporter.sendMail({
        from: email,
        to: "ltsaayushk193@gmail.com", // Replace with your recipient email address
        subject: "Bug Report",
        text: `
          Name: ${name}
          Email: ${email}
          Message: ${message}
          Tool: ${currentToolPath}
        `,
      });

      console.log("Email sent successfully", info);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);

      res.status(500).json({ error: "Error sending email" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
