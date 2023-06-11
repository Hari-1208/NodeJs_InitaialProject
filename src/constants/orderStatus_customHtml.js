const Html = (data) => {
  const {
    title,
    name,
    subject,
    content,
    contactUsNumber = "+91 89391 69999",
  } = data;

  return `<head>
  <title>${title}</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />
  <meta name="format-detection" content="telephone=no" />
  <meta
    name="viewport"
    content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;"
  />
  <meta name="description" content=${title} />
  <meta name="keywords" content=${title} />

  <meta name="author" content=${title} />

  <meta property="og:type" content="website" />
  <meta name="og_site_name" property="og:site_name" content=${title} />
  <link
    href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap"
    rel="stylesheet"
  />
</head>

<body style="margin: 0; padding: 0">
  <div style="height: 100%">
    <table width="100%" style="border-collapse: collapse">
      <thead>
        <tr>
          <th scope="row"></th>
        </tr>
      </thead>
      <tbody>
        <tr style="background: #ededed">
          <td
            style="
              width: 90%;
              margin: 0 auto;
              border-radius: 5px;
              display: flex;
              justify-content: center;
              margin-top: 14px;
              background: #766ceb;
            "
          >
            <div style="width: 100%; text-align: center; padding: 20px 0">
              <img
                src="https://mrmed.s3.ap-south-1.amazonaws.com/file-1619262458241-446129166-MrmedLogo.png"
                height="30"
                alt=""
              />
            </div>
          </td>
        </tr>

        <tr style="background: #ededed">
          <td
            style="
              background: white;
              width: 90%;
              margin: 0 auto;
              border-radius: 5px;
              display: flex;
              justify-content: center;
              margin-top: 10px;
            "
          >
            <div style="padding: 28px; width: 100%">
              <div
                style="
                  font-family: 'Open Sans', sans-serif;
                  font-weight: 700;
                  font-size: 20px;
                  line-height: 19px;
                  letter-spacing: 0.01em;
                  text-transform: capitalize;
                  color: #343434;
                  padding-bottom: 12px;
                  text-align: center;
                  width: 100%;
                "
              >
                ${subject}
              </div>
              <div style="text-align: center; width: 100%">
                <img
                  src="https://mrmed.s3.ap-south-1.amazonaws.com/file-1619263604373-326411901-box.png"
                  alt=""
                />
              </div>
              <div
                style="
                  font-family: 'Open Sans', sans-serif;
                  font-weight: 700;
                  font-size: 16px;
                  line-height: 20px;
                  letter-spacing: 0.01em;
                  color: #343434;
                  padding-bottom: 15px;
                "
              >
                Hello ${name},
              </div>
              <div
                style="
                  font-family: 'Open Sans', sans-serif;
                  font-size: 14px;
                  line-height: 20px;
                  letter-spacing: 0.01em;
                  color: #444444;
                  padding-bottom: 20px;
                "
              >
                Thank you for your order.
              </div>
              <div
                style="
                  font-family: 'Open Sans', sans-serif;
                  font-size: 14px;
                  line-height: 20px;
                  letter-spacing: 0.01em;
                  color: #444444;
                  padding-bottom: 10px;
                "
              >
                ${content}.\nPlease visit
                <a
                  href="{{myOrderUrl}}"
                  target="_blank"
                  style="
                    text-decoration: underline;
                    cursor: pointer;
                    color: #444444;
                  "
                >
                  Your Orders
                </a>
                .in for real time updates on your order
              </div>
              <hr />
              <table width="100%" style="border-collapse: collapse">
                <thead>
                  <tr>
                    <th scope="row"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="width: 50%">
                      <a
                        href="{{termsAndConditions}}"
                        target="_blank"
                        style="
                          font-family: 'Open Sans', sans-serif;
                          font-size: 14px;
                          line-height: 20px;
                          color: #444444;
                          cursor: pointer;
                        "
                      >
                        <u> Terms and Conditions </u>
                      </a>
                    </td>
                    <td style="width: 50%; text-align: right">
                      <a
                        href="{{refundPolicy}}"
                        target="_blank"
                        style="
                          font-family: 'Open Sans', sans-serif;
                          font-size: 14px;
                          line-height: 20px;
                          color: #444444;
                          text-align: right;
                          cursor: pointer;
                          width: 100%;
                        "
                      >
                        <u> Refund and returns policy </u>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
        <tr style="background: #ededed">
          <td
            style="
              background: #e2e1ed;
              width: 90%;
              margin: 0 auto;
              border-radius: 5px;
              margin-top: 10px;
              display: flex;
              justify-content: center;
            "
          >
            <div style="padding: 30px; width: 100%; text-align: center">
              <div
                style="
                  font-family: 'Open Sans', sans-serif;
                  font-size: 16px;
                  line-height: 20px;
                  letter-spacing: 0.01em;
                  color: #444444;
                  font-weight: 800;
                "
              >
                Need more help?&nbsp;
                <span
                  style="
                    font-family: 'Open Sans', sans-serif;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0.01em;
                    color: #766ceb;
                    font-weight: 800;
                  "
                >
                  Call us at
                  <a
                    style="text-decoration: underline; color: #766ceb"
                    href="tel:+918939169999"
                  >
                    ${contactUsNumber}
                  </a>
                </span>
              </div>
            </div>
          </td>
        </tr>
        <tr style="background: #ededed">
          <td>
            <div style="padding: 16px 0; text-align: center; width: 100%">
              <a
                href="https://www.facebook.com/mrmedhq"
                target="_blank"
                style="text-decoration: none"
              >
                <img
                  src="https://mrmed.s3.ap-south-1.amazonaws.com/file-1619262611888-489899917-facebook.png"
                  alt=""
                />
              </a>
              <a
                href="https://www.twitter.com/mrmedhq"
                target="_blank"
                style="margin-left: 16px; text-decoration: none"
              >
                <img
                  src="https://mrmed.s3.ap-south-1.amazonaws.com/file-1619262594383-537801097-twitter.png"
                  alt=""
                />
              </a>
              <a
                href="https://www.instagram.com/mrmedhq"
                target="_blank"
                style="margin-left: 16px; text-decoration: none"
              >
                <img
                  src="https://mrmed.s3.ap-south-1.amazonaws.com/file-1619262569508-727207142-Instagram.png"
                  alt=""
                />
              </a>
              <a
                href="https://www.linkedin.com/company/mrmedin"
                target="_blank"
                style="margin-left: 16px; text-decoration: none"
              >
                <img
                  src="https://mrmed.s3.ap-south-1.amazonaws.com/file-1619262545348-417871622-linkedIn.png"
                  alt=""
                />
              </a>
            </div>
            <div
              style="
                font-family: 'Open Sans', sans-serif;
                font-size: 14px;
                line-height: 20px;
                text-align: center;
                letter-spacing: 0.01em;
                color: #a7a7a7;
                padding-bottom: 16px;
                width: 100%;
              "
            >
              (c) 2021 ${title}. All rights reserved.
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
`;
};

module.exports = Html;
