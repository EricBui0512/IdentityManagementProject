/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bike_model', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    owner_id: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    country_code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    model_code: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    model_name: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    discipline: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    weight: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    colour: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    material: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    picture_link: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'bike_model'
  });
};
