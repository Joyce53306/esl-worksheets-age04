/* ============================================================
   Shared helpers
============================================================ */
function parseList(text){
  return text.split(/[\n,]/).map(s=>s.trim()).filter(Boolean);
}
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function esc(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function wsHeader(title, sub){
  return `
    <div class="ws-title">${esc(title)}</div>
    <div class="ws-sub">${esc(sub)}</div>
    <div class="ws-name-line">Name: <span class="blank"></span> Date: <span class="blank" style="width:100px"></span></div>
  `;
}
function practiceLine(guideText){
  return `
    <div class="practice-line">
      <span class="guide-text">${esc(guideText)}</span>
    </div>
  `;
}
function shell(controlsHTML, previewLabel){
  return `
    <div class="panel active">
      <div class="controls">${controlsHTML}</div>
      <div class="preview-wrap">
        <div class="preview-toolbar">
          <span class="name">${esc(previewLabel)}</span>
          <div>
            <button class="gen-btn print-btn" style="display:inline-block;width:auto;padding:8px 16px;margin:0" onclick="window.print()">🖨️ 列印</button>
          </div>
        </div>
        <div class="worksheet" id="preview"><div class="empty-state">填好左邊欄位，按「產生」即可預覽</div></div>
      </div>
    </div>
  `;
}

const practiceLineCSS = `
.practice-line{ position:relative; height:40px; margin-bottom:12px; }
.practice-line::before{ content:''; position:absolute; top:0; left:0; right:0; border-top:1px solid #d8cdb4; }
.practice-line::after{ content:''; position:absolute; bottom:8px; left:0; right:0; border-top:1.5px solid #a89b78; }
.practice-line .mid-line{ position:absolute; top:50%; left:0; right:0; border-top:1px dashed #e3d9bc; }
.practice-line .guide-text{ position:absolute; bottom:5px; left:2px; font-family:'Patrick Hand',cursive; font-size:26px;
  color:transparent; -webkit-text-stroke:1px #c9bfa3; letter-spacing:2px; line-height:1; }
`;
(function injectCSS(){
  const style = document.createElement('style');
  style.textContent = practiceLineCSS + `
    .word-card{ break-inside:avoid; margin-bottom:22px; }
    .word-card .label{ font-family:'Baloo 2',sans-serif; font-weight:700; font-size:16px; margin-bottom:6px; }
    .tracing-grid{ display:grid; gap:22px 28px; }
    .match-cols{ display:flex; gap:60px; margin-top:10px; }
    .match-col{ flex:1; list-style:none; padding:0; margin:0; }
    .match-col li{ display:flex; align-items:center; gap:8px; height:40px; font-size:20px; font-family:'Patrick Hand',cursive; }
    .match-col.left li{ justify-content:flex-start; }
    .match-col.right li{ justify-content:flex-end; }
    .dot{ width:10px; height:10px; border-radius:50%; background:var(--teal); flex:0 0 auto; }
    .circle-row{ display:flex; flex-wrap:wrap; gap:14px 18px; margin:10px 0 20px; }
    .circle-row span{ font-family:'Patrick Hand',cursive; font-size:22px; padding:2px 10px; border:2px solid transparent; border-radius:8px; }
    .wordbank{ background:var(--teal-light); border-radius:10px; padding:10px 14px; margin-bottom:18px; font-size:14px; }
    .wordbank b{ font-family:'Baloo 2',sans-serif; }
    .sentence-row{ font-size:17px; margin-bottom:14px; display:flex; align-items:baseline; gap:6px; }
    .sentence-row .blankline{ display:inline-block; min-width:110px; border-bottom:1.5px dashed #a89b78; height:20px; }
    table.wordsearch{ border-collapse:collapse; margin:10px 0; }
    table.wordsearch td{ width:26px; height:26px; text-align:center; font-family:'Courier New',monospace; font-weight:700;
      font-size:15px; border:1px solid #eee1c9; }
    .found-list{ display:flex; flex-wrap:wrap; gap:8px 16px; margin-top:14px; font-size:14px; }
    .found-list span{ background:var(--sun-light); padding:3px 10px; border-radius:999px; font-weight:700; }

    /* bingo */
    .bingo-cards{ display:flex; flex-wrap:wrap; gap:24px; }
    .bingo-card{ border:2px solid var(--ink); border-radius:6px; overflow:hidden; break-inside:avoid; }
    .bingo-card .bingo-title{ background:var(--teal); color:#fff; text-align:center; font-family:'Baloo 2',sans-serif;
      font-weight:800; letter-spacing:4px; padding:6px 0; font-size:15px; }
    .bingo-card table{ border-collapse:collapse; }
    .bingo-card td{ width:66px; height:56px; border:1px solid var(--ink); text-align:center; font-size:12px;
      padding:2px; font-family:'Noto Sans TC',sans-serif; vertical-align:middle; }
    .bingo-card td.free{ background:var(--sun-light); font-weight:700; font-family:'Baloo 2',sans-serif; }

    /* memory match */
    .memory-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
    .memory-card{ border:2px dashed #c9bfa3; border-radius:10px; height:90px; display:flex; align-items:center;
      justify-content:center; font-size:16px; font-family:'Baloo 2',sans-serif; font-weight:700; text-align:center;
      break-inside:avoid; }
    .memory-card.emoji-face{ font-size:40px; font-family:inherit; }

    /* dice net */
    .dice-net{ display:grid; grid-template-columns:repeat(4, 84px); grid-template-rows:repeat(3, 84px); gap:0; margin:20px 0; }
    .dice-face{ border:1.5px dashed #a89b78; display:flex; align-items:center; justify-content:center;
      flex-direction:column; font-size:13px; text-align:center; padding:4px; }
    .dice-face .emoji{ font-size:26px; }

    /* board game path */
    .board-row{ display:flex; }
    .board-row.reverse{ flex-direction:row-reverse; }
    .board-cell{ width:78px; height:78px; border:2px solid var(--ink); display:flex; flex-direction:column;
      align-items:center; justify-content:center; font-size:11px; text-align:center; margin:-1px; background:#fff; }
    .board-cell .num{ font-family:'Baloo 2',sans-serif; font-weight:800; font-size:11px; color:var(--coral); }
    .board-cell.start{ background:var(--teal-light); }
    .board-cell.finish{ background:var(--coral-light); }

    /* picture match / phonics choice rows */
    .choice-row{ display:flex; align-items:center; gap:18px; margin-bottom:20px; break-inside:avoid; }
    .choice-row .big-emoji{ font-size:44px; width:60px; text-align:center; flex:0 0 auto; }
    .choice-row .choices{ display:flex; gap:16px; }
    .choice-row .choices span{ font-family:'Patrick Hand',cursive; font-size:20px; border:2px solid var(--line);
      border-radius:8px; padding:4px 14px; }

    /* sorting worksheet */
    .sort-bank{ display:flex; flex-wrap:wrap; gap:10px 16px; background:var(--teal-light); border-radius:10px;
      padding:12px 16px; margin-bottom:20px; }
    .sort-bank span{ font-family:'Baloo 2',sans-serif; font-weight:700; font-size:14px; }
    .sort-cols{ display:flex; gap:24px; }
    .sort-col{ flex:1; border:2px solid var(--ink); border-radius:10px; min-height:220px; padding:10px; }
    .sort-col .cat-title{ font-family:'Baloo 2',sans-serif; font-weight:800; text-align:center; margin-bottom:10px;
      background:var(--sun-light); border-radius:6px; padding:6px; }

    /* coloring worksheet */
    .coloring-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
    .coloring-cell{ text-align:center; break-inside:avoid; }
    .coloring-cell .label{ font-family:'Baloo 2',sans-serif; font-weight:700; margin-top:6px; font-size:14px; }

    /* picture-picture matching (no reading required) */
    .picpic-cols{ display:flex; gap:80px; margin-top:14px; }
    .picpic-col{ list-style:none; padding:0; margin:0; }
    .picpic-col li{ display:flex; align-items:center; gap:10px; height:64px; font-size:40px; }
    .picpic-col.right li{ justify-content:flex-end; }

    /* counting worksheet */
    .counting-row{ display:flex; align-items:center; gap:22px; margin-bottom:24px; break-inside:avoid; }
    .counting-row .emoji-group{ font-size:30px; letter-spacing:4px; flex:1; }
    .counting-row .num-box{ width:56px; height:56px; border:2.5px solid var(--ink); border-radius:10px;
      display:flex; align-items:center; justify-content:center; font-family:'Baloo 2',sans-serif; font-size:14px; color:#ccc; flex:0 0 auto; }
    .counting-row .word-label{ font-family:'Baloo 2',sans-serif; font-weight:700; font-size:16px; flex:0 0 auto; min-width:90px; }

    /* odd one out */
    .circle-row.big span{ font-size:32px; padding:6px 10px; }

    /* full alphabet tracing */
    .abc-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:18px 24px; }

    @media print{
      .word-card, .sentence-row, table.wordsearch, .circle-row, .bingo-card, .memory-card, .board-row,
      .choice-row, .sort-cols, .coloring-cell, .picpic-cols, .counting-row, .abc-grid{ break-inside: avoid; }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   Router
============================================================ */
function renderTab(name){
  const main = document.getElementById('main');
  main.innerHTML = TABS[name].html;
  TABS[name].init();
}

const TABS = {};

/* ============================================================
   15. 圖片配對 (Picture-Picture Match — no reading required)
============================================================ */
TABS.picpic = {
  html: shell(`
    <h2>圖片配對（看圖找一樣）</h2>
    <div class="desc">完全不需要認字，純圖案配對，適合 4 歲剛開始的孩子。格式：單字:emoji（單字只用於老師參考，孩子只看圖）</div>
    <label>單字清單</label>
    <textarea id="pp-words">apple:🍎
banana:🍌
cat:🐱
dog:🐶
fish:🐟
egg:🥚</textarea>
    <button class="gen-btn" onclick="genPicPic()">產生圖片配對練習單</button>
  `, "圖片配對（看圖找一樣）"),
  init(){}
};
function genPicPic(){
  const raw = parseList(document.getElementById('pp-words').value);
  if(!raw.length) return;
  const icons = raw.map(r=>{ const parts = r.split(':'); return parts[1] || '❓'; });
  const left = shuffle(icons);
  const right = shuffle(icons);
  const leftLi = left.map(e=>`<li><span class="dot"></span>${esc(e)}</li>`).join('');
  const rightLi = right.map(e=>`<li>${esc(e)}<span class="dot"></span></li>`).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('圖片配對', 'Draw a line to match the same pictures')}
    <div class="picpic-cols">
      <ul class="picpic-col left">${leftLi}</ul>
      <ul class="picpic-col right">${rightLi}</ul>
    </div>
  `;
}

/* ============================================================
   16. 數字與單字練習 (Counting & Vocabulary)
============================================================ */
TABS.counting = {
  html: shell(`
    <h2>數字與單字練習</h2>
    <div class="desc">格式：單字:emoji:數量，例如 apple:🍎:3。孩子數一數圖案、描寫數字，並認識單字</div>
    <label>單字清單</label>
    <textarea id="ct-words">apple:🍎:3
banana:🍌:5
cat:🐱:2
dog:🐶:4</textarea>
    <button class="gen-btn" onclick="genCounting()">產生數字與單字練習單</button>
  `, "數字與單字練習"),
  init(){}
};
function genCounting(){
  const raw = parseList(document.getElementById('ct-words').value);
  if(!raw.length) return;
  const rows = raw.map(r=>{
    const parts = r.split(':');
    const word = parts[0], icon = parts[1], countStr = parts[2];
    const count = Math.max(1, Math.min(10, parseInt(countStr)||1));
    const group = (icon||'⬤').repeat(count);
    return `<div class="counting-row">
      <div class="emoji-group">${esc(group)}</div>
      <div class="num-box">${count}</div>
      <div class="word-label">${esc(word)}</div>
    </div>`;
  }).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('數字與單字練習', 'Count the pictures, trace the number, learn the word')}
    ${rows}
  `;
}
/* ============================================================
   14. 著色學習單 (Color Word Coloring Sheet)
============================================================ */
const SHAPE_PATHS = {
  circle: '<circle cx="50" cy="50" r="42" />',
  star: '<polygon points="50,6 61,38 95,38 68,59 78,92 50,72 22,92 32,59 5,38 39,38" />',
  heart: '<path d="M50 88 C10 60 5 30 25 15 C40 4 50 15 50 25 C50 15 60 4 75 15 C95 30 90 60 50 88 Z" />',
  square: '<rect x="10" y="10" width="80" height="80" rx="10"/>'
};
TABS.coloring = {
  html: shell(`
    <h2>著色學習單</h2>
    <div class="desc">格式：顏色單字:形狀（circle/star/heart/square），例如 red:star。孩子依照單字把形狀塗上該顏色</div>
    <label>顏色清單</label>
    <textarea id="co-words">red:circle
blue:star
yellow:heart
green:square
purple:circle
orange:star</textarea>
    <button class="gen-btn" onclick="genColoring()">產生著色學習單</button>
  `, "著色學習單"),
  init(){}
};
function genColoring(){
  const raw = parseList(document.getElementById('co-words').value);
  if(!raw.length) return;
  const cells = raw.map(r=>{
    const [color, shape] = r.split(':');
    const path = SHAPE_PATHS[(shape||'circle').trim()] || SHAPE_PATHS.circle;
    return `<div class="coloring-cell">
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="${'#33312C'}" stroke-width="2.5">${path}</svg>
      <div class="label">${esc(color)}</div>
    </div>`;
  }).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('著色學習單', 'Color each shape with the correct color')}
    <div class="coloring-grid">${cells}</div>
  `;
}

/* ============================================================
   1. 單字描寫練習單 (Word Tracing)
============================================================ */
TABS.tracing = {
  html: shell(`
    <h2>單字描寫練習單</h2>
    <div class="desc">每行一個單字，可加冒號加上一個 emoji 圖示，例如：apple:🍎</div>
    <label>單字清單</label>
    <textarea id="t-words" placeholder="apple:🍎&#10;banana:🍌&#10;cat:🐱">apple:🍎
banana:🍌
cat:🐱
dog:🐶</textarea>
    <label>每個單字描寫幾行</label>
    <input type="number" id="t-repeat" value="3" min="1" max="6">
    <label>每列排幾個單字卡</label>
    <select id="t-cols"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option></select>
    <button class="gen-btn" onclick="genTracing()">產生描寫練習單</button>
  `, "單字描寫練習單"),
  init(){}
};
function genTracing(){
  const words = parseList(document.getElementById('t-words').value);
  const repeat = parseInt(document.getElementById('t-repeat').value) || 3;
  const cols = document.getElementById('t-cols').value;
  if(!words.length){ return; }
  let cards = words.map(w=>{
    const [word, icon] = w.split(':');
    let lines = '';
    for(let i=0;i<repeat;i++) lines += practiceLine(word);
    return `<div class="word-card"><div class="label">${icon ? esc(icon)+' ' : ''}${esc(word)}</div>${lines}</div>`;
  }).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('單字描寫練習單', 'Word Tracing Practice')}
    <div class="tracing-grid" style="grid-template-columns:repeat(${cols},1fr)">${cards}</div>
  `;
}

/* ============================================================
   12. 分類練習單 (Sorting)
============================================================ */
TABS.sorting = {
  html: shell(`
    <h2>分類練習單</h2>
    <div class="desc">格式：單字:emoji。分別填兩個類別各自的單字，系統會把全部打散成單字庫</div>
    <label>類別 A 名稱</label>
    <input type="text" id="so-cat-a" value="Animals 動物">
    <label>類別 A 單字</label>
    <textarea id="so-words-a">cat:🐱
dog:🐶
fish:🐟</textarea>
    <label>類別 B 名稱</label>
    <input type="text" id="so-cat-b" value="Fruits 水果">
    <label>類別 B 單字</label>
    <textarea id="so-words-b">apple:🍎
banana:🍌
grape:🍇</textarea>
    <button class="gen-btn" onclick="genSorting()">產生分類練習單</button>
  `, "分類練習單"),
  init(){}
};
function genSorting(){
  const catA = document.getElementById('so-cat-a').value.trim() || 'Category A';
  const catB = document.getElementById('so-cat-b').value.trim() || 'Category B';
  const wordsA = parseList(document.getElementById('so-words-a').value);
  const wordsB = parseList(document.getElementById('so-words-b').value);
  if(!wordsA.length || !wordsB.length) return;
  const all = shuffle([...wordsA, ...wordsB]).map(r=>{ const [w,i]=r.split(':'); return `<span>${i?esc(i)+' ':''}${esc(w)}</span>`; }).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('分類練習單', 'Cut or copy each word into the correct box')}
    <div class="sort-bank">${all}</div>
    <div class="sort-cols">
      <div class="sort-col"><div class="cat-title">${esc(catA)}</div></div>
      <div class="sort-col"><div class="cat-title">${esc(catB)}</div></div>
    </div>
  `;
}


