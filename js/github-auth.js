const loadButton = () => {
    const loginButton = document.getElementById('github-login')
    loginButton.addEventListener('click', () => {
        const loginUrl = new URL('https://github.com/login/oauth/authorize');
        loginUrl.searchParams.set('client_id', 'c3e19ce6d629ea34b11e');
        window.location.href = loginUrl;
    });
};

loadButton();
