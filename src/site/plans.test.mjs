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
  PORTAL_URL,
  validateHolderName,
  adminWhatsappUrl,
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

test("every plan carries the single description and use shown on all pages", () => {
  for (const p of plans) {
    assert.ok(p.desc && p.desc.endsWith("."), `${p.name} desc`);
    assert.ok(p.use, `${p.name} use`);
  }
});

test("Plus keeps the approved description", () => {
  assert.equal(
    plans.find((p) => p.name === "Plus").desc,
    "Para estudiar, trabajar y ver contenido en línea.",
  );
});

test("documents use the wording the PDFs support", () => {
  const titles = documents.map(([title]) => title).join(" | ");
  assert.doesNotMatch(titles, /aprobado/i);
  assert.match(titles, /Contrato de adhesión registrado ante Profeco/);
});

test("client portal URL", () => {
  assert.equal(PORTAL_URL, "https://clientes.redixc.net/");
});

test("holder name accepts real names and normalizes spacing", () => {
  for (const [raw, name] of [
    ["  María   José  Peña ", "María José Peña"],
    ["José Ángel O'Connor", "José Ángel O'Connor"],
    ["Ana-Luisa Ruíz Jr.", "Ana-Luisa Ruíz Jr."],
    ["Ma. Guadalupe", "Ma. Guadalupe"],
    ["Ñañez\nLópez", "Ñañez López"],
  ]) {
    assert.deepEqual(validateHolderName(raw), { name, error: null }, raw);
  }
});

test("holder name rejects markup, scripts and other characters", () => {
  for (const raw of [
    "",
    "   ",
    "Al",
    "<script>alert(1)</script>",
    "Juan <b>",
    'Juan" onmouseover="x',
    "javascript:alert(1)",
    "Juan & Ana",
    "Juan 123",
    "Juan 😀",
    "Juan%0aHola",
    "Juan/Ana",
    "-Juan",
    "a".repeat(81),
  ]) {
    assert.ok(validateHolderName(raw).error, JSON.stringify(raw));
  }
});

test("Administración WhatsApp link carries the encoded holder name", () => {
  const url = new URL(adminWhatsappUrl("María Peña"));
  assert.equal(url.origin + url.pathname, "https://wa.me/523338454848");
  assert.equal(
    url.searchParams.get("text"),
    "Hola, Administración de Redixc. No conozco mi usuario o contraseña del portal de clientes. El servicio está a nombre de María Peña. ¿Me pueden ayudar?",
  );
});
