// NEURAL.EXE — terminal AI-recovery game
// Puzzles: binary, dot-product, pattern, logic, ML concepts

const out    = document.getElementById("output");
const input  = document.getElementById("cmd-input");
const choices= document.getElementById("choices");
const irow   = document.getElementById("input-row");

let state = { stage: "boot", score: 0, attempts: 0 };

// ── helpers ──────────────────────────────────────────────────────────────────

function line(text = "", cls = "") {
  const d = document.createElement("div");
  d.className = "line" + (cls ? " " + cls : "");
  d.textContent = text;
  out.appendChild(d);
  out.scrollTop = out.scrollHeight;
  return d;
}

function blank() { line(); }

function sep(char = "─", len = 44) { line(char.repeat(len), "sep"); }

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function typeLines(lines, ms = 38) {
  for (const [text, cls] of lines) {
    line(text, cls);
    await delay(ms);
  }
}

function clearChoices() {
  choices.innerHTML = "";
  irow.style.display = "none";
}

function showInput(label = "neural@sys:~$ ") {
  document.getElementById("prompt-label").textContent = label;
  irow.style.display = "flex";
  input.value = "";
  input.focus();
}

function showChoices(opts, onPick) {
  clearChoices();
  choices.style.display = "flex";
  opts.forEach(([label, val]) => {
    const b = document.createElement("button");
    b.className = "choice-btn";
    b.textContent = label;
    b.onclick = () => { choices.innerHTML = ""; onPick(val, label); };
    choices.appendChild(b);
  });
}

function bar(n, total = 10, filled = "█", empty = "░") {
  return filled.repeat(n) + empty.repeat(total - n);
}

// ── stages ───────────────────────────────────────────────────────────────────

async function stageBoot() {
  clearChoices();
  await typeLines([
    ["NEURAL.EXE  v0.1.0", "acc bold"],
    [" ", ""],
    ["BOOTING NEURAL SYSTEM...", "dim"],
  ], 60);

  // animated boot bar
  const barLine = line("", "green");
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    barLine.textContent = "[" + "█".repeat(i) + " ".repeat(steps - i) + "]  " +
      Math.round((i / steps) * 100) + "%";
    await delay(80);
  }

  await delay(300);
  await typeLines([
    ["", ""],
    ["NEURAL SYSTEM ONLINE", "green bold"],
    ["", ""],
    ["MODEL STATUS", "acc"],
    ["  INPUT       " + bar(10), "green"],
    ["  HIDDEN 1    " + bar(4),  "warn"],
    ["  HIDDEN 2    " + bar(0),  "red"],
    ["  OUTPUT      ✕ CORRUPTED", "red"],
    ["", ""],
    ["ERROR: Gradient vanished. Weights corrupted.", "red"],
    ["", ""],
    ["To restore the model, solve the diagnostic sequence.", "dim"],
    ["Each correct answer repairs one layer.", "dim"],
    ["", ""],
  ], 45);

  sep();
  blank();
  line("LAYER 1 — INPUT LAYER", "acc bold");
  blank();
  await delay(200);
  stageLayer1();
}

// ── Layer 1: Binary decode ────────────────────────────────────────────────────
function stageLayer1() {
  line("DIAGNOSTIC: Binary Decode", "warn");
  blank();
  line("The input layer speaks in binary.", "dim");
  line("Decode this byte:", "dim");
  blank();
  line("  01001011", "green bold");
  blank();
  line("What decimal value does this represent?", "");
  blank();
  showInput("answer > ");
  state.stage = "layer1";
}

function checkLayer1(ans) {
  const n = parseInt(ans.trim());
  if (n === 75) {
    line("> " + ans, "dim");
    blank();
    line("CORRECT.  01001011 = 75  (ASCII: 'K')", "green");
    blank();
    line("INPUT LAYER  " + bar(10), "green");
    blank();
    line("Interesting. The first letter of a name.", "dim");
    blank();
    sep();
    blank();
    line("LAYER 2 — HIDDEN LAYER 1", "acc bold");
    blank();
    delay(200).then(stageLayer2);
  } else {
    state.attempts++;
    line("> " + ans, "dim");
    line("INCORRECT.  Hint: 2^6 + 2^3 + 2^1 + 2^0", "red");
    if (state.attempts >= 2) {
      line("(answer: 75)", "dim");
      delay(800).then(() => { state.attempts = 0; checkLayer1("75"); });
    } else {
      showInput("answer > ");
    }
  }
}

