function clearLocalStorage() {
	const githubCurrentLoginJson = JSON.parse(localStorage.getItem("githubCurrentLoginJson"));
	const githubName = localStorage.getItem("github-name");
	const githubEmail = localStorage.getItem("github-email");
	const githubToken = localStorage.getItem("github-token");
	const clubIndex = localStorage.getItem("club-index");
	localStorage.clear();
	if (githubCurrentLoginJson) {
		localStorage.setItem("github-name", githubCurrentLoginJson.name);
		localStorage.setItem("github-email", githubCurrentLoginJson.email);
		localStorage.setItem("github-token", githubCurrentLoginJson.token);
	} else {
		if (githubName) {
			localStorage.setItem("github-name", githubName);
		}
		if (githubEmail) {
			localStorage.setItem("github-email", githubEmail);
		}
		if (githubToken) {
			localStorage.setItem("github-token", githubToken);
		}
	}
	if (clubIndex) {
		localStorage.setItem("club-index", clubIndex);
	} else {
		localStorage.setItem("club-index", "0");
	}
}
clearLocalStorage();