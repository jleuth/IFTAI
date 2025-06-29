import * as fs from "node:fs";
import * as path from "node:path";

import { NextResponse } from "next/server";

const stopFile = path.join(process.cwd(), "app", ".stop");

export async function POST() { // No auth here for a reason.
  try {
    fs.writeFileSync(stopFile, "stop");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
