function generateRowsColumns(table, data) {
	return {
		columns: ["student", "git_repo_link"],
		rows: data.students
	}
}

function createCell(table, data, rows, columns, row_student, col) {
	const cell = document.createElement("td");
	cell.student = row_student;
	if (col == "student") {
		cell.innerHTML = row_student.id;
	} else if (col == "git_repo_link") {
		if (row_student["git_repo_link"]) {
			cell.innerHTML = `<a href="${row_student["git_repo_link"]}">${row_student["git_repo_link"]}</a>`;
		}
		cell.cellAction = cellAction;
		cell.addEventListener("dblclick", cell.cellAction);
	}
	return cell;
}

function cellAction() {
	const newGitRepoLink = prompt(`Old git_repo_link:\n${this.student["git_repo_link"]}\nNew value:`);
	if (newGitRepoLink) {
		this.student["git_repo_link"] = newGitRepoLink;
		this.innerHTML = `<a href="${this.student["git_repo_link"]}">${this.student["git_repo_link"]}</a>`;
	}
}

// FUNCTIONS OBJECT
const functions = {
	generateRowsColumns: generateRowsColumns,
	createRow: (table, data, rows, columns, row) => {return document.createElement("tr")},
	createCell: createCell
}

// EXPORT
export {functions}