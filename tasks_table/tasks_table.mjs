function generateRowsColumns(table, data) {
	return {
		columns: ["N", "name", "status"],
		rows: ["name", ...data.tasks],
	}
}

function createCell(table, data, rows, columns, row_task, col) {
	const cell = document.createElement("td");
	cell.data = data;
	cell.task = row_task;
	if (row_task == "name") {
		if (col == "N" || col == "status") { return cell }
		if (data.currentStudent) {
			cell.innerHTML = data.currentStudent.id;
		}
		cell.classList.add("title");
		return cell;
	}
	if (col == "N") { cell.innerHTML = row_task.id;
	} else if (col == "name") { cell.innerHTML = row_task.name;
	} else if (col == "status") {
		setStatusCellContent(cell);
		cell.setAttribute('tabindex', '0');
		cell.classList.add("status");
		cell.cellAction = cellAction;
		cell.addEventListener("dblclick", cell.cellAction);
	}
	return cell;
}

function setStatusCellContent(cell) {
	if (cell.data.currentStudent == undefined) { cell.innerHTML = ""
	} else if (cell.data.currentStudent.tasks.includes(cell.task.id)) {
		if (cell.data.currentStudent.git.includes(cell.task.id)) {
			cell.innerHTML = "+";
		} else {
			cell.innerHTML = "•";
		}
	} else {
		cell.innerHTML = "";
	}
}

function removeValueFromArray(array, value) {
	const index = array.indexOf(value);
	if (index !== -1) {
		array.splice(index, 1);
	}
}

function cellAction() {
	const student = this.data.currentStudent;
	const taskId = this.task.id;
	if (student.tasks.includes(taskId)) {
		if (student.git.includes(taskId)) {
			removeValueFromArray(student.tasks, taskId);
			removeValueFromArray(student.git, taskId);
		} else {
			student.git.push(taskId);
		}
	} else {
		student.tasks.push(taskId);
	}
	setStatusCellContent(this);
}

// FUNCTIONS OBJECTS
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
	row?.querySelector("td.status")?.focus();
}

// EXPORT
export {functions, keyEvent, tableClickEvent}
