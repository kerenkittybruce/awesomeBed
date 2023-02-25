// ERROR HANDLING

function errorHandling(err, req, res, next) {
    if (err) {
      const status = err.status || 500;
      res.status(status).json({
        status: status,
        err: "Oops! An error occured . Please try again later .",
      });
    }
    next(); // take the user to the next directory ---- built-in structure
  }
  
  module.exports = { errorHandling }; // export errorHandling functionality