#!/usr/bin/env node

import { Command } from "commander";
import fs from 'fs'

const program = new Command();

program
  .name("todo-cli")
  .description("Todo CLI")
  .version("1.0.0")

program.command("add")
  .description("Add task/tasks")
  .argument('<tasks...>', 'Task to add')
  .action((tasks) => {
    const date = new Date().toLocaleDateString()
    
    fs.readFile('./task.json', 'utf-8', (err, dataString) => {
      if(err) {
        console.log(err)
      } else {
        const data = JSON.parse(dataString)
        
        if(!data.global[date]) {
          data.global[date] = []
        } 

        data.global[date].push(...tasks)

        fs.writeFile('./task.json', JSON.stringify(data), (err) => {
          if(err) {
            console.log(err)
          } else {
            console.log("task added")
          }
        })
      }
    })
  });

program.command("global")
  .description("Show all global task")
  .action(function() {
    fs.readFile('./task.json', 'utf-8', (err, taskString) => {
      if(err) {
        console.log(err)
      } else {
        console.log(JSON.parse(taskString))
      }
    })
  })

program.parse();
