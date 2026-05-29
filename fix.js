const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(file, 'utf8');

const newCallAI = `async function callAI(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey.length < 10) throw new Error("Get a FREE Groq key at console.groq.com then add VITE_GROQ_API_KEY to .env");
  const models = ["llama3-8b-8192", "llama-3.1-8b-instant", "mixtral-8x7b-32768", "gemma-7b-it"];
  let lastError = "All models failed";
  for (const model of models) {
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": \`Bearer \${apiKey}\` },
        body: JSON.stringify({ model, max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        if (r.status === 401) throw new Error("Invalid Groq API key");
        lastError = (e as any)?.error?.message || \`HTTP \${r.status}\`;
        continue;
      }
      const d = await r.json();
      const t = d.choices?.[0]?.message?.content;
      if (t) return t;
      lastError = "Empty response";
    } catch(e: any) { if (e.message?.includes("Invalid Groq")) throw e; lastError = e.message; }
  }
  throw new Error(lastError);
}`;

// Find the start and end of callAI using regex (handles both \n and \r\n)
const startMarker = 'async function callAI(prompt: string): Promise<string> {';
const startIdx = content.indexOf(startMarker);

if (startIdx === -1) {
  console.error('ERROR: Could not find callAI function start!');
  process.exit(1);
}

// Find the closing brace of callAI
// We look for a standalone "}" on its own line after the start
let depth = 0;
let endIdx = -1;
let i = startIdx;
while (i < content.length) {
  if (content[i] === '{') depth++;
  if (content[i] === '}') {
    depth--;
    if (depth === 0) {
      endIdx = i + 1;
      break;
    }
  }
  i++;
}

if (endIdx === -1) {
  console.error('ERROR: Could not find end of callAI function!');
  process.exit(1);
}

console.log('Found callAI from index', startIdx, 'to', endIdx);
console.log('Old content:', JSON.stringify(content.slice(startIdx, Math.min(startIdx+100, endIdx))));

const fixed = content.slice(0, startIdx) + newCallAI + content.slice(endIdx);
fs.writeFileSync(file, fixed, 'utf8');
console.log('SUCCESS! callAI replaced with Groq implementation.');
