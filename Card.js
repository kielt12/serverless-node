module.exports = (sequelize, type) => {
    return sequelize.define('card', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      text: type.STRING,
      answer: type.STRING
    })
  }