/* ============================================================
   17. 找不同 (Odd One Out)
============================================================ */
TABS.oddone = {
  html: shell(`
    <h2>找不同</h2>
    <div class="desc">格式：多數:少數，例如 cat:dog，會產生一排大多是貓、混入一隻狗讓孩子圈出來</div>
    <label>題目清單（每行一題）</label>
    <textarea id="oo-words">🍎:🍌
🐱:🐶
⭐:🌙
🚗:🚌</textarea>
    <label>每排幾個圖案</label>
    <input type="number" id="oo-count" value="6" min="4" max="10">
    <button class="gen-btn" onclick="genOddOne()">產生找不同練習單</button>
  `, "找不同"),
  init(){}
};
function genOddOne(){
  const raw = parseList(document.getElementById('oo-words').value);
  const count = Math.max(4, Math.min(10, parseInt(document.getElementById('oo-count').value)||6));
  if(!raw.length) return;
  const rows = raw.map((r,idx)=>{
    const parts = r.split(':');
    const majority = parts[0], minority = parts[1] || '❓';
    let tokens = [];
    for(let i=0;i<count-1;i++) tokens.push(majority);
    tokens.push(minority);
    tokens = shuffle(tokens);
    return `<div class="circle-row big">${(idx+1)}. ${tokens.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`;
  }).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('找不同', 'Circle the one that is different')}
    ${rows}
  `;
}

/* ============================================================
   18. 完整 ABC 字母描寫 (Full Alphabet Tracing)
============================================================ */
TABS.abctrace = {
  html: shell(`
    <h2>完整 ABC 字母描寫</h2>
    <div class="desc">產生 A-Z 全部 26 個字母（大寫＋小寫）描寫格，不需要輸入單字</div>
    <label>範圍</label>
    <select id="ab-range">
      <option value="A-M">A - M</option>
      <option value="N-Z">N - Z</option>
      <option value="A-Z" selected>A - Z（全部 26 個）</option>
    </select>
    <label>每個字母描寫幾行</label>
    <input type="number" id="ab-repeat" value="2" min="1" max="4">
    <button class="gen-btn" onclick="genAbcTrace()">產生 ABC 描寫練習單</button>
  `, "完整 ABC 字母描寫"),
  init(){}
};
function genAbcTrace(){
  const range = document.getElementById('ab-range').value;
  const repeat = parseInt(document.getElementById('ab-repeat').value) || 2;
  const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let letters = AZ.split('');
  if(range==='A-M') letters = letters.slice(0,13);
  if(range==='N-Z') letters = letters.slice(13);
  const cards = letters.map(L=>{
    const pair = L + L.toLowerCase();
    let lines = '';
    for(let i=0;i<repeat;i++) lines += practiceLine(pair);
    return `<div class="word-card"><div class="label">${esc(pair)}</div>${lines}</div>`;
  }).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('完整 ABC 字母描寫', `Alphabet Tracing ${esc(range)}`)}
    <div class="abc-grid">${cards}</div>
  `;
}

