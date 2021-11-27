const handleProfile = (req, res) => {
  const { id } = req.params;
  return db
    .select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.json(400, "Not found");
      }
    })
    .catch((err) => res.json(400, "error getting user"));
};
module.exports = {
  handleProfile: handleProfile,
};
