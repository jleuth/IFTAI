import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ENV_FILE_PATH = path.join(process.cwd(), '.env.local');

export async function GET() {
  try {
    const envData = {
      ENABLE_WORKFLOWS: process.env.ENABLE_WORKFLOWS === 'true',
      ENABLE_WEBHOOKS: process.env.ENABLE_WEBHOOKS === 'true',
      ENABLE_TELEGRAM: process.env.ENABLE_TELEGRAM === 'true',
      ENABLE_OPENAI: process.env.ENABLE_OPENAI === 'true',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
      TELEGRAM_BOT_API_KEY: process.env.TELEGRAM_BOT_API_KEY || '',
      CHAT_ID: process.env.CHAT_ID || ''
    };

    return NextResponse.json(envData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    let envContent = '';
    
    if (fs.existsSync(ENV_FILE_PATH)) {
      envContent = fs.readFileSync(ENV_FILE_PATH, 'utf8');
    }

    const envVars = {
      ENABLE_WORKFLOWS: data.ENABLE_WORKFLOWS ? 'true' : 'false',
      ENABLE_WEBHOOKS: data.ENABLE_WEBHOOKS ? 'true' : 'false',
      ENABLE_TELEGRAM: data.ENABLE_TELEGRAM ? 'true' : 'false',
      ENABLE_OPENAI: data.ENABLE_OPENAI ? 'true' : 'false',
      OPENAI_API_KEY: data.OPENAI_API_KEY || '',
      TELEGRAM_BOT_API_KEY: data.TELEGRAM_BOT_API_KEY || '',
      CHAT_ID: data.CHAT_ID || ''
    };

    let newEnvContent = envContent;

    Object.entries(envVars).forEach(([key, value]) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      const line = `${key}=${value}`;
      
      if (regex.test(newEnvContent)) {
        newEnvContent = newEnvContent.replace(regex, line);
      } else {
        newEnvContent += `\n${line}`;
      }
    });

    fs.writeFileSync(ENV_FILE_PATH, newEnvContent.trim() + '\n');

    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}