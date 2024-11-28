import {asyncHandlerRequestResolve} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/fileUpload.Cloudinary.js"
import { User } from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"



const generateAccessAndRefreshTokens = async(userId)=>{
  try{

    const user = await User.findById(userId)

    const accessToken = user.generateAccessToken()
    const refreshToken= user.generateRefreshToken()

   user.refreshToken = refreshToken
   await user.save({ validateBeforeSave: false })


   return {accessToken, refreshToken}


  }catch(error){
    throw new ApiError(500,"Something went wrong while generating refresh and access token")
  }
}

const registerUser = asyncHandlerRequestResolve( async (req,res)=>{

//  return   res.status(200).json({
//         message:"ok"
//     })


 // get user details from frontend
 // validation - not empty
 // check if user already exist:username , email
 // check for images, check for avatar
 // upload them to cloudinary avatar
 // create user object- creation entry in db
 // remove password and refresh token field from response
 // check for user creation
 // return response


   const {fullName,email,username, password} = req.body
   console.log("email:" ,email);

//    if(fullName===""){
//     throw new ApiError(400,"fullname is required")
//    }

// This above given method is begginer approach but we can use something other than this


   if(
    [fullName,email,username,password].some((field)=>{
        return field?.trim()===""
    })
   ){
    throw new ApiError(400,"All fields are required")
   }
   

   const existedUser = await User.findOne({
    $or:[

        {username},
        {email}
    ]
   })


   if(existedUser){
     
    throw new ApiError(409 , "User with email or Username already exists")
   }

    console.log(req.files)


   const avatarLocalPath = req.files?.avatar[0]?.path;
  //  const coverImageLocalPath= req.files?.coverImage[0]?.path;


   let coverImageLocalPath;

   if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length > 0)
    {
      coverImageLocalPath = req.files.coverImage[0].path


    }

   if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
   }



  const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage= await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }


   const user = await User.create({
        fullName: fullName,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        email:email,
        password:password,
        username: username.toLowerCase()

    })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
  }


  return res.status(201).json(

new ApiResponse(200,createdUser, "User registered Successfully")
    
  )

})


const loginUser = asyncHandlerRequestResolve(async (req, res) =>{

  //  get data from the req.body 
  //  username or email
  //  find the user
  //  password check
  //  access and refresh token
  //   send cookie


  const {email,username,password} = req.body
  

  if(!username && !eamil){

    throw new ApiError(400, "username or password is required")
  }


  const user = await User.findOne({
    

    $or:[
      {username}, {email}
    ]

  })
  if(!user){
    throw new ApiError(404, "user does not exist")
  }
  


  const isPasswordValid= user.isPasswordCorrect(password)
  if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials")
  }





 const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

 const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

 const options ={
   httpOnly:true,
   secure:true
 }


    return res
    .status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken, refreshToken, options")
    .json(
      new ApiResponse(200,
                     {user:loggedInUser, accessToken, refreshToken},
                     "User logged In Successfully"

      )
    )

})


const logoutUser =asyncHandlerRequestResolve(async(req,res)=>{



  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }
  )

  const options = {
    httpOnly:true,
    secure:true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json( new ApiResponse(200, {},"User logged Out"))

})


// const logoutUser = (requsetHandlerCode) => {async(req,res)=>{


//   await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set:{
//         refreshToken:undefined
//       }
//     },
//     {
//       new:true
//     }
//   )

//   const options = {
//     httpOnly:true,
//     secure:true
//   }

//   return res
//   .status(200)
//   .clearCookie("accessToken", options)
//   .clearCookie("refreshToken", options)
//   .json( new ApiResponse(200, {},"User logged Out"))
// }
// }


// const asyncHandlerRequestResolve=(requestHandler) => {

//   return (req,res,next)=>{
//        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
//    }
// }




// export {asyncHandlerRequestResolve}



const refreshAccessToken = asyncHandlerRequestResolve(async(req,res)=>{


    const incomingRefreshToken = req.cookies.
    refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
      throw new ApiError(401, "unauthorized request")
    }

   try {
     const decodedToken = jwt.verify(
       incomingRefreshToken,
       process.env.REFRESH_TOKEN_SECRET
     )
 
    const user = await User.findById(decodedToken?._id)
 
    if(!user){
     throw new ApiError(401, "Invalid refresh token")
    }
 
    if(incomingRefreshToken !== user?.refreshToken){
 
     throw new ApiError(401, "Refresh Token is expired or used")
 
    }
 
 
        const options ={
         httpOnly:true,
         secure: true
        }
 
       const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
 
        return res 
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options )
        .json(
         new ApiResponse(
           200,
           { accessToken:accessToken, refreshToken:newRefreshToken},
           "Access Token refreshed"
 
         )
        )
   } catch (error) {

    throw new ApiError(401, error?.message || "Invalid refresh token")


    
   }
})


const changeCurrentPassword = asyncHandlerRequestResolve(async(req,res)=>{



  const {oldPassword, newPassword} = req.body
  const user = await User.findById(req.user?.id)
  const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid old password")
  }

})

export {registerUser, loginUser, logoutUser, refreshAccessToken} 