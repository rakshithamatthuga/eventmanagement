class Validator {
    static validateCourseInfo(userInfo) {
        var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (userInfo.hasOwnProperty("email")
        && userInfo.hasOwnProperty("password")) {
            if(userInfo.email.match(emailFormat)){
            return {
                "status": true,
                "message": "Validated successfully"
            };
        } 
        return {
            "status": false,
            "message": "Validated successfully"
        };
    }else {
            return {
                "status": false,
                "message": "Course info is malformed, please provide all the parameters"
            }
        }
    }
}

module.exports = Validator;