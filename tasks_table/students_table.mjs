export function StudentsTable(tableElement) {
	// generate(stJson, currentStudent)
	tableElement.generate = generateStudentsTableContent.bind(null, tableElement);
	return tableElement;
}

function generateStudentsTableContent(tableElement, stJson, currentStudent) {
	tableElement.innerHTML = "";
	tableElement.append(...rowsGenerator(stJson, currentStudent));
}

function* rowsGenerator(stJson, currentStudent) {
	let row, cell;
	for (const student of stJson) {
		row = document.createElement("tr");
		cell = document.createElement("td");
		row.append(cell);
		cell.innerHTML = student.id;
		cell.student = student;
		if (student.id == currentStudent.id) {
			cell.classList.add("current-student");
		}
		cell.cellAction = cellAction;
		cell.addEventListener("dblclick", cell.cellAction);
		yield row;
	}
}

function cellAction(event) {
	console.log(event.target)
	window.currentStudent = this.student;
	window.tasksTable.generate(window.tskJson, window.currentStudent);
	window.studentsTable.generate(window.stJson, window.currentStudent);
}
