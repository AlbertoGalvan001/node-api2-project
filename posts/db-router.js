const express = require('express');

const router = express.Router();

const db = require('./db.js');

router.use(express.json());

// initial GET Request
router.get("/", (req, res) => {
    db.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: "error getting posts" });
        });
});

// Post request to /api/posts
router.post("/", (req, res) => {
    const usersData = req.body;
    if (!usersData.title || !usersData.contents) {
        res
            .status(400)
            .json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        db.insert(usersData)
            .then(users => {
                res.status(201).json(users);
            })
            .catch(error => {
                console.log("error on POST /users", error);
                res.status(500).json({ error: "error adding info to database" })
            });
    }
});
// POST request to /api/posts/:id/comments

router.post("/:id/comments", (req, res) => {
    const { text } = req.body;
    if (text) {
        db.findById(req.params.id)
            .then(comment => {
                if (comment.length) {
                    db.insertComment({ text: text, post_id: req.params.id })
                        .then(() => {
                            res.status(201).json({ message: req.body })
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).json({ message: "error adding comment" })
                        })
                }
                else {
                    res.status(404)
                        .json({ message: "The post with the specified ID doesn not exist" })
                }

            })
    }
});

module.exports = router;  //export the server