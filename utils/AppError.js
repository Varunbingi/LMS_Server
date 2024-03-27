class AppError extends Error{
    constructor(message,statuscode){
        super(message);
        this.statuscode=statuscode;
        Error.captureStackTrace(this,this.contructor)
    }
    
}

export default AppError;