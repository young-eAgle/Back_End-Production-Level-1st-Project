const asyncHandlerRequestResolve=(requestHandler) => {

   return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}




export {asyncHandlerRequestResolve}


// const asyncHandlerTryCatch =(func)=>{ async (req,res,next)=>{
//     try {
        
//       await  func(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }}


// const asyncHandler = (fn) =>()=>{}

    // This function is a high order function which accept function as parameter and return it.