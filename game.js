// ====================================================================
// Edit anything in this section freely to personalize the messages.
// ====================================================================
const NAMES = { me: 'Munnu', her: 'Pingu' };

// Fill these in from your EmailJS dashboard (Account > General for the public
// key; Email Services / Email Templates for the other two IDs). Leave any of
// them as-is to skip sending a notification.
const EMAILJS_CONFIG = {
  publicKey: '-gY4sdEFHROIn4jKJ',
  serviceId: 'service_9a7hyr5',
  templateId: 'template_w0qrj8p',
};

const POP_MESSAGES = [
  "You're too cute to stay mad \u{1F97A}",
  'Best friend loading... 100%',
  'Warning: extreme cuteness detected',
  `${NAMES.me} is typing an apology...`,
  'This bubble believes in second chances',
  'Anger levels: dropping ⬇️',
  'One pop closer to forgiveness',
];

const ACTIONS = {
  flower: { reactions: ['A flower for a flower \u{1F337}', 'Accept this bouquet of sorry', 'Fresh flowers, fresh start'] },
  joke: { reactions: ["Why don't scientists trust atoms? They make up everything!", "I'm bad at jokes but great at apologies", "Knock knock... it's me, being sorry"] },
  hug: { reactions: ['Virtual hug incoming!', '*squeeze*', 'Sending warmth your way'] },
  compliment: { reactions: ["You're the best part of my day", 'Your smile fixes everything', 'Anyone would be lucky to have you as a friend'] },
};

const MESSAGE_FRAGMENTS = [
  "I'm really sorry",
  'for whatever dumb thing I did —',
  'you deserve better,',
  'and I promise to annoy you',
  'in only the best ways from now on. \u{1F49B}',
];

const DIALOGUE = [
  {
    line: `${NAMES.me}: I know you're really upset with me right now...`,
    choices: [
      { text: "I'm sorry, I really messed up", points: 3 },
      { text: 'Can we talk about it?', points: 2 },
      { text: "I didn't mean to hurt you", points: 2 },
    ],
  },
  {
    line: `${NAMES.me}: I should've thought about how it'd make you feel.`,
    choices: [
      { text: "From now on I'll think before I act", points: 3 },
      { text: "I'll make it up to you, promise", points: 2 },
    ],
  },
  {
    line: `${NAMES.me}: You mean a lot to me, and I hate that I upset you.`,
    choices: [
      { text: 'You mean a lot to me too', points: 3 },
      { text: "Let's just move past this together", points: 2 },
    ],
  },
];

const ENDINGS = {
  love: {
    title: `${NAMES.her} forgives ${NAMES.me} (mostly) \u{1F970}`,
    message: "Thank you for actually listening. Saying sorry doesn't erase it, but I mean every word — you matter to me, always.",
    coupon: '\u{1F39F}️ Good for: 1 free hug, zero judgment, unlimited chai dates.',
  },
  happy: {
    title: 'Getting there... \u{1F49B}',
    message: "I know we're not fully okay yet, and that's fair. Thanks for hearing me out — I'll keep showing up until we are.",
    coupon: '\u{1F39F}️ Good for: 1 apology snack of your choice, redeemable anytime.',
  },
};
// ====================================================================
// End of easily-editable section.
// ====================================================================

const MOOD_EMOJI = { angry: '\u{1F620}', annoyed: '\u{1F612}', neutral: '\u{1F610}', happy: '\u{1F60A}', love: '\u{1F970}' };
const MOODS = ['angry', 'annoyed', 'neutral', 'happy', 'love'];

function moodImgHTML(mood) {
  return `<div class="mood-img" data-mood="${mood}">
    <img src="images/pingu-${mood}.png" alt="Pingu ${mood}" onerror="this.style.display='none'; this.parentElement.classList.add('fallback')">
    <span class="fallback-emoji">${MOOD_EMOJI[mood]}</span>
  </div>`;
}

function setMood(el, mood) {
  el.dataset.mood = mood;
  el.classList.remove('fallback');
  const img = el.querySelector('img');
  const span = el.querySelector('.fallback-emoji');
  img.src = `images/pingu-${mood}.png`;
  img.alt = `Pingu ${mood}`;
  img.style.display = '';
  span.textContent = MOOD_EMOJI[mood];
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function spawnFloater(container, text, leftPercent) {
  const el = document.createElement('div');
  el.className = 'floater';
  el.textContent = text;
  el.style.left = `${leftPercent}%`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 1700);
}

