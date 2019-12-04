const express = require('express'); // importing a CommonJS module
const helmet = require("helmet")

const hubsRouter = require('./hubs/hubs-router.js');

//middleware
const server = express();

function logger (req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`)
  next()
}

function gateKeeper (req, res, next) {
  const password = req.headers.password || ''
  if(!password){
    res.status(400).json({message: 'enter password'})
  }else {
    res.status(401).json({ message: 'no good'})
  }
}

// write a gatekeeper middleware that reads password from the header and if 
//the password is 'mellon', let it continue
//if not send back status 401 and a message

server.use(helmet())
server.use(express.json()); // built in middleware
server.use(logger)
server.use(gateKeeper)

//endpoints
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});
server.get ('/echo', (req, res) => {
  res.send(req.headers)
})
server.get ('/area51', helmet(), (req, res) => {
  res.send(req.headers)
})

module.exports = server;
