module.exports = function(app){
    require('./bike_dao')(app);
    require('./contract_terms')(app);
    require('./cities')(app);
    require('./bike_model')(app);
    require('./nation')(app);
}
