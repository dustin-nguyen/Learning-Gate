const express = require("Express");
const app = express();
const path = require("path");
const router = express.Router({mergeParams: true});
const pathHTMl = "/../Module5/HTML";
// Schema Import
const User = require("../Model/User.js");
const Course = require("../Model/Course.js");
// Middlewares Import
const checkLoggedIn = require("../Middlewares/checkLogIn");
const loggedInSession = require("../Middlewares/loggedInSession");

router.get("/login", async function (req, res) {
  res.status(200).sendFile(path.join(__dirname, pathHTMl, "/login.html"));
  console.log("Send login page");
});
router.get("/userbalance",checkLoggedIn, async function (req, res) {
  res.status(200).sendFile(path.join(__dirname, pathHTMl, "/viewbalance.html"));
  console.log("Send view balnce page");
});


router.get("/signup", function (req, res) {
  res.status(200).sendFile(path.join(__dirname, pathHTMl, "/signup.html"));
  console.log("Send signup page");
});


router.get("/getallcourse", async function(req, res) {
  const courses = await Course.find({});
  if(courses!=null){
    res.status(200).json(courses);
    console.log("Get all course successfully");
  }else{
    res.status(400).json({ error: "No course" });
    console.log("No course");
    return;
  }
});

router.get("/course", async function(req, res) {
  console.log("course_id: "+req.body.course_id);
  const courseID = req.body.course_id;
  const courses = await Course.findOne({_id:courseID});
  if(courses!=null){
    res.status(200).json(courses);
    console.log("Get course successfully");
  }else{
    res.status(400).json({ error: "Cann't find course with ID"+ courseID });
    console.log("Cann't find course with ID"+ courseID );
    return;
  }
  
});
module.exports = router;
