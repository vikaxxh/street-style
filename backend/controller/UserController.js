const ErrorHandler = require('../utils/errorhanddler')
const asyncWrapper = require('../middleware/async')
const User = require("../Models/userModel");
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const cloudinary = require("cloudinary");

exports.registerUser = asyncWrapper(
    async(req,res,next)=>{
      console.log(req.body.avatar);
      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      })
     

        const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: myCloud.public_id,
            url:myCloud.secure_url,
        }
    });

  sendToken(user,201,res)

 });

 exports.loginUser = asyncWrapper(

    async (req, res, next) =>{

    const {email, password} = req.body;

   if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
     const token = user.getJWTToken();

     sendToken(user, 200, res)
 })


//  LOGOUT USER

 exports.logout = asyncWrapper(
    async(req, res, next)=>{

        res.cookie("token", null , {
        expires: new Date(Date.now()),
        httpOnly: true,
         })


        res.status(200).json({
            success: true,
            message:"Logged Out"
        })
    }
 )

 //Forgot password

 exports.forgotPassword = asyncWrapper(
   async(req, res, next) =>{

     const user = await User.findOne({email: req.body.email});

     if(!user){
       return next(new ErrorHandler("User not found",404))
     }
     
     const resetToken = user.getResetPasswordToken()

     await user.save({ validateBeforeSave: false });

     const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

     const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requrested this email
     then, please ignore it. `

     try {
              
      await sendEmail({
             email:user.email,
             subject: `Ecommerce Password Recovery`,
             message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      })

       
     } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
     }

   }
 );

//   Reset Password
 exports.resetPassword = asyncWrapper(
   async(req, res, next)=>{
     

    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")
     
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user){
      return next(new ErrorHandler("Reset Password Token has been Expired",400))
    }
    
    if(req.body.password !== req.body.confirmPassword){
      return next(new ErrorHandler("Password does not Match!",400))
    }

    user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
     
        await user.save()

        sendToken(user, 200, res)
   }
 )

 //GET User Detail

 exports.getUserDetails = asyncWrapper(
   async(req, res, next) =>{
    
   
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    })
    
   }
 )

 
 exports.updatePassword = asyncWrapper(
   async(req, res, next) =>{
    
    const user = await User.findById(req.user.id).select("+password")
    
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  if(req.body.newPassword !== req.body.confirmPassword){
     return next(new ErrorHandler("Password does not match", 400));
  }
   user.password = req.body.newPassword
   await user.save()
  sendToken(user, 200, res);
    
   }
 )


//update user

 exports.updateProfile = asyncWrapper(
   async(req, res, next) =>{
     const newUserData = {
       name: req.body.name,
       email: req.body.email,
     };

     if (req.body.avatar !== "") {
       const user = await User.findById(req.user.id);

       const imageId = user.avatar.public_id;

       await cloudinary.v2.uploader.destroy(imageId);

       const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
         folder: "avatars",
         width: 150,
         crop: "scale",
       });

       newUserData.avatar = {
         public_id: myCloud.public_id,
         url: myCloud.secure_url,
       };
     }

     const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
       new: true,
       runValidators: true,
       useFindAndModify: false,
     });

     res.status(200).json({
       success: true,
     });
     })


    ///   ADMIN ROUTES ///

    //  get all users
 exports.getAllUser = asyncWrapper(
   async(req, res, next)=>{
     const users = await User.find()

     res.status(200).json({
       success: true,
       users
     })

     })

//get single user     
 exports.getSingleUser = asyncWrapper(
   async(req, res, next)=>{
     const user = await User.findById(req.params.id)

     if(!user){
       return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404))
     }

     res.status(200).json({
       success: true,
       user
     })

     })

    //  Admin Update Role

 exports.updateUserRole = asyncWrapper(
   async(req, res, next) =>{
    
    const newUserData = {
      name:req.body.name,
      email:req.body.email,
      role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new:true,
      runValidators: true,
      useFindAndModify:false
    })
    
   res.status(200).json({
     success:true,
     user
   })
     })


    //  Delete User Admin
     
 exports.deleteUser = asyncWrapper(
   async(req, res, next) =>{
     
    const user = await User.findById(req.params.id)

    if(!user){
      return next(new ErrorHandler(`User does not exist with ${req.params.id}`))
    }

    await user.remove()

   res.status(200).json({
     success:true,
     massage: "User Delete Successfully"
   })
   })

  


