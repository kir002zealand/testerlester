/* Alt lever i denne fane. Ingen netværk, cookies eller localStorage. */
'use strict';
const $ = (id) => document.getElementById(id);
const pick = (items) => items[Math.floor(Math.random() * items.length)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const eggs = new Set();
let toastTimer;
let certificate = '';
let queueNumber = 403;
let mash = 0;
let votes = 0;
let sealClicks = 0;
let mascotClicks = 0;
let typedKeys = '';
let konamiPosition = 0;
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
const hints = ['Tryk tre gange på det statslige segl.', 'Bent har fem prik mellem dig og et sammenbrud.', 'Skriv kartoffel på tastaturet, mens du ikke udfylder noget.', '↑ ↑ ↓ ↓ ← → ← → B A. Klassikeren.', 'Læs cookie-politikken i bunden. Den er kort.', 'Nattevagten ved noget. Kig i bunden.', '100 % mos åbner nye døre.', 'Knoldarkivet gemmer et meget klassificeret meme.'];
function toast(message) {
  clearTimeout(toastTimer);
  $('toast').textContent = message;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4800);
}
function reveal(id) { $(id).hidden = false; }
function discover(id, message) {
  if (eggs.has(id)) return;
  eggs.add(id);
  $('egg-count').textContent = `${eggs.size} / 8`;
  toast(`🥔 Hemmelighed fundet: ${message}`);
  if (eggs.size === 8) setTimeout(() => modal('Du er nu departementschef.', 'Alle otte hemmeligheder er gravet op. Din løn er én lun kartoffel og et meget fast håndtryk.'), 700);
}
function modal(title, message) {
  $('dialog-title').textContent = title;
  $('dialog-text').textContent = message;
  if (!$('dialog').open) $('dialog').showModal();
}
$('close-dialog').addEventListener('click', () => $('dialog').close());
$('dialog-ok').addEventListener('click', () => $('dialog').close());
$('dialog').addEventListener('click', (event) => { if (event.target === $('dialog')) { const r = $('dialog').getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) $('dialog').close(); } });

// Brug tekstindhold frem for innerHTML, så indtastet tekst aldrig bliver til kode.
$('license-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = $('alias').value.trim();
  if (!name) { $('alias').setCustomValidity('Et knoldnavn må ikke kun være luft.'); $('alias').reportValidity(); return; }
  const decision = pick(['GODKENDT. Du må nu bære én løs kartoffel i offentligheden.', 'BETINGET GODKENDT. Din kartoffel skal have cykelhjelm på.', 'AFVIST. Du udstråler ris. Prøv igen.', 'SAT I BERO. Din sagsbehandler er blevet til gratin.']);
  const number = `K-${Math.floor(100000 + Math.random() * 900000)}`;
  certificate = `DEN OFFICIELLE KARTOFFELMYNDIGHED\nSATIRE – INTET JURIDISK GYLDIGT BEVIS\n\nKnoldnavn: ${name}\nSagsnummer: ${number}\nForhold til sovs: ${$('relationship').value}\nAfgørelse: ${decision}\n\nUdstedt uden nogen som helst kompetence.`;
  $('license-result').textContent = `${name} · ${number}: ${decision}`;
  reveal('license-result'); reveal('download');
});
$('alias').addEventListener('input', () => $('alias').setCustomValidity(''));
$('download').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([certificate], {type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'kartoffellicens.txt';
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$('scan').addEventListener('click', () => {
  $('scan').disabled = true;
  $('scan').textContent = 'Beregner stivelse…';
  $('status').classList.add('scanning');
  setTimeout(() => {
    $('status-result').textContent = pick(['97 % kartoffel. De sidste 3 % er uafklaret sovs.', 'Du er en følelsesmæssigt utilgængelig bagekartoffel.', 'Ikke en kartoffel. Bare træt. Drik et glas vand.', 'Sjælden fund: En socialdemokratisk hasselback med impostor syndrome.', 'Du er kartoffel i ascendanten. Undgå airfryers i dag.']);
    reveal('status-result'); $('scan').disabled = false; $('scan').textContent = 'Undersøg mig igen ↻'; $('status').classList.remove('scanning');
  }, 900);
});
function report() { modal('Sag oprettet. Cirka.', 'Vi har sendt en civilklædt rodfrugt. Den mistænkte opfordres til at forholde sig i ro i en mørk, kølig skuffe.'); }
$('report').addEventListener('click', report);
$('report-safe').addEventListener('click', report);

// Kun mus får flygtende knapper. Touch, tastatur og reduceret bevægelse er rolige.
// Bevægelsen beregnes inden for knappens oprindelige beholder.
document.querySelectorAll('.runaway').forEach((button) => {
  let lastMove = 0;
  const container = button.parentElement;
  container.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || reducedMotion.matches || document.activeElement === button || Date.now() - lastMove < 350) return;
    const rect = button.getBoundingClientRect();
    if (Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2)) > 100) return;
    lastMove = Date.now();
    const maxX = Math.max(0, container.clientWidth - button.offsetWidth);
    const maxY = Math.max(0, container.clientHeight - button.offsetHeight);
    button.style.transform = '';
    const base = button.getBoundingClientRect();
    const parent = container.getBoundingClientRect();
    const x = Math.random() * maxX - (base.left - parent.left);
    const y = Math.random() * maxY - (base.top - parent.top);
    button.style.transform = `translate(${x}px, ${y}px)`;
  });
  button.addEventListener('focus', () => { button.style.transform = ''; });
  container.addEventListener('pointerleave', () => { button.style.transform = ''; });
});
window.addEventListener('resize', () => document.querySelectorAll('.runaway').forEach((b) => { b.style.transform = ''; }));

