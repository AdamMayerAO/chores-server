exports.up = function (knex) {
    return knex.schema.createTable("household", (table) => {
      table.increments("id").primary();
      table.string("householdName").notNullable();
      table.string("email", null).notNullable();
      table.string("password", null).notNullable();
      table.integer("points");
      table.string("prize");
      table.integer("goal");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("household");
  };