/* ============================================================
   pwa-build-globe — parametric globe explorer
   Reads ./config.json + ./data/*.json at boot. Theme via ./theme.css.
   Vanilla JS. globe.gl (WebGL/Three.js) + d3-scale-chromatic.
   ============================================================ */

// --- State
const state = {
  config: null,
  globe: null,
  metrics: [],
  metricsByIso2: new Map(),
  topoFeatures: [],
  hubs: [],
  currentMetric: null,
  selectedIso2: null,
  showHubs: true,
};

// --- ISO 3166-1 numeric → alpha-2 (TopoJSON id is numeric string)
const NUM_TO_ISO2 = {
  "004":"AF","008":"AL","010":"AQ","012":"DZ","016":"AS","020":"AD","024":"AO","028":"AG","031":"AZ","032":"AR","036":"AU","040":"AT","044":"BS","048":"BH","050":"BD","051":"AM","052":"BB","056":"BE","060":"BM","064":"BT","068":"BO","070":"BA","072":"BW","074":"BV","076":"BR","084":"BZ","086":"IO","090":"SB","092":"VG","096":"BN","100":"BG","104":"MM","108":"BI","112":"BY","116":"KH","120":"CM","124":"CA","132":"CV","136":"KY","140":"CF","144":"LK","148":"TD","152":"CL","156":"CN","158":"TW","162":"CX","166":"CC","170":"CO","174":"KM","175":"YT","178":"CG","180":"CD","184":"CK","188":"CR","191":"HR","192":"CU","196":"CY","203":"CZ","204":"BJ","208":"DK","212":"DM","214":"DO","218":"EC","222":"SV","226":"GQ","231":"ET","232":"ER","233":"EE","234":"FO","238":"FK","239":"GS","242":"FJ","246":"FI","248":"AX","250":"FR","254":"GF","258":"PF","260":"TF","262":"DJ","266":"GA","268":"GE","270":"GM","275":"PS","276":"DE","288":"GH","292":"GI","296":"KI","300":"GR","304":"GL","308":"GD","312":"GP","316":"GU","320":"GT","324":"GN","328":"GY","332":"HT","334":"HM","336":"VA","340":"HN","344":"HK","348":"HU","352":"IS","356":"IN","360":"ID","364":"IR","368":"IQ","372":"IE","376":"IL","380":"IT","384":"CI","388":"JM","392":"JP","398":"KZ","400":"JO","404":"KE","408":"KP","410":"KR","414":"KW","417":"KG","418":"LA","422":"LB","426":"LS","428":"LV","430":"LR","434":"LY","438":"LI","440":"LT","442":"LU","446":"MO","450":"MG","454":"MW","458":"MY","462":"MV","466":"ML","470":"MT","474":"MQ","478":"MR","480":"MU","484":"MX","492":"MC","496":"MN","498":"MD","499":"ME","500":"MS","504":"MA","508":"MZ","512":"OM","516":"NA","520":"NR","524":"NP","528":"NL","531":"CW","533":"AW","534":"SX","535":"BQ","540":"NC","548":"VU","554":"NZ","558":"NI","562":"NE","566":"NG","570":"NU","574":"NF","578":"NO","580":"MP","581":"UM","583":"FM","584":"MH","585":"PW","586":"PK","591":"PA","598":"PG","600":"PY","604":"PE","608":"PH","612":"PN","616":"PL","620":"PT","624":"GW","626":"TL","630":"PR","634":"QA","638":"RE","642":"RO","643":"RU","646":"RW","652":"BL","654":"SH","659":"KN","660":"AI","662":"LC","663":"MF","666":"PM","670":"VC","674":"SM","678":"ST","682":"SA","686":"SN","688":"RS","690":"SC","694":"SL","702":"SG","703":"SK","704":"VN","705":"SI","706":"SO","710":"ZA","716":"ZW","724":"ES","728":"SS","729":"SD","732":"EH","740":"SR","744":"SJ","748":"SZ","752":"SE","756":"CH","760":"SY","762":"TJ","764":"TH","768":"TG","772":"TK","776":"TO","780":"TT","784":"AE","788":"TN","792":"TR","795":"TM","796":"TC","798":"TV","800":"UG","804":"UA","807":"MK","818":"EG","826":"GB","831":"GG","832":"JE","833":"IM","834":"TZ","840":"US","850":"VI","854":"BF","858":"UY","860":"UZ","862":"VE","876":"WF","882":"WS","887":"YE","894":"ZM"
};

