const console = require('console');
const logger = new console.Console(process.stdout);
if ('object'===typeof module)module.exports = logger;
