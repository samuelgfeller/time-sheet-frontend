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


});
