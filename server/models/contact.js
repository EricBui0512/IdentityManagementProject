/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("contact", {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        owner: {
            type: DataTypes.STRING(42),
            allowNull: false,
            defaultValue: "",
            references: {
                model: "account",
                key: "owner"
            }
        },
        account: {
            type: DataTypes.STRING(42),
            allowNull: false
        },
        fullName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: "contact"
    });
};
