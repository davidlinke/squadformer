const squadID = $('#squadIndex').text();

localStorage.setItem('squad', squadID);

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
	const $title = $('<h3>').text('Generate Random Groups');
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
		$('#combinationsDiv').empty();
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

const dragAndDrop = {
	init: function() {
		this.dragula();
		this.eventListeners();
	},

	eventListeners: function() {
		this.dragula.on('drop', this.dropped.bind(this));
	},

	dragula: function() {
		this.dragula = dragula(
			// [document.querySelector('#left'), document.querySelector('#right')],
			[document.querySelector('.draggableContainer')],
			{
				moves: this.canMove.bind(this)
			}
		);
	},

	canMove: function() {
		return true;
	},

	dropped: function(el) {}
};

// dragAndDrop.init();

const dragging = () => {
	// Enable draggin for all containers with class draggableContainer
	dragula([].slice.call(document.querySelectorAll('.draggableContainer')));
};
