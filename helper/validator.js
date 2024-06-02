class Validator {
    static validateInfo(userInfo) {
        var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (userInfo.hasOwnProperty("email")
        && userInfo.hasOwnProperty("password") && userInfo.hasOwnProperty("role")){
            if(userInfo.email.match(emailFormat)){
            return {
                "status": true,
                "message": "Validated successfully"
            };
        } 
    }else {
            return {
                "status": false,
                "message": "Please provide all the parameters"
            }
        }
    }
    static validateEvents(eventInfo) {
        if (eventInfo.hasOwnProperty("name")
        && eventInfo.hasOwnProperty("participants")) {
           
            return {
                "status": true,
                "message": "Validated successfully"
            };
         
    }else {
            return {
                "status": false,
                "message": "Please provide all the parameters"
            }
        }
    }
    static validateEventsInfo(eventInfo) {
        if (eventInfo.hasOwnProperty("name")
        && eventInfo.hasOwnProperty("email") && eventInfo.hasOwnProperty("role")) {
           
            return {
                "status": true,
                "message": "Validated successfully"
            };
         
    }else {
            return {
                "status": false,
                "message": "Please provide all the parameters"
            }
        }
    }
}

module.exports=Validator
