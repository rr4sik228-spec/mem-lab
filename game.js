/* MEMO LAB: Brainrot Evolution — HTML5 merge-clicker для Яндекс Игр */
(function () {
'use strict';

/* ---------- настройки ---------- */
var COLS = 4, ROWS = 5, CELLS = COLS * ROWS;
var USE_IMAGES = false;           // true — если положишь картинки assets/characters/1.png ... 12.png
var INTERSTITIAL_COOLDOWN = 180;  // сек между полноэкранной рекламой (только в естественных паузах)
var SAVE_KEY = 'memolab_save_v1';

/* ---------- тексты ---------- */
var LANG = 'ru';
var TXT = {
  ru: {
    perSec:'в секунду', buy:'Новое существо', collect:'Собрать',
    upgrades:'Улучшения', collection:'Коллекция', story:'Сюжет',
    hint:'Перетащи одинаковых существ друг на друга, чтобы объединить',
    full:'Лаборатория заполнена! Объедини существ.',
    noCoins:'Не хватает монет',
    cont:'Продолжить', close:'Закрыть',
    upClick:'Сильный клик', upClickD:'Больше монет за каждое нажатие',
    upInc:'Энергоядро', upIncD:'Все существа приносят больше (x1.5)',
    upSpawn:'Лучший эксперимент', upSpawnD:'Новые существа появляются сильнее',
    max:'МАКС', lvl:'Ур.',
    bonus:'Бонусы', adBoost:'📺 Удвоить доход на 60 сек', adCoins:'📺 Получить бонус монет',
    boostOn:'Удвоение активно!', gotCoins:'Бонус получен!',
    adFail:'Реклама сейчас недоступна',
    coll:'Коллекция существ', found:'Открыто',
    storyT:'Сюжет', chapter:'Глава', locked:'Закрыто',
    offline:'Пока тебя не было, лаборатория заработала',
    rar:['Обычное','Обычное','Редкое','Редкое','Эпическое','Эпическое','Эпическое','Легендарное','Легендарное','Легендарное','Мифическое','Секретное']
  },
  en: {
    perSec:'per second', buy:'New creature', collect:'Collect',
    upgrades:'Upgrades', collection:'Collection', story:'Story',
    hint:'Drag two identical creatures together to merge them',
    full:'The lab is full! Merge some creatures.',
    noCoins:'Not enough coins',
    cont:'Continue', close:'Close',
    upClick:'Strong click', upClickD:'More coins per tap',
    upInc:'Energy core', upIncD:'All creatures earn more (x1.5)',
    upSpawn:'Better experiment', upSpawnD:'New creatures spawn stronger',
    max:'MAX', lvl:'Lv.',
    bonus:'Bonuses', adBoost:'📺 Double income for 60 sec', adCoins:'📺 Get bonus coins',
    boostOn:'Double income is on!', gotCoins:'Bonus received!',
    adFail:'Ad is not available right now',
    coll:'Creature collection', found:'Found',
    storyT:'Story', chapter:'Chapter', locked:'Locked',
    offline:'While you were away, the lab earned',
    rar:['Common','Common','Rare','Rare','Epic','Epic','Epic','Legendary','Legendary','Legendary','Mythic','Secret']
  }
};
function t(k) { return TXT[LANG][k]; }

/* ---------- существа (12 уровней эволюции) ---------- */
// [основной смайл, аксессуар, имя ru, имя en, цветовой класс]
var MONS = [
  ['☕','👟','Кофе-Босс','Coffee Boss','r1'],
  ['🍩','🕶️','Пончик-Спринтер','Donut Sprinter','r1'],
  ['🧊','🥼','Холодильник-Х','Fridge-X','r2'],
  ['🍌','🎓','Банан-Профессор','Professor Banana','r2'],
  ['🍍','🐢','Ананас-Черепаха','Pineapple Turtle','r3'],
  ['🍕','🏴‍☠️','Пицца-Пират','Pizza Pirate','r3'],
  ['🧹','🥷','Метла-Ниндзя','Broom Ninja','r3'],
  ['🐄','🪐','Космо-Корова','Cosmo Cow','r4'],
  ['🐸','🌙','Луна-Лягушка','Moon Frog','r4'],
  ['⏰','🦄','Будильник-Единорог','Alarm Unicorn','r4'],
  ['🐲','🍞','Тостер-Дракон','Toaster Dragon','r5'],
  ['🥚','✨','Золотое Яйцо','Golden Egg','r6']
];
var MAXLV = MONS.length;

/* ---------- сюжет ---------- */
// need — уровень существа, который нужно открыть
var CHAPTERS = [
  { need:1, icon:'💥',
    ru:['Глава 1. Авария','В лаборатории профессора Бублиуса произошёл сбой. Энергетическое ядро взорвалось, и все предметы превратились в странных существ. Ты — новый помощник профессора.'],
    en:['Chapter 1. The Accident','A glitch hit Professor Bublius’s lab. The energy core exploded and everyday objects turned into strange creatures. You are the professor’s new assistant.'] },
  { need:2, icon:'🧬',
    ru:['Глава 2. Первая эволюция','Ты понял главное: два одинаковых существа могут слиться в новую, ещё более безумную форму!'],
    en:['Chapter 2. The First Evolution','You figured it out: two identical creatures can merge into a new, even crazier form!'] },
  { need:5, icon:'🚪',
    ru:['Глава 3. Забытая лаборатория','Открылась заброшенная часть лаборатории. Здесь живут редкие существа, оставленные прежними исследователями.'],
    en:['Chapter 3. The Forgotten Lab','An abandoned wing of the lab opens up. Rare creatures left by earlier researchers live here.'] },
  { need:8, icon:'🌌',
    ru:['Глава 4. Космическое измерение','Космо-Корова открыла портал! Ты попал в космос, где живут новые персонажи.'],
    en:['Chapter 4. Cosmic Dimension','Cosmo Cow opened a portal! You land in space, home to new characters.'] },
  { need:11, icon:'⚛️',
    ru:['Глава 5. Последний эксперимент','Ты нашёл последнее энергоядро. Профессор Бублиус создал этот эксперимент нарочно — чтобы открыть новую форму жизни. Тостер-Дракон — хранитель лаборатории!'],
    en:['Chapter 5. The Final Experiment','You found the last energy core. Professor Bublius planned it all to create a new life form. Toaster Dragon is the lab’s guardian!'] },
  { need:12, icon:'🥚',
    ru:['Финал','Лаборатория восстановлена! Но в последней сцене появляется загадочное яйцо с надписью «Скоро…». Продолжение следует!'],
    en:['Finale','The lab is restored! But in the last scene a mysterious egg appears marked “Coming Soon”. To be continued!'] }
];

/* ---------- состояние ---------- */
function freshState() {
  var b = []; for (var i = 0; i < CELLS; i++) b.push(0);
  return { coins: 15, board: b, buys: 0, clickLvl: 0, incLvl: 0, spawnLvl: 1,
           best: 1, chapterSeen: 0, boostUntil: 0, lastSeen: Date.now(), sound: true, merges: 0 };
}
var S = freshState();

/* ---------- Яндекс SDK (безопасная обёртка) ---------- */
var ysdk = null, player = null, adBusy = false, lastInterstitial = Date.now();

function initSDK(done) {
  if (typeof YaGames === 'undefined') { done(); return; }
  YaGames.init().then(function (sdk) {
    ysdk = sdk;
    try { var l = sdk.environment.i18n.lang; if (l && l.indexOf('ru') !== 0 && l !== 'be' && l !== 'kk' && l !== 'uk' && l !== 'uz') LANG = 'en'; } catch (e) {}
    return sdk.getPlayer({ scopes: false }).then(function (p) { player = p; }).catch(function () {});
  }).catch(function () {}).then(done);
}

function showRewarded(onReward) {
  if (adBusy) return;
  if (!ysdk) { onReward(); return; }              // локальный тест: просто даём награду
  adBusy = true; var rewarded = false;
  ysdk.adv.showRewardedVideo({ callbacks: {
    onOpen: function () { muted = true; },
    onRewarded: function () { rewarded = true; },
    onClose: function () { muted = false; adBusy = false; if (rewarded) onReward(); },
    onError: function () { muted = false; adBusy = false; toast(t('adFail')); }
  }});
}
function maybeInterstitial() {
  if (!ysdk || adBusy) return;
  if ((Date.now() - lastInterstitial) / 1000 < INTERSTITIAL_COOLDOWN) return;
  adBusy = true;
  ysdk.adv.showFullscreenAdv({ callbacks: {
    onOpen: function () { muted = true; },
    onClose: function () { muted = false; adBusy = false; lastInterstitial = Date.now(); },
    onError: function () { muted = false; adBusy = false; }
  }});
}

/* ---------- сохранение ---------- */
var saveTimer = 0;
function save() {
  S.lastSeen = Date.now();
  var json = JSON.stringify(S);
  try { localStorage.setItem(SAVE_KEY, json); } catch (e) {}
  if (player && !saveTimer) {
    saveTimer = setTimeout(function () {
      saveTimer = 0;
      try { player.setData({ save: json }); } catch (e) {}
    }, 5000);
  }
}
function applySave(obj) {
  if (!obj || !obj.board || obj.board.length !== CELLS) return;
  var f = freshState();
  for (var k in f) if (obj[k] === undefined) obj[k] = f[k];
  S = obj;
}
function load(done) {
  var local = null;
  try { local = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) {}
  if (player) {
    player.getData(['save']).then(function (d) {
      var cloud = null; try { cloud = JSON.parse(d.save); } catch (e) {}
      var pick = cloud && (!local || (cloud.lastSeen || 0) >= (local.lastSeen || 0)) ? cloud : local;
      applySave(pick); done();
    }).catch(function () { applySave(local); done(); });
  } else { applySave(local); done(); }
}

/* ---------- экономика ---------- */
function incomeOf(lv) { return Math.round(Math.pow(2.5, lv - 1)); }
function mult() {
  var m = Math.pow(1.5, S.incLvl);
  if (Date.now() < S.boostUntil) m *= 2;
  return m;
}
function perSec() {
  var s = 0; for (var i = 0; i < CELLS; i++) if (S.board[i]) s += incomeOf(S.board[i]);
  return s * mult();
}
function clickValue() { return (1 + 2 * S.clickLvl) + Math.floor(perSec() * 0.1); }
function buyCost() { return Math.floor(10 * Math.pow(1.12, S.buys) * Math.pow(2.2, S.spawnLvl - 1)); }
function clickUpCost() { return Math.floor(40 * Math.pow(1.7, S.clickLvl)); }
function incUpCost() { return Math.floor(300 * Math.pow(4, S.incLvl)); }
var SPAWN_MAX = 5;
function spawnUpCost() { return Math.floor(2000 * Math.pow(8, S.spawnLvl - 1)); }

function fmt(n) {
  n = Math.floor(n);
  if (n < 1000) return String(n);
  var u = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];
  var i = Math.min(u.length - 1, Math.floor(Math.log(n) / Math.log(1000)));
  var v = n / Math.pow(1000, i);
  return (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)) + u[i];
}

