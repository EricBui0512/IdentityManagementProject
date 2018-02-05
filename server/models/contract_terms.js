/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contract_terms', {
    id: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    term: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'contract_terms'
  });
};
