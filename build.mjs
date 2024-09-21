#!/usr/bin/env node

import { build } from "esbuild";
import { clean as cleanPlugin } from "esbuild-plugin-clean";
import copyPlugin from "esbuild-copy-static-files";
import { sassPlugin } from "esbuild-sass-plugin";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import jsonMerge from "esbuild-plugin-json-merge";
import path from "path";
import { promises as fs } from "fs";
import { deepmerge } from "deepmerge-ts";
import yoctoSpinner from "yocto-spinner";
import { ESLint } from "eslint";

/** Paths */
const SRC_PATH = "./src";
const LANG_PATH = path.join(SRC_PATH, "languages");
const OUT_PATH = "./dist";
const STYLE_PATH = path.join(SRC_PATH, "styles");
const TEMPLATE_PATH = path.join(SRC_PATH, "templates");

<<<<<<< HEAD
// Import module.json for some config options
import moduleConfig from "./module.json" assert { type: "json" };

// Constants to be inserted into process.env during build
const __DEV__ = process.env.NODE_ENV !== "production";
const __MODULE_TITLE__ = moduleConfig.title;
const __MODULE_ID__ = moduleConfig.id;
const __MODULE_VERSION__ = moduleConfig.version;

const start = Date.now();
let spinner = null;

=======
/** Build a simple version of the copy plugin with default settings */
function simpleCopy(src, dest) {
  return copyPlugin({
    src,
    dest,
    dereference: true,
    errorOnExist: false,
    preserveTimestamps: true,
  });
}

// Import module.json for some config options
import moduleConfig from "./module.json" assert { type: "json" };

// Constants to be inserted into process.env during build
const __DEV__ = process.env.NODE_ENV !== "production";
const __MODULE_TITLE__ = moduleConfig.title;
const __MODULE_ID__ = moduleConfig.id;
const __MODULE_VERSION__ = moduleConfig.version;

const start = Date.now();
let spinner = null;

>>>>>>> 07e0103 (Updating build)
if (!process.argv.slice(2).includes("--no-lint")) {
  const lintStart = Date.now();
  spinner = yoctoSpinner({ text: "Linting..." }).start();

  const linter = new ESLint({
    cache: true,
    errorOnUnmatchedPattern: false,
  });
  const lintResults = await linter.lintFiles(["src/**.ts", "src/*/**.ts"]);
  await ESLint.outputFixes(lintResults);

  let formatter = await linter.loadFormatter("html");
  await fs.writeFile("./lint-report.html", formatter.format(lintResults));

  const hasErrors = lintResults.findIndex((result) => result.errorCount) !== -1;
  if (hasErrors) {
    spinner.error("Linting errors found!");
    formatter = await linter.loadFormatter("stylish");
    console.log(formatter.format(lintResults));
    process.exit();
  } else {
    spinner.success(
      `Linting passed in ${((Date.now() - start) / 1000).toFixed(2)}s`
    );
  }
}

const buildStart = Date.now();
spinner = yoctoSpinner({ text: "Building..." }).start();
const jsonMergers = (
  await fs.readdir(LANG_PATH, { withFileTypes: true })
).reduce((prev, curr) => {
  if (curr.isDirectory())
    return [
      ...prev,
      jsonMerge({
        entryPoints: [path.join(LANG_PATH, curr.name, "*.json")],
        outfile: path.join("languages", `${curr.name}.json`),
        merge: (items) => deepmerge(...items),
      }),
    ];
  else return prev;
}, []);

<<<<<<< HEAD
// Create our copy plugins, ensuring that the paths we're copying from exist
const STATIC_FILES = [
  { src: "./module.json", dest: "module.json" },
  { src: "./system.json", dest: "system.json" },
  { src: "./LICENSE", dest: "LICENSE" },
  { src: "./README.md", dest: "README.md" },
  { src: path.join(SRC_PATH, "fonts"), dest: "fonts" },
  { src: TEMPLATE_PATH, dest: "templates" },
  { src: STYLE_PATH, dest: "styles" },
];

const copyPlugins = [];
for (const file of STATIC_FILES) {
  try {
    const stat = await fs.stat(file.src);
    copyPlugins.push(
      copyPlugin({
        src: file.src,
        dest: path.join(OUT_PATH, file.dest),
        dereference: true,
        errorOnExists: false,
        preserveTimestamps: true,
      })
    );
  } catch (err) {
    // ignore ENOENT, throw others
    if (err.code === "ENOENT") {
      console.warn(`Attempting to copy non-existent file: ${file.src}`);
    } else {
      throw err;
    }
  }
}

=======
>>>>>>> 07e0103 (Updating build)
const buildResults = await build({
  entryPoints: [
    path.join(SRC_PATH, "module.ts"),
    path.join(STYLE_PATH, "module.scss"),
  ],
  outdir: OUT_PATH,
  sourcemap: __DEV__,
  bundle: true,
  platform: "browser",
  minify: !__DEV__,
  define: {
    __DEV__: __DEV__ === true ? "true" : "false",
    __MODULE_TITLE__: `"${__MODULE_TITLE__}"`,
    __MODULE_ID__: `"${__MODULE_ID__}"`,
    __MODULE_VERSION__: `"${__MODULE_VERSION__}"`,
  },
  external: ["*.woff", "*.woff2", "*.otf", "*.ttf", "*.webp"],
  plugins: [
    nodeExternalsPlugin(),
<<<<<<< HEAD
<<<<<<< HEAD
    cleanPlugin({ patterns: "./dist/**" }),
    sassPlugin(),
    ...copyPlugins,
    ...jsonMergers,
=======
    cleanPlugin({
      patterns: ["./dist/**/*"],
    }),
    sassPlugin(),
    copyPlugin({
      src: "./module.json",
      dest: "./dist/module.json",
      dereference: true,
      errorOnExist: false,
      preserveTimestamps: true,
    }),
    copyPlugin({
      src: "./src/templates",
      dest: "./dist/templates",
      dereference: true,
      errorOnExist: false,
      preserveTimestamps: true,
    }),
    copyPlugin({
      src: "./LICENSE",
      dest: "./dist/LICENSE",
      dereference: true,
      errorOnExist: false,
      preserveTimestamps: true,
    }),
        copyPlugin({
      src: "./README.md",
      dest: "./dist/README.md",
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
>>>>>>> c877579 (Updated build, module.json, etc)
=======
    cleanPlugin({ patterns: "./dist/**" }),
    sassPlugin(),
    simpleCopy("./module.json", path.join(OUT_PATH, "module.json")),
    simpleCopy(TEMPLATE_PATH, path.join(OUT_PATH, "templates")),
    simpleCopy(path.join(SRC_PATH, "fonts"), path.join(OUT_PATH, "fonts")),
    simpleCopy("./LICENSE", path.join(OUT_PATH, "LICENSE")),
    simpleCopy("./README.md", path.join(OUT_PATH, "README.md")),
    ...jsonMergers,
>>>>>>> 07e0103 (Updating build)
  ],
});

if (buildResults.errors.length) {
  spinner.error("Build failed!");
  console.error(buildResults.errors);
} else {
  spinner.success(
    `Build completed in ${((Date.now() - buildStart) / 1000).toFixed(2)}s`
  );
  if (buildResults.warnings.length) console.warn(buildResults.warnings);
}
