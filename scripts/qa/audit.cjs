/* Audit de toutes les routes (sitemap + pages hors index), en bureau et en mobile :
   statut HTTP, erreurs console, requêtes en échec, images cassées, débordement
   horizontal, nombre de h1 et doublons photographiques visibles sur une même page.

   node scripts/qa/audit.cjs http://localhost:3000 */
const { launch, BASE } = require("./browser.cjs");

(async () => {
  const b = await launch();
  const probe = await b.newPage();
  const sm = await (await probe.request.get(BASE + "/sitemap.xml")).text();
  await probe.close();
  const routes = [...new Set([...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname))].concat([
    "/panier",
    "/commande",
    "/favoris",
    "/mentions-legales",
    "/cgv",
    "/confidentialite",
    "/page-inexistante",
  ]);
  let problems = 0;
  for (const vp of [{ n: "bureau", w: 1440, h: 900 }, { n: "mobile", w: 390, h: 844 }]) {
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.w < 800, hasTouch: vp.w < 800 });
    const p = await ctx.newPage();
    let errs = [];
    const failed = [];
    p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 200)));
    p.on("pageerror", (e) => errs.push("PAGEERROR " + String(e).slice(0, 200)));
    // les préchargements annulés par la navigation suivante (ERR_ABORTED) ne sont pas des erreurs
    p.on("requestfailed", (r) => !/ERR_ABORTED/.test(r.failure()?.errorText ?? "") && !r.url().includes("__nextjs") && failed.push(r.url()));
    for (const r of routes) {
      errs = [];
      failed.length = 0;
      const resp = await p.goto(BASE + r, { waitUntil: "networkidle" });
      await p.waitForTimeout(400);
      const H = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += vp.h * 0.8) {
        await p.evaluate((v) => window.scrollTo(0, v), y);
        await p.waitForTimeout(90);
      }
      await p.waitForTimeout(700);
      const res = await p.evaluate(() => {
        const imgs = Array.from(document.images);
        const visible = imgs.filter((i) => {
          const r = i.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) return false;
          // les vignettes d'une galerie reprennent volontairement la vue principale
          if (i.closest('[role="group"][aria-label^="Vues de"]') || i.closest('[role="dialog"]') || i.closest("[data-interactif]")) return false;
          for (let e = i; e; e = e.parentElement) {
            const cs = getComputedStyle(e);
            if (cs.opacity === "0" || cs.visibility === "hidden" || cs.display === "none") return false;
          }
          return true;
        });
        const key = (i) => {
          const u = new URL(i.currentSrc || i.src, location.href);
          return decodeURIComponent(u.searchParams.get("url") || u.pathname).replace(/\.w\d+\.webp$/, ".webp");
        };
        const counts = {};
        visible.forEach((i) => {
          const k = key(i);
          if (!k.startsWith("/brand/")) counts[k] = (counts[k] || 0) + 1;
        });
        return {
          sw: document.documentElement.scrollWidth,
          h1: document.querySelectorAll("h1").length,
          broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
          dups: Object.entries(counts).filter(([, n]) => n > 1),
          photos: Object.keys(counts).length,
        };
      });
      const notFound = r === "/page-inexistante";
      const issues = [];
      if (!resp || (resp.status() >= 400 && !notFound)) issues.push("statut " + (resp && resp.status()));
      if (res.sw > vp.w + 1) issues.push("débordement horizontal " + res.sw + "px");
      if (res.h1 !== 1) issues.push("h1 = " + res.h1);
      if (res.broken.length) issues.push("images cassées " + res.broken.join(" "));
      if (res.dups.length) issues.push("doublons " + JSON.stringify(res.dups));
      const realErrs = errs.filter((e) => !(notFound && e.includes("404")));
      if (realErrs.length) issues.push("console " + JSON.stringify(realErrs));
      if (failed.length) issues.push("requêtes " + JSON.stringify(failed.slice(0, 4)));
      if (issues.length) problems++;
      console.log(`${vp.n.padEnd(7)} ${r.padEnd(48)} ${String(res.photos).padStart(2)} photos  ${issues.length ? "⚠ " + issues.join(" | ") : "ok"}`);
    }
    await ctx.close();
  }
  console.log(`\n${routes.length} routes × 2 formats — pages avec problème : ${problems}`);
  await b.close();
  process.exit(problems ? 1 : 0);
})();
