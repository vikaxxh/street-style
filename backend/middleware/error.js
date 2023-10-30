const ErrorHandler = require('../utils/errorhanddler')

module.exports = (err, req, res, next) =>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server Error"

    if(err.name === "CastError"){
        const message = `Resource not found, Invalid : ${err.path}`
        err = new ErrorHandler(message, 400);
    }

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400);
    }

    if(err.name === "JasonWebTokenError"){
        const message = `Json Web Token is invalid, Try again`
        err = new ErrorHandler(message, 400);
    }

     if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is Expired, Try again`
        err = new ErrorHandler(message, 400);
    }


    res.status(err.statusCode).json({
        success: false,
        error : err.message,
       
        
    })
}