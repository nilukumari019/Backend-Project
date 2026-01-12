
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";




const registerUser = asyncHandler(async (req, res) => {
   // 1.get user details from the user
   // 2.Validation for non empt(email, passowrd, name etc.)
   // 3.Check if user already exits by (username, email)
   // 4.check for images, check for avatar
   // 5.ulpoad them to cloudinary
   // 6.crate user object- create entry in db
   // 7.remove password and refresh token field from response
   // 8.check for user creation
   // 9.return response if successful or error 

// step1:- get user details from the user
   const {fullName,email,username,password}=req.body
   console.log("email : ",email);



   
// step2 :- Validation for non empt(email, passowrd, name etc.)
   // if(fullName ==="")
   // {
   //    throw new ApiError(400,"Fullname is required")
   // }
   

// code for checking empty field for fullname, email, username, password
   if ([fullName,email,username,password].some((field)=> 
      field?.trim()==="")
   ) {
      throw new ApiError(400,"All fields are required")
      
   } 




// step3:- Check if user already exits by (username, email)
   const existedUser=User.findOne({
      $or:[{username},{email}]
   })
   if (existedUser) {
      throw new ApiError(409,"User with email or username already exists!" )
      
   }



// step 4:-check for images, check for avatar
   const avatarLocalPath=req.files?.avatar[0]?.path;
   const coverImageLocalPath=req.files?.coverImage[0]?.path;
   if (!avatarLocalPath) {
      throw new ApiError(400,"Avatar file is required")
   }



//step 5:- ulpoad them to cloudinary
   const avatar=await uploadOnCloudinary(avatarLocalPath)
   const coverImage= await uploadOnCloudinary(coverImageLocalPath)
   // checking for avatar 
   if(!avatar)
   {
      throw new ApiError(400," Avatar is required")
   }



// 6.crate user object- create entry in db
   const user = await User.create({
      fullName,
      avatar:avatar.url,
      coverImage:coverImage?.url || "",
      email,
      password,
      username:username.toLowerCase()
   })


// step 7:-remove password and refresh token field from response
   const createdUser= await User.findById(user._id).select(
      "-password -refreshToken" // ye field nhi chahiye
   )
// step 8:- check for user creation
   if (createdUser) {
      throw new ApiError(500, "Something went wrong while registering a user")
   }

// step 9:- return response if successful or error 
   return res.status(201).json(
      new ApiResponse(200,createdUser,"User registered successfully")
   )


});

export { registerUser };