/* ---------- звук ---------- */
var muted = false, actx = null;
function beep(freq, dur, type, vol) {
  if (!S.sound || muted) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    var o = actx.createOscillator(), g = actx.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.value = vol || 0.06;
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + dur);
  } catch (e) {}
}
function sfxMerge(lv) { beep(300 + lv * 55, 0.18, 'triangle', 0.08); setTimeout(function () { beep(450 + lv * 60, 0.18, 'triangle', 0.07); }, 80); }
function sfxClick() { beep(520, 0.07, 'square', 0.03); }
function sfxBuy() { beep(380, 0.1, 'sine', 0.07); }

/* ---------- DOM ---------- */
var $ = function (id) { return document.getElementById(id); };
var boardEl = $('board'), cells = [];

function monName(lv) { var m = MONS[lv - 1]; return LANG === 'ru' ? m[2] : m[3]; }
function monHTML(lv, withLv) {
  var m = MONS[lv - 1];
  var h = '<div class="mon ' + m[4] + '"><span class="main">' + m[0] + '</span><span class="side">' + m[1] + '</span>';
  if (USE_IMAGES) h += '<img src="assets/characters/' + lv + '.png" alt="" onerror="this.remove()">';
  if (withLv !== false) h += '<span class="lv">' + lv + '</span>';
  return h + '</div>';
}

