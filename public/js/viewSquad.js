const squadID = $('#squadIndex').text();

let selectedNameIndex = 0;
let selectedNameAbsentState = false;
let listenerNameState = false;

$('#editTitlePopup').hide();
$('#editNamesPopup').hide();

//////////////////////////////////////////////////
// Upon Visiting Page, Store ID in Local Storage
//////////////////////////////////////////////////
localStorage.setItem('squad', squadID);

//////////////////////////////////////////////////
// Add URL to page
//////////////////////////////////////////////////
const currentURL = window.location.href;
const $urlText = $('<p>').text(`Bookmark or `);

$urlText.append(`<a id="save">save</a>`);
$urlText.append(' this page to return to your squad.');

$('#currentURL').append($urlText);

const copyURLListener = () => {
	$('#save').on('click', () => {
		// Adapted from https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
		function copyToClipboard(text) {
			var $temp = $('<input>')
				.attr('value', text)
				.attr('id', 'tempCopy');
			$('body').append($temp);
			$temp.select();
			document.execCommand('copy');
			$temp.remove();
			alert('Copied squad page URL to clipboard.');
		}

		copyToClipboard(String(currentURL));
	});
};

copyURLListener();

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
		type: 'POST',
		success: data => {
			getAddedGroupIndexAndRedirect(squadID);
		}
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

	namesArrayOfObjects(squadID);
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
	$('#addNameDiv').remove();
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

	showAddNameButton();
	editSquadNameMenu();
	editPeopleMenu();
};

//////////////////////////////////////////////////
// Displays Add New Name Button On The Page
//////////////////////////////////////////////////
const showAddNameButton = () => {
	const $addNameDiv = $('<div>').attr('id', 'addNameDiv');
	$('#namesContainer').append($addNameDiv);

	const $button = $('<a>')
		.text('Add Name')
		.attr('id', 'addName');
	$addNameDiv.append($button);

	// Start listener
	addNameListener();
};

//////////////////////////////////////////////////
// Displays Add New Name Form On Page
//////////////////////////////////////////////////
const showAddNameForm = () => {
	const $addNameFormDiv = $('<div>').attr('id', 'addNameFormDiv');
	$('#addNameDiv').append($addNameFormDiv);

	const $form = $('<form>')
		.attr('onsubmit', 'return false')
		.attr('id', 'addNameForm');
	$addNameFormDiv.append($form);

	const $input = $('<input>')
		.attr('type', 'text')
		.attr('id', 'newName')
		.attr('placeholder', 'Name')
		.prop('required', true);
	$form.append($input);

	const $buildGroupsButtonDiv = $('<div>').attr('id', 'buildGroupsButtonDiv');
	$form.append($buildGroupsButtonDiv);

	const $submit = $('<input>')
		.attr('type', 'submit')
		.attr('id', 'submitNewName')
		.attr('value', 'Add Name To Squad')
		.attr('class', 'buttonFillColor');
	$buildGroupsButtonDiv.append($submit);

	submitNewNameListener();
};

//////////////////////////////////////////////////
// Add Name Listener
//////////////////////////////////////////////////
const addNameListener = () => {
	$('#addName').on('click', () => {
		$('#addName').hide();
		showAddNameForm();
	});
};

//////////////////////////////////////////////////
// Submit New Name Listener
//////////////////////////////////////////////////
const submitNewNameListener = () => {
	$('#submitNewName').on('click', () => {
		const $form = $('#addNameForm');
		// If form passes validation
		if ($form.get(0).reportValidity()) {
			const inputtedName = document.getElementById('newName').value; //jQuery .val would not work here for some reason

			addNewName(squadID, inputtedName);

			$('#addName').show();
			$('#addNameFormDiv').remove();
		} else {
			$form.get(0).reportValidity(); //Need to display validity message
		}
	});
};

//////////////////////////////////////////////////
// Post New Name
//////////////////////////////////////////////////
const addNewName = (id, name) => {
	$.ajax({
		url: `/squads/data/${id}/${name}`,
		type: 'POST',
		success: data => {
			namesArrayOfObjects(squadID);
		}
	});
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
		// Save group to database
		saveGroupsToDB(squadID, saveGroups());

		// getAddedGroupIndexAndRedirect(squadID);
	});
};

//////////////////////////////////////////////////
// Get last added group index and redirect to page
//////////////////////////////////////////////////
const getAddedGroupIndexAndRedirect = id => {
	$.ajax({
		url: `/squads/data/groupindex/${id}`,
		success: data => {
			// console.log(data);
			// showCombinations(data);
			window.location.href = `/squads/${squadID}/${data}`;
		},
		error: (request, status, err) => {
			console.log('Error getting data: ' + request + status + err);
		}
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
	// console.log(arrayOfGroups);
	const $showCombinationsParentDiv = $('<div>').attr(
		'id',
		'showCombinationsParentDiv'
	);

	const $combinationsTitleDiv = $('<div>').attr('id', 'combinationsTitleDiv');
	$showCombinationsParentDiv.append($combinationsTitleDiv);

	const $title = $('<h3>')
		.attr('id', 'combinationsTitle')
		.text('Randomly Generated Groups');
	$combinationsTitleDiv.append($title);

	const $subtitle = $('<h5>')
		.attr('id', 'combinationsSubtitle')
		.text(
			'Groups can be customized by dragging squad members names to different groups.'
		);
	$combinationsTitleDiv.append($subtitle);

	//DISPLAY REPEATS BADGE IF REPEATS
	if (arrayOfGroups.repeats) {
		const $repeats = $('<h5>')
			.attr('id', 'combinationsRepeatMessage')
			.text('No more unique group combinations possible.');
		$combinationsTitleDiv.append($repeats);
	}

	const $combinationsDiv = $('<div>').attr('id', 'combinationsDiv');
	$('#squadDiv').after($($showCombinationsParentDiv));
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
			// console.log(selectedNameIndex);
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

//////////////////////////////////////////////////
// Show Groups History
//////////////////////////////////////////////////
const showGroupsHistory = groupsObject => {
	$('#groupHistoryDiv').remove();

	if (groupsObject.length > 0) {
		const $groupHistoryDiv = $('<div>').attr('id', 'groupHistoryDiv');
		$('#main').append($groupHistoryDiv);

		const $groupHistoryTitleDiv = $('<div>').attr('id', 'groupHistoryTitleDiv');
		$groupHistoryDiv.append($groupHistoryTitleDiv);

		const $title = $('<h3>')
			.attr('id', 'groupHistoryTitle')
			.text('Past Generated Groups');
		$groupHistoryTitleDiv.append($title);

		groupsObject.forEach((pastGroup, index) => {
			// console.log(pastGroup);
			const time = moment(`${pastGroup.createdAt}`);
			const formattedTime = time.format('MMMM Do YYYY, h:mm a');

			const $link = $('<a>')
				.attr('href', `/squads/${squadID}/${index}`)
				.attr('class', 'groupLink')
				.text(formattedTime);

			$groupHistoryTitleDiv.after($link);
		});
	}
};

//////////////////////////////////////////////////
// Get Groups History
//////////////////////////////////////////////////
const getGroupsHistory = id => {
	$.ajax({
		url: `/squads/data/${id}/history`,
		success: data => {
			// console.log(data);
			showGroupsHistory(data);
		},
		error: (request, status, err) => {
			console.log('Error getting data: ' + request + status + err);
		}
	});
};

getGroupsHistory(squadID);
