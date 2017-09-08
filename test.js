const request = require('request')
const argv = require('yargs').argv
const chalk = require('chalk')
const moment = require('moment')
const figlet = require('figlet')
const path = require('path')
const art = require('iris-ascii-art')
// const path = require('path')

process.stdout.write('\033[2J')
process.stdout.write('\033[0;0H')

console.log(
  chalk.yellow(
    figlet.textSync('Testing...', { font: 'Santa Clara', horizontalLayout: 'full' })
  )
)
art
  .font('lets', 'Doom', 'red')
  .font(' INI', 'Doom', 'cyan', function(ascii){
    console.log(ascii);
});
