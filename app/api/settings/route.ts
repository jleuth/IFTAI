import fs from "fs";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

const ENV_FILE_PATH = path.join(process.cwd(), ".env.local");

export async function GET(request: NextRequest) {

  // Auth
  const authToken = request.headers.get("x-auth-token")

  if (!authToken || authToken !== process.env.NEXT_PUBLIC_AUTH_TOKEN) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401 }
    )
  }

  try {
    // Grab all the env var data minus auth token
    const envData = {
      ENABLE_WORKFLOWS: process.env.ENABLE_WORKFLOWS === "true", // We need to convert these to actual booleans, so we use === true
      ENABLE_WEBHOOKS: process.env.ENABLE_WEBHOOKS === "true",
      ENABLE_TELEGRAM: process.env.ENABLE_TELEGRAM === "true",
      ENABLE_OPENAI: process.env.ENABLE_OPENAI === "true",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
      TELEGRAM_BOT_API_KEY: process.env.TELEGRAM_BOT_API_KEY || "",
      CHAT_ID: process.env.CHAT_ID || "",
    };

    // that's literally it, return just that.
    return NextResponse.json(envData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // We make this a let because we wanna update it and read it, const dont do that
    let envContent = "";

    if (fs.existsSync(ENV_FILE_PATH)) {
      envContent = fs.readFileSync(ENV_FILE_PATH, "utf8");
    }

    // Check the status
    const envVars = {
      ENABLE_WORKFLOWS: data.ENABLE_WORKFLOWS ? "true" : "false", // Again, these get converted to real bools
      ENABLE_WEBHOOKS: data.ENABLE_WEBHOOKS ? "true" : "false",
      ENABLE_TELEGRAM: data.ENABLE_TELEGRAM ? "true" : "false",
      ENABLE_OPENAI: data.ENABLE_OPENAI ? "true" : "false",
      OPENAI_API_KEY: data.OPENAI_API_KEY || "",
      TELEGRAM_BOT_API_KEY: data.TELEGRAM_BOT_API_KEY || "",
      CHAT_ID: data.CHAT_ID || "",
    };

    // First, put the old env content into the new env content
    let newEnvContent = envContent;

    Object.entries(envVars).forEach(([key, value]) => {
      const regex = new RegExp(`^${key}=.*$`, "m");
      const line = `${key}=${value}`;

      if (regex.test(newEnvContent)) {
        newEnvContent = newEnvContent.replace(regex, line); // Update without entirely overwriting the file
      } else {
        newEnvContent += `\n${line}`;
      }
    });

    fs.writeFileSync(ENV_FILE_PATH, newEnvContent.trim() + "\n"); // Actually write to the file

    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value; //Update our vars without needing to restart the server
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 },
    );
  }
}