// ── Layer 2: Dot product ──────────────────────────────────────────────────────
function stageLayer2() {
  line("DIAGNOSTIC: Dot Product", "warn");
  blank();
  line("Weights are vectors. Compute the dot product:", "dim");
  blank();
  line("  w = [2, -1, 3]", "green");
  line("  x = [1,  4, 2]", "green");
  blank();
  line("  w · x = ?", "");
  blank();
  showInput("answer > ");
  state.stage = "layer2";
}

function checkLayer2(ans) {
  // 2*1 + (-1)*4 + 3*2 = 2 - 4 + 6 = 4
  const n = parseInt(ans.trim());
  if (n === 4) {
    line("> " + ans, "dim");
    blank();
    line("CORRECT.  2(1) + (−1)(4) + 3(2) = 4", "green");
    blank();
    line("HIDDEN 1  " + bar(10), "green");
    blank();
    line("The weights are converging.", "dim");
    blank();
    sep();
    blank();
    line("LAYER 3 — HIDDEN LAYER 2", "acc bold");
    blank();
    delay(200).then(stageLayer3);
  } else {
    state.attempts++;
    line("> " + ans, "dim");
    line("INCORRECT.  Compute: (2×1) + (−1×4) + (3×2)", "red");
    if (state.attempts >= 2) {
      line("(answer: 4)", "dim");
      delay(800).then(() => { state.attempts = 0; checkLayer2("4"); });
    } else {
      showInput("answer > ");
    }
  }
}

// ── Layer 3: Pattern recognition ─────────────────────────────────────────────
function stageLayer3() {
  line("DIAGNOSTIC: Pattern Recognition", "warn");
  blank();
  line("Identify the activation function from its output:", "dim");
  blank();
  line("  f(-2) = 0.119", "green");
  line("  f( 0) = 0.500", "green");
  line("  f( 2) = 0.880", "green");
  blank();
  line("Which function is this?", "");
  blank();
  showChoices([
    ["ReLU",    "relu"],
    ["Sigmoid", "sigmoid"],
    ["Tanh",    "tanh"],
    ["Softmax", "softmax"],
  ], checkLayer3);
  state.stage = "layer3";
}

function checkLayer3(val, label) {
  line("> " + label, "dim");
  blank();
  if (val === "sigmoid") {
    line("CORRECT.  σ(x) = 1 / (1 + e^−x)", "green");
    blank();
    line("HIDDEN 2  " + bar(10), "green");
    blank();
    line("The hidden layers are restored.", "dim");
    blank();
    sep();
    blank();
    line("LAYER 4 — OUTPUT LAYER", "acc bold");
    blank();
    delay(200).then(stageLayer4);
  } else {
    line("INCORRECT.  The output is bounded (0,1) and symmetric around 0.5.", "red");
    blank();
    delay(600).then(stageLayer3);
  }
}

// ── Layer 4: ML concept ───────────────────────────────────────────────────────
function stageLayer4() {
  line("DIAGNOSTIC: Gradient Descent", "warn");
  blank();
  line("The model failed because gradients vanished.", "dim");
  line("Which technique directly addresses vanishing gradients?", "");
  blank();
  showChoices([
    ["Dropout",          "dropout"],
    ["Batch Norm",       "bn"],
    ["Residual (Skip) Connections", "residual"],
    ["L2 Regularisation","l2"],
  ], checkLayer4);
  state.stage = "layer4";
}

