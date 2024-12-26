const CustomError = require("../middlewares/CustomError");

const developmentErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const productionErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({ message: "Something went wrong!, try again" });
  }
};

const castErrorHandler = (err) => {
  const msg = `Invalid value for ${err.value} : ${err.path}`;
  return new CustomError(msg, 400);
};
const handleExpiredJWt = (err) => {
  return new CustomError(`Web Token has expired. Please <a href='/login'>login again</a>`, 401);
};

const handleJWTError = (err) => {
  return new CustomError("Invalid Token, Please re-login!!!", 401);
};

const errorController = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
  
    if (process.env.NODE_ENV === "development") {
      developmentErrors(res, error);
    } else if (process.env.NODE_ENV === "production") {
      if (error.name === "CastError") {
        error = castErrorHandler(error);
      }
      if (error.name === "TokenExpiredError") {
        error = handleExpiredJWt(error);
      }
      if (error.name === "JsonWebTokenError") {
        error = handleJWTError(error);
      }
      productionErrors(res, error);
    }
  };
  
  module.exports = errorController;