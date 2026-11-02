import {
  access,
  copyFile,
  mkdir,
  readdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import { resolve } from "node:path";

// The standalone landing is canonical. Sync only the explicit portable boundary.
const canonical = resolve(import.meta.dirname, "..");
const web = resolve(
  process.env.FINFLOW_WEB_DIR || resolve(canonical, "../finflow/apps/web"),
);
await access(resolve(web, "index.html"));
await access(resolve(web, "src/main.tsx"));
const source = resolve(canonical, "src/components/landing");
const target = resolve(web, "src/components/landing");
await mkdir(target, { recursive: true });
for (const name of await readdir(source))
  await copyFile(resolve(source, name), resolve(target, name));
await mkdir(resolve(web, "public/fonts"), { recursive: true });
for (const name of ["geist-latin.woff2", "OFL.txt"])
  await copyFile(
    resolve(canonical, "public/fonts", name),
    resolve(web, "public/fonts", name),
  );
const publicHtml = await readFile(resolve(canonical, "index.html"), "utf8");
const init = publicHtml.match(
  /<script id="finflow-theme-init">[\s\S]*?<\/script>/,
)?.[0];
if (!init) throw new Error("Theme initialization script is missing");
const htmlPath = resolve(web, "index.html");
let html = await readFile(htmlPath, "utf8");
html = html.replace(
  /\s*<script id="finflow-theme-init">[\s\S]*?<\/script>\s*/,
  "\n    ",
);
html = html.replace(
  /<meta name="theme-color" content="[^"]*"\s*\/>/,
  `<meta name="theme-color" content="#fafafa" />\n    ${init}`,
);
await writeFile(htmlPath, html);
console.log(
  "Synced portable landing components, self-hosted font and pre-render theme bootstrap to apps/web.",
);
