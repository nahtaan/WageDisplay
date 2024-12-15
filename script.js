let startTime = -1;
let rate = 0;
let updaterStarted = false;
let stopUpdater = false;

const validateRateInput = (e) => {
    if(e.key === "Backspace" || e.key === "Delete" || e.key === "ArrowLeft"|| e.key === "ArrowRight"|| e.key === "ArrowUp"|| e.key === "ArrowDown") {
        return true;
    }
    const ogValue = e.explicitOriginalTarget.value;
    if(ogValue.includes(".") && e.key === ".") {
        return false;
    }
    if(ogValue === "" && e.key === ".") {
        e.target.value = "0.";
        return false;
    }
    return /^[0-9.]$/.test(e.key);
}

const handleLoad = () => {
    let storedStartTime = localStorage.getItem("start_time");
    let storedRate = localStorage.getItem("rate");

    // do nothing if either of the values is not present
    if(storedStartTime == null || storedRate == null) {
        return;
    }

    startTime = storedStartTime;
    rate = storedRate;

    // setup display values
    setupValues();

    // change right button to Stop
    document.getElementById("right_button").innerText = "Stop";
    document.getElementById("right_button").setAttribute("onclick", "handleStop()");

    // update rate input box
    document.getElementById("rate_input").value = rate;

    // start update loop
    if(!updaterStarted) {
        updaterStarted = true;
        handleUpdate();
    }
}

const handleStart = () => {
    // validate rate input
    let rateInput = document.getElementById("rate_input");
    if(rateInput == null) {
        window.alert("Could not find rate input!");
        return;
    }
    let rateValue = rateInput.value;
    if(!/^[0-9]+.{0,}[0-9]{0,}$/.test(rateValue)) {
        window.alert("Invalid rate value.");
        return;
    }
    // store start time and rate
    rate = new Number(rateValue);
    localStorage.setItem("rate", rate);


    let timeSelector = document.getElementById("start_time");
    console.log(timeSelector.value);
    if(timeSelector.value === "") {
        startTime = Date.now();
    }else {
        let value = timeSelector.value;
        let split = value.split(":");
        let hour = new Number(split[0]);
        let minute = new Number(split[1]);
        let d = new Date();
        d.setHours(hour);
        d.setMinutes(minute);
        startTime = d.valueOf();
    }
    localStorage.setItem("start_time", startTime);

    // setup display values
    setupValues();

    // change right button to Stop
    document.getElementById("right_button").innerText = "Stop";
    document.getElementById("right_button").setAttribute("onclick", "handleStop()");

    // start update loop
    if(!updaterStarted) {
        updaterStarted = true;
        handleUpdate();
    }
}

const handleStop = () => {
    stopUpdater = true;
    // change right button to reset
    document.getElementById("right_button").innerText = "Reset";
    document.getElementById("right_button").setAttribute("onclick", "handleReset()");
}

const setupValues = () => {
    // update info texts
    let currentRate = document.getElementById("current_rate");
    currentRate.innerText = "Current Rate: £" + parseFloat(rate).toFixed(2);
    let startTimeInput = document.getElementById("start_time");
    let d = new Date(0);
    d.setUTCMilliseconds(startTime);
    let timeString;
    if(d.getMinutes() === 0) {
        timeString = d.getHours() + ":00";
    }else if (d.getMinutes() < 10) {
        timeString = d.getHours() + ":0" + d.getMinutes();
    }else {
        timeString = d.getHours() + ":" + d.getMinutes();
    }
    startTimeInput.value = timeString;
}

const handleReset = () => {
    // clear variables
    startTime = -1;
    rate = 0;

    // clear localstorage
    localStorage.removeItem("rate");
    localStorage.removeItem("start_time");

    // update info texts
    document.getElementById("current_rate").innerText = "Current Rate: Unknown";
    document.getElementById("start_time").value = "";

    // reset wage numbers
    document.getElementById("your_wage").innerText = "£0.00";
    document.getElementById("min_wage").innerText = "£0.00";
    document.getElementById("avg_wage").innerText = "£0.00";
    document.getElementById("ceo_wage").innerText = "£0.00";
    document.getElementById("jeff_wage").innerText = "£0.00";
}

const handleUpdate = () => {
    if(stopUpdater) {
        stopUpdater = false;
        updaterStarted = false;
        return;
    }
    let currentTime = Date.now();
    const hoursElapsed = (currentTime - startTime) / 3600000;

    // update your_wage
    let newValue = rate * hoursElapsed;
    let rateText = document.getElementById("your_wage");
    rateText.innerText = "£" + parseFloat(newValue).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });

    // update min_wage
    let minWage = document.getElementById("min_wage");
    minWage.innerText = "£" + parseFloat(11.44 * hoursElapsed).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });

    // update avg_wage
    let avgWage = document.getElementById("avg_wage");
    avgWage.innerText = "£" + parseFloat(13.57 * hoursElapsed).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });

    // update ceo_wage
    let ceoWage = document.getElementById("ceo_wage");
    ceoWage.innerText = "£" + parseFloat(46.67 * hoursElapsed).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });

    // update jeff_wage
    let jeffWage = document.getElementById("jeff_wage");
    jeffWage.innerText = "£" + parseFloat(7900000 * hoursElapsed).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2});

    setTimeout(handleUpdate, 100);
}