import { test } from "node:test";
import assert from "node:assert/strict";
import {
  plans,
  locales,
  documents,
  recommendPlan,
  formatoUrl,
  IFT_VISOR_URL,
  ADDRESS,
  MAPS_URL,
} from "./plans.js";

test("plans carry the published IFT registration numbers", () => {
  assert.deepEqual(
    plans.map((p) => p.ift),
    [2233240, 2233241, 2233242, 2233243, 2233244, 2233245],
  );
});

test("plans keep the published names, speeds and prices", () => {
  assert.deepEqual(
    plans.map((p) => [p.name, p.down, p.up, p.price]),
    [
      ["Básico", 30, 20, 300],
      ["Esencial", 35, 25, 350],
      ["Plus", 50, 40, 400],
      ["Premium", 80, 50, 500],
      ["Ultra", 100, 80, 600],
      ["Max", 150, 100, 800],
    ],
  );
});

test("recommendPlan keeps the current formula", () => {
  assert.equal(recommendPlan(["Trabajar"], "1-2").name, "Básico");
  assert.equal(recommendPlan(["Trabajar", "Estudiar"], "1-2").name, "Plus");
  assert.equal(recommendPlan(["Disfrutar"], "3-4").name, "Plus");
  assert.equal(recommendPlan(["Disfrutar"], "5+").name, "Ultra");
});

test("formatoUrl points at the plan's simplified format", () => {
  assert.equal(
    formatoUrl(plans[2]),
    "/docs/formatos/FormatoSimplificado_2233242.pdf",
  );
});

test("published contact data and localities are unchanged", () => {
  assert.equal(IFT_VISOR_URL, "https://tarifas.ift.org.mx/ift_visor/");
  assert.equal(MAPS_URL, "https://maps.app.goo.gl/N9wUGfgTxWjugjJT7");
  assert.equal(
    ADDRESS,
    "Rafael Mejía Amaral #55, El Botadero, Santiago Ixcuintla, Nayarit, C.P. 63575",
  );
  assert.deepEqual(locales, [
    "El Botadero",
    "Pueblo Nuevo",
    "Villa Juárez",
    "El Carrizo",
  ]);
  assert.equal(documents.length, 5);
});
