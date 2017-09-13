#!/usr/bin/env node

const request = require('request')
const argv = require('yargs')
  .argv
const chalk = require('chalk')
const moment = require('moment')
const figlet = require('figlet')
const fontPath = require('figlet')
const CLI = require('clui')
const Spinner = CLI.Spinner
const path = require('path')
const art = require('iris-ascii-art')
// const {Fonts} = require('figlet/fonts')
const AsciiTable = require('ascii-table')

art.Figlet.fontPath = 'node_modules/figlet/fonts/'

let apiKey = 'b4fd157883ded4fd523995f56ad048b3'
let city = argv.c || 'Ottawa'
let unit = argv.u || 'metric'
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`
let forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`

let table = new AsciiTable('Forecast')

// Clear the screen and reset the cursor to positon 0, 0
process.stdout.write('\033[2J')
process.stdout.write('\033[0;0H')

console.log(
  chalk.yellow(
    figlet.textSync(city, {
      font: 'Slant',
      horizontalLayout: 'full'
    })
  )
)

let weatherOverview = new Promise((resolve, reject) => {
  let status = new Spinner('Getting current weather info...', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷'])
  status.start()
  request(url, (err, res, body) => {
    if (err) {
      console.error('error', error)
      return
    } else {
      weather = JSON.parse(body)
      // let sunrise = new Date(weather.sys.sunrise * 1000)
      // let sunset = new Date(weather.sys.sunset * 1000)
      let temp = weather.main.temp
      let description = weather.weather[0].description
      let shortDesc = weather.weather[0].main
      let humidity = weather.main.humidity
      let wind = weather.wind.speed
      let today = new Date()

      if (shortDesc.length > 7) {
        shortDesc = shortDesc.slice(0,7)
      }

      // console.log('DEBUG: ' + typeof(shortDesc))

      // let message = 'Sunrise at ' + chalk.keyword('hotpink')(moment(sunrise).format('HH:mm'))
      // message += '\n'
      // message += `Sunset at ${chalk.keyword('hotpink')(moment(sunset).format('HH:mm'))}`

      art
        .font(`${temp}°`, 'Small')
        .font(' ' + shortDesc, 'Small Slant', 'cyan', function(ascii) {
          console.log(ascii);
          console.log(`${moment(today).format('dddd Do MMMM, HH:mm')} - ${description} / ${humidity}% humidity / ${wind} m/s winds`)
          // console.log(message)

        })
      status.stop()
      resolve()
    }
  })

})


weatherOverview.then(() => {

  request(forecastUrl, (err, res, body) => {

    let status2 = new Spinner('Getting the weather forecast...', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷'])

    status2.start()

    if (err) {
      console.error('error', error)
      return
    } else {
      parseForecast(body, status2)
    }



  })

})

function parseForecast(data, spinner) {


  let forecast = JSON.parse(data)

  for (var i = 0; i < 5; i++) {
    let temp = forecast.list[i].main.temp
    let description = forecast.list[i].weather[0].description
    let shortDesc = forecast.list[i].weather[0].main
    let time = moment.utc(forecast.list[i].dt_txt)
    let wind = forecast.list[i].wind.speed

    let forecastMessage = `${time.local().format('dddd Do, HH:mm')}: ${temp} degrees with ${description}.`

    // console.log(forecastMessage)
    table.addRow(`${time.local().format('Do, HH:mm')}`, `${temp}°`, `${description}`, `${wind} m/s`)
  }

  table.setJustify()


  console.log(table.toString())

  spinner.stop()
}

// console.log('DEBUG: width = ' + process.stdout.columns)