function buildBoard() {
  boardEl.innerHTML = '';
  cells = [];
  for (var i = 0; i < CELLS; i++) {
    var c = document.createElement('div');
    c.className = 'cell'; c.dataset.i = i;
    boardEl.appendChild(c); cells.push(c);
  }
}
function renderBoard() {
  for (var i = 0; i < CELLS; i++) {
    var lv = S.board[i], c = cells[i];
    c.className = 'cell' + (lv ? '' : ' empty') + (sel === i ? ' sel' : '');
    c.innerHTML = lv ? monHTML(lv) : '';
  }
}
function renderStats() {
  $('coins').textContent = fmt(S.coins);
  $('rate').textContent = '+' + fmt(perSec());
  $('buyCost').textContent = fmt(buyCost());
  $('collectVal').textContent = fmt(clickValue());
  $('btnBuy').disabled = false;
  $('boostTag').hidden = Date.now() >= S.boostUntil;
  $('btnSound').textContent = S.sound ? '🔊' : '🔇';
}
function renderTexts() {
  document.documentElement.lang = LANG;
  $('rateLabel').textContent = t('perSec');
  $('buyText').textContent = t('buy');
  $('collectText').textContent = t('collect');
  $('hint').textContent = t('hint');
  var tabs = document.querySelectorAll('[data-t]');
  for (var i = 0; i < tabs.length; i++) tabs[i].textContent = t(tabs[i].getAttribute('data-t'));
}

