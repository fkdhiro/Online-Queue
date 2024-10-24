const express = require('express')
const router = express.Router()
const db = require("../services/db")
const { ObjectId } = require('mongodb')

const checkBody = (req, res, next) => {
    if ("_id" in req.body) {
        const id = req.body._id;
        if (typeof id === 'number') {
            req.body._id = new ObjectId(id.toString(16).padStart(24, '0'));
        } else if (typeof id === 'string' && id.length === 24) {
            req.body._id = new ObjectId(id);
        } else {
            return res.status(400).send({ error: "Invalid _id format" });
        }
    }
    next();
}

router.get("/list", async (req, res) => { //retorna os itens da base
    const results = await db.findDocuments()
    res.send(results)
});

router.post("/add", async (req, res) => { //adição na base
    const results = await db.insertDocuments(req.body)
    res.send(results)
});

router.patch("/update", checkBody, async (req, res) => { //dar um update na base
    const results = await db.updateDocument(req.body)
    res.send(results)
});
router.patch("/updatefila", checkBody, async (req, res) => {
    const results = await db.updateFila(req.body)
    res.send(results)
});
router.patch("/voltar", checkBody, async (req, res) => { 
    const results = await db.updateVoltar(req.body)
    res.send(results)
});

router.delete("/delete", checkBody, async (req, res) => {
    const results = await db.removeDocument(req.body)
    res.send(results)
});

router.patch("/chamar", checkBody, async (req, res) => {
    const results = await db.chamarFila(req.body)
    res.send(results)
});

module.exports = router