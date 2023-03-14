import crypto from "crypto";
import { User } from "../models/userModel.mjs";
import bcrypt from "bcryptjs";
import { MailtrapClient } from "mailtrap";
import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";
import { validationResult } from "express-validator";

let transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "6442caf6923a20",
    pass: "0d17d83d771dba",
  },
});

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

// const TOKEN = "736648edc3add13c96ccaf25ec6ffa3f";
// const SENDER_EMAIL = "shop@node.com";
// const RECIPIENT_EMAIL = "recipient@email.com";

const client = new MailtrapClient({
  token: "283e32349908e01ac5dc0819b3b27db3",
});
const sender = { name: "Mailtrap Test", email: "adamananda28@gmail.com" };

// ------------------------------------------------- //

const getLogin = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

const getSignup = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password");
          res.redirect("/login");
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

const postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });

      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      // return transporter.sendMail({
      //   to: email,
      //   from: "shop@node.com",
      //   subject: "Success to Signup",
      //   html: "<h1>Please login to enter the application.</h1>",
      // });
      // return client
      //   .send({
      //     from: sender,
      //     to: [{ email: email }],
      //     subject: "Hello from Mailtrap!",
      //     text: "Welcome to Mailtrap Sending!",
      //   })
      //   .then(console.log, console.error);
      const message = {
        from: "shop@node.com", // Sender address
        to: email, // List of recipients
        subject: "Success to Signup", // Subject line
        html: "<h1>You are success to signup. Enjoy your day.</h1>", // Plain text body
      };

      transport.sendMail(message, function (err, info) {
        if (err) {
          return console.log(err);
        } else {
          return console.log(info);
        }
      });
    })
    .catch((err) => console.log(err));
};

const postLogut = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

const getReset = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset password",
    errorMessage: message,
  });
};

const postReset = (req, res, next) => {
  // return console.log("hello");
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Email not found");
          return res.redirect("/reset");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        // return console.log(result);
        res.redirect("/");
        const message = {
          from: "shop@node.com", // Sender address
          to: result.email, // List of recipients
          subject: "Reset Password", // Subject line
          html: `<h1>You requested a password reset.</h1>
                 <p>Clik this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
          `, // Plain text body
        };

        transport.sendMail(message, function (err, info) {
          if (err) {
            return console.log(err);
          } else {
            return console.log(info);
          }
        });
      })
      .catch((err) => console.log(err));
  });
};

const getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      // return console.log(user);
      let message = req.flash("error");
      message.length > 0 ? (message = message[0]) : (message = null);

      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

const postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => res.redirect("/login"))
    .catch((err) => console.log(err));
};

export {
  getLogin,
  getSignup,
  postLogin,
  postSignup,
  postLogut,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
};
