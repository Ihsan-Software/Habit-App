module.exports = fn=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    };
};
/*  About This Function...
    this function to catch error from async functions and sent it to 
    errorcController to show it for the user
*/