/* ============================================================
   19. 情緒單字配對 (Emotions Matching)
============================================================ */
TABS.emotion = {
  html: shell(`
    <h2>情緒單字配對</h2>
    <div class="desc">格式：單字:emoji，畫線連連看，把表情跟情緒單字配對</div>
    <label>情緒清單</label>
    <textarea id="em-words">happy:😊
sad:😢
angry:😠
scared:😱
surprised:😲</textarea>
    <button class="gen-btn" onclick="genEmotion()">產生情緒配對練習單</button>
  `, "情緒單字配對"),
  init(){}
};
function genEmotion(){
  const raw = parseList(document.getElementById('em-words').value);
  if(!raw.length) return;
  const items = raw.map(r=>{ const p=r.split(':'); return {word:p[0], icon:p[1]||'❓'}; });
  const left = shuffle(items.map(i=>i.icon));
  const right = shuffle(items.map(i=>i.word));
  const leftLi = left.map(e=>`<li><span class="dot"></span>${esc(e)}</li>`).join('');
  const rightLi = right.map(w=>`<li>${esc(w)}<span class="dot"></span></li>`).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('情緒單字配對', 'Match the face to the feeling word')}
    <div class="picpic-cols">
      <ul class="picpic-col left" style="font-size:20px;">${leftLi}</ul>
      <ul class="match-col right" style="font-family:'Patrick Hand',cursive;font-size:20px;">${rightLi}</ul>
    </div>
  `;
}

/* ============================================================
   20. 反義詞配對 (Opposites Matching)
============================================================ */
TABS.opposite = {
  html: shell(`
    <h2>反義詞配對</h2>
    <div class="desc">格式：單字1:emoji1:單字2:emoji2，例如 big:🐘:small:🐭，畫線連連看配對相反詞</div>
    <label>反義詞組清單</label>
    <textarea id="op-words">big:🐘:small:🐭
