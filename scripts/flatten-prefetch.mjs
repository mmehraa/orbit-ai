// Runs after `npm run build`. Next 16's static export writes segment-prefetch payloads as nested folders
// (out/x/__next.x/__PAGE__.txt) while the router requests dotted names (out/x/__next.x.__PAGE__.txt).
// Writing dotted copies avoids harmless-but-noisy 404s on static hosts.
import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('out');
let copied = 0;

function flatten(segDir, parent) {
  const walk = (dir, parts) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, [...parts, e.name]);
      else {
        const target = path.join(parent, [path.basename(segDir), ...parts, e.name].join('.'));
        if (!fs.existsSync(target)) { fs.copyFileSync(full, target); copied++; }
      }
    }
  };
  walk(segDir, []);
}

function scan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name === '_next') continue;
    const full = path.join(dir, e.name);
    if (e.name.startsWith('__next.')) flatten(full, dir);
    else scan(full);
  }
}

if (fs.existsSync(out)) { scan(out); console.log(`flatten-prefetch: wrote ${copied} prefetch file aliases`); }
