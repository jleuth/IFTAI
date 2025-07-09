import OpenAI from "openai";

import writeLog from "./logger";

const client = new OpenAI();

export async function getResponse(
  input: string,
  instructions: string,
  model: string = "gpt-4o-mini",
) {
  const response = await client.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: instructions,
      },
      {
        role: "user",
        content: input,
      },
    ],
    temperature: 0.7,
  });

  const responseText = response.choices[0]?.message?.content || "";
  writeLog("info", `Response: ${responseText}`);

  return responseText;
}
