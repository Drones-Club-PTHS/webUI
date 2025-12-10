export function GitTable(tableElement) {
	// generate(tskJson, currentStudent)
	tableElement.generate = generateGitTableContent.bind(null, tableElement);
	return tableElement;
}

function generateGitTableContent(tableElement, stJson) {
	tableElement.innerHTML = "";
	tableElement.append(...rowsGenerator(stJson));
}

function* rowsGenerator(stJson) {
	let row;
	for (const student of stJson) {
		row = document.createElement("tr");
		row.student = student;
		row.append(...cellsGenerator(student));
		yield row;
	}
}

function* cellsGenerator(student) {
	let cell = document.createElement("td");
	cell.innerHTML = student.id;
	yield cell;
	cell = document.createElement("td");
	cell.innerHTML = `<a href="${student["git_repo_link"]}">${student["git_repo_link"]}</a>`;
	cell.student = student;
	cell.cellAction = cellAction;
	cell.addEventListener("dblclick", cell.cellAction);
	yield cell;
}

function cellAction() {
	const student = this.student;
	const newGitRepoLink = prompt(`Old git_repo_link:\n${student["git_repo_link"]}\nNew value:`);
	if (newGitRepoLink) {
		function updateData(stJson) {
			for (const st of stJson) {
				if (st.id == student.id) {
					st["git_repo_link"] = newGitRepoLink;
					return;
				}
			}
		}
		function updateCell(cell) {
			cell.innerHTML = `<a href="${student["git_repo_link"]}">${newGitRepoLink}</a>`;
			cell.classList.add("edited");
		}
		function updateTable(table) {
			for (const row of table.children) {
				if (row.student.id == student.id) {
					updateCell(row.children[1]);
					return;
				}
			}
		}
		updateCell(this);
		window.updateHandler.addUpdate(updateData, updateTable);
	}
}
