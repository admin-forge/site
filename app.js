/* =====================================================
   Craftpick Tools - app.js
   Version locale (sans backend)
   ===================================================== */

// === Helpers ===
function copy(id) {
  const text = document.getElementById(id).textContent;
  if (!text) return alert("Rien à copier !");
  navigator.clipboard.writeText(text).then(() => alert("✅ Copié !"));
}

function downloadText(filename, text) {
  const a = document.createElement("a");
  const blob = new Blob([text], { type: "text/plain" });
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// === Command Generator ===
function generateCommand() {
  const type = document.getElementById("cmd-type").value;
  const player = document.getElementById("cmd-player").value || "@p";
  const args = document.getElementById("cmd-args").value.trim();

  let cmd = "";
  switch (type) {
    case "give":
      cmd = `/give ${player} ${args || "minecraft:diamond 1"}`;
      break;
    case "title":
      cmd = `/title ${player} title ${args || '{"text":"Bienvenue !"}'}`;
      break;
    case "tellraw":
      cmd = `/tellraw ${player} ${args || '{"text":"Salut !"}'}`;
      break;
    case "summon":
      cmd = `/summon ${args || "minecraft:zombie"}`;
      break;
    default:
      cmd = "/say Commande invalide";
  }

  document.getElementById("cmd-output").textContent = cmd;
  log(`Commande générée : ${cmd}`);
}

// === Kit Generator ===
let lastKit = "";

function generateKit() {
  const name = document.getElementById("kit-name").value || "starter";
  const raw = document.getElementById("kit-items").value || "stone_sword:1";
  const items = raw.split("|").map((s) => {
    const parts = s.trim().split(":");
    return {
      item: parts[0] || "stone",
      amount: parseInt(parts[1]) || 1,
      meta: parts.slice(2).join(":") || "",
    };
  });
  const kitData = { name, items };
  lastKit = JSON.stringify(kitData, null, 2);

  alert("✅ Kit JSON généré ! Cliquez sur Télécharger pour l'enregistrer.");
  log(`Kit généré : ${name}`);
}

function downloadKit() {
  if (!lastKit) return alert("Génère d'abord un kit !");
  const name = document.getElementById("kit-name").value || "kit";
  downloadText(`kit-${name}.json`, lastKit);
}

// === Scoreboard Generator ===
function generateScoreboard() {
  const line = document.getElementById("score-line").value || "Points: {points}";
  const text = `objective add points dummy Points\nscoreboard players set @a points 0\n# Exemple de ligne : ${line}`;
  document.getElementById("score-output").textContent = text;
  log("Scoreboard généré !");
}

// === GUI Builder ===
function buildGUI() {
  const name = document.getElementById("menu-name").value || "Boutique";
  const raw = document.getElementById("menu-slots").value || "0:diamond:buy_kit";
  const items = raw.split(" ").map((s) => {
    const parts = s.trim().split(":");
    return {
      slot: parseInt(parts[0]) || 0,
      item: parts[1] || "stone",
      action: parts[2] || "",
    };
  });
  const yml =
    `menu:\n  name: ${name}\n  size: 27\n  items:\n` +
    items
      .map(
        (it) =>
          `    - slot: ${it.slot}\n      item: ${it.item}\n      action: ${it.action}\n`
      )
      .join("");

  document.getElementById("gui-output").textContent = yml;
  log(`Menu GUI généré : ${name}`);
}

// === Arena Generator ===
function generateArena() {
  const name = document.getElementById("arena-name").value || "arena";
  const teams = parseInt(document.getElementById("arena-teams").value) || 2;

  const cfg =
    `arena:\n  name: ${name}\n  teams: ${teams}\n  spawns:\n` +
    Array.from({ length: teams })
      .map(
        (_, i) =>
          `    team${i + 1}:\n      spawn_x: ${i * 10}\n      spawn_y: 64\n      spawn_z: ${i * 15}\n`
      )
      .join("");

  document.getElementById("arena-output").textContent = cfg;
  log(`Arène générée : ${name}`);
}

// === Web Tools ===

// Test serveur (ping)
async function checkServer() {
  const ipRaw = document.getElementById("srv-ip").value;
  const out = document.getElementById("srv-out");

  if (!ipRaw) return alert("Entre une IP de serveur !");
  out.textContent = "⏳ Vérification en cours...";

  try {
    const ip = ipRaw.split(":")[0];
    const res = await fetch(`https://api.mcsrvstat.us/2/${ip}`);
    const data = await res.json();

    if (!data || !("online" in data))
      throw new Error("Aucune donnée renvoyée par l'API.");

    out.textContent = `✅ En ligne : ${data.online ? "Oui" : "Non"}\n👥 Joueurs : ${
      data.players?.online ?? "?"
    }\n🧩 Version : ${data.version ?? "?"}`;
    log(`Ping serveur : ${ipRaw} (${data.online ? "online" : "offline"})`);
  } catch (e) {
    out.textContent =
      "⚠️ Impossible de vérifier (API bloquée ou hors ligne).";
    log("Erreur ping serveur : " + e.message);
  }
}

// Générateur de widget HTML
function generateWidget() {
  const type = document.getElementById("widget-type").value;
  const ip = document.getElementById("widget-ip").value || "craftpick.playcraft.me";
  let html = "";

  if (type.includes("Mini")) {
    html = `<div class=\"mc-widget\"><strong>${ip}</strong> — <span>Online ?</span></div>`;
  } else {
    html = `<div class=\"mc-widget-full\">
  <h3>${ip}</h3>
  <p>Status: <span id=\"mc-status\">unknown</span></p>
  <p>Players: <span id=\"mc-players\">-</span></p>
</div>`;
  }

  document.getElementById("widget-output").textContent = html;
  log("Widget généré pour " + ip);
}

// Générateur de liens de vote
function generateVoteLinks() {
  const url = document.getElementById("vote-url").value.trim();
  if (!url) return alert("Entre une URL de vote !");
  const links = `Liens de vote :\n- ${url}\n- ${url.replace(
    "https://",
    "http://"
  )}`;
  document.getElementById("vote-output").textContent = links;
  log("Liens de vote générés !");
}

// Simulateur de backup
function scheduleBackup() {
  const cron = document.getElementById("backup-cron").value || "0 3 * * *";
  const logEl = document.getElementById("admin-log");
  const entry = document.createElement("div");
  entry.innerHTML = `<small>💾 Backup planifié : ${cron}</small>`;
  logEl.prepend(entry);
  log("Backup planifié : " + cron);
}

function clearLog() {
  document.getElementById("admin-log").innerHTML = "";
  log("Logs effacés !");
}

// === Logger ===
function log(text) {
  const l = document.getElementById("admin-log");
  const entry = document.createElement("div");
  entry.innerHTML = `<small>${new Date().toLocaleString(
    "fr-FR"
  )} — ${text}</small>`;
  l.prepend(entry);
  console.log(text);
}
