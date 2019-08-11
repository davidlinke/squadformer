let time = $('#time').text();
time = moment(time, 'ddd MMM DD YYYY HH:mm:ss Z').format('MMMM Do YYYY, h:mma');

$('.boldTime').text(time);
