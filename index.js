const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser')

const db = new sqlite3.Database('./db/posts.db');
const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/profile', (req, res) => {
    res.render('pages/profile');
});

app.get('/posts', (req, res) => {
    res.render('pages/posts');
});

app.get('/test', (req, res) => {
    res.render('pages/test');
});

app.get('/api/posts', (req, res) => {
    db.all('SELECT * FROM Posts', (err, post) => {
        res.json(post);
    });
});

app.get('/api/user', (req, res) => {
    db.all('SELECT * FROM User', (err, user) => {
        res.json(user);
    });
});

app.post('/api/user', (req, res) => {
    if (req.body.username && req.body.password) {
        db.run('INSERT INTO User(Username, Password) VALUES(?, ?)', [req.body.username, req.body.password], function (err) {
            if (err) {
                console.log("DB Insert User Error values (" + req.body.username + "," + req.body.password + ")");
            } else {
                console.log("Created user " + req.body.username);
            }
        })
    } else {
        res.json({ error: "Request createUser: body is not correct" });
    }
})

app.post('/api/posts', (req, res) => {
    db.run('INSERT INTO Posts(Username, Message, Timestamp) VALUES(?, ?, ?)', [req.body.username, req.body.message, req.body.dateTime], function (err) {
        if (err) {
            console.log("DB Insert Posts Error values (" +
                req.body.username + "," +
                req.body.message + "," +
                req.body.dateTime + ")");
        } else {
            console.log("Created post");
        }
    });
});

/*
app.deletePost('/api/posts', (req, res) => {
    db.run('DELETE FROM Posts WHERE ID=VALUES(?)', [req.body.id], function (err) {
        if (err) {
            console.log("Couldn't delete Post")
        } else {
            console.log("Post deleted")
        }
    });
});
*/

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}…`)
});

module.exports = server