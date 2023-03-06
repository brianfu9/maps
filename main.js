const compassCircle = document.querySelector(".compass-circle");
const myPoint = document.querySelector(".my-point");
const myDistance = document.querySelector(".my-distance");
const startBtn = document.querySelector(".start-btn");
const isIOS =
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/);

let point;

function init() {
    startBtn.addEventListener("click", startCompass);
    navigator.geolocation.getCurrentPosition(locationHandler);

    if (!isIOS) {
        window.addEventListener("deviceorientationabsolute", handler, true);
    }
}

async function startCompass() {
    console.log("start compass")
    if (isIOS) {
        DeviceOrientationEvent.requestPermission()
            .then((response) => {
                if (response === "granted") {
                    window.addEventListener("deviceorientation", handler, true);
                } else {
                    alert("has to be allowed!");
                }
            })
            .catch(() => alert("not supported"));
    }
    const address = $('#address').val();
    console.log('input address: ', address)
    await getGeocode(address);
}

function handler(e) {
    compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    console.log('handler updating...', '\npointDegree: ', pointDegree, '\npointDistance: ', pointDistance, '\ncompass: ', compass)
    compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;

    // ±15 degree
    if (Math.abs(compass - pointDegree) < 15 || Math.abs(compass - pointDegree) > 345) {
        myPoint.style.opacity = 1;
    } else if (pointDegree) {
        myPoint.style.opacity = 0;
    }

    if (pointDistance) {
        myDistance.innerHTML = pointDegree + ' degrees, ' + pointDistance.toFixed(2) + ' miles';
    }
}

let pointDegree;
let pointDistance;

function locationHandler(position) {
    const { latitude, longitude } = position.coords;
    console.log('locationHandler updating...')
    if (!point) {
        return;
    }
    pointDegree = calcDegreeToPoint(latitude, longitude);
    pointDistance = distance(latitude, point.y, longitude, point.x);

    if (pointDegree < 0) {
        pointDegree = pointDegree + 360;
    }
    console.log('pointDegree: ', pointDegree, '\npointDistance: ', pointDistance)
}

async function getGeocode(address) {
    $.ajax({
        url: 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress',
        data: {
            address: address,
            benchmark: 'Public_AR_Current',
            format: 'json'
        },
        cache: false,
    }).done(function (data) {
        if (data['result']['addressMatches'].length == 0) {
            alert('No matches found');
            return;
        }
        point = data['result']['addressMatches'][0]['coordinates'];
    }).done(function () {
        alert('set point: ', point)
        navigator.geolocation.getCurrentPosition(locationHandler);
    });
}

function calcDegreeToPoint(latitude, longitude) {
    if (!point) {
        return 0;
    }

    const phiK = (point.y * Math.PI) / 180.0;
    const lambdaK = (point.x * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    const psi =
        (180.0 / Math.PI) *
        Math.atan2(
            Math.sin(lambdaK - lambda),
            Math.cos(phi) * Math.tan(phiK) -
            Math.sin(phi) * Math.cos(lambdaK - lambda)
        );
    return Math.round(psi);
}

function distance(lat1, lat2, lon1, lon2) {
    // if any of the inputs are null, return
    if (!lat1 || !lat2 || !lon1 || !lon2) {
        return null;
    }
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 3956;

    // calculate the result
    return (c * r);
}

init();