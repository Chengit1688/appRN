import { showMessage, hideMessage } from "react-native-flash-message";

function info(message:string,description?:string) {
    let msg = {
        message,
        description,
        // backgroundColor: "purple", // background color
        // color: "#ffffff", // text color
    }
    showMessage(msg);
}

function warn(message:string,description?:string) {
    let msg = {
        message,
        description,
        type: "warning",
    }
    showMessage(msg);
}

function error(message:string,description?:string) {
    let msg = {
        message,
        description,
        type: "danger",
    }
    showMessage(msg);
}

function success(message:string,description?:string) {
    let msg = {
        message,
        description,
        type: "success",
    }
    showMessage(msg);
}


export {
    info,
    warn,
    error,
    success
}