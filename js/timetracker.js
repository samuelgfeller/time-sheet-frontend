$(document).ready(function () {
    $('#playIconDiv').on('click', function () {
        $.ajax({
            url: config.api_url + 'timers',
            dataType: "json",
            type: 'post',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")},
        }).done(function (output) {
            // output = JSON.parse(output);
            if (output !== '') {
                if (typeof output.startTime !== 'undefined') {
                    localStorage.setItem("start_time", output.startTime);
                } else {
                    alert('start_time not given in response')
                }
            } else {
                console.log(output);
            }
        }).fail(function (xhr) {
            handleFail(xhr);
        });
    });

    let date1 = new Date("2020-03-29 08:00:00");
    let date2 = new Date("2020-03-29 09:01:20");

    // Calculating the difference between two dates. Result are Milliseconds
    let diffInMs = date2.getTime() - date1.getTime();
    // Convert ms to seconds
    let diffInSeconds = diffInMs / 1000 ;
    // Converting seconds to minutes
    let diffInMin = diffInSeconds / 60;
    // Calculating hours
    let h = Math.floor(diffInMin / 60);
    // Calculating minutes that can't be hours. Modulo returns the remainder after number is divided so the maximal dividable by 60 is in hours and the remainder will
    // be caught by the modulo operator. If the diff in min is 125 -> 120 min is dividable by 60 and it gives 2(h) but since its 125 there is a remainder of
    // 5min which the modulo exactly highlights. Math.floor is removing the decimals only keeping the integer
    let m = Math.floor(diffInMin % 60);
    // The seconds remainder in regards to the next 60 which are the minutes can be calculated with the same principle with the modulo operator
    let s = diffInSeconds % 60;

    $('#testingContainer').html('Total number of Hours between dates  <br>'
        + date1 + '<br> and <br>'
        + date2 + ' is: <br> '
        + h + ':' + m
        + ':' + s+'<br>'
    );
});
