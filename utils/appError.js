class appError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4')?'fail...💥':'error...💥';
        this.isOperational = true;
        Error.captureStackTrace(this, constructor); 
    }
}
module.exports = appError;

/* About this Class: 
    this class accept to parametars: error mesage and sattus code for General error
    this class make status from status code paramerar
    and make other options maybe we needed i you'r app, goodluck...✌*/