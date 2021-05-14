exports.up = function (knex) {
    return knex.schema.createTable("members", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("age").notNullable();
      table.integer("points");
      table
        .integer("householdId")
        .unsigned()
        .nullable()
        .defaultTo(null)
        .index()
        .references("id")
        .inTable("household");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("members");
  };
 