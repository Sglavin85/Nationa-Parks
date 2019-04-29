let counter = 1
console.log("main.js")
fetch("https://raw.githubusercontent.com/nss-day-cohort-31/national-parks/master/database.json")
    .then(response => response.json())
    .then(parsedParks => {
            let parks = parsedParks.parks
            parks.forEach(park => {
                let name = park.name
                let state = park.state
                let visited = park.visited
                let lat = park.latitude
                let long = park.longitude
            let parkHTML = parkFactory(name, state, counter);
            postParkToDom(parkHTML);
            getWeather(lat, long, counter, visited);
            if (visited === true) {
                visitedParkFront(counter);
            }else{
                newParkFront(counter)
            }

            counter ++;
        })
})



function parkFactory (name, state, counter) {
    return `
            <div class="cardcontainer" id="container${counter}">
                <div class="card" id="card${counter}">
                    <div class="front" id="front${counter}">
                        <article class="park">
                        <h1>${name}</h1>
                        <p>${state}</p>
                        <button id="weather${counter}">SEE WEATHER</button>
                        </article>
                    </div>
                </div>
            </div>`
}

function newParkFront(counter) {
    let element = document.querySelector(`#front${counter}`);
    element.className += " newPark";
}

function newParkBack(counter) {
    let element2 = document.querySelector(`#back${counter}`);
    element2.className += " newPark";
}

function visitedParkFront(counter) {
    let element = document.querySelector(`#front${counter}`);
    element.className += " visitedPark";
}

function visitedParkBack(counter) {
    let element2 = document.querySelector(`#back${counter}`);
    element2.className += " visitedPark";
}

function postParkToDom(toBeAdded) {
    let element = document.querySelector(".container")
    element.innerHTML += toBeAdded;
}

function getWeather (lat, long, counter, visited) {
    fetch(`https://api.darksky.net/forecast/16b2cd1b7933260dc8d7856ad1947141/${lat},${long}`)
        .then(reply => reply.json())
        .then(parsedWeather => {

            let forcast = parsedWeather;
            let current = forcast.currently.summary;
            let currentTemp = forcast.currently.temperature;
            // let icon = forcast.currently.icon;
            let daily = forcast.daily.data;
            let rainChance = (parseFloat(forcast.precipProbability) * 100) + "%";
            let weatherHTML = weatherFactory(current, currentTemp, rainChance, counter)
            weatherToDom(weatherHTML, counter)


            let outlook = [];
            daily.forEach(day => {
                let dailySum = day.summary;
                let high = day.temperatureHigh;
                let low = day.temperatureLow;
                let dailyRainChance = day.precipProbability * 100 + "%";
                outlook.push({
                    summary: dailySum,
                    highTemp: high,
                    lowTemp: low,
                    chanceOfRain: dailyRainChance
                })
            })
            let outlookHTML;
            outlook.forEach(day => {
                outlookHTML += outlookFactory(day)
            })
            outlookToDom(outlookHTML, counter)

            if (visited === true) {
                visitedParkBack(counter);
            }else{
                newParkBack(counter)
            }
            createListeners(counter)
        })
}

function celsiusToF (celsius) {
   let tempF = (celsius * (9/5) + 32)
   return tempF
}

function weatherFactory(current, currentTemp, rainChance, counter) {
    return `<div class="back" id="back${counter}">
                <div class="current">
                    <h1>Current Weather</h1>
                    <span>Current Temperature: ${currentTemp}&#8457;</span>
                    <span>Today's Outlook: ${current}</span>
                    <span>Chance of Rain: ${rainChance}<span>
                </div>
                <div class="outlook">
                    <h2>5-Day Outlook</h2>
                    <div class="outlookContainer" id="outlook${counter}">
                    </div>
                </div>
                <button id="park${counter}">GO BACK</button>
            </div>`
}

function weatherToDom(toBeAdded, counter) {
    let element = document.querySelector(`#card${counter}`);
    element.innerHTML += toBeAdded;
}

function outlookFactory(outlookObj) {
    return `<div class="day">
                        <span>Day</span>
                        <span>Summary: ${outlookObj.summary}</span>
                        <span>High: ${outlookObj.highTemp}&#8457;</span>
                        <span>Low: ${outlookObj.lowTemp}&#8457;</span>
                        <span>Chance of Rain: ${outlookObj.chanceOfRain}</span>
            </div>`
}

function outlookToDom(toBeAdded, counter) {
    let element = document.querySelector(`#outlook${counter}`)
    element.innerHTML += toBeAdded;
}



function createListeners(counter) {
    let element = document.querySelector(`#weather${counter}`)
    element.addEventListener("click", ()=>{
        let flipper = document.querySelector(`#card${counter}`)
        flipper.classList.toggle("flipped")
    }, false)

    let element2 = document.querySelector(`#park${counter}`)
    element2.addEventListener("click", ()=>{
        let flipper2 = document.querySelector(`#card${counter}`)
        flipper2.classList.toggle("flipped")
    }, false)
}