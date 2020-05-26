$(document).ready((() => {

    getData();

    const submitNewPost = $('#form-new-post');
    const tfdPostMessage = $('#form-post-message');
    const btnSearch = $('#form-search-profile');
    const tfdSearch = $('#form-search-text');

    btnSearch.removeClass('d-none');
    tfdSearch.removeClass('d-none');

    submitNewPost.on('submit', async function (event) {
        event.preventDefault();
        savePost(tfdPostMessage.val());
        tfdPostMessage.val('');
        getData();
    });

    btnSearch.on('click', (event) => {
        event.preventDefault();
        let searchValue = tfdSearch.val();
        setCookie("profile", searchValue);
        window.location.replace("/profile");
    })
}));

function myProfile() {
    console.log("func myProfile now profile page" + getCookie("profile"))
    setCookie("profile", getCookie("loggedInUsername"));
    getData();
}

async function getData() {
    const tableBody = $('#container-posts');
    const allPostsTableBody =  $('#container-all-posts');
    allPostsTableBody.empty();
    tableBody.empty();
    const response = await fetch('/api/posts', {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const newPostForm = $('#form-new-post');

    if (isOwnProfile()) {
        newPostForm.removeClass("d-none");
    } else {
        newPostForm.addClass("d-none");
    }

    const json = await response.json();
    json.forEach(element => {
        if (element.Username == getCookie("profile")) {
            tableBody.prepend(`
                    <div class="row justify-content-center">
                    <div class="col-1">
                    </div>
                    <div class="col-10">
                        <div class="profile-entry">
                            <table>
                                <tr>
                                    <td>
                                        <p><b>${element.Username}:<b></p>
                                    </td>
                                    <td class="table-data-right">
                                        <p>${element.Timestamp}</p>

                                    </td>
                                    <td class="table-data-right">
                                        <p><button class="deleteButton" name="deleteButton" id="${element.ID}" onclick="delPost(this.id)">X</button></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <p>${element.Message}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="table-comment">
                                        <p>
                                            <button class="textBtn" name="${element.ID}" onclick="saveComment(this.name)" type="submit">Kommentieren</button>
                                        </p>

                                    </td>
                                    <td>
                                        <form method="post" action="/profile">
                                            <textarea name="CommentTextField" id="form_new_comment_${element.ID}" class="form-control" id="form-textarea" placeholder="Kommentar..."></textarea>
                                        </form>
                                    </td>
                                </tr>

                            </table>
                        </div>
                    </div>
                    <div class="col-1">
                    </div>
                </div> 
            `);
        }
    });
}

function isOwnProfile() {
    return getCookie("profile") === getCookie("loggedInUsername");
}

async function delPost(id) {
    var delId = id;
    console.log(id);

    await fetch('/api/delete', {
        method: "delete",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            delId
        }),
    }).then(getData());

}

async function comment() {
    //not working like planned yet

    const btn = $('#commentBtn');
    const comment = $('#commentField');
    comment.removeClass('d-none');
}

async function savePost(message) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    var username = getCookie("loggedInUsername");
    console.log(getCookie("loggedInUsername"));
    try {
        await fetch('/api/posts', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                message,
                dateTime,
            }),
        });
    } catch (err) {
        console.error(err);
    }
}

async function saveComment(id) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    var username = getCookie("username");
    var referenceID = id;
    var messageField = "form_new_comment_" + id;
    var messageFieldName = $("messageField")
    console.log(messageField + " " + messageFieldName.val())
    var message = messageFieldName.val();

    await fetch('/api/comments', {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            message,
            dateTime,
            referenceID
        }),
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cookie, value) {
    document.cookie = cookie + "=" + value;
}