import { LEVELS } from '../game/levels.js';

export default function LevelPicker({ current, done, onPick }) {
  return (
    <nav className="levels" aria-label="Escolher fase">
      {LEVELS.map((lv, i) => (
        <button
          key={i}
          className={[lv.boss && 'boss', done.includes(i) && 'done', i === current && 'cur'].filter(Boolean).join(' ')}
          aria-label={`Fase ${i + 1}${lv.boss ? ', chefão' : ''}${done.includes(i) ? ' (feita)' : ''}`}
          onClick={() => onPick(i)}
        >
          {i + 1}
        </button>
      ))}
    </nav>
  );
}
