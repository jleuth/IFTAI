import { NextResponse } from "next/server";
import * as fs from "node:fs"
import * as path from "node:path"

const stopFile = path.join(process.cwd(), 'app', '.stop')

export async function POST() {
    try {
            fs.writeFileSync(stopFile, "stop")
            return NextResponse.json({ success: true })
      } catch (error) {
        return NextResponse.json({success: false})
      }
}