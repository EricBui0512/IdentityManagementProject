const models = require("../models");
const crypto = require("crypto");
const NodeRSA = require("node-rsa");
const sgMail = require("@sendgrid/mail");
const cryptoHelper = require("../utils/cryptoHelper");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const config = require("../configs/app.json");

const ACTIVITY_TYPE_AUTHORIZATION = 0;
const ACTIVITY_TYPE_VERIFICATION = 1;
const STATUS_SHARED = 1;

const VERIFICATION_PENDING    =   1;

const SECRET = config.APP_SECRET_KEY;
const API_HOST_URL = config.API_HOST_URL;
sgMail.setApiKey(config.MAIL_API_KEY);

module.exports = function (app) {
    //=========BEGIN - CRUD - Facet===========//
    app.post("/api/facet/add", (req, res) => {
        let { title, owner, facetAddress } = req.body;
        if (typeof facetAddress == undefined) {
            res.status(404)
                .send("Not found");
        }

        //create facet Key
        const hash = crypto.createHmac("sha256", SECRET)
            .update(title+owner)
            .digest("hex");

        let newFacet = {
            title: title,
            owner: owner,
            facetAddress: facetAddress,
            facetKey: hash
        };

        models.facet.find({
            where: {
                facetAddress: facetAddress,
                owner: owner,
                title:title,
            }
        }).then((model) => {
            if (model != null) {
                res.json(model);
                return;
            }
            models.facet.create(newFacet).then((data) => {
                res.json(data);
            });
        });
    });

    app.post("/api/facet/delete", (req, res) => {
        let { facetAddress } = req.body;
        if (typeof facetAddress == undefined) {
            res.status(404)
                .send("Not found");
            return;
        }

        models.facet.find({
            where: {
                facetAddress:facetAddress
            }
        }).then((model)=>{
            model.destroy();
            res.json({deleted: true});
        });
    });

    app.post("/api/facet/update", (req, res) => {
        let { facetAddress, newFacetAddress } = req.body;
        if (typeof facetAddress == undefined || typeof newFacetAddress == undefined) {
            res.status(404)
                .send("Not found");
            return;
        }

        models.facet.find({
            where: {
                facetAddress: facetAddress,
            }
        }).then((model) => {
            if (model == null){
                res.status(404)
                    .send("Not found");
                return;
            }
            models.facet.create({
                facetAddress: newFacetAddress,
                title: model.title,
                owner: model.owner,
                facetKey: model.facetKey
            }).then((data)=>{
                res.json(data);
            });
            model.destroy();
        });
    });

    app.post("/api/facet/retrieve", (req, res) => {
        let { title, owner, facetAddress } = req.body;
        if (typeof owner == undefined) {
            res.status(404)
                .send("Not found");
        }

        models.facet.find({
            where: {
                title: title,
                owner: owner,
                facetAddress:facetAddress
            }
        }).then((model) => {
            res.json(model);
        });
    });
    app.post("/api/facet/load", (req,res) => {
        let { facetAddress } = req.body;

        if ( _.isEmpty(facetAddress) ) {
            res.status(404)
                .send("Not found");
            return;
        }

        models.facet.find({
            where: {
                facetAddress: facetAddress
            }
        }).then( (facetModel) => {
            if (facetModel == null){
                res.status(404)
                    .send("Not found");
                return;
            }

            models.facet_field.findAll({
                where: {
                    facetAddress: facetAddress
                }
            }).then((fields)=> {
                var revisedFields = [];
                var updatedFields = [];
                var deletedFields = [];
                _.forEach(fields,(field)=> {
                    if (field.status != 2) {
                        revisedFields.push({
                            name: field.fieldName,
                            type: field.fieldValue.includes("Tx:") ? "FACET.FACET_FIELD_PLAIN_TEXT":"FACET.FACET_FIELD_LINK",
                            value: field.fieldValue
                        });
                    }

                    if (field.status == null) {
                        updatedFields.push({
                            name: field.fieldName,
                            type: field.fieldValue.includes("Tx:") ? "FACET.FACET_FIELD_PLAIN_TEXT":"FACET.FACET_FIELD_LINK",
                            value: field.fieldValue,
                            pending:true
                        });
                    }
                    if (field.status == 2) {
                        deletedFields.push( field.fieldName );
                    }

                });
                models.facet_activity.findAll({
                    where: {
                        facetAddress: facetAddress,
                        type: ACTIVITY_TYPE_AUTHORIZATION
                    }
                }).then((authors) => {
                    models.facet_activity.findAll({
                        where: {
                            facetAddress: facetAddress,
                            type: ACTIVITY_TYPE_VERIFICATION
                        }
                    }).then((verifies) => {

                        res.json({
                            title: facetModel.title,
                            fields: revisedFields,
                            facetAddress: facetAddress,
                            facetKey: facetModel.facetKey,
                            activity: {
                                authorization: authors,
                                verification: verifies
                            },
                            changes: {
                                updated: updatedFields,
                                deleted: deletedFields
                            }
                        });

                    });
                });
            });
        });
    });

    app.post("/api/facet/shared_accounts", (req,res) => {
        let { account } = req.body;
        models.sequelize.query("SELECT facet.*,account.userName as `name`,account.email FROM facet_activity  LEFT JOIN facet ON facet.facetAddress = facet_activity.facetAddress LEFT JOIN account ON account.owner = facet.owner  WHERE status = :status AND type=:type AND account=:account AND facet.owner !=:account group by facet.facetAddress",
            { replacements: {
                account: account,
                type: ACTIVITY_TYPE_AUTHORIZATION,
                status: STATUS_SHARED
            }, type: models.sequelize.QueryTypes.SELECT }
        ).then(facets => {
            res.json(facets);
        });
    });

    app.post("/api/facet/verification", (req,res) => {
        let { account } = req.body;
        models.sequelize.query("SELECT facet.* FROM facet_activity LEFT JOIN facet ON facet.facetAddress = facet_activity.facetAddress  WHERE status = :status AND type=:type AND account=:account ",
            { replacements: {
                account: account,
                type: ACTIVITY_TYPE_VERIFICATION,
                status: VERIFICATION_PENDING
            }, type: models.sequelize.QueryTypes.SELECT }
        ).then(facets => {
            res.json(facets);
        });
    });

    //=========END - CRUD - Facet===========//

    //=========BEGIN - Facet Field===========//
    app.post("/api/facet/field/add", (req, res) => {
        let { facetAddress, fieldName, fieldValueHash, fieldValue } = req.body;
        if ( _.isEmpty(facetAddress) || _.isEmpty(fieldName) || _.isEmpty(fieldValueHash) || _.isEmpty(fieldValue) ) {
            res.status(404)
                .send("Not found");
            return;
        }
        let newField = {
            facetAddress: facetAddress,
            fieldName: fieldName,
            fieldValueHash: fieldValueHash,
            fieldValue: fieldValue
        };
        models.facet_field.create(newField).then((model) => {
            res.json(model);
        });
    });
    app.post("/api/facet/field/update", (req, res) => {
        let { facetAddress, fieldName, fieldValueHash, fieldValue } = req.body;
        if ( _.isEmpty(facetAddress) || _.isEmpty(fieldName) || _.isEmpty(fieldValueHash) || _.isEmpty(fieldValue) ) {
            res.status(404)
                .send("Not found");
            return;
        }
        models.facet_field.find({
            where: {
                facetAddress: facetAddress,
                fieldName: fieldName,
            }
        }).then(
            (model) => {
                model.fieldValueHash = fieldValueHash;
                model.fieldValue = fieldValue;
                model.save().then(() => {
                    res.json(model);
                });
            });
    });
    app.post("/api/facet/field/sync", (req, res) => {
        let { facetAddress, updatedFields, deleteFields } = req.body;
        _.forEach(updatedFields,(fieldName)=> {
            models.facet_field.find({
                where: {
                    facetAddress:facetAddress,
                    fieldName:fieldName
                }
            }).then((model) => {
                model.status = 1;
                model.save();
            });
        });
        _.forEach(deleteFields,(fieldName)=> {
            models.facet_field.find({
                where: {
                    facetAddress:facetAddress,
                    fieldName:fieldName
                }
            }).then((model) => {
                model.destroy();
                res.json({deleted: true});
            });
        });
        res.json(true);
    });
    app.post("/api/facet/field/delete", (req, res) => {
        let { facetAddress, fieldName} = req.body;
        if ( _.isEmpty(facetAddress) || _.isEmpty(fieldName) ) {
            res.status(404)
                .send("Not found");
            return;
        }
        models.facet_field.find({
            where: {
                facetAddress: facetAddress,
                fieldName: fieldName,
            }
        }).then(
            (model) => {
                if (model.status == null) {
                    model.destroy();
                } else {
                    model.status = 2;
                    model.save();
                }
                res.json({deleted: true});
            });
    });

    //=========END  - Facet Field===========//

    //=========BEGIN - Facet Activity===========//

    app.post("/api/facet/loadByAddress", (req,res) => {
        let { facetAddress } = req.body;

        if ( _.isEmpty(facetAddress) ) {
            res.status(404)
                .send("Not found");
            return;
        }

        models.facet_field.findAll({
            where: {
                facetAddress: facetAddress
            }
        }).then((fields)=> {
            var revisedFields = [];
            _.forEach(fields,(field)=> {
                revisedFields.push({
                    name: field.fieldName,
                    type: field.fieldValue.includes("Tx:") ? "FACET.FACET_FIELD_PLAIN_TEXT":"FACET.FACET_FIELD_LINK",
                    value: field.fieldValue
                });
            });
            models.facet.find({
                where: {
                    facetAddress: facetAddress
                }
            }).then( (facetModel) => {
                models.account.find({
                    where: {
                        owner: facetModel.owner
                    }
                }).then( (account) => {
                    res.json({
                        revisedFields: revisedFields,
                        facetKey: facetModel.facetKey,
                        owner: facetModel.owner,
                        ownerEmail: account.email,
                        userName: account.userName,
                        title: facetModel.title
                    });
                });
            });

        });
    });

    app.post("/api/facet/createShareKey", (req, res) => {
        let { facetKey, email } = req.body;
        models.keys_registry.find({
            where: {
                email: email
            }
        }).then((emailKey) => {
            var publicKey = "";
            var privateKey = "";
            var shareKey = "";
            if (emailKey == null) {
                var key = new NodeRSA({ b: 512 });
                key.generateKeyPair();

                publicKey = key.exportKey("public");
                privateKey = key.exportKey("private");

                models.keys_registry.create({ email: email, publicKey: publicKey, privateKey: privateKey });
            } else {
                publicKey = emailKey.publicKey;
            }
            shareKey = crypto.publicEncrypt(
                publicKey,
                new Buffer(facetKey, "hex")
            ).toString("hex");
            res.json({
                shareKey: shareKey,
            });
        });
    });

    app.post("/api/facet/getFacetKey", (req, res) => {
        let { privateKey } = req.body;
        var facetKey = crypto.privateDecrypt(
            privateKey,
            new Buffer(facetKey, "hex")
        ).toString("hex");
        res.json({
            facetKey: facetKey,
        });
    });

    app.post("/api/facet/activity/add", (req, res) => {
        let { facetAddress, account, toEmail, type, status, facetKey, fromEmail, clientURL, dateTime } = req.body;
        if (typeof facetAddress == undefined) {
            res.status(404)
                .send("Not found");
        }

        var shareKey = "";
        // if (type === ACTIVITY_TYPE_VERIFICATION || (type == ACTIVITY_TYPE_AUTHORIZATION && status == STATUS_SHARED)) {
        //     shareKey = crypto.publicEncrypt(
        //         publicKey,
        //         new Buffer(facetKey, "hex")
        //     ).toString("hex")
        // }
        models.keys_registry.find({
            where: {
                email: toEmail
            }
        }).then((emailKey) => {
            var publicKey = "";
            var privateKey = "";
            if (emailKey == null) {
                var key = new NodeRSA({ b: 512 });
                key.generateKeyPair();

                publicKey = key.exportKey("public");
                privateKey = key.exportKey("private");

                models.keys_registry.create({ email: toEmail, publicKey: publicKey, privateKey: privateKey });
            } else {
                publicKey = emailKey.publicKey;
            }
            shareKey = crypto.publicEncrypt(
                publicKey,
                new Buffer(facetKey, "hex")
            ).toString("hex");
            let newFacetActivity = {
                facetAddress: facetAddress,
                status: status,
                account: account,
                email: toEmail,
                type: type,
                dateTime: dateTime,
                shareKey: shareKey
            };

            models.account.find({
                where: {
                    owner: account
                }
            }).then(() => {
                models.facet.find({
                    where: {
                        facetAddress: facetAddress
                    }
                }).then((modelActiveAcount) => {
                    let activeAcount = modelActiveAcount.owner;
                    models.facet_activity.create(newFacetActivity).then((data) => {
                        let msg = {
                            to: toEmail,
                            from: fromEmail,
                            subject: "Share facet",
                            html: `
                                <p>Facet ${facetAddress} is shared to you.</p>
                                </br>
                                <p>URL Reference: <a href="${clientURL}/contact/${activeAcount}">Click Here</a></p>
                                </br>
                                </br>
                                <p>Thanks!</p>
                                `,
                        };

                        if (type === ACTIVITY_TYPE_VERIFICATION) {
                            msg = {
                                to: toEmail,
                                from: fromEmail,
                                subject: "Invite to verify data",
                                html: `
                                    <p>Hi!</p>
                                    </br>
                                    <p>you are required to verify data!</p>
                                    </br>
                                    <p>Facet Address: ${facetAddress}</p>
                                    </br>
                                    <p>URL To verify: <a href="${clientURL}/facet/${facetAddress}/${shareKey}">Click Here</a></p>
                                    </br>
                                    <p>Thanks!</p>
                                `,
                            };
                        }
                        sgMail.send(msg);

                        res.json({
                            data: data,
                            shareKey: shareKey,
                        });
                    });
                });

            });
        });
    });

    app.post("/api/facet/activities", (req, res) => {
        let { facetAddress } = req.body;
        if (typeof facetAddress == undefined) {
            res.status(404)
                .send("Not found");
        }
        models.facet_activity.findAll({
            where: {
                facetAddress: facetAddress
            }
        }).then(
            (data) => {
                res.json(data);
            });
    });
    app.post("/api/facet/getStatusActivity", (req, res) => {
        let { facetAddress, shareKey } = req.body;
        if (typeof facetAddress == undefined) {
            res.status(404)
                .send("Not found");
        }
        models.facet_activity.find({
            where: {
                facetAddress: facetAddress,
                shareKey: shareKey
            }
        }).then(
            (data) => {
                res.json({
                    type: data.type,
                    email: data.email,
                    id: data.id,
                    status:data.status,
                    dateTime: data.dateTime
                });
            });
    });

    app.post("/api/facet/activitiesByAccount", (req, res) => {
        let { account } = req.body;
        if (typeof account == undefined) {
            res.status(404)
                .send("Not found");
        }
        models.sequelize.query("select facet_activity.* from facet inner join facet_activity on facet.facetAddress = facet_activity.facetAddress where facet.owner =:owner",
            { replacements: {
                owner: account,
            }, type: models.sequelize.QueryTypes.SELECT }
        ).then(facets => {
            res.json(facets);
        });

    });

    app.post("/api/facet/activity/update", (req, res) => {
        let { activityId, newStatus } = req.body;

        models.facet_activity.find({
            where: {
                id: activityId
            }
        }).then(
            (activity) => {
                activity.status = newStatus;
                activity.save().then(() => {
                    res.json(activity);
                });
            });
    });

    app.post("/api/facet/activity/reShareData", (req) => {
        let { reShareData } = req.body;
        models.facet_activity.find({
            where: {
                facetAddress: reShareData.facetAddress,
                type: ACTIVITY_TYPE_AUTHORIZATION,
                account: reShareData.account,
                status: STATUS_SHARED,
                dateTime: reShareData.currentDateTime
            }
        }).then(
            (activity) => {
                activity.dateTime = reShareData.dateTime;
                activity.save().then(() => {
                    let msg = {
                        to: reShareData.toEmail,
                        from: reShareData.fromEmail,
                        subject: "Re-share facet",
                        html: `
                            <p>Facet ${reShareData.facetAddress} is re-shared to you.</p>
                            </br>
                            <p>URL Reference: <a href="${reShareData.clientURL}/contact/${reShareData.address}">Click Here</a></p>
                            </br>
                            </br>
                            <p>Thanks!</p>
                            `,
                    };
                    sgMail.send(msg);
                });
            });
    });
    app.post("/api/facet/activity/revoke", (req, res) => {
        let { facet } = req.body;

        models.facet_activity.find({
            where: {
                facetAddress: facet.share.facetAddress,
                type: ACTIVITY_TYPE_AUTHORIZATION,
                account: facet.share.account,
                status: STATUS_SHARED,
                dateTime: facet.share.dateTime
            }
        }).then(
            (activity) => {
                activity.status = 2;
                activity.save().then(() => {
                    res.json(activity);
                });
            });
    });

    //=========END - Facet Activity===========//

    //=========BEGIN - Facet File===========//
    app.post("/api/facet/upload", (req, res) => {
        let { fileData, fileName, facetKey } = req.body;

        let result = cryptoHelper.encrypt(fileData, facetKey);

        var buf = Buffer.from(result, "utf8");

        fileName = fileName.split(" ").join("_");

        let newFileName = Date.now() + fileName;
        fs.writeFile(path.join(__dirname, "/../upload/files/") + newFileName, buf, function () {
            res.json({ url: API_HOST_URL + "/files/" + newFileName });
        });
    });

    app.post("/api/facet/download", (req, res) => {
        let { fileUrl, facetKey } = req.body;

        var url = require("url");
        var parsed = url.parse(fileUrl);
        var fileName = parsed.pathname;
        var filePath = fileUrl.substr(API_HOST_URL.length,fileUrl.length - API_HOST_URL.length);
        // let ext = mime.extension(mimeType)
        fileName = fileName.split(" ").join("_");
        fileName = fileName.substr(7, fileName.length -7);
        let newFileName = "dec_" + fileName;
        fs.readFile(path.join(__dirname, "/../upload") + filePath,(err,data)=>{
            var dataEncrypt = data.toString("ascii");
            let fileData = cryptoHelper.decrypt(dataEncrypt,facetKey);
            var buf = Buffer.from(fileData, "base64");
            fs.writeFile(path.join(__dirname, "/../upload/tmp/") + newFileName, buf, function () {
                res.json({ url: API_HOST_URL + "/tmp/" + newFileName });
            });
        });

    });
    //=========BEGIN - Facet File===========//

};
