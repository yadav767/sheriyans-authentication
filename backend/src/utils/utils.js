export function generateOtp() {
    return Math.floor(10000 + Math.random() * 90000).toString()
}

export function getOtpHtml(otp, appName = "MyApp", expiryMinutes = 10) {

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your OTP Code</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background-color: #0d0d0d;
      font-family: 'DM Sans', sans-serif;
      color: #e8e3d5;
      padding: 40px 16px;
    }

    .wrapper {
      max-width: 520px;
      margin: 0 auto;
      background: #141414;
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      overflow: hidden;
    }

    /* ── Top accent bar ── */
    .accent-bar {
      height: 4px;
      background: linear-gradient(90deg, #f5c842 0%, #ff6b35 50%, #e84393 100%);
    }

    /* ── Header ── */
    .header {
      padding: 36px 40px 24px;
      border-bottom: 1px solid #222;
    }

    .brand {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 22px;
      letter-spacing: -0.5px;
      color: #f5c842;
    }

    .header p {
      margin-top: 6px;
      font-size: 13px;
      color: #666;
      letter-spacing: 0.3px;
    }

    /* ── Body ── */
    .body {
      padding: 36px 40px;
    }

    .body h1 {
      font-family: 'Syne', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }

    .body p {
      font-size: 14.5px;
      color: #888;
      line-height: 1.7;
      margin-bottom: 28px;
    }

    /* ── OTP Box ── */
    .otp-box {
      background: #1c1c1c;
      border: 1px solid #2e2e2e;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin-bottom: 28px;
    }

    .otp-label {
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #555;
      margin-bottom: 12px;
    }

    .otp-code {
      font-family: 'Syne', sans-serif;
      font-size: 48px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #f5c842;
      line-height: 1;
    }

    .otp-expiry {
      margin-top: 14px;
      font-size: 12px;
      color: #555;
    }

    .otp-expiry span {
      color: #ff6b35;
      font-weight: 500;
    }

    /* ── Warning note ── */
    .note {
      background: #1a1a1a;
      border-left: 3px solid #e84393;
      border-radius: 4px;
      padding: 12px 16px;
      font-size: 12.5px;
      color: #666;
      line-height: 1.6;
    }

    /* ── Footer ── */
    .footer {
      padding: 20px 40px 30px;
      border-top: 1px solid #1e1e1e;
      text-align: center;
    }

    .footer p {
      font-size: 12px;
      color: #3a3a3a;
      line-height: 1.7;
    }

    .footer a {
      color: #555;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="accent-bar"></div>

    <div class="header">
      <div class="brand">${appName}</div>
      <p>Email Verification</p>
    </div>

    <div class="body">
      <h1>Verify your email</h1>
      <p>
        Use the one-time password below to complete your verification.
        Do not share this code with anyone.
      </p>

      <div class="otp-box">
        <div class="otp-label">Your OTP Code</div>
        <div class="otp-code">${otp}</div>
        <div class="otp-expiry">
          Expires in <span>${expiryMinutes} minutes</span>
        </div>
      </div>

      <div class="note">
        ⚠️ If you didn't request this, you can safely ignore this email.
        Someone may have entered your email by mistake.
      </div>
    </div>

    <div class="footer">
      <p>
        This is an automated message from ${appName}.<br/>
        Please do not reply to this email.<br/>
        <a href="#">Unsubscribe</a> · <a href="#">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}


