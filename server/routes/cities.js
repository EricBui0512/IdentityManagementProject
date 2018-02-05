const models = require("../models")
module.exports = function(app){
    //API - cities     
    app.get('/api/cities/all', function (req, res) {
        models.cities.findAll().then(
        (data) => {
            res.json(data)
        }
        );  
    })

}