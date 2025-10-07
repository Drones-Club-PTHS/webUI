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
		rows.push(new RowColumn("student", "", {student: s}));
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

function createHeaderDate(row, col) {
	const cell = document.createElement("th");
	cell.innerHTML = col.title;
	return cell;
}

function createHeaderMonth(row, col){
	if (col.type != "lesson") { return document.createElement("th") }
	function getMonth(date) { return date.split(".")[1] };
	const month = getMonth(col.options.date);
	let currentMonth = undefined;
	const columns = col.options.columns;
	for (let i = 0; i < columns.length; i++) {
		if (col == columns[i]) {
			if (month == currentMonth) { return }
			let counter = 0;
			for (let j = i; j < columns.length; j++) {
				if (getMonth(columns[j].options.date) == month) {
					counter += 1;
				} else {
					break
				}
			}
			const cell = document.createElement("th");
			cell.colSpan = counter;
			cell.innerHTML = monthsNames[month];
				return cell;
		}
		if (columns[i].type == "lesson") {
			currentMonth = getMonth(columns[i].options.date);
		}
	}
}

// CREATE CELLS/ROWS

function createRow(table, data, rows, columns, row) {
	return document.createElement("tr");
}

function createVisitCell(row, col) {
	const cell = document.createElement("td");
	cell.setAttribute('tabindex', '0');
	const date = col.options.date;
	const lessons = row.options.student.lessons;
	if (!(date in lessons)) { cell.innerHTML = "×" }
	else if (lessons[date] == "") { cell.innerHTML = "" }
	else if (lessons[date] == "visit") { cell.innerHTML = "+" }
	else if (lessons[date] == "absent") { cell.innerHTML = "-" }
	else { cell.innerHTML = "?" }
	return cell;
}

function createNameCell(row, col) {
	const cell = document.createElement("td");
	cell.innerHTML = row.options.student.id;
	return cell;
}

function createCell(table, data, rows, columns, row, col) {
	if (row.type == "header-months") {
		return createHeaderMonth(row, col, columns)
	} else if (row.type == "header-date") {
		return createHeaderDate(row, col);
	} else if (row.type == "student") {
		if (col.type == "name_id") {
			const cell = createNameCell(row, col);
			addClickEvent_changeName(cell, table, row, col);
			return cell
		} else if (col.type == "lesson") {
			const cell = createVisitCell(row, col);
			addClickEvent_switchVisits(cell, table, row, col);
			return cell;
		}
	}
	return document.createElement("td");
}

// ADD EVENTS

function addClickEvent_switchVisits(cell, table, row, col) {
	if (col.type != "lesson" || row.type != "student") { return }
	const getVisitStatus = () => { return row.options.student.lessons[col.options.date] }
	const setVisitStatus = (status) => { row.options.student.lessons[col.options.date] = status }
	cell.addEventListener('dblclick', function() {
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
		table.tableGenerator.generateTableContent();
	});
}

function addClickEvent_changeName(cell, table, row, col) {
	if (col.type != "name_id" || row.type != "student") { return }
	const getStudentId = () => { return row.options.student.id }
	const setStudentId = (id) => { row.options.student.id = id }
	cell.addEventListener("dblclick", function() {
		let id = prompt(`Для "${row.options.student.id}"\n"Фамилия Имя"\n`);
		if (id) {
			row.options.student.id = id;
			table.tableGenerator.generateTableContent();
		}
	});
}

// MAIN
export const functions={
	generateRowsColumns: generateRowsColumns,
	createRow: createRow,
	createCell: createCell
}

