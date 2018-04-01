/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("keys_registry", {
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true
        },
        publicKey: {
            type: DataTypes.STRING(2000),
            allowNull: false,
            defaultValue: ""
        },
        privateKey: {
            type: DataTypes.STRING(2000),
            allowNull: false,
            defaultValue: ""
        }
    }, {
        tableName: "keys_registry"
    });
};
