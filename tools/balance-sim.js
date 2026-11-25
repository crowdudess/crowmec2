#!/usr/bin/env node
// Nestguard balance simulator: a bot plays real runs of index.html headless and reports win rates.
//
//   node tools/balance-sim.js [options]
//
//   --world void        world id (forest, marsh, snow, city, dunes, jungle, spider, volcano, fairy, sakura, void, office)
//   --diff 0            0 normal, 1 hard, 2 expert, 3 nightmare
//   --skin classic      crow skin (its passive applies), e.g. shard
//   --up full           Roost upgrades: full, none, a fraction like 0.9 (every upgrade at 90% of its max, rounded down),
//                       and/or overrides like beak=20,twin=1. Combine: --up full,beak=20
//   --spells razor,meteor,fury,hole,shadow   loadout (slots 3-5 open on waves 10/20/30)
//   --runs 16 --workers 4 --seed 1000
//   --hp 58 --dmg 5     try other world multipliers without editing the game
//   --heal 0.4          patch the nest instead of taking an item below this HP fraction
//   --items sharp,twin  start the run holding these items (repeat an id to stack it)
//   --noshop 1          take nothing from the shop or golden eggs (to judge items on their own)
//   --nogift 1          skip the Magpie's Favour starting pick
//   --scan items        test every item alone against no item (add --rar 5 for one rarity); implies --noshop 1 --nogift 1
//   --scan up           test what ~coins (default 1000) spent on each Roost upgrade, on top of --up, is worth
//   --compare "a;b;c"   run several setups side by side, each written as options, e.g.
//                       --compare "--up full;--up 0.9;--up full --diff 3 --skin shard"
//
// Needs Playwright with Chromium: npm i -g playwright && npx playwright install chromium
const path = require('path');
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { console.error('Playwright is missing: npm i -g playwright && npx playwright install chromium'); process.exit(1); }
const GAME = path.join(__dirname, '..', 'index.html');

const ROOST_BASE = { beak: 12, wings: 12, nest: 9, egg: 40, voice: 40, eye: 10, luck: 10, focus: 12, pen: 14, slayer: 14, thorns: 10, regen: 12, rhythm: 60, haggle: 16, pierce: 70, twin: 500, magpie: 80, favour: 300, charm: 150 };
const roostCost = (k, l) => { const b = ROOST_BASE[k]; return Math.round(l < 10 ? b * Math.pow(1.3, l) : b * Math.pow(1.3, 9) * (1 + .35 * (l - 9))); };
const ROOST_MAX = { beak: 25, wings: 20, nest: 20, egg: 5, voice: 8, eye: 8, luck: 8, focus: 15, pen: 10, slayer: 15, thorns: 15, regen: 15, rhythm: 5, haggle: 6, pierce: 2, twin: 2, magpie: 2, favour: 5, charm: 10 };
const DEFAULTS = { world: 'void', diff: 0, skin: 'classic', up: 'full', spells: 'razor,meteor,fury,hole,shadow', runs: 16, workers: 4, seed: 1000, heal: 0.4 };
function parse(argv, defaults = DEFAULTS) {
  const o = { ...defaults };
  for (let i = 0; i < argv.length; i++) { const k = argv[i]; if (!k.startsWith('--')) continue; o[k.slice(2)] = argv[i + 1]; i++; }
  return o;
}
function upgrades(spec) {
  const up = {};
  for (const part of String(spec).split(',')) {
    if (part === 'full') Object.assign(up, ROOST_MAX);
    else if (part === 'none') for (const k in ROOST_MAX) up[k] = 0;
    else if (/^[0-9.]+$/.test(part)) for (const [k, m] of Object.entries(ROOST_MAX)) up[k] = Math.floor(m * +part + 1e-9);
    else { const [k, v] = part.split('='); if (!(k in ROOST_MAX)) throw new Error('unknown upgrade ' + k); up[k] = +v; }
  }
  return up;
}
function setup(o, label) {
  return { label, world: o.world, diff: +o.diff, skin: o.skin, up: upgrades(o.up), loadout: o.spells.split(','), healAt: +o.heal,
    hp: o.hp ? +o.hp : 0, dmg: o.dmg ? +o.dmg : 0, runs: +o.runs, seed: +o.seed, items: o.items ? String(o.items).split(',') : [], noshop: !!+o.noshop, nogift: !!+o.nogift };
}

