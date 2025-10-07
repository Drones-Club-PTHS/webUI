function generateRowsColumns(table, data) {
	return {
		columns: ["column"],
		rows: data.studentsData.students
	}
}

function createCell(table, data, rows, columns, row_student, col) {
	const cell = document.createElement("td");
	cell.data = data;
	cell.student = row_student;
	cell.innerHTML = row_student.id;
	if (data.currentStudent == row_student) {
		cell.classList.add("current_student");
	}
	cell.setAttribute('tabindex', '0');
	cell.cellAction = cellAction;
	cell.addEventListener("dblclick", cell.cellAction);
	return cell;
}

function cellAction() {
	this.data.currentStudent = this.student;
	window.studentsTable.tableGenerator.generateTableContent();
	window.tasksTable.tableGenerator.generateTableContent();
	window.studentsTable.querySelector(".table td.current_student")?.focus();
}

// FUNCTIONS OBJECT
const functions = {
	generateRowsColumns: generateRowsColumns,
	createRow: (table, data, rows, columns, row) => {return document.createElement("tr")},
	createCell: createCell
}

// EVENTS

function tableClickEvent(event) {
	const row = event.target.closest(".table tr");
	setFocusRow(row);
}

function keyEvent(event) {
	console.log(event.key);
	switch (event.key) {
		case "Enter": 
			event.target?.cellAction();
			break;
		case "ArrowUp":
			setFocusRow(getFocusRow().previousElementSibling);
			break;
		case "ArrowDown":
			setFocusRow(getFocusRow().nextElementSibling);
			break;
	}
}

function getFocusRow() {
	return document.activeElement.closest(".table tr");
}

function setFocusRow(row) {
	row?.querySelector("td")?.focus();
}

// EXPORT
export {functions, keyEvent, tableClickEvent}