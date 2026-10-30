import { useEffect, useReducer, useRef } from 'react';
import { LEVELS, livesFor } from './game/levels.js';
import { evaluate, readAll } from './game/logic.js';
import { reducer, initState } from './game/reducer.js';
import { sounds } from './game/sounds.js';
import Board from './components/Board.jsx';
import Lives from './components/Lives.jsx';
import LevelPicker from './components/LevelPicker.jsx';

const STORE = 'palito-save';
function loadSave() {
  try { return JSON.parse(localStorage.getItem(STORE)) ?? {}; } catch { return {}; }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, () => initState(loadSave()));
  const { level, glyphs, cur, lifted, solved, hint, lives, lostNow, msg, done, orig, shake } = state;
  const lv = LEVELS[level];
  const tableRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify({ level, done })); } catch { /* sem armazenamento: segue o jogo */ }
  }, [level, done]);

  useEffect(() => { if (lifted) sounds.pickup(); }, [lifted]);
  useEffect(() => { if (solved) sounds.correct(); }, [solved]);
  useEffect(() => { if (lostNow) sounds.wrong(); }, [lostNow]);
  const prevCurRef = useRef(cur);
  useEffect(() => {
    if (!lifted && cur && prevCurRef.current && cur !== prevCurRef.current) sounds.place();
    prevCurRef.current = cur;
  }, [cur, lifted]);

  // reinicia a animação de tremida a cada erro
  useEffect(() => {
    const t = tableRef.current;
    if (!t || shake === 0) return;
    t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake');
  }, [shake]);

  const ok = evaluate(glyphs);
  const read = readAll(glyphs).replace(/-/g, '−').replace(/([+−=])/g, ' $1 ');
  const last = level === LEVELS.length - 1;

  return (
    <div className="wrap">
      <header>
        <div className="brand">
          <div className="box" aria-hidden="true" />
          <div>
            <h1>Mexa Um <span>Palito</span></h1>
            <p className="sub">Mova um único palito e deixe a conta certa.</p>
          </div>
        </div>
      </header>

      <LevelPicker current={level} done={done} onPick={(i) => dispatch({ type: 'load', level: i })} />

      <section ref={tableRef} className={`table ${lv.boss ? 'boss' : ''}`}>
        <span className="tag">{lv.boss ? `FASE ${level + 1} · ${lv.boss.toUpperCase()}` : `FASE ${level + 1} DE ${LEVELS.length}`}</span>
        {lv.boss && <p className="boss-intro">{lv.intro}</p>}
        <Lives lives={lives} max={livesFor(level)} justLost={lostNow} />

        <Board glyphs={glyphs} cur={cur} lifted={lifted} solved={solved} hint={hint}
          onTap={(slot) => dispatch({ type: 'tap', slot })} />

        <div className="read" aria-live="polite">
          <span>{read}</span>
          <span className={`pill ${ok ? 'ok' : ok === null ? 'idle' : 'bad'}`}>
            {ok ? 'certa' : ok === null ? 'símbolo inválido' : 'errada'}
          </span>
        </div>
        <p className="msg">{msg.em && <strong>{msg.em}</strong>}{msg.text}</p>

        <div className="actions">
          <button className={`btn${lostNow ? ' primary' : ''}`} disabled={solved || (!orig && !lifted && !lostNow)} onClick={() => dispatch({ type: lives === 0 ? 'restart' : 'retry' })}>{lives === 0 ? 'Recomeçar do zero' : 'Tentar de novo'}</button>
          {!lv.boss && !solved && <button className="btn" disabled={lives <= 0} onClick={() => dispatch({ type: 'hint' })}>Dica (−1 vida)</button>}
          {solved && !last && <button className="btn primary" onClick={() => dispatch({ type: 'next' })}>Próxima fase</button>}
        </div>
      </section>

      <p className="rules"><b>Como jogar:</b> toque num palito para levantá-lo e depois toque num espaço tracejado para largá-lo. Vale mexer só <b>um</b> palito. Depois que você larga o palito, a jogada acabou: se a conta não fechar, toque em <b>Tentar de novo</b>. Enquanto o palito está levantado, você pode devolvê-lo tocando nele. O sinal de <b>=</b> fica fixo. Um <b>+</b> sem o palito em pé vira <b>−</b>.</p>
      <p className="rules"><b>Chefões:</b> as fases 5, 10 e 15 são chefões e não têm dica. Nas fases 5 e 10 você tem 3 vidas, e cada conta errada custa uma. O chefão final, na fase 15, dá só uma vida. Se as vidas acabarem, o chefão recomeça.</p>
    </div>
  );
}
