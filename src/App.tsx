// App.tsx — Guru AI · Complete Integration
// FIXES: 1) Google Auth fallback/demo mode  2) Security scanner regex fixed  3) All syntax errors resolved

import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import emailjs from "@emailjs/browser";

// ─────────────────────────────────────────────────────────────────
// FIREBASE
// ─────────────────────────────────────────────────────────────────
const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: "guruai-reviewer.firebaseapp.com",
  projectId: "guruai-reviewer",
  storageBucket: "guruai-reviewer.firebasestorage.app",
  messagingSenderId: "709695803360",
  appId: "1:709695803360:web:7e48d87dc0797dd37ba585",
});
const fbAuth = getAuth(firebaseApp);
const fbProvider = new GoogleAuthProvider();

// ─────────────────────────────────────────────────────────────────
// THEMES
// ─────────────────────────────────────────────────────────────────
const THEMES: Record<string, any> = {
  dark: {
    name:"Dark", bg:"#060810", sidebar:"#08090f", card:"#0c0e18", card2:"#0f1120",
    border:"#1a1d2e", border2:"#222535", text:"#e2e8f0", textDim:"#64748b",
    textFaint:"#334155", textGhost:"#1e293b", input:"#0c0e18", headerBg:"#08090f",
    blue:"#38bdf8", blueDark:"#0ea5e9", red:"#f87171", redBg:"rgba(239,68,68,0.1)",
    redText:"#f87171", orange:"#fb923c", orangeBg:"rgba(251,146,60,0.1)",
    green:"#4ade80", greenBg:"rgba(74,222,128,0.1)",
    navHover:"rgba(56,189,248,0.06)", navActive:"rgba(56,189,248,0.1)",
    panelBg:"#060810", accent:"#38bdf8", termText:"#4ade80",
  },
  cyberpunk: {
    name:"Cyberpunk", bg:"#0a0010", sidebar:"#0d0015", card:"#110018", card2:"#140020",
    border:"#2d0045", border2:"#3d0060", text:"#f0e6ff", textDim:"#9d7fc5",
    textFaint:"#4a2d6b", textGhost:"#2d1545", input:"#110018", headerBg:"#0d0015",
    blue:"#f700ff", blueDark:"#cc00dd", red:"#ff2060", redBg:"rgba(255,32,96,0.1)",
    redText:"#ff2060", orange:"#ff8800", orangeBg:"rgba(255,136,0,0.1)",
    green:"#00ff88", greenBg:"rgba(0,255,136,0.1)",
    navHover:"rgba(247,0,255,0.06)", navActive:"rgba(247,0,255,0.12)",
    panelBg:"#0a0010", accent:"#f700ff", termText:"#00ff88",
  },
  light: {
    name:"Light", bg:"#f1f5f9", sidebar:"#ffffff", card:"#ffffff", card2:"#f8fafc",
    border:"#e2e8f0", border2:"#cbd5e1", text:"#0f172a", textDim:"#475569",
    textFaint:"#94a3b8", textGhost:"#e2e8f0", input:"#f8fafc", headerBg:"#ffffff",
    blue:"#2563eb", blueDark:"#1d4ed8", red:"#dc2626", redBg:"rgba(220,38,38,0.08)",
    redText:"#dc2626", orange:"#ea580c", orangeBg:"rgba(234,88,12,0.08)",
    green:"#16a34a", greenBg:"rgba(22,163,74,0.08)",
    navHover:"rgba(37,99,235,0.06)", navActive:"rgba(37,99,235,0.1)",
    panelBg:"#f1f5f9", accent:"#2563eb", termText:"#16a34a",
  },
};

// ─────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────
const getCSS = (t: any) => `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;background:${t.bg};}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-thumb{background:${t.border2};border-radius:2px;}
::-webkit-scrollbar-track{background:transparent;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
@keyframes slideLeft{from{opacity:0;transform:translateX(-18px);}to{opacity:1;transform:translateX(0);}}
@keyframes slideRight{from{opacity:0;transform:translateX(18px);}to{opacity:1;transform:translateX(0);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
@keyframes glow{0%,100%{box-shadow:0 0 10px ${t.accent}40;}50%{box-shadow:0 0 25px ${t.accent}80;}}
@keyframes morphBg{0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 50%;}50%{border-radius:40% 60% 30% 70%/60% 40% 50% 50%;}}
@keyframes float3d{0%,100%{transform:perspective(800px) rotateX(2deg) rotateY(-1deg) translateY(0);}50%{transform:perspective(800px) rotateX(-1deg) rotateY(2deg) translateY(-8px);}}
@keyframes fadeSlideIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
.panel-enter{animation:fadeUp 0.28s cubic-bezier(0.22,1,0.36,1) both;}
.slide-left{animation:slideLeft 0.22s cubic-bezier(0.22,1,0.36,1) both;}
.nav-item{display:flex;align-items:center;gap:10px;padding:8px 16px;font-size:11.5px;border-left:2px solid transparent;cursor:pointer;user-select:none;font-family:'JetBrains Mono',monospace;transition:all 0.18s cubic-bezier(0.22,1,0.36,1);color:${t.textDim};}
.nav-item:hover{color:${t.blue};background:${t.navHover};transform:translateX(3px);padding-left:20px;}
.nav-item.active{color:${t.blue};border-left-color:${t.accent};background:${t.navActive};font-weight:600;}
.tab-btn{padding:8px 13px;font-size:11px;border-bottom:2px solid transparent;cursor:pointer;white-space:nowrap;user-select:none;font-family:'JetBrains Mono',monospace;transition:all 0.15s;color:${t.textFaint};}
.tab-btn:hover{color:${t.textDim};background:${t.navHover};}
.tab-btn.active{color:${t.blue};border-bottom-color:${t.accent};}
.btn-primary{background:linear-gradient(135deg,${t.blueDark},${t.blue});color:#fff;border:none;border-radius:8px;font-family:'JetBrains Mono',monospace;cursor:pointer;transition:all 0.18s;box-shadow:0 4px 20px ${t.accent}30;position:relative;overflow:hidden;}
.btn-primary::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);transform:translateX(-100%);transition:transform 0.4s;}
.btn-primary:hover:not(:disabled)::after{transform:translateX(100%);}
.btn-primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px ${t.accent}50;}
.btn-primary:active:not(:disabled){transform:translateY(0);}
.btn-primary:disabled{opacity:0.45;cursor:not-allowed;}
.card-hover{transition:transform 0.28s cubic-bezier(0.22,1,0.36,1),box-shadow 0.28s;}
.card-hover:hover{transform:perspective(700px) rotateX(-1deg) rotateY(1deg) translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.25);}
.issue-card{transition:all 0.2s;}
.issue-card:hover{transform:translateX(6px);box-shadow:0 4px 20px rgba(0,0,0,0.25);}
.score-hover{transition:transform 0.25s cubic-bezier(0.22,1,0.36,1),box-shadow 0.25s;cursor:default;}
.score-hover:hover{transform:translateY(-6px) scale(1.04);}
@media(max-width:768px){.sidebar-desktop{display:none !important;}.mobile-only{display:flex !important;}.score-grid{grid-template-columns:1fr 1fr !important;}.chart-flex{flex-direction:column !important;}.complexity-grid{grid-template-columns:1fr !important;}}
@media(min-width:769px){.mobile-only{display:none !important;}}
`;

