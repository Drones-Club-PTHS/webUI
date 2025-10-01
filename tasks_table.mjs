// STUDENTS TABLE

function generateRowsColumns_studentsTable(data) {
	return {
		columns: ["column"],
		rows: data.studentsData.students
	}
}

function createCell_studentsTable(data, rows, columns, row_student, col) {
	const cell = document.createElement("td");
	cell.innerHTML = row_student.id;
	if (data.currentStudent == row_student) {
		cell.classList.add("current_student");
	}
	addClickEvent_studentsTable(cell, data, row_student)
	return cell;
}

function addClickEvent_studentsTable(cell, data, student) {
	cell.addEventListener("dblclick", () => {
		data.currentStudent = student;
		window.studentsTable.tableGenerator.generateTableContent();
		window.tasksTable.tableGenerator.generateTableContent();
	});
}

// TASKS TABLE

function generateRowsColumns_tasksTable(data) {
	return {
		columns: ["N", "name", "status"],
		rows: ["name", ...data.tasks],
	}
}

function createCell_tasksTable(data, rows, columns, row_task, col) {
	const cell = document.createElement("td");
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
		if (data.currentStudent == undefined) { cell.innerHTML = ""
		} else if (data.currentStudent.tasks.includes(row_task.id)) {
			if (data.currentStudent.git.includes(row_task.id)) {
				cell.innerHTML = "+";
			} else {
				cell.innerHTML = "•";
			}
		} else {
			cell.innerHTML = "";
		}
		addClickEvent_tasksTable(cell, data.currentStudent, row_task.id);
	}
	return cell;
}

function removeValueFromArray(array, value) {
	const index = array.indexOf(value);
	if (index !== -1) {
		array.splice(index, 1);
	}
}

function addClickEvent_tasksTable(cell, student, taskId) {
	cell.addEventListener("dblclick", () => {
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
		window.tasksTable.tableGenerator.generateTableContent();
	});
}

// MAIN
const studentsTableFunctions = {
	generateRowsColumns: generateRowsColumns_studentsTable,
	createRow: (data, rows, columns, row) => {return document.createElement("tr")},
	createCell: createCell_studentsTable
}
const tasksTableFunctions = {
	generateRowsColumns: generateRowsColumns_tasksTable,
	createRow: (data, rows, columns, row) => {return document.createElement("tr")},
	createCell: createCell_tasksTable
}

export {studentsTableFunctions, tasksTableFunctions}
