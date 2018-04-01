const models = require("../models");
const NodeRSA = require("node-rsa");
const _ = require("lodash");

module.exports = function (app) {
    app.post("/api/account/retreive", (req, res) => {
        let { ethAddress, email, userName } = req.body;
        if ( _.isEmpty(ethAddress) || _.isEmpty(email) || _.isEmpty(userName)) {
            res.status(404)
                .send("Not found");
            return;
        }
        models.keys_registry.find({
            where: {
                email: email
            }
        }).then((model) => {
            let retreiveAccount = (accountAddress) => {
                return models.account.find({
                    where:{
                        owner: accountAddress
                    }
                });
            };
            if (model !== null) {
                retreiveAccount(ethAddress).then((accountModel)=>{
                    if (accountModel == null){
                        models.account.create({
                            email: email,
                            userName: userName,
                            owner: ethAddress,
                            deviceToken: ""
                        });
                    }
                    res.json({ publicKey: model.publicKey, privateKey: model.privateKey });
                });
                return;
            }

            var key = new NodeRSA({ b: 512 });
            key.generateKeyPair();

            let publicKey = key.exportKey("public");
            let privateKey = key.exportKey("private");

            models.keys_registry.create({ email: email, publicKey: publicKey, privateKey: privateKey });


            models.account.create({
                email: email,
                userName: userName,
                owner: ethAddress,
                deviceToken: ""
            });

            res.json({ publicKey: publicKey, privateKey: privateKey });
        });
    });
};
