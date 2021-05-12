const { default: knex } = require("knex")

const householdService = {
    getHouseholdById(knex, householdId){
        return knex
        .from('household')
        .where('id', householdId)
        .first()
    },
    
    getHouseholdByEmail(knex, email) {
      return knex
      .from('household')
      .select('*')
      .where('email', email)
      .first()
    },
    addNewHousehold(knex, newHousehold) {
      return knex
        .insert(newHousehold)
        .into('household')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    addPoints(knex, points, householdId){
        return knex
        .insert(points)
        .into('household.points')
        .where("householdId", householdId)
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    addPrize(knex, householdId, prize, goal){
        return knex
        .into('household')
        .where("id", householdId)
        .update({prize, goal})
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    }
  }
  
  module.exports = householdService
  