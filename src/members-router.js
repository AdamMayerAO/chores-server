const express = require('express')
const xss = require('xss')
const membersService = require('./members-service')
const membersRouter = express.Router()
const jsonParser = express.json()
const householdService = require('./household-service')

const serializeMember = member => ({
  id: member.id,
  name: xss(member.name),
  age: member.age,
  householdId: member.householdId,
  chores: member.chores,
  points: member.points
})


membersRouter
  .route('/:id')
  .get( (req, res, next) => {
    const id = req.params.id
    console.log(id)
    const knexInstance = req.app.get('db')
    householdService.getHouseholdById(req.app.get('db'), id)
    .then(household => {
      if (household) {
        membersService.getAllMembers(knexInstance, household.id)
        .then(members => {
          return res.status(200).json({
            members: members.map(serializeMember),
            message: `Members fetched successfully!`
          });
        })
      } else {
        return res.status(404).json({
          message: `An error occurred while fetching details!`
        })
      }
    })
    .catch(next)
  })

membersRouter
  .route('/add-member')
  .post( (req, res, next) => {
    //I want to have elements that are NOT required, but optional.
    const { name, age, householdId, points } = req.body;
    const newMember = { name, age, householdId: householdId, points}
    for (const [key, value] of Object.entries(newMember)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }
    householdService.getHouseholdById(req.app.get('db'), householdId)
      .then(household => {
        if (household) {
          membersService.addMember(
            req.app.get('db'),
            {...newMember, householdId: household.id}
          )
          .then(member => {
            return res.status(201).json({
              member: member,
              message: `member added successfully!`
            });
          })
        } else {
          return res.status(404).json({
            message: `An error occurred while fetching details!`
          })
        }
      })
      .catch(next)
  })

membersRouter
  .route('/remove-member')
  .delete((req, res, next) => {
    const  member  = req.body;
    console.log(member)
    const knexInstance = req.app.get('db');
    householdService.getHouseholdById(req.app.get('db'), member.householdId)
    .then(household => {
      if (household) {
        membersService.deleteMember(knexInstance, member.id, member.householdId)
        .then(member => {
          return res.status(204).json({
            message: `member deleted successfully!`
          });
        })
      } else {
        return res.status(404).json({
          message: `An error occurred while fetching  details!`
        })
      }
    })
    .catch(next)
  })

module.exports = membersRouter
