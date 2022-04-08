const express = require("Express");
const app = express();
const path = require("path");
const router = express.Router();
const pathHTMl = "/../Module5/HTML";
// Schema Import
const User = require("../Model/User.js");
const Course = require("../Model/Course.js");
const CourseMember = require("../Model/CourseMember.js");
const Transaction = require("../Model/Transaction.js");
// Middlewares Import
const checkLoggedIn = require("../Middlewares/checkLogIn");
const checkInstructorRole = require("../Middlewares/checkInstructorRole");
const loggedInSession = require("../Middlewares/loggedInSession");

router.post(
  "/signout",
  /*checkLoggedIn,*/ (req, res) => {
    const username = req.body.username;
    //req.params.username=null;
    if (loggedInSession.has(username)) {
      loggedInSession.delete(username);
      res.status(200).send("Logout successfully");
      console.log("Logout successfully");
      return;
    } else {
      res.status(200).send("No Sign In Session with: " + username);
      console.log("No Sign In Session with: " + username);
    }
  }
);
router.post("/addbalance", checkLoggedIn, async function (req, res) {
  const username = req.body.username;
  const amount = req.body.amount;
  if (amount < 0) {
    res.status(400).json({ error: "Invalid amount" });
    return;
  }
  var users = await User.updateOne(
    {
      username: req.body.username,
    },
    { $inc: { balance: amount } }
  );
  users = await User.findOne({ username: req.body.username });
  res.status(200).json({
    username: users.username,
    balance: users.balance,
  });
  console.log("User " + users.username + " new balance: " + users.balance);
});

router.post("/getbalance", checkLoggedIn, async function (req, res) {
  const username = req.body.username;
  const users = await User.findOne({ username: req.body.username });
  res.status(200).json({
    balance: users.balance,
  });
});
router.post("/signup", async function (req, res) {
  // Find user with req.body.username
  console.log(req.body);
  const users = await User.findOne({ username: req.body.username });
  console.log(users);
  // If NUll create, else error
  if (users == null) {
    const newUser = await new User(req.body).save();
    loggedInSession.set(newUser.username, newUser);
    res
      .status(200)
      .json({ username: newUser.username, isInstructor: newUser.isInstructor });
  } else {
    res.status(400).json({ error: "Username already exits" });
    console.log("Username already exits");
  }
});
/////////////////////////////////////////////////////
//working
router.post("/enroll/course/", checkLoggedIn, async function (req, res) {
  //console.log(req.params.id);
  console.log(req.body.course_id);
  var user = req.body;
  const courseID = req.body.course_id;
  
  //checking
  // checking if we can find course
  const courses = await Course.findOne({ _id: courseID });
  if (courses == null) {
    res.status(400).json({ error: "Cann't find course with ID" + courseID });
    console.log("Cann't find course with ID" + courseID);
    return;
  }
  console.log(courses);
  // checking if user is an instructor of this course
  if (user.username == courses.instructor) {
    res.status(401).json({
      error: "User is the instructior of this course:" + courses.title,
    });
    console.log("User is the instructior of this course:" + courses.title);
    return;
  }
  // check if we have admin account
  const admin = await User.findOne({ username: "admin" });
  if (admin == null) {
    res.status(500).json({ error: "Can't find admin account" });
    console.log("Can't find admin account");
    return;
  }
  // middleware already check so we should already have found caller
  user = await User.findOne({ username: user.username });
  console.log(user.balance);
  console.log(courses.enrollFee);
  console.log(user.balance < courses.enrollFee);
  /// https://stackoverflow.com/questions/21690070/javascript-float-comparison/55164784#55164784
  if (Math.round(parseFloat(user.balance)*100000) < Math.round(parseFloat(courses.enrollFee)*100000)) {
    res.status(401).json({ error: "Insufficent balance" });
    console.log(
      "Insufficent fund, user's balance:" +
        user.balance +
        " course fee: " +
        courses.enrollFee
    );
    return;
  }
  // check if they already enrolled
  if (
    (await CourseMember.findOne({
      courseID: courses._id,username: user.username,})) != null) {
      res.status(401).json({ error: "User already enrolled" });
      return;
  }

  //end of checking
  // sending amount
  const amountToAdmin = courses.enrollFee * 0.1;
  const amountToCourse = courses.enrollFee * 0.9;
  const transactionToCourse = await new Transaction({
    from_id: user._id,
    to_id: courses._id,
    from_collection: "User",
    to_collection: "Course",
    amount: amountToCourse,
  }).save();
  console.log(transactionToCourse);
  const transactionToAdmin = await new Transaction({
    from_id: user._id,
    to_id: admin._id,
    from_collection: "User",
    to_collection: "User",
    amount: amountToAdmin,
  }).save();
  console.log(transactionToAdmin);
  // end of sending money
  const addMember = await new CourseMember({
    courseID: courses._id,
    username: user.username,
    isInstructor: user.isInstructor,
  }).save();
  //update
  try {
    const updatedCourse = await Course.updateOne(
      { _id: courseID },
      { $inc: { balance: amountToCourse, numOfStudent: 1 } }
    );
    console.log("New course info" + updatedCourse);
    const updatedUser = await User.updateOne(
      { username: user.username },
      { $inc: { balance: -courses.enrollFee } }
    );
    console.log("New user info" + updatedUser);
    const updatedAdmin = await User.updateOne(
      { username: "admin" },
      { $inc: { balance: amountToAdmin } }
    );
    console.log("New admin info" + updatedAdmin);
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({ message: "Join course successfully" });
  console.log("Join course successfully");
});
////////////////////////////////////

router.post("/login", async function (req, res) {
  // Find user with req.body.username and req.body.password
  console.log(req.body);
  const users = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  console.log(users);
  if (users != null) {
    loggedInSession.set(users.username, users);
    // console.log(users);
    res
      .status(200)
      .json({ username: users.username, isInstructor: users.isInstructor });
  } else {
    res.status(400).json({ error: "Wrong username or password" });
    console.log("Wrong username or password");
  }
});

router.post(
  "/createcourse",
  checkLoggedIn,
  checkInstructorRole,
  async function (req, res) {
    console.log(req.body);
    const course = await Course.findOne({
      title: req.body.title,
      instructor: req.body.username,
    });
    console.log(course);
    if (course == null) {
      req.body.instructor = req.body.username;
      const newCourse = await new Course(req.body).save();
      console.log("Save course successfully");
      console.log(newCourse);
      const addMember = await new CourseMember({
        courseID: newCourse._id,
        username: req.body.username,
        isInstructor: true,
      }).save();
      console.log(addMember);
      console.log("Save course memeber successfully");
      res.status(200).json({
        courseID: newCourse._id,
        title: newCourse.title,
        instructor: newCourse.instructor,
      });
      return;
    } else {
      res.status(400).json({
        error:
          "There is a course with the same title and the same instructor in the database",
      });
    }
  }
);

module.exports = router;
