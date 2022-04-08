const path = require("path");
const loggedInsession = require("./loggedInSession");
const pathHTMl = "/../Module5/HTML";

const checkLoggedIn = (req, res, next) => {
  const username = req.body.username;
  if (!loggedInsession.has(username)) {
    res.status(404).json({ error: "No Sign In Session with: " + username });
    return;
  }

  next();
};

module.exports = checkLoggedIn;
