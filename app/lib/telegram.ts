import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_KEY!);

export default async function sendTelegramMessage(
  message: string,
  workflowId: number,
) {
  await bot.sendMessage(
    process.env.CHAT_ID!,
    `A message from IFTAI on workflow ${workflowId}: ${message}`,
  );

  return { success: true, message: "message sent successfully" };
}
