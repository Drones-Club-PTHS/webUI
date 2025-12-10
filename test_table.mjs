export function generateVisitTableContent(stJson, tableElement, extraLessonDates = []) {
	tableElement.jsonData = JSON.parse(JSON.stringify(stJson));
	tableElement.innerHTML = "";
	tableElement.append(...rowGenerator(tableElement.jsonData, extraLessonDates));
}

function* rowGenerator(stJson, extraLessonDates) {
	const lessonsArray = createLessonsArray(stJson, extraLessonDates);
	// Header Months
	let row = document.createElement("tr");
	row.append(...headerMonthsGenerator(lessonsArray));
	yield row;
	// Header Dates
	row = document.createElement("tr");
	row.append(...headerDatesGenerator(lessonsArray));
	yield row;
	// Students
	for (const student of stJson) {
		row = document.createElement("tr");
		row.student = student;
		row.append(...studentCellsGenerator(student, lessonsArray));
		yield row;
	}
}

function* studentCellsGenerator(student, lessonsArray) {
	let cell = document.createElement("td");
	cell.innerHTML = student.id;
	yield cell;
	for (const date of lessonsArray) {
		cell = document.createElement("td");
		cell.student = student;
		cell.lessonDate = date;
		cell.cellAction = visitCellAction;
		cell.classList.add("visit-cell");
		cell.addEventListener("dblclick", cell.cellAction);
		if (date in student.lessons) { cell.innerHTML = student.lessons[date] }
		else { cell.innerHTML = "" }
		yield cell;
	}
}

function* headerDatesGenerator(lessonsArray) {
	let cell = document.createElement("th");
	cell.innerHTML = "Имя";
	yield cell;
	for (const date of lessonsArray) {
		cell = document.createElement("td");
		cell.innerHTML = date.split(".")[0];
		yield cell;
	}
}

function* headerMonthsGenerator(lessonsArray) {
	let cell = document.createElement("td");
	yield cell;
	function getCell(month, counter) {
		const cell = document.createElement("th");
		cell.innerHTML = monthsNames[month];
		if (counter > 1) {
			cell.colSpan = counter;
		}
		return cell;
	}
	const months = lessonsArray.map(date => date.split(".")[1]);
	const countedMonths = months.reduce((res, cur) => {
		if (res.length == 0 || res[res.length - 1][0] != cur) {
			res.push([cur, 1]);
		} else {
			res[res.length - 1][1] += 1;
		}
		return res;
	}, []);
	for (const [month, counter] of countedMonths) {
		yield getCell(month, counter);
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

function createLessonsArray(stJson, extraLessonDates) {
	const lessonsSet = new Set();
	for (const l of extraLessonDates) {lessonsSet.add(l);}
	for (const s of stJson) {
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

// Actions
// function 

function visitCellAction() {
	const cell = this;
	const getVisitStatus = () => { return cell.student.lessons[cell.lessonDate] }
	function getNewStatus(status) {
		switch (status) {
			case undefined:
				return "+";
			case "+":
				return "0";
			default:
				return undefined;
		}
	}
	const newStatus = getNewStatus(getVisitStatus());
	function updateData(stJson) {
		for (const st of stJson) {
			if (st.id == cell.student.id) {
				st.lessons[cell.lessonDate] = newStatus
			}
		}
	}
	function updateCell(cell) {
		cell.classList.add("edited");
		const newState = getNewStatus(cell.student.lessons[cell.lessonDate]);
		cell.student.lessons[cell.lessonDate] = newState;
		if (newState == undefined) {
			cell.innerHTML = "";
		} else {
			cell.innerHTML = newState;
		}
	}
	function updateTable(table) {
		for (const row of table.children) {
			if (row.student?.id == cell.student.id) {
				for (const rowCell of row.children) {
					if (rowCell.lessonDate == cell.lessonDate) {
						updateCell(rowCell);
					}
				}
			}
		}
	}
	updateCell(cell);
	window.updateHandler.addUpdate(updateData, updateTable);
}