const CATEGORY_PALETTES = {
  set2: ['#f5a524','#60a5fa','#4ade80','#f87171','#a78bfa','#fbbf24','#22d3ee','#fb7185','#34d399'],
  hub:  { 'Active': '#4ade80', 'Planned': '#60a5fa', null: '#475569' },
};

// --- CSS-var lookup (lets globe colors track the active theme)
function cssVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

// --- Format dispatcher
function fmt(val, kind) {
  if (val == null || (typeof val === 'number' && isNaN(val))) return '—';
  switch (kind) {
    case 'big':         return fmtBig(val);
    case 'pct1':        return fmtPct1(val);
    case 'int':         return Math.round(val).toLocaleString();
    case 'boolean_pass':return val ? '✓ Pass' : '✗ Fail';
    case 'raw':
    case 'as_is':
    default:            return String(val);
  }
}
function fmtBig(v) {
  if (v == null || isNaN(v)) return '—';
  const a = Math.abs(v);
  if (a >= 1e9) return (v/1e9).toFixed(2) + 'B';
  if (a >= 1e6) return (v/1e6).toFixed(2) + 'M';
  if (a >= 1e3) return (v/1e3).toFixed(1) + 'K';
  return Number(v).toFixed(0);
}
function fmtPct1(v) {
  if (v == null) return '—';
  // accept 0–1 OR 0–100 — heuristic: if any value > 1, treat as percent already
  return (Math.abs(v) <= 1 ? (v * 100).toFixed(1) : Number(v).toFixed(1)) + '%';
}

function metricFormatter(metric) {
  if (metric.format) return v => fmt(v, metric.format);
  if (metric.kind === 'numeric')     return fmtBig;
  if (metric.kind === 'pct')         return fmtPct1;
  if (metric.kind === 'categorical') return v => v == null ? '—' : String(v);
  return v => v == null ? '—' : String(v);
}

// ============================================================
// BOOT
// ============================================================
async function boot() {
  state.config = await fetch('./config.json').then(r => r.json());
  applyConfig(state.config);

  populateMetricDropdown();
  wireControls();
  wireHubOverlay();
  renderFooter();

  const fetches = [
    fetch(state.config.data.countries).then(r => r.json()),
    fetch(state.config.geometry.world_atlas).then(r => r.json()),
  ];
  if (state.config.data.hubs) {
    fetches.push(fetch(state.config.data.hubs).then(r => r.json()).catch(() => []));
  }
  const [metrics, topo, hubs] = await Promise.all(fetches);

  state.hubs = hubs || [];
  metrics.forEach(row => {
    state.metricsByIso2.set(row.country_code, row);
  });

  const features = topojson.feature(topo, topo.objects.countries).features;
  features.forEach(f => {
    const numId = String(f.id).padStart(3, '0');
    f.properties.iso2 = NUM_TO_ISO2[numId] || null;
  });
  state.topoFeatures = features;

  initGlobe();
  applyMetric(state.currentMetric);
  runDataIntegrityCheck();
}

function applyConfig(cfg) {
  state.metrics = (cfg.metrics || []).map(m => ({
    ...m,
    key: m.id,
    fmt: metricFormatter(m),
    scale: m.scale || (m.kind === 'pct' ? 'plasma' : m.kind === 'numeric' ? 'viridis' : 'set2'),
  }));
  state.currentMetric = state.metrics[0];

  if (cfg.overlays && cfg.overlays.hubs && cfg.overlays.hubs.enabled) {
    const hubControl = document.getElementById('hub-control');
    if (hubControl) {
      hubControl.hidden = false;
      const lbl = document.getElementById('hub-label');
      if (lbl && cfg.overlays.hubs.label) lbl.textContent = cfg.overlays.hubs.label;
    }
    state.showHubs = true;
  } else {
    state.showHubs = false;
  }
}

