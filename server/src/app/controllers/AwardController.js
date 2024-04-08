class AwardController {
    // [GET] /award/respond
    respond(req, res, next) {
        res.render('respond');
    }

    // [GET] /award
    submission(req, res, next) {
        res.render('award');
    }
}

module.exports = new AwardController();
