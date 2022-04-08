const path = require("path");
const loggedInsession = require("./loggedInSession");

const checkInstructorRole = (req, res, next) => {
  const username = req.body.username;
  if (loggedInsession.get(username).isInstructor == false) {
    res.status(400).json({ error: username + " is not an instructor" });
    return;
  }

  next();
};

module.exports = checkInstructorRole;
