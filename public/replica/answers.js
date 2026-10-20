/**
 * Deterministic explanations of the current simulation.
 * This function has no network access, tools, or ability to approve actions.
 */
export function answerQuestion(question, facts = {}) {
  const q = String(question).trim().toLowerCase();
  const arabic = /[\u0600-\u06ff]/u.test(q);
  const done = Array.isArray(facts.done) ? facts.done : [];
  const find = (pattern) => done.find((step) => pattern.test(step.did ?? ''));
  const costs = facts.costs ?? {};
  const say = (english, translation) => arabic ? translation : english;

  if (!facts.incident) {
    return say(
      'Everything is normal. Watch is checking the sensors across downtown and nothing needs fixing right now.',
      'كل شيء طبيعي. يراقب الوكيل أجهزة الاستشعار في وسط المدينة، ولا توجد مشكلة تحتاج إلى إصلاح الآن.',
    );
  }
  if (/cost|money|price|save|cheap|تكلف|سعر|مال|توفير|كم/u.test(q)) {
    if (!costs.repairNow || !costs.ifItBursts) {
      return say('Cost estimates are not available yet.', 'تقديرات التكلفة غير متاحة بعد.');
    }
    return say(
      `Fixing it now costs ${costs.repairNow}. If it bursts it would cost about ${costs.ifItBursts}.${costs.saved ? ` The estimated saving is ${costs.saved}.` : ''}`,
      `تبلغ تكلفة الإصلاح الآن ${costs.repairNow}، بينما تبلغ التكلفة المقدرة عند انفجار الأنبوب ${costs.ifItBursts}.${costs.saved ? ` التوفير المقدر هو ${costs.saved}.` : ''}`,
    );
  }
  if (/crew|team|who|send|dispatch|فريق|طاقم|أرسل|ارسل/u.test(q)) {
    const crew = find(/^Sent Crew 07/);
    if (!crew) return say(
      'No crew has been sent yet. Dispatch chooses an available crew with the required skills once the plan is set.',
      'لم يُرسل فريق بعد. يختار وكيل الإرسال فريقاً متاحاً بالمهارات المطلوبة بعد تحديد الخطة.',
    );
    const alternatives = (crew.compared ?? []).filter((item) => !item.startsWith('CHOSEN'));
    return say(
      `${crew.did}.${crew.detail ? ` ${crew.detail}.` : ''}${alternatives.length ? ` Alternatives considered: ${alternatives.join('; ')}.` : ''}`,
      `سجّل وكيل الإرسال إرسال الفريق 07. تفاصيل القرار كما وردت في المحاكاة: ${crew.did}${crew.detail ? ` — ${crew.detail}` : ''}`,
    );
  }
  if (/hospital|school|safe|ambulance|people|مستشفى|مدرس|سلام|سكان|إسعاف/u.test(q)) {
    const incident = facts.incident;
    const population = Number.isFinite(incident.peopleAffected)
      ? incident.peopleAffected.toLocaleString(arabic ? 'ar-AE' : 'en-US')
      : null;
    const nearby = (incident.nearby ?? []).join('; ');
    const mitigation = done.filter((step) => /rerout|bypass|ambulance|lane.*open/i.test(`${step.did} ${step.detail}`));
    return say(
      `${population ? `${population} people rely on this pipe. ` : ''}${nearby ? `Nearby: ${nearby}. ` : ''}${mitigation.length ? `Recorded actions: ${mitigation.map((step) => step.did).join('; ')}.` : 'No protective action has been recorded yet; the agents are still assessing the incident.'}`,
      `${population ? `يعتمد ${population} شخص على هذا الأنبوب. ` : ''}${nearby ? `المرافق القريبة حسب المحاكاة: ${nearby}. ` : ''}${mitigation.length ? `الإجراءات المسجلة: ${mitigation.map((step) => step.did).join('؛ ')}.` : 'لم يُسجّل إجراء وقائي بعد؛ لا يزال الوكلاء يقيّمون الحادث.'}`,
    );
  }
  if (/road|traffic|lane|close|طريق|مرور|مسار|شارع/u.test(q)) {
    const road = find(/lane|closure|Close/);
    return road
      ? say(`${road.did}${road.detail ? `: ${road.detail}` : ''}.`, `حالة الطريق المسجلة: ${road.did}${road.detail ? ` — ${road.detail}` : ''}.`)
      : say('No road closure has been decided yet.', 'لم يُتخذ قرار بإغلاق الطريق بعد.');
  }
  if (/fix|replace|clamp|why|plan|choose|chose|approve|إصلاح|اصلاح|خطة|لماذا|موافق/u.test(q)) {
    const plan = find(/^Going to/);
    if (plan) return say(
      `${plan.did}.${plan.detail ? ` ${plan.detail}.` : ''}`,
      `الخطة المسجلة في المحاكاة: ${plan.did}${plan.detail ? ` — ${plan.detail}` : ''}.`,
    );
    if (facts.waitingFor) return say(
      `${facts.waitingFor.question ?? 'The simulation is waiting for your decision.'} ${facts.waitingFor.why ?? ''} Use the approval controls to decide; this answer cannot approve an action.`.trim(),
      `المحاكاة تنتظر قرارك: ${facts.waitingFor.question ?? ''} ${facts.waitingFor.why ?? ''} استخدم أزرار الموافقة لاتخاذ القرار؛ لا يمكن لهذه الإجابة الموافقة على إجراء.`,
    );
    return say('The agents are still working out the best fix.', 'لا يزال الوكلاء يحددون أفضل طريقة للإصلاح.');
  }
  const latest = done.at(-1);
  return latest
    ? say(`Latest: ${latest.agent} — ${latest.did}.`, `آخر إجراء مسجل: ${latest.agent} — ${latest.did}.`)
    : say('The agents are looking into the incident.', 'يبحث الوكلاء في الحادث حالياً.');
}
