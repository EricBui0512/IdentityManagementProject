/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("account", {
        owner: {
            type: DataTypes.STRING(42),
            allowNull: false,
            defaultValue: "",
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            references: {
                model: "keys_registry",
                key: "email"
            }
        },
        userName: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        deviceToken: {
            type: DataTypes.STRING(64),
            allowNull: true
        }
    }, {
        tableName: "account"
    });
};
