// Bouwt: index.html (ontwikkeling, laadt src/), dist/bacs-screening.html (één zelfstandig bestand)
// en dist/artifact.html (zelfde inhoud zonder documentskelet, voor publicatie als Claude-artifact).
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const rd = (f) => fs.readFileSync(path.join(root, f), 'utf8');

const TITLE = 'BACS-screening Vlaanderen';
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap">';
const BODY = `<header class="topbar"><div class="wrap">
<div class="brand"><b>BACS-screening</b><span class="badge-kw">&gt; 290 kW</span><span>Vlaanderen · niet-residentieel</span></div>
<nav class="nav" aria-label="Hoofdmenu"><button data-act="nav" data-view="lijst">Dossiers</button><button data-act="nav" data-view="beheer">Beheer</button><button data-act="nav" data-view="bronnen">Regels en bronnen</button></nav>
</div></header>
<main id="main"></main>
<div id="toast" class="toast" role="status" aria-live="polite" hidden></div>`;
const SCRIPTS = ['src/config.js', 'src/engine.js', 'src/sample-data.js', 'src/app.js'];

// 1. ontwikkelversie
fs.writeFileSync(path.join(root, 'index.html'), `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${TITLE}</title>
${FONTS}
<link rel="stylesheet" href="src/styles.css">
</head>
<body>
${BODY}
${SCRIPTS.map((s) => `<script src="${s}"></script>`).join('\n')}
</body>
</html>
`);

// 2. zelfstandige versie
const css = rd('src/styles.css');
const js = SCRIPTS.map((s) => `/* ---- ${s} ---- */\n` + rd(s).replace(/<\/script/gi, '<\\/script')).join('\n');
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/bacs-screening.html'), `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${TITLE}</title>
${FONTS}
<style>${css}</style>
</head>
<body>
${BODY}
<script>${js}</script>
</body>
</html>
`);

// 3. artifactversie (zonder doctype/html/head/body)
fs.writeFileSync(path.join(root, 'dist/artifact.html'), `<title>${TITLE}</title>
<meta name="claude:viewport-fit-sides" content="cover">
${FONTS}
<style>${css}</style>
${BODY}
<script>${js}</script>
`);
console.log('Gebouwd: index.html, dist/bacs-screening.html, dist/artifact.html');
