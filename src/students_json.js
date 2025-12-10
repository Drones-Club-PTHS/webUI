import * as github from "./github.js";

export function removeStudent(stJson, studentLink) {
	for (let i = 0; i < stJson.length; i++) {
		if (stJson[i] == studentLink) {
			stJson.splice(i, 1);
		}
	}
}
export function getStudentById(stJson, id) {
	for (const student of stJson) {
		if (student.id == id) { return student; }
	}
}
export function addNewLesson(stJson, date) {
	stJson.forEach(
		student => { student.lessons[date] = "" }
	);
}