var toastTimer = 0;
function toast(msg) {
  var el = $('toast'); el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.hidden = true; }, 1800);
}
function floater(text, x, y) {
  var d = document.createElement('div'); d.className = 'fl'; d.textContent = text;
  d.style.left = (x - 20) + 'px'; d.style.top = (y - 20) + 'px';
  $('floaters').appendChild(d); setTimeout(function () { d.remove(); }, 900);
}

/* ---------- игровые действия ---------- */
var sel = -1;

function buy() {
  var cost = buyCost();
  var free = S.board.indexOf(0);
  if (free < 0) { toast(t('full')); return; }
  if (S.coins < cost) { toast(t('noCoins')); return; }
  S.coins -= cost; S.buys++;
  S.board[free] = S.spawnLvl;
  sfxBuy(); checkBest(S.spawnLvl);
  renderBoard(); cells[free].classList.add('pop'); renderStats(); save();
}

function collect(ev) {
  var v = clickValue();
  S.coins += v; sfxClick();
  var r = $('btnCollect').getBoundingClientRect();
  floater('+' + fmt(v), r.left + r.width / 2 + (Math.random() * 40 - 20), r.top);
  renderStats();
}

function tryMove(from, to) {
  if (from === to || from < 0 || to < 0 || !S.board[from]) return;
  var a = S.board[from], b = S.board[to];
  if (b === 0) { S.board[to] = a; S.board[from] = 0; }
  else if (a === b && a < MAXLV) {
    S.board[to] = a + 1; S.board[from] = 0; S.merges++;
    sfxMerge(a + 1);
    checkBest(a + 1);
    renderBoard(); cells[to].classList.add('pop'); renderStats(); save();
    return;
  } else { // обмен местами
    S.board[to] = a; S.board[from] = b;
  }
  renderBoard(); save();
}

function checkBest(lv) {
  if (lv > S.best) S.best = lv;
  for (var i = S.chapterSeen; i < CHAPTERS.length; i++) {
    if (S.best >= CHAPTERS[i].need) { S.chapterSeen = i + 1; showChapter(i); break; }
  }
}

