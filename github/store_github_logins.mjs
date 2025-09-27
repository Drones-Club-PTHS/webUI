class GithubLogin {
    constructor(obj) {
        this.name = obj.name || "DefaultName";
        this.email = obj.email || "default@email.com";
        this.token = obj.token || "";
        this.studentsFileUrl = obj.studentsFileUrl || "";
        this.tasksFileUrl = obj.tasksFileUrl || "";
    }
    update(obj) {
        for (const key in obj) {
            if (this.hasOwnProperty(key)) {
                this[key] = obj[key];
            }
        }
        return this;
    }
    getUrl(filename) {
        switch (filename) {
            case "students.json":
                return this.studentsFileUrl;
            case "tasks.json":
                return this.tasksFileUrl;
        }
    }
}

function parseLoginsFromJson(jsonString) {
    data = JSON.parse(jsonString);
    Object.keys(data).forEach(key => {
        data[key] = new GithubLogin(data[key]);
    });
    return data;
}

class GithubLogins {
    constructor() {
        if (localStorage.getItem("githubLogins")) {
            this.logins = parseLoginsFromJson(localStorage.getItem("githubLogins"));
        } else {
            this.logins = {}
        }
        if (localStorage.getItem("githubCurrentLogin")) {
            this.setCurrentLogin(localStorage.getItem("githubCurrentLogin"));
        } else {
            this.current = undefined;
        }
    }
    #saveGithubLoginsToLocalStorage() {
        localStorage.setItem("githubLogins", JSON.stringify(this.logins));
    }
    #saveGithubCurrentLoginToLocalStorage() {
        localStorage.setItem("githubCurrentLogin", this.current);
    }
    addLogin(name, obj) {
        if (name in this.logins) {
            console.error(`Login "${name}" already exist.`);
            return;
        }
        this.logins[name] = new GithubLogin(obj);
        this.#saveGithubLoginsToLocalStorage();
        return this.logins[name];
    }
    updateLogin(name, obj) {
        if (!(name in this.logins)) {
            console.error(`No login "${name}".`);
            return;
        }
        this.logins[name].update(obj);
        this.#saveGithubLoginsToLocalStorage();
        return this.logins[name];
    }
    getCurrentLogin() {
        return this.logins[this.current];
    }
    setCurrentLogin(name) {
        if (!(name in this.logins)) {
            console.error(`No login "${name}".`);
            return;
        }
        this.current = name;
        window.currentGithubLogin = this.getCurrentLogin();
        this.#saveGithubCurrentLoginToLocalStorage();
        return this.current;
    }
    help() {
        console.warn(`window.githubLogin -- objtct to store logins
    .addLogin(name, obj)
    .updateLogin(name, obj)
    .setCurrentLogin(name)
    .logins -- key-value object with logins
    .curent -- current login name
    .help() -- print help
    `);
    }
}

window.githubLogins = new GithubLogins();
