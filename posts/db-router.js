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

// GET /api/posts/:id 
router.get('/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(404)
            .json({ error: "The post with the specified ID does not exist." })
    } else {
        db.findById(id)
            .then(post => {
                res.status(200)
                    .json(post);
            })
            .catch(error => {
                res.status(500)
                    .json({ error: "The post information could not be retrieved." })
            })
    }
})

//GET request  /api/posts/:id/comments

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    db.findById(id)
        .then(post => {
            if (post.length) {
                db.findPostComments(id)
                    .then(comments => {
                        res.status(200).json(comments);
                    })
            } else {
                res.status(404).json({ error: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            res.status(500).json({ error: "Comments could not be retrieved." })
        })
})

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
    const { id } = req.params;
    const comment = req.body;
    db.findById(id)
        .then(post => {
            if (post.length) {
                db.insertComment(comment)
                    .then(comment => {
                        res.status(200).json(comment);
                    })
            } else {
                res.status(404).json({ error: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            res.status(500).json({ error: "Comments could not be retrieved." })
        })

});

//DELETE  request for /api/posts/:id
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(404).json({ error: "The post with the specified ID does not exist." })
    }
    db.remove(id)
        .then(removed => {
            res.status(200).json(removed)
        })
        .catch(error => {
            res.status(500).json({ error: "The post could not be removed." })
        })
})

///PUT request /api/posts/:id
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const post = req.body;
    if (!id) {
        res.status(404).json({ error: "The post with the specified ID does not exist." })
    } else if (!post.title || !post.contents) {
        res.status(400).json({ error: "Please provide a title and contents for the post." })
    } else {
        db.update(id, post)
            .then(post => {
                res.status(200).json(post);
            })
            .catch(error => {
                res.status(500).json({ error: "The post information could not be modified" })
            })
    }
})

module.exports = router;  //export the server