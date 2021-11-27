const Clarifai = require("clarifai");

const appAPI = new Clarifai.App({
  apiKey: "c5093f584d8f400cb949dc69fb87c5df",
});

const handleImage = (req, res, db) => {
  const { id } = req.body;
  return db("users")
    .where({ id: id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      if (entries.length) {
        res.json(entries[0]);
      } else {
        res.json(400, "Not found");
      }
    })
    .catch((err) => res.json(400, "error getting entries"));
};

const handleImageUrl = (req, res) => {
  appAPI.models
    .predict("a403429f2ddf4b49b307e318f00e528b", req.body.imageUrl)
    .then((data) => {
      res.json(data);
      console.log(data);
    })
    .catch((err) => res.json(400, "unable to work with API"));
};

module.exports = {
  handleImage: handleImage,
  handleImageUrl: handleImageUrl,
};
