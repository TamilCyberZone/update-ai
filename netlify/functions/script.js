export async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const input = (body.input || "").toLowerCase().trim();

    let answer = "Hello"; // default

    // Backend AI logic
    if (input === "hi") {
      answer = "Bye";
    } else if (input === "hello") {
      answer = "Bye Bye!";
    } else if (!input) {
      answer = "Hello";
    } else {
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
