/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("facet_field", {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        facetAddress: {
            type: DataTypes.STRING(42),
            allowNull: false,
            defaultValue: "",
            references: {
                model: "facet",
                key: "facetAddress"
            }
        },
        fieldName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ""
        },
        fieldValueHash: {
            type: DataTypes.STRING(32),
            allowNull: false,
            defaultValue: ""
        },
        fieldValue: {
            type: DataTypes.STRING(2000),
            allowNull: false,
            defaultValue: ""
        },
        status: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        }
    }, {
        tableName: "facet_field"
    });
};
