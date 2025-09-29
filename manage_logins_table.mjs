function generateRowsColumns(data) {
	const rows = [];
	["githubCurrentLogin",
		"githubLogin-name",
		"githubLogin-email",
		"githubLogin-token",
		"githubLogin-studentsFileUrl",
		"githubLogin-tasksFileUrl"
	].forEach(item => { rows.push({
		loginName: undefined,
		key: item,
		value: localStorage.getItem(item),
		title: false
	}) });
	for (const loginName in data.logins) {
		rows.push({
			loginName: loginName,
			title: true
		});
		for (const key in data.logins[loginName]) {
			rows.push({
				loginName: loginName,
				key: key,
				value: data.logins[loginName][key],
				title: false
			});
		}
	}
	return {
		columns: ["key", "value"],
		rows: rows,
	}
}

function createCell(data, rows, columns, row, col) {
	const cell = document.createElement("td");
	if (col == "key") {
		if (row.title) {
			cell.innerHTML = row.loginName;
			cell.classList.add("loginName");
		} else {
			cell.innerHTML = row.key;
			cell.classList.add("key");
		}
	} else if (col == "value") {
		if (!row.title) {
			cell.innerHTML = row.value;
			cell.classList.add("value");
			if (row.loginName != undefined) {
				addClickEvent_value(cell, row.loginName, row.key, row.value)
			} else {
				addClickEvent_localStorage(cell, row.key)
			}
			
		}
	}
	if (row.loginName == undefined) {
		cell.classList.add("localStorage");
	}
	return cell;
}

function addClickEvent_value(cell, loginName, key, value) {
	cell.addEventListener("dblclick", () => {
		let newValue = prompt(`Старое значение:\n${value}\nНовое значение:\n`);
		if (newValue) {
			window.logins.updateLogin(loginName, key, newValue);
		}
	});
}

function addClickEvent_localStorage(cell, field) {
	cell.addEventListener("dblclick", () => {
		let newValue = prompt(`Старое значение:\n${localStorage.getItem(field)}\nНовое значение:\n`);
		if (newValue) {
			if (field == "githubCurrentLogin") {
				window.logins.setCurrentLogin(newValue);
			} else {
				localStorage.setItem(field, newValue);
			}
		}
	});
}

// MAIN
const functions = {
	generateRowsColumns: generateRowsColumns,
	createRow: (data, rows, columns, row) => {return document.createElement("tr")},
	createCell: createCell
}

export { functions }
