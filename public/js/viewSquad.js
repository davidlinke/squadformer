const squadID = $('#squadIndex').text();

let selectedNameIndex = 0;
let selectedNameAbsentState = false;
let listenerNameState = false;
let listenerSquadNameState = false;

let pastCombinations;

$('#editTitlePopup').hide();
$('#editNamesPopup').hide();
$('#editTitlePopup').css('display', 'block');
$('#editNamesPopup').css('display', 'block');

//////////////////////////////////////////////////
// Initialize Dragging and Dropping
//////////////////////////////////////////////////
// Prevent scrolling on mobile while dragging and dropping
// Solution from https://github.com/bevacqua/dragula/issues/487#issuecomment-383872371
let scrollable = true;
const listener = function(e) {
	if (!scrollable) {
		e.preventDefault();
	}
};
document.addEventListener('touchmove', listener, { passive: false });

let drake = dragula({
	moves: function(element, source, handle, sibling) {
		if ($(element).attr('id') === 'addText') {
			return false; // prevent addText paragraph text from being moveable
		} else {
			return true;
		}
	}
})
	.on('drag', function(el, source) {
		scrollable = false; // disable page scrolling on mobile while dragging
	})
	.on('drop', function(element, target, source, sibling) {
		removeEmptyNameContainers(); // remove any empty .draggableContainer divs
		addNewNameContainer(target); // handle add new name div
		checkGroupsForRepeats(); // check if repeats and show visual feedback
		scrollable = true; // re-enable scrolling on mobile
	});

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
	let nameCount = 0;

	// If exists, remove
	if ($('#divForNames').length) {
		$('#divForNames').remove();
	}

	// If exists, remove
	if ($('#addNameDiv').length) {
		$('#addNameDiv').remove();
	}

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
				nameCount++;
			}

			$divForNames.append($nameDiv);
			const $newName = $('<p>').text(nameObject.name);
			$nameDiv.append($newName);
		}
	});

	showAddNameButton();

	editPeopleMenu();

	if (!listenerSquadNameState) {
		listenerSquadNameState = true;
		editSquadNameMenu();
	}

	showEvenGroupSizes(calculateGroupNumbers(nameCount));
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
		.attr('value', '2');
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

			// If exists, remove
			if ($('#showCombinationsParentDiv').length) {
				$('#showCombinationsParentDiv').remove();
			}

			// If exists, remove
			if ($('#saveGroupsForm').length) {
				$('#saveGroupsForm').remove();
			}
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
			.text(
				'No longer possible to generate all unique group combinations at this group size.'
			);
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

	// Add to dragula
	const arrayOfNameContainers = [].slice.call(
		document.querySelectorAll('.draggableContainer')
	);
	arrayOfNameContainers.forEach(element => {
		drake.containers.push(element);
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

	// Scroll to created groups
	$('html, body').animate(
		{
			scrollTop: $('#showCombinationsParentDiv').offset().top
		},
		500
	);

	addNewNameContainer();
	checkGroupsForRepeats();
};

//////////////////////////////////////////////////
// Save Generated Groups Listener
//////////////////////////////////////////////////
const saveGroups = () => {
	const $groupContainers = $('.draggableContainer');
	const groups = [];

	$groupContainers.each((index, group) => {
		const tempGroup = [];

		if ($(group).hasClass('addNew') === false) {
			$(group)
				.children()
				.each(function() {
					tempGroup.push(Number($(this).attr('nameindex')));
				});
			groups.push(tempGroup);
		}
	});

	return groups;
};

//////////////////////////////////////////////////
// Remove empty name containers
//////////////////////////////////////////////////
const removeEmptyNameContainers = () => {
	const $groupContainers = $('.draggableContainer');

	$groupContainers.each((index, group) => {
		if ($(group).children().length === 0 && !$(group).hasClass('addNew')) {
			$(group).remove();
		}
	});
};

//////////////////////////////////////////////////
// Add New Name Group Container
//////////////////////////////////////////////////
const addNewNameContainer = (target = null) => {
	// If something is dropped on add new container, make it a normal draggable container
	if ($(target).hasClass('addNew')) {
		$(target).removeClass('addNew');
		$('#addText').remove();
	}

	// If add new does not exist on page already, make a new one
	if ($('.addNew').length === 0) {
		const $add = $('<div>').attr('class', 'draggableContainer addNew');
		$('#combinationsDiv').append($add);

		const $addText = $('<p>')
			.text('Drag a name here to create a new group')
			.attr('id', 'addText');
		$add.append($addText);

		// Add to dragula containers
		drake.containers.push(document.querySelector('.addNew'));
	}
};

//////////////////////////////////////////////////
// Edit Squad Names Menu
//////////////////////////////////////////////////
const editSquadNameMenu = () => {
	const ref = $('#squadTitle');
	const popup = $('#editTitlePopup');

	popup.hide();

	listenerSquadNameState = true;
	editTitleListener();

	ref.click(function() {
		if (
			popup.is(':visible') &&
			$('#squadTitle').attr('contenteditable') === 'false'
		) {
			popup.hide();
		} else {
			popup.show();

			const popper = new Popper(ref, popup, {
				placement: 'right',
				onCreate: function(data) {},
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

			$('#startTitleEdit').text('save');
			$('#squadTitle').attr('contenteditable', 'true');
			$('#squadTitle').focus();
		} else {
			//Save State

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

			popup.show();
			const popper = new Popper(selectedName, popup, {
				placement: 'right',
				onCreate: function(data) {}
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
	// If exists, remove
	if ($('#groupHistoryDiv').length) {
		$('#groupHistoryDiv').remove();
	}

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
			const time = moment(`${pastGroup.createdAt}`);
			const formattedTime = time.format('MMMM Do YYYY, h:mm a');

			const $link = $('<a>')
				.attr('href', `/squads/${squadID}/${index}`)
				.attr('class', 'groupLink')
				.text(formattedTime);

			$groupHistoryTitleDiv.after($link);
		});

		const $resetHistoryDiv = $('<div>').attr('id', 'resetHistoryDiv');
		$groupHistoryDiv.append($resetHistoryDiv);

		const $resetHistory = $('<a>')
			.text('Reset Past Combinations')
			.attr('id', 'resetHistory');
		$resetHistoryDiv.append($resetHistory);

		removePastCombinationsListener();
	}
};

//////////////////////////////////////////////////
// Get Groups History
//////////////////////////////////////////////////
const getGroupsHistory = id => {
	$.ajax({
		url: `/squads/data/${id}/history`,
		success: data => {
			showGroupsHistory(data);
		},
		error: (request, status, err) => {
			console.log('Error getting data: ' + request + status + err);
		}
	});
};

getGroupsHistory(squadID);

//////////////////////////////////////////////////
// Calculate Common Group Count Divisibly By Integers
//////////////////////////////////////////////////
const calculateGroupNumbers = count => {
	let countArray = [];
	if (count === 0) {
		return '0';
	} else if (count === 1) {
		return '1';
	}

	// Check if evenly divisible between numbers and add to array
	for (let i = 2; i <= 10; i++) {
		if (count % i === 0) {
			countArray.push(`${i}`);
		}
	}

	let countString = '';
	for (let i = 0; i < countArray.length; i++) {
		if (i === 0) {
			countString += countArray[i];
		} else if (i < countArray.length - 1) {
			countString += `, ${countArray[i]}`;
		} else if (i === countArray.length - 1 && countArray.length > 2) {
			countString += `, and ${countArray[i]}`;
		} else if (i === countArray.length - 1 && countArray.length === 2) {
			countString += ` and ${countArray[i]}`;
		}
	}

	return countString;
};

//////////////////////////////////////////////////
// Show Even Group Sizes
//////////////////////////////////////////////////
const showEvenGroupSizes = string => {
	// If exists, remove
	if ($('#evenGroupSizesTitle').length) {
		$('#evenGroupSizesTitle').remove();
	}

	if (string !== '') {
		const $sizes = $('<h5>')
			.text('Even Group Sizes: ')
			.attr('id', 'evenGroupSizesTitle');

		$sizes.append(`<span class="boldH5">${string}</span>`);

		$('#generateGroupsTitleDiv').append($sizes);
	}
};
//////////////////////////////////////////////////
// Get past combinations
//////////////////////////////////////////////////
const getPastCombinations = id => {
	$.ajax({
		url: `/squads/data/${id}/pastcombinations`,
		success: data => {
			pastCombinations = data;
		},
		error: (request, status, err) => {
			console.log('Error getting data: ' + request + status + err);
		}
	});
};

//////////////////////////////////////////////////
// Check for repeats
//////////////////////////////////////////////////
const checkGroupsForRepeats = () => {
	const $groupContainers = $('.draggableContainer');
	let anyRepeats = false;

	$groupContainers.each((index, group) => {
		const tempGroup = [];

		if ($(group).hasClass('addNew') === false) {
			$(group)
				.children()
				.each(function() {
					tempGroup.push(Number($(this).attr('nameindex')));
				});
			tempGroup.sort();
			const key = groupToString(tempGroup);
			if (pastCombinations.hasOwnProperty(key)) {
				// if repeat found, add class
				$(group).addClass('repeatsContainer');

				if (anyRepeats === false) {
					anyRepeats = true;
					// Display repeats message
					if (
						$('#combinationsRepeatMessage').length === 0 &&
						$('#repeatsFound').length === 0
					) {
						const $repeats = $('<h5>')
							.attr('id', 'repeatsFound')
							.text('Repeats Found');
						$('#combinationsTitleDiv').append($repeats);
					}
				}
			} else if ($(group).hasClass('repeatsContainer')) {
				//has repeate class already, should be removed
				$(group).removeClass('repeatsContainer');
			}
		}
	});

	if (anyRepeats === false && $('#repeatsFound').length > 0) {
		$('#repeatsFound').remove();
	}
};

// Convert array to comma separated string representation (I like this format better than JSON.stringify)
const groupToString = groupArray => {
	let groupString = '';
	groupArray.forEach((item, index) => {
		groupString += item;
		if (index != groupArray.length - 1) {
			groupString += ',';
		}
	});
	return groupString;
};

//////////////////////////////////////////////////
// Remove Past Combinations
//////////////////////////////////////////////////
const removePastCombinations = id => {
	$.ajax({
		url: `/squads/data/${id}/pastcombinations`,
		type: 'DELETE',
		success: data => {
			getPastCombinations(squadID);
		},
		error: (request, status, err) => {
			console.log('Error getting data: ' + request + status + err);
		}
	});
};

//////////////////////////////////////////////////
// Remove Past Combinations Listener
//////////////////////////////////////////////////
const removePastCombinationsListener = () => {
	$('#resetHistory').on('click', () => {
		let confirmed = confirm(
			'Are you sure you want to reset your past combinations history? Your past groups will still be visible/accessible; however newly generated groups may contain repeats. This action is non-reversible.'
		);
		if (confirmed) {
			removePastCombinations(squadID);
		}
	});
};

// CALL FUNCTIONS
squadName(squadID);
showGroupForm();
getPastCombinations(squadID);