document.getElementById('btn-start').addEventListener('click', () => {
  showScreen('screen-stage1');
  startStage1();
});

// ---------------- Stage 1: Pop the Grumps ----------------
let s1Score = 0;
let s1Timer = null;
let s1SpawnTimer = null;
let s1TimeLeft = 30;

function startStage1() {
  s1Score = 0;
  s1TimeLeft = 30;
  document.getElementById('s1-score').textContent = s1Score;
  document.getElementById('s1-time').textContent = s1TimeLeft;
  document.getElementById('bubble-field').innerHTML = '';

  s1Timer = setInterval(() => {
    s1TimeLeft--;
    document.getElementById('s1-time').textContent = s1TimeLeft;
    if (s1TimeLeft <= 0) endStage1();
  }, 1000);

  s1SpawnTimer = setInterval(spawnBubble, 700);
}

function spawnBubble() {
  const field = document.getElementById('bubble-field');
  const bubble = document.createElement('div');
  bubble.className = 'grump-bubble';
  bubble.innerHTML = moodImgHTML('angry');
  const left = Math.random() * 85;
  const duration = 3 + Math.random() * 2;
  bubble.style.left = `${left}%`;
  bubble.style.animationDuration = `${duration}s`;
  bubble.addEventListener('animationend', () => bubble.remove());
  bubble.addEventListener('click', () => popBubble(bubble));
  field.appendChild(bubble);
}

function popBubble(bubble) {
  if (bubble.classList.contains('popped')) return;
  bubble.classList.add('popped');

  const field = document.getElementById('bubble-field');
  const rect = bubble.getBoundingClientRect();
  const fieldRect = field.getBoundingClientRect();
  const leftPx = rect.left - fieldRect.left;
  const topPx = rect.top - fieldRect.top;

  bubble.style.animation = 'none';
  bubble.style.left = `${leftPx}px`;
  bubble.style.top = `${topPx}px`;
  bubble.style.bottom = 'auto';
  void bubble.offsetWidth;
  bubble.style.animation = 'pop-anim 0.25s forwards';

  s1Score++;
  document.getElementById('s1-score').textContent = s1Score;

  const msg = POP_MESSAGES[Math.floor(Math.random() * POP_MESSAGES.length)];
  const leftPercent = (leftPx / fieldRect.width) * 100;
  spawnFloater(field, msg, leftPercent);

  setTimeout(() => bubble.remove(), 260);
}

function endStage1() {
  clearInterval(s1Timer);
  clearInterval(s1SpawnTimer);
  document.getElementById('s1-result-text').textContent =
    `You popped ${s1Score} grumpy bubbles. ${NAMES.her}'s mood is already looking up!`;
  showScreen('screen-stage1-result');
}

document.getElementById('btn-to-stage2').addEventListener('click', () => {
  showScreen('screen-stage2');
  startStage2();
});

// ---------------- Stage 2: Calm-o-Meter ----------------
let meter = 100;

function moodForMeter(m) {
  if (m >= 75) return 'angry';
  if (m >= 45) return 'annoyed';
  if (m >= 20) return 'neutral';
  if (m > 0) return 'happy';
  return 'love';
}

function labelForMeter(m) {
  if (m >= 75) return `Furious ${MOOD_EMOJI.angry}`;
  if (m >= 45) return `Annoyed ${MOOD_EMOJI.annoyed}`;
  if (m >= 20) return `Softening ${MOOD_EMOJI.neutral}`;
  if (m > 0) return `Happy ${MOOD_EMOJI.happy}`;
  return `Loved up ${MOOD_EMOJI.love}`;
}

function startStage2() {
  meter = 100;
  document.getElementById('btn-to-stage3').classList.add('hidden');
  updateMeterUI();
}

function updateMeterUI() {
  document.getElementById('meter-fill').style.width = `${meter}%`;
  document.getElementById('meter-label').textContent = labelForMeter(meter);
  setMood(document.getElementById('s2-mood'), moodForMeter(meter));
}

document.querySelectorAll('.btn-action').forEach((btn) => {
  btn.addEventListener('click', () => {
    const action = ACTIONS[btn.dataset.action];
    meter = Math.max(0, meter - (8 + Math.floor(Math.random() * 7)));
    updateMeterUI();
    const reaction = action.reactions[Math.floor(Math.random() * action.reactions.length)];
    spawnFloater(document.getElementById('floaters'), reaction, 20 + Math.random() * 60);
    if (meter <= 0) document.getElementById('btn-to-stage3').classList.remove('hidden');
  });
});

