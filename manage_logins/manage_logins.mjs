export class GithubLogins {
    // localStorage:
    //     "githubLogins"
    //     "githubCurrentLogin"
    //     "githubCurrentLoginJson"
    constructor() {
		this.onUpdate = [];
        this.logins = JSON.parse(localStorage.getItem("githubLogins"));
		if (!this.logins) {
			this.logins = {}
		}
        this.current = localStorage.getItem("githubCurrentLogin");
    }
	runOnUpdate() {
		this.onUpdate.forEach(func => { func() });
	}
    saveToLocalStorage() {
        localStorage.setItem("githubLogins", JSON.stringify(this.logins));
        localStorage.setItem("githubCurrentLogin", this.current);
        if (this.current in this.logins) {
            localStorage.setItem("githubCurrentLoginJson", JSON.stringify(this.logins[this.current]));
        } else {
            localStorage.removeItem("githubCurrentLoginJson");
        }
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
