import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";

import * as tmpls from "./tmpls.ts";

const TEST_YEAR = "2099";
const TEST_DAY = "01";
const TEST_DIRNAME = `./${TEST_YEAR}/${TEST_DAY}`;

const TEST_LANGS = ["ts", "go", "py"] as const;

const status = await Promise.all([
  await Deno.permissions.request({ name: "run" }),
  await Deno.permissions.request({ name: "read" }),
  await Deno.permissions.request({ name: "write" }),
]);
if (status.every(({ state }) => state === "granted")) {
  Deno.test("Start task generates valid code", async () => {
    for (const l of TEST_LANGS) {
      const process = await Deno.run({
        cmd: [
          "deno",
          "run",
          "-A",
          "tasks/start/main.ts",
          "--lang",
          l,
          "--day",
          TEST_DAY,
          "--year",
          TEST_YEAR,
        ],
      });

      const status = await process.status();
      assertEquals(status.code, 0);
      assertEquals(
        // @ts-ignore: Deno doesn't know how to type-check `import * as tmpls`.
        tmpls[l](TEST_YEAR, TEST_DAY),
        Deno.readTextFileSync(`${TEST_DIRNAME}/solutions/${l}/main.${l}`),
      );

      await process.close();
      await Deno.remove(TEST_DIRNAME, { recursive: true });
    }
  });
}
