"use strict";
(() => {
  // src/module.ts
  Hooks.on("ready", () => {
    console.log(`${"New Module"} ready!`);
  });
})();