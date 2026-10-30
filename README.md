# Mexa Um Palito

Jogo de palitos de fósforo: mova um único palito e deixe a conta certa. 15 fases, com chefões nas fases 5, 10 e 15.

## Rodar em desenvolvimento

```bash
npm install
npm run dev        # abre no navegador em http://localhost:5173
npm test           # confere que cada fase tem exatamente uma solução
```

## Rodar como app de desktop

```bash
npm run build
npm run electron
```

## Gerar o executável do Windows

```bash
npm run package:win
```

O resultado fica em `release/Mexa Um Palito-win32-x64/Mexa Um Palito.exe`.
Para Mac ou Linux, troque `--platform=win32` por `darwin` ou `linux` no script.

## Estrutura

- `src/game/logic.js`: regras (display de 7 segmentos, leitura e conferência da conta, solucionador)
- `src/game/levels.js`: as 15 fases
- `src/game/reducer.js`: estado do jogo (pegar/largar palito, vidas, dica)
- `src/components/`: `Board` (equação em SVG), `Match` (palito), `Lives`, `LevelPicker`
- `electron/main.cjs`: janela do app de desktop
