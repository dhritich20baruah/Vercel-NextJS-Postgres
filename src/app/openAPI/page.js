"use client";
import { useState } from "react";
import axios from "axios";
export default function OpenAPI() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/openAI", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.text);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-10 space-y-3">
      <h1>OpenAI GPT in Next.js</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask something..."
          rows="5"
          cols="50"
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
      {response && (
        <div>
          <h3>Response from GPT:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
