import * as fs from "node:fs"
import path from "node:path"

const logPath = (path.join(process.cwd(), 'app/log.json'), 'utf8')

export default async function writeLog(type: string, message: string) {
    const log = JSON.parse(fs.readFileSync(logPath).toString())

    log.push({
        type,
        message,
        timestamp: new Date().toISOString()
    })
    
}

export async function getLogs() {
    const log = JSON.parse(fs.readFileSync(logPath).toString())

    // truncate for speed
    if (log.length > 100) {
        return log.slice(-100)
    }
    return log
}


