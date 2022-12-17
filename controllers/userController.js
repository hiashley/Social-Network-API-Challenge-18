const { User, Thought } = require('../models');

module.exports = {
  getAllUsers(req, res) {
    User.find()
      .select('-__v')
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that id' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  removeUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.applications } })
      )
      .then(() => res.json({ message: 'User and thoughts have been deleted' }))
      .catch((err) => res.status(500).json(err));
  },

  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
          !user
            ? res.status(404).json({ message: 'No user with that id' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
  },

  removeFriend(req,res) {
    User.findOneAndUpdate(
      {_id: req.params.thoughtId},
      {$pull: {friends: { reactionId: req.params.friendId }} },
      {runValidators: true, new: true,},
  )
      .then((user) => 
          !user
              ? res.status(404).json({ message: `Friend deleted` })
              : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  }
}