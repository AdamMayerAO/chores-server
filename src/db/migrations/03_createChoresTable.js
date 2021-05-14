exports.up = function (knex) {
    return knex.schema.createTable("chores", (table) => {
      table.increments("id").primary();
      table.integer("points").notNullable();
      table.string("chore").notNullable();
      table.boolean("done");
      table.string("member_name").notNullable();
      table
        .integer("householdId")
        .unsigned()
        .nullable()
        .defaultTo(null)
        .index()
        .references("id")
        .inTable("household");
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("chores");
  };