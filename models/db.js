const Sequelize = require('sequelize');

const sequelize = new Sequelize("Hotel_Project", "postgres", "Gui@050322", {
    host: 'localhost',
    dialect: 'postgres'
});

sequelize.authenticate()
  .then(() => {
    console.log("Conexão bem sucedida");
  })
  .catch((err) => {
    console.error("Erro ao conectar-se ao banco de dados:", err);
  });

module.exports = sequelize;
