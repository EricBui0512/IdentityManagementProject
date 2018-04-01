/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("facet_activity", {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        facetAddress: {
            type: DataTypes.STRING(42),
            allowNull: true,
            references: {
                model: "facet",
                key: "facetAddress"
            }
        },
        status: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        account: {
            type: DataTypes.STRING(42),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        dateTime: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        type: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        shareKey: {
            type: DataTypes.STRING(600),
            allowNull: true
        }
    }, {
        tableName: "facet_activity"
    });
};
