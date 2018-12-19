const db = require("./db");
const log = require("./logger")("location-model");
const { hash } = require("./util");

const Location = db.define("location", {
  location: {
    type: db.Sequelize.STRING,
    unique: true,
    allowNull: false,
    set(val) {
      this.setDataValue("location", hash(val));
    }
  },
  votes: {
    type: db.Sequelize.INTEGER,
    defaultValue: 0
  }
});

Location.findOneWithLocation = function findOneWithLocation(location) {
  return Location.findOne({ where: { location: hash(location) } });
};

Location.upvoteOrCreate = function upvoteOrCreate(location) {
  log.debug(`Incrementing location ${location}`);
  return Location.findOneWithLocation(location).then(locationItem => {
    if (!locationItem) {
      log.debug(`Location ${location} not found. Creating new location`);
      return Location.create({ location, votes: 1 });
    }
    return locationItem.increment("votes").then(l => l.reload());
  });
};

module.exports = Location;
