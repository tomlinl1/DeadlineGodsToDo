// basic calendar generation script

(function () {
	const monthNames = [
		'January','February','March','April','May','June',
		'July','August','September','October','November','December'
	];

	let current = new Date(); // current date variable (we will adjust month/year)

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
			cell.dataset.date = cellDate.toISOString();
			cell.textContent = cellDate.getDate();

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