hot:🔥:cold:❄️
fast:🐇:slow:🐢
happy:😊:sad:😢</textarea>
    <button class="gen-btn" onclick="genOpposite()">產生反義詞配對練習單</button>
  `, "反義詞配對"),
  init(){}
};
function genOpposite(){
  const raw = parseList(document.getElementById('op-words').value);
  if(!raw.length) return;
  const lefts = [], rights = [];
  raw.forEach(r=>{
    const p = r.split(':');
    lefts.push(`${p[1]||''} ${p[0]||''}`);
    rights.push(`${p[3]||''} ${p[2]||''}`);
  });
  const leftShuffled = shuffle(lefts);
  const rightShuffled = shuffle(rights);
  const leftLi = leftShuffled.map(t=>`<li><span class="dot"></span>${esc(t)}</li>`).join('');
  const rightLi = rightShuffled.map(t=>`<li>${esc(t)}<span class="dot"></span></li>`).join('');
  document.getElementById('preview').innerHTML = `
    ${wsHeader('反義詞配對', 'Match each word to its opposite')}
    <div class="picpic-cols">
      <ul class="picpic-col left" style="font-size:20px;">${leftLi}</ul>
      <ul class="picpic-col right" style="font-size:20px;">${rightLi}</ul>
    </div>
  `;
}
