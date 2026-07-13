/* =========================================================
   KHAN PUMP — Fuel Tank Dip Calculator
   Calibration data embedded below (source: data.json).
   A synthetic (0mm, 0L) start point is added so the tank
   reads zero at an empty dip — the original chart's first
   recorded point begins at 2mm.
   ========================================================= */

const CALIBRATION = [[0,0],[2,24],[10,43],[20,70],[30,103],[40,139],[50,178],[60,220],[70,265],[80,313],[90,363],[100,416],[110,470],[120,527],[130,586],[140,647],[150,709],[160,774],[170,840],[180,908],[190,977],[200,1048],[210,1121],[220,1195],[230,1270],[240,1347],[250,1425],[260,1504],[270,1585],[280,1667],[290,1750],[300,1834],[310,1919],[320,2006],[330,2093],[340,2182],[350,2272],[360,2362],[370,2454],[380,2547],[390,2640],[400,2735],[410,2830],[420,2927],[430,3024],[440,3122],[450,3221],[460,3320],[470,3421],[480,3522],[490,3624],[500,3726],[510,3830],[520,3934],[530,4039],[540,4144],[550,4251],[560,4357],[570,4465],[580,4573],[590,4682],[600,4791],[610,4901],[620,5011],[630,5122],[640,5234],[650,5346],[660,5458],[670,5572],[680,5685],[690,5799],[700,5914],[710,6029],[720,6144],[730,6260],[740,6376],[750,6493],[760,6610],[770,6728],[780,6846],[790,6964],[800,7083],[810,7202],[820,7321],[830,7440],[840,7560],[850,7681],[860,7801],[870,7922],[880,8043],[890,8165],[900,8286],[910,8408],[920,8531],[930,8653],[940,8776],[950,8899],[960,9022],[970,9145],[980,9268],[990,9392],[1000,9516],[1010,9640],[1020,9764],[1030,9888],[1040,10012],[1050,10137],[1060,10261],[1070,10386],[1080,10511],[1090,10636],[1100,10761],[1110,10886],[1120,11011],[1130,11136],[1140,11261],[1150,11386],[1160,11512],[1170,11637],[1180,11762],[1190,11887],[1200,12013],[1210,12138],[1220,12263],[1230,12388],[1240,12513],[1250,12638],[1260,12763],[1270,12888],[1280,13013],[1290,13138],[1300,13263],[1310,13387],[1320,13512],[1330,13636],[1340,13760],[1350,13884],[1360,14008],[1370,14132],[1380,14255],[1390,14379],[1400,14502],[1410,14625],[1420,14748],[1430,14870],[1440,14992],[1450,15115],[1460,15236],[1470,15358],[1480,15479],[1490,15600],[1500,15721],[1510,15842],[1520,15962],[1530,16082],[1540,16201],[1550,16320],[1560,16439],[1570,16558],[1580,16676],[1590,16793],[1600,16911],[1610,17028],[1620,17144],[1630,17261],[1640,17376],[1650,17491],[1660,17606],[1670,17721],[1680,17835],[1690,17948],[1700,18061],[1710,18173],[1720,18285],[1730,18396],[1740,18507],[1750,18617],[1760,18727],[1770,18836],[1780,18945],[1790,19052],[1800,19160],[1810,19266],[1820,19372],[1830,19477],[1840,19582],[1850,19686],[1860,19789],[1870,19891],[1880,19993],[1890,20094],[1900,20194],[1910,20293],[1920,20392],[1930,20489],[1940,20586],[1950,20682],[1960,20777],[1970,20871],[1980,20965],[1990,21057],[2000,21148],[2010,21238],[2020,21328],[2030,21416],[2040,21503],[2050,21589],[2060,21674],[2070,21758],[2080,21840],[2090,21922],[2100,22002],[2110,22081],[2120,22158],[2130,22234],[2140,22309],[2150,22383],[2160,22454],[2170,22525],[2180,22594],[2190,22661],[2200,22726],[2210,22790],[2220,22852],[2230,22912],[2240,22970],[2250,23026],[2260,23080],[2270,23132],[2280,23181],[2290,23227],[2300,23271],[2310,23313],[2320,23350],[2330,23388],[2340,23415],[2350,23441],[2360,23462]];

