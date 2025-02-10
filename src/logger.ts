import * as fs from "node:fs";

export class Logger {
    private static errorLogPath: string;
    private static infoLogPath: string;
    private static warningLogPath: string;

    private static genericLogPath: string;

    public static createPaths(loggerDirectoryPath: string){
        console.log("Creating logger directory");

        this.errorLogPath = loggerDirectoryPath + "/errors.log";
        this.warningLogPath = loggerDirectoryPath + "/warning.log";
        this.infoLogPath = loggerDirectoryPath + "/info.log";
        this.genericLogPath = loggerDirectoryPath + "/generic.log";

        if (!fs.existsSync(loggerDirectoryPath)){
            fs.mkdirSync(loggerDirectoryPath);
        }

        this.generatePathFiles(this.errorLogPath);
        this.generatePathFiles(this.warningLogPath);
        this.generatePathFiles(this.infoLogPath);
        this.generatePathFiles(this.genericLogPath);

        console.log("Created logger directory");
    }

    private static generatePathFiles(path: string){
        if(!fs.existsSync(path)) {
            fs.writeFileSync(path, '');
        }
    }

    private static writeMessageToPath(path: string, message: string){
        if(!fs.existsSync(path)) {
            fs.writeFileSync(path, message);
        }else {
            fs.appendFileSync(path, "\n" + message);
        }
    }

    public static LogError(message: string) : void {
        const dateOfLog = new Date().toString();

        this.writeMessageToPath(this.errorLogPath, `[ERROR] [${dateOfLog}] ` + message);
        this.writeMessageToPath(this.genericLogPath, `[ERROR] [${dateOfLog}] ` + message);

        console.log(`[ERROR] [${dateOfLog}] ` +  message)
    }

    public static LogWarning(message: string) : void {
        const dateOfLog = new Date().toString();

        this.writeMessageToPath(this.warningLogPath, `[WARNING] [${dateOfLog}] ` +  message);
        this.writeMessageToPath(this.genericLogPath, `[WARNING] [${dateOfLog}] ` +  message);

        console.log(`[WARNING] [${dateOfLog}] ` +  message)
    }

    public static LogInfo(message: string) : void {
        const dateOfLog = new Date().toString();

        this.writeMessageToPath(this.infoLogPath, `[INFO] [${dateOfLog}] ` +  message);
        this.writeMessageToPath(this.genericLogPath, `[INFO] [${dateOfLog}] ` +  message);

        console.log(`[INFO] [${dateOfLog}] ` +  message)
    }
}