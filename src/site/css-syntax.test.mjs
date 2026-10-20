// Vite's CSS minifier (esbuild) warns «Unexpected whitespace» when a selector
// function such as :is( is followed by a line break, the way Prettier wraps
// long selectors. Write those rules as plain selector lists instead.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL(".", import.meta.url));

test("no selector function opens with a line break", () => {
  const offenders = readdirSync(dir)
    .filter((f) => f.endsWith(".css"))
    .flatMap((f) =>
      readFileSync(dir + f, "utf8")
        .split("\n")
        .map((line, i) => [f, i + 1, line])
        .filter(([, , line]) => /:(is|where|not|has)\(\s*$/.test(line))
        .map(([file, n]) => `${file}:${n}`),
    );
  assert.deepEqual(offenders, []);
});
