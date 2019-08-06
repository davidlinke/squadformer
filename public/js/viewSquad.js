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

//////////////////////////////////////////////////
// Displays Form To Make Random Groups
//////////////////////////////////////////////////
const showGroupForm = () => {
	const $showGroupFormDiv = $('<div>').attr('id', 'showGroupForm');
	$('#main').append($showGroupFormDiv);
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
		.attr('value', 'Build Groups');
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
			$('#combinationsDiv').remove();
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
	const $combinationsDiv = $('<div>').attr('id', 'combinationsDiv');
	$('#main').append($($combinationsDiv));
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
	$('#main').append($saveGroupsDiv);

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