// Runs inside the page: one full run, returns { win, wave }.
function playRun(c) {
  let s = c.seed >>> 0; Math.random = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const A = window.__nestguard; A.sim = true;
  const idx = A.BIOMES.findIndex(b => b.id === c.world); if (idx < 0) return { error: 'no world ' + c.world };
  const biomes = {}; for (const b of A.BIOMES) biomes[b.id] = { unlocked: true, cleared: true, best: 0, dw: 3 };
  A.setSave({ coins: 0, up: c.up, spells: A.SPELLS.map(x => x.id), loadout: c.loadout, skin: c.skin, skinsSeen: [c.skin], biomes, itemsOpen: A.ITEMS.map(i => i.id),
    biome: idx, ach: {}, stats: { kills: 0, casts: 0 }, talk: false, diffSel: { [c.world]: c.diff } });
  if (c.hp) A.BIOMES[idx].hp = c.hp; if (c.dmg) A.BIOMES[idx].dmg = c.dmg;
  A.newRun(idx);
  { const run = A.get().run; for (const id of c.items) { const it = A.ITEMS.find(x => x.id === id); if (!it) return { error: 'no item ' + id }; run.items[id] = (run.items[id] || 0) + 1; it.apply(); } }
  const SLOT_WAVE = [0, 0, 10, 20, 30];
  const pickBest = offers => { let bi = -1, bs = -1; offers.forEach((o, i) => { if (o.sold) return; const sc = o.rar * 10 + Math.random(); if (sc > bs) { bs = sc; bi = i; } }); return bi; };
  if ((c.up.favour || 0) > 0 && !c.nogift) { A.openGift(); A.takeGift(pickBest(A.get().offers)); } else A.startWave();
  const dt = 1 / 30;
  for (let steps = 0; ; ) {
    const g = A.get();
    if (g.state === 'over') return { win: false, wave: g.run.wave - 1 + (1 - Math.min(1, g.spawnQ.length / 40)) * 0.5, coins: g.run.kept };
    if (g.state === 'choice') return { win: true, wave: 30 + g.run.hp / g.run.maxHp, coins: g.run.coins };
    if (g.state === 'wave') {
      const live = g.enemies.filter(e => !e.dead && !e.under);
      if (g.cawT <= 0 && live.some(e => Math.hypot(e.x, e.y) < g.P.cawR * 0.85 + e.r)) A.caw();
      c.loadout.forEach((id, i) => {
        if (g.run.wave < SLOT_WAVE[i] || g.spellCds[id] > 0) return;
        const sp = A.SPELLS.find(x => x.id === id); if (!sp) return;
        if (sp.self) { if (live.length) A.cast(id, 0, 0); return; }
        const near = live.filter(e => Math.hypot(e.x, e.y) < 520); if (!near.length) return;
        let best = null, bv = -1;
        for (const e of near) { let v = (e.boss ? 6 : e.elite ? 3 : 1) * (1.5 - Math.hypot(e.x, e.y) / 520);
          for (const f of near) if (f !== e && Math.hypot(f.x - e.x, f.y - e.y) < sp.r) v += 1 - Math.hypot(f.x, f.y) / 700;
          if (v > bv) { bv = v; best = e; } }
        A.cast(id, best.x, best.y);
      });
      A.update(dt);
      if (++steps > 30 * 3600) return { win: false, wave: g.run.wave, timeout: true };
      continue;
    }
    if (g.state === 'shop') {
      const r = g.run;
      if (c.noshop) { if (r.golden) r.golden.cracked = true; r.picked = -1; }
      if (r.golden && !r.golden.cracked) A.crackGolden();
      if (r.picked == null && g.offers.length) { const bi = pickBest(g.offers), best = g.offers[bi];
        if (r.hp / r.maxHp < c.healAt && !(best && best.rar >= 4) && !r.noHeal) A.heal(); else A.buy(bi); }
      A.nextWave();
      if (A.get().state === 'shop') return { win: false, wave: r.wave, stuck: true };
      continue;
    }
    return { win: false, wave: g.run && g.run.wave, odd: g.state };
  }
}

