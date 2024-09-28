#!/usr/bin/env node

import path from "path";
import { fork } from "child_process";

import packageConfig from "./package.json" with { type: "json" };

fork(path.join(packageConfig.testing.foundryLocation, "resources/app/main.js"));
