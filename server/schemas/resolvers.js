const { Thought, User } = require("../models");

const resolvers = {
  Query: {
    // parent: This is if we used nested resolvers to handle more complicated actions,
    // as it would hold the reference to the resolver that executed the nested resolver function.
    // We won't need this throughout the project,
    // but we need to include it as the first argument.
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
    users: async () => {
      return User.find()
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },
  },
};

module.exports = resolvers;
