const AdminBro = require("admin-bro");
const AdminBroSequelize = require("@admin-bro/sequelize");
const AdminBroExpress = require("@admin-bro/express");
const session = require("express-session");
// Database
const db = require("../db/models");

AdminBro.registerAdapter(AdminBroSequelize);

const adminBro = new AdminBro({
  databases: [db],
});

const router = AdminBroExpress.buildRouter(adminBro);

module.exports = router;
