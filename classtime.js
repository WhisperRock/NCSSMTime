// THIS IS PRIOR TO CHANGING FOR EXAMS AND J-TERM -- THE NORMAL SCHEDULE!

let pageTitle = "";
let scheduleMap = new Map();

let mod = false;
/*
If you are reading this, why hello there! 
I am writing this because I have to remind myself what to do every time there's a modified schedule
PROCEDURE
On modified schedules, change mod to true above
Add modified schedule to "Modified" schedule map
Update banner text
Update lab and reg block lengths
Update lunch txt2 for respective period (delete if needed)
*/

setInterval(() => updateSchedule(), 200); // calls update every 200 ms

function updateSchedule() {
    // getting the date
    let currentTime = new Date();

    // force refresh at 12:00:00 AM in case of special updates
    if (currentTime.getHours() === 0 && currentTime.getMinutes() === 0 && currentTime.getSeconds() === 0 && currentTime.getMilliseconds() <= 400)
        location.reload();

    // calculating time difference
    let nextEvent = getNextEvent(currentTime);
    let timeDifference = nextEvent.date - currentTime;
    timeDifference = Math.floor(timeDifference / 1000);
    let seconds = timeDifference % 60;
    timeDifference = Math.floor(timeDifference / 60);
    let minutes = timeDifference % 60;
    timeDifference = Math.floor(timeDifference / 60);
    let hours = timeDifference;

    // formatting the actual countdown string
    let timeString = `${(hours === 0 ? "" : hours.toString() + ":")}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // fancy subtext below the main one for lab blocks if people don't have a lab but do have the main block (example A2 but NOT A2 Lab)
    let labMinutes = 0;
    let labHours = 0;

    let regBlock = 50;
    let labBlock = 90;

    if (mod) { // MODIFY if needed
        regBlock = 50;
        labBlock = 90;
    }
    
    let timeString2 = "";
    let eventStr = nextEvent.name.toString();
    if ((hours * 60 + minutes) >= (labBlock - regBlock) && eventStr.substring(eventStr.length - 3) === "Lab") { // if lab block comes after main block
        labMinutes = minutes - (labBlock - regBlock);
        labHours = hours;
        if (labMinutes < 0 && labHours >= 1) {
            labMinutes += 60;
            labHours -= 1;
        }

        timeString2 = `${(labHours === 0 ? "" : labHours.toString() + ":")}${labMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById("txt2").innerHTML = `${timeString2}<br><span class="sub-text">Left of ${eventStr.substring(3,5)} only</span>`;
    }
    else if (eventStr.includes("Lunch") && !mod) { // countdown during lunch for after lunch lab
        labMinutes = minutes + (labBlock - regBlock);
        
        if (labMinutes >= 60) {
            labMinutes -= 60;
            labHours += 1;
        }

        timeString2 = `${(labHours === 0 ? "" : labHours.toString() + ":")}${labMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (dayOfWeek(currentTime.getDay()) === "Tuesday")
            document.getElementById("txt2").innerHTML = `${timeString2}<br><span class="sub-text">Left of Lunch for G2 only</span>`;

        else if (dayOfWeek(currentTime.getDay()) === "Wednesday")
            document.getElementById("txt2").innerHTML = `${timeString2}<br><span class="sub-text">Left of Lunch for E3 only</span>`;

        else if (dayOfWeek(currentTime.getDay()) === "Thursday")
            document.getElementById("txt2").innerHTML = `${timeString2}<br><span class="sub-text">Left of Lunch for F4 only</span>`;

        else
            document.getElementById("txt2").innerHTML = ``;
    }
    else if (eventStr.includes("Lunch") && mod) { // modified lab timer for lunch
        labMinutes = minutes + (labBlock - regBlock);
        
        if (labMinutes >= 60) {
            labMinutes -= 60;
            labHours += 1;
        }

        timeString2 = `${(labHours === 0 ? "" : labHours.toString() + ":")}${labMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById("txt2").innerHTML = ``; // MODIFY BASED ON DAY OF WEEK, delete if needed
    }
    else if ((hours * 60 + minutes) >= regBlock && eventStr.substring(6, 9) === "Lab") { // if lab block comes before main block (only after lunch)
        labMinutes = minutes - regBlock;
        labHours = hours;
        
        if (labMinutes < 0 && labHours >= 1) {
            labMinutes += 60;
            labHours -= 1;
        }

        timeString2 = `${(labHours === 0 ? "" : labHours.toString() + ":")}${labMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById("txt2").innerHTML = `${timeString2}<br><span class="sub-text">Left of Lunch for ${eventStr.substring(3,5)} only</span>`;
    }
    else if (eventStr.includes("before H") || eventStr.includes("of H") || eventStr.includes("Transition (H") || eventStr.includes("of I")) { // before check timer (completely separate)
        let hrsBeforeCheck = 0;
        let minBeforeCheck = 0;

        if (eventStr.includes("before H")) {
            hrsBeforeCheck = hours + 3;
            minBeforeCheck = minutes + 45;
        }
        else if (eventStr.includes("of H")) {
            hrsBeforeCheck = hours + 2;
            minBeforeCheck = minutes + 5;
        }
        else if (eventStr.includes("of Transition (H")) {
            hrsBeforeCheck = hours + 1;
            minBeforeCheck = minutes + 55;
        }
        else {
            hrsBeforeCheck = hours;
            minBeforeCheck = minutes + 15;
        }

        if (minBeforeCheck >= 60) {
            minBeforeCheck -= 60;
            hrsBeforeCheck += 1;
        }

        timeString2 = `${(hrsBeforeCheck === 0 ? "" : hrsBeforeCheck.toString() + ":")}${minBeforeCheck.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById("txt2").innerHTML = `${timeString2}<br><span class="sub-text">Left before Check</span>`;
    }
    else { // turn off the text
        document.getElementById("txt2").innerHTML = `J2: 1/16 to 1/25<br><span class="sub-text">See <a href="https://ncssm.myschoolapp.com/app/student#myschedule" target="_blank" style="color: white;">Blackbaud</a> for your schedule.<br>Safe travels!</span>`;
    }

    document.getElementById("txt").innerHTML = `${timeString}<br><span class="sub-text">Left ${nextEvent.name}</span>`; // countdown text that replaces "Loading..."
    
    if (pageTitle !== timeString) { // tab timer
        if (eventStr.includes("Transition")) {
            document.title = `Transition: ${timeString}`;
            pageTitle = `Transition: ${timeString}`;
        }
        else if (eventStr.includes("of Check")) {
            document.title = `Check: ${timeString}`;
            pageTitle = `Check: ${timeString}`;
        }
        else {
            document.title = timeString;
            pageTitle = timeString;
        }
    }
}

function getNextEvent(dateTime) { // finds the next event
    let currentTime = dateTime === undefined ? new Date() : dateTime;

    updateTimeMap(currentTime);

    let day = dayOfWeek(currentTime.getDay());
    if (document.getElementById("banner").innerText != day && !mod) // updating the day of week banner on the top of main page
        document.getElementById("banner").innerText = `${day} (January Term)`;

    let events;
    if (mod) { // override
        events = scheduleMap.get("Modified");
        document.getElementById("banner").innerText = day; // MODIFY, delete if needed
    }
    else {
        events = scheduleMap.get(day);
    }

    return events.find(event => event.date > currentTime);
}

function dayOfWeek(number) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[number];
}

function updateTimeMap(currentTime) { // the actual code
    let year = currentTime.getFullYear();
    let month = currentTime.getMonth();
    let day = currentTime.getDate();
    scheduleMap.set("Modified", [{
            date: new Date(year, month, day, 9, 0),
            name: "before First Exam"
        }
    ]);
    scheduleMap.set("Monday", [
        {
            date: new Date(year, month, day, 22, 0),
            name: "before Check"
        },
        {
            date: new Date(year, month, day, 22, 5),
            name: "of Check"
        },
        {
            date: new Date(year, month, day + 1, 22, 0),
            name: "before Check"
        }
    ]);
    scheduleMap.set("Tuesday", [
        {
            date: new Date(year, month, day, 22, 0),
            name: "before Check"
        },
        {
            date: new Date(year, month, day, 22, 5),
            name: "of Check"
        },
        {
            date: new Date(year, month, day + 1, 22, 0),
            name: "before Check"
        }
    ]);
    scheduleMap.set("Wednesday", [{
        date: new Date(year, month, day, 22, 0),
        name: "before Check"
    },
    {
        date: new Date(year, month, day, 22, 5),
        name: "of Check"
    },
    {
        date: new Date(year, month, day + 1, 22, 0),
        name: "before Check"
    }
    ]);
    scheduleMap.set("Thursday", [{
        date: new Date(year, month, day, 22, 0),
        name: "before Check"
    },
    {
        date: new Date(year, month, day, 22, 5),
        name: "of Check"
    },
    {
        date: new Date(year, month, day + 1, 23, 0),
        name: "before Check"
    }
    ]);
    scheduleMap.set("Friday", [{
        date: new Date(year, month, day, 23, 0),
        name: "before Check"
    },
    {
        date: new Date(year, month, day, 23, 5),
        name: "of Check"
    },
    {
        date: new Date(year, month, day + 1, 23, 0),
        name: "before Check"
    }
    ]);
    scheduleMap.set("Saturday", [{
        date: new Date(year, month, day, 23, 0),
        name: "before Check"
    },
    {
        date: new Date(year, month, day, 23, 5),
        name: "of Check"
    },
    {
        date: new Date(year, month, day + 1, 22, 0),
        name: "before Check"
    }
    ]);
    scheduleMap.set("Sunday", [{
        date: new Date(year, month, day, 22, 0),
        name: "before Check"
    },
    {
        date: new Date(year, month, day, 22, 5),
        name: "of Check"
    },
    {
        date: new Date(year, month, day + 1, 22, 0),
        name: "before Check"
    }
    ]);
}

function formatTime(dateTime) { // technical formatting stuff
    let hours = (dateTime.getHours()) % 12;
    if (hours === 0) {
        hours = 12;
    }
    return hours.toString().padStart(2, '0') + ":" + dateTime.getMinutes().toString().padStart(2, '0');
}

function isAtBottom(element) {
    return element.scrollTop - (element.scrollHeight - element.clientHeight) > -1;
}
