$(document).ready(function () {

    checkIfTimerIsRunning();



    // Event listener on Start button
    $('#toggleIconDiv').on('click', function () {
        if ($('#toggleIconDiv').data('status') === 'start') {
            $('#trackingTimeDisplay').css('color', 'grey');
            startTimer();
        }
        if ($('#toggleIconDiv').data('status') === 'stop') {
            $('#trackingTimeDisplay').css('color', 'grey');
            stopTimer();
        }
    });

});

function checkIfTimerIsRunning() {
    $.ajax({
        url: config.api_url + 'timers',
        dataType: "json",
        type: 'get',
        data: {
          requested_resource:'running_timer'
        },
        headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")},
    }).done(function (output) {
        // output = JSON.parse(output);
        if (output !== '') {
            if (output['running_timer_start'] !== 'null') {
                localStorage.setItem("start_time", output['running_timer_start']);
                $('#trackingTimeDisplay').css('color', 'black');
                calculateStartTimeValue();
                startJsTimer();
            } else {
                localStorage.removeItem("start_time");
                $('#trackingTimeDisplay').css('color', 'black');
            }
        } else {
            console.log(output);
        }
    }).fail(function (xhr) {
        handleFail(xhr);
    });
}


function startTimer() {
    $.ajax({
        url: config.api_url + 'timers',
        dataType: "json",
        type: 'post',
        headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")},
    }).done(function (output) {
        // output = JSON.parse(output);
        if (output !== '') {
            if (typeof output['start_time'] !== 'undefined') {
                localStorage.setItem("start_time", output['start_time']);
                $('#trackingTimeDisplay').css('color', 'black');
                calculateStartTimeValue();
                startJsTimer();
            } else {
                alert('start_time not given in response')
            }
        } else {
            console.log(output);
        }
    }).fail(function (xhr) {
        handleFail(xhr);
    });
}

function stopTimer() {
    $.ajax({
        url: config.api_url + 'timers',
        dataType: "json",
        type: 'put',
        headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")},
    }).done(function (output) {
        // output = JSON.parse(output);
        if (output !== '') {
            $('#trackingTimeDisplay').css('color', 'black');
            localStorage.removeItem("start_time");
            stopJsTimer();
        } else {
            console.log(output);
        }
    }).fail(function (xhr) {
        handleFail(xhr);
    });
}

let h = 0, m = 0, s = 0, t;

function calculateStartTimeValue() {
    // Calculate from where the timer should start
    let startDate = new Date(localStorage.getItem("start_time"));
    let currentDate = new Date();

// Calculating the difference between two dates. Result are Milliseconds
    let diffInMs = currentDate.getTime() - startDate.getTime();
// Convert ms to seconds
    let diffInSeconds = diffInMs / 1000;
    console.log(diffInMs / 1000);
// Converting seconds to minutes
    let diffInMin = diffInSeconds / 60;
// Calculating hours
    h = Math.floor(diffInMin / 60);
// Calculating minutes that can't be hours. Modulo returns the remainder after number is divided so the maximal dividable by 60 is in hours and the remainder will
// be caught by the modulo operator. If the diff in min is 125 -> 120 min is dividable by 60 and it gives 2(h) but since its 125 there is a remainder of
// 5min which the modulo exactly highlights. Math.floor is removing the decimals only keeping the integer
    m = Math.floor(diffInMin % 60);
// The seconds remainder in regards to the next 60 which are the minutes can be calculated with the same principle with the modulo operator
    s = Math.floor(diffInSeconds % 60);

}


function startJsTimer() {
    t = setTimeout(countUp, 1000);
}

function stopJsTimer() {
    clearTimeout(t);
    $('#trackingTimeDisplay').text = "00:00:00";
    s = 0;
    m = 0;
    h = 0;
}

function countUp() {
    s++;
    if (s >= 60) {
        s = 0;
        m++;
        if (m >= 60) {
            m = 0;
            h++;
        }
    }

    $('#trackingTimeDisplay').text((h ? (h > 9 ? h : "0" + h) : "00") + ":"
        + (m ? (m > 9 ? m : "0" + m) : "00") + ":"
        + (s > 9 ? s : "0" + s));

    // Start the js timer all the time as long as countUp() is called
    startJsTimer();
}

// function timer() {
//     t = setTimeout(add, 1000);
// }
// timer();


/* Start button */
// start.onclick = timer;

/* Stop button */
/*stop.onclick = function() {
    clearTimeout(t);
};*/

/* Clear button */
