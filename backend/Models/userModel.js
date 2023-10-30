const mongoose  = require('mongoose')
const validator = require('validator')
const bcrypt =  require('bcryptjs')
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/async');
const ErrorHandler = require('../utils/errorhanddler');
const crypto = require('crypto')


const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required:[true, "Please Enter your Name"],
        maxLength:[30, "Name cannot exceed 30 characters"],
        minLength:[4, "Name should be more than 5 character"]
    },
    email:{
        type: String,
        required:[true,"please Enter your Email"],
        unique:true,
        validate:[validator.isEmail, "please Enter a valid email"]
    },

    password:{
         type: String,
        required:[true,"please Enter your Password"],
        minLength:[8,"Password should be greater than 8 characters"],
        select:false,
    },
    avatar:{
        
            public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }     

    },
    role:{
        type:String,
        default:"user",
    },
    createAt:{
        type: Date,
        default: Date.now,
    },
    
    resetPasswordToken:String,
    resetPasswordExpire:Date,

});

userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
       next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});


// jwt token
userSchema.methods.getJWTToken = function(){

    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn: "5d"
    })
};

//compare password

userSchema.methods.comparePassword = async function(inputPass){

    return await bcrypt.compare(inputPass, this.password)
    
}

//generating Password Reset token

userSchema.methods.getResetPasswordToken = function(){

    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256")
    .update(resetToken).digest("hex")

    this.resetPasswordExpire = Date.now() + 30*60*1000;

    return resetToken;
}






module.exports = mongoose.model('User', userSchema)