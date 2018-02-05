/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('nation', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nationality: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    country_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    flag_image: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'nation'
  });
};
