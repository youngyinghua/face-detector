const handleRegister = (req, res, bcrypt, db) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.json(400, "incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx
          .insert({ email: loginEmail[0], name: name, joined: new Date() })
          .into("users")
          .returning("*")
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.json(400, "unable to register"));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.json(400, "unable to register"));
};

module.exports = {
  handleRegister: handleRegister,
};