const MAX_DIP = CALIBRATION[CALIBRATION.length - 1][0];
const MAX_LITERS = CALIBRATION[CALIBRATION.length - 1][1];

/* ---------- Linear interpolation over the calibration chart ---------- */
function dipToLiters(dip) {
  dip = Math.max(0, Math.min(MAX_DIP, Number(dip) || 0));
  for (let i = 0; i < CALIBRATION.length - 1; i++) {
    const [d0, l0] = CALIBRATION[i];
    const [d1, l1] = CALIBRATION[i + 1];
    if (dip >= d0 && dip <= d1) {
      if (d1 === d0) return l0;
      const t = (dip - d0) / (d1 - d0);
      return l0 + t * (l1 - l0);
    }
  }
  return MAX_LITERS;
}

/* =========================== Elements =========================== */
const dipInput   = document.getElementById('dipInput');
const dipSlider  = document.getElementById('dipSlider');
const clearBtn   = document.getElementById('clearBtn');
const saveBtn    = document.getElementById('saveBtn');
const tankLiquid = document.getElementById('tankLiquid');
const litersEl   = document.getElementById('litersValue');
const percentEl  = document.getElementById('percentValue');
const statDip    = document.getElementById('statDip');
const statCap    = document.getElementById('statCapacity');
const statRemain = document.getElementById('statRemaining');
const maxDipLabel= document.getElementById('maxDipLabel');

dipSlider.max = MAX_DIP;
maxDipLabel.textContent = `${MAX_DIP} mm`;
statCap.textContent = fmt(MAX_LITERS) + ' L';

function fmt(n) {
  return Math.round(n).toLocaleString('en-IN');
}

function render(dip) {
  const liters = dipToLiters(dip);
  const percent = (liters / MAX_LITERS) * 100;

  litersEl.textContent = fmt(liters);
  percentEl.textContent = `${percent.toFixed(1)}% Full`;
  tankLiquid.style.height = Math.max(percent, liters > 0 ? 2 : 0) + '%';
  statDip.textContent = `${Math.round(dip)} mm`;
  statRemain.textContent = fmt(MAX_LITERS - liters) + ' L';

  return { dip: Math.round(dip), liters: Math.round(liters), percent: +percent.toFixed(1) };
}

let current = render(0);

dipInput.addEventListener('input', () => {
  const v = Math.max(0, Math.min(MAX_DIP, Number(dipInput.value) || 0));
  dipSlider.value = v;
  current = render(v);
});

dipSlider.addEventListener('input', () => {
  dipInput.value = dipSlider.value;
  current = render(Number(dipSlider.value));
});

clearBtn.addEventListener('click', () => {
  dipInput.value = '';
  dipSlider.value = 0;
  current = render(0);
  dipInput.focus();
});

/* =========================== Tabs =========================== */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected','true');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'table' && !tableBuilt) buildCalibrationTable();
  });
});

