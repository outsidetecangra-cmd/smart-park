# Smart Park (MVP)

Sistema web (MVP) de controle de estacionamento, com login simples e persistência via LocalStorage (sem backend).

## Licença / Uso

Este projeto é **proprietário**. Para detalhes, veja `LICENSE_PROPRIETARY.md`.

## Rodar localmente

```bash
npm install
npm run dev
```

## Impressão automática (Windows) — Plug and Play

Para impressão automática de cupom em **qualquer impressora instalada no Windows** (USB ou rede), use o **Printer Agent** local.

1) Abra outro terminal e rode:

```bash
cd printer-agent
npm install
npm run dev
```

2) No Smart Park, vá em **Impressoras** e:
   - deixe “Usar a padrão do Windows” (recomendado) ou selecione uma impressora
   - clique em “Imprimir teste”

3) Ao registrar uma entrada, o sistema tenta imprimir automaticamente o cupom via `http://localhost:3199/print`.

## Usuário demo

- Email: `admin@estacionamento.com`
- Senha: `123456`

## Rotas

- `/` (landing)
- `/login`
- `/cadastro`
- `/dashboard` (protegida)
- `/vagas` (protegida)
- `/entrada` (protegida)
- `/saida` (protegida)
- `/historico` (protegida)
- `/pagamentos` (protegida)
- `/mapa` (protegida)
- `/equipamentos` (protegida)
- `/configuracoes` (protegida)
