#!/usr/bin/env node

import { Command } from "commander";
import fs from 'fs';

// we can use fs/promise to use async/await in fs

function updateJSON(json_path, logicCallback, finalCallback) {
  fs.readFile(json_path, 'utf-8', (readErr, dataString) => {
    if(readErr) {
      finalCallback(readErr)
    }

    let object
    try {
      object = JSON.parse(dataString)
    } catch(parsErr) {
      finalCallback(parsErr)
    }

    object = logicCallback(object)

    fs.writeFile(json_path, JSON.stringify(object), 'utf-8', (writeErr) => {
      if(writeErr) {
        finalCallback(writeErr)
      } else {
        finalCallback(null, "Success")
      }
    })
  })
}

function readJSON(json_path, readCallback, errCallback) {
  fs.readFile(json_path, 'utf-8', (err, dataString) => {
    if(err) {
      errCallback(err)
      return
    }

    try {
      const data = JSON.parse(dataString)
      readCallback(data)
    } catch(readErr) {
      errCallback(readErr)
    }
  })
}

const program = new Command();
const json_path = "/home/aryan/folsep/100x/project/todo-cli/task.json"
const date = new Date().toLocaleDateString()

program
  .name("todo-cli")
  .description("Todo CLI")
  .version("1.0.0")

program.command("add")
  .description("Add task/tasks")
  .argument('<tasks...>', 'Task to add')
  .action((tasks) => {
    fs.readFile(json_path, 'utf-8', (err, dataString) => {
      if(err) {
        console.log(err)
      } else {
        const data = JSON.parse(dataString)
        
        if(!data.global[date]) {
          data.global[date] = []
        } 

        data.global[date].push(...tasks)

        fs.writeFile(json_path, JSON.stringify(data), (err) => {
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
    fs.readFile(json_path, 'utf-8', (err, taskString) => {
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

    updateJSON(json_path, (object) => {
      if(!object.global[date]) {
        object.global[date] = []
      }

      object.global[date].push({
        id: object.global[date].length + 1,
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


program.command("today")
  .description("list all present day tasks")
  .action(() => {
    readJSON(json_path, (data) => {
      const val = data.global[date]
      for(let i = 0; i < val.length; i++) {
        // format printing
        console.log(val[i].id, val[i].title, val[i].description)
      }
    }, (err) => {
      console.log(err)
    })
  })

program.command("complete")
  .description("list all list all completed tasks for today")
  .action(() => {
    readJSON(json_path, (data) => {
      const val = data.global[date]
      for(let i = 0; i < val.length; i++) {
        if(val[i].completed === true) {
          // format printing
          console.log(val[i].id, val[i].title, val[i].description)
        }
      }
    }, (err) => {
      console.log(err)
    })
  })

program.command("incomplete")
  .description("list all the incomplete tasks for today")
  .action(() => {
    readJSON(json_path, (data) => {
      const val = data.global[date]
      for(let i = 0; i < val.length; i++) {
        if(val[i].completed === false) {
          console.log(val[i].id, val[i].title, val[i].description)
        }
      }
    })
  })

program.command("find")
  .description("find the task on the basis of title")
  .option('-t, --title <title>', 'Task Title')
  .action((option) => {
    if(!option.title) {
      console.log("error: no title")
      return
    }

    readJSON(json_path, (data) => {
      const val = data.global[date]
      const task = val.find((obj) => {
        return obj.title == option.title
      })

      console.log(task.id, task.title, task.description, task.completed)
    }, (err) => {
      console.log(err)
    })
  })

program.command("mark")
  .description("marks the give title as completed")
  .option('-t, --title <title>', 'Task Title')
  .action((option) => {
    if(!option.title) {
      console.log("error: no title")
      return
    }

    updateJSON(json_path, (data) => {
      let tasks = data.global[date]
      
      for(let i = 0; i < tasks.length; i++) {
        if(tasks[i].title === option.title) {
          tasks[i].completed = true
        }
      }

      data.global[date] = tasks
      return data
    }, (err, msg) => {
      if(err) {
        console.log(err)
      } else {
        console.log(msg)
      }
    })
    
  })

program.parse();
