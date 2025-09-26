import fetch from "node-fetch";

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const userInput = body.input || "";

    // ❌ Illegal input filter
    if (userInput.toLowerCase().includes("illegal")) {
      // Example: email alert
      console.log("Illegal input detected: " + userInput);
      return {
        statusCode: 400,
        body: JSON.stringify({ answer: "⚠️ Illegal input not allowed!" })
      };
    }

    // ✅ Use OpenAI API (env key from Netlify settings)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful AI assistant that can answer in any language, fix grammar, and explain URLs." },
          { role: "user", content: userInput }
        ]
      })
    });
    const data = await response.json();
    const aiText = data.choices[0].message.content;

    // 🎤 Voice output (optional using gpt-4o-mini-tts)
    const audioRes = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: aiText
      })
    });
    const audioBuffer = await audioRes.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: aiText, audio: audioBase64 })
    };

  } catch (err) {
    return { statusCode: 500, body: "Server Error: " + err.message };
  }
}