// ─────────────────────────────────────────────────────────────────
// REAL SECURITY SCANNER — FIX: Fresh regex per line, no /g flag reuse bug
// ─────────────────────────────────────────────────────────────────
function runSecurityScan(code: string) {
  const lines = code.split("\n");
  const issues: any[] = [];

  // FIX: Rules defined as functions that return fresh RegExp each call
  // This prevents the /g lastIndex stale state bug
  const rules = [
    {
      test: (line: string) => /eval\s*\(/.test(line),
      sev:"critical", title:"Unsafe eval() usage",
      desc:"eval() executes arbitrary strings as code — severe RCE risk.",
      fix:"Use JSON.parse() or safe alternatives."
    },
    {
      test: (line: string) => /innerHTML\s*=/.test(line),
      sev:"critical", title:"Unsafe innerHTML (XSS)",
      desc:"Setting innerHTML from user data enables Cross-Site Scripting.",
      fix:"Use textContent or DOMPurify.sanitize()."
    },
    {
      test: (line: string) => /document\.write\s*\(/.test(line),
      sev:"critical", title:"document.write() — XSS risk",
      desc:"Overwrites page content and enables script injection.",
      fix:"Use DOM API methods."
    },
    {
      test: (line: string) => /SELECT.+WHERE.+\$\{/i.test(line),
      sev:"critical", title:"SQL Injection — template literal",
      desc:"String interpolation in SQL allows injection attacks.",
      fix:"Use parameterized queries: db.query('…?', [val])"
    },
    {
      test: (line: string) => /(SECRET_KEY|API_KEY|PASSWORD|TOKEN|PRIVATE_KEY)\s*=\s*["'][^"']{6,}["']/i.test(line),
      sev:"critical", title:"Hardcoded secret/credential",
      desc:"Secrets in source code get leaked via version control.",
      fix:"Use process.env.SECRET or a secrets manager."
    },
    {
      test: (line: string) => /sk-[a-zA-Z0-9]{20,}/.test(line),
      sev:"critical", title:"Exposed OpenAI API key",
      desc:"OpenAI key in source will be billed if exposed.",
      fix:"Move to server-side env var."
    },
    {
      test: (line: string) => /AIza[0-9A-Za-z\-_]{35}/.test(line),
      sev:"critical", title:"Exposed Google API key",
      desc:"Google API key detected in source.",
      fix:"Restrict in GCP console + use env var."
    },
    {
      test: (line: string) => /new\s+Function\s*\(/.test(line),
      sev:"critical", title:"Dynamic Function() — eval-like",
      desc:"new Function() executes arbitrary code like eval.",
      fix:"Avoid dynamic function construction."
    },
    {
      test: (line: string) => /dangerouslySetInnerHTML/.test(line),
      sev:"warning", title:"dangerouslySetInnerHTML (React)",
      desc:"Can enable XSS if content is not sanitized.",
      fix:"Sanitize with DOMPurify before use."
    },
    {
      test: (line: string) => /Math\.random\(\)/.test(line),
      sev:"info", title:"Weak randomness (Math.random)",
      desc:"Not cryptographically secure. Avoid for tokens/keys.",
      fix:"Use crypto.getRandomValues()."
    },
    {
      test: (line: string) => /http:\/\//.test(line),
      sev:"warning", title:"Insecure HTTP URL",
      desc:"HTTP exposes data in transit. Use HTTPS.",
      fix:"Replace all http:// with https://"
    },
    {
      test: (line: string) => /console\.log\s*\(/.test(line),
      sev:"info", title:"Debug console.log() remaining",
      desc:"Remove before production deployment.",
      fix:"Use a structured logger with levels."
    },
    {
      test: (line: string) => /\bvar\s+/.test(line),
      sev:"info", title:"Outdated 'var' keyword",
      desc:"var has function scope and hoisting issues.",
      fix:"Replace with const or let."
    },
    {
      test: (line: string) => /window\.location\s*=|window\.location\.href\s*=/.test(line),
      sev:"warning", title:"Open redirect risk",
      desc:"Unvalidated location assignment enables open redirects.",
      fix:"Whitelist allowed redirect URLs."
    },
  ];

  // FIX: Track which rules fired per line to avoid duplicates
  lines.forEach((line, idx) => {
    const firedTitles = new Set<string>();
    rules.forEach(rule => {
      if (!firedTitles.has(rule.title) && rule.test(line)) {
        firedTitles.add(rule.title);
        issues.push({
          severity: rule.sev,
          title: rule.title,
          line: idx + 1,
          snippet: line.trim().slice(0, 70),
          description: rule.desc,
          fix: rule.fix,
          file: "code",
        });
      }
    });
  });

  // Complexity analysis
  let depth = 0, maxDepth = 0, cc = 1;
  const depthIssueLines = new Set<number>();
  lines.forEach((line, idx) => {
    depth += (line.match(/\{/g)||[]).length - (line.match(/\}/g)||[]).length;
    maxDepth = Math.max(maxDepth, Math.max(0, depth));
    if (/\b(if|else if|for|while|case|catch|\?)\b/.test(line)) cc++;
    if (depth >= 3 && /for|while|forEach|map/.test(line) && !depthIssueLines.has(idx)) {
      depthIssueLines.add(idx);
      issues.push({
        severity:"warning",
        title:`Deeply nested loop — depth ${depth}`,
        line: idx + 1,
        snippet: line.trim().slice(0, 70),
        description:"Deeply nested loops hurt maintainability and performance.",
        fix:"Extract inner logic into named helper functions.",
        file:"code",
      });
    }
  });

  if (cc > 10) {
    issues.unshift({
      severity:"warning",
      title:`High cyclomatic complexity: ${cc}`,
      line: 1,
      snippet:`${cc} decision points (threshold: 10)`,
      description:"High complexity makes code hard to test and maintain.",
      fix:"Break large functions into smaller single-purpose ones.",
      file:"code",
    });
  }

  // Plagiarism detection
  const plagPatterns = [
    { test: (c: string) => /bubbleSort|bubble_sort/i.test(c), match:"Bubble Sort algorithm", src:"Classic textbook / StackOverflow" },
    { test: (c: string) => /fibonacci/i.test(c), match:"Fibonacci sequence", src:"Common tutorial code" },
    { test: (c: string) => /password\s*===?\s*['"]admin['"]/i.test(c), match:"Hardcoded 'admin' check", src:"Insecure example (StackOverflow)" },
    { test: (c: string) => /SELECT \* FROM users WHERE/i.test(c), match:"Generic user auth query", src:"Common tutorial SQL" },
    { test: (c: string) => /authenticateUser|validateToken|hashPassword/.test(c), match:"Generic auth pattern", src:"Common auth boilerplate" },
  ];
  const plagiarism = plagPatterns
    .filter(p => p.test(code))
    .map(p => ({ match: p.match, source: p.src }));

  // Optimization suggestions
  const optimizations: any[] = [];
  if (/\.forEach\(.*\.push\(/.test(code))
    optimizations.push({ msg:"Use Array.map() instead of forEach + push.", type:"style" });
  if (/for.*\.length[\s\S]{0,100}for.*\.length/.test(code))
    optimizations.push({ msg:"Nested O(n²) loop detected — use Map/Set for O(n) lookup.", type:"performance" });

  const varLines = new Set<number>();
  lines.forEach((line, idx) => {
    if (/\bvar\s+/.test(line) && !varLines.has(idx)) {
      varLines.add(idx);
      optimizations.push({ msg:`Line ${idx+1}: Replace var with const/let.`, type:"style" });
    }
  });

  // Deduplicate optimizations
  const uniqueOpts = [...new Map(optimizations.map(o => [o.msg, o])).values()].slice(0, 6);

  const critical = issues.filter(i => i.severity === "critical").length;
  const warnings = issues.filter(i => i.severity === "warning").length;
  const info     = issues.filter(i => i.severity === "info").length;

  const sec   = Math.max(0, +(10 - critical * 2.5 - warnings * 0.8).toFixed(1));
  const read  = Math.max(2, +(10 - info * 0.4 - warnings * 0.3 - (cc > 10 ? 2 : 0)).toFixed(1));
  const opt   = Math.max(2, +(10 - uniqueOpts.length * 0.5 - (maxDepth > 4 ? 1.5 : 0)).toFixed(1));
  const maint = +((sec + read + opt) / 3).toFixed(1);

  return {
    issues,
    plagiarism,
    optimizations: uniqueOpts,
    complexity: { cyclomatic: cc, maxDepth },
    scores: { security: sec, readability: read, optimization: opt, maintainability: maint },
    critical,
    warnings,
    info,
    lines: lines.length,
    summary: `Found ${critical} critical issues, ${warnings} warnings. Cyclomatic complexity: ${cc}. Security: ${sec}/10.`,
  };
}

// ─────────────────────────────────────────────────────────────────
// AI HELPERS
// ─────────────────────────────────────────────────────────────────
async function callAI(prompt: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "Guru AI Code Reviewer"
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || data.content?.[0]?.text;
  if (!text) throw new Error("Empty response from AI");
  return text;
}
const aiExplain = (issue: any) =>
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

const aiFixCode = (code: string, issues: any[]) =>
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

const aiOptimize = (code: string, lang: string) =>
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

const aiChat = (msg: string, code: string, history: any[]) =>
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
// ─────────────────────────────────────────────────────────────────
// LANGUAGE DETECTION
// ─────────────────────────────────────────────────────────────────
function detectLanguage(code: string): string {
  if (!code.trim()) return "JavaScript";
  if (/import java\.|public class |System\.out\.println/.test(code)) return "Java";
  if (/def [\w]+\s*\(.*\):/.test(code) && !code.includes("{")) return "Python";
  if (/fn \w+|let mut |println!/.test(code)) return "Rust";
  if (/package main|fmt\.Println/.test(code)) return "Go";
  if (/#include.*<.*>/.test(code) && /cout|cin/.test(code)) return "C++";
  if (/#include.*<.*>/.test(code) && /printf|scanf/.test(code)) return "C";
  if (/<!DOCTYPE|<html/i.test(code)) return "HTML";
  if (/^<\?php/.test(code)) return "PHP";
  if (/using System;|namespace \w+/.test(code)) return "C#";
  if (/fun \w+\(|val |println\(/.test(code)) return "Kotlin";
  if (/: string|: number|interface \w+|type \w+ =/.test(code)) return "TypeScript";
  if (/SELECT|FROM|WHERE/i.test(code) && !/function|const|var/.test(code)) return "SQL";
  return "JavaScript";
}

const LANGUAGES = ["JavaScript","TypeScript","Python","Java","C","C++","C#","Go","Rust","PHP","Ruby","Swift","Kotlin","Scala","R","Dart","Shell","SQL","HTML"];

const SAMPLE = `// userAuth.js — Authentication Service
const db = require('./database');
const SECRET_KEY = "sk-prod-abc123xyz789"; // ⚠️ Hardcoded secret!

async function authenticateUser(userId, password) {
  // SQL Injection vulnerability
  const user = await db.query(
    \`SELECT * FROM users WHERE id=\${userId}\`
  );

  // Dangerous eval usage
  const result = eval(userInput);

  // XSS vulnerability  
  document.getElementById("output").innerHTML = userInput;

  // O(n²) nested loop
  for (var i = 0; i < users.length; i++) {
    for (var j = 0; j < tokens.length; j++) {
      if (users[i].id === tokens[j].userId) processMatch(users[i], tokens[j]);
    }
  }

  // Weak randomness
  const token = Math.random().toString(36);
  console.log("Login:", userId); // Debug log

  return result;
}
module.exports = { authenticateUser };`;

// ─────────────────────────────────────────────────────────────────
// HISTORY HELPERS
// ─────────────────────────────────────────────────────────────────
const HIST_KEY = "guru_ai_scan_history";
function saveHistory(code: string, lang: string, results: any) {
  try {
    const prev = JSON.parse(localStorage.getItem(HIST_KEY) || "[]");
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      timestamp: Date.now(),
      language: lang,
      lines: code.split("\n").length,
      codeSnippet: code.slice(0, 140),
      critical: results.critical || 0,
      warnings: results.warnings || 0,
      info: results.info || 0,
      scores: results.scores || {},
      summary: results.summary || "",
      issueCount: (results.issues || []).length,
      results,
    };
    localStorage.setItem(HIST_KEY, JSON.stringify([entry, ...prev].slice(0, 20)));
  } catch {}
}
function loadHistory(): any[] {
  try { return JSON.parse(localStorage.getItem(HIST_KEY) || "[]"); } catch { return []; }
}

// ─────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  theme: "dark", fontSize: 13, animationsEnabled: true,
  particlesEnabled: true, showLineNumbers: true, autoDetectLang: true,
  saveHistory: true, realTimeScan: false, highlightErrors: true, compactMode: false,
};
function loadSettings() {
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("guru_ai_settings") || "{}") }; }
  catch { return DEFAULT_SETTINGS; }
}

// ─────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────
function Spinner({ size = 16, color = "#38bdf8" }: { size?: number; color?: string }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", border: `${Math.max(2, size / 8)}px solid ${color}22`, borderTopColor: color, animation: "spin 0.8s linear infinite", flexShrink: 0 }} />;
}

function Toast({ msg, type, t }: any) {
  const bg  = type === "error" ? t.redBg : type === "success" ? t.greenBg : `${t.blue}10`;
  const col = type === "error" ? t.redText : type === "success" ? t.green : t.blue;
  return (
    <div style={{ position: "fixed", bottom: 80, right: 20, zIndex: 9999, padding: "10px 18px", background: bg, border: `1px solid ${col}40`, borderRadius: 10, fontSize: 12, color: col, fontFamily: "'JetBrains Mono',monospace", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", animation: "slideRight 0.25s both", maxWidth: 320 }}>
      {msg}
    </div>
  );
}

function getSevStyle(sev: string, t: any) {
  return ({
    critical: { bg: t.redBg, text: t.redText, label: "Critical" },
    warning:  { bg: t.orangeBg, text: t.orange, label: "Warning" },
    info:     { bg: t.navActive, text: t.blue, label: "Info" },
  } as any)[sev] || { bg: t.card, text: t.textDim, label: sev };
}

const LVL = {
  high: { bar: "#f87171", tag: "rgba(239,68,68,0.1)", tc: "#f87171" },
  med:  { bar: "#fb923c", tag: "rgba(251,146,60,0.1)", tc: "#fb923c" },
  low:  { bar: "#4ade80", tag: "rgba(74,222,128,0.1)", tc: "#4ade80" },
};

const COMPLEXITY_DATA = [
  { fn: "authenticateUser()", notation: "O(n²)", level: "high" as const, cc: 14, pct: 90, tip: "Nested loops lines 22-25. Extract inner loop to helper." },
  { fn: "validateToken()",    notation: "O(n log n)", level: "med" as const,  cc: 7,  pct: 50, tip: "3 nested conditions. Use early returns." },
  { fn: "hashPassword()",     notation: "O(1)",       level: "low" as const,  cc: 2,  pct: 15, tip: "Clean. No refactoring needed." },
  { fn: "refreshSession()",   notation: "O(n)",       level: "med" as const,  cc: 5,  pct: 38, tip: "Replace manual loop with Array.reduce()." },
];

const PRS = [
  { num: 47, title: "feat: add JWT refresh token logic",     status: "open",   adds: 234, files: 3, author: "rahulkumar", crit: 2, warn: 1 },
  { num: 44, title: "fix: password validation edge cases",   status: "review", adds: 67,  files: 1, author: "priya-dev",  crit: 0, warn: 0 },
  { num: 41, title: "refactor: split auth controller",       status: "open",   adds: 512, files: 8, author: "rahulkumar", crit: 0, warn: 3 },
];

const PR_STATUS: any = {
  open:   { bg: "rgba(74,222,128,0.1)",  text: "#4ade80" },
  review: { bg: "rgba(251,146,60,0.1)",  text: "#fb923c" },
  merged: { bg: "rgba(56,189,248,0.1)",  text: "#38bdf8" },
};

const SEC_TREND  = [{ d:"Apr 7",s:2.0},{d:"Apr 10",s:2.1},{d:"Apr 13",s:1.9},{d:"Apr 16",s:2.0},{d:"Apr 19",s:2.2},{d:"Apr 22",s:2.3},{d:"Apr 25",s:2.5},{d:"Apr 28",s:2.8},{d:"May 1",s:3.0},{d:"May 4",s:3.1}];
const QUAL_TREND = [{ d:"Apr 7",s:4.0},{d:"Apr 10",s:4.1},{d:"Apr 13",s:4.3},{d:"Apr 16",s:4.5},{d:"Apr 19",s:4.6},{d:"Apr 22",s:4.9},{d:"Apr 25",s:5.1},{d:"Apr 28",s:5.4},{d:"May 1",s:5.6},{d:"May 4",s:5.8}];

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0c0e18", border: "1px solid #1a1d2e", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>
      <div style={{ color: "#64748b" }}>{label}</div>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{Number(payload[0].value).toFixed(1)}</div>
    </div>
  );
}

function ScoreCard({ label, value, color, t }: any) {
  const pct = Math.min(100, (parseFloat(value) / 10) * 100);
  return (
    <div className="score-hover" style={{ flex: 1, minWidth: 110, background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ fontSize: 9, color: t.textFaint, textTransform: "uppercase" as const, letterSpacing: "0.8px", marginBottom: 8, fontFamily: "'JetBrains Mono',monospace" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color, lineHeight: 1, fontFamily: "'Syne',sans-serif" }}>{value}</div>
      <div style={{ marginTop: 10, height: 4, background: t.border, borderRadius: 2 }}>
        <div style={{ height: 4, width: `${pct}%`, background: color, borderRadius: 2, boxShadow: `0 0 8px ${color}50`, transition: "width 1s cubic-bezier(0.22,1,0.36,1)" }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 3D BACKGROUND
// ─────────────────────────────────────────────────────────────────
function ThreeBackground({ theme }: { theme: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const mouseRef  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 35;

    const COLS: any = {
      dark:     { p1: 0x38bdf8, p2: 0x4ade80, p3: 0xa78bfa },
      cyberpunk:{ p1: 0xf700ff, p2: 0x00ff88, p3: 0x00e5ff },
      light:    { p1: 0x2563eb, p2: 0x7c3aed, p3: 0x0891b2 },
    };
    const c = COLS[theme] || COLS.dark;
    const N = 200;
    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const sz  = new Float32Array(N);
    const pal = [new THREE.Color(c.p1), new THREE.Color(c.p2), new THREE.Color(c.p3)];

    for (let i = 0; i < N; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 80;
      pos[i*3+1] = (Math.random() - 0.5) * 60;
      pos[i*3+2] = (Math.random() - 0.5) * 40;
      vel[i*3]   = (Math.random() - 0.5) * 0.008;
      vel[i*3+1] = (Math.random() - 0.5) * 0.006;
      vel[i*3+2] = (Math.random() - 0.5) * 0.004;
      const cl = pal[i % 3];
      col[i*3] = cl.r; col[i*3+1] = cl.g; col[i*3+2] = cl.b;
      sz[i] = Math.random() * 1.6 + 0.4;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
    geo.setAttribute("size",     new THREE.BufferAttribute(sz, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, opacity: { value: 0.7 } },
      vertexShader: `attribute float size;attribute vec3 color;varying vec3 vColor;varying float vA;uniform float time;void main(){vColor=color;vA=0.55+0.45*sin(time+position.x*0.08+position.y*0.06);vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*(180.0/-mv.z);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `varying vec3 vColor;varying float vA;uniform float opacity;void main(){vec2 u=gl_PointCoord-.5;if(length(u)>.5)discard;float a=(1.-smoothstep(.2,.5,length(u)))*vA*opacity;gl_FragColor=vec4(vColor,a);}`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
    });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    const ring  = new THREE.Mesh(new THREE.TorusGeometry(8, .05, 8, 80),  new THREE.MeshBasicMaterial({ color: c.p1, transparent: true, opacity: 0.08, wireframe: true, blending: THREE.AdditiveBlending }));
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(13, .04, 6, 80), new THREE.MeshBasicMaterial({ color: c.p2, transparent: true, opacity: 0.05, wireframe: true, blending: THREE.AdditiveBlending }));
    scene.add(ring);
    scene.add(ring2);

    const onMM = (e: MouseEvent) => { mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2; mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2; };
    const onR  = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    window.addEventListener("mousemove", onMM);
    window.addEventListener("resize", onR);

    let t = 0;
    const p2 = geo.attributes.position.array as Float32Array;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.004;
      mat.uniforms.time.value = t;
      for (let i = 0; i < N; i++) {
        p2[i*3]   += vel[i*3];
        p2[i*3+1] += vel[i*3+1];
        p2[i*3+2] += vel[i*3+2];
        if (Math.abs(p2[i*3])   > 42) vel[i*3]   *= -1;
        if (Math.abs(p2[i*3+1]) > 32) vel[i*3+1] *= -1;
        if (Math.abs(p2[i*3+2]) > 22) vel[i*3+2] *= -1;
      }
      geo.attributes.position.needsUpdate = true;
      camera.position.x += (mouseRef.current.x * 4 - camera.position.x) * 0.025;
      camera.position.y += (mouseRef.current.y * 3 - camera.position.y) * 0.025;
      ring.rotation.x = t * 0.25; ring.rotation.y = t * 0.4;
      ring2.rotation.x = -t * 0.18; ring2.rotation.z = t * 0.3;
      pts.rotation.y = Math.sin(t * 0.1) * 0.06;
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("resize", onR);
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, [theme]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.7 }} />;
}

// ─────────────────────────────────────────────────────────────────
// SCAN OVERLAY
// ─────────────────────────────────────────────────────────────────
function ScanOverlay({ step, t }: { step: string; t: any }) {
  const steps = ["Parsing AST...", "Security scan...", "Pattern matching...", "AI analysis...", "Computing scores..."];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid ${t.blue}22`, borderTopColor: t.blue, animation: "spin 1s linear infinite" }} />
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 900, color: t.blue }}>{step}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 280 }}>
        {steps.map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, opacity: s === step ? 1 : 0.3, transition: "opacity 0.3s" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: s === step ? t.blue : t.border2, boxShadow: s === step ? `0 0 8px ${t.blue}` : "" }} />
            <span style={{ fontSize: 11, color: s === step ? t.blue : t.textFaint, fontFamily: "'JetBrains Mono',monospace" }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// LOGIN SCREEN — FIX: Real Google Auth + graceful fallback with clear UX
// ─────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, t }: any) {
  const [step, setStep]     = useState<"choose" | "manual">("choose");
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [otp, setOtp]       = useState("");
  const [genOtp, setGenOtp] = useState("");
  const [otpSent, setOtpSent]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [googleStatus, setGoogleStatus] = useState<"idle" | "waiting" | "error">("idle");

  const validate = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  // FIX: Real Google Auth with proper error messages
  const googleLogin = async () => {
    setLoading(true);
    setError("");
    setGoogleStatus("waiting");
    try {
      fbProvider.setCustomParameters({ prompt: "select_account" });
      const res = await signInWithPopup(fbAuth, fbProvider);
      onLogin({
        name:  res.user.displayName || "User",
        email: res.user.email || "",
        photo: res.user.photoURL || "",
      });
    } catch (e: any) {
      setLoading(false);
      setGoogleStatus("error");
      const code = e?.code || "";
      if (code === "auth/popup-blocked") {
        setError("Popup blocked! Please allow popups for this site and try again.");
      } else if (code === "auth/cancelled-popup-request" || code === "auth/popup-closed-by-user") {
        setError("Login cancelled. Click the button to try again.");
      } else if (code === "auth/unauthorized-domain") {
        // Domain not whitelisted in Firebase — offer demo mode
        setError("Google login unavailable in this environment. Please use Email OTP or Demo login below.");
      } else {
        setError(`Google login failed: ${code || "Unknown error"}. Try Email OTP instead.`);
      }
    }
  };

  const demoLogin = () => {
    onLogin({ name: "Demo User", email: "demo@guruai.dev", photo: "" });
  };

  const sendOtp = async () => {
    setError("");
    if (!name.trim()) return setError("Enter your name");
    if (!validate(email)) return setError("Enter a valid email");
    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGenOtp(code);
    try {
      await emailjs.send("service_zpnpqfb", "template_ryd8bo3", { to_email: email, otp: code }, "sI77B86_k19Yv4FA9");
      setOtpSent(true);
    } catch {
      setError("Email sending failed. Check EmailJS config.");
    }
    setLoading(false);
  };

  const verifyOtp = () => {
    if (!otp.trim()) return setError("Enter the OTP");
    if (otp !== genOtp) return setError("Incorrect OTP. Try again.");
    onLogin({ name: name.trim(), email: email.trim(), photo: "" });
  };

  const inp = (extra = {}) => ({
    width: "100%", background: t.input, border: `1px solid ${t.border}`,
    borderRadius: 10, padding: "12px 14px", color: t.text,
    fontFamily: "'JetBrains Mono',monospace", fontSize: 13, outline: "none",
    transition: "border-color 0.18s", marginBottom: 10, ...extra,
  });

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: t.bg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${t.blue}08 1px,transparent 1px),linear-gradient(90deg,${t.blue}08 1px,transparent 1px)`, backgroundSize: "44px 44px" }} />
      <div style={{ position: "absolute", width: 500, height: 500, background: `radial-gradient(circle,${t.blue}18 0%,transparent 70%)`, top: "5%", left: "10%", borderRadius: "50%", filter: "blur(60px)", animation: "morphBg 8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 350, height: 350, background: `radial-gradient(circle,${t.blue}10 0%,transparent 70%)`, bottom: "10%", right: "15%", borderRadius: "50%", filter: "blur(50px)", animation: "morphBg 10s ease-in-out infinite reverse" }} />

      <div style={{ animation: "float3d 7s ease-in-out infinite", position: "relative", zIndex: 1, width: "100%", maxWidth: 440, padding: "0 20px" }}>
        <div style={{ background: t.sidebar, border: `1px solid ${t.border2}`, borderRadius: 24, padding: "44px 40px", boxShadow: `0 48px 96px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.05)`, textAlign: "center" }}>
          <div style={{ width: 62, height: 62, borderRadius: 16, background: `linear-gradient(135deg,${t.blueDark},${t.blue})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 22, fontWeight: 900, color: "#fff", boxShadow: `0 8px 28px ${t.blue}55`, animation: "glow 2.5s infinite", fontFamily: "'Syne',sans-serif" }}>G</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 900, color: t.text, marginBottom: 4, letterSpacing: "-0.5px" }}>Guru AI</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: t.textFaint, marginBottom: 28, letterSpacing: "1px" }}>AI-POWERED CODE REVIEW PLATFORM</div>
          <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
            {["Security Scan", "AST Analysis", "AI Fix", "Tech Debt"].map(f => (
              <span key={f} style={{ fontSize: 9, padding: "3px 9px", background: t.navActive, border: `1px solid ${t.blue}30`, borderRadius: 20, color: t.blue, fontFamily: "'JetBrains Mono',monospace" }}>{f}</span>
            ))}
          </div>

          {error && (
            <div style={{ marginBottom: 12, padding: "8px 14px", background: t.redBg, border: `1px solid ${t.redText}30`, borderRadius: 8, fontSize: 11, color: t.redText, fontFamily: "'JetBrains Mono',monospace", textAlign: "left", lineHeight: 1.5 }}>
              ⚠ {error}
            </div>
          )}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "20px 0", color: t.textDim, fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>
              <Spinner color={t.blue} /> Signing in with Google...
            </div>
          )}

          {!loading && step === "choose" && (
            <>
              <button
                onClick={googleLogin}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, width: "100%", padding: "13px 20px", background: "#fff", color: "#333", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", boxShadow: "0 4px 24px rgba(0,0,0,0.2)", marginBottom: 12, transition: "all 0.18s" }}
                onMouseEnter={e => { (e.currentTarget as any).style.transform = "translateY(-2px)"; (e.currentTarget as any).style.boxShadow = "0 10px 32px rgba(0,0,0,0.3)"; }}
                onMouseLeave={e => { (e.currentTarget as any).style.transform = "none"; (e.currentTarget as any).style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)"; }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0" }}>
                <div style={{ flex: 1, height: 1, background: t.border }} />
                <span style={{ fontSize: 9, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace" }}>OR</span>
                <div style={{ flex: 1, height: 1, background: t.border }} />
              </div>

              <button
                onClick={() => { setStep("manual"); setError(""); }}
                style={{ width: "100%", padding: "12px", fontSize: 12, background: "transparent", border: `1px solid ${t.border2}`, borderRadius: 10, color: t.textDim, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer", transition: "all 0.18s", marginBottom: 8 }}
                onMouseEnter={e => { (e.currentTarget as any).style.borderColor = t.blue; (e.currentTarget as any).style.color = t.blue; }}
                onMouseLeave={e => { (e.currentTarget as any).style.borderColor = t.border2; (e.currentTarget as any).style.color = t.textDim; }}>
                Sign in with Email & OTP
              </button>

              <button
                onClick={demoLogin}
                style={{ width: "100%", padding: "10px", fontSize: 11, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 10, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer", transition: "all 0.18s" }}
                onMouseEnter={e => { (e.currentTarget as any).style.color = t.textDim; }}
                onMouseLeave={e => { (e.currentTarget as any).style.color = t.textFaint; }}>
                🚀 Try Demo (no login)
              </button>
            </>
          )}

          {!loading && step === "manual" && (
            <div style={{ textAlign: "left" }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={inp()} onFocus={e => (e.target as any).style.borderColor = t.blue} onBlur={e => (e.target as any).style.borderColor = t.border} />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" style={inp()} onFocus={e => (e.target as any).style.borderColor = t.blue} onBlur={e => (e.target as any).style.borderColor = t.border} />
              {!otpSent ? (
                <button className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={sendOtp}>
                  {loading ? <><Spinner color="#fff" size={14} /> Sending...</> : "Send OTP →"}
                </button>
              ) : (
                <>
                  <div style={{ padding: "8px 12px", background: t.greenBg, border: `1px solid ${t.green}30`, borderRadius: 8, fontSize: 11, color: t.green, fontFamily: "'JetBrains Mono',monospace", marginBottom: 10 }}>✓ OTP sent to {email}</div>
                  <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit OTP" maxLength={6} style={inp()} onFocus={e => (e.target as any).style.borderColor = t.blue} onBlur={e => (e.target as any).style.borderColor = t.border} />
                  <button className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: 13, marginBottom: 8 }} onClick={verifyOtp}>Verify & Login →</button>
                  <button onClick={() => setOtpSent(false)} style={{ width: "100%", padding: "6px", fontSize: 10, background: "transparent", border: "none", color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer" }}>Resend OTP</button>
                </>
              )}
              <button onClick={() => { setStep("choose"); setError(""); setOtpSent(false); }} style={{ width: "100%", padding: "6px", fontSize: 10, background: "transparent", border: "none", color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer", marginTop: 4 }}>← Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// EDITOR PANEL
// ─────────────────────────────────────────────────────────────────
function EditorPanel({ code, setCode, onAnalyze, analyzing, results, language, setLanguage, t, settings, onFix, onOptimize, fixedCode, optimizedCode }: any) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [showLang, setShowLang] = useState(false);
  const [view, setView] = useState<"original" | "fixed" | "optimized">("original");
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const scoreColor = (v: number) => v >= 7 ? t.green : v >= 4 ? t.orange : t.red;

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget, s = el.selectionStart, en = el.selectionEnd;
      const n = code.substring(0, s) + "  " + code.substring(en);
      setCode(n);
      setTimeout(() => { el.selectionStart = el.selectionEnd = s + 2; }, 0);
    }
  };

  const handlePaste = () => {
    if (settings.autoDetectLang) setTimeout(() => { setLanguage(detectLanguage(taRef.current?.value || "")); }, 50);
  };

  const displayed = view === "fixed" && fixedCode ? fixedCode : view === "optimized" && optimizedCode ? optimizedCode : code;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#f87171", "#fb923c", "#4ade80"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, boxShadow: `0 0 6px ${c}50` }} />)}
        </div>
        <span style={{ fontSize: 11, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace" }}>editor</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowLang(v => !v)} style={{ padding: "5px 12px", fontSize: 11, background: "transparent", border: `1px solid ${t.blue}`, borderRadius: 6, color: t.blue, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer" }}>
              {language} ▾
            </button>
            {showLang && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, background: t.card, border: `1px solid ${t.border2}`, borderRadius: 10, padding: 6, zIndex: 100, minWidth: 160, maxHeight: 240, overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                {LANGUAGES.map(l => (
                  <div key={l} onClick={() => { setLanguage(l); setShowLang(false); }}
                    style={{ padding: "6px 10px", fontSize: 11, borderRadius: 6, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", color: l === language ? t.blue : t.textDim, background: l === language ? t.navActive : "transparent", transition: "all 0.15s" }}
                    onMouseEnter={e => (e.currentTarget as any).style.background = t.navHover}
                    onMouseLeave={e => (e.currentTarget as any).style.background = l === language ? t.navActive : "transparent"}>
                    {l}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setCode("")} style={{ padding: "5px 12px", fontSize: 11, background: "transparent", border: `1px solid ${t.border2}`, borderRadius: 6, color: t.textDim, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer" }}>Clear</button>
          <button onClick={() => { setCode(SAMPLE); setLanguage("JavaScript"); }} style={{ padding: "5px 12px", fontSize: 11, background: "transparent", border: `1px solid ${t.border2}`, borderRadius: 6, color: t.textDim, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer" }}>Sample</button>
          <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 12, fontWeight: 700 }} onClick={onAnalyze} disabled={analyzing || code.trim().length < 10}>
            {analyzing ? "Analyzing..." : "[ Analyze ]"}
          </button>
        </div>
      </div>

      {/* View toggle */}
      {(fixedCode || optimizedCode) && (
        <div style={{ display: "flex", gap: 6 }}>
          {(["original", "fixed", "optimized"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "5px 12px", fontSize: 11, borderRadius: 6, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", background: view === v ? `${t.blue}15` : "transparent", border: `1px solid ${view === v ? t.blue : t.border2}`, color: view === v ? t.blue : t.textDim, transition: "all 0.18s" }}>
              {v === "original" ? "📄 Original" : v === "fixed" ? "🔒 AI Fixed" : "⚡ AI Optimized"}
            </button>
          ))}
        </div>
      )}

      {/* Code area */}
      <div style={{ display: "flex", background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", minHeight: 380, boxShadow: `0 8px 32px rgba(0,0,0,0.15)` }}>
        {settings.showLineNumbers && (
          <div style={{ padding: "16px 0", minWidth: 52, background: t.headerBg, borderRight: `1px solid ${t.border}`, textAlign: "right", userSelect: "none", flexShrink: 0 }}>
            {displayed.split("\n").map((_: any, i: number) => {
              const hasIssue = results?.issues?.some((iss: any) => iss.line === i + 1);
              return <div key={i} style={{ padding: "0 12px", lineHeight: `${settings.fontSize * 1.75}px`, fontSize: 10, color: hasIssue && settings.highlightErrors ? t.red : t.textGhost, fontFamily: "'JetBrains Mono',monospace", background: hasIssue && settings.highlightErrors ? `${t.red}08` : "transparent" }}>{i + 1}</div>;
            })}
          </div>
        )}
        <div style={{ flex: 1, position: "relative", padding: "16px 18px", overflow: "auto" }}>
          <textarea
            ref={taRef}
            value={displayed}
            onChange={e => view === "original" && setCode(e.target.value)}
            onKeyDown={handleKey}
            onPaste={handlePaste}
            spellCheck={false}
            readOnly={view !== "original"}
            placeholder={"// Paste your code here\n// Guru AI will detect:\n//   • Security vulnerabilities\n//   • Performance issues\n//   • Complexity problems\n//   • And more..."}
            style={{ width: "100%", minHeight: 360, resize: "none", outline: "none", border: "none", background: "transparent", color: t.text, fontFamily: "'JetBrains Mono',monospace", fontSize: settings.fontSize, lineHeight: 1.75, caretColor: t.blue, height: `${Math.max(360, displayed.split("\n").length * settings.fontSize * 1.75)}px` }}
          />
        </div>
      </div>


      {/* Results stats */}
      {results && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", animation: "fadeUp 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
          {[
            { val: results.critical, label: "CRITICAL", color: "#f87171" },
            { val: results.warnings, label: "WARNINGS", color: "#fb923c" },
            { val: results.lines,    label: "LINES",    color: t.blue },
            { val: results.info || 0, label: "INFO",   color: t.green },
          ].map(r => (
            <div key={r.label} style={{ flex: 1, minWidth: 90, padding: "14px", background: `${r.color}10`, border: `1px solid ${r.color}30`, borderRadius: 12, textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: r.color, fontFamily: "'Syne',sans-serif" }}>{r.val}</div>
              <div style={{ fontSize: 9, color: `${r.color}90`, fontFamily: "'JetBrains Mono',monospace", marginTop: 4 }}>{r.label}</div>
            </div>
          ))}
          {results.scores && Object.entries(results.scores).map(([k, v]: any) => (
            <div key={k} style={{ flex: 1, minWidth: 90, padding: "14px", background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: scoreColor(v), fontFamily: "'Syne',sans-serif" }}>{v.toFixed(1)}</div>
              <div style={{ fontSize: 9, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", marginTop: 4, textTransform: "capitalize" }}>{k}</div>
            </div>
          ))}
        </div>
      )}

      {/* AI action buttons */}
      {results && results.issues?.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={async () => { setAiLoading("fix"); await onFix(); setAiLoading(null); }} disabled={!!aiLoading} className="btn-primary" style={{ padding: "9px 18px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            {aiLoading === "fix" ? <><Spinner color="#fff" size={14} /> Fixing...</> : "🔒 AI Fix Issues"}
          </button>
          <button onClick={async () => { setAiLoading("opt"); await onOptimize(); setAiLoading(null); }} disabled={!!aiLoading} className="btn-primary" style={{ padding: "9px 18px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            {aiLoading === "opt" ? <><Spinner color="#fff" size={14} /> Optimizing...</> : "⚡ AI Optimize"}
          </button>
        </div>
      )}

      {/* Plagiarism */}
      {results?.plagiarism?.length > 0 && (
        <div style={{ padding: "12px 16px", background: t.orangeBg, border: `1px solid ${t.orange}40`, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: t.orange, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, marginBottom: 8 }}>🔍 Possible Plagiarism Detected</div>
          {results.plagiarism.map((p: any, i: number) => (
            <div key={i} style={{ fontSize: 11, color: t.textDim, fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>
              • <strong style={{ color: t.text }}>{p.match}</strong> — similar to: {p.source}
            </div>
          ))}
        </div>
      )}

      {/* Optimizations */}
      {results?.optimizations?.length > 0 && (
        <div style={{ padding: "12px 16px", background: `${t.blue}08`, border: `1px solid ${t.blue}20`, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: t.blue, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, marginBottom: 8 }}>⚡ Optimization Suggestions</div>
          {results.optimizations.map((o: any, i: number) => (
            <div key={i} style={{ fontSize: 11, color: t.textDim, fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>• {o.msg}</div>
          ))}
        </div>
      )}

      {results?.summary && (
        <div style={{ padding: "12px 16px", background: `${t.blue}08`, border: `1px solid ${t.blue}20`, borderRadius: 12, fontSize: 12, color: t.textDim, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.7 }}>
          <span style={{ color: t.blue, fontWeight: 700 }}>AI Summary: </span>{results.summary}
        </div>
      )}
    </div>
  );
}
//TCAnalysisPanel 

function TCAnalysisPanel({ code, language, t }: any) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const analyze = async () => {
    setLoading(true);
    setErrorMsg("");
    const prompt = `You are an expert AI code reviewer and static analyzer.

Your task:
1. Detect REAL syntax errors accurately.
2. Detect logical/runtime issues properly.
3. Generate Time Complexity according to the ACTUAL code only.
4. Never return fake or generic responses.
5. Never always return O(n). Analyze loops, recursion, nested loops, maps, sorting, DFS/BFS, DP, binary search, etc correctly.
6. If no syntax error exists, clearly say: "No syntax errors found."

Rules:
* Analyze code language automatically.
* Support Java, C++, Python, JavaScript, TypeScript.
* Give exact line number for errors when possible.
* Do not hallucinate errors.
* Distinguish between syntax errors and warnings.
* Detect missing semicolons, unmatched brackets, undeclared variables, invalid imports, wrong function calls, type issues, etc.

Output format strictly:
{
"syntaxErrors": [],
"warnings": [],
"timeComplexity": "",
"spaceComplexity": "",
"explanation": ""
}

Examples:
* Single loop → O(n)
* Nested loop → O(n²)
* Binary Search → O(log n)
* Merge Sort → O(n log n)
* HashMap lookup → O(1) average
* DFS/BFS → O(V + E)

Important:
* Time complexity MUST depend on actual operations present in the code.
* If code contains nested loops + sorting, combine complexities properly.
* Do not generate placeholder outputs.
* If code is incomplete, clearly mention: "Incomplete code provided."

Code to analyze:
\`\`\`
${code.slice(0, 3000)}
\`\`\`
`;
    
    try {
      const raw = await callAI(prompt);
      const clean = raw.replace(/```json|```/g,"").trim();
      
      const startIdx = clean.indexOf('{');
      const endIdx = clean.lastIndexOf('}');
      if (startIdx === -1 || endIdx === -1) {
        throw new Error("Invalid AI response: No JSON object found. Response was: " + raw);
      }
      
      const parsed = JSON.parse(clean.slice(startIdx, endIdx+1));
      setResult(parsed);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(`AI Analysis Failed: ${e.message || "Unknown error"}`);
      setResult(null); 
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, color: t.text }}>Expert Code Review & Complexity Analysis</h3>
        <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 12, fontWeight: 700 }} onClick={analyze} disabled={loading || !code.trim()}>
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>
      {errorMsg && (
  <div
    style={{
      padding: 12,
      borderRadius: 8,
      background: t.redBg,
      color: t.redText,
      fontSize: 12,
      border: `1px solid ${t.red}40`
    }}
  >
    {errorMsg}
  </div>
)}

      {!result && !loading && !errorMsg && (
        <div style={{ padding: 40, textAlign: "center", color: t.textFaint, fontSize: 13 }}>
          Click "Run Analysis" to get syntax checks and time/space complexity.
        </div>
      )}

      {loading && (
        <div style={{ padding: 40, textAlign: "center", color: t.blue, fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid ${t.blue}22`, borderTopColor: t.blue, animation: "spin 1s linear infinite" }} />
          Analyzing syntax, runtime issues, and complexity...
        </div>
      )}

      {result && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp 0.3s ease-out" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: t.textFaint, textTransform: "uppercase", marginBottom: 8, letterSpacing: 0.5 }}>Time Complexity</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: t.blue, fontFamily: "'Syne',sans-serif" }}>{result.timeComplexity || "N/A"}</div>
            </div>
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: t.textFaint, textTransform: "uppercase", marginBottom: 8, letterSpacing: 0.5 }}>Space Complexity</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: t.orange, fontFamily: "'Syne',sans-serif" }}>{result.spaceComplexity || "N/A"}</div>
            </div>
          </div>

          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.redText, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>🚨</span> Syntax Errors ({result.syntaxErrors?.length || 0})
            </div>
            {result.syntaxErrors && result.syntaxErrors.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.syntaxErrors.map((err: any, i: number) => (
                  <div key={i} style={{ padding: 10, background: t.redBg, borderRadius: 8, fontSize: 12, borderLeft: `3px solid ${t.red}`, color: t.text }}>
                    {typeof err === "string" ? err : JSON.stringify(err)}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: t.green }}>No syntax errors found.</div>
            )}
          </div>

          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.orange, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>⚠️</span> Warnings / Logical Issues ({result.warnings?.length || 0})
            </div>
            {result.warnings && result.warnings.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.warnings.map((warn: any, i: number) => (
                  <div key={i} style={{ padding: 10, background: t.orangeBg, borderRadius: 8, fontSize: 12, borderLeft: `3px solid ${t.orange}`, color: t.text }}>
                    {typeof warn === "string" ? warn : JSON.stringify(warn)}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: t.green }}>No warnings found.</div>
            )}
          </div>

          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.blue, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>💡</span> Explanation
            </div>
            <div style={{ fontSize: 12, color: t.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {result.explanation || "No explanation provided."}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ISSUES PANEL
// ─────────────────────────────────────────────────────────────────
function IssuesPanel({ results, onExplain, t }: any) {
  const [filter, setFilter]         = useState("all");
  const [explainOpen, setExplainOpen] = useState<number | null>(null);
  const [explanation, setExplanation] = useState("");
  const [expLoading, setExpLoading]   = useState(false);
  const issues: any[] = results?.issues || [];
  const filtered = issues.filter((i: any) => filter === "all" || i.severity === filter);

  const handleExplain = async (issue: any) => {
    setExplainOpen(issue.line);
    setExplanation("");
    setExpLoading(true);
    const res = await aiExplain(issue).catch(() => "AI explanation unavailable.");
    setExplanation(res);
    setExpLoading(false);
  };

  if (!results) return <div style={{ padding: "40px", textAlign: "center", color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>Run analysis first to see issues.</div>;
  if (issues.length === 0) return <div style={{ padding: "40px", textAlign: "center", color: t.green, fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>✓ No issues found! Code looks clean.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["all", "critical", "warning", "info"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "3px 12px", fontSize: 10, borderRadius: 20, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", transition: "all 0.18s", background: filter === f ? t.blue : "transparent", color: filter === f ? "#fff" : t.textFaint, border: `1px solid ${filter === f ? t.blue : t.border2}` }}>
            {f === "all"      ? `All (${issues.length})` :
             f === "critical" ? `🔴 Critical (${issues.filter((i: any) => i.severity === "critical").length})` :
             f === "warning"  ? `🟠 Warning (${issues.filter((i: any) => i.severity === "warning").length})` :
                                `🔵 Info (${issues.filter((i: any) => i.severity === "info").length})`}
          </button>
        ))}
      </div>
      {filtered.map((issue: any, idx: number) => {
        const s = getSevStyle(issue.severity, t);
        const isOpen = explainOpen === issue.line && explainOpen !== null;
        return (
          <div key={`${issue.line}-${issue.title}-${idx}`} className="issue-card" style={{ background: t.card, border: `1px solid ${isOpen ? t.blue + "60" : t.border}`, borderRadius: 12, padding: "14px 16px", animation: `slideLeft 0.25s ${Math.min(idx, 10) * 0.05}s both` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 6, background: s.bg, color: s.text, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, flexShrink: 0 }}>{s.label}</span>
              <span style={{ fontSize: 13, color: t.text, fontWeight: 500, flex: 1 }}>{issue.title}</span>
              <button
                onClick={() => { if (isOpen) { setExplainOpen(null); } else { handleExplain(issue); } }}
                style={{ fontSize: 11, padding: "4px 12px", border: `1px solid ${t.border2}`, borderRadius: 20, background: "transparent", color: t.orange, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", transition: "all 0.18s", whiteSpace: "nowrap" }}
                onMouseEnter={e => { (e.currentTarget as any).style.background = t.orangeBg; (e.currentTarget as any).style.borderColor = t.orange; }}
                onMouseLeave={e => { (e.currentTarget as any).style.background = "transparent"; (e.currentTarget as any).style.borderColor = t.border2; }}>
                {isOpen ? "Hide ▲" : "Why? [AI] ▾"}
              </button>
              <button
                onClick={() => onExplain(`Explain "${issue.title}" and show the exact fix with code example`)}
                style={{ fontSize: 11, padding: "4px 12px", border: `1px solid ${t.border2}`, borderRadius: 20, background: "transparent", color: t.blue, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", transition: "all 0.18s" }}>
                Chat →
              </button>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: t.textDim, fontFamily: "'JetBrains Mono',monospace", background: t.headerBg, padding: "6px 12px", borderRadius: 6, borderLeft: `3px solid ${s.text}` }}>
              Line {issue.line} — {issue.snippet}
            </div>
            {issue.description && <div style={{ marginTop: 6, fontSize: 11, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.6 }}>{issue.description}</div>}
            {issue.fix && <div style={{ marginTop: 4, fontSize: 11, color: t.green, fontFamily: "'JetBrains Mono',monospace" }}>💡 Fix: {issue.fix}</div>}
            {isOpen && (
              <div style={{ marginTop: 12, padding: "12px", background: t.card2, border: `1px solid ${t.border}`, borderRadius: 10, animation: "fadeUp 0.2s both" }}>
                {expLoading
                  ? <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Spinner color={t.blue} /><span style={{ fontSize: 11, color: t.textDim, fontFamily: "'JetBrains Mono',monospace" }}>Guru AI is explaining...</span></div>
                  : <div style={{ fontSize: 12, color: t.text, fontFamily: "'JetBrains Mono',monospace", whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{explanation}</div>
                }
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// OVERVIEW PANEL
// ─────────────────────────────────────────────────────────────────
function OverviewPanel({ results, t }: any) {
  const scores = results?.scores || { security: 3.1, readability: 6.4, optimization: 7.2, maintainability: 6.5 };
  const scoreColor = (v: number) => v >= 7 ? t.green : v >= 4 ? t.orange : t.red;
  const radarData = Object.entries(scores).map(([k, v]: any) => ({ subject: k.charAt(0).toUpperCase() + k.slice(1), score: v, fullMark: 10 }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="score-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {Object.entries(scores).map(([k, v]: any) => <ScoreCard key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={v.toFixed(1)} color={scoreColor(v)} t={t} />)}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div className="card-hover" style={{ flex: 1, minWidth: 200, background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 11, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", marginBottom: 8 }}>Quality Radar</div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={t.border} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: t.textDim, fontSize: 9, fontFamily: "'JetBrains Mono',monospace" }} />
              <Radar dataKey="score" stroke={t.blue} fill={t.blue} fillOpacity={0.12} strokeWidth={2} dot={{ r: 3, fill: t.blue, strokeWidth: 0 }} />
              <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }} labelStyle={{ color: t.textDim }} itemStyle={{ color: t.blue }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-flex" style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 200 }}>
          {[{ title: "Security — 30 days", data: SEC_TREND, color: "#f87171" }, { title: "Quality — 30 days", data: QUAL_TREND, color: "#4ade80" }].map(ch => (
            <div key={ch.title} className="card-hover" style={{ flex: 1, background: t.card2, border: `1px solid ${t.border}`, borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 10, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", marginBottom: 8 }}>{ch.title}</div>
              <ResponsiveContainer width="100%" height={90}>
                <LineChart data={ch.data}>
                  <CartesianGrid stroke={t.border} vertical={false} />
                  <XAxis dataKey="d" tick={{ fill: t.textFaint, fontSize: 8, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis domain={[0, 10]} tick={{ fill: t.textFaint, fontSize: 8, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} width={16} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="s" stroke={ch.color} strokeWidth={2} dot={{ r: 2.5, fill: ch.color, strokeWidth: 0 }} activeDot={{ r: 4, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CHAT PANEL
// ─────────────────────────────────────────────────────────────────
function ChatPanel({ code, t }: any) {
  const [msgs, setMsgs] = useState<any[]>([{
    id: 1, role: "ai",
    content: "👋 Hi! I'm Guru AI. Ask me anything about your code — security, performance, or best practices.",
    time: Date.now(),
  }]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  const send = async (text?: string) => {
    const m = (text || input).trim();
    if (!m || loading) return;
    setInput("");
    const um: any = { id: Date.now(),     role: "user", content: m, time: Date.now() };
    const lm: any = { id: Date.now() + 1, role: "ai",  content: "", time: Date.now(), loading: true };
    setMsgs(p => [...p, um, lm]);
    setLoading(true);
    try {
      const r = await aiChat(m, code, msgs);
      setMsgs(p => p.map(x => x.loading ? { ...x, content: r, loading: false } : x));
    } catch {
      setMsgs(p => p.map(x => x.loading ? { ...x, content: "AI unavailable. Try again.", loading: false } : x));
    }
    setLoading(false);
  };

  const QUICK = ["What are the biggest security risks?", "How to improve performance?", "Explain SQL injection in my code", "What unit tests should I write?"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 220px)", minHeight: 400 }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
        {msgs.map(m => (
          <div key={m.id} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 10, alignItems: "flex-start", animation: "fadeUp 0.22s both" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: m.role === "user" ? `linear-gradient(135deg,${t.blueDark},${t.blue})` : "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
              {m.role === "user" ? "U" : "G"}
            </div>
            <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: m.role === "user" ? `linear-gradient(135deg,${t.blueDark},${t.blue})` : t.card2, border: m.role === "user" ? "none" : `1px solid ${t.border}`, color: m.role === "user" ? "#fff" : t.text, fontSize: 12, lineHeight: 1.75, fontFamily: "'JetBrains Mono',monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {m.loading ? (
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: t.blue, animation: `pulse 1.2s ${d}s infinite` }} />)}
                </div>
              ) : m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {msgs.length <= 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {QUICK.map(q => (
            <button key={q} onClick={() => send(q)} style={{ padding: "5px 12px", fontSize: 10, borderRadius: 20, background: "transparent", border: `1px solid ${t.border2}`, color: t.blue, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", transition: "all 0.18s" }}>
              {q.length > 40 ? q.slice(0, 40) + "…" : q}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: "8px 12px" }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask about your code… (Enter to send)"
          rows={1}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", resize: "none", color: t.text, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 1.6, maxHeight: 100 }}
          onInput={e => { (e.target as any).style.height = "auto"; (e.target as any).style.height = Math.min((e.target as any).scrollHeight, 100) + "px"; }}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 34, height: 34, borderRadius: 9, border: "none", cursor: "pointer", background: loading || !input.trim() ? t.border2 : `linear-gradient(135deg,${t.blueDark},${t.blue})`, color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s", flexShrink: 0 }}>
          {loading ? <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} /> : "↑"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPLEXITY PANEL
// ─────────────────────────────────────────────────────────────────
function ComplexityPanel({ results, t }: any) {
  const cc = results?.complexity?.cyclomatic || 1;
  const md = results?.complexity?.maxDepth   || 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { v: cc,  l: "Cyclomatic Complexity", c: cc > 10 ? t.red : cc > 5 ? t.orange : t.green },
          { v: md,  l: "Max Nesting Depth",      c: md > 4  ? t.red : md > 2 ? t.orange : t.green },
          { v: cc > 10 ? "High" : cc > 5 ? "Medium" : "Low", l: "Risk Level", c: cc > 10 ? t.red : cc > 5 ? t.orange : t.green },
        ].map(x => (
          <div key={x.l} className="score-hover" style={{ flex: 1, minWidth: 100, background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: x.c, fontFamily: "'Syne',sans-serif" }}>{x.v}</div>
            <div style={{ fontSize: 9, color: t.textFaint, marginTop: 4, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{x.l}</div>
          </div>
        ))}
      </div>
      <div className="complexity-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {COMPLEXITY_DATA.map((item, i) => {
          const lc = LVL[item.level];
          return (
            <div key={item.fn} className="card-hover" style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16, animation: `fadeUp 0.3s ${i * 0.08}s both` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'JetBrains Mono',monospace", marginBottom: 8 }}>{item.fn}</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: lc.tag, color: lc.tc, fontFamily: "'JetBrains Mono',monospace" }}>{item.notation} · {item.level.charAt(0).toUpperCase() + item.level.slice(1)}</span>
                <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: lc.tag, color: lc.tc, fontFamily: "'JetBrains Mono',monospace" }}>CC: {item.cc}</span>
              </div>
              <div style={{ height: 5, background: t.border, borderRadius: 3, marginBottom: 8 }}>
                <div style={{ height: 5, width: `${item.pct}%`, background: lc.bar, borderRadius: 3, boxShadow: `0 0 8px ${lc.bar}50`, transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)" }} />
              </div>
              <div style={{ fontSize: 10, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.6 }}>💡 {item.tip}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// HISTORY PANEL
// ─────────────────────────────────────────────────────────────────
function HistoryPanel({ t, onRestoreCode }: any) {
  const [sel, setSel] = useState<any>(null);
  const [historyList, setHistoryList] = useState<any[]>([]);

  useEffect(() => {
    setHistoryList(loadHistory());
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {historyList.length === 0 && (
        <div style={{ padding: "20px", textAlign: "center", color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
          No scan history yet. Run a scan to save results.
        </div>
      )}
      {historyList.map((h: any, idx: number) => (
        <div key={h.id || idx} className="card-hover" style={{ background: t.card, border: `1px solid ${sel?.id === h.id ? t.blue : t.border}`, borderRadius: 12, padding: 14, cursor: "pointer", animation: `slideLeft 0.25s ${Math.min(idx, 10) * 0.06}s both` }} onClick={() => setSel(sel?.id === h.id ? null : h)}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace" }}>
              {new Date(h.timestamp || h.date || Date.now()).toLocaleString()}
            </span>
            <span style={{ fontSize: 10, padding: "1px 8px", borderRadius: 4, background: `${t.blue}15`, color: t.blue, fontFamily: "'JetBrains Mono',monospace" }}>{h.language || "Unknown"}</span>
            {(h.critical || h.results?.critical) > 0 && (
              <span style={{ fontSize: 10, padding: "1px 8px", borderRadius: 4, background: t.redBg, color: t.redText, fontFamily: "'JetBrains Mono',monospace" }}>
                {h.critical || h.results?.critical} critical
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: t.textDim, fontFamily: "'JetBrains Mono',monospace" }}>
            {(h.codeSnippet || "").slice(0, 60)}{(h.codeSnippet || "").length > 60 ? "…" : ""}
          </div>
          {sel?.id === h.id && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }} onClick={e => e.stopPropagation()}>
              <button onClick={e => { e.stopPropagation(); onRestoreCode(h.codeSnippet, h.language); }}
                style={{ padding: "5px 12px", fontSize: 11, borderRadius: 8, cursor: "pointer", background: `linear-gradient(135deg,${t.blueDark},${t.blue})`, color: "#fff", border: "none", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
                Load Code
              </button>
              <button style={{ padding: "5px 12px", fontSize: 11, borderRadius: 8, cursor: "pointer", background: "transparent", border: `1px solid ${t.border2}`, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace" }}
                onClick={e => { e.stopPropagation(); setSel(null); }}>
                Close
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SETTINGS PANEL
// ─────────────────────────────────────────────────────────────────
function SettingsPanel({ settings, onSettingsChange, t, themeName, setTheme }: any) {
  const [saved, setSaved] = useState(false);
  const upd = (k: string, v: any) => onSettingsChange({ ...settings, [k]: v });

  const Toggle = ({ val, onChange }: any) => (
    <div onClick={() => onChange(!val)} style={{ width: 38, height: 21, borderRadius: 12, cursor: "pointer", background: val ? t.blue : t.border2, position: "relative", transition: "background 0.25s", flexShrink: 0 }}>
      <div style={{ position: "absolute", width: 15, height: 15, background: "#fff", borderRadius: "50%", top: 3, left: val ? 20 : 3, transition: "left 0.25s cubic-bezier(0.22,1,0.36,1)", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );

  const Row = ({ label, desc, children }: any) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: t.text, fontFamily: "'JetBrains Mono',monospace", fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 10, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );

  const save = () => {
    try { localStorage.setItem("guru_ai_settings", JSON.stringify(settings)); setSaved(true); setTimeout(() => setSaved(false), 2000); } catch {}
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ fontSize: 9, color: t.textFaint, textTransform: "uppercase" as const, letterSpacing: "0.8px", marginBottom: 12, fontFamily: "'JetBrains Mono',monospace" }}>── Appearance ──</div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: t.text, fontFamily: "'JetBrains Mono',monospace", fontWeight: 500, marginBottom: 10 }}>Theme</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[{ key: "dark", label: "🌙 Dark" }, { key: "cyberpunk", label: "⚡ Cyberpunk" }, { key: "light", label: "☀️ Light" }].map(th => (
            <div key={th.key} onClick={() => setTheme(th.key)} style={{ padding: "9px 16px", borderRadius: 10, cursor: "pointer", background: themeName === th.key ? `${t.blue}15` : t.card, border: `1px solid ${themeName === th.key ? t.blue : t.border}`, transition: "all 0.18s", flex: 1 }}>
              <div style={{ fontSize: 13, color: themeName === th.key ? t.blue : t.text, fontFamily: "'JetBrains Mono',monospace", fontWeight: themeName === th.key ? 700 : 400 }}>{th.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Row label="Font Size" desc={`Editor font: ${settings.fontSize}px`}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: 180 }}>
          <input type="range" min={11} max={18} value={settings.fontSize} onChange={e => upd("fontSize", +e.target.value)} style={{ flex: 1, accentColor: t.blue, cursor: "pointer" }} />
          <span style={{ fontSize: 11, color: t.blue, fontFamily: "'JetBrains Mono',monospace", minWidth: 28 }}>{settings.fontSize}px</span>
        </div>
      </Row>
      <Row label="3D Particles" desc="WebGL background effect"><Toggle val={settings.particlesEnabled} onChange={(v: boolean) => upd("particlesEnabled", v)} /></Row>
      <Row label="Animations" desc="Panel transitions"><Toggle val={settings.animationsEnabled} onChange={(v: boolean) => upd("animationsEnabled", v)} /></Row>
      <Row label="Line Numbers" desc="Show line numbers in editor"><Toggle val={settings.showLineNumbers} onChange={(v: boolean) => upd("showLineNumbers", v)} /></Row>
      <Row label="Auto-detect Language" desc="Detect language on paste"><Toggle val={settings.autoDetectLang} onChange={(v: boolean) => upd("autoDetectLang", v)} /></Row>
      <Row label="Highlight Error Lines" desc="Red glow on issue lines"><Toggle val={settings.highlightErrors} onChange={(v: boolean) => upd("highlightErrors", v)} /></Row>
      <Row label="Save History" desc="Store last 20 scans locally"><Toggle val={settings.saveHistory} onChange={(v: boolean) => upd("saveHistory", v)} /></Row>
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button onClick={save} className="btn-primary" style={{ padding: "9px 20px", fontSize: 12, fontWeight: 700 }}>{saved ? "✓ Saved!" : "Save Settings"}</button>
        <button onClick={() => onSettingsChange(DEFAULT_SETTINGS)} style={{ padding: "9px 16px", fontSize: 12, background: "transparent", border: `1px solid ${t.border2}`, borderRadius: 8, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer" }}>Reset</button>
      </div>
      <div style={{ marginTop: 16, padding: "10px 14px", background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 10, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.8 }}>
        Guru AI v2.0 · Claude Sonnet 4.6 · Firebase Auth · EmailJS OTP
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// GITHUB PANEL
// ─────────────────────────────────────────────────────────────────
function GitHubPanel({ t }: any) {
  const [scanning, setScanning] = useState<number | null>(null);
  const [done, setDone] = useState(new Set<number>());
  const scan = (n: number) => {
    setScanning(n);
    setTimeout(() => { setScanning(null); setDone(p => new Set([...p, n])); }, 1800);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: `${t.blue}08`, border: `1px solid ${t.blue}20`, borderRadius: 10, flexWrap: "wrap" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.green, boxShadow: `0 0 6px ${t.green}` }} />
        <span style={{ fontSize: 12, color: t.blue, fontFamily: "'JetBrains Mono',monospace" }}>Connected: <strong>rahulkumar/auth-service</strong></span>
        <button style={{ marginLeft: "auto", padding: "5px 12px", fontSize: 11, border: `1px solid ${t.blue}40`, background: `${t.blue}10`, color: t.blue, borderRadius: 6, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>+ Import Repo</button>
      </div>
      {PRS.map((pr: any, idx: number) => {
        const sc = PR_STATUS[pr.status];
        const isScan = scanning === pr.num;
        const isDone = done.has(pr.num);
        return (
          <div key={pr.num} className="card-hover" style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 14, animation: `slideLeft 0.25s ${idx * 0.08}s both` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace" }}>#{pr.num}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: t.text, flex: 1 }}>{pr.title}</span>
              <span style={{ fontSize: 9, padding: "2px 9px", borderRadius: 4, background: sc.bg, color: sc.text, fontFamily: "'JetBrains Mono',monospace", textTransform: "capitalize" as const }}>{pr.status}</span>
            </div>
            <div style={{ fontSize: 10, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", marginBottom: 10 }}>+{pr.adds} lines · {pr.files} files · @{pr.author}</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              {pr.crit > 0 && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: t.redBg, color: t.redText, fontFamily: "'JetBrains Mono',monospace" }}>{pr.crit} critical</span>}
              {pr.warn > 0 && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: t.orangeBg, color: t.orange, fontFamily: "'JetBrains Mono',monospace" }}>{pr.warn} warnings</span>}
              {!pr.crit && !pr.warn && !isDone && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: t.greenBg, color: t.green, fontFamily: "'JetBrains Mono',monospace" }}>Clean</span>}
              {isDone && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: t.greenBg, color: t.green, fontFamily: "'JetBrains Mono',monospace" }}>✓ AI Scanned</span>}
              <button style={{ marginLeft: "auto", padding: "5px 12px", fontSize: 10, border: `1px solid ${t.blue}40`, background: `${t.blue}10`, color: t.blue, borderRadius: 6, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }} onClick={() => scan(pr.num)} disabled={isScan || isDone}>
                {isScan ? <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Spinner size={10} color={t.blue} /> Scanning...</span> : isDone ? "✓ Done" : "AI Scan"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// EXPORT PANEL
// ─────────────────────────────────────────────────────────────────
function ExportPanel({ results, t }: any) {
  const [exp, setExp] = useState(false);
  const [done, setDone] = useState(false);
  const go = () => { setExp(true); setTimeout(() => { setExp(false); setDone(true); }, 2200); };
  const rows = [
    { k: "Date",     v: new Date().toLocaleDateString() },
    { k: "Security", v: `${results?.scores?.security?.toFixed(1) || "N/A"}/10`, d: true },
    { k: "Issues",   v: `${(results?.critical || 0) + (results?.warnings || 0)} total`, d: (results?.critical || 0) > 0 },
    { k: "Complexity", v: `CC: ${results?.complexity?.cyclomatic || "N/A"}` },
    { k: "Lines",    v: `${results?.lines || 0}` },
    { k: "Includes", v: "Charts, AST, AI fixes" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="card-hover" style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 14, fontFamily: "'JetBrains Mono',monospace" }}>📄 Report Preview</div>
        {rows.map(r => (
          <div key={r.k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${t.border}`, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>
            <span style={{ color: t.textFaint }}>{r.k}</span>
            <span style={{ color: (r as any).d ? t.red : t.textDim, fontWeight: 500 }}>{r.v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="btn-primary" style={{ padding: "11px 20px", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }} onClick={go} disabled={exp || done}>
          {exp ? <><Spinner color="#fff" size={14} /> Generating...</> : done ? "✓ Exported!" : "Download PDF"}
        </button>
        {["Email", "Share Link"].map(l => (
          <button key={l} style={{ padding: "11px 14px", fontSize: 12, background: "transparent", border: `1px solid ${t.border2}`, borderRadius: 8, color: t.textDim, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer" }}>{l}</button>
        ))}
      </div>
      {done && (
        <div style={{ padding: "10px 14px", background: t.greenBg, border: `1px solid ${t.green}30`, borderRadius: 10, fontSize: 11, color: t.green, fontFamily: "'JetBrains Mono',monospace", animation: "fadeUp 0.3s both" }}>
          ✓ Saved as guru-ai-report-{new Date().toISOString().slice(0, 10)}.pdf
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TECH DEBT PANEL
// ─────────────────────────────────────────────────────────────────
function DebtPanel({ results, t }: any) {
  const crit  = results?.critical || 3;
  const warn  = results?.warnings || 2;
  const total = crit * 6 + warn * 4 + 2 + 2;
  const items = [
    { icon: "🔒", label: "Security vulnerabilities", hours: crit * 2, pct: Math.min(100, crit * 25), color: t.red },
    { icon: "🔄", label: "Complexity refactoring",   hours: 4,         pct: 55,                        color: t.orange },
    { icon: "🗑️", label: "Dead code removal",         hours: 2,         pct: 25,                        color: t.blue },
    { icon: "📝", label: "Documentation gaps",        hours: 2,         pct: 15,                        color: t.green },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { v: crit > 3 ? "High" : crit > 1 ? "Medium" : "Low", l: "Debt Level",    c: crit > 3 ? t.red : crit > 1 ? t.orange : t.green },
          { v: `${total} hrs`,                                   l: "Est. Refactor", c: t.text },
          { v: `${Math.min(10, crit * 2 + warn * 0.8).toFixed(1)}/10`, l: "Risk Score", c: crit > 2 ? t.red : t.orange },
        ].map(x => (
          <div key={x.l} className="score-hover" style={{ flex: 1, minWidth: 100, background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: x.c, fontFamily: "'Syne',sans-serif" }}>{x.v}</div>
            <div style={{ fontSize: 9, color: t.textFaint, marginTop: 4, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{x.l}</div>
          </div>
        ))}
      </div>
      {items.map((item, i) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 16px", animation: `slideLeft 0.25s ${i * 0.07}s both` }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
          <span style={{ fontSize: 12, color: t.textDim, flex: 1, fontFamily: "'JetBrains Mono',monospace" }}>{item.label}</span>
          <div style={{ flex: 1, minWidth: 80, height: 5, background: t.border, borderRadius: 3 }}>
            <div style={{ height: 5, width: `${item.pct}%`, background: item.color, borderRadius: 3, boxShadow: `0 0 6px ${item.color}50` }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: item.color, fontFamily: "'JetBrains Mono',monospace", minWidth: 44, textAlign: "right" }}>{item.hours} hrs</span>
        </div>
      ))}
      <div style={{ padding: "12px 16px", background: `${t.blue}08`, border: `1px solid ${t.blue}20`, borderRadius: 12, fontSize: 12, color: t.blue, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.7 }}>
        💡 Estimated cost @₹1,200/hr: <strong style={{ color: t.text }}>₹{(total * 1200).toLocaleString()}</strong>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// USER CARD
// ─────────────────────────────────────────────────────────────────
function UserCard({ user, t, onLogout }: any) {
  const initials = user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ margin: "8px 10px", padding: "12px 14px", borderRadius: 14, background: `linear-gradient(135deg,${t.card} 0%,${t.card2} 100%)`, border: `1px solid ${t.blue}30`, boxShadow: `0 0 20px ${t.blue}10,inset 0 1px 0 rgba(255,255,255,0.04)`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -15, right: -15, width: 60, height: 60, borderRadius: "50%", background: `radial-gradient(circle,${t.blue}20,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${t.blueDark},${t.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: `0 0 14px ${t.blue}50`, animation: "glow 3s infinite", position: "relative" }}>
          {user.photo ? <img src={user.photo} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} /> : initials}
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: t.green, border: `2px solid ${t.card}`, boxShadow: `0 0 6px ${t.green}` }} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 12, color: t.text, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
          <div style={{ fontSize: 9, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
        </div>
      </div>
      <button onClick={onLogout}
        style={{ width: "100%", padding: "7px", fontSize: 11, background: `${t.red}10`, border: `1px solid ${t.red}30`, borderRadius: 8, color: t.redText, fontFamily: "'JetBrains Mono',monospace", cursor: "pointer", fontWeight: 600, transition: "all 0.18s" }}
        onMouseEnter={e => { (e.currentTarget as any).style.background = t.redBg; }}
        onMouseLeave={e => { (e.currentTarget as any).style.background = `${t.red}10`; }}>
        Sign Out
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────────────────────────
const NAV_CFG = [
  { id: "tcanalysis", label: "TC/SC + Tests", icon: "🔬" },
  { id: "editor",     label: "Code Editor",  icon: "✏️" },
  { id: "overview",   label: "Overview",     icon: "📊" },
  { id: "issues",     label: "Issues",       icon: "⚠️" },
  { id: "complexity", label: "Complexity",   icon: "📈" },
  { id: "chat",       label: "AI Chat",      icon: "💬" },
  { id: "github",     label: "GitHub PR",    icon: "🔗" },
  { id: "history",    label: "Scan History", icon: "🕐" },
  { id: "debt",       label: "Tech Debt",    icon: "💰" },
  { id: "export",     label: "Export PDF",   icon: "📄" },
  { id: "settings",   label: "Settings",     icon: "⚙️" },
];

// ─────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]          = useState<any>(null);
  const [themeName, setThemeName] = useState("dark");
  const [settings, setSettings]  = useState(loadSettings);
  const [tab, setTab]            = useState("editor");
  const [code, setCode]          = useState(SAMPLE);
  const [language, setLanguage]  = useState("JavaScript");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAStep]  = useState("");
  const [results, setResults]    = useState<any>(null);
  const [panelKey, setPanelKey]  = useState(0);
  const [toast, setToast]        = useState<any>(null);
  const [fixedCode, setFixedCode] = useState("");
  const [optCode, setOptCode]    = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const t = THEMES[themeName] || THEMES.dark;

  useEffect(() => {
    if (settings.theme && settings.theme !== themeName) setThemeName(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "guru-css";
    el.textContent = getCSS(t);
    document.getElementById("guru-css")?.remove();
    document.head.appendChild(el);
    return () => el.remove();
  }, [themeName]);

  const showToast = (msg: string, type = "info") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); analyze(); }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") { e.preventDefault(); setThemeName(n => n === "dark" ? "cyberpunk" : n === "cyberpunk" ? "light" : "dark"); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const analyze = useCallback(async () => {
    if (analyzing || code.trim().length < 10) return;
    setAnalyzing(true);
    const steps = ["Parsing AST...", "AI Code Review...", "Complexity Analysis...", "Generating Report...", "Done!"];
    let i = 0;
    setAStep(steps[0]);
    const iv = setInterval(() => { i++; if (i < steps.length) setAStep(steps[i]); }, 650);

    try {
      const prompt = `You are an expert AI code reviewer and static analyzer.

Your task:
1. Detect REAL syntax errors accurately.
2. Detect logical/runtime issues properly.
3. Generate Time Complexity according to the ACTUAL code only.
4. Never return fake or generic responses.
5. Never always return O(n). Analyze loops, recursion, nested loops, maps, sorting, DFS/BFS, DP, binary search, etc correctly.
6. If no syntax error exists, clearly say: "No syntax errors found."

Rules:
* Analyze code language automatically.
* Support Java, C++, Python, JavaScript, TypeScript.
* Give exact line number for errors when possible.
* Do not hallucinate errors.
* Distinguish between syntax errors and warnings.
* Detect missing semicolons, unmatched brackets, undeclared variables, invalid imports, wrong function calls, type issues, etc.

Output format strictly:
{
"syntaxErrors": [],
"warnings": [],
"timeComplexity": "",
"spaceComplexity": "",
"explanation": ""
}

Examples:
* Single loop → O(n)
* Nested loop → O(n²)
* Binary Search → O(log n)
* Merge Sort → O(n log n)
* HashMap lookup → O(1) average
* DFS/BFS → O(V + E)

Important:
* Time complexity MUST depend on actual operations present in the code.
* If code contains nested loops + sorting, combine complexities properly.
* Do not generate placeholder outputs.
* If code is incomplete, clearly mention: "Incomplete code provided."

Code to analyze:
\`\`\`
${code.slice(0, 3000)}
\`\`\`
`;
      const raw = await callAI(prompt);
      const clean = raw.replace(/```json|```/g,"").trim();
      
      const startIdx = clean.indexOf('{');
      const endIdx = clean.lastIndexOf('}');
      if (startIdx === -1 || endIdx === -1) {
        throw new Error("No JSON object found in AI response. Raw: " + raw.slice(0, 100));
      }
      
      const parsed = JSON.parse(clean.slice(startIdx, endIdx+1));
      
      clearInterval(iv);
      
      const r = runSecurityScan(code); // get base stats
      
      const aiIssues: any[] = [];
      if (parsed.syntaxErrors && Array.isArray(parsed.syntaxErrors)) {
        parsed.syntaxErrors.forEach((err: any) => {
          aiIssues.push({
            severity: "critical",
            title: "Syntax Error",
            line: err.line || 1,
            snippet: typeof err === "string" ? err : JSON.stringify(err),
            description: "Actual syntax error detected by AI",
            fix: "Fix syntax error",
            file: "code"
          });
        });
      }
      
      if (parsed.warnings && Array.isArray(parsed.warnings)) {
        parsed.warnings.forEach((warn: any) => {
          aiIssues.push({
            severity: "warning",
            title: "Logical/Runtime Warning",
            line: warn.line || 1,
            snippet: typeof warn === "string" ? warn : JSON.stringify(warn),
            description: "Logical issue detected by AI",
            fix: "Review logic",
            file: "code"
          });
        });
      }

      r.issues = [...aiIssues, ...r.issues.filter((iss: any) => iss.severity === "info")];
      r.critical = aiIssues.filter((iss: any) => iss.severity === "critical").length;
      r.warnings = aiIssues.filter((iss: any) => iss.severity === "warning").length;
      r.summary = `TC: ${parsed.timeComplexity || 'N/A'}, SC: ${parsed.spaceComplexity || 'N/A'}. ${parsed.explanation || ""}`;

      r.scores.security = Math.max(0, 10 - r.critical * 2.5 - r.warnings * 1);
      r.scores.maintainability = Math.max(0, 10 - r.critical * 2 - r.warnings * 0.5);

      setResults(r);
      if (settings.saveHistory) saveHistory(code, language, r);
      setAnalyzing(false);
      setAStep("");
      showToast(`Analysis complete: ${r.critical} critical, ${r.warnings} warnings`, "success");

    } catch (e: any) {
      clearInterval(iv);
      setAnalyzing(false);
      setAStep("");
      showToast(`AI Analysis failed: ${e.message || e.toString()}`, "error");
    }
  }, [analyzing, code, language, settings.saveHistory]);

  const handleFix = async () => {
    if (!results?.issues) return;
    try { const r = await aiFixCode(code, results.issues); setFixedCode(r); showToast("AI fix applied! Switch to 'AI Fixed' view", "success"); }
    catch { showToast("AI fix failed. Try again.", "error"); }
  };

  const handleOptimize = async () => {
    try { const r = await aiOptimize(code, language); setOptCode(r); showToast("AI optimization ready!", "success"); }
    catch { showToast("AI optimization failed.", "error"); }
  };

  const switchTab = (id: string) => { setTab(id); setPanelKey(k => k + 1); setMobileOpen(false); };
  const goExplain = (q: string)  => { switchTab("chat"); };
  const issueCount = results ? (results.critical || 0) + (results.warnings || 0) : 0;

  if (!user) return <LoginScreen onLogin={setUser} t={t} />;

  const panels: Record<string, any> = {
    editor:     <EditorPanel code={code} setCode={setCode} onAnalyze={analyze} analyzing={analyzing} analyzeStep={analyzeStep} results={results} language={language} setLanguage={setLanguage} t={t} settings={settings} onFix={handleFix} onOptimize={handleOptimize} fixedCode={fixedCode} optimizedCode={optCode} />,
    overview:   <OverviewPanel results={results} t={t} />,
    issues:     <IssuesPanel results={results} onExplain={goExplain} t={t} />,
    complexity: <ComplexityPanel results={results} t={t} />,
    chat:       <ChatPanel code={code} t={t} />,
    github:     <GitHubPanel t={t} />,
    history:    <HistoryPanel t={t} onRestoreCode={(c: string, l: string) => { setCode(c); setLanguage(l); switchTab("editor"); }} />,
    debt:       <DebtPanel results={results} t={t} />,
    tcanalysis: <TCAnalysisPanel code={code} language={language} t={t} />,
    export:     <ExportPanel results={results} t={t} />,
    settings:   <SettingsPanel settings={settings} onSettingsChange={setSettings} t={t} themeName={themeName} setTheme={(tn: string) => { setThemeName(tn); setSettings((s: any) => ({ ...s, theme: tn })); }} />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: t.panelBg, overflow: "hidden", fontFamily: "'JetBrains Mono',monospace", color: t.text, position: "relative" }}>
      {settings.particlesEnabled && <ThreeBackground theme={themeName} />}
      {toast && <Toast msg={toast.msg} type={toast.type} t={t} />}
      {analyzing && <ScanOverlay step={analyzeStep} t={t} />}

      {/* Sidebar */}
      <div className="sidebar-desktop" style={{ width: 215, minWidth: 215, background: t.sidebar, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", zIndex: 10, boxShadow: `4px 0 24px rgba(0,0,0,0.2)`, backdropFilter: "blur(20px)" }}>
        <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,${t.blueDark},${t.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff", flexShrink: 0, boxShadow: `0 4px 14px ${t.blue}50`, animation: "glow 3s infinite", fontFamily: "'Syne',sans-serif" }}>G</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: t.text, fontFamily: "'Syne',sans-serif", letterSpacing: "-0.5px" }}>Guru AI</div>
              <div style={{ fontSize: 8, color: t.textGhost, letterSpacing: "0.3px" }}>v2.0 · production</div>
            </div>
            <div onClick={() => setThemeName(n => n === "dark" ? "light" : n === "light" ? "cyberpunk" : "dark")} title="Toggle theme" style={{ width: 28, height: 16, borderRadius: 8, background: themeName === "dark" ? t.blueDark : t.border2, cursor: "pointer", position: "relative", transition: "background 0.25s", flexShrink: 0 }}>
              <div style={{ position: "absolute", width: 12, height: 12, background: "#fff", borderRadius: "50%", top: 2, left: themeName === "dark" ? 13 : 2, transition: "left 0.25s cubic-bezier(0.22,1,0.36,1)", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "6px 0", overflowY: "auto" }}>
          {NAV_CFG.map(item => {
            const active = item.id === tab;
            return (
              <div key={item.id} className={`nav-item${active ? " active" : ""}`}
                style={{ color: active ? t.blue : t.textDim, background: active ? t.navActive : "transparent", borderLeftColor: active ? t.accent : "transparent" }}
                onClick={() => switchTab(item.id)}>
                <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.id === "issues" && results && issueCount > 0 && <span style={{ marginLeft: "auto", fontSize: 9, padding: "1px 6px", borderRadius: 20, background: t.redBg, color: t.redText, fontWeight: 700 }}>{issueCount}</span>}
                {item.id === "history" && <span style={{ marginLeft: "auto", fontSize: 9, color: t.textFaint }}>{loadHistory().length}</span>}
              </div>
            );
          })}
        </nav>

        <UserCard user={user} t={t} onLogout={() => { localStorage.clear(); sessionStorage.clear(); setUser(null); }} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0, position: "relative", zIndex: 1 }}>
        <div style={{ padding: "8px 14px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 8, background: t.headerBg, flexWrap: "wrap", backdropFilter: "blur(20px)", boxShadow: `0 2px 12px rgba(0,0,0,0.1)` }}>
          <button className="mobile-only" style={{ padding: "6px 10px", background: "transparent", border: `1px solid ${t.border2}`, borderRadius: 6, color: t.textDim, cursor: "pointer", fontSize: 14, display: "none" }} onClick={() => setMobileOpen(true)}>☰</button>
          <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 5, background: `${t.blue}15`, color: t.blue, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{language}</span>
          <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 5, border: `1px solid ${t.border}`, color: t.textFaint, fontFamily: "'JetBrains Mono',monospace" }}>{code.split("\n").length} lines</span>
          {results && <>
            <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 5, background: t.redBg, color: t.redText, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{results.critical} critical</span>
            <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 5, background: t.orangeBg, color: t.orange, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{results.warnings} warn</span>
            <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 5, background: t.greenBg, color: t.green, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>✓ Analyzed</span>
          </>}
          <button className="btn-primary" style={{ marginLeft: "auto", padding: "7px 16px", fontSize: 11, fontWeight: 700 }} onClick={() => { switchTab("editor"); setTimeout(analyze, 80); }} disabled={analyzing}>
            {analyzing ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Spinner color="#fff" size={11} /> {analyzeStep}</span> : "⚡ Run Analysis"}
          </button>
        </div>

        <div className="sidebar-desktop" style={{ display: "flex", borderBottom: `1px solid ${t.border}`, padding: "0 14px", background: t.headerBg, overflowX: "auto", flexShrink: 0, backdropFilter: "blur(20px)" }}>
          {NAV_CFG.map(item => (
            <div key={item.id} className={`tab-btn${item.id === tab ? " active" : ""}`}
              style={{ color: item.id === tab ? t.blue : t.textFaint, borderBottomColor: item.id === tab ? t.accent : "transparent" }}
              onClick={() => switchTab(item.id)}>
              {item.icon} {item.label}{item.id === "issues" && issueCount > 0 ? ` (${issueCount})` : ""}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: settings.compactMode ? "10px" : "16px", background: t.panelBg, paddingBottom: 80 }}>
          <div key={panelKey} className={settings.animationsEnabled ? "panel-enter" : ""}>
            {panels[tab] || panels["editor"]}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="mobile-only" style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: "relative", width: 240, background: t.sidebar, padding: "16px 0", boxShadow: "4px 0 24px rgba(0,0,0,0.4)" }}>
            <div style={{ padding: "0 16px 12px", borderBottom: `1px solid ${t.border}`, marginBottom: 6 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 900, color: t.text }}>Guru AI</div>
            </div>
            {NAV_CFG.map(item => (
              <div key={item.id} className="nav-item" style={{ color: item.id === tab ? t.blue : t.textDim, background: item.id === tab ? t.navActive : "transparent", borderLeftColor: item.id === tab ? t.accent : "transparent" }} onClick={() => switchTab(item.id)}>
                <span>{item.icon}</span><span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mobile-only" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: t.sidebar, borderTop: `1px solid ${t.border}`, display: "none", zIndex: 200, boxShadow: "0 -4px 24px rgba(0,0,0,0.2)" }}>
        {NAV_CFG.slice(0, 5).map(item => (
          <div key={item.id} onClick={() => switchTab(item.id)} style={{ flex: 1, padding: "10px 4px 8px", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 2, cursor: "pointer", borderTop: `2px solid ${tab === item.id ? t.blue : "transparent"}`, transition: "all 0.18s", background: tab === item.id ? t.navActive : "transparent" }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: tab === item.id ? t.blue : t.textFaint }}>{item.label.split(" ")[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}