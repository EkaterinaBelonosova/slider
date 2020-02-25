const fetchOptions: RequestInit = {
	headers: new Headers({'X-WEB': 'webapp'}),
	credentials: 'same-origin'
}

export function apiFetch(url: string, payload?: any) {
	let path = url.replace(/\?.*/, '')
	let sendOptions = (!payload) ? fetchOptions : {
		...fetchOptions,
		method: 'POST',
		body: JSON.stringify(payload)
	}

	return new Promise((resolve, reject) => {
		fetch(url, sendOptions)
			.then(response => {
				response.text()
					.then(data => {
						try {
							let rdata = JSON.parse(data).RequestResponse
							if (rdata) {
								let reqResp = ''
								for (var p in rdata) {
									if (p === 'error' && rdata[p].code) {
										return reject(path + ': [' + rdata[p].code + '] ' + rdata[p].message)
									} else if (p.match(/.+Response$/)) {
										reqResp = p
									}
								}
								if (reqResp) {
									return resolve([rdata[reqResp], rdata.perms])
								}
							}
							reject(path + ': [Parse error] ' + data)
						} catch (error) {
							if (response.status !== 200) {
								return reject(path + ': [' + response.status + '] ' + response.statusText)
							} else if (! data) {
								return reject(path + ': [Parse error] Empty answer')
							}
							reject(path + ': [Parse error]' + error.toString())
						}
					})
			})
			.catch((error) => {
				reject(path + ': ' + error.toString())
			})
	})
}