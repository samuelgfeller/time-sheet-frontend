$(document).ready(function () {

    $('#userListNavBtn').on('click', function () {
        location.href = config.frontend_url + 'pages/userlist.html';

    });
    $('#loginNavBtn').on('click', function () {
        location.href = config.frontend_url + 'pages/login.html';

    });
    $('#registerNavBtn').on('click', function () {
        location.href = config.frontend_url + 'pages/register.html';

    });
    $('#trackTimeNavBtn').on('click', function () {
        location.href = config.frontend_url + 'pages/track-time.html';

    });
    $('#allTimeSheetNavBtn').on('click', function () {
        location.href = config.frontend_url + 'pages/all-time-sheet.html';
    });

});

function redirectDefaultPage() {
    location.href = config.frontend_url + 'pages/login.html';
}