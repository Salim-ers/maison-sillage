/* Lancement de Chromium pour les scripts de vérification.
   Ordre de recherche : CHROME_PATH, puis le Chromium le plus récent installé par
   Playwright (ms-playwright), puis le navigateur par défaut de playwright-core. */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { chromium } = require("playwright-core");

function findChromium() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const roots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "ms-playwright"),
    path.join(os.homedir(), ".cache", "ms-playwright"),
    path.join(os.homedir(), "Library", "Caches", "ms-playwright"),
  ].filter(Boolean);
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const dirs = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => +b.split("-")[1] - +a.split("-")[1]);
    for (const d of dirs) {
      for (const rel of ["chrome-win64/chrome.exe", "chrome-win/chrome.exe", "chrome-linux/chrome", "chrome-linux64/chrome", "chrome-mac/Chromium.app/Contents/MacOS/Chromium"]) {
        const p = path.join(root, d, rel);
        if (fs.existsSync(p)) return p;
      }
    }
  }
  return undefined;
}

exports.launch = () => chromium.launch({ executablePath: findChromium() });
exports.BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
