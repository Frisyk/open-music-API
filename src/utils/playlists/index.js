const mapDBToModel = ({
  id,
  name,
  username: owner,
}) => ({
  id,
  name,
  username: owner,
});

module.exports = { mapDBToModel };
