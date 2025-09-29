export class GithubLogins {
    constructor() {
		this.onUpdate = [];
        if (localStorage.getItem("githubLogins")) {
            this.logins = JSON.parse(localStorage.getItem("githubLogins"));
        } else {
            this.logins = {}
        }
        if (localStorage.getItem("githubCurrentLogin")) {
            this.current = localStorage.getItem("githubCurrentLogin");
        } else {
            this.current = undefined;
        }
    }
	runOnUpdate() {
		this.onUpdate.forEach(func => { func() });
	}
    saveToLocalStorage() {
        localStorage.setItem("githubLogins", JSON.stringify(this.logins));
        localStorage.setItem("githubCurrentLogin", this.current);
		const login = this.logins[this.current]
		localStorage.setItem("githubLogin-name", login.name);
		localStorage.setItem("githubLogin-email", login.email);
		localStorage.setItem("githubLogin-token", login.token);
		localStorage.setItem("githubLogin-studentsFileUrl", login.studentsFileUrl);
		localStorage.setItem("githubLogin-tasksFileUrl", login.tasksFileUrl);
		this.runOnUpdate();
    }
    addNewEmptyLogin(name) {
        if (name in this.logins) {
            console.error(`Login "${name}" already exist.`);
            return;
        }
        this.logins[name] = {
			name: "",
        	email: "",
        	token: "",
			studentsFileUrl: "",
			tasksFileUrl: ""
		};
        this.saveToLocalStorage();
    }
    updateLogin(name, key, value) {
        this.logins[name][key] = value;
        this.saveToLocalStorage();
    }
    setCurrentLogin(name) {
        if (!(name in this.logins)) {
            console.error(`No login "${name}".`);
            return;
        }
        this.current = name;
        this.saveToLocalStorage();
    }
}