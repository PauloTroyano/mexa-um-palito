import test from 'node:test';
import assert from 'node:assert/strict';
import { parse, evaluate, solutions, move, readAll } from './logic.js';
import { LEVELS } from './levels.js';

LEVELS.forEach(({ p }, i) => {
  test(`fase ${i + 1} (${p}) começa errada e tem exatamente uma solução`, () => {
    const g = parse(p);
    assert.equal(evaluate(g), false);
    const sols = solutions(g);
    assert.equal(sols.length, 1);
    assert.equal(evaluate(move(g, sols[0].from, sols[0].to)), true);
  });
});

test('chefão final resolve para 79+28-23=84', () => {
  const g = parse('19+28+23=84');
  const [s] = solutions(g);
  assert.equal(readAll(move(g, s.from, s.to)), '79+28-23=84');
});