// ============================================================
// GLOBE
// ============================================================
function initGlobe() {
  const elem = document.getElementById('globe');
  const bg = cssVar('--bg-0', '#06101f');
  const globeColor = cssVar('--bg-1', '#0a1628');
  const stroke = cssVar('--line', '#1f3354');

  state.globe = Globe()(elem)
    .backgroundColor(bg)
    .showAtmosphere(true)
    .atmosphereColor(cssVar('--accent', '#f5a524'))
    .atmosphereAltitude(0.18)
    .showGlobe(true)
    .globeMaterial(new THREE.MeshPhongMaterial({
      color: new THREE.Color(globeColor),
      emissive: new THREE.Color(bg),
      shininess: 5
    }))
    .polygonsData(state.topoFeatures)
    .polygonAltitude(f => (state.selectedIso2 && f.properties.iso2 === state.selectedIso2) ? 0.015 : 0.005)
    .polygonCapColor(f => polygonColor(f))
    .polygonSideColor(() => 'rgba(20, 40, 70, 0.6)')
    .polygonStrokeColor(() => stroke)
    .polygonLabel(() => '')
    .onPolygonHover(onPolygonHover)
    .onPolygonClick(onPolygonClick);

  state.globe.pointOfView({ lat: 15, lng: 10, altitude: 2.4 }, 0);
  state.globe.controls().autoRotate = true;
  state.globe.controls().autoRotateSpeed = 0.35;
  elem.addEventListener('mousedown',  () => state.globe.controls().autoRotate = false);
  elem.addEventListener('wheel',      () => state.globe.controls().autoRotate = false);
  elem.addEventListener('touchstart', () => state.globe.controls().autoRotate = false);

  refreshHubs();
  window.addEventListener('resize', () => state.globe.width(elem.clientWidth).height(elem.clientHeight));
}

function refreshHubs() {
  if (!state.globe) return;
  const accent = cssVar('--accent', '#f5a524');
  state.globe
    .pointsData(state.showHubs ? state.hubs : [])
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointAltitude(0.04)
    .pointRadius(0.42)
    .pointColor(d => d.status === 'Active' ? accent : '#60a5fa')
    .pointLabel(d => `<div style="background:${cssVar('--panel-bg','rgba(6,16,31,0.96)')};border:1px solid ${cssVar('--line','#1f3354')};padding:6px 10px;border-radius:6px;font-size:12px;color:${cssVar('--text-0','#e8eef7')};font-family:system-ui">
        <strong style="color:${accent}">${d.hub_name}</strong><br/>
        <span style="color:${cssVar('--text-1','#aab8cf')}">${d.status}${d.leader ? ' · ' + d.leader : ''}</span>
      </div>`);
}

// ============================================================
// COLORING
// ============================================================
function polygonColor(feature) {
  const iso2 = feature.properties.iso2;
  const row = iso2 ? state.metricsByIso2.get(iso2) : null;
  if (!row) return 'rgba(31, 51, 84, 0.55)';
  const m = state.currentMetric;
  const v = row[m.key];
  if (v == null) return 'rgba(110, 126, 150, 0.55)';

  if (m.kind === 'categorical') return categoricalColor(m.id, v);
  const domain = state._currentDomain;
  if (!domain) return cssVar('--accent', '#f5a524');
  const t = (v - domain[0]) / ((domain[1] - domain[0]) || 1);
  return scaleFn(m.scale)(Math.max(0, Math.min(1, t)));
}

function categoricalColor(metricId, val) {
  if (metricId === 'hub_status') return CATEGORY_PALETTES.hub[val] || cssVar('--accent', '#f5a524');
  const cats = state._currentCats || [];
  const idx = cats.indexOf(val);
  const palette = CATEGORY_PALETTES.set2;
  return idx >= 0 ? palette[idx % palette.length] : '#475569';
}

