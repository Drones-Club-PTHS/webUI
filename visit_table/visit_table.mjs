class RowColumn {
	constructor(type, title="", options={}) {
		this.title = title;
		this.type = type;
		this.options = options;
	}
}

const monthsNames = {
	"01":"янв",
	"02":"фев",
	"03":"мар",
	"04":"апр",
	"05":"май",
	"06":"июнь",
	"07":"июль",
	"08":"авг",
	"09":"сент",
	"10":"окт",
	"11":"ноя",
	"12":"дек"
};

function createLessonsArray(data) {
	const lessonsSet = new Set();
	for (const s of data.students) {
		for (const l in s.lessons) {
			lessonsSet.add(l);
		}
	}
	const lessonsArray = Array.from(lessonsSet).sort((d1, d2) => {
		d1 = d1.split(".").map(Number);
		d2 = d2.split(".").map(Number);
		if (d1[2] != d2[2]) {return d1[2] - d2[2]}
		if (d1[1] != d2[1]) {return d1[1] - d2[1]}
		return d1[0] - d2[0]
	});
	return lessonsArray;
}

// GENERATE COLUMNS/ROWS

function generateRows(data) {
	const rows = [
		new RowColumn("header-months"),
		new RowColumn("header-date"),
	]
	for (const s of data.students) {
		rows.push(new RowColumn("student", "", {student: s, rows: rows}));
	}
	return rows;
}

function generateColumns(lessonsArray) {
	const columns = [
		new RowColumn("name_id", "Имя")
	];
	for (const lessolDate of lessonsArray) {
		const day = lessolDate.split(".")[0];
		columns.push(new RowColumn("lesson", day, {date: lessolDate, columns: columns}));
	}
	return columns;
}

function generateRowsColumns(table, data) {
	return {
		rows: generateRows(data),
		columns: generateColumns(createLessonsArray(data))
	}
}

// CREATE HEADERS

function configHeaderDate(cell) {
	cell.innerHTML = cell.col.title;
}

function configHeaderMonth(cell){
	if (cell.col.type != "lesson") { return true; }
	function getMonth(date) { return date.split(".")[1] };
	const month = getMonth(cell.col.options.date);
	let currentMonth = undefined;
	const columns = cell.col.options.columns;
	for (let i = 0; i < columns.length; i++) {
		if (cell.col == columns[i]) {
			if (month == currentMonth) { return false; }
			let counter = 0;
			for (let j = i; j < columns.length; j++) {
				if (getMonth(columns[j].options.date) == month) {
					counter += 1;
				} else {
					break
				}
			}
			cell.colSpan = counter;
			cell.innerHTML = monthsNames[month];
				return true;
		}
		if (columns[i].type == "lesson") {
			currentMonth = getMonth(columns[i].options.date);
		}
	}
}

// CREATE CELLS/ROWS

function createRow(table, data, rows, columns, row) {
	const rowElement = document.createElement("tr");
	rowElement.row = row;
	row.rowCell = rowElement;
	return rowElement
}

function configVisitCell(cell) {
	cell.setAttribute('tabindex', '0');
	setVisitCellContent(cell);
}

function setVisitCellContent(cell) {
	const date = cell.col.options.date
	const lessons = cell.row.options.student.lessons;
	if (!(date in lessons)) { cell.innerHTML = "×" }
	else if (lessons[date] == "") { cell.innerHTML = "" }
	else if (lessons[date] == "visit") { cell.innerHTML = "+" }
	else if (lessons[date] == "absent") { cell.innerHTML = "-" }
	else { cell.innerHTML = "?"}
}

function setNameCellContent(cell) {
	cell.innerHTML = cell.row.options.student.id;
}

function createCell(table, data, rows, columns, row, col) {
	let cell;
	if (row.type == "header-date" || row.type == "header-date") {
		cell = document.createElement("th");
	} else {
		cell = document.createElement("td");
	}
	cell.row = row;
	cell.col = col;
	if (row.type == "header-months") {
		if (!configHeaderMonth(cell)) {cell = undefined};
	} else if (row.type == "header-date") {
		configHeaderDate(cell);
	} else if (row.type == "student") {
		if (col.type == "name_id") {
			setNameCellContent(cell);
			cell.cellAction = studentNameCellAction;
		} else if (col.type == "lesson") {
			configVisitCell(cell);
			cell.cellAction = visitCellAction;
		}
		cell.addEventListener("dblclick", cell.cellAction);
	}
	return cell;
}

// EVENTS

function studentNameCellAction() {
	let id = prompt(`Для "${this.row.options.student.id}"\n"Фамилия Имя"\n`);
	if (id) {
		this.row.options.student.id = id;
		setNameCellContent(this);
	}
}

function visitCellAction() {
	const getVisitStatus = () => { return this.row.options.student.lessons[this.col.options.date] }
	const setVisitStatus = (status) => { this.row.options.student.lessons[this.col.options.date] = status }
	switch (getVisitStatus()) {
		case "":
			setVisitStatus("visit");
			break;
		case "visit":
			setVisitStatus("absent");
			break;
		case "absent":
			setVisitStatus("");
			break;
		default:
			setVisitStatus("");
			break;
	}
	setVisitCellContent(this);
}

function keyEvent(event) {
	switch (event.key) {
		case "Enter": 
			event.target?.cellAction();
			break;
		case "ArrowUp":
			setFocus("up");
			break;
		case "ArrowDown":
			setFocus("down");
			break;
		case "ArrowRight":
			setFocus("right");
			break;
		case "ArrowLeft":
			setFocus("left");
			break;
	}
}

function setFocus(direction) {
	const cell = document.activeElement;
	if (!(cell.col && cell.row)) { return }
	const rows = cell.row.options.rows;
	const columns = cell.col.options.columns;
	if (direction == "up" || direction == "down") {
		let i = rows.indexOf(cell.row);
		if (direction == "down") { i = i+1 } else { i = i-1 }
		if (!rows[i]) {return}
		if (rows[i].type != "student") {return}
		for (const newCell of rows[i].rowCell.children) {
			if (newCell.col == cell.col) {
				newCell.focus();
				return;
			}
		}
	} else if (direction == "right" || direction == "left") {
		let i = columns.indexOf(cell.col);
		if (direction == "right") { i = i+1 } else { i = i-1 }
		if (!columns[i]) {return}
		for (const newCell of cell.row.rowCell.children) {
			if (newCell.col == columns[i]) {
				newCell.focus();
				return;
			}
		}
	}
}

// MAIN FUNCTIONS
const functions={
	generateRowsColumns: generateRowsColumns,
	createRow: createRow,
	createCell: createCell
}

// EXPORT
export {functions, keyEvent}