document.getElementById('btn-to-stage3').addEventListener('click', () => {
  showScreen('screen-stage3');
  startStage3();
});

// ---------------- Stage 3: Match & Mend ----------------
let s3Flipped = [];
let s3Matched = 0;
let s3Lock = false;
let s3Revealed = 0;

function startStage3() {
  s3Matched = 0;
  s3Revealed = 0;
  s3Flipped = [];
  s3Lock = false;
  document.getElementById('message-box').textContent = '';
  document.getElementById('btn-to-stage4').classList.add('hidden');

  const deck = shuffle([...MOODS, ...MOODS]);
  const grid = document.getElementById('match-grid');
  grid.innerHTML = '';
  deck.forEach((mood) => {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.dataset.mood = mood;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">?</div>
        <div class="card-face card-front">${moodImgHTML(mood)}</div>
      </div>`;
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (s3Lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  s3Flipped.push(card);
  if (s3Flipped.length !== 2) return;

  s3Lock = true;
  const [a, b] = s3Flipped;
  if (a.dataset.mood === b.dataset.mood) {
    a.classList.add('matched');
    b.classList.add('matched');
    s3Matched++;
    s3Revealed++;
    document.getElementById('message-box').textContent = MESSAGE_FRAGMENTS.slice(0, s3Revealed).join(' ');
    s3Flipped = [];
    s3Lock = false;
    if (s3Matched === MOODS.length) document.getElementById('btn-to-stage4').classList.remove('hidden');
  } else {
    setTimeout(() => {
      a.classList.remove('flipped');
      b.classList.remove('flipped');
      s3Flipped = [];
      s3Lock = false;
    }, 800);
  }
}

document.getElementById('btn-to-stage4').addEventListener('click', () => {
  showScreen('screen-stage4');
  startStage4();
});

// ---------------- Stage 4: Apology Quest ----------------
let s4Step = 0;
let s4Points = 0;

function startStage4() {
  s4Step = 0;
  s4Points = 0;
  setMood(document.getElementById('s4-mood'), 'neutral');
  renderDialogueStep();
}

function renderDialogueStep() {
  const step = DIALOGUE[s4Step];
  document.getElementById('s4-line').textContent = step.line;
  const choicesEl = document.getElementById('s4-choices');
  choicesEl.innerHTML = '';
  step.choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.className = 'btn-choice';
    btn.textContent = choice.text;
    btn.addEventListener('click', () => pickChoice(choice));
    choicesEl.appendChild(btn);
  });
}

function pickChoice(choice) {
  s4Points += choice.points;
  setMood(document.getElementById('s4-mood'), choice.points >= 3 ? 'happy' : 'neutral');
  s4Step++;
  if (s4Step < DIALOGUE.length) {
    setTimeout(renderDialogueStep, 500);
  } else {
    setTimeout(finishStage4, 700);
  }
}

function finishStage4() {
  const tier = s4Points >= 7 ? 'love' : 'happy';
  showEnding(tier);
}

// ---------------- Ending ----------------
function showEnding(tier) {
  const ending = ENDINGS[tier];
  document.getElementById('ending-title').textContent = ending.title;
  document.getElementById('ending-message').textContent = ending.message;
  document.getElementById('coupon').textContent = ending.coupon;
  setMood(document.querySelector('#screen-ending .mood-img'), tier);
  showScreen('screen-ending');
  launchConfetti();
  notifyGameCompleted(tier);
}

function notifyGameCompleted(tier) {
  const { publicKey, serviceId, templateId } = EMAILJS_CONFIG;
  if (!publicKey || publicKey === 'YOUR_PUBLIC_KEY' || typeof emailjs === 'undefined') return;
  const params = {
    tier,
    time: new Date().toLocaleString(),
    name: `${NAMES.me}'s Game`,
    message: `${NAMES.her} just finished the game! Ending: ${tier}.`,
  };
  emailjs.send(serviceId, templateId, params, { publicKey }).catch(() => {});
}

function launchConfetti() {
  const container = document.getElementById('confetti');
  container.innerHTML = '';
  const pieces = ['\u{1F49B}', '\u{1F495}', '✨', '\u{1F389}', '\u{1F496}'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('span');
    p.className = 'confetti-piece';
    p.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDelay = `${Math.random() * 1.5}s`;
    p.style.animationDuration = `${2 + Math.random() * 2}s`;
    container.appendChild(p);
  }
}

document.getElementById('btn-replay').addEventListener('click', () => {
  showScreen('screen-intro');
});