const warnings = [
  ['Midlertidigt forbud mod hurtigmos.', 'Det gik simpelthen for stærkt. Vi er en offentlig-lignende institution.'],
  ['Forhøjet knoldberedskab: beige.', 'En pose kartofler har raslet uden for normal åbningstid.'],
  ['En kartoffel har fået LinkedIn.', 'Den søger nye udfordringer i et dynamisk jordmiljø. Vi er bekymrede.'],
  ['Sovsebrud på linje 2.', 'Medbring egen ske. Beredskabet er på vej i hjemmesko.']
];
$('warning').addEventListener('click', () => {
  const warning = pick(warnings); $('warning-title').textContent = warning[0]; $('warning-text').textContent = warning[1];
  $('warning').textContent = 'Modtaget. Hvad er ellers galt? →';
});
$('queue').addEventListener('click', () => { queueNumber += 1; modal(`Du er nummer ${queueNumber}.`, `Vi betjener i øjeblikket nummer 2. Forventet ventetid: ${pick(['tre istider', 'indtil kartofler får knæ', 'en lang torsdag'])}. Du behøver ikke blive hængende.`); });
$('title').addEventListener('click', () => { $('mascot-title').textContent = `Bent · ${pick(['Seniorkonsulent i jordkontakt', 'Vicekonge af airfryeren', 'Head of Knold Experience', 'Midlertidig sovseattaché', 'Excel-ansvarlig, uden Excel'])}`; });
$('mash').addEventListener('click', () => {
  mash = Math.min(100, mash + 10); $('mash-meter').style.width = `${mash}%`;
  $('mash-result').textContent = mash < 100 ? `${mash} % mos. HR nikker anerkendende.` : '100 % mos. Din vrede er nu et tilbehør.';
  $('mash').textContent = mash === 100 ? '🍽️' : '🥔';
  if (mash === 100) { discover('mash', 'Terapi med tilbehør'); reveal('archive'); }
});
function vote(answer) { votes += 1; $('vote-result').textContent = `${votes} ${votes === 1 ? 'stemme' : 'stemmer'} i denne fane. Du sagde “${answer}”. Ministeriet konkluderer: sovs.`; }
$('vote-yes').addEventListener('click', () => vote('Ja, bror'));
$('vote-no').addEventListener('click', () => vote('Det er en pind'));
$('complain').addEventListener('click', () => {
  if (!$('complaint').value.trim()) { $('complaint-result').textContent = 'Din tavshed er noteret. Skriv lidt brok først.'; $('complaint').focus(); return; }
  $('complaint').value = ''; $('complaint-result').textContent = 'Klagen er komposteret lokalt. Intet blev sendt. Tak for dit bidrag til mulden.';
});

