import {asyncHandlerRequestResolve} from "../utils/asyncHandler.js"



const registerUser = asyncHandlerRequestResolve( async (req,res)=>{


 return   res.status(200).json({
        message:"ok"
    })
})

export {registerUser}