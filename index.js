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
                res.json({error: err});
            } else {
                console.log("Created user " + req.body.username);
                res.json({
                    ...req.body,
                    id: this.lastID,
                });
            }
        })
    } else {
        res.json({ error: "Request createUser: body is not correct" });
    }
})

app.post('/api/posts', (req, res) => {
    if (req.body.username && req.body.message && req.body.dateTime) {
        db.run('INSERT INTO Posts(Username, Message, Timestamp) VALUES(?, ?, ?)', [req.body.username, req.body.message, req.body.dateTime], function (err) {
            if (err) {
                console.log("DB Insert Posts Error values (" +
                    req.body.username + "," +
                    req.body.message + "," +
                    req.body.dateTime + ")");
                    res.json({error: err});
            } else {
                console.log("Created post");
                res.json({
                    ...req.body,
                    id: this.lastID,
                });
            }
        });
    }
});

app.delete('/api/delete', (req, res) => {
    db.run('DELETE FROM Posts WHERE ID=\'' + req.body.delId + '\'', function (err) {
        if (err) {
            console.log("Couldn't delete Post");
            res.json({error: err});
        } else {
            console.log("Post deleted with id " + + req.body.delId);
            
            res.json({
                ...req.body,
                id: this.lastID,
            });
        }
    });
});


const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}…`)
});

module.exports = server