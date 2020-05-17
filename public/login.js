$(document).ready((() => {

    const btnLogin = $('#btn-login');
    const btnSignUp = $('#btn-sign-up');
    const tfdUsername = $('#tfd-username');
    const tfdPassword = $('#tfd-password');
    const forgot = $('#forgotButton');


    btnLogin.on('click', async function (event) {
        event.preventDefault();
        login(tfdUsername.val(), tfdPassword.val());
    });

    btnSignUp.on('click', (event) => {
        event.preventDefault();
        var username = tfdUsername.val();
        var password = tfdPassword.val();
        saveUser(username, password);
    });

    forgot.on('click', (event) => {
        event.preventDefault();
        toggleForgotBox(true);
    })
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

async function login(username, password) {
    const tfdUsername = $('#tfd-username');
    const tfdPassword = $('#tfd-password');

    const response = await fetch('/api/user', {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        }
    });

    var authenticated = false;
    const json = await response.json();
    json.forEach(element => {
        if (element.Username == username) {
            if (element.Password == password) {
                authenticated = true;
            }
        }
    });

    if (authenticated) {
        toggleAlertBox(false);
        document.cookie = `username=${username};`
        window.location.replace("/profile");
    } else {
        toggleAlertBox(true);
        tfdUsername.val('');
        tfdPassword.val('');
    }
}

async function toggleAlertBox(show) {
    const alertEl = $('#login-alert')

    if (show) {
        alertEl.removeClass('d-none')
    } else {
        alertEl.addClass('d-none')
    }
}

async function toggleForgotBox(show) {
    const alertEl = $('#forgot-alert')
    
    if (show) {
        alertEl.removeClass('d-none')
    } else {
        alertEl.addClass('d-none')
    }
}