import { getFile, commitFile } from "./github_api.mjs";

export class GitHubFile {
	constructor(filename) {
		this.filename = filename;
		this.content = undefined;
		this.sha = undefined;
		this.login = {
			get name() { return localStorage.getItem("githubLogin-name") },
			get email() { return localStorage.getItem("githubLogin-email") },
			get token() { return localStorage.getItem("githubLogin-token") },
			get studentsFileUrl() { return localStorage.getItem("githubLogin-studentsFileUrl") },
			get tasksFileUrl() { return localStorage.getItem("githubLogin-tasksFileUrl") }
		}
	}
	getUrl() {
		switch (this.filename) {
			case "students.json":
				return this.login.studentsFileUrl;
			case "tasks.json":
				return this.login.tasksFileUrl;
		}
	}
	async fetch(ifJson=true) {
		const file = await getFile(this.login.token, this.getUrl());
		if (ifJson) {
			this.content = JSON.parse(file.content);
		} else {
			this.content = file.content;
		}
		this.sha = file.sha;
	}
	async commit(ifJson=true) {
		let data;
		if (ifJson) {
			data = JSON.stringify(this.content, null, 2);
		} else {
			data = this.content;
		}
		const commitPromice = commitFile(this.login.token, this.login.name, this.login.email, this.getUrl(), data, "Update students.json", this.sha)
		commitPromice.then(res => {if (res.content.sha) { this.sha = res.content.sha }});
		return commitPromice
	}
	async updateSha() {
		const file = await this.github.getFile(this.url);
		this.sha = file.sha;
	}
}

export class GitHubStudentsFile {
	
}
