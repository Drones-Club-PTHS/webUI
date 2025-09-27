function toBase64(text){
	return btoa(unescape(encodeURIComponent(text)));
}

function fromBase64(text){
	return decodeURIComponent(escape(atob(text)));
}

function getFile(token, filePath) {
	return fetch(
		filePath,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/vnd.github.object',
				'Authorization': `Bearer ${token}`,
				'X-GitHub-Api-Version': '2022-11-28'
			}
		}
	).then(res => res.json())
	.then(res => {res.content = fromBase64(res.content); return res;});
}

function commitFile(token, name, email, filePath, data, commitMessage, sha=undefined) {
	const body = {
		message: commitMessage,
		committer: {name: name, email: email},
		content: toBase64(data)
	}
	if (sha) {
		body["sha"] = sha;
	}
	return fetch(
		filePath,
		{
			method: 'PUT',
			headers: {
				'Accept': 'application/vnd.github+json',
				'Authorization': `Bearer ${token}`,
				'X-GitHub-Api-Version': '2022-11-28',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}
	).then(res => res.json());
}

export {getFile, commitFile}
