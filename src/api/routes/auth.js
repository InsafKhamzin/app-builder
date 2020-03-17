const express = require('express');
const router = express.Router();

router.post('/', async (req, res) =>{
    res.send("Auth route");
});


module.exports = router;