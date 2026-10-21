function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function generatePaymentSuccessEmailHtml(params = {}) {
  const studentName = escapeHtml(params.student_name || "Student");
  const courses = escapeHtml(params.courses || "Unified Council Olympiad Registration");
  const registrationCode = escapeHtml(params.registration_code || "");
  const transactionId = escapeHtml(params.transaction_id || "");
  const mobile = escapeHtml(params.mobile || "");
  const amount = escapeHtml(params.amount || "0.00");
  const invoiceUrl = escapeHtml(params.invoice_url || "#");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Registration Confirmation</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">
          <tr>
            <td style="background:#2c3e50; padding:20px; text-align:center;">
              <h2 style="color:#ffffff; margin:0;">Unified Council</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:20px;">
              <h3 style="color:#27ae60; margin:0;">Payment Successful &#9989;</h3>
            </td>
          </tr>
          <tr>
            <td style="padding:20px; font-size:14px; color:#333; line-height:1.6;">
              <p>Dear <strong>${studentName}</strong>,</p>
              <p>Congratulations on registering for <strong>${courses}</strong>!</p>
              <p>Your registration has been successfully completed and your payment has been received.</p>
              <p><strong>Registration Reference Number:</strong> ${registrationCode}</p>
              ${transactionId ? `<p><strong>Transaction ID:</strong> ${transactionId}</p>` : ""}
              <p>Please keep this reference number for future communication regarding your exam.</p>
              <p>The detailed exam procedure will be communicated to you at least <strong>15 days before the exam.</strong></p>
              <p><strong>Important Information for Online Direct Applicants:</strong></p>
              <p>The exam is completely online and can be taken from the comfort of your home using a PC, laptop, or mobile device with an internet connection.</p>
              <p>You can log in to your account to access:</p>
              <ul style="padding-left:20px;">
                <li>Exam details</li>
                <li>E-books</li>
                <li>Registration status</li>
              </ul>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-top:20px;">
                <tr>
                  <td style="padding:10px; border:1px solid #ddd;"><strong>Ref. Number</strong></td>
                  <td style="padding:10px; border:1px solid #ddd;">${registrationCode}</td>
                </tr>
                <tr>
                  <td style="padding:10px; border:1px solid #ddd;"><strong>Student's Name</strong></td>
                  <td style="padding:10px; border:1px solid #ddd;">${studentName}</td>
                </tr>
                <tr>
                  <td style="padding:10px; border:1px solid #ddd;"><strong>Mobile Number</strong></td>
                  <td style="padding:10px; border:1px solid #ddd;">${mobile}</td>
                </tr>
                <tr>
                  <td style="padding:10px; border:1px solid #ddd;"><strong>Amount Paid</strong></td>
                  <td style="padding:10px; border:1px solid #ddd;">&#8377;${amount}</td>
                </tr>
                <tr>
                  <td style="padding:10px; border:1px solid #ddd;"><strong>Exams Selected</strong></td>
                  <td style="padding:10px; border:1px solid #ddd;">${courses}</td>
                </tr>
              </table>
              <p style="margin-top:20px;">Additionally, you can download your E-books, Success Series Books, and Past Question Papers after login.</p>
              <div style="text-align:center; margin:25px 0;">
                <a href="https://www.unifiedcouncil.com/userlogin.aspx?utm_source=brevo&utm_campaign=Payment Successful&utm_medium=email"
                   style="background:#27ae60; color:#ffffff; padding:12px 20px; text-decoration:none; border-radius:5px; font-size:14px; display:inline-block;">
                   Login to Your Account
                </a>
              </div>
              <div style="text-align:center; margin:20px 0;">
                <a href="${invoiceUrl}"
                   target="_blank"
                   style="background:#0f4c81; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-size:14px; font-weight:600; display:inline-block; font-family:Arial,sans-serif;">
                   &#128229; Download Invoice PDF
                </a>
              </div>
              <p>Visit <a href="https://www.bmatalent.com?utm_source=brevo&utm_campaign=Payment Successful&utm_medium=email" style="color:#27ae60; text-decoration:none;">www.bmatalent.com</a> to purchase interesting and unique books for Olympiads and overall academic excellence.</p>
              <p>If you have any questions, please feel free to contact us.</p>
              <p style="margin-top:20px;">Regards,<br><strong>Unified Council Team</strong></p>
            </td>
          </tr>
          <tr>
            <td style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
              &copy; Unified Council<br>
              exam@unifiedcouncil.com | 040-24557708
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = {
  generatePaymentSuccessEmailHtml,
};