function checkLayer4(val, label) {
  line("> " + label, "dim");
  blank();
  if (val === "residual") {
    line("CORRECT.  Skip connections let gradients flow directly.", "green");
    blank();
    line("OUTPUT    " + bar(10), "green");
    blank();
    delay(400).then(stageLayer5);
  } else if (val === "bn") {
    // batch norm also helps — accept it
    line("CORRECT (partial).  Batch Norm stabilises training.", "green");
    line("Residual connections are the canonical fix, but accepted.", "warn");
    blank();
    line("OUTPUT    " + bar(8), "green");
    blank();
    delay(400).then(stageLayer5);
  } else {
    line("INCORRECT.  Think about gradient flow through deep networks.", "red");
    blank();
    delay(600).then(stageLayer4);
  }
}

// ── Layer 5: Logic / debugging ────────────────────────────────────────────────
async function stageLayer5() {
  sep();
  blank();
  line("FINAL DIAGNOSTIC — Corrupted Metadata", "acc bold");
  blank();
  await typeLines([
    ["Recovering developer identity...", "dim"],
    ["", ""],
    ["FRAGMENT 1:  language = Python", "green"],
    ["FRAGMENT 2:  interest = AI, Robotics, Vision", "green"],
    ["FRAGMENT 3:  name[0]  = 0x4B  (ASCII)", "green"],
    ["FRAGMENT 4:  name[1:] = 'anish'", "green"],
    ["", ""],
    ["Reconstruct the developer's name:", ""],
    ["", ""],
  ], 50);
  showInput("name > ");
  state.stage = "layer5";
}

function checkLayer5(ans) {
  const clean = ans.trim().toLowerCase();
  if (clean === "kanish" || clean === "kanish paul") {
    line("> " + ans, "dim");
    blank();
    delay(300).then(stageRecovered);
  } else {
    line("> " + ans, "dim");
    line("MISMATCH.  0x4B = 75 = 'K'  →  K + 'anish'", "red");
    blank();
    showInput("name > ");
  }
}

// ── Recovery screen ───────────────────────────────────────────────────────────
async function stageRecovered() {
  await typeLines([
    ["IDENTITY CONFIRMED.", "green bold"],
    ["", ""],
    ["RESTORING MODEL...", "dim"],
  ], 60);

  const barLine = line("", "green");
  for (let i = 0; i <= 20; i++) {
    barLine.textContent = "[" + "█".repeat(i) + " ".repeat(20 - i) + "]  " +
      Math.round((i / 20) * 100) + "%";
    await delay(60);
  }

  await delay(400);
  await typeLines([
    ["", ""],
    ["MODEL RECOVERED.", "green bold"],
    ["", ""],
    ["─".repeat(44), "sep"],
    ["", ""],
    ["  DEVELOPER PROFILE", "acc bold"],
    ["", ""],
    ["  NAME       Kanish Paul", ""],
    ["  ROLE       CSE / AI-ML", ""],
    ["  FOCUS      Artificial Intelligence", ""],
    ["             Machine Learning", ""],
    ["             Computer Vision", ""],
    ["             Robotics", ""],
    ["             Software Systems", ""],
    ["", ""],
    ["  STACK      Python · PyTorch · React", ""],
    ["             Java · JavaScript · Docker", ""],
    ["             MySQL · MongoDB · Linux", ""],
    ["", ""],
    ["  PHILOSOPHY build → break → understand → rebuild", "dim"],
    ["", ""],
    ["─".repeat(44), "sep"],
    ["", ""],
    ["  github.com/kpaul-create", "acc"],
    ["", ""],
    ["─".repeat(44), "sep"],
  ], 40);

  blank();
  line("neural@sys:~$ _", "dim");
  clearChoices();
  irow.style.display = "none";

  // restart option
  await delay(800);
  blank();
  showChoices([["↩  run again", "restart"]], (v) => {
    if (v === "restart") { out.innerHTML = ""; state = { stage:"boot", score:0, attempts:0 }; stageBoot(); }
  });
}

// ── Input router ─────────────────────────────────────────────────────────────
input.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const val = input.value.trim();
  if (!val) return;
  input.value = "";
  switch (state.stage) {
    case "layer1": checkLayer1(val); break;
    case "layer2": checkLayer2(val); break;
    case "layer5": checkLayer5(val); break;
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
stageBoot();
