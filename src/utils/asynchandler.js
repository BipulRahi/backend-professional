// it is higher order function tht means it aaccept function as parameter and return as parameter

// const asynchandler=()=>{
// const asynchandler=(fn)=>{()=>{}}

// via try-catch

// const asynchandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       suceess: false,
//       message: error.message,
//     });
//   }
// };

// Via promises


// as we have to call the db again nd again that why 
const asynchandler=(requestHandler)=>{
   return  (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).
    catch((err)=>next(err))
   }
}

export {asynchandler}