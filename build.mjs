#!/usr/bin/env node

import { build } from "esbuild";
import { clean as cleanPlugin } from "esbuild-plugin-clean";
import copyPlugin from "esbuild-copy-static-files";
import { sassPlugin } from "esbuild-sass-plugin";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import { glob } from "glob";
import path from "path";
import jsonMerge from "esbuild-plugin-json-merge";

import moduleSpec from "./module.json" with { "type": "json" };

/** Convenience variable to determine if this is a development or prodution buld. */
const __DEV__ = process.env.NODE_ENV !== "production" ? true : false;

/**
 * Builds a list of JSON language sources, to be merged during build step.
 */
const languageDefs = await (async () => {
  const templates = (await glob("./src/languages/**/*", { nodir: true })).map(
    (dir) => path.relative("./src/languages", dir)
  );
  const languages = templates
    .map((template) => template.split(path.sep)[0])
    .filter((dir, index, arr) => arr.indexOf(dir) === index);

  return Object.fromEntries(
    languages.map((lang) => [
      lang,
      templates
        .filter((template) => template.split(path.sep)[0] === lang)
        .map((file) => path.join("./src/languages/", file)),
    ])
  );
})();

const results = await build({
  entryPoints: ["./src/module.ts", "./src/styles/module.scss"],
  outdir: "./dist",
  bundle: true,
  platform: "browser",
  define: {
    __DEV__: process.env.NODE_ENV === "production" ? "true" : "false",
    __MODULE_TITLE__: `"${moduleSpec.title}"`,
    __MODULE_ID__: `"${moduleSpec.id}"`,
    __MODULE_VERSION__: `"${moduleSpec.version}"`
  },
  plugins: [
    nodeExternalsPlugin(),
    cleanPlugin({
      patterns: ["./dist/**/*"],
    }),
    copyPlugin({
      src: "./module.json",
      dest: "./dist/module.json",
      dereference: true,
      errorOnExist: false,
      preserveTimestamps: true,
    }),
    sassPlugin(),
    copyPlugin({
      src: "./src/templates",
      dest: "./dist/templates",
      dereference: true,
      errorOnExist: false,
      preserveTimestamps: true,
    }),
    ...Object.entries(languageDefs).map(([lang, entryPoints]) =>
      jsonMerge({
        entryPoints,
        outfile: path.join("./languages", `${lang}.json`),
      })
    ),
  ],
});

if (results.warnings.length) console.warn(results.warnings);
if (results.errors.length) console.error(result.errors);
