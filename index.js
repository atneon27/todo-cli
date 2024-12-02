#!/usr/bin/env node

import { Command } from "commander";
const program = new Command();

let task_storage = {};

program
  .name("todo-cli")
  .description("Todo CLI")
  .version("1.0.0")

program.command("add")
  .description("Add task/tasks")
  .argument('<tasks...>', 'Task to add')
  .action((tasks) => {
    const date = new Date().toLocaleDateString();
    if (!task_storage[date]) {
        task_storage[date] = [];
    }
    task_storage[date].push(...tasks);
    console.log(task_storage)
  });

  program.parse();
