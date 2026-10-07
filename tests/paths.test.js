const test = require("node:test");
const assert = require("node:assert/strict");
const P = require("../paths-data");
const M = require("../core");
function allResults() {
  return P.issues.flatMap((issue) =>
    Object.values(P.trees[issue.id].nodes)
      .filter((n) => n.kind === "result")
      .map((node) => ({ issue, node })),
  );
}
function recordPlan() {
  const { issue, node } = allResults().find(({ node }) => !node.plan.care);
  return {
    id: M.uid(),
    issueId: issue.id,
    nodeId: node.id,
    ...JSON.parse(JSON.stringify(node.plan)),
    sourceIds: issue.sources,
    createdAt: new Date().toISOString(),
    done: false,
    notes: "Una prova utile",
  };
}
test("catalog covers 36 distinct problems in seven areas with complete references", () => {
  assert.equal(P.issues.length, 36);
  assert.equal(new Set(P.issues.map((i) => i.id)).size, 36);
  assert.equal(P.groups.length, 7);
  assert.equal(P.validate(), true);
  for (const s of Object.values(P.sources)) {
    assert.ok(s.url.startsWith("https://"));
    assert.ok(s.title && s.kind && s.note);
  }
});
test("every possible answer path terminates in at most three questions without cycles", () => {
  for (const issue of P.issues) {
    const tree = P.trees[issue.id];
    let leaves = 0;
    function visit(state, questions) {
      const node = tree.nodes[state.current];
      if (node.kind === "result") {
        leaves++;
        assert.ok(questions <= 3);
        assert.equal(P.getResult(state), node.plan);
        return;
      }
      for (let i = 0; i < node.options.length; i++) {
        const next = P.advance(state, i);
        assert.equal(next.trail.length, questions + 1);
        visit(next, questions + 1);
      }
    }
    visit(P.start(issue.id), 0);
    assert.ok(leaves >= 4);
  }
  assert.equal(allResults().length, 293);
});
test("backtracking discards downstream answers and permits a different branch", () => {
  let s = P.start("blocco");
  s = P.advance(s, 0);
  s = P.advance(s, 0);
  const before = s;
  s = P.advance(s, 0);
  assert.ok(P.getResult(s));
  s = P.back(s);
  assert.deepEqual(s, before);
  s = P.back(s);
  s = P.advance(s, 1);
  assert.notEqual(s.current, before.current);
  assert.equal(P.getResult(s), null);
  assert.throws(() => P.advance(s, 9));
});
test("every outcome provides an action, evaluation and fallback with valid related issues", () => {
  for (const { issue, node } of allResults()) {
    const p = node.plan;
    assert.equal(p.steps.length, 3);
    assert.ok(p.steps.every((s) => typeof s === "string" && s.length > 15));
    assert.ok(p.check.length > 15);
    assert.ok(p.fallback.length > 15);
    assert.ok(issue.sources.length);
    assert.ok(p.related.every((id) => P.issues.some((i) => i.id === id)));
  }
});
test("wellbeing outcomes offer support rather than a timed productivity prescription", () => {
  const care = allResults().filter(({ node }) => node.plan.care);
  assert.equal(care.length, 3);
  for (const { issue, node } of care) {
    assert.equal(node.plan.duration, null);
    assert.equal(node.plan.tool, "home");
    assert.equal(node.plan.mode, "sostegno");
    assert.ok(issue.sources.includes("stress"));
  }
});
test("catalog filters by area and question vocabulary", () => {
  assert.ok(P.list("dialoghi").some((i) => i.id === "dialoghi"));
  assert.equal(P.list("", "Personaggi e mondo").length, 5);
  assert.equal(P.list("xyz-impossibile").length, 0);
  assert.ok(P.list("paura").length > 0);
});
test("saved guidance survives export and import with fresh record IDs and no manuscript edits", () => {
  const p = M.project("Progetto", "Testo intatto");
  p.guidancePlans = [recordPlan()];
  p.guidancePlans[0].done = true;
  const db = { version: 2, active: p.id, projects: [p] };
  M.validate(db);
  const imported = M.parseImport(
    "backup.json",
    new TextEncoder().encode(JSON.stringify(db)),
  )[0];
  assert.notEqual(imported.guidancePlans[0].id, p.guidancePlans[0].id);
  assert.equal(imported.guidancePlans[0].notes, "Una prova utile");
  assert.equal(imported.guidancePlans[0].done, true);
  assert.equal(imported.guidancePlans[0].nodeId, p.guidancePlans[0].nodeId);
  assert.equal(imported.chapters[0].scenes[0].text, "Testo intatto");
});
test("invalid guidance imports are rejected before changing data", () => {
  for (const mutate of [
    (g) => (g.steps = "not an array"),
    (g) => (g.done = "yes"),
    (g) => (g.tool = "https://example.com"),
    (g) => (g.notes = "x".repeat(20001)),
    (g) => (g.duration = -5),
  ]) {
    const p = M.project();
    const g = recordPlan();
    mutate(g);
    p.guidancePlans = [g];
    assert.throws(() =>
      M.validate({ version: 2, active: p.id, projects: [p] }),
    );
  }
});
