export async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    let input = (body.input || "").toLowerCase().trim();

    // Block dangerous keywords
    const blocked = ["script", "location", "window", "document", "require", "__dirname"];
    if (blocked.some(word => input.includes(word))) {
      return {
        statusCode: 400,
        body: JSON.stringify({answer: "⚠️ Input not allowed!"})
      };
    }

    let answer = "Hello"; // default
    if (input === "hi") answer = "Bye";
    else if (input === "hello") answer = "Bye Bye!";
    else if (!input) answer = "Hello";
    else answer = "You said: " + input;

    return {
      statusCode: 200,
      body: JSON.stringify({answer})
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({answer: "Server Error: " + err.message})
    };
  }
}
