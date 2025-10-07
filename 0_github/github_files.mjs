import { getFile, commitFile } from "./github_api.mjs";

export class GitHubFile {
	constructor(filename) {
		this.filename = filename;
		this.content = undefined;
		this.sha = undefined;
	}
	getLogin() {
		const login = localStorage.getItem("githubCurrentLoginJson");
		if (login) {
			return JSON.parse(login);
		}
	}
	getUrl() {
		switch (this.filename) {
			case "students.json":
				return this.getLogin().studentsFileUrl;
			case "tasks.json":
				return this.getLogin().tasksFileUrl;
		}
	}
	async fetch(ifJson=true) {
		const file = await getFile(this.getLogin().token, this.getUrl());
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
		const login = this.getLogin();
		const commitPromice = commitFile(login.token, login.name, login.email, this.getUrl(), data, "Update students.json", this.sha)
		commitPromice.then(res => {if (res.content.sha) { this.sha = res.content.sha }});
		return commitPromice
	}
	async updateSha() {
		const file = await this.github.getFile(this.url);
		this.sha = file.sha;
	}
}
