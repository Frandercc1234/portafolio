// Lighthouse (móvil y escritorio) sobre el build local: levanta el servidor, mide y lo apaga.
// Uso: npm run build && node design/maqueta-v2/lighthouse.mjs [corridas] [rutas...]
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PORT = 3300;
const RUNS = Number(process.argv[2] ?? 3);
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', `${PORT}`], {
  env: { ...process.env, CONTACT_DRY_RUN: '1' },
  stdio: 'ignore',
});

try {
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(`http://localhost:${PORT}/en`)).ok) break;
    } catch {}
    if (i > 60) throw new Error('el servidor no arrancó');
    await new Promise((r) => setTimeout(r, 1000));
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lh-'));
  const URLS = process.argv.slice(3).length ? process.argv.slice(3) : ['/en', '/es', '/en/projects/payments-service'];
  for (const url of URLS) {
    for (const preset of ['mobile', 'desktop']) {
      const scores = [];
      for (let run = 0; run < RUNS; run++) {
        const out = path.join(dir, `${scores.length}-${preset}.json`);
        fs.rmSync(out, { force: true });
        const flags = preset === 'desktop' ? '--preset=desktop' : '';
        // En Windows, Lighthouse puede fallar al borrar su perfil temporal: vale el informe escrito.
        spawnSync(
          `npx -y lighthouse http://localhost:${PORT}${url} ${flags} --quiet --chrome-flags=--headless=new --output=json --output-path="${out}"`,
          { shell: true, stdio: 'ignore' },
        );
        const report = JSON.parse(fs.readFileSync(out, 'utf8'));
        scores.push(report);
      }
      // Mediana por rendimiento.
      scores.sort((a, b) => a.categories.performance.score - b.categories.performance.score);
      const mid = scores[Math.floor(scores.length / 2)];
      const c = mid.categories;
      const pct = (k) => Math.round(c[k].score * 100);
      console.log(
        url.padEnd(32), preset.padEnd(8),
        `rend ${pct('performance')} (corridas: ${scores.map((s) => Math.round(s.categories.performance.score * 100)).join('/')})`,
        `a11y ${pct('accessibility')} bp ${pct('best-practices')} seo ${pct('seo')}`,
        `LCP ${mid.audits['largest-contentful-paint'].displayValue} TBT ${mid.audits['total-blocking-time'].displayValue} CLS ${mid.audits['cumulative-layout-shift'].displayValue}`,
      );
      const failed = ['seo', 'best-practices', 'performance'].flatMap((k) =>
        c[k].auditRefs
          .filter((r) => r.weight > 0 && (mid.audits[r.id].score ?? 1) < 0.9)
          .map((r) => `${r.id}=${mid.audits[r.id].displayValue ?? mid.audits[r.id].score}`),
      );
      if (failed.length) console.log('    por debajo de 0.9:', failed.join(', '));
    }
  }
} finally {
  server.kill();
}
