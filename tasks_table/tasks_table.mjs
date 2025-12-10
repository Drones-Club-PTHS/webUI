export function TasksTable(tableElement) {
	// generate(tskJson, currentStudent)
	tableElement.generate = generateTasksTableContent.bind(null, tableElement);
	return tableElement;
}

function generateTasksTableContent(tableElement, tskJson, currentStudent) {
	tableElement.jsonData = JSON.parse(JSON.stringify(stJson));
	tableElement.innerHTML = "";
	tableElement.append(...rowsGenerator(currentStudent, tskJson));
}

function* rowsGenerator(currentStudent, tskJson) {
	// Header
	let row = document.createElement("tr");
	row.append(...headerGeneragor(currentStudent));
	yield row;
	// Tasks
	for (const task of tskJson) {
		row = document.createElement("tr");
		row.taskId = task.id;
		row.append(...taskCellsGenerator(task.id, task.name, currentStudent));
		yield row;
	}
}

function* headerGeneragor(currentStudent) {
	yield document.createElement("td");
	let cell = document.createElement("td");
	cell.innerHTML = currentStudent.id;
	cell.classList.add("current-student");
	yield cell;
	yield document.createElement("td");
	cell = document.createElement("td");
	cell.innerHTML = "git";
	yield cell;
}

function* taskCellsGenerator(taskId, taskName, currentStudent) {
	function createCell(innerHTML="") {
		const cell = document.createElement("td");
		cell.innerHTML = innerHTML;
		cell.taskId = taskId;
		cell.currentStudent = currentStudent;
		return cell;
	}
	yield createCell(taskId);
	yield createCell(taskName);
	let cell = createCell();
	if (currentStudent.tasks.includes(taskId)) { cell.innerHTML = "+" }
	cell.cellAction = taskCellAction;
	cell.addEventListener("dblclick", cell.cellAction);
	yield cell;
	cell = createCell();
	if (currentStudent.git.includes(taskId)) { cell.innerHTML = "+" }
	yield cell;
}

// 

function removeValueFromArray(array, value) {
	const index = array.indexOf(value);
	if (index !== -1) {
		array.splice(index, 1);
	}
}

function taskCellAction() {
	const taskId = this.taskId;
	const currentStudent = this.currentStudent;
	const currentState = currentStudent.tasks.includes(taskId);
	
	function updateTask(student, taskId, currentState){
		if (currentState) {
			removeValueFromArray(student.tasks, taskId);
		} else {
			student.tasks.push(taskId);
		}
	} 
	function updateData(stJson) {
		console.log("update data", taskId, currentState)
		for (const student of stJson) {
			if (student.id == currentStudent.id) {
				updateTask(student, taskId, currentState);
				return
			}
		}
	}
	function updateCell(cell) {
		updateTask(cell.currentStudent, cell.taskId, currentState)
		if (currentState) {
			cell.innerHTML = "";
		} else {
			cell.innerHTML = "+";
		}
		cell.classList.add("edited");
	}
	function updateTable(table) {
		for (const row of table.children) {
			if (row.taskId == taskId) {
				updateCell(row.children[2]);

				return;
			}
		}
	}
	updateTable.student = currentStudent;
	updateCell(this);
	window.updateHandler.addUpdate(updateData, updateTable);
}