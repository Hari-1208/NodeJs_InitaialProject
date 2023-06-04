var nodemailer = require("nodemailer");
const { statusCodes } = require("../configs");

const mail = async function (mailOption) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });
  // let readFile = fs.readFileSync(path.join(__dirname, '../../emailTemplates/' + mailOption.template + '.html'), { encoding: 'utf-8' });
  // let template = handlebars.compile(readFile)
  var mailOptions = {
    from: process.env.MAILER_USER,
    ...mailOption,
  };

  try {
    var info = await transporter.sendMail(mailOptions);
    return { status: statusCodes.HTTP_OK, response: info.response };
  } catch (e) {
    return { error: e, status: statusCodes.HTTP_INTERNAL_SERVER_ERROR };
  }
};

module.exports = {
  sendMail: mail,
};
