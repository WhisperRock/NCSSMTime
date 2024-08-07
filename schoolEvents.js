// regular school year, before SRIP backed up

function updateSchoolHours() {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dow = daysOfWeek[(new Date()).getDay()];

    let morganton = document.getElementById("mor").checked;
    if (morganton) document.body.classList.add("morganton");
    else document.body.classList.remove("morganton");

    const breakfastText = document.getElementById("breakfast").children[1];
    const lunchText = document.getElementById("lunch").children[1];
    const dinnerText = document.getElementById("dinner").children[1];
    const checkText = document.getElementById("check").children[1];
    const dot = document.getElementById("dot");

    if (morganton) {
        if (dow != "Saturday" && dow != "Sunday") {
            breakfastText.parentElement.children[0].innerText = "Breakfast";
            lunchText.parentElement.children[0].innerText = "Lunch";
            breakfastText.innerHTML = "7:30 AM<br>9:30 AM";
            lunchText.innerHTML = "11:00 AM<br>1:00 PM";
            dinnerText.innerHTML = "5:00 PM<br>7:00 PM";

            breakfastText.parentElement.style.top = convertTimeToPercentage("8:00 AM");
            lunchText.parentElement.style.top = convertTimeToPercentage("12:00 PM");
            dinnerText.parentElement.style.top = convertTimeToPercentage("6:00 PM");
        }

        if (dow == "Saturday" || dow == "Sunday") {
            breakfastText.parentElement.children[0].innerText = "Brunch";
            lunchText.parentElement.children[0].innerText = "";
            breakfastText.innerHTML = "10:30 AM<br>1:00 PM";
            lunchText.innerHTML = "";
            dinnerText.innerHTML = "5:00 PM<br>7:00 PM";

            breakfastText.parentElement.style.top = convertTimeToPercentage("11:00 AM");
            dinnerText.parentElement.style.top = convertTimeToPercentage("6:00 PM");
        }
    } else {
        if (dow != "Saturday" && dow != "Sunday") {
            breakfastText.parentElement.children[0].innerText = "Breakfast";
            lunchText.parentElement.children[0].innerText = "Lunch";
            breakfastText.innerHTML = "7:45 AM<br>10:00 AM";
            lunchText.innerHTML = "11:30 AM<br>1:30 PM";
            dinnerText.innerHTML = "5:00 PM<br>7:30 PM";

            breakfastText.parentElement.style.top = convertTimeToPercentage("9:00 AM");
            lunchText.parentElement.style.top = convertTimeToPercentage("12:30 PM");
            dinnerText.parentElement.style.top = convertTimeToPercentage("6:45 PM");
        }

        if (dow == "Saturday" || dow == "Sunday") {
            breakfastText.parentElement.children[0].innerText = "Brunch";
            lunchText.parentElement.children[0].innerText = "";
            breakfastText.innerHTML = "10:30 AM<br>1:00 PM";
            lunchText.innerHTML = "";
            dinnerText.innerHTML = "5:00 PM<br>6:30 PM";

            breakfastText.parentElement.style.top = convertTimeToPercentage("11:00 AM");
            dinnerText.parentElement.style.top = convertTimeToPercentage("5:45 PM");
        }
    }

    if (dow != "Friday" && dow != "Saturday") {
        checkText.innerHTML = "10:00 PM";
        checkText.parentElement.style.top = convertTimeToPercentage("10:00 PM");
    } else {
        checkText.innerHTML = "11:00 PM";
        checkText.parentElement.style.top = convertTimeToPercentage("11:00 PM");
    }

    dot.style.top = convertTimeToPercentage(getCurrentTime());
}

function convertTimeToPercentage(timeString) {
    const timeRegex = /^(\d{1,2}):(\d{2}) (AM|PM)$/;
    const match = timeString.match(timeRegex);

    if (!match) {
        return "Invalid time format. Please use 'hh:mm AM/PM' format.";
    }

    let [, hours, minutes, period] = match;

    hours = parseInt(hours, 10);
    if (period === "PM" && hours !== 12) {
        hours += 12;
    } else if (period === "AM" && hours === 12) {
        hours = 0;
    }

    const totalMinutes = hours * 60 + parseInt(minutes, 10);

    const startMinutes = 6 * 60;
    const endMinutes = 23 * 60;
    const percentage = Math.min(Math.max(((totalMinutes - startMinutes) / (endMinutes - startMinutes)) * 100, 0), 100);

    return percentage.toFixed(2) + "%";
}

function getCurrentTime() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;

    return formattedTime;
}

function initUpdate() {
    updateSchoolHours();
    setInterval(updateSchoolHours, 60000);
}

window.addEventListener('load', () => {
    const morganton = document.getElementById("mor");
    morganton.checked = getCheckboxStateFromCookie();
    initUpdate();
});

document.getElementById("mor").addEventListener("change", updateSchoolHours);
