const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: "<your openai api key>",
});

async function getEmbedding(data) {
    const res = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: data,
    });
    console.log("Embedding length:", res.data[0].embedding); // should be 1536
}

getEmbedding("racing car movie");
