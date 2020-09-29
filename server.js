const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const OAuth2 = google.auth.OAuth2;
const PORT = process.env.PORT || 3000;
const app = express();

dotenv.config();

app.use(bodyParser.json());

const myOAuth2Client = new OAuth2(
  process.env.ID_CLIENT,
  process.env.SECRET_CODE,
  "https://developers.google.com/oauthplayground"
);

myOAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});
const myAccessToken = myOAuth2Client.getAccessToken();

let transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "yhuelfrancois@gmail.com", //your gmail account you used to set the project up in google cloud console"
    clientId: process.env.ID_CLIENT,
    clientSecret: process.env.SECRET_CODE,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: myAccessToken, //access token variable we defined earlier
  },
});

app.post("/sendemail", function (req, res) {
  let mailOptions = {
    from: "yhuelfrancois@gmail.com", // sender
    to: "francois@tricky.fr", // receiver
    subject: "My tutorial brought me here", // Subject
    html:
      "<p>You have received this email using nodemailer, you are welcome ;)</p>", // html body
  };
  transport.sendMail(mailOptions, function (err, result) {
    if (err) {
      res.send({
        message: "brahhhhh",
      });
    } else {
      transport.close();
      res.send({
        message: "Email has been sent: check your inbox!",
      });
    }
  });
});

app.get("/", function (req, res) {
  res.send({
    message: "Default route in email tutorial project",
  });
});

app.listen(PORT, function (req, res) {
  console.log(`Listening on port ${PORT}`);
});

// {
//     "access_token": "ya29.a0AfH6SMDiUbuUA-N63Hpq3mELTZO8aSgpiP712AYTRGuPrTGnRn77zXDLoItYtQv2ut5iJqEfjk0mLUraJxhY75xpK7wrf5QyYOhObKPJq1qZnAxJopkXpdWZUyoxLy8gfiltF9KNGpJISJ5rYAvrR65WZpXLTSkUucw",
//     "scope": "https://mail.google.com/",
//     "token_type": "Bearer",
//     "expires_in": 3599,
//     "refresh_token": "1//0fLU5aI24SoKiCgYIARAAGA8SNwF-L9IrqvF1kNY2-OuxAJN78qkFWsK_8x97cqyUDMJ6nHrCoqt54AzViAzcqkJdwweNwefQJY8"
//   }1//0fLU5aI24SoKiCgYIARAAGA8SNwF-L9IrqvF1kNY2-OuxAJN78qkFWsK_8x97cqyUDMJ6nHrCoqt54AzViAzcqkJdwweNwefQJY8
