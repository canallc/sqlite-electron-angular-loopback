# sqlite-electron-angular-loopback

This is a quick-start project using the SEAL (SQLite, Electron, Angular, and Loopback) stack. For more information on the SEAL stack, go [here](https://canallc.github.io/sqlite-electron-angular-loopback/ "SEAL Stack").

To get started:

```
$ git clone https://github.com/canallc/sqlite-electron-angular-loopback.git
$ cd sqlite-electron-angular-loopback
$ npm install && npm start
```

## But I already have an existing project...

Do you already have an existing project using either Electron or Loopback? If so, keep reading to see how this project was created, and how you can update your existing project to use the SEAL (SQLite, Electron, Angular, Loopback) stack.

### How this project was made

Below is a listing of the steps taken to create this project so you will better understand what changes will need made to your project.

### Start with a basic Loopback project

The first step in creating this project was to scaffold a very basic Loopback application:

```
# Install StrongLoop if you haven't already
npm install -g strongloop
# Then run this command to generate the new project
slc loopback
```

### Add Electron to the project

Add a dependency for `electron` in package.json:

```json
"devDependencies": {
  ...
  "electron": "1.7.10"
  ...
},
```

You can view the source file [here](./package.json "package.json").

Now install the dependencies:

```
npm install
```

### Add "index.js"

Add a new file to the root of the project that Electron will call on startup. We will call it `index.js`. Give it the following content:

```javascript
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Start Loopback
  let loopbackApp = require('./server/server.js');

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1280, height: 800});

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'loading.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {

    // Write the SQLite database that is in memory to file. Otherwise it will not persist.
    let db = loopbackApp.dataSources.db.connector;
    let fs = require('fs');
    let data = db.client.export();
    let buffer = new Buffer(data);
    let dbPath = loopbackApp.dataSources.db.connector.file_name;

    fs.writeFile(dbPath, buffer, (err) => {
      if (err) {
        console.error('error writing database file:', err);
      } else {
        console.log('Wrote DB to file at: ', dbPath);
      }
    });

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
```

The main thing to notice in the previous file is the line of code that starts loopback:

```javascript
// Start Loopback
let loopbackApp = require('./server/server.js');
```

Also note the section in the `mainWindow.on('closed',` function that saves the database to a file:

```
// Write the SQLite database that is in memory to file. Otherwise it will not persist.
let db = loopbackApp.dataSources.db.connector;
let fs = require('fs');
let data = db.client.export();
let buffer = new Buffer(data);

let dbPath = path.join(__dirname, 'server', 'database', 'database.sqlite');
fs.writeFile(dbPath, buffer, (err) => {
  if (err) {
    console.error('error writing database file:', err);
  } else {
    console.log('Wrote DB to file at: ', dbPath);
  }
});
```

You can view the source file [here](./index.js "index.js").

### Update "package.json":

Add a "start" script:

```json
"scripts": {
  "start": "electron index.js"
},
```

You can view the source file [here](./package.json "package.json").

### Add a "loading.html" page to the root of the project

This page will use Ajax to repeatedly check whether the server has finished booting up. When the server is ready, the user will be redirected to the main page of the site. Add a new file to the root of the project called `loading.html` and populate it with the following content:

```html
<!doctype html>
<html>
  <head>
    <title>Loading...</title>

    <!-- Temporarily undefine 'module' global variable, so these javascript files don't think we are running in node -->
    <script type="text/javascript">if (window.module) { window._module = window.module; window.module = undefined; }</script>

    <script src="./node_modules/jquery/dist/jquery.js"></script>

    <!-- Redefine 'module' global variable -->
    <script type="text/javascript">if (window._module) { window.module = window._module; }</script>

    <script type="text/javascript">
      $(document).ready(function() {

        // Repeatedly attempt to hit the loopback server until we get a response
        var interval = window.setInterval(function() {
          $.ajax({
            url: 'http://localhost:3000/',
          }).success(function() {
            window.clearInterval(interval);
            // The loopback server is up, so we can go to the root of the site
            window.location.href = 'http://localhost:3000/index.html';
          });
        }, 1000);

      });

    </script>
  </head>
  <body>

    <!-- You should show a spinner here to let the user know the app is loading -->

  </body>
</html>
```

### Update "middleware.json"

We need to tell LoopBack where our static app files are. Otherwise, it will try to match each request to a route, and when it doesn't find a match it will return a 404 error.

Add the following snippet to `server/middleware.json`:

```json
"files": {
  "loopback#static": {
    "params": "$!../client"
  }
},
```

You can view the source file [here](./server/middleware.json "middleware.json").

### Update "datasources.json"

Remove the content of `datasources.json` as we will be setting it within `server.js`.

```json
{

}
```

### Update "server.js"

The boilerplate code generated by Loopback only starts the server if the application is running in node. In our case, it's running in Electron, so we need to remove the if condition in `server/server.js`. In this example, we've commented out the offending `if` condition.

```javascript
// start the server if `$ node server.js`
// Comment out this line!!! if (require.main === module)
  app.start();
```

Add the following code to copy the database file to the app's data directory if necessary, and instantiate the connection to the SQLite DB.
```javascript
// The DB file will be the user data directory.
const dbPath = path.join(electron.app.getPath('userData'), 'database.sqlite');

var copyDatabaseIfNecessary = function() {
  if (fs.existsSync(dbPath)) { return Promise.resolve(); }

  // Copy database
  return new Promise((resolve, reject) => {
    const source = path.join(__dirname, './database/database.sqlite');
    let rd = fs.createReadStream(source);
    rd.on('error', reject);
    let wr = fs.createWriteStream(dbPath);
    wr.on('error', reject);
    wr.on('finish', resolve);
    rd.pipe(wr);
  });
};

copyDatabaseIfNecessary().then(() => {
  app.datasources.db = loopback.createDataSource({
    'connector': 'loopback-connector-sqljs',
    'file_name': dbPath
  });

  boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server
    app.start();
  });
});
```

You can view the source file [here](./server/server.js "server.js").

### Add Sqlite connector dependency

By default, the Loopback boilerplate configuration uses memory for data storage. We'd like to use a SQL database, so we use SQLite. We have two options here:

- SQLite3: You can use StrongLoop's connector for this is called "loopback-connector-sqlite3"
- sql.js (SQLite compiled to JavaScript): You can use a connector called "loopback-connector-sqljs".

In this example, I chose to use sql.js to avoid complications with building for both Mac and Windows and needing separate native libraries for each. To use sql.js, add this dependency to package.json:

```json
"dependencies": {
  ...
  "loopback-connector-sqljs": "^1.0.0",
  ...
}
```

### Add Angular Dependencies

Add all the basic Angular dependencies to package.json. Here is a minimal list. You will probably want to include more than just these:

```json
"dependencies": {
  ...
  "@angular/common": "5.1.1",
  "@angular/compiler": "5.1.1",
  "@angular/core": "5.1.1",
  "@angular/forms": "5.1.1",
  "@angular/http": "5.1.1",
  "@angular/platform-browser": "5.1.1",
  "@angular/platform-browser-dynamic": "5.1.1",
  "@angular/router": "5.1.1",
  "@angular/upgrade": "5.1.1",
  "@types/jquery": "^2.0.34",
  "@types/node": "^6.0.45",
  "reflect-metadata": "0.1.8",
  "systemjs": "0.19.39",
  "zone.js": "0.8.18",
  "core-js": "^2.4.1",
  "rxjs": "5.0.1",
  ...
},
"devDependencies": {
  ...
  "typescript": "^2.6.1",
  ...
}
```

You can view the source file [here](./package.json "package.json").
