/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cities', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    city: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    city_code: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    country_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'cities'
  });
};