function scaleFn(name) {
  switch (name) {
    case 'viridis': return d3.interpolateViridis;
    case 'plasma':  return d3.interpolatePlasma;
    case 'turbo':   return d3.interpolateTurbo;
    case 'cividis': return d3.interpolateCividis;
    case 'greys':   return d3.interpolateGreys;
    default:        return d3.interpolateViridis;
  }
}

function applyMetric(metric) {
  state.currentMetric = metric;
  const rows = [...state.metricsByIso2.values()];
  if (metric.kind === 'numeric' || metric.kind === 'pct') {
    const vals = rows.map(r => r[metric.key]).filter(v => v != null && !isNaN(v));
    state._currentDomain = vals.length ? [Math.min(...vals), Math.max(...vals)] : [0, 1];
    state._currentCats = null;
  } else {
    state._currentCats = [...new Set(rows.map(r => r[metric.key]).filter(v => v != null))].sort();
    state._currentDomain = null;
  }
  renderLegend();
  if (state.globe) state.globe.polygonCapColor(f => polygonColor(f));
}

// ============================================================
// LEGEND
// ============================================================
function renderLegend() {
  const titleEl = document.getElementById('legend-title');
  const bodyEl  = document.getElementById('legend-body');
  const metaEl  = document.getElementById('legend-meta');
  const m = state.currentMetric;
  titleEl.textContent = m.label;
  bodyEl.innerHTML = '';

  if (m.kind === 'categorical') {
    (state._currentCats || []).forEach(c => {
      const row = document.createElement('div');
      row.className = 'legend-swatch-row';
      const sw = document.createElement('span');
      sw.className = 'legend-swatch';
      sw.style.background = categoricalColor(m.id, c);
      row.appendChild(sw);
      row.appendChild(document.createTextNode(c));
      bodyEl.appendChild(row);
    });
    const base = document.createElement('div');
    base.className = 'legend-swatch-row muted';
    base.innerHTML = `<span class="legend-swatch" style="background:rgba(31,51,84,0.55)"></span>Out of scope`;
    bodyEl.appendChild(base);
  } else {
    const grad = document.createElement('div');
    grad.className = 'legend-gradient';
    grad.style.background = `linear-gradient(90deg, ${scaleFn(m.scale)(0)}, ${scaleFn(m.scale)(0.5)}, ${scaleFn(m.scale)(1)})`;
    bodyEl.appendChild(grad);
    const range = document.createElement('div');
    range.className = 'legend-range';
    const d = state._currentDomain;
    range.innerHTML = `<span>${m.fmt(d[0])}</span><span>${m.fmt(d[1])}</span>`;
    bodyEl.appendChild(range);
  }

  const n = state.metricsByIso2.size;
  metaEl.innerHTML = `<strong>${n}</strong> countries in scope · others shown as base layer`;
}

// ============================================================
// INTERACTIONS
// ============================================================
function onPolygonHover(feature) {
  const tt = document.getElementById('tooltip');
  if (!feature) { tt.hidden = true; return; }
  const iso2 = feature.properties.iso2;
  const row = iso2 ? state.metricsByIso2.get(iso2) : null;
  const name = feature.properties.name || (row && row.country_name) || iso2 || '—';
  const m = state.currentMetric;

  if (row) {
    tt.innerHTML = `<strong>${row.country_name}</strong>
      <div class="tt-row"><span>${m.label}</span><span>${m.fmt(row[m.key])}</span></div>
      <div class="tt-row muted" style="font-size:10px;margin-top:3px">Click for details</div>`;
  } else {
    tt.innerHTML = `<strong>${name}</strong>
      <div class="tt-row muted" style="font-size:10px">Out of scope</div>`;
  }
  tt.hidden = false;
}

