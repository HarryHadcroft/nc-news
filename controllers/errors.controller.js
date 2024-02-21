function handleInvalidEnpoint(req, res, next) {
    res.status(404).send({msg: "Cannot find path"})
    next()
}

function handlePSQLErrors(err, req, res, next) {
    if(err.code === "22P02"){
        res.status(404).send({msg: "not found"})
    }

    if(err.code === "23503"){
        res.status(404).send({msg: "not found"})
    }

    if(err.code === "23502"){
        res.status(400).send({msg: "bad request"})
    }
    next(err)
}

function handleCustomerErrors(err, req, res, next) {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
}

module.exports = {handleInvalidEnpoint, handlePSQLErrors, handleCustomerErrors}