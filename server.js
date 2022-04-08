const express = require("Express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const router = express.Router({ mergeParams: true });
const pathHTMl = "/Module5/HTML";
const User = require("./Model/User.js");
const VIEW = require("./Router/VIEW");
const API = require("./Router/API");
const loggedInSession = require("./Middlewares/loggedInSession");
const checkLoggedIn = require("./Middlewares/checkLogIn");


/////////// solving Cross-origin resource sharing problem /////////
// https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration
/////////// solving cors problem /////////


const mongoose = require("mongoose");
//open database
mongoose
  .connect(
    `mongodb+srv://ducnguyen:dustin13@learninggate.lwzml.mongodb.net/LearningGate?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error");
  });
///////////////////////////////////////////////////

router.get("/", async function (req, res) {
  res.sendFile(path.join(__dirname, pathHTMl, "/landingpage.html"));
  console.log("Hello from Express")
});


//add the router
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);
app.use("/api/", API);
app.use("/view/", VIEW);
app.listen(process.env.port || 3000);
console.log("Running at port 3000");
