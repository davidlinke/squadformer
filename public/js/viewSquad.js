const squadID = $('#squadIndex').text();

let selectedNameIndex = 0;
let selectedNameAbsentState = false;
let listenerNameState = false;

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
// Post Groups When Saved
//////////////////////////////////////////////////
const saveGroupsToDB = (id, groups) => {
	// console.log('Posting from browser...');
	// console.log('groups data to be included:');
	// console.log(groups);
	$.ajax({
		url: `/squads/savegroups/${id}`,
		data: { groups: JSON.stringify(groups) },
		type: 'POST'
	});
};

//////////////////////////////////////////////////
// Update Squad Name
//////////////////////////////////////////////////
const updateSquadName = (id, newName) => {
	$.ajax({
		url: `/squads/data/${id}/${newName}`,
		type: 'PUT'
	});
};

//////////////////////////////////////////////////
// Display Squad Name
//////////////////////////////////////////////////
const showSquadName = name => {
	const $names = $('<div>').attr('id', 'namesContainer');
	$('#squadDiv').prepend($names);
	const $squadNameDiv = $('<div>').attr('id', 'squadNameDiv');
	$('#namesContainer').prepend($squadNameDiv);
	const $squadName = $('<h3>')
		.text(name)
		.attr('contenteditable', 'false')
		.attr('id', 'squadTitle');
	$squadNameDiv.append($squadName);

	// showNameEdit();
};

//////////////////////////////////////////////////
// Display Edit Icon
//////////////////////////////////////////////////
const showNameEdit = () => {
	const $editIcon = $('<object>')
		.attr('type', 'image/svg+xml')
		.attr('data', '/images/edit.svg')
		.attr('id', 'editNameIcon');
	$('#squadNameDiv').append($editIcon);
};

//////////////////////////////////////////////////
// Displays Names On The Page
//////////////////////////////////////////////////
const showNames = namesArray => {
	$('#divForNames').remove();
	const $divForNames = $('<div>').attr('id', 'divForNames');
	$('#namesContainer').append($divForNames);

	namesArray.forEach((nameObject, nameIndex) => {
		if (nameObject.archived === false) {
			const $nameDiv = $('<div>')
				.attr('class', 'individualNamesContainer')
				.attr('nameIndex', nameIndex);

			if (nameObject.absent) {
				$nameDiv.attr('absent', 'true');
				$nameDiv.attr('id', 'absent');
			} else {
				$nameDiv.attr('absent', 'false');
			}

			$divForNames.append($nameDiv);
			const $newName = $('<p>').text(nameObject.name);
			$nameDiv.append($newName);
		}
	});

	editSquadNameMenu();
	editPeopleMenu();
};

//////////////////////////////////////////////////
// Displays Form To Make Random Groups
//////////////////////////////////////////////////
const showGroupForm = () => {
	const $showGroupFormDiv = $('<div>').attr('id', 'showGroupForm');
	$('#squadDiv').append($showGroupFormDiv);
	const $titlediv = $('<div>').attr('id', 'generateGroupsTitleDiv');
	$showGroupFormDiv.append($titlediv);
	const $title = $('<h3>').text('Generate Random Groups');
	$titlediv.append($title);
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

	const $buildGroupsButtonDiv = $('<div>').attr('id', 'buildGroupsButtonDiv');
	$form.append($buildGroupsButtonDiv);

	const $submit = $('<input>')
		.attr('type', 'submit')
		.attr('id', 'groupSizeSubmit')
		.attr('value', 'Build Groups')
		.attr('class', 'buttonFillColor');
	$buildGroupsButtonDiv.append($submit);

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
			$('#showCombinationsParentDiv').remove();
			$('#saveGroupsForm').remove();
		} else {
			$form.get(0).reportValidity(); //Need to display validity message
		}
	});
};

//////////////////////////////////////////////////
// Save Generated Groups Listener
//////////////////////////////////////////////////
const groupSaveButtonListener = () => {
	$('#groupSaveSubmit').on('click', () => {
		saveGroupsToDB(squadID, saveGroups());
		$('#showCombinationsParentDiv').remove();
		alert('Groups Saved!');
	});
};

//////////////////////////////////////////////////
// Get group combinations
//////////////////////////////////////////////////
const getCombinations = (id, size) => {
	$.ajax({
		url: `/squads/randomize/${size}/${id}`,
		success: data => {
			// console.log('SHOW COMBINATIONS DATA:');
			// console.log(data);
			showCombinations(data);
		},
		error: (request, status, err) => {
			console.log('Error getting data: ' + request + status + err);
		}
	});
};

//////////////////////////////////////////////////
// Show group combinations
//////////////////////////////////////////////////
const showCombinations = arrayOfGroups => {
	const $showCombinationsParentDiv = $('<div>').attr(
		'id',
		'showCombinationsParentDiv'
	);
	const $combinationsDiv = $('<div>').attr('id', 'combinationsDiv');
	$('#main').append($($showCombinationsParentDiv));
	$showCombinationsParentDiv.append($($combinationsDiv));
	arrayOfGroups.groups.forEach(group => {
		const $div = $('<div>');
		$div.attr('class', 'draggableContainer');
		$combinationsDiv.append($div);
		group.forEach(nameIndex => {
			const $newName = $('<div>')
				.text(arrayOfGroups.names[nameIndex].name)
				.attr('nameIndex', nameIndex)
				.attr('class', 'nameDiv');
			$div.append($newName);
		});
	});

	const $saveGroupsDiv = $('<div>').attr('id', 'saveGroupsForm');
	$showCombinationsParentDiv.append($saveGroupsDiv);

	const $form = $('<form>')
		.attr('id', 'saveGroupForm')
		.attr('onsubmit', 'return false');
	$saveGroupsDiv.append($form);

	const $submit = $('<input>')
		.attr('type', 'submit')
		.attr('id', 'groupSaveSubmit')
		.attr('value', 'Save Groups');
	$form.append($submit);

	groupSaveButtonListener();

	//Scroll to created groups
	$('html, body').animate(
		{
			scrollTop: $('#showCombinationsParentDiv').offset().top
		},
		500
	);

	// Initialize dragging
	dragging();
};

