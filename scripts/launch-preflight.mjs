import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const checks = [];

function add(status, label, detail) {
  checks.push({ detail, label, status });
}

function readText(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return existsSync(path.join(root, relativePath));
}

function walkFiles(relativeDir, files = []) {
  const absoluteDir = path.join(root, relativeDir);
  if (!existsSync(absoluteDir)) return files;

  for (const entry of readdirSync(absoluteDir)) {
    const relativePath = path.join(relativeDir, entry);
    const absolutePath = path.join(root, relativePath);
    const stat = statSync(absolutePath);

    if (stat.isDirectory()) {
      walkFiles(relativePath, files);
    } else {
      files.push(relativePath);
    }
  }

  return files;
}

function includesAll(relativePath, requiredValues) {
  if (!exists(relativePath)) {
    add("BLOCKER", `${relativePath} exists`, "File is missing.");
    return;
  }

  const text = readText(relativePath);
  const missing = requiredValues.filter((value) => !text.includes(value));
  if (missing.length) {
    add("BLOCKER", `${relativePath} release exclusions`, `Missing: ${missing.join(", ")}`);
    return;
  }

  add("PASS", `${relativePath} release exclusions`, "Required entries are present.");
}

const packageJson = JSON.parse(readText("package.json"));
const packageLock = JSON.parse(readText("package-lock.json"));

if (packageJson.engines?.node === ">=24 <25" && packageLock.packages?.[""]?.engines?.node === ">=24 <25") {
  add("PASS", "Node engine pin", "package.json and package-lock.json require >=24 <25.");
} else {
  add("BLOCKER", "Node engine pin", "Expected package.json and package-lock.json to require >=24 <25.");
}

const dependencyVersions = [
  ...Object.entries(packageJson.dependencies ?? {}),
  ...Object.entries(packageJson.devDependencies ?? {})
];
const floatingDependencies = dependencyVersions.filter(([, version]) => version === "latest" || version.startsWith("^") || version.startsWith("~"));

if (floatingDependencies.length) {
  add("BLOCKER", "Dependency version pins", `Floating versions found: ${floatingDependencies.map(([name]) => name).join(", ")}`);
} else {
  add("PASS", "Dependency version pins", "Runtime and dev dependencies are exact versions.");
}

includesAll(".gitignore", [".env.local*", ".vercel", "node_modules", ".next"]);
includesAll(".vercelignore", [".env", ".env.*", ".env.local*", ".vercel", "node_modules", ".next"]);

if (exists(".env.example")) {
  const envExample = readText(".env.example").trim();
  if (envExample === "MARTA_API_KEY=your_marta_api_key_here") {
    add("PASS", "Environment example", ".env.example contains only the expected placeholder key.");
  } else {
    add("BLOCKER", "Environment example", ".env.example should contain only the placeholder MARTA_API_KEY example.");
  }
} else {
  add("BLOCKER", "Environment example", ".env.example is missing.");
}

if (exists(".vercel/project.json")) {
  const vercelProject = JSON.parse(readText(".vercel/project.json"));
  if (vercelProject.projectId && vercelProject.orgId) {
    add("PASS", "Vercel project link", `Project is linked${vercelProject.projectName ? ` as ${vercelProject.projectName}` : ""}.`);
  } else {
    add("BLOCKER", "Vercel project link", ".vercel/project.json is missing projectId or orgId.");
  }
} else {
  add("BLOCKER", "Vercel project link", ".vercel/project.json is missing.");
}

if (exists("docs/launch-readiness.md")) {
  add("PASS", "Launch readiness document", "docs/launch-readiness.md exists.");
} else {
  add("BLOCKER", "Launch readiness document", "docs/launch-readiness.md is missing.");
}

if (exists("docs/production-deploy-runbook.md")) {
  add("PASS", "Production deploy runbook", "docs/production-deploy-runbook.md exists.");
} else {
  add("BLOCKER", "Production deploy runbook", "docs/production-deploy-runbook.md is missing.");
}

if (exists(".env.local")) {
  add("PASS", "Local live rail key file", ".env.local exists. Key value was not read or printed.");
} else {
  add("WARN", "Local live rail key file", ".env.local is missing; local live rail checks will fall back to sample data.");
}

if (exists(".env.localopen")) {
  add("BLOCKER", "Accidental secret copy cleanup", ".env.localopen still exists. Delete it before external handoff or Production.");
} else {
  add("PASS", "Accidental secret copy cleanup", ".env.localopen is absent.");
}

const imageFiles = walkFiles("public").filter((file) => /\.(png|jpe?g|webp|gif|svg)$/i.test(file));
if (imageFiles.length) {
  add("WARN", "Public image assets", `Review public assets before launch: ${imageFiles.join(", ")}`);
} else {
  add("PASS", "Public image assets", "No public image assets found.");
}

const scanFiles = [
  ...walkFiles("src").filter((file) => /\.(ts|tsx|css)$/i.test(file)),
  "README.md",
  "docs/launch-readiness.md",
  "docs/production-deploy-runbook.md"
].filter((file) => exists(file));

const forbiddenStrings = [
  "Fast answer here",
  "Final word there",
  "Lorem",
  "Official MARTA World Cup",
  "World Cup essentials",
  "MartaMapImageOverlay"
];

const hits = [];
for (const file of scanFiles) {
  const text = readText(file);
  for (const needle of forbiddenStrings) {
    if (text.includes(needle)) {
      hits.push(`${file}: ${needle}`);
    }
  }
}

if (hits.length) {
  add("BLOCKER", "Forbidden launch strings", hits.join("; "));
} else {
  add("PASS", "Forbidden launch strings", "No blocked placeholder/branding strings found.");
}

const publicKeyHits = [];
for (const file of scanFiles) {
  const text = readText(file);
  if (text.includes("process.env.NEXT_PUBLIC_MARTA_API_KEY") || text.includes("NEXT_PUBLIC_MARTA_API_KEY=")) {
    publicKeyHits.push(file);
  }
}

if (publicKeyHits.length) {
  add("BLOCKER", "Public MARTA key exposure", `Potential client-exposed key usage found in: ${publicKeyHits.join(", ")}`);
} else {
  add("PASS", "Public MARTA key exposure", "No NEXT_PUBLIC MARTA key usage pattern found.");
}

const statusRank = { PASS: 0, WARN: 1, BLOCKER: 2 };
const worstStatus = checks.reduce((worst, check) => (statusRank[check.status] > statusRank[worst] ? check.status : worst), "PASS");

for (const check of checks) {
  console.log(`${check.status.padEnd(7)} ${check.label}`);
  console.log(`        ${check.detail}`);
}

console.log("");
console.log(`Launch preflight result: ${worstStatus}`);

if (worstStatus === "BLOCKER") {
  process.exit(1);
}
