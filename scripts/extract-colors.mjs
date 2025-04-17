import { join, resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { transpileModule } from "typescript";
import colors from "tailwindcss/colors.js";

const configPath = join(process.cwd(), "tailwind.config.ts");
const outputPath = join(process.cwd(), "constants", "colors.ts");
const config = readFileSync(configPath, "utf-8");
const transpiled = transpileModule(config, {
  compilerOptions: { module: "ESNext" },
});

let store;
let keys;
let toEval = transpiled.outputText
  .split("theme:")[1]
  .split("plugins:")[0]
  .split(",");
const extractedColors = [];

toEval.pop();

eval("store = " + toEval.join(","));
keys = Object.keys(store.extend.colors);

keys.forEach((key, index) => {
  const value = store.extend.colors[key];
  if (typeof value === "object" && value !== null) {
    extractedColors.push(`\n  ${key}: {`);
    Object.keys(value).forEach((nestedKey) => {
      extractedColors.push(`\n    ${nestedKey}: "${value[nestedKey]}",`);
    });
    extractedColors.push("\n  }" + (index < keys.length - 1 ? "," : ""));
  } else if (typeof value === "string") {
    extractedColors.push(
      `\n  ${key}: "${value}"` + (index < keys.length - 1 ? "," : ""),
    );
  }
});

const code =
  "const colors = {" +
  extractedColors.join("") +
  ",\n}\n\n" +
  "export default colors;";

writeFileSync(outputPath, code, "utf-8");
