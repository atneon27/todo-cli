#!/usr/bin/env node

import { Command } from "commander";
import fs from 'fs';

// we can use fs/promise to use async/await in fs

function updateJSON(path, updateCallback, finalCallback) {
  fs.readFile(path, 'utf-8', (readErr, dataString) => {
    if(readErr) {
      finalCallback(readErr)
    }

    let object
    try {
      object = JSON.parse(dataString)
    } catch(parsErr) {
      finalCallback(parsErr)
    }

    object = updateCallback(object)

    fs.writeFile(path, JSON.stringify(object), 'utf-8', (writeErr) => {
      if(writeErr) {
        finalCallback(writeErr)
      } else {
        finalCallback(null, "Success")
      }
    })
  })
}

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

program.command("task")
  .option('-t, --title <title>', 'Task Title')
  .option('-d, --description <description...>', 'Task Descriptiond')
  .action((option) => {
    if(!option.title)  {
      console.log("No task title passed!")
      return
    }
    else if(!option.description) {
      console.log("No task description passed!")
      return
    }

    const date = new Date().toLocaleDateString()

    updateJSON('./task.json', (object) => {
      if(!object.global[date]) {
        object.global[date] = []
      }

      object.global[date].push({
        id: 1,
        title: option.title,
        description: option.description.join(" "),
        completed: false
      })

      return object
    }, (err, msg) => {
      if(err) {
        console.error(err)
      } else {
        console.log(msg)
      }
    })
  })

program.parse();
