$(document).ready(function () {
    populateTimeSheet();
});

function populateTimeSheet() {
    $.ajax({
        url: config.api_url + 'timers',
        dataType: "json",
        type: 'get',
        data: {
            requested_resource: 'time_sheet'
        },
        headers: {'Authorization': 'Bearer ' + localStorage.getItem("token")},
    }).done(function (output) {
        if (output !== '') {
            $.each(output, function (index, timer) {
                if (timer['stop'] !== '') {
                    let duration = calculateTimeDifference(new Date(timer['start']), new Date(timer['stop']));
                    $('<tr id="' + timer['id'] + '"><td>' + timer['user_name'] +
                        '</td><td>' + timer['start'] +
                        '</td><td >' + (duration['h'] !== 0 ? duration['h'] + 'h. ' : '') + (duration['m'] !== 0 ? duration['m'] + 'min. ' : '') + duration['s'] + 's.' +
                        '</td><td >' + timer['activity'] +
                        '</tr>').appendTo($('#timeSheetTable'));
                }
            }); // End each
        } else {
            console.log(output);
        }
    }).fail(function (xhr) {
        handleFail(xhr);
    });
}

