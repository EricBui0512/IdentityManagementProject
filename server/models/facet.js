/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("facet", {
        facetAddress: {
            type: DataTypes.STRING(42),
            allowNull: false,
            defaultValue: "",
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: ""
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
        facetKey: {
            type: DataTypes.STRING(64),
            allowNull: false,
            defaultValue: ""
        }
    }, {
        tableName: "facet"
    });
};
