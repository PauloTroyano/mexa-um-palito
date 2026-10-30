import { useEffect, useReducer, useRef, useState } from 'react';
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
function hasSave() {
  const s = loadSave();
  return s.level > 0 || (s.done && s.done.length > 0);
}
function clearSave() {
  try { localStorage.removeItem(STORE); } catch { /* nada */ }
}

function StartScreen({ onNew, onContinue, hasProgress }) {
  return (
    <div className="wrap">
      <div className="start-screen">
        <div className="brand start-brand">
          <div className="box" aria-hidden="true" />
          <div>
            <h1>Mexa Um <span>Palito</span></h1>
            <p className="sub">Mova um único palito e deixe a conta certa.</p>
          </div>
        </div>

        <div className="start-matches" aria-hidden="true">
          {[0,1,2,3,4].map(i => (
            <svg key={i} viewBox="0 0 14 40" className="start-match" style={{transform:`rotate(${-20+i*10}deg) translateY(${Math.abs(2-i)*4}px)`}}>
              <rect x="5.5" y="8" width="3" height="30" rx="1.2" fill="var(--wood)" stroke="var(--lead)" strokeWidth="1" />
              <line x1="6.5" y1="12" x2="6.5" y2="36" stroke="var(--lead-soft)" strokeWidth="0.6" opacity="0.5" />
              <ellipse cx="7" cy="8" rx="4.5" ry="5" fill="var(--red)" stroke="var(--lead)" strokeWidth="1" />
              <line x1="5" y1="6" x2="9" y2="10" stroke="#8f2019" strokeWidth="0.8" opacity="0.6" />
            </svg>
          ))}
        </div>

        <p className="start-desc">15 fases de palitos de fósforo. Você tem <b>5 vidas</b> para completar o jogo.</p>

        <div className="start-actions">
          <button className="btn primary start-btn" onClick={onNew}>Nova partida</button>
          {hasProgress && (
            <button className="btn start-btn" onClick={onContinue}>Continuar</button>
          )}
        </div>

        <p className="rules"><b>Como jogar:</b> toque num palito para levantá-lo e depois toque num espaço tracejado para largá-lo. Vale mexer só <b>um</b> palito. Depois que você larga o palito, a jogada acabou: se a conta não fechar, toque em <b>Tentar de novo</b>. Enquanto o palito está levantado, você pode devolvê-lo tocando nele.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('start');
  const [state, dispatch] = useReducer(reducer, undefined, () => initState({}));
  const { level, glyphs, cur, lifted, solved, hint, lives, lostNow, msg, done, orig, shake } = state;
  const lv = LEVELS[level];
  const tableRef = useRef(null);

  useEffect(() => {
    if (screen !== 'game') return;
    try { localStorage.setItem(STORE, JSON.stringify({ level, done })); } catch { /* nada */ }
  }, [screen, level, done]);

  useEffect(() => { if (lifted) sounds.pickup(); }, [lifted]);
  useEffect(() => { if (solved) sounds.correct(); }, [solved]);
  useEffect(() => { if (lostNow) sounds.wrong(); }, [lostNow]);
  const prevCurRef = useRef(cur);
  useEffect(() => {
    if (!lifted && cur && prevCurRef.current && cur !== prevCurRef.current) sounds.place();
    prevCurRef.current = cur;
  }, [cur, lifted]);

  useEffect(() => {
    const t = tableRef.current;
    if (!t || shake === 0) return;
    t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake');
  }, [shake]);

  function handleNew() {
    clearSave();
    dispatch({ type: 'restart' });
    setScreen('game');
  }

  function handleContinue() {
    const saved = loadSave();
    dispatch({ type: '_load_save', saved });
    setScreen('game');
  }

  if (screen === 'start') {
    return <StartScreen onNew={handleNew} onContinue={handleContinue} hasProgress={hasSave()} />;
  }

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
        <button className="btn" style={{fontSize:'16px',padding:'4px 12px'}} onClick={() => setScreen('start')}>Menu</button>
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
    </div>
  );
}
