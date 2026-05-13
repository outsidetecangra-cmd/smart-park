# Smart Park — Ponto Atual (12/05/2026)

## Status
- Projeto atualizado e **subido para o GitHub** (branch `main`).
- Ambiente principal para uso/validação: **localhost**.

## Últimas entregas
- **Módulo Sinistro (MVP)**:
  - Aba/rota: `/sinistro`
  - Tela: `src/pages/Incidents.tsx`
  - Captura por câmera (browser) + upload de fotos + análise **mock** de avarias
  - Sinistro salvo no veículo via `localStorage` (contexto do app)

- **Impressão Plug and Play (Windows) — Automática na entrada**:
  - Printer Agent local (Windows): `printer-agent/src/server.js` (porta `3199`)
  - Endpoints:
    - `GET /printers` (lista impressoras instaladas no Windows)
    - `POST /print` (imprime na impressora padrão ou na selecionada)
  - Tela no app: `/impressoras` (`src/pages/Printers.tsx`)
  - Registro de entrada tenta imprimir automaticamente o cupom:
    - `src/pages/VehicleEntry.tsx`
  - Seleção de impressora fica salva no `localStorage` (`sp_printer_selected_v1`)

## Como rodar (localhost)
1) App:
   - `npm install`
   - `npm run dev`

2) Printer Agent (em outro terminal):
   - `cd printer-agent`
   - `npm install`
   - `npm run dev`

## Observações importantes
- “Detecção automática real” de avarias (amassados/arranhões) **ainda é mock**; para ser real precisa de backend + visão computacional.
- “Reconhecer qualquer impressora automaticamente” no web app **não é possível**; o plug and play real é via **impressora padrão do Windows** + Agent local.

## Próximos passos sugeridos
- Integrar eventos de cancela/câmeras (hardware) via API/backend.
- Definir modelo do cupom (58/80mm) e layout térmico (ESC/POS) se necessário.
- Revisar/normalizar textos PT-BR restantes (há trechos antigos em alguns componentes).

