const error404Page = function (req, res, next) {
  res.status(404).render("404", {
    pageTitle: "Error 404!",
    path: "/",
    // formCSS: true,
    // productCSS: true,
    // activeProduct: true,
  });
};

export { error404Page };
