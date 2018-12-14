const db = require("./db");
const { hash } = require("./util");

const Plus = db.define("plus", {
  location: {
    type: db.Sequelize.STRING,
    allowNull: false,
    set(val) {
      this.setDataValue("location", hash(val));
    }
  }
});

module.exports = Plus;
