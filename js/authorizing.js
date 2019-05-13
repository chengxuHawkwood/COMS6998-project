const url = new URL(window.location.href);
code = url.searchParams.get('code');
if (code) {
    // post request to user
    fetch('https://huobgy5p9b.execute-api.us-east-1.amazonaws.com/dev/user', {
        method: 'POST',
        body: JSON.stringify({ username: 'dummy', code: code }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {
            console.log(JSON.stringify(response));
            window.location.href =
                'https://s3.amazonaws.com/project-auditor/index.html'; // dummy homepage
        })
        .catch(err => {
            console.log(err);
        });
}
