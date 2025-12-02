const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const secretKey = 'LetokenultrasecretAnepasreveler8';

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'quizzfoot'
});

db.connect();

app.post('/api/connect', (req, res) => {
    const pseudo = req.body.Username;
    const mdp = req.body.Password;

    db.query('SELECT * FROM users WHERE Username = ?', [pseudo], (err, result) => {
        if (err) return res.send({ error: "Erreur" });
        
        if (result.length > 0) {
            const user = result[0];
            if (bcrypt.compareSync(mdp, user.password || user.Password)) {
                const token = jwt.sign({ username: user.Username }, secretKey);
                
                res.send({ 
                    success: true, 
                    token: token, 
                    user: { 
                        Username: user.Username, 
                        role: user.role,
                        score: user.score
                    } 
                });
            } else {
                res.send({ success: false });
            }
        } else {
            res.send({ success: false });
        }
    });
});

app.post('/api/Create', (req, res) => {
    const pseudo = req.body.Username;
    const mdp = req.body.Password;
    const mdpCrypte = bcrypt.hashSync(mdp, 10);

    db.query('INSERT INTO users (Username, Password, score) VALUES (?, ?, 0)', [pseudo, mdpCrypte], (err) => {
        if (err) res.send({ error: "Erreur" });
        else res.send({ success: true });
    });
});

app.get('/api/quizzes', (req, res) => {
    db.query('SELECT * FROM quizzes', (err, result) => {
        res.send(result);
    });
});

app.post('/api/quizzes', (req, res) => {
    if (req.body.role === 'admin') {
        db.query('INSERT INTO quizzes (question, answer) VALUES (?, ?)', [req.body.question, req.body.answer], () => {
            res.send({ message: "Ajouté" });
        });
    } else {
        res.send({ error: "Non autorisé" });
    }
});

app.delete('/api/quizzes/:id', (req, res) => {
    db.query('DELETE FROM quizzes WHERE id = ?', [req.params.id], () => {
        res.send({ message: "Supprimé" });
    });
});

app.put('/api/score', (req, res) => {
    const user = req.body.username;
    const points = req.body.score;
    const sql = 'UPDATE users SET score = ? WHERE username = ? AND score < ?';
    
    db.query(sql, [points, user, points], (err, result) => {
        res.send({ success: true });
    });
});

app.get('/api/ranking', (req, res) => {
    db.query('SELECT username, score FROM users ORDER BY score DESC LIMIT 10', (err, result) => {
        res.send(result);
    });
});

app.listen(port, () => {
    console.log('Serveur lancé');
});