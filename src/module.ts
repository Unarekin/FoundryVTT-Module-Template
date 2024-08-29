import moduleSpec from '../module.json';

Hooks.on("ready", () => {
  console.log(`${moduleSpec.title} ready!`);
})