const choresService = {
    getAllChores(knex) {
      return knex
      .select('*')
      .from('chores')
    },
    addChore(knex, householdId, points, chore, done, member_name) {
        return knex
          .insert({householdId, points, chore, done, member_name})
          .into('chores')
          .returning('*')
          .then(rows => {
            return rows[0]
          })
    },
    updateChore(knex, id, householdId, done){
      return knex
        .into('chores')
        .where({id,householdId: householdId })
        .update({done})
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deleteChore(knex, id, householdId) {
        return knex('chores')
          .where({ id, householdId: householdId})
          .delete()
    },
    getHouseholdChore(knex, chore_id, householdId) {
        return knex
        .select('*')
        .where({ chore_id, householdId })
        .from('chores')
    },
    getHouseholdChores(knex, householdId) {
        return knex
        .from('chores')
        .join('chores', 'chores.id', 'chores.chore_id')
        .select('*')
        .where({ householdId })
    },
}
  
  module.exports = choresService
  