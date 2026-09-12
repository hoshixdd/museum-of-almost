import assert from "node:assert/strict";
import { test } from "node:test";
import { isCrisisText, moderateAdvice, moderateText, sanitizeLocation } from "./moderate.ts";

test("rejects crisis writing without publishing", () => {
  const result = moderateText("I want to kill myself tonight and I don't know who to tell.");
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.crisis, true);
  assert.equal(isCrisisText("kms later"), true);
});

test("rejects streets and emails", () => {
  assert.equal(moderateText("Meet me at 14 Maple Street tomorrow evening please.").ok, false);
  assert.equal(moderateText("Write to me at hello@example.com when you can, ok?").ok, false);
  assert.equal(sanitizeLocation("14 Maple Ave"), null);
  assert.equal(sanitizeLocation("Manila"), "Manila");
});

test("allows ordinary letters", () => {
  const result = moderateText("I still have the draft in my notes app. I never hit send.");
  assert.equal(result.ok, true);
});

test("stranger wall blocks advice but not I should have stayed", () => {
  assert.equal(moderateAdvice("You should move on from them.").ok, false);
  assert.equal(moderateAdvice("I should have stayed that night.").ok, true);
});
