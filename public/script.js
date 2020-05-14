$( document ).ready((() => {

    getData();

    const submitNewPost = $('#form-new-post');
    const tfdPostMessage = $('#form-post-message');

    submitNewPost.on('submit', (event) => {
        event.preventDefault();
        savePost(tfdPostMessage.val());
        tfdPostMessage.val('');
        getData();
    });
}));

async function getData() {
    const tableBody = $('#container-posts');
    tableBody.empty();
    const response = await fetch('/api/posts', {
        method: "get",
        headers: {
        "Content-Type": "application/json",
        },
    });

    const json = await response.json();
    json.forEach(element => {
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
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <p>${element.Message}</p>
                                </td>
                            </tr>
                            <tr>
                                <!-- TODO: add comment function -->
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="col-1">
                </div>
            </div> 
        `);
    });
}

async function savePost(message) {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    // TODO: need to use current username instead of static name
    var username = "TestUser";

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

}