/* =========================== Theme toggle =========================== */
const themeToggle = document.getElementById('themeToggle');
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('khanpump_theme', t);
}
applyTheme(localStorage.getItem('khanpump_theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

/* =========================== Calibration table (Excel-style B:K) ===========================
   Column A = whole cm mark, columns B:K = mm offsets 0-9 within that cm.
   Litres are derived by linear interpolation from the calibration chart above. */
let tableBuilt = false;
function buildCalibrationTable() {
  const body = document.getElementById('calibBody');
  const rows = [];
  const maxCm = Math.floor(MAX_DIP / 10);
  for (let cm = 0; cm <= maxCm; cm++) {
    let rowHtml = `<tr data-cm="${cm}"><td>${cm}</td>`;
    for (let mm = 0; mm <= 9; mm++) {
      const dip = cm * 10 + mm;
      if (dip > MAX_DIP) { rowHtml += `<td>—</td>`; continue; }
      rowHtml += `<td>${fmt(dipToLiters(dip))}</td>`;
    }
    rowHtml += `</tr>`;
    rows.push(rowHtml);
  }
  body.innerHTML = rows.join('');
  tableBuilt = true;
}

document.getElementById('tableSearch').addEventListener('input', (e) => {
  const q = e.target.value.trim();
  document.querySelectorAll('#calibBody tr').forEach(tr => {
    tr.classList.toggle('matched', q !== '' && tr.dataset.cm === q);
  });
  if (q !== '') {
    const target = document.querySelector(`#calibBody tr[data-cm="${q}"]`);
    if (target) target.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
});

/* =========================== History ===========================
   Stored in localStorage as an array of {dip, liters, percent, ts}. */
const HISTORY_KEY = 'khanpump_history';
const historyList  = document.getElementById('historyList');
const historyEmpty = document.getElementById('historyEmpty');

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch (e) { return []; }
}
function setHistory(arr) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
}

function renderHistory() {
  const items = getHistory();
  historyEmpty.classList.toggle('hidden', items.length > 0);
  historyList.innerHTML = items.map((it, idx) => {
    const d = new Date(it.ts);
    const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `<li>
      <div class="h-main">
        <span class="h-liters">${fmt(it.liters)} L <small style="color:var(--text-dim); font-weight:500;">(${it.dip} mm · ${it.percent}%)</small></span>
        <span class="h-meta">${dateStr} · ${timeStr}</span>
      </div>
      <button class="h-del" data-idx="${idx}" aria-label="Delete entry">🗑</button>
    </li>`;
  }).join('');
}

saveBtn.addEventListener('click', () => {
  const items = getHistory();
  items.unshift({ ...current, ts: Date.now() });
  setHistory(items.slice(0, 500));
  renderHistory();
  saveBtn.textContent = '✅ Saved';
  setTimeout(() => saveBtn.textContent = '💾 Save to History', 1100);
});

historyList.addEventListener('click', (e) => {
  const btn = e.target.closest('.h-del');
  if (!btn) return;
  const items = getHistory();
  items.splice(Number(btn.dataset.idx), 1);
  setHistory(items);
  renderHistory();
});

document.getElementById('clearHistoryBtn').addEventListener('click', () => {
  if (items_confirm()) { setHistory([]); renderHistory(); }
});
function items_confirm() {
  const items = getHistory();
  if (items.length === 0) return false;
  return confirm('Clear all saved history? This cannot be undone.');
}

renderHistory();

/* =========================== Footer year =========================== */
document.getElementById('year').textContent = new Date().getFullYear();

/* =========================== PWA: service worker + install prompt =========================== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}

let deferredPrompt;
const installBar = document.getElementById('installBar');
const installBtn = document.getElementById('installBtn');
const installDismiss = document.getElementById('installDismiss');
const installBannerBtn = document.getElementById('installBannerBtn');

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

function showInstallOptions() {
  if (isStandalone()) return; // already installed, keep everything hidden
  installBannerBtn.classList.remove('hidden');
  if (!localStorage.getItem('khanpump_install_dismissed')) {
    installBar.classList.remove('hidden');
  }
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallOptions();
});

window.addEventListener('appinstalled', () => {
  installBannerBtn.classList.add('hidden');
  installBar.classList.add('hidden');
  deferredPrompt = null;
});

// iOS Safari never fires beforeinstallprompt — show the banner with manual instructions instead.
if (isIOS() && !isStandalone()) {
  installBannerBtn.classList.remove('hidden');
}

async function triggerInstall() {
  if (deferredPrompt) {
    installBar.classList.add('hidden');
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    return;
  }
  if (isIOS()) {
    alert('Install KHAN PUMP app:\n\n1. Tap the Share icon (⬆️) in Safari\n2. Choose "Add to Home Screen"\n3. Tap "Add"');
    return;
  }
  alert('To install: open your browser menu (⋮) and choose "Install app" or "Add to Home screen".');
}

installBtn?.addEventListener('click', triggerInstall);
installBannerBtn?.addEventListener('click', triggerInstall);

installDismiss?.addEventListener('click', () => {
  installBar.classList.add('hidden');
  localStorage.setItem('khanpump_install_dismissed', '1');
});
