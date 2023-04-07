const error404Page = function (req, res, next) {
  res.status(404).render("404", {
    pageTitle: "Error 404!",
    path: "/",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const error500Page = function (req, res, next) {
  res.status(500).render("500", {
    pageTitle: "Error 500!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};

export { error404Page, error500Page };
