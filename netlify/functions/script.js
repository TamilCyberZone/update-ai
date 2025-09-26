import fetch from "node-fetch";

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const userInput = body.input || "";

    // ❌ Filter illegal inputs
    if (userInput.toLowerCase().includes("illegal")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ answer: "⚠️ Illegal input not allowed!" })
      };
    }

    // ✅ Search in Wikipedia API (open, no key needed)
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
    return { statusCode: 500, body: "Server Error: " + err.message };
  }
}
