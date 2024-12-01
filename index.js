#!/usr/bin/env node

import { program } from "commander";

program
    .version("1.0.0")
    .description("Todo CLI")
    .option("-n, --name <type>", "Add your name")
    .action((option) => {
        console.log(option.name)
    })

program.parse(process.argv)

