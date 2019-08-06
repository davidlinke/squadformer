const squadID = $('#squadIndex').text();

//////////////////////////////////////////////////
// Upon Visiting Page, Store ID in Local Storage
//////////////////////////////////////////////////
localStorage.setItem('squad', squadID);

//////////////////////////////////////////////////
// Gets Squad Name
//////////////////////////////////////////////////
const squadName = id => {
	$.ajax({
		url: `/squads/data/${id}/squadname`,
		success: data => {
			showSquadName(data);
		},
		error: (request, status, err) => {
			console.log('Error getting data: ' + request + status + err);
		}
	});
};

//////////////////////////////////////////////////
// Gets Names of People In Squad
//////////////////////////////////////////////////
const namesArrayOfObjects = id => {
	$.ajax({
		url: `/squads/data/${id}/names`,
		success: data => {
			showNames(data);
		},
		error: (request, status, err) => {
			console.log('Error getting data: ' + request + status + err);
		}
	});
};

//////////////////////////////////////////////////
// Display Squad Name
//////////////////////////////////////////////////
const showSquadName = name => {
	const $squadNameDiv = $('<div>').attr('id', 'squadNameDiv');
	$('.pageContainer').prepend($squadNameDiv);
	const $squadName = $('<h3>').text(name);
	$squadNameDiv.append($squadName);
};

//////////////////////////////////////////////////
// Displays Names On The Page
//////////////////////////////////////////////////
const showNames = namesArray => {
	const $names = $('<div>').attr('id', 'namesContainer');
	$('#main').prepend($names);
	namesArray.forEach((nameObject, nameIndex) => {
		const $nameDiv = $('<div>')
			.attr('id', 'individualNamesContainer')
			.attr('nameIndex', nameIndex);
		$names.append($nameDiv);
		const $newName = $('<p>').text(nameObject.name);
		$nameDiv.append($newName);
	});
};

squadName(squadID);
namesArrayOfObjects(squadID);

//////////////////////////////////////////////////
// Displays Form To Make Random Groups
//////////////////////////////////////////////////
const showGroupForm = () => {
	const $showGroupFormDiv = $('<div>').attr('id', 'showGroupForm');
	$('#main').append($showGroupFormDiv);
	const $title = $('<h3>').text('Generate Random Groups');
	$showGroupFormDiv.append($title);
	const $form = $('<form>')
		.attr('onsubmit', 'return false')
		.attr('id', 'groupForm');
	$showGroupFormDiv.append($form);

	const $label = $('<label>')
		.attr('for', 'groupSize')
		.text('Group Size');
	$form.append($label);

	const $input = $('<input>')
		.attr('type', 'number')
		.attr('id', 'groupSize')
		.attr('min', '2')
		.attr('max', '10')
		.attr('value', '3');
	$form.append($input);

	const $submit = $('<input>')
		.attr('type', 'submit')
		.attr('id', 'groupSizeSubmit')
		.attr('value', 'Build Groups');
	$form.append($submit);

	groupButtonListener();
};

//////////////////////////////////////////////////
// Displays Form To Make Random Groups
//////////////////////////////////////////////////
const groupButtonListener = () => {
	$('#groupSizeSubmit').on('click', () => {
		const $form = $('#groupForm');
		// If form passes validation
		if ($form.get(0).reportValidity()) {
			let size = $('#groupSize').val();
			getCombinations(squadID, size);
			$('#combinationsDiv').remove();
		} else {
			$form.get(0).reportValidity(); //Need to display validity message
		}
	});
};

// $('#groupForm').submit(function(event) {
// 	var $this = $(this);
// 	$this.get(0).reportValidity();
// });

showGroupForm();

const getCombinations = (id, size) => {
	$.ajax({
		url: `/squads/randomize/${size}/${id}`,
		success: data => {
			showCombinations(data);
		},
		error: (request, status, err) => {
			console.log('Error getting data: ' + request + status + err);
		}
	});
};

const showCombinations = arrayOfGroups => {
	const $combinationsDiv = $('<div>').attr('id', 'combinationsDiv');
	$('#main').append($($combinationsDiv));
	$combinationsDiv.append($('<hr>'));
	arrayOfGroups.groups.forEach(group => {
		const $div = $('<div>');
		$div.attr('class', 'draggableContainer');
		$combinationsDiv.append($div);
		group.forEach(name => {
			const $newName = $('<div>').text(name);
			$div.append($newName);
		});
	});

	// Initialize dragging
	dragging();
};

const dragging = () => {
	// Enable draggin for all containers with class draggableContainer
	dragula([].slice.call(document.querySelectorAll('.draggableContainer')));
};
