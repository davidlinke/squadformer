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

	// Sometimes content is not fully loaded before executing, adding a small delay fixed this
	setTimeout(setHeight, 100);
	setTimeout(showFooter, 100);
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