/* ---------- ввод: перетаскивание и тап ---------- */
var drag = null;
boardEl.addEventListener('pointerdown', function (e) {
  var cell = e.target.closest('.cell'); if (!cell) return;
  var i = +cell.dataset.i;
  if (!S.board[i]) { if (sel >= 0) { tryMove(sel, i); sel = -1; renderBoard(); } return; }
  drag = { from: i, x: e.clientX, y: e.clientY, moved: false, ghost: null, hot: -1 };
  boardEl.setPointerCapture && boardEl.setPointerCapture(e.pointerId);
  e.preventDefault();
});
boardEl.addEventListener('pointermove', function (e) {
  if (!drag) return;
  if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 8) {
    drag.moved = true;
    var g = document.createElement('div'); g.className = 'ghost';
    g.innerHTML = monHTML(S.board[drag.from], false);
    document.body.appendChild(g); drag.ghost = g;
    cells[drag.from].style.opacity = .35;
  }
  if (drag.moved) {
    drag.ghost.style.left = e.clientX + 'px'; drag.ghost.style.top = e.clientY + 'px';
    var el = document.elementFromPoint(e.clientX, e.clientY);
    var c = el && el.closest ? el.closest('.cell') : null;
    var h = c ? +c.dataset.i : -1;
    if (h !== drag.hot) {
      if (drag.hot >= 0) cells[drag.hot].classList.remove('hot');
      if (h >= 0 && h !== drag.from) cells[h].classList.add('hot');
      drag.hot = h;
    }
  }
});
function endDrag(e) {
  if (!drag) return;
  var d = drag; drag = null;
  if (d.ghost) d.ghost.remove();
  cells[d.from].style.opacity = '';
  if (d.hot >= 0) cells[d.hot].classList.remove('hot');
  if (d.moved) {
    var el = document.elementFromPoint(e.clientX, e.clientY);
    var c = el && el.closest ? el.closest('.cell') : null;
    sel = -1;
    if (c) tryMove(d.from, +c.dataset.i); else renderBoard();
  } else { // тап: выбрать / объединить с выбранным
    if (sel < 0) sel = d.from;
    else if (sel === d.from) sel = -1;
    else { var f = sel; sel = -1; tryMove(f, d.from); return; }
    renderBoard();
  }
}
boardEl.addEventListener('pointerup', endDrag);
boardEl.addEventListener('pointercancel', endDrag);
document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

/* ---------- окна ---------- */
var modal = $('modal'), modalBody = $('modalBody'), modalCb = null;
function openModal(html, onClose) {
  modalBody.innerHTML = html; modal.hidden = false; modalCb = onClose || null;
  modal.scrollTop = 0;
}
function closeModal() {
  modal.hidden = true; modalBody.innerHTML = '';
  var cb = modalCb; modalCb = null; if (cb) cb();
}
$('modalClose').onclick = closeModal;
modal.addEventListener('pointerdown', function (e) { if (e.target === modal) closeModal(); });

function showChapter(i) {
  var c = CHAPTERS[i], tx = c[LANG] || c.ru;
  var html = '<div class="bigicon">' + c.icon + '</div><h2>' + tx[0] + '</h2><p>' + tx[1] + '</p>' +
    '<div class="btnrow"><button class="btn" id="chapOk">' + t('cont') + '</button></div>';
  setTimeout(function () {
    openModal(html, maybeInterstitial);
    $('chapOk').onclick = closeModal;
  }, 350);
}

function showUpgrades() {
  function row(icon, name, desc, lvlTxt, cost, id, maxed) {
    return '<div class="up"><div class="ic">' + icon + '</div><div class="tx"><b>' + name + ' · ' + lvlTxt + '</b><span>' + desc + '</span></div>' +
      '<button id="' + id + '"' + (maxed || S.coins < cost ? ' disabled' : '') + '>' + (maxed ? t('max') : '🪙 ' + fmt(cost)) + '</button></div>';
  }
  var html = '<h2>' + t('upgrades') + '</h2>' +
    row('👆', t('upClick'), t('upClickD'), t('lvl') + ' ' + (S.clickLvl + 1), clickUpCost(), 'upC', false) +
    row('⚛️', t('upInc'), t('upIncD'), t('lvl') + ' ' + (S.incLvl + 1), incUpCost(), 'upI', false) +
    row('🧪', t('upSpawn'), t('upSpawnD'), t('lvl') + ' ' + S.spawnLvl, spawnUpCost(), 'upS', S.spawnLvl >= SPAWN_MAX) +
    '<h3 class="sec">' + t('bonus') + '</h3><div class="btnrow">' +
    '<button class="btn alt" id="adB">' + t('adBoost') + '</button>' +
    '<button class="btn alt" id="adC">' + t('adCoins') + '</button></div>';
  openModal(html);
  function bind(id, cost, fn) {
    var b = $(id); if (!b) return;
    b.onclick = function () { if (S.coins < cost) { toast(t('noCoins')); return; } S.coins -= cost; fn(); sfxBuy(); renderStats(); save(); showUpgrades(); };
  }
  bind('upC', clickUpCost(), function () { S.clickLvl++; });
  bind('upI', incUpCost(), function () { S.incLvl++; });
  if (S.spawnLvl < SPAWN_MAX) bind('upS', spawnUpCost(), function () { S.spawnLvl++; });
  $('adB').onclick = function () {
    showRewarded(function () { S.boostUntil = Math.max(Date.now(), S.boostUntil) + 60000; renderStats(); save(); toast(t('boostOn')); });
  };
  $('adC').onclick = function () {
    showRewarded(function () { S.coins += Math.max(200, Math.floor(perSec() * 120)); renderStats(); save(); toast(t('gotCoins')); });
  };
}

