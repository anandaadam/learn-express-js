import path from "path";
import { __dirname } from "./helpers/path.mjs";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import MongoDBStore from "connect-mongodb-session";
import { User } from "./models/userModel.mjs";
import * as shopRoutes from "./routes/shop.mjs";
import * as adminRoutes from "./routes/admin.mjs";
import * as authRoutes from "./routes/auth.mjs";
import * as errorHandle from "./controllers/Error.mjs";
import csurf from "csurf";
import flash from "connect-flash";

const app = express();
const csrfProtection = csurf();
const SessionStore = MongoDBStore(session);
const store = new SessionStore({
  uri: "mongodb://adam:Pknqsx123.@ac-4st63nd-shard-00-00.myiaxw1.mongodb.net:27017,ac-4st63nd-shard-00-01.myiaxw1.mongodb.net:27017,ac-4st63nd-shard-00-02.myiaxw1.mongodb.net:27017/shop?replicaSet=atlas-10elfg-shard-0&ssl=true&authSource=admin",
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../", "public")));
app.use(
  session({
    secret: "the secret cookie",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) return next();

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use(authRoutes.router);
app.use(shopRoutes.router);
app.use("/admin", adminRoutes.router);

app.get("/500");
app.use(errorHandle.error404Page);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error 500!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(
    "mongodb://adam:Pknqsx123.@ac-4st63nd-shard-00-00.myiaxw1.mongodb.net:27017,ac-4st63nd-shard-00-01.myiaxw1.mongodb.net:27017,ac-4st63nd-shard-00-02.myiaxw1.mongodb.net:27017/shop?replicaSet=atlas-10elfg-shard-0&ssl=true&authSource=admin"
  )
  .then((result) => app.listen(3000))
  .catch((error) => console.log(error));
