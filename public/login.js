$(document).ready((() => {

    const btnLogin = $('#btn-login');
    const btnSignUp = $('#btn-sign-up');
    const tfdUsername = $('#tfd-username');
    const tfdPassword = $('#tfd-password');
    const forgot = $('#forgotButton');

    const btnSearch = $('#form-search-profile');
    const tfdSearch = $('#form-search-text');

    btnSearch.addClass('d-none');
    tfdSearch.addClass('d-none');

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
        toggleBox(true, 1);
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

function myProfile() {
    setCookie("profile", getCookie("loggedInUsername"));
    getData();
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
        toggleBox(false, 0);
        setCookie("loggedInUsername", username);
        setCookie("profile", username)
        window.location.replace("/profile");
    } else {
        toggleBox(true, 0);
        tfdUsername.val('');
        tfdPassword.val('');
    }
}

async function toggleBox(show, x) {
    // x==0 for login-alert; x==1 for forgot-alert

    const alertEl = $('#login-alert');
    const alertF = $('#forgot-alert');

    alertEl.addClass('d-none');
    alertF.addClass('d-none');

    if (x == 0) {
        if (show) {
            alertEl.removeClass('d-none');
        } else {
            alertEl.addClass('d-none');
        }
    } else if (x == 1) {
        if (show) {
            alertF.removeClass('d-none');
        } else {
            alertF.addClass('d-none');
        }
    }

}

function setCookie(cookie, value) {
    document.cookie = cookie + "=" + value;
}