function onPolygonClick(feature) {
  const iso2 = feature.properties.iso2;
  const row = iso2 ? state.metricsByIso2.get(iso2) : null;
  if (!row) { showToast('Country not in scope'); return; }
  state.selectedIso2 = iso2;
  state.globe.polygonAltitude(f => (state.selectedIso2 && f.properties.iso2 === state.selectedIso2) ? 0.015 : 0.005);
  renderDetail(row);
}

document.addEventListener('mousemove', (e) => {
  const tt = document.getElementById('tooltip');
  if (tt.hidden) return;
  tt.style.left = (e.clientX + 14) + 'px';
  tt.style.top  = (e.clientY + 14) + 'px';
});

// ============================================================
// DETAIL PANEL
// ============================================================
function renderDetail(row) {
  const panel = document.getElementById('detail-panel');
  const content = document.getElementById('detail-content');
  const toggle = document.getElementById('panel-toggle');
  content.hidden = false;
  panel.classList.add('is-open', 'has-selection');
  panel.setAttribute('aria-hidden', 'false');
  if (toggle) toggle.setAttribute('aria-expanded', 'true');

  const cfg = state.config;
  const sections = (cfg.detail_sections && cfg.detail_sections.length)
    ? cfg.detail_sections
    : autoSectionsFromMetrics();

  const subtitle = [row.country_code, row.country_code_3].filter(Boolean).join(' · ');

  content.innerHTML = `
    <div class="detail-header">
      <h2 class="detail-country">${row.country_name || row.country_code}</h2>
      <div class="detail-iso">${subtitle}</div>
    </div>
    ${sections.map(sec => renderSection(sec, row)).join('')}
  `;

  flyToIso2(row.country_code);
}

function autoSectionsFromMetrics() {
  // Default detail panel = single section listing every configured metric for this country
  return [{
    title: 'Metrics',
    fields: state.metrics.map(m => ({ key: m.id, label: m.label, format: m.format || (m.kind === 'pct' ? 'pct1' : m.kind === 'numeric' ? 'big' : 'as_is') })),
  }];
}

function renderSection(sec, row) {
  const rows = sec.fields.map(f => {
    const v = row[f.key];
    const valStr = fmt(v, f.format);
    const cls = f.format === 'boolean_pass' ? (v ? 'good' : 'bad') : '';
    return `<div class="detail-row"><span class="detail-key">${f.label}</span><span class="detail-val ${cls}">${valStr}</span></div>`;
  }).join('');
  return `<div class="detail-section">
    <div class="detail-section-title">${sec.title}</div>
    ${rows}
  </div>`;
}

document.getElementById('detail-close').addEventListener('click', () => {
  const panel = document.getElementById('detail-panel');
  const toggle = document.getElementById('panel-toggle');
  panel.classList.remove('is-open', 'has-selection');
  panel.setAttribute('aria-hidden', 'true');
  document.getElementById('detail-content').hidden = true;
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
  state.selectedIso2 = null;
  if (state.globe) state.globe.polygonAltitude(0.005);
});

document.getElementById('panel-toggle').addEventListener('click', () => {
  const panel = document.getElementById('detail-panel');
  const toggle = document.getElementById('panel-toggle');
  const isOpen = panel.classList.toggle('is-open');
  panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// ============================================================
// CONTROLS / SEARCH
// ============================================================
function wireControls() {
  document.getElementById('metric-select').addEventListener('change', (e) => {
    const m = state.metrics.find(x => x.id === e.target.value);
    if (m) applyMetric(m);
  });

  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  let focusIdx = -1;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.hidden = true; return; }
    const rows = [...state.metricsByIso2.values()]
      .filter(r => (r.country_name || '').toLowerCase().includes(q)
                || (r.country_code || '').toLowerCase() === q
                || (r.country_code_3 || '').toLowerCase() === q)
      .slice(0, 8);
    results.innerHTML = rows.length
      ? rows.map(r => `<li data-iso="${r.country_code}">${r.country_name}<span class="sub">${r.country_code}</span></li>`).join('')
      : '<li class="muted" style="cursor:default">No match</li>';
    results.hidden = false;
    focusIdx = -1;
  });

  results.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-iso]');
    if (li) selectFromSearch(li.dataset.iso);
  });

  input.addEventListener('keydown', (e) => {
    const items = [...results.querySelectorAll('li[data-iso]')];
    if (e.key === 'ArrowDown') { e.preventDefault(); focusIdx = Math.min(focusIdx + 1, items.length - 1); items.forEach((el, i) => el.classList.toggle('focus', i === focusIdx)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusIdx = Math.max(focusIdx - 1, 0); items.forEach((el, i) => el.classList.toggle('focus', i === focusIdx)); }
    else if (e.key === 'Enter') { e.preventDefault(); const pick = items[focusIdx >= 0 ? focusIdx : 0]; if (pick) selectFromSearch(pick.dataset.iso); }
    else if (e.key === 'Escape') { results.hidden = true; input.blur(); }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.control')) results.hidden = true;
  });
}

