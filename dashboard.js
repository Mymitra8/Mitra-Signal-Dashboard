/**
 * --- Dashboard JS ---
 * Fetches from Google Script, shows top 5 coins only
 */

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyb-uWucZ1i4DGn8uDQKaBtGTyWzSmJ6xshABZ5nK92Alzo7e1nbl4QuZOBIjVUMBNL/exec";
const STRATEGIES = ["TrendSniper", "ReversalHunt", "Swing5X", "MomentumPulse", "ScalpEdge"];
const SHEET_NAME = "Mitra_Signal_20250818_0001";

// Fetch alerts from Apps Script
async function fetchAlerts() {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const json = await res.json();

    if (!json.success) {
      console.error("Sheet fetch error:", json.error);
      return [];
    }

    const rows = json.data;
    if (rows.length <= 1) return [];

    // Convert to structured alerts
    return rows.slice(1).map(r => ({
      time: r[0],
      coin: r[1],
      sym: r[2],
      conf: r[3],
      entry: r[4],
      tp: r[5],
      sl: r[6],
      strategy: r[7]
    }));

  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

// Refresh dashboard table
async function refreshAlerts() {
  const strategy = document.getElementById("strategySelect").value;
  const alerts = await fetchAlerts();

  // Filter by selected strategy
  let filtered = alerts.filter(a => a.strategy === strategy);

  // Sort by confidence (high first) & keep top 5
  filtered = filtered.sort((a, b) => b.conf - a.conf).slice(0, 5);

  const tbody = document.querySelector("#alertsTable tbody");
  tbody.innerHTML = "";

  filtered.forEach(a => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${a.time}</td>
      <td>${a.coin}</td>
      <td>${a.sym}</td>
      <td>${a.conf}%</td>
      <td>${a.entry}</td>
      <td>${a.tp}</td>
      <td>${a.sl}</td>
      <td>${a.strategy}</td>
    `;
    tbody.appendChild(row);
  });

  if (filtered.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="8" style="text-align:center">⚠ No alerts yet for ${strategy}</td>`;
    tbody.appendChild(row);
  }
}

// Auto-refresh every 1 min
setInterval(refreshAlerts, 60000);
