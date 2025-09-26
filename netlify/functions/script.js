import fetch from "node-fetch";

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const userInput = body.input || "";

    // ❌ Illegal input filter
    if (userInput.toLowerCase().includes("illegal")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ answer: "⚠️ Illegal input not allowed!" })
      };
    }

    // ✅ Wikipedia REST API (no API key needed)
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(userInput)}`;
    const response = await fetch(url);
    const data = await response.json();

    let result;
    if (data.extract) {
      result = data.extract;
    } else {
      result = "❌ No Wikipedia result found for: " + userInput;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: result })
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ answer: "Server Error: " + err.message }) };
  }
}
