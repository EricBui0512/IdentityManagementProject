const models = require("../models")

module.exports = function (app) {
    //API - BIKE_DAO
    app.get('/api/bike_dao/list/:countryCode', function (req, res) {
        models.bike_dao.findAll({
            where: {
                country_code: req.params.countryCode
            }
        }).then(
            (data) => {
                res.json(data)
            }
            );
    })

    app.post('/api/bike_dao/create', function (req, res) {
        models.bike_dao.max('id').then((maxId)=>{
            var nextId = maxId + 1;
            let bikeModel = req.body;
            bikeModel.id = nextId;
            bikeModel.first_address = 'N/A';
            bikeModel.first_postalcode = 'N/A'
            bikeModel.dao_code = 'N/A';
            bikeModel.is_completed = 0;
            bikeModel.created_date = Date();
            models.bike_dao.create(bikeModel).then(
                (data) => {
                    res.json(data)
                }
            );
        });
       
    })

    app.get('/api/bike_dao/:bikeId', function (req, res) {
        models.bike_dao.find({where:{id:req.params.bikeId}}).then((bike)=>{
            res.json(bike)
        });
       
    })
}