// De otte hemmeligheder. Alle kan findes uden en mus.
$('seal').addEventListener('click', () => {
  sealClicks += 1;
  if (sealClicks === 3) { reveal('archive'); discover('seal', 'Seglet var bare et klistermærke'); }
});
$('mascot').addEventListener('click', () => {
  mascotClicks += 1;
  if (mascotClicks === 5) { discover('bent', 'Bent har sagt op'); $('mascot-title').textContent = 'Bent · På stressorlov i en airfryer'; rain(); }
  else toast(pick(['Bent ønsker ikke at kommentere sagen.', 'Du prikker til den offentlige sektor.', 'Av. Det var min pensionsopsparing.']));
});
function potatoMode() {
  document.body.classList.add('potato-mode'); reveal('club'); discover('word', 'Den indre skræl');
  $('mode').textContent = 'Slå kartoffeltilstand fra'; $('mode').setAttribute('aria-pressed', 'true');
}
document.addEventListener('keydown', (event) => {
  if (event.target.closest('input,textarea,select,[contenteditable="true"]') || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key.length === 1) { typedKeys = (typedKeys + event.key.toLowerCase()).slice(-9); if (typedKeys === 'kartoffel') potatoMode(); }
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (key === konami[konamiPosition]) { konamiPosition += 1; }
  else { konamiPosition = key === konami[0] ? 1 : 0; }
  if (konamiPosition === konami.length) { konamiPosition = 0; discover('konami', 'Cheatkode til landbrugsstøtte'); rain(); reveal('archive'); }
});
$('mode').addEventListener('click', () => {
  const active = document.body.classList.toggle('potato-mode'); $('mode').setAttribute('aria-pressed', String(active));
  $('mode').textContent = `Slå kartoffeltilstand ${active ? 'fra' : 'til'}`;
});
$('footer-egg').addEventListener('click', () => { discover('cookies', 'Cookie-afdelingen findes ikke'); modal('Vi bruger 0 cookies.', 'Vi bruger heller ikke småkager. Budgettet gik til Bent. Der bliver ikke gemt noget, og din kartoffelstatus forsvinder, når siden genindlæses.'); });
$('night').addEventListener('click', () => {
  const active = document.body.classList.toggle('night'); $('night').textContent = active ? 'Dagvagt ☀' : 'Nattevagt ◐';
  discover('night', 'Nattevagten er en sød kartoffel');
});
$('archive-button').addEventListener('click', () => { reveal('meme'); discover('meme', 'Et meme med sikkerhedsgodkendelse'); });
let hintIndex = 0;
$('hint').addEventListener('click', () => {
  $('hint-text').textContent = hints[hintIndex];
  // Tredje hint giver også touchbrugere adgang til tastaturhemmeligheden.
  if (hintIndex === 2) { potatoMode(); $('hint-text').textContent += ' Mobil? Vi har aktiveret tilstanden for dig.'; }
  if (hintIndex === 3) { discover('konami', 'Mobil landbrugsstøtte'); rain(); reveal('archive'); }
  hintIndex = (hintIndex + 1) % hints.length;
});

// Begrænsede, lydløse overraskelser. Effekterne fjernes igen.
function rain() {
  for (let i = 0; i < (reducedMotion.matches ? 1 : 12); i += 1) {
    const potato = document.createElement('span'); potato.className = 'falling'; potato.textContent = '🥔';
    potato.style.left = `${5 + Math.random() * 85}%`; potato.style.animationDelay = `${Math.random() * .8}s`;
    $('effects').append(potato); setTimeout(() => potato.remove(), 4200);
  }
}
function randomPotatoEvent() {
  if (document.hidden || $('dialog').open) return;
  const event = Math.floor(Math.random() * 4);
  if (event === 0) rain();
  if (event === 1) toast('En kartoffel i dit område har accepteret alle vilkår uden at læse dem.');
  if (event === 2) $('queue').textContent = pick(['Stå i digital kø ↗', 'Vent professionelt ↗', 'Træk et nummer ↗']);
  if (event === 3) { $('mascot-title').textContent = 'Bent · Fungerende overkartoffel af 1. grad'; toast('Bent er blevet forfremmet. Igen.'); }
}
setInterval(randomPotatoEvent, 45000);
