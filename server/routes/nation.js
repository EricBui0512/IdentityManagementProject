const models = require("../models")
module.exports = function(app){
    //API - contract_term    
    app.get('/api/nation/all', function (req, res) {
        models.nation.findAll().then(
        (data) => {
            res.json(data)
        }
        );  
    })       
}