// ─────────────────────────────────────────────────────────────────
// Groq API — Direct from frontend, No backend needed
// ─────────────────────────────────────────────────────────────────

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function callAI(prompt: string): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error(
      "Missing API key. Add VITE_GROQ_API_KEY=your_key to .env file and restart dev server."
    );
  }

  let response: Response;
  try {
    response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 1500,
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }],
      }),
    });
  } catch (networkErr: any) {
    throw new Error(
      "Network error: Could not reach Groq API. Please check your internet connection."
    );
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const msg =
      (errData as any)?.error?.message ||
      `Groq API returned HTTP ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Groq — try again.");
  return text;
}

// ─── Shorthand helpers ─────────────────────────────────────────

export const aiExplain = (issue: any) =>
  callAI(`You are Guru AI, a senior code security expert. Respond ONLY in the exact structured format below — no extra prose.

## 🔍 Issue Details
- **Type:** ${issue.title}
- **Severity:** ${issue.severity.toUpperCase()}
- **Line:** ${issue.line}
- **Snippet:** \`${issue.snippet}\`

## ⚠️ Why It's Dangerous
[2-3 sentences explaining the exact risk and impact]

## 💥 Real Attack Scenario
[Concrete, realistic example of how an attacker would exploit this — be specific]

## ✅ Fixed Code
\`\`\`
[Show the corrected version of the snippet with the fix applied]
\`\`\`

## 📌 Best Practice
[One clear rule or pattern to prevent this class of vulnerability in future]

Now respond for this issue:
Title: ${issue.title} | Severity: ${issue.severity} | Line: ${issue.line} | Snippet: ${issue.snippet} | Suggested Fix: ${issue.fix}`);

export const aiFixCode = (code: string, issues: any[]) =>
  callAI(`You are Guru AI, an expert code reviewer. Fix the issues listed below and return a structured response in EXACTLY this format:

## 🛠️ Issues Fixed
${issues.slice(0, 5).map((i, idx) => `${idx + 1}. **Line ${i.line} — ${i.title}:** ${i.fix}`).join("\n")}

## ✅ Fixed Code
\`\`\`
[Full corrected code with // FIXED: short comment on each changed line]
\`\`\`

## 📋 Summary of Changes
[Bullet list of every change made and why]

Original Code:
\`\`\`
${code.slice(0, 2000)}
\`\`\`

Respond ONLY in the format above. Do not add any prose outside the sections.`);

export const aiOptimize = (code: string, lang: string) =>
  callAI(`You are Guru AI, a performance optimization expert. Analyze and optimize the ${lang} code below. Respond in EXACTLY this structured format:

## 🔎 Performance Analysis
| Issue | Location | Impact |
|---|---|---|
[Fill table rows for each identified bottleneck]

## ⚡ Optimized Code
\`\`\`${lang}
[Full optimized code with // OPT: comment on every optimized line]
\`\`\`

## 📈 Improvements Made
- **Time Complexity:** [Before → After, e.g. O(n²) → O(n)]
- **Space Complexity:** [Before → After]
- **Readability:** [What was simplified]
- **Best Practices:** [What patterns were applied]

## 💡 Further Recommendations
[2-3 additional suggestions if any]

Code to optimize:
\`\`\`${lang}
${code.slice(0, 2000)}
\`\`\``);

export const aiChat = (msg: string, code: string, history: any[]) =>
  callAI(`You are Guru AI, an expert code assistant. Be structured and clear in every response.

Rules:
- Always use markdown headers (##) to separate sections
- Wrap ALL code in fenced code blocks with the language tag
- Use bullet points for lists, never run-on sentences
- If the question is about a bug/error, always include a ## ✅ Fix section
- If the question is conceptual, use ## 📖 Explanation + ## 💡 Example
- Keep answers focused — no filler text

${code ? `## 📄 Code Context\n\`\`\`\n${code.slice(0, 800)}\n\`\`\`` : ""}

${history.slice(-4).map(h => `**${h.role === "user" ? "User" : "Guru AI"}:** ${h.content}`).join("\n")}

**User:** ${msg}

**Guru AI:**`);
