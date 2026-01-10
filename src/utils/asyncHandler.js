// Promises wala code
const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error=>(next(error))))
    }
}

export {asyncHandler}




// TYR CATCH WAla code

// const asyncHandler=(fn)=>async(req,res,next)=>{
//     try {
        
//     } catch (error) {
//         res.status(error.code || 400).json({
//             success:false,
//             message:error.message
//         })
//     }

// }