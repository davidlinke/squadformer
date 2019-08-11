let time = $('#time').text();
console.log(time);
time = moment(time).format('MMMM Do YYYY, h:mm a');
// time = moment(time, 'YYY-MM-DDTHH:MM:SS.928Z').format('MMMM Do YYYY, h:mm a');

$('.boldTime').text(time);

// Sun Aug 11 2019 11:21:59 GMT-0400 (Eastern Daylight Time)
// ddd MMM DD YYYY
