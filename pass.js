const readline = require('readline');
const fs = require('fs');

// Define file paths
const taskFilePath = '/home/colsonk/NodeJS/pass/nodejsJavascriptSaveBarebonesListFile.json';
const userFilePath = '/home/colsonk/NodeJS/pass/barebonesFakePassword&UsernameLogin———thing.json';

// Initialize list and variables
let list = [[]];
let usri = [];
let usingList = 0;
let lost = true;

// Check if task file exists and read or create it
if (fs.existsSync(taskFilePath)) {
  try {
    const fileData = fs.readFileSync(taskFilePath, 'utf8');
    list = JSON.parse(fileData);
    console.log("Task file loaded successfully.");
  } catch (error) {
    console.error("Error reading task file:", error);
  }
} else {
  fs.writeFileSync(taskFilePath, JSON.stringify(list, null, 2));
  console.log("No task file found, creating a new one.");
}

// Check if user data file exists and read or create it
if (fs.existsSync(userFilePath)) {
  try {
    const fileData = fs.readFileSync(userFilePath, 'utf8');
    usri = JSON.parse(fileData);
    console.log("User data loaded successfully.");
  } catch (error) {
    console.error("Error reading user data:", error);
  }
} else {
  fs.writeFileSync(userFilePath, JSON.stringify([], null, 2));
  console.log("No user data found. A new file has been created.");
}

// Set up terminal input for user actions
const ql = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask for username and password, then check access
function askForCredentials() {
  ql.question("Enter your username: ", (username) => {
    ql.question("Enter your password: ", (password) => {
      checkAccess(username, password);
    });
  });
}

// Check user access
function checkAccess(u, p) {
  const user = usri.find(entry => entry.username === u && entry.password === p);
  if (user) {
    console.log(`Welcome back, ${u}!`);
    runTasks(u, user.usingList);
  } else {
    console.log("Invalid username or password.");
    console.log("Creating user...")
    l = usri.length;
    usri.push({
        "username": u,
        "password": p,
        "usingList": l
    })
    fs.writeFileSync(userFilePath, JSON.stringify(usri, null, 2));
    checkAccess(u, p);
  }
}

// Main task management function
function runTasks(username, usingList) {
  let currentList = usingList;
  console.log(`Hello, ${username}. Welcome to the task manager! Using list ${currentList + 1}.`);

  ql.on('line', (input) => {
    const tester = input.toLowerCase();
    const n = input;

    if (!Array.isArray(list[currentList])) {
      console.log(`List ${currentList + 1} does not exist. Initializing it.`);
      list[currentList] = [];
    }

    if (tester.startsWith("add ")) {
      const task = n.split("add ")[1];
      list[currentList].push(task);
      console.log(`Added "${task}" to list ${currentList + 1}`);
      lost = false;
    }
    if (tester === "close") {
      fs.writeFileSync(taskFilePath, JSON.stringify(list, null, 2));
      ql.close();
      lost = false;
    }
    if (tester.startsWith("view")) {
        for (i=0; i<list[usingList].length; i++) {
            console.log((i+1)+ ". " + list[usingList][i]);
        }
        console.log("Using list "+ (usingList + 1) + " of available " + list.length);
        lost = false;
    }
    if (tester.startsWith("change ")) {
      let parts = n.split('change');
      let num = parts[1].trim().split(' ')[0];
      let string = parts[1].trim().slice(num.length).trim();
      list[currentList][num - 1] = string;
      list[currentList] = list[currentList].filter(item => item !== undefined);
      lost = false;
    }
    if (tester.startsWith('delete ')) {
      let num = parseInt(n.split('delete ')[1], 10);
      if (num > 0 && num <= list[currentList].length) {
        list[currentList].splice(num - 1, 1);
        console.log(`Deleted item ${num} from list ${currentList + 1}`);
      } else {
        console.log('Invalid item number');
      }
      lost = false;
    }
    if (tester.startsWith('save')) {
      fs.writeFileSync(taskFilePath, JSON.stringify(list, null, 2));
      console.log("saved");
      lost = false;
    }
   
    if (tester.startsWith("help")) {
      console.log("add: adds the following string to the current list: add abc");
      console.log("change: change the contents of the numbered item: change 1 def");
      console.log("delete: removes the following numbered string from the current list; delete 1");
      console.log("view: view current list's contents and current list: view");
      console.log("save: saves list");
      console.log("close: closes program and saves");
      lost =false;
    }
    if(lost) {
    console.log("Type 'help' for help.");
    }
    lost = true;
  });
}

// Ask for credentials and run tasks after successful login
askForCredentials();