function showCollection() {
  var h = '<h2>' + t('coll') + ' · ' + S.best + '/' + MAXLV + '</h2><div class="grid">';
  for (var i = 1; i <= MAXLV; i++) {
    var open = i <= S.best;
    h += '<div class="card' + (open ? '' : ' lock') + '">' + monHTML(i, false) +
      '<b>' + (open ? monName(i) : '???') + '</b><span>' + (open ? t('rar')[i - 1] : t('locked')) + '</span></div>';
  }
  openModal(h + '</div>');
}

function showStory() {
  var h = '<h2>' + t('storyT') + '</h2>';
  for (var i = 0; i < CHAPTERS.length; i++) {
    var c = CHAPTERS[i], tx = c[LANG] || c.ru, open = i < S.chapterSeen;
    h += '<div class="chap' + (open ? '' : ' lock') + '"><b>' + c.icon + ' ' + (open ? tx[0] : t('locked')) + '</b>' +
      (open ? '<p>' + tx[1] + '</p>' : '') + '</div>';
  }
  openModal(h);
}

/* ---------- запуск ---------- */
var lastTick = Date.now(), uiTimer = 0;
function tick() {
  var now = Date.now(), dt = Math.min(1, (now - lastTick) / 1000);
  lastTick = now;
  S.coins += perSec() * dt;
  renderStats();
  if (!modal.hidden && $('upC')) { // обновляем доступность кнопок улучшений
    $('upC').disabled = S.coins < clickUpCost();
    $('upI').disabled = S.coins < incUpCost();
    if ($('upS')) $('upS').disabled = S.spawnLvl >= SPAWN_MAX || S.coins < spawnUpCost();
  }
  uiTimer++; if (uiTimer % 50 === 0) save();
}

function start() {
  renderTexts();
  buildBoard();
  // доход за время отсутствия (до 2 часов, 50%)
  var away = Math.min(7200, (Date.now() - S.lastSeen) / 1000);
  if (away > 60) {
    var gain = Math.floor(perSec() * away * 0.5);
    if (gain > 0) { S.coins += gain; setTimeout(function () { toast(t('offline') + ' ' + fmt(gain)); }, 600); }
  }
  lastTick = Date.now();
  renderBoard(); renderStats();

  $('btnBuy').onclick = buy;
  $('btnCollect').onclick = collect;
  $('btnSound').onclick = function () { S.sound = !S.sound; renderStats(); save(); };
  var tabs = document.querySelectorAll('[data-open]');
  for (var i = 0; i < tabs.length; i++) tabs[i].onclick = function () {
    var w = this.getAttribute('data-open');
    if (w === 'upgrades') showUpgrades(); else if (w === 'collection') showCollection(); else showStory();
  };
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { muted = true; save(); } else { muted = false; lastTick = Date.now(); }
  });
  setInterval(tick, 100);

  if (S.chapterSeen === 0) checkBest(1); // стартовая глава

  if (ysdk && ysdk.features && ysdk.features.LoadingAPI) { try { ysdk.features.LoadingAPI.ready(); } catch (e) {} }
}

initSDK(function () { load(start); });

})();
