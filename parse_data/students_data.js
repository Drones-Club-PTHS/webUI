export class StudentsData {
	constructor(rawStudentsArray) {
		// this.rawStudentsArray = rawStudentsArray;
		this.students = [];
		rawStudentsArray.forEach(s => {
			this.students.push(new Student(s))
		})
	}
	addStudent(options) {
		const student = new Student(options);
		this.students.push(student);
	}
	removeStudent(studentLink) {
		this.students = this.students.filter(item => item !== studentLink);
	}
	getStudentById(id) {
		for (const student of this.students) {
			if (student.id == id) { return student; }
		}
	}
	addNewLesson(date) {
		this.students.forEach(
			student => { student.addLesson(date, "") }
		);
	}
}

class Student {
	constructor(options) {
		this.id = options.id;
		this.name = options.name || [];
		this.lessons = options.lessons || {};
		this.tasks = options.tasks || [];
	}
	addLesson(date, status) {
		this.lessons[date] = status;
	}
	removeLesson(date) {
		delete this.lessons[date];
	}
	addTask(task) {
		if (!this.tasks.includes(task)) {
			this.tasks.push(task);
		}
	}
}
