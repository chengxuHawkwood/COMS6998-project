const authorize = () => {
    const loginUrl = new URL('https://github.com/login/oauth/authorize');
    loginUrl.searchParams.set('client_id', 'c3e19ce6d629ea34b11e');
    window.location.href = loginUrl;
};

const show = items => {
    for (let item of items) {
        item.style.display = 'initial';
    }
};

const hide = items => {
    for (let item of items) {
        item.style.display = 'none';
    }
};

const displayAuthorized = user => {
    show(document.getElementsByClassName('authorized'));
    document.getElementById('email_value').textContent = user.username;
};

const displayUnauthorized = () => {
    show(document.getElementsByClassName('unauthorized'));
};

const displayAuthorizing = (apigClient, username, code) => {
    const body = {
        username: username,
        code: code
    };
    apigClient.userPost({}, body, {}).then(() => {
        window.location = 'profile.html';
    });
};

const displayControl = userList => {
    hide(document.getElementsByClassName('loading'));
    if (userList.length > 0) {
        // display user data since the user has already authorized github
        const user = userList[0];
        displayAuthorized(user);
    } else {
        // only display the button for github authorization
        displayUnauthorized();
    }
};

// render the page content
const display = (cognitoUser, apigClient) => {
    // the code paramter will be present if it is redirected from github authorization page
    getUsername(cognitoUser)
        .then(username => {
            // check if the user has authorized github
            const code = new URL(window.location.href).searchParams.get('code');
            if (code) {
                return displayAuthorizing(apigClient, username, code);
            }
            return Promise.resolve(username);
        })
        .then(username => {
            return fetchUserList(apigClient, username);
        })
        .then(userList => {
            // control the contents displayed to user
            displayControl(userList);
        });
};
