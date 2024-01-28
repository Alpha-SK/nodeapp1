module.exports = {
  logger: function (req, res, next) {
    console.log(
      `Request ${new Date().toString()} for ${req.method} ${req.originalUrl}`
    );
    next();
  },
  authUser: function (req, res, next) {
    console.log("private route hit...");
    next();
  },
};