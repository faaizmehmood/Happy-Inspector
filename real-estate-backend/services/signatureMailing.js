import nodemailer from "nodemailer";
import JWT from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",// Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
    },
});

export const sendInspectorMail = async (email, inspectionid) => {
    
    // Generate JWT token
    const accessToken = JWT.sign({ email, inspectionid }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3d' });

    // Create unique link
    const link = `http://localhost:3000/signature?accessToken=${accessToken}`;

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: process.env.USER_EMAIL, // sender address
        to: `${email}`, // list of receivers
        subject: "Signature Required - Happy Inspector", // Subject line
        text: `Please click the link to sign the inspection: ${link}`, // plain text body
    });
};

export const sendSubUserSignUpMail = async (id, name, email, password, manager) => {

    try
    {
        // Generate JWT token
        const accessToken = JWT.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });

        // Create unique link
        const link = `http://localhost:3000/resetPassword?accessToken=${accessToken}`;

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.USER_EMAIL, // sender address
            to: `${email}`, // list of receivers
            subject: "Welcome to Happy Inspector", // Subject line
            text: `Dear ${name},

            We hope this message finds you well.

            You have been added as a sub-user by ${manager.fullname}. Please click on the link below to reset your password and access your account:

            ${link}

            Your temporary password is: ${password}, we recommend changing it as soon as possible.

            If you have any questions or need further assistance, please do not hesitate to reach out.

            Thank you for your prompt attention to this matter.

            Best regards,

            The Happy Inspector Team
            `, // plain text body
            
        });
    }
    catch (error)
    {
        console.log(error);
        throw error;
    }


};
export const sendCollaboratorMail = async (email, id, inspectorName, inspectionId) =>
{
    try
    {
        // Generate JWT token
        const accessToken = JWT.sign({ id, inspectionId }, process.env.ACCESS_TOKEN_SECRET);

        // Create unique link
        const link = `http://localhost:5173/sign-report/${inspectionId}/${accessToken}`;


        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.USER_EMAIL, // Sender address
            to: email, // List of receivers
            subject: "Action Required: Please Sign the Inspection Document", // Subject line
            text: `Dear ${email},
          
          We hope this message finds you well.
          
          You have been requested by ${inspectorName} to review and sign an inspection document. To complete this action, please click on the link below:
          
          ${link}
          
          If you have any questions or need further assistance, please do not hesitate to reach out.
          
          Thank you for your prompt attention to this matter.
          
          Best regards,
          
          The Happy Inspector Team
          `, // Plain text body
          });
          


    }
    catch (error)
    {
        console.log(error);
        throw error;
    }

}

export const sendInspectorNewCollaboratorSignatureMail = async (email, inspectorName, collaboratorName, inspectionName ) =>
{
    try
    {
        // send mail that a collaborator has signed on the inspection
        const info = await transporter.sendMail({
            from: process.env.USER_EMAIL, // Sender address
            to: email, // List of receivers
            subject: "New Collaborator Signature", // Subject line
            text: `Dear ${inspectorName},
          
          We hope this message finds you well.
          
          ${collaboratorName} has signed the inspection document for ${inspectionName}.
          
          If you have any questions or need further assistance, please do not hesitate to reach out.
          
          Thank you for your prompt attention to this matter.
          
          Best regards,
          
          The Happy Inspector Team
          `, // Plain text body
          });
    }
    catch (error)
    {
        console.log(error);
        throw error;
    }
}

// Asynchronous function to send emails to each recipient
export const sendEmailsToRecipients = async (emailRecipients, pdfLink, name) => {
    for (let email of emailRecipients) {
      try {
        await sendPDFMail(email, name, pdfLink); // Send PDF to each recipient
      } catch (err) {
        console.error(`Failed to send email to ${email}: ${err.message}`);
        throw err;
      }
    }
};

export const sendPDFMail = async (email, name, pdfLink) => {
    try {
      // Send mail with defined transport object
      const info = await transporter.sendMail({
        from: process.env.USER_EMAIL, // Sender address
        to: email, // List of receivers
        subject: "Inspection Report", // Subject line
        text: `Dear ${email},
  
        We hope this message finds you well.
  
        Please find attached the inspection report for  ${name} inspection:

        ${pdfLink}
  
        If you have any questions or need further assistance, please do not hesitate to reach out.
  
        Thank you for your prompt attention to this matter.
  
        Best regards,
  
        The Happy Inspector Team
        `, // Plain text body
      });
      console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  };
  
