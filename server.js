var express = require("express");
var bp = require("body-parser");
var _ = require("underscore");
var interceptor = require("./middleware.js");
const jwt = require("jsonwebtoken");
const config = require("./config.json");
const cors = require("cors");

const router = express.Router();

var app = express();
app.use(bp.json());
app.use("/api", router);

// var interceptor = {
//   logger: function (req, res, next) {
//     console.log(
//       `Request ${new Date().toString()} for ${req.method} ${req.originalUrl}`
//     );
//     next();
//   },
//   authUser: function (req, res, next) {
//     console.log("private route hit...");
//     next();
//   },
// };

app.use(interceptor.authUser);

var userdata = [];
var uid = 1;
app.use(cors());

app.use(express.static("public"));

router.get("/", (req, res) => {
  res.send("Welcome to Express App...!");
});
// router.get("/", (req, res) => {
//   res.send("OK");
// });
router.post("/adduser", (req, res) => {
  var data = req.body;
  data.id = uid++;
  userdata.push(data);
  res.send("User added...");
});

router.get("/loadusers", interceptor.logger, (req, res) => {
  res.send(userdata);
});
router.post("/login", (req, res) => {
  const data = req.body;
  const user = {
    email: data.email,
    name: data.name,
  };
  const token = jwt.sign(user, config.secret, { expiresIn: config.tokenlife });

  const response = {
    status: "Logged in",
    token: token,
  };

  res.status(200).json(response);
});

router.use(require("./tokenchecker.js"));

router.get("/loadusers/:id", (req, res) => {
  var uid = parseInt(req.params.id);
  var mtd = _.findWhere(userdata, { id: uid });
  // userdata.forEach(function (todo) {
  //   if (uid == todo.id) {
  //     mtd = todo;
  //   }
  // });
  if (mtd) {
    res.send(mtd);
  }
});

router.delete("/deleteuser/:id", (req, res) => {
  var uid = parseInt(req.params.id);
  var mtd = _.findWhere(userdata, { id: uid });
  if (mtd) {
    userdata = _.without(userdata, mtd);
    res.send(mtd);
  }
});

router.put("/updateuser/:id", (req, res) => {
  // HomeWork
  var uid = parseInt(req.params.id);
  var updatedData = req.body;

  var mtd = _.findIndex(userdata, { id: uid });
  if (mtd !== -1) {
    userdata[mtd] = { ...userdata[mtd], ...updatedData };
    res.send("User Updated...");
  } else {
    res.send("User not found");
  }
});

app.listen(4000, () => {
  console.log("Server is ready on port 4000...");
});
