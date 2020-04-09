$(document).ready(function () {

    checkIfTimerIsRunning();

    setInterval(checkIfTimerIsRunning, 30000);


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
            requested_resource: 'running_timer'
        },
        headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")},
    }).done(function (output) {
        // output = JSON.parse(output);
        if (output !== '') {
            if (output['running_timer_start'] !== 'null') {
                // Replace start time in localstorage in case user modified it
                localStorage.setItem("start_time", output['running_timer_start']);
                $('#trackingTimeDisplay').css('color', 'black');
                if (isTimerRunning() === false){
                    $("#activityTextArea").val(output['activity']);
                    startJsTimer();
                }
            } else if (output['running_timer_start'] === 'null') {
                $('#trackingTimeDisplay').css('color', 'black');
                if (isTimerRunning() === true) {
                    localStorage.removeItem("start_time");
                    stopJsTimer();
                }
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
        data: {
          activity:$('#activityTextArea').val()
        },
        headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")},
    }).done(function (output) {
        // output = JSON.parse(output);
        if (output !== '') {
            if (typeof output['start_time'] !== 'undefined') {
                localStorage.setItem("start_time", output['start_time']);
                startJsTimer();
            } else {
                alert('start_time not given in response')
            }
        } else {
            console.log(output);
        }
    }).fail(function (xhr) {
        // Check if the error the timer already running
        // if(typeof xhr.responseJSON.errCode !== 'undefined' && xhr.responseJSON.errCode === 'timer_already_started'){
        // }
        checkIfTimerIsRunning();
        handleFail(xhr);
    });
}

function stopTimer() {
    // Stop timer for visual comfort but if request fails, the timer starts again
    stopJsTimer();
    // Grey until successful response from server
    $('#trackingTimeDisplay').css('color', 'grey');

    $.ajax({
        url: config.api_url + 'timers',
        dataType: "json",
        type: 'put',
        headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")},
    }).done(function (output) {
        localStorage.removeItem("start_time");
        $('#trackingTimeDisplay').css('color', 'black');
    }).fail(function (xhr) {
        // Check if the error is that the timer is not running
        if(typeof xhr.responseJSON.errCode !== 'undefined' && xhr.responseJSON.errCode === 'timer_not_running'){
            localStorage.removeItem("start_time");
            $('#trackingTimeDisplay').css('color', 'black');
        }else{
            startJsTimer();
        }

        handleFail(xhr);
    });
}

let h = 0, m = 0, s = 0, t, timerIsRunning = false;

function calculateStartTimeValue() {
    // Calculate from where the timer should start
    let startDate = new Date(localStorage.getItem("start_time"));
    let currentDate = new Date();

    // Calculating the difference between two dates. Result are Milliseconds
    let diffInMs = currentDate.getTime() - startDate.getTime();
    // Convert ms to seconds
    let diffInSeconds = diffInMs / 1000;
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
    $('#trackingTimeDisplay').css('color', 'black');
    $("#activityTextArea").prop('disabled', true);
    calculateStartTimeValue();

    // Change start button to stop
    $('#toggleIconDiv').data('status', 'stop');
    $("#toggleIcon").attr("src", "/img/stop_icon.png");

    runTimer();
    timerIsRunning = true;
}

/**
 * This function is called every second
 */
function runTimer() {
    //  Called here the first time because  countUp is called only after 1second so the timer would be late of 1s
    displayTime();

    t = setInterval(countUp, 1000);

}

function stopJsTimer() {
    clearInterval(t);
    timerIsRunning = false;

    s = 0;
    m = 0;
    h = 0;

    $('#trackingTimeDisplay').css('color', 'black');
    $("#activityTextArea").prop('disabled', false);
    $("#activityTextArea").val('');

    // Change stop button to start
    $('#toggleIconDiv').data('status', 'start');
    $("#toggleIcon").attr("src", "/img/play_icon.png");

    $('#trackingTimeDisplay').text('00:00:00');
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

    displayTime();

    // Start the js timer all the time as long as countUp() is called
    // runTimer();
}

function isTimerRunning(){
    return timerIsRunning;
}

function displayTime(){
    $('#trackingTimeDisplay').text((h ? (h > 9 ? h : "0" + h) : "00") + ":"
        + (m ? (m > 9 ? m : "0" + m) : "00") + ":"
        + (s > 9 ? s : "0" + s));

}