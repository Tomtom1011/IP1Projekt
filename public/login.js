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

    const response = await fetch('/api/user', {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        }
    });

    var alreadyExist = false;

    const json = await response.json();
    json.forEach(element => {
        if (element.Username == username) {
            alreadyExist = true;
        }
    });

    if (alreadyExist) {
        toggleBox(true, 2);
    } else {
        toggleBox(false, 2);
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
        setCookie("loggedInUsername", username);
        setCookie("profile", username)
        window.location.replace("/posts");
    }

    
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
        window.location.replace("/posts");
    } else {
        toggleBox(true, 0);
        tfdUsername.val('');
        tfdPassword.val('');
    }
}

async function toggleBox(show, x) {
    // x==0 for login-alert; x==1 for forgot-alert; x==2 for user-exist-alter;

    const alertEl = $('#login-alert');
    const alertF = $('#forgot-alert');
    const alertUE = $('#user-exist-alert');
    

    alertEl.addClass('d-none');
    alertF.addClass('d-none');
    alertUE.addClass('d-none');

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
    } else if (x == 2) {
        if (show) {
            alertUE.removeClass('d-none');
        } else {
            alertUE.addClass('d-none');
        }
    }

}

function setCookie(cookie, value) {
    document.cookie = cookie + "=" + value;
}