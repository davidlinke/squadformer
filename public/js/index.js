//Hide footer initially to prevent page loading jumpiness
$('#homefooter').hide();

const setHeight = () => {
	$('#brainOuter').height($('#brainBox').css('height'));
};

const showFooter = () => {
	$('#homefooter').show();
};

$(window).on('load', function() {
	// Show last created squad button if one exists and set link / adjust layout
	if (localStorage.getItem('squad')) {
		$('#lastCreatedSquadButton').css('display', 'block');
		$('#brainButtons').css('top', '57%');
		$('#lastSquadLink').attr(
			'href',
			`/squads/${localStorage.getItem('squad')}`
		);
	}

	// Sometimes setHeight is called before things are fully loaded and the footer is positioned incorrectly (this happens on slower internet connections). Calling it several times at different intervals ensure it will display correctly at the earliest possible time.
	setHeight();
	showFooter();
	setTimeout(setHeight, 50);
	setTimeout(setHeight, 100);
	setTimeout(setHeight, 250);
	setTimeout(setHeight, 500);
	setTimeout(setHeight, 750);
	setTimeout(setHeight, 1000);
	setTimeout(setHeight, 2000);
});

// Show or hide create squad form
$('#createSquadButton').on('click', () => {
	if ($('#createForm').css('display') === 'none') {
		$('#createForm').slideDown(500);
		$('html, body').animate(
			{
				scrollTop: $('#homefooter').offset().top
			},
			500
		);
		$('#createTextArea').focus();
	} else {
		$('#createForm').slideUp(500);
	}
});

// Resize height of outer brain box on window resize
$(window).resize(() => {
	setHeight();
});
