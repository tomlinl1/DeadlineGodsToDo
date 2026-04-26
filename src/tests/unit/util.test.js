import { parseTags, priorityValue } from "../../util/util.js";

describe("util helpers", () => {
  test("parseTags returns [] for empty input", () => {
    expect(parseTags("")).toEqual([]);
    expect(parseTags(null)).toEqual([]);
    expect(parseTags(undefined)).toEqual([]);
  });

  test("parseTags splits, trims, and removes empties", () => {
    expect(parseTags(" homework, math , ,exam ,, ")).toEqual([
      "homework",
      "math",
      "exam",
    ]);
  });

  test("priorityValue orders high < medium < low numerically", () => {
    expect(priorityValue("high")).toBeLessThan(priorityValue("medium"));
    expect(priorityValue("medium")).toBeLessThan(priorityValue("low"));
  });

  test("priorityValue defaults to medium for unknown values", () => {
    expect(priorityValue("unknown")).toBe(priorityValue("medium"));
    expect(priorityValue(undefined)).toBe(priorityValue("medium"));
  });
});

