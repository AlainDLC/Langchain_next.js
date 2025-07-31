/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPEN_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPEN_API_KEY,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { keyspace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages?.length - 1].content;

    let docContent = "";

    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
      encoding_format: "float",
    });

    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION);
      const curser = collection.find(null, {
        sort: {
          $vector: embedding.data[0].embedding,
        },
        limit: 10,
      });

      const documents = await curser.toArray();

      const docMap = documents?.map((doc) => doc.text);

      docContent = JSON.stringify(docMap);
    } catch (error) {
      console.log(error);
      docContent = "";
    }
    const template = {
      role: "system",
      content: `You are an AI assistans who knows everthing about Formula One.
    Use the below context to augment what you know about Formula One Racing.
    The context will provide you with the most recent page data from wikipedia,
    the official F1 website and others.
    If the context dosen't include the infromationyou need answer based on your existing knowledge and don't mention the sourse
    of your information or what context does or doesn't include
    Format responses using markdown where applicable and don't return images
    
    -------------------
    
    START CONTEXT ${docContent}
    END CONTEXT
    -------------------
    QUESTION: ${latestMessage}
    -------------------
    
    `,
    };

    const respone = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      stream: true,
      messages: [template, ...messages],
    });

    const stream = OpenAIStream(respone as any);
    return new StreamingTextResponse(stream);
  } catch (err) {
    console.log(err);
  }
}
