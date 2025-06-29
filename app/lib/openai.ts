import OpenAI from "openai";

import writeLog from "./logger";

const client = new OpenAI();

export async function getResponse(
  input: string,
  instructions: string,
  model: string,
) {
  const response = await client.responses.create({
    model: model,
    instructions: instructions,
    input: input,
  });

  writeLog("info", `Response: ${response.output_text}`);

  return response.output_text;
}
