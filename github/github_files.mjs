import { getFile, commitFile } from "./github_api.mjs";

export class GitHubFile {
	constructor(filename) {
		this.filename = filename;
		this.content = undefined;
		this.sha = undefined;
	}
	checkLogin() {
		const login = window.githubLogins.getCurrentLogin();
		if (!login) {
			throw new Error("Current GithubLogin not set");
		} else if (!login.getUrl(this.filename)) {
			throw new Error(`In current GithubLogin no URL for "${this.filename}" file.`);
		}
		return login;
	}
	async fetch(ifJson=true) {
		const login = this.checkLogin();
		const file = await getFile(login.token, login.getUrl(this.filename));
		if (ifJson) {
			this.content = JSON.parse(file.content);
		} else {
			this.content = file.content;
		}
		this.sha = file.sha;
	}
	async commit(ifJson=true) {
		const login = this.checkLogin();
		let data;
		if (ifJson) {
			data = JSON.stringify(this.content, null, 2);
		} else {
			data = this.content;
		}
		const commitPromice = commitFile(login.token, login.name, login.email, login.getUrl(this.filename), data, "Update students.json", this.sha)
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
