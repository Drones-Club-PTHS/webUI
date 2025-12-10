function toBase64(text){
	return btoa(unescape(encodeURIComponent(text)));
}

function fromBase64(text){
	return decodeURIComponent(escape(atob(text)));
}

export function fetchFile(token, url) {
	return fetch(
		url,
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

export function getJsonFile(token, url) {
	return fetchFile(token, url).then(res => JSON.parse(res.content));
}

function commitFile(token, name, email, url, data, commitMessage, sha=undefined) {
	const body = {
		message: commitMessage,
		committer: {name: name, email: email},
		content: toBase64(data)
	}
	if (sha) {
		body["sha"] = sha;
	}
	return fetch(
		url,
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

export async function updateJsonFile(dataUpdates, url, token, name, email) {
	const file = await fetchFile(token, url);
	const newJson = JSON.parse(file.content);
	for (const upd of dataUpdates) {
		upd(newJson);
	}
	await commitFile(token, name, email, url, JSON.stringify(newJson, null, 2), "update file", file.sha);
	return newJson;
}