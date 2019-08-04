$(window).on('load', function() {
	const setHeight = () => {
		// console.log($('#brainBox').css('height'));
		$('#brainOuter').height($('#brainBox').css('height'));
	};

	// Resize height of outer brain box on load
	// SOMETIMES FIRES BEFORE THINGS ARE LOADED, adding a small delay fixes this
	setTimeout(setHeight, 100);

	// Resize height of outer brain box on window resize
	$(window).resize(() => {
		setHeight();
		// console.log($('#brainBox').css('height'));
	});

	// Show last created squad button if one exists and set link / adjust layout
	if (localStorage.getItem('squad')) {
		$('#lastCreatedSquadButton').css('display', 'block');
		$('#brainButtons').css('top', '57%'); // UPDATE FOR SMALL SCREEN LAYOUTS!
		$('#lastSquadLink').attr(
			'href',
			`/squads/${localStorage.getItem('squad')}`
		);
	}
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
	} else {
		$('#createForm').slideUp(500);
	}
});
