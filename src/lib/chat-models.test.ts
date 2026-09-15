import { expect, test } from "bun:test";
import { catalogModelsFor } from "./chat-models";

const free = {
  id: 2,
  slug: "free",
  defaultVariants: ["low", "high", "max"] as string[] | null,
  models: {
    "shk-combo": { variants: ["low", "high", "max"] },
    "legacy-combo": { displayName: "Legacy Combo" },
  },
};

test("keyless catalog models are pickable when the user has no connection", () => {
  const out = catalogModelsFor([free], new Set([99]));
  expect(out.map((m) => m.id)).toEqual(["shk-combo", "legacy-combo"]);
  expect(out[0]).toMatchObject({
    chef: "free",
    chefSlug: "free",
    providers: ["free"],
    variants: ["low", "high", "max"],
  });
  expect(out[1].name).toBe("Legacy Combo");
});

test("a keyless provider the user connected to is not duplicated from the catalog", () => {
  expect(catalogModelsFor([free], new Set([2]))).toEqual([]);
});

test("empty catalog yields nothing", () => {
  expect(catalogModelsFor([{ ...free, models: {} }], new Set([]))).toEqual([]);
});