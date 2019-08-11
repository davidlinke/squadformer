let time = $('#time').text();
time = moment(time).format('MMMM Do YYYY, h:mm a');

$('.boldTime').text(time);
