//Replace all 'memberful_members' with the new database name
const membersService = {
    getAllMembers(knex, householdId) {
      return knex
      .select('*')
      .from('members')
      .where('householdId', householdId)
    },
    getById(knex, id) {
      return knex
      .select('*')
      .from('members')
      .where('id', id)
      .first()
    },
    // getHouseholdMembersByFolderId(knex, householdId, folder_id) {
    //   return knex
    //   .select('*')
    //   .from('members')
    //   .where({householdId, folder_id})
    // },
    addMember(knex, newMember) {
      return knex
        .insert(newMember)
        .into('members')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    deleteMember(knex, id, householdId) {
      return knex('members')
        .where({ id, householdId })
        .delete()
    },
  }
  
  module.exports = membersService
  