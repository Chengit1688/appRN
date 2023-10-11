import { 
    logger,
    consoleTransport,
    mapConsoleTransport,
    configLoggerType,
    defLvlType,
} from "react-native-logs";
  
const config = {
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    },
    severity: "debug",
    transport: consoleTransport,
    transportOptions: {
        colors: {
            debug: "greenBright",
            info: "blueBright",
            warn: "yellowBright",
            error: "redBright",
        },
        extensionColors: {
            root: "magenta",
            home: "grey",
            user: "blue",
        },
    },
    async: true,
    dateFormat: (date: Date) => {
        let year = date.getFullYear();
        let mon = (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        let dat = date.getDate()  < 10 ? "0"+(date.getDate()) : date.getDate();
        let hour = date.getHours()  < 10 ? "0"+(date.getHours()) : date.getHours();
        let min =  date.getMinutes()  < 10 ? "0"+(date.getMinutes()) : date.getMinutes();
        let seon = date.getSeconds() < 10 ? "0"+(date.getSeconds()) : date.getSeconds();
                     
        let newDate = year +"-"+ mon +"-"+ dat +" "+ hour +":"+ min +":"+ seon;
        return newDate + ' | ';

    },
    printLevel: true,
    printDate: true,
    enabled: true,
};

const log = logger.createLogger<defLvlType>(config);
log.patchConsole();
// log.disable();

// const rootLog = log.extend("root");
// const homeLog = log.extend("home");
// const userLog = log.extend("user");

// log.debug("Simple log");
  
// rootLog.warn("Magenta extension and bright yellow message");
// homeLog.error("Gray extension and bright red message");

// rootLog.error("Root error log message");

// userLog.debug("User logged in correctly");
// userLog.error("User wrong password");

// rootLog.info("Log Object:", { a: 1, b: 2 });

// rootLog.info("Multiple", "strings", ["array1", "array2"]);

// log.debug("This is a Debug log");
// log.info("This is an Info log");
// log.warn("This is a Warning log");
// log.error("This is an Error log");

export default log;