const express = require("express");
const { execFile } = require("node:child_process");
const os = require("node:os");
const path = require("node:path");
const fs = require("node:fs/promises");

const PORT = Number(process.env.PORT || 3199);

function runPowerShell(script) {
  return new Promise((resolve, reject) => {
    const args = [
      "-NoProfile",
      "-NonInteractive",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      script,
    ];
    execFile(
      "powershell.exe",
      args,
      { windowsHide: true, maxBuffer: 10 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err) {
          reject(new Error(stderr?.trim() || err.message));
          return;
        }
        resolve(String(stdout || "").trim());
      },
    );
  });
}

async function listPrinters() {
  const script =
    "Get-Printer | Select-Object Name,DriverName,PortName,Shared,Default | ConvertTo-Json -Depth 3";
  const out = await runPowerShell(script);
  if (!out) return [];
  try {
    const parsed = JSON.parse(out);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

async function printText({ content, printerName }) {
  const safeContent = String(content ?? "");
  if (!safeContent.trim()) throw new Error("Conteúdo vazio.");

  const tmpDir = path.join(os.tmpdir(), "smart-park-printer-agent");
  await fs.mkdir(tmpDir, { recursive: true });
  const filePath = path.join(tmpDir, `ticket_${Date.now()}.txt`);
  await fs.writeFile(filePath, safeContent, "utf8");

  const escapedPath = filePath.replace(/'/g, "''");
  const escapedPrinter = printerName
    ? String(printerName).replace(/'/g, "''")
    : "";

  const ps = printerName
    ? `Get-Content -LiteralPath '${escapedPath}' | Out-Printer -Name '${escapedPrinter}'`
    : `Get-Content -LiteralPath '${escapedPath}' | Out-Printer`;

  await runPowerShell(ps);
}

const app = express();
app.disable("x-powered-by");

app.use(express.json({ limit: "2mb" }));

// CORS simples para localhost (app web)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/printers", async (_req, res) => {
  try {
    const printers = await listPrinters();
    res.json({ ok: true, printers });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || "Erro ao listar." });
  }
});

app.post("/print", async (req, res) => {
  try {
    const { content, printerName } = req.body || {};
    await printText({ content, printerName });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: e?.message || "Erro ao imprimir." });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Smart Park Printer Agent rodando em http://localhost:${PORT}`);
});

