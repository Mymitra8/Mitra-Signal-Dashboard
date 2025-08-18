const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyb-uWucZ1i4DGn8uDQKaBtGTyWzSmJ6xshABZ5nK92Alzo7e1nbl4QuZOBIjVUMBNL/exec";

async function fetchAlerts() {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const json = await res.json();

    if (!json.success) {
      alert("Error: " + json.error);
      return;
    }

    // load strategies
    const stratSel = document.getElementById("strategy");
    stratSel.innerHTML = "";
    json.strategies.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      stratSel.appendChild(opt);
    });

    // fill table
    const tbody = document.querySelector("#alerts tbody");
    tbody.innerHTML = "";
    json.data.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r["Time"] || ""}</td>
        <td>${r["Strategy"] || ""}</td>
        <td>${r["Coin"] || ""}</td>
        <td>${r["Symbol"] || ""}</td>
        <td>${r["Conf"] || ""}</td>
        <td>${r["Entry"] || ""}</td>
        <td>${r["TP"] || ""}</td>
        <td>${r["SL"] || ""}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    alert("Fetch failed: " + err.message);
  }
}

window.onload = fetchAlerts;