function wireHubOverlay() {
  const toggle = document.getElementById('hub-toggle');
  if (!toggle) return;
  toggle.addEventListener('change', (e) => {
    state.showHubs = e.target.checked;
    refreshHubs();
  });
}

function selectFromSearch(iso2) {
  const row = state.metricsByIso2.get(iso2);
  if (!row) { showToast('Country not found'); return; }
  document.getElementById('search-input').value = row.country_name;
  document.getElementById('search-results').hidden = true;
  state.selectedIso2 = iso2;
  state.globe.polygonAltitude(f => (state.selectedIso2 && f.properties.iso2 === state.selectedIso2) ? 0.015 : 0.005);
  renderDetail(row);
}

function flyToIso2(iso2) {
  const feature = state.topoFeatures.find(f => f.properties.iso2 === iso2);
  if (!feature) return;
  const c = centroidLngLat(feature.geometry);
  if (!c) return;
  state.globe.controls().autoRotate = false;
  state.globe.pointOfView({ lat: c[1], lng: c[0], altitude: 1.6 }, 1000);
}

function centroidLngLat(geom) {
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  let sx = 0, sy = 0, n = 0;
  polys.forEach(poly => poly[0].forEach(([x, y]) => { sx += x; sy += y; n++; }));
  return n ? [sx / n, sy / n] : null;
}

function populateMetricDropdown() {
  const sel = document.getElementById('metric-select');
  sel.innerHTML = state.metrics.map(m => `<option value="${m.id}">${m.label}</option>`).join('');
  sel.value = state.currentMetric.id;
}

function renderFooter() {
  const el = document.getElementById('footer-sources');
  const sources = state.config.footer_sources || [];
  if (!sources.length) { el.textContent = ''; return; }
  el.innerHTML = 'Source: ' + sources.map(s => `<code>${s}</code>`).join(' + ');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { t.hidden = true; }, 2200);
}

function runDataIntegrityCheck() {
  const rows = [...state.metricsByIso2.values()];
  const missing = rows.filter(r => !state.topoFeatures.some(f => f.properties.iso2 === r.country_code));
  console.group('%cpwa-build-globe — Data Integrity Check', 'color:#f5a524;font-weight:bold');
  console.log(`✓ Config: ${state.config.name}`);
  console.log(`✓ Loaded ${rows.length} countries`);
  console.log(`✓ Loaded ${state.topoFeatures.length} TopoJSON polygons`);
  console.log(`✓ Loaded ${state.hubs.length} hub markers`);
  console.log(`✓ Metrics configured: ${state.metrics.map(m => m.id).join(', ')}`);
  if (missing.length) console.warn('✗ ISO-2 missing from TopoJSON:', missing.map(r => `${r.country_code} (${r.country_name})`));
  else console.log('%c✓ All ISO-2 codes match TopoJSON', 'color:#4ade80');
  console.groupEnd();
}

boot().catch(err => {
  console.error('Boot failure:', err);
  const t = document.getElementById('toast');
  if (t) { t.textContent = 'Failed to load — check console'; t.hidden = false; }
});
