import http from "node:http";
import https from "node:https";

const rawBaseUrl = process.argv[2] ?? process.env.PREVIEW_URL;

if (!rawBaseUrl) {
  console.error("Usage: npm run launch:check-preview -- https://your-preview-url.vercel.app");
  console.error("Or set PREVIEW_URL=https://your-preview-url.vercel.app");
  process.exit(2);
}

const baseUrl = rawBaseUrl.replace(/\/+$/, "");
const checks = [];

function add(status, label, detail) {
  checks.push({ detail, label, status });
}

function requestText(url) {
  const client = url.startsWith("https:") ? https : http;

  return new Promise((resolve, reject) => {
    const request = client.request(url, { headers: { "user-agent": "peach8-launch-check/1.0" }, method: "GET", timeout: 15_000 }, (response) => {
      let body = "";

      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        resolve({
          body,
          statusCode: response.statusCode ?? 0,
          url
        });
      });
    });

    request.on("timeout", () => {
      request.destroy(new Error(`Timeout requesting ${url}`));
    });
    request.on("error", reject);
    request.end();
  });
}

function pageUrl(path) {
  return `${baseUrl}${path}`;
}

const pageChecks = [
  {
    label: "Home",
    path: "/",
    requiredText: "Peach8 ATL"
  },
  {
    label: "Doraville plan",
    path: "/plan?stationId=doraville",
    requiredText: "Doraville"
  },
  {
    label: "North Springs plan",
    path: "/plan?stationId=north-springs",
    requiredText: "North Springs"
  },
  {
    label: "Tips",
    path: "/tips",
    requiredText: "Tips"
  },
  {
    label: "Sources",
    path: "/sources",
    requiredText: "Sources"
  },
  {
    label: "Privacy",
    path: "/privacy",
    requiredText: "No accounts. No saved trip plans."
  }
];

const forbiddenText = ["Fast answer here", "Final word there", "Lorem", "Official MARTA World Cup", "World Cup essentials"];

for (const check of pageChecks) {
  try {
    const response = await requestText(pageUrl(check.path));
    if (response.statusCode !== 200) {
      add("BLOCKER", check.label, `${check.path} returned HTTP ${response.statusCode}.`);
      continue;
    }

    if (!response.body.includes(check.requiredText)) {
      add("BLOCKER", check.label, `${check.path} did not include expected text: ${check.requiredText}`);
      continue;
    }

    const forbiddenHit = forbiddenText.find((text) => response.body.includes(text));
    if (forbiddenHit) {
      add("BLOCKER", check.label, `${check.path} includes blocked text: ${forbiddenHit}`);
      continue;
    }

    add("PASS", check.label, `${check.path} returned 200 and expected text was present.`);
  } catch (error) {
    add("BLOCKER", check.label, error instanceof Error ? error.message : String(error));
  }
}

try {
  const response = await requestText(pageUrl("/api/rail-arrivals?station=Doraville"));
  if (response.statusCode !== 200) {
    add("BLOCKER", "Rail arrivals API", `Returned HTTP ${response.statusCode}.`);
  } else {
    const data = JSON.parse(response.body);
    const arrivalCount = Array.isArray(data.arrivals) ? data.arrivals.length : 0;

    if (data.isMock === false && arrivalCount > 0) {
      add("PASS", "Rail arrivals API", "Doraville returned live rail rows.");
    } else {
      add("BLOCKER", "Rail arrivals API", "Doraville did not return live hosted rail rows. Check Vercel MARTA_API_KEY.");
    }
  }
} catch (error) {
  add("BLOCKER", "Rail arrivals API", error instanceof Error ? error.message : String(error));
}

const statusRank = { PASS: 0, WARN: 1, BLOCKER: 2 };
const worstStatus = checks.reduce((worst, check) => (statusRank[check.status] > statusRank[worst] ? check.status : worst), "PASS");

for (const check of checks) {
  console.log(`${check.status.padEnd(7)} ${check.label}`);
  console.log(`        ${check.detail}`);
}

console.log("");
console.log(`Preview check result: ${worstStatus}`);

if (worstStatus === "BLOCKER") {
  process.exit(1);
}
