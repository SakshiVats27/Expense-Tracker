const { jsPDF } = require('jspdf');
const nodemailer = require('nodemailer');
const dataParserForItems = require('./dataParser');
require('jspdf-autotable');

function generatePDF(data) {
  const doc = new jsPDF({
    orientation: "vertical"
  });
  doc.setFontSize(32);

  doc.text("Your Expenses In Last One Month !!", 100, 20, 'center');
  doc.setLineWidth(2);
  doc.line(20, 25, 170, 25);

  doc.setFontSize(22);
  doc.autoTable({
    body: data.body,
    theme: 'grid',
    startY: 40,
    head: [['S.No', 'Date', 'Amount', 'Category']],
    foot: [['', 'Total', data.total, '']],
    styles: {
      textColor: [0, 0, 0],
      fontSize: 14
    },
  });

  return doc.output("dataurlstring").split(',')[1];
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Generic function to send email
 */
async function emailSend({ email, subject, message, attachments = [] }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message,
    attachments: attachments
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error in emailSend utility:", error);
    throw error;
  }
}

/**
 * Specialized function for expense reports
 */
async function sendEmailWithAttachment(recipient, items) {
  let body = dataParserForItems(items);
  const pdfContent = generatePDF(body);

  const attachments = [
    {
      filename: 'expense_report.pdf',
      content: pdfContent,
      encoding: 'base64'
    },
  ];

  return emailSend({
    email: recipient,
    subject: 'Expense Report for This Month',
    message: 'Please find your expense report attached.',
    attachments: attachments
  });
}

module.exports = emailSend;
module.exports.sendEmailWithAttachment = sendEmailWithAttachment;