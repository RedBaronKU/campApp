class appError extends Error
{
    constructor(statusCode,message)
    {
        super();
        this.message=message;
        this.statusCode=statusCode;
    }
    
}

module.exports=appError;