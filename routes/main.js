#!/usr/bin/env node
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.redirect('./main/index.html');
});

module.exports = router;