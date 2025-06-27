import OpenAI from 'openai';

const client = new OpenAI();

export async function getResponse(input: string, instructions: string, model: string) {
    const response = await client.responses.create({
        model: model,
        instructions: instructions,
        input: input,
    });

    return response.output_text;
}