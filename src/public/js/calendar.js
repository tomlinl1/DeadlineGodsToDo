const monthNames = [
		'January','February','March','April','May','June',
		'July','August','September','October','November','December'
];

let currentDate = new Date(); // current date

localStorage.setItem("username", "admin"); // for testing purposes, set a default username in localStorage
window.CURRENT_USER_ID = localStorage.getItem("username");

const calendarBody = document.getElementById('calendar-body');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');

// Starting logic
(function () {
	document.addEventListener('DOMContentLoaded', async 	() => {
		prevBtn.addEventListener('click', () => changeMonth(-1));
		nextBtn.addEventListener('click', () => changeMonth(1));
		await fetchCalendarTasks(window.CURRENT_USER_ID); // fetch tasks for current user
		renderCalendar(currentDate);
		renderDueTasks(currentDate);
		addEventListeners();
	});
})();

function addEventListeners() {
	const modal = new bootstrap.Modal(document.getElementById('calendarModal'))
	const modalTitle = document.getElementById('calendarModalLabel');
	const modalLink = document.getElementById('modalDetailLink');

	document.querySelectorAll('.task').forEach(task => {
		task.addEventListener('click', (e) => {
			console.log(e.target);

			modalTitle.textContent = e.target.textContent; // set modal title to task title
			let taskId = e.target.dataset.taskId;
			modalLink.href = `/detail/${taskId}`; // set link to task edit page

			modal.show();
		})
	});

	console.log(modal);
	console.log(document.querySelectorAll('.task'));
}

function renderCalendar(date) {
	const month = date.getMonth();
	const year = date.getFullYear();
	const rows = 6;
	const firstDay = new Date(year, month, 1).getDay();

	// calendar header
	document.getElementById('month-year').textContent = `${monthNames[month]} ${year}`;

	calendarBody.innerHTML = ''; // clear previous calendar

	// calendar cells
	let cells = [];
	
	// create cells
	for (let i = 0; i < rows * 7; i++) {
		const dayOffset = i - firstDay + 1; // 1 means first of month when i == firstDay
		const cellDate = new Date(year, month, dayOffset);
		const isCurrentMonth = cellDate.getMonth() === month;
		
		const cellContent = document.createElement('div');
		cellContent.className = 'cell-content';

		const cell = document.createElement('td');                  // create the element in the cell
		cell.classList.add('calendar-day');                         // class of the days
		if (!isCurrentMonth) cell.classList.add('text-muted');      // mute nums of days not in the current month
		cell.dataset.date = cellDate.toISOString().slice(0, 10);    // store date in data attribute

		// Create internal structure of the cell: day number and tasks container
		const dayDiv = document.createElement('div');               
		dayDiv.className = 'day-number';
		dayDiv.textContent = cellDate.getDate();

		const tasksDiv = document.createElement('div');
		tasksDiv.className = 'tasks-container';

		cellContent.appendChild(dayDiv);
		cellContent.appendChild(tasksDiv);

		cell.appendChild(cellContent);

		cells.push(cell);
	}

	// build rows of 7
	for (let r = 0; r < rows; r++) {
		const row = document.createElement('tr');
		for (let c = 0; c < 7; c++) {
			row.appendChild(cells[r * 7 + c]);
		}
		calendarBody.appendChild(row);
	}

	// Store cells globally after appending to DOM
	window.calendarCells = cells;

	renderTasks();
}


function renderTasks() {
    if (!window.CALENDAR_TASKS || !window.calendarCells) return; // safety check

    const tasks = window.CALENDAR_TASKS.slice().sort((a, b) => b.priority - a.priority); // sort by priority descending
    const cells = window.calendarCells;
    //const taskLimit = 3; 

    tasks.forEach(task => {
        const startDate = task.date.slice(0, 10);
        //const endDate = task.end_date ? task.end_date.slice(0, 10) : startDate;
        const startCell = cells.find(c => c.dataset.date === startDate);

        const startIndex = cells.findIndex(c => c.dataset.date === startDate);
        if (startIndex === -1) return; // task starts outside calendar range
        
        //const endIndex = cells.findIndex(c => c.dataset.date === endDate);
        //const actualEndIdx = (endIndex === -1) ? startIndex : endIndex;

        let canRender = true;
		const taskPriority = task.priority || 0; // default to 0 if priority is missing
        //
        // Todo: Check if any cell in the task's date range has reached the task limit
        //
        if (!canRender) return; // if any cell in range is full, skip rendering this task

        const taskDiv = document.createElement('div');
        //
        // Todo: Create a better html structure for the task (e.g., include priority color, link if available, etc.)
        //
        taskDiv.className = `task priority-${taskPriority}`; // add priority class for styling
        taskDiv.style.cursor = 'pointer';
        taskDiv.dataset.taskId = task._id; // store task ID for potential future use (e.g., click handler)
        taskDiv.textContent = task.title;

        const taskContainer = cells[startIndex].querySelector('.tasks-container');
        taskContainer.appendChild(taskDiv);
    })
    

}

function renderDueTasks(date) {
	const month = date.getMonth();
	const nextMonth = (month + 1) % 12;
	const year = date.getFullYear();
	const upcomingBody = document.getElementById('upcoming-tasks-body');
	const overdueBody = document.getElementById('overdue-tasks-body');

	let dueTasks = window.CALENDAR_TASKS.filter(task => {
		const taskDate = new Date(task.date);
		return ( taskDate.getMonth() === month || taskDate.getMonth() === nextMonth ) && taskDate.getFullYear() === year;
	});

	dueTasks.sort((a, b) => new Date(a.date) - new Date(b.date)); // sort by date ascending

	dueTasks.forEach(task => { //render upcoming tasks
		let newElement = document.createElement('li');
		let taskPriority = task.priority || "low"; // default to 0 if priority is missing
		newElement.className = `task priority-${taskPriority} list-group-item`; // add priority class for styling
		newElement.style.cursor = 'pointer';
		newElement.dataset.taskId = task._id; // store task ID for potential future use (e.g., click handler)
		newElement.textContent = task.title;

		upcomingBody.appendChild(newElement);
	});

	let overdueTasks = window.CALENDAR_TASKS.filter(task => {
		const taskDate = new Date(task.date);
		return currentDate > taskDate;
	});

	if (!overdueTasks.length === 0) { // render overdue tasks if there are any
		overdueTasks.sort((a, b) => new Date(a.date) - new Date(b.date)); // sort by date ascending
		overdueTasks.forEach(task => {
			let newElement = document.createElement('li');
			let taskPriority = task.priority || "low"; // default to 0 if priority is missing
			newElement.className = `task priority-${taskPriority} list-group-item`; // add priority class for styling
			newElement.style.cursor = 'pointer';
			newElement.dataset.taskId = task._id; // store task ID for potential future use (e.g., click handler)
			newElement.textContent = task.title;

			overdueBody.appendChild(newElement);
		});
	}
}

function changeMonth(offset) {
	currentDate.setMonth(currentDate.getMonth() + offset);
	renderCalendar(currentDate);
}

async function fetchCalendarTasks(userId) {
	try {
		const response = await fetch(`/api/${userId}`);
		if (!response.ok) {
			throw new Error(`Error fetching tasks: ${response.statusText}`);
		}
		const tasks = await response.json();
		window.CALENDAR_TASKS = tasks; // store tasks globally
		renderTasks(); // render tasks after fetching
	} catch (err) {
		console.error(err);
		window.CALENDAR_TASKS = []; // set to empty array on error to avoid undefined issues
	}
}