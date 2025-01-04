const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};
module.exports.signUp = async (req, res) => {
  try {
    // Extract from body
    let { username, email, password } = req.body;
    //   create new User
    const newUser = new User({ email, username });
    const registereduser = await User.register(newUser, password);
    console.log(registereduser);
    // Login After Sign Up
    req.login(registereduser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.logIn = async (req, res) => {
  req.flash("success", "Logged in successfully!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You're logged out !");
    res.redirect("/listings");
  });
}; 
