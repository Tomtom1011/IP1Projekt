$( document ).ready((() => {

    const btnLogin = $('#btn-login');
    const btnSignUp = $('#btn-sign-up');
    const tfdUsername = $('#tfd-username');
    const tfdPassword = $('#tfd-password');

    btnLogin.on('click', (event) => {
        event.preventDefault();
        
        /*
            Login user, send to profiles page with username in data
        */
    });

    btnSignUp.on('click', (event) => {
        event.preventDefault();
        var username = tfdUsername.val();
        var password = tfdPassword.val();
        saveUser(username, password);
    });
}));

async function saveUser(username, password) {
    await fetch('/api/user', {
        method: "post",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });
}