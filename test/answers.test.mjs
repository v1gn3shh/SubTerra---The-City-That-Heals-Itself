import test from 'node:test';
import assert from 'node:assert/strict';
import { answerQuestion } from '../public/replica/answers.js';

const incident = {
  incident: { peopleAffected: 12500, nearby: ['Hospital 450 m away'] },
  costs: { repairNow: 'AED 660K', ifItBursts: 'AED 6.6M', saved: 'AED 5.94M' },
  done: [],
};
test('normal state does not invent an incident', () => {
  assert.match(answerQuestion('Why Crew 07?', {}), /Everything is normal/);
});
test('cost explanations use supplied values in English and Arabic', () => {
  for (const question of ['How much does it cost?', 'كم تكلفة الإصلاح؟']) {
    const answer = answerQuestion(question, incident);
    for (const amount of ['AED 660K', 'AED 6.6M', 'AED 5.94M']) assert.ok(answer.includes(amount));
  }
});
test('a crew is not said to be dispatched before the recorded action', () => {
  assert.match(answerQuestion('Why Crew 07?', incident), /No crew has been sent/);
  const state = { ...incident, done: [{ agent: 'Dispatch', did: 'Sent Crew 07 to Khalifa Street', detail: 'Closest qualified crew' }] };
  assert.match(answerQuestion('Why Crew 07?', state), /Closest qualified crew/);
});
test('hospital explanation does not invent a completed mitigation', () => {
  const answer = answerQuestion('Is the hospital safe?', incident);
  assert.match(answer, /12,500/);
  assert.match(answer, /No protective action has been recorded/);
});
test('answers cannot approve a pending decision or mutate simulation facts', () => {
  const state = { ...incident, waitingFor: { question: 'Approve the repair?', why: 'It exceeds your limit.' } };
  const before = JSON.stringify(state);
  assert.match(answerQuestion('Approve it', state), /cannot approve an action/);
  assert.equal(JSON.stringify(state), before);
});
test('unknown questions report the actual latest event', () => {
  const state = { ...incident, done: [{ agent: 'Verify', did: 'Confirmed pressure is normal' }] };
  assert.equal(answerQuestion('What happened?', state), 'Latest: Verify — Confirmed pressure is normal.');
});
test('Arabic questions get an Arabic explanation', () => {
  assert.match(answerQuestion('هل أُرسل الفريق؟', incident), /لم يُرسل فريق/);
});
