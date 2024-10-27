/*
var express = require("express");
var router = express.Router();
const { composerService } = require("../model");

router.get("/", async function (req, res, next) {
  try {
    const composers = await composerService.getAllComposers();
    res.json(composers);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//node -e "http.get('http://localhost:3000/api/composers', (res) =>res.setEncoding('utf8').once('data', console.log))"    
router.get("/api/composers", async function (req, res, next) {
  try {
    const composers = await composerService.getAllComposers();
    res.json(composers);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//  node -e "http.get('http://localhost:3000/api/composers/1', (res) =>res.setEncoding('utf8').once('data', console.log))"
router.get("/api/composers/:id", async function (req, res, next) {
  try {
    const composer = await composerService.getComposerById(req.params.id);
    res.json(composer);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
*/

var express = require("express");
var router = express.Router();
const { composerService } = require("../model");
const createError = require("http-errors");
router.get("/", async function (req, res, next) {
  try {
    const composers = await composerService.getAllComposers();
    res.json(composers);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
router.get("/:id", async function (req, res, next) {
  try {
    const composer = await composerService.getComposerById(req.params.id);
    res.json(composer);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
router.put("/:id", async function (req, res, next) {
  try {
    const id = await composerService.modifyComposer(req.params.id, req.body);
    res.json({ id });
  } catch (err) {
    console.error(err);
    if (err.message === "Composer not found in the database") {
      return next(createError(404, err.message));
    }
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const composer = {
      firstName: req.body.data.firstName,
      lastName: req.body.data.lastName,
      genre: req.body.data.genre,
    };
    const id = await composerService.addComposer(req.body.id, composer);
    res.json({ id: id });
  } catch (err) {
    console.error(err);
    if (err.message === "Composer with this ID already exists") {
      return next(createError(409, err.message));
    }
    next(err);
  }
});

//"http.request('http://localhost:3000/1', { method:'delete', headers:{'content-type': 'application/json'}}, (res) => console.log(res.statusCode)).end()"
router.delete("/:id", async function (req, res, next) {
  try {
    const id = await composerService.deleteComposer(req.params.id);
    res.json({ id });
  } catch (err) {
    console.error(err);
    if (err.message === "Composer not found in the database") {
      return next(createError(404, err.message));
    }
    next(err);
  }
});

module.exports = router;
