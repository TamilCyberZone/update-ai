export async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const input = (body.input || "").toLowerCase().trim();

    let answer = "Hello"; // Default response

    // Simple logic
    if (input === "hi") {
      answer = "Hello";
    } else if (input === "how are you") {
      answer = "I am fine, thank you!";
    } else if (input) {
      answer = "You said: " + input;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ answer })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: "Server Error: " + err.message })
    };
  }
}
