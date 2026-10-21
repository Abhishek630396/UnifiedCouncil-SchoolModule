const { escapeHtml } = require("../utils/ebookHtmlBuilder");

function generateUnifiedCouncilHtmlEmail({
  student_name,
  reference_number,
  exam_names,
  ebook_links_html,
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unified Council Registration</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;">
    <tr>
      <td align="center">
        <table width="700" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:700px;">
          <tr>
            <td style="padding:40px 35px;color:#333333;font-size:16px;line-height:1.8;">
              <p style="margin-top:0;">
                Dear <strong>${escapeHtml(student_name)}</strong>,
              </p>

              <p>
                Thank you for registering for Unified Council Olympiads -
                <strong>${escapeHtml(exam_names)}</strong>.
              </p>

              <p>
                Congratulations on taking a smart step toward academic excellence and success.
              </p>

              <div style="background:#f0f6ff;border-left:5px solid #0b5ed7;padding:20px;margin:30px 0;border-radius:6px;">
                <div style="font-size:18px;font-weight:bold;color:#0b5ed7;">
                  Your Registration Reference Number
                </div>
                <div style="font-size:28px;font-weight:bold;margin-top:10px;color:#111827;">
                  ${escapeHtml(reference_number)}
                </div>
              </div>

              <p>
                Please keep this reference number safely for future communication regarding your examination.
              </p>

              <h2 style="color:#0b5ed7;font-size:22px;margin-top:35px;">
                Important Information for Online Direct Applicants
              </h2>

              <p>
                <strong>${escapeHtml(exam_names)}</strong> is/are fully online examination(s).
                There is no need to visit any test center.
                Students can take the examination comfortably from home using a PC,
                laptop, tablet, or mobile device with an internet connection.
              </p>

              <p>
                The detailed exam procedure and guidelines will be shared at least
                15 days before the examination.
              </p>

              <h2 style="color:#0b5ed7;font-size:22px;margin-top:35px;">
                Student Login Portal
              </h2>

              <p>
                You can log in through the link below to:
              </p>

              <ul style="padding-left:20px;">
                <li>Check your registration status</li>
                <li>View exam details and exam dates</li>
                <li>Access your eBooks and online learning resources</li>
                <li>View package activation details and other updates</li>
              </ul>

              <p>
                <a href="https://www.unifiedcouncil.com/userlogin.aspx" style="color:#0b5ed7;text-decoration:none;font-weight:bold;">
                  https://www.unifiedcouncil.com/userlogin.aspx
                </a>
              </p>

              <h2 style="color:#0b5ed7;font-size:22px;margin-top:40px;">
                Please use the links below to access your eBooks
              </h2>

              ${ebook_links_html}

              <div style="background:#fff8e6;border-left:5px solid #ffb300;padding:20px;margin-top:35px;border-radius:6px;">
                <strong>Note:</strong><br><br>
                If you have selected Option 2 or Option 3,
                your online preparation package will be activated within 48 hours,
                and the confirmation will be sent through SMS.
              </div>

              <p style="margin-top:35px;">
                We wish you all the very best for your Olympiad journey and upcoming examination.
              </p>

              <h2 style="color:#0b5ed7;font-size:22px;margin-top:35px;">
                Olympiad Preparation Books
              </h2>

              <p>
                Visit:
                <a href="https://www.bmatalent.com/classwise-books-2/" style="color:#0b5ed7;font-weight:bold;text-decoration:none;">
                  https://www.bmatalent.com/classwise-books-2/
                </a>
              </p>

              <h2 style="color:#0b5ed7;font-size:22px;margin-top:35px;">
                Support
              </h2>

              <p>
                +91 63029 02378<br>
                +91 90300 07882<br>
                +91 96030 64939<br>
                +91 92463 36654
              </p>

              <p style="margin-top:45px;">
                Regards,<br>
                <strong>Team Unified Council</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="background:#f4f7fb;padding:20px;font-size:13px;color:#777777;">
              &copy; 2026 Unified Council. All rights reserved.
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
  generateUnifiedCouncilHtmlEmail,
};
