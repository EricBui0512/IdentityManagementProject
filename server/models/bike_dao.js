/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bike_dao', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    dao_code: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    is_completed: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    country_code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    model_code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    model_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    discipline: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    weight: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    colour: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    material: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    picture_link: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    first_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    first_postalcode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'bike_dao'
  });
};
