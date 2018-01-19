module.exports = function(app) {

  let path = require('path');

  // Create route for node_modules, since the folder is outside the client directory
  app.get('/node_modules/*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../..' + req.path));
  });

};
