const squadID = $('#squadIndex').text();

const getSquadObject = id => {
	$.ajax({
		url: `/squads/data/${id}`,
		success: data => {
			// console.log(data);
			showNames(data);
		},
		error: (request, status, err) => {
			console.log('Error getting data: ' + request + status + err);
		}
	});
};

const showNames = squadObject => {
	const $names = $('<ul>');
	$('#main').prepend($('<hr>'));
	$('#main').prepend($names);
	squadObject.names.forEach(name => {
		const $newName = $('<li>').text(name);
		$names.append($newName);
	});
};

getSquadObject(squadID);

const showGroupForm = () => {
	const $title = $('<h2>').text('Generate Random Groups');
	$('#main').append($title);
	const $form = $('<form>')
		.attr('onsubmit', 'return false')
		.attr('id', 'groupForm');
	$('#main').append($form);

	const $label = $('<label>')
		.attr('for', 'groupSize')
		.text('Group Size');
	$form.append($label);

	const $input = $('<input>')
		.attr('type', 'number')
		.attr('id', 'groupSize')
		.attr('min', '2')
		.attr('max', '10');
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
	$('#main').append($('<hr>'));
	arrayOfGroups.forEach(group => {
		const $group = $('<ul>');
		$('#main').append($group);
		group.forEach(name => {
			const $newName = $('<li>').text(name);
			$group.append($newName);
		});
	});
};
