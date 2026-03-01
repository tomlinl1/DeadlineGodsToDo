// basic calendar generation script

(function () {
	const monthNames = [
		'January','February','March','April','May','June',
		'July','August','September','October','November','December'
	];

	let current = new Date(); // current date variable (we will adjust month/year)
	let cells = []; // global array to store cells for renderTasks

	function renderCalendar(date) {
		const month = date.getMonth();
		const year = date.getFullYear();

		// write month/year header
		document.getElementById('month-year').textContent =
			`${monthNames[month]} ${year}`;

		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const tbody = document.getElementById('calendar-body');
		tbody.innerHTML = '';

		// We always render a 7x6 grid (42 cells).
		// For each cell index 0..41 compute the corresponding date relative to the first of current month.
		// cellDate = new Date(year, month, (index - firstDay + 1)) will yield previous/next month dates automatically.
		let cells = [];
		for (let i = 0; i < 42; i++) {
			const dayOffset = i - firstDay + 1; // 1 means first of month when i == firstDay
			const cellDate = new Date(year, month, dayOffset);
			const isCurrentMonth = cellDate.getMonth() === month;

			const cell = document.createElement('td');
			cell.classList.add('calendar-day');
			if (!isCurrentMonth) cell.classList.add('text-muted');
			cell.dataset.date = cellDate.toISOString().slice(0, 10);

			// Create internal structure: day number and tasks container
			const dayDiv = document.createElement('div');
			dayDiv.className = 'day-number';
			dayDiv.textContent = cellDate.getDate();

			const tasksDiv = document.createElement('div');
			tasksDiv.className = 'tasks-container';

			cell.appendChild(dayDiv);
			cell.appendChild(tasksDiv);

			cells.push(cell);
		}

		// build rows of 7
		for (let r = 0; r < 6; r++) {
			const row = document.createElement('tr');
			for (let c = 0; c < 7; c++) {
				row.appendChild(cells[r * 7 + c]);
			}
			tbody.appendChild(row);
		}

		// Store cells globally after appending to DOM
		window.calendarCells = cells;

		// Render tasks on the calendar
		renderTasks();
	}

	function renderTasks() {
		if (!window.calendarCells || !window.CALENDAR_TASKS) return;

		const cells = window.calendarCells;
		const tasks = (window.CALENDAR_TASKS || []).slice().sort((a, b) => {
			return new Date(a.startDate) - new Date(b.startDate);
		});

		// Track task count per cell (max 3)
		const cellTaskCount = {};
		cells.forEach(c => {
			cellTaskCount[c.dataset.date] = 0;
		});

		// Render each task
		tasks.forEach(task => {
			const startDate = task.startDate.slice(0, 10);
			const endDate = task.endDate ? task.endDate.slice(0, 10) : startDate;

			// Find cell indices
			const startIdx = cells.findIndex(c => c.dataset.date === startDate);
			if (startIdx === -1) return; // task not in visible month range

			const endIdx = cells.findIndex(c => c.dataset.date === endDate);
			const actualEndIdx = (endIdx === -1) ? startIdx : endIdx;

			// Check if task fits (max 3 per cell)
			let canFit = true;
			for (let i = startIdx; i <= actualEndIdx; i++) {
				if (cellTaskCount[cells[i].dataset.date] >= 3) {
					canFit = false;
					break;
				}
			}

			if (!canFit) return;

			// Create and append task box
			const box = document.createElement('div');
			box.className = 'task-box';
			box.textContent = task.name;
			box.title = task.name;
			box.style.cursor = 'pointer';
			box.dataset.taskId = task.id;

			const tasksDiv = cells[startIdx].querySelector('.tasks-container');
			if (tasksDiv) {
				tasksDiv.appendChild(box);
				cellTaskCount[cells[startIdx].dataset.date]++;
			}

			// Mark spanned cells
			for (let i = startIdx + 1; i <= actualEndIdx; i++) {
				cellTaskCount[cells[i].dataset.date]++;
			}
		});
	}

	function changeMonth(offset) {
		current.setMonth(current.getMonth() + offset);
		renderCalendar(current);
	}

	document.addEventListener('DOMContentLoaded', () => {
		const prev = document.getElementById('prev-month');
		const next = document.getElementById('next-month');
		if (prev) prev.addEventListener('click', () => changeMonth(-1));
		if (next) next.addEventListener('click', () => changeMonth(1));
		renderCalendar(current);
	});
})();
