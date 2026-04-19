#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY;
const SITE_URL = "https://piyushahuja.com";
const STATE_FILE = ".github/newsletter-state.json";
const COURSES_DIR = "_courses";

function getCourseFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getCourseFiles(fullPath));
    } else if (entry.name.endsWith(".md") && entry.name !== "index.md") {
      results.push(fullPath);
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) fm[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
  });
  return fm;
}

function setNewsletterFlag(filePath, value) {
  const content = fs.readFileSync(filePath, "utf8");
  const updated = content.replace(/^newsletter:\s*(true|false)/m, `newsletter: ${value}`);
  fs.writeFileSync(filePath, updated);
}

function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  }
  return { sent: [] };
}

function saveState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function fileToUrl(filePath) {
  // _courses/neural-networks/1943-1969.md -> https://piyushahuja.com/courses/neural-networks/1943-1969
  return SITE_URL + "/" + filePath.replace(/^_/, "").replace(/\.md$/, "");
}

async function createDraft(title, subtitle, url) {
  const body = `
<h1>${title}</h1>
${subtitle ? `<p><em>${subtitle}</em></p>` : ""}
<p>A new post has been published on the Neural Networks course.</p>
<p><a href="${url}">Read it here →</a></p>
<hr>
<p style="font-size:0.85em;color:#888;">You're receiving this because you subscribed to Piyush's courses newsletter.</p>
`.trim();

  const response = await fetch("https://api.buttondown.email/v1/emails", {
    method: "POST",
    headers: {
      Authorization: `Token ${BUTTONDOWN_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subject: title, body, status: "draft" }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Buttondown API error ${response.status}: ${text}`);
  }

  return await response.json();
}

async function main() {
  if (!BUTTONDOWN_API_KEY) {
    console.error("BUTTONDOWN_API_KEY is not set");
    process.exit(1);
  }

  const files = getCourseFiles(COURSES_DIR);
  const state = loadState();
  const toCommit = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const fm = parseFrontmatter(content);

    if (fm.newsletter !== "true") continue;
    if (state.sent.includes(file)) {
      console.log(`Already sent for ${file}, skipping.`);
      continue;
    }

    const title = fm.title || path.basename(file, ".md");
    const subtitle = fm.subtitle || "";
    const url = fileToUrl(file);

    console.log(`Creating draft for: ${title}`);
    const draft = await createDraft(title, subtitle, url);
    console.log(`Draft created: ${draft.id} — review at https://buttondown.com/emails/drafts`);

    state.sent.push(file);
    setNewsletterFlag(file, "false");
    toCommit.push(file);
  }

  if (toCommit.length === 0) {
    console.log("No files with newsletter: true found.");
    return;
  }

  saveState(state);

  // Commit the flipped flags + state
  execSync("git config user.name 'GitHub Actions'");
  execSync("git config user.email 'actions@github.com'");
  execSync(`git add ${STATE_FILE} ${toCommit.join(" ")}`);
  execSync(`git commit -m "newsletter drafts created, reset newsletter flags [skip ci]"`);
  execSync("git push");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
