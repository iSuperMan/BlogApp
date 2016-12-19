module.exports = (req, res, next) => {

    res.sendHttpError = function(httpError){
        res.status(httpError.status);
        res.json({error: httpError.message, status: httpError.status})
    };

    next();
};