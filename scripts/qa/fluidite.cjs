/* Fluidité du défilement : la page est parcourue de haut en bas comme à la molette, processeur
   ralenti (×4, proche d'un téléphone milieu de gamme), cache vide. On mesure les images
   (intervalles entre deux images d'animation) et les tâches longues du fil principal.

   node scripts/qa/fluidite.cjs http://localhost:3000 [/route ...] */
const { launch, BASE } = require("./browser.cjs");

(async () => {
  const routes = process.argv.slice(3).length ? process.argv.slice(3) : ["/", "/boutique", "/produits/poire-rotie-sable-noisette", "/recettes"];
  const b = await launch();
  for (const vp of [{ n: "bureau", w: 1440, h: 900, cpu: 4 }, { n: "mobile", w: 390, h: 844, cpu: 4 }]) {
    for (const r of routes) {
      const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.w < 800, hasTouch: vp.w < 800, deviceScaleFactor: vp.w < 800 ? 3 : 1 });
      await ctx.addInitScript(() => sessionStorage.setItem("maison-sillage:ouverture", "1"));
      const p = await ctx.newPage();
      const cdp = await ctx.newCDPSession(p);
      await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
      await p.goto(BASE + r, { waitUntil: "load" });
      await p.waitForTimeout(1200);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: vp.cpu });
      const res = await p.evaluate(async () => {
        const frames = [];
        let long = 0;
        const po = new PerformanceObserver((l) => l.getEntries().forEach((e) => (long += e.duration)));
        po.observe({ type: "longtask" });
        let last = performance.now();
        let running = true;
        const tick = (t) => {
          frames.push(t - last);
          last = t;
          if (running) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        const H = document.documentElement.scrollHeight - innerHeight;
        // défilement continu : 1 200 px/s environ, par petits pas comme une molette
        for (let y = 0; y < H; y += 40) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 33));
        }
        await new Promise((r) => setTimeout(r, 600));
        running = false;
        po.disconnect();
        frames.sort((a, b) => a - b);
        const jank = frames.filter((f) => f > 50).length;
        return { frames: frames.length, jank, p95: Math.round(frames[Math.floor(frames.length * 0.95)]), max: Math.round(frames[frames.length - 1]), long: Math.round(long) };
      });
      console.log(`${vp.n.padEnd(7)} ${r.padEnd(40)} images ${String(res.frames).padStart(4)} · saccades (>50 ms) ${String(res.jank).padStart(3)} · p95 ${res.p95} ms · max ${res.max} ms · tâches longues ${res.long} ms`);
      await ctx.close();
    }
  }
  await b.close();
})();