//////////////////////////////////////////////////
// Save Generated Groups Listener
//////////////////////////////////////////////////
const saveGroups = () => {
	const $groupContainers = $('.draggableContainer');

	const groups = [];

	// console.log($groupContainers);

	$groupContainers.each((index, group) => {
		// console.log(group);
		const tempGroup = [];
		// console.log($(group).children());

		$(group)
			.children()
			.each(function() {
				// console.log($(this).attr('nameindex'));
				tempGroup.push(Number($(this).attr('nameindex')));
			});
		groups.push(tempGroup);
	});

	// console.log(groups);
	return groups;
};

//////////////////////////////////////////////////
// Enable Dragula dragging
//////////////////////////////////////////////////
const dragging = () => {
	// Enable draggin for all containers with class draggableContainer
	dragula([].slice.call(document.querySelectorAll('.draggableContainer')));
};

// CALL FUNCTIONS
squadName(squadID);
namesArrayOfObjects(squadID);
showGroupForm();

//////////////////////////////////////////////////
// Edit Squad Names Menu
//////////////////////////////////////////////////
const editSquadNameMenu = () => {
	const ref = $('#squadTitle');
	const popup = $('#editTitlePopup');
	// const popup = $('#editNamesPopup');

	popup.hide();

	if (!listenerNameState) {
		editTitleListener();
	}

	ref.click(function() {
		if (
			popup.is(':visible') &&
			$('#squadTitle').attr('contenteditable') === 'false'
		) {
			popup.hide();
		} else {
			popup.show();
			var popper = new Popper(ref, popup, {
				placement: 'right',
				onCreate: function(data) {
					// console.log(data);
				},
				modifiers: {
					offset: {
						enabled: true,
						offset: '0,20'
					}
				}
			});
		}
	});
};

//////////////////////////////////////////////////
// Edit Squad Names Listener
//////////////////////////////////////////////////
const editTitleListener = () => {
	console.log('listener initialized');
	$('#startTitleEdit').on('click', () => {
		if ($('#startTitleEdit').text() === 'edit') {
			// Edit State, switch to save
			// console.log('editing state');
			$('#startTitleEdit').text('save');
			$('#squadTitle').attr('contenteditable', 'true');
			$('#squadTitle').focus();
		} else {
			//Save State
			// console.log('save state');
			$('#startTitleEdit').text('edit');
			$('#squadTitle').attr('contenteditable', 'false');
			$('#squadTitle').blur(); /* Unfocuses */
			$('#editTitlePopup').hide();

			const newTitle = $('#squadTitle').text();
			updateSquadName(squadID, newTitle);
		}
	});
};

//////////////////////////////////////////////////
// Edit People Menu
//////////////////////////////////////////////////
const editPeopleMenu = () => {
	$('.individualNamesContainer').click(function() {});

	const ref = $('.individualNamesContainer');
	const popup = $('#editNamesPopup');

	popup.hide();

	// SET UP LISTENERS
	if (!listenerNameState) {
		removeNameListener();
		markAsAbsentListener();
		listenerNameState = true;
	}

	ref.click(function() {
		const clickedNameIndex = $(this).attr('nameIndex');
		const selectedName = $(`[nameIndex=${clickedNameIndex}]`);

		let selectedNameAbsense = $(this).attr('absent');
		if (selectedNameAbsense === 'true') {
			selectedNameAbsense = true;
		} else {
			selectedNameAbsense = false;
		}

		if (popup.is(':visible')) {
			popup.hide();
		} else {
			selectedNameIndex = Number(clickedNameIndex);
			selectedNameAbsentState = selectedNameAbsense;
			console.log(selectedNameIndex);
			popup.show();
			var popper = new Popper(selectedName, popup, {
				placement: 'right',
				onCreate: function(data) {
					// console.log(data);
				}
			});
		}
	});
};

//////////////////////////////////////////////////
// Remove Names Listener
//////////////////////////////////////////////////
const removeNameListener = () => {
	$('#removeName').on('click', () => {
		// Remove Name
		removeName(squadID, selectedNameIndex);

		// Hide popup
		$('#editNamesPopup').hide();
	});
};

//////////////////////////////////////////////////
// Remove Name
//////////////////////////////////////////////////
const removeName = (id, nameIndex) => {
	$.ajax({
		url: `/squads/data/${id}/${nameIndex}`,
		type: 'DELETE',
		success: data => {
			namesArrayOfObjects(squadID);
		},
		error: (request, status, err) => {
			console.log('Error getting data: ' + request + status + err);
		}
	});
};

//////////////////////////////////////////////////
// Mark As Absent Listener
//////////////////////////////////////////////////
const markAsAbsentListener = () => {
	$('#markNameAbsent').on('click', () => {
		markAsAbsent(squadID, selectedNameIndex, selectedNameAbsentState);
		$('#editNamesPopup').hide();
	});
};

//////////////////////////////////////////////////
// Remove Name
//////////////////////////////////////////////////
const markAsAbsent = (id, nameIndex, currentAbsentState) => {
	$.ajax({
		url: `/squads/data/${id}/${nameIndex}/${currentAbsentState}`,
		type: 'PUT',
		success: data => {
			namesArrayOfObjects(squadID);
		},
		error: (request, status, err) => {
			console.log('Error getting data: ' + request + status + err);
		}
	});
};
