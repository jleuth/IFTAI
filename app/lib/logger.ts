import * as fs from "node:fs";
import path from "node:path";

const logPath = path.join(process.cwd(), "app/log.json");

export default async function writeLog(type: string, message: string) {
  let log: any[] = [];

  try {
    const contents = fs.readFileSync(logPath, "utf-8");

    if (contents) {
      log = JSON.parse(contents);
    }
  } catch {
    //If the file dont exist, start fresh
    log = [];
  }

  log.push({
    type,
    message,
    timestamp: new Date().toISOString(),
  });

  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
}

export async function getLogs() {
  let log: any[] = [];

  try {
    const contents = fs.readFileSync(logPath, "utf-8");

    if (contents) {
      log = JSON.parse(contents);
    }
  } catch {
    log = [];
  }

  // truncate for speed
  if (log.length > 100) {
    return log.slice(-100);
  }

  return log;
}
