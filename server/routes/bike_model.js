const models = require("../models");
const fs = require("fs");
var uuid = require('node-uuid');
var bodyParser = require('body-parser');

module.exports = function(app){
    //API - BIKE_DAO
    app.get('/api/bike_model/list/:countryCode', function (req, res) {
        models.bike_model.findAll({
            where: {
                country_code: req.params.countryCode
            }
        }).then(
        (data) => {
            res.json(data)
        }
        );  
    });

    app.get('/api/bike_model/:bikeId', function (req, res) {
        models.bike_model.find({where:{id:req.params.bikeId}}).then((bike)=>{
            res.json(bike)
        });
       
    });

    app.post('/api/bike_model/create', function (req, res) {
        models.bike_model.max('id').then((maxId)=> {
            var nextId = maxId + 1;
            let bikeModel = req.body;
            console.log(bikeModel);

            bikeModel.id = nextId;
            bikeModel.country_code = 'SG';
            bikeModel.model_code = 'N/A';
            bikeModel.model_name = bikeModel.model;
            bikeModel.discipline = bikeModel.discipline;
            bikeModel.weight = bikeModel.weight;
            bikeModel.colour = bikeModel.colour;
            bikeModel.material = bikeModel.material;

            bikeModel.created_time = Date();
            bikeModel.updated_time = Date();


            bikeModel.picture_link = decodeBase64ImageAndSave(bikeModel.pictureLink);

            if (bikeModel.picture_link !== false) {
                models.bike_model.create(bikeModel).then(
                    (data) => {
                        res.json(data);
                    }
                );
            }
        });
    });

    //API - BIKE_DAO
    app.get('/api/bike_model/list_yours_bikes/:owner_id', function (req, res) {
        models.bike_model.findAll({
            where: {
                owner_id: req.params.owner_id
            }
        }).then(
            (data) => {
                res.json(data)
            }
        );
    });

     const decodeBase64ImageAndSave = (dataString) => {
        if (typeof (dataString) === undefined)
            return '';
         console.log(dataString);

         var base64Data = dataString.replace(/^data:image\/png;base64,/, "");

        const fileOutPut = '/images/bike_models/'+uuid.v4()+'.png';
        fs.writeFileSync(require('path').join(__dirname,'../upload/',fileOutPut), base64Data, 'base64', function (err) {
            if (err) throw err;
            return false;
        });

        return fileOutPut;
    }
}