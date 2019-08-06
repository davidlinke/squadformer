const squadID = $('#squadIndex').text();

localStorage.setItem('squad', squadID);

const squadName = id => {
	$.ajax({
		url: `/squads/data/${id}/squadname`,
		success: data => {},
		error: (request, status, err) => {
			console.log('Error getting data: ' + request + status + err);
		}
	});
};

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

const showNames = namesArray => {
	// console.log('names array should follow');
	// console.log(namesArray);
	const $names = $('<div>').attr('id', 'namesContainer');
	$('#main').prepend($names);
	namesArray.forEach((nameObject, nameIndex) => {
		// console.log(nameObject);
		const $nameDiv = $('<div>')
			.attr('id', 'individualNamesContainer')
			.attr('nameIndex', nameIndex);
		$names.append($nameDiv);
		const $newName = $('<p>').text(nameObject.name);
		$nameDiv.append($newName);
	});

	// TEST DRAGGING SQUAD
	// dragula([document.getElementById('namesContainer')]);
};

namesArrayOfObjects(squadID);
squadName(squadID);

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

const groupButtonListener = () => {
	$('#groupSizeSubmit').on('click', () => {
		let size = $('#groupSize').val();
		getCombinations(squadID, size);
		$('#combinationsDiv').remove();
	});
};

showGroupForm();

const getCombinations = (id, size) => {
	$.ajax({
		url: `/squads/randomize/${size}/${id}`,
		success: data => {
			// console.log(data);
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
	arrayOfGroups.forEach(group => {
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
