module.exports = (sequelize, DataTypes) =>
  sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "basic",
      validate: {
        isIn: [["basic", "admin"]],
      },
    },
    accessToken: {
      type: DataTypes.STRING,
    },
  });