async function itemList(rar) {
  const b = await chromium.launch(); const p = await b.newPage(); await p.route(/^https?:/, r => r.abort()); await p.goto('file://' + GAME);
  await p.waitForFunction(() => window.__nestguard); const l = await p.evaluate(() => window.__nestguard.ITEMS.map(i => [i.id, i.rar])); await b.close();
  return rar == null ? l : l.filter(x => x[1] === +rar);
}
(async () => {
  const o = parse(process.argv.slice(2));
  let setups;
  if (o.scan === 'items') {
    const ids = await itemList(o.rar); const base = { ...o, noshop: 1, nogift: 1 };
    setups = [setup(base, 'no item'), ...ids.map(([id, rar]) => setup({ ...base, items: id }, `${id} (r${rar})`))];
  } else if (o.scan === 'up') {
    const up = upgrades(o.up), coins = +(o.coins || 1000);
    setups = [setup(o, 'base')];
    for (const [k, m] of Object.entries(ROOST_MAX)) { let l = up[k] || 0, spent = 0; while (l < m && spent + roostCost(k, l) <= coins * 1.25) { spent += roostCost(k, l); l++; if (spent >= coins * 0.75) break; }
      if (l > (up[k] || 0)) setups.push(setup({ ...o, up: `${o.up},${k}=${l}` }, `${k} ${up[k] || 0}->${l} (${spent} coins)`)); }
  } else setups = o.compare ? o.compare.split(';').map(x => setup({ ...o, compare: undefined, ...parse(x.trim().split(/\s+/), {}) }, x.trim())) : [setup(o, `${o.world} diff ${o.diff} skin ${o.skin} up ${o.up}`)];
  const jobs = []; for (const st of setups) for (let k = 0; k < st.runs; k++) jobs.push({ ...st, seed: st.seed + k * 7919 });
  const b = await chromium.launch(); const res = new Map(setups.map(s => [s.label, []])); let next = 0, done = 0;
  async function worker() {
    const page = await b.newPage(); await page.route(/^https?:/, r => r.abort());
    page.on('pageerror', e => console.error('page error:', e.message));
    const load = async () => { await page.goto('file://' + GAME); await page.waitForFunction(() => window.__nestguard && window.__nestguard.takeGift); };
    await load();
    while (next < jobs.length) { const j = jobs[next++]; let r;
      try { r = await page.evaluate(playRun, j); } catch (e) { r = { win: false, error: String(e).slice(0, 120) }; }
      await load(); // fresh page per run so nothing leaks between runs
      res.get(j.label).push(r); if (process.stderr.isTTY) process.stderr.write(`\r${++done}/${jobs.length} runs`); }
    await page.close();
  }
  await Promise.all(Array.from({ length: Math.max(1, +o.workers) }, worker));
  await b.close(); process.stderr.write('\n');
  const w = Math.max(...setups.map(s => s.label.length));
  const mean = rs => rs.reduce((t, r) => t + (r.wave || 0), 0) / rs.length; const base0 = mean([...res.values()][0]);
  for (const [label, rs] of res) { const wins = rs.filter(r => r.win).length, errs = rs.filter(r => r.error);
    console.log(`${label.padEnd(w)}  ${String(wins).padStart(3)}/${rs.length} wins (${Math.round(100 * wins / rs.length)}%)  mean wave ${mean(rs).toFixed(1)} (${(mean(rs) - base0 >= 0 ? '+' : '') + (mean(rs) - base0).toFixed(1)})  waves reached: ${rs.map(r => r.wave).sort((a, b) => a - b).join(' ')}  avg coins kept: ${Math.round(rs.reduce((t, r) => t + (r.coins || 0), 0) / rs.length)}${errs.length ? '  errors: ' + errs[0].error : ''}`); }
})();
