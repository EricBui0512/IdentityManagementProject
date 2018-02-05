const models = require("../models")
module.exports = function(app){
    //API - contract_term   
    app.get('/api/contract_terms/list', function (req, res) {
        models.contract_terms.findAll().then(
        (data) => {
            res.json(data)
        }
        );  
    })   
}