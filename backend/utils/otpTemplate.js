const otpTemplate = (otp, name = 'User') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ServiceMate OTP</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 100%);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">
                🛠️ Service<span style="color:#fb923c;">Mate</span>
              </h1>
              <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Trusted Home Services</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 12px;color:#1e293b;font-size:22px;font-weight:700;">Password Reset OTP</h2>
              <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
                Hi <strong style="color:#1e293b;">${name}</strong>, we received a request to reset your password.
                Use the OTP below to proceed. It expires in <strong>10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #bfdbfe;border-radius:16px;padding:28px;text-align:center;margin:0 0 24px;">
                <p style="margin:0 0 8px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Your OTP Code</p>
                <h1 style="margin:0;font-size:48px;font-weight:900;color:#1d4ed8;letter-spacing:12px;font-family:monospace;">${otp}</h1>
              </div>

              <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;text-align:center;">
                ⏱️ This OTP is valid for <strong>10 minutes only</strong>
              </p>
              <p style="margin:0;color:#94a3b8;font-size:13px;text-align:center;">
                If you did not request this, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                © ${new Date().getFullYear()} ServiceMate. All rights reserved.<br/>
                This is an automated email — please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

module.exports = otpTemplate
