const express = require('express')
const xss = require('xss')
const choresService = require('./chores-service')
const householdService = require('./household-service')
const choresRouter = express.Router()
const jsonParser = express.json()


const serializeChore = chore => ({
  id: chore.id,
  chore: xss(chore.chore),
  points: xss(chore.points),
  householdId: chore.householdId,
  member_name: chore.member_name,
  done: chore.done
})

// choresRouter
//   .route('/get/:id')
//   console.log("AT THE GET ENDPOINT")
//   .get( (req, res, next) => {
//       const householdId = req.params.id
//     console.log("CHORES/GET - householdId:", householdId)
//     const knexInstance = req.app.get('db') 
//     householdService.getHouseholdById(req.app.get('db'), householdId)
//     .then(household => {
//       if (household) {
//         choresService.getAllChores(knexInstance, household.id)
//         .then(chores => {
//           return res.status(200).json({
//             chores: chores.map(serializeChore),
//             message: `chores fetched successfully!`
//           });
//         })
//       } else {
//         return res.status(404).json({
//           message: `An error occurred while fetching details!`
//         })
//       }
//     })
//     .catch(next)
//   })
choresRouter
  .route('/id/:id')
  .get( (req, res, next) => {
      const householdId = req.params.id
    console.log(householdId)
    const knexInstance = req.app.get('db') 
    householdService.getHouseholdById(req.app.get('db'), householdId)
    .then(household => {
      if (household) {
        choresService.getAllChores(knexInstance, household.id)
        .then(chores => {
          return res.status(200).json({
            chores: chores.map(serializeChore),
            message: `chores fetched successfully!`
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
  .post( (req, res, next) => {
    const id = parseInt(req.params.id)
    console.log("CHORE ID: ", id)
    const knexInstance = req.app.get('db')     
    const { done, householdId } = req.body;
   console.log("done: ", done, "householdId: ", householdId)
    householdService.getHouseholdById(knexInstance, householdId)
        .then(household => {
          if (household) {
            console.log("Chore id: ", id, "HouseholdId: ", householdId, "done: ", done)
            choresService.updateChore(
              knexInstance, id, householdId, done
            )
            .then(chore => {
              console.log("Updated Chore: ", chore)
              return res.status(201).json({
                chore: chore,
                message: `chore added successfully!`
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
  .delete((req, res, next) =>{
    const id = parseInt(req.params.id)
    console.log("Chore id: ", id)
    const {householdId} = req.body;
    console.log(householdId)
    choresService.deleteChore(
      req.app.get('db'),
      id, householdId
    )
      .then(numRowsAffected => {
     //   logger.info(`folder with id ${folder_id} deleted.`)
        return res.status(204).json({
          message: `chore deleted successfully!`
        });
      })
      .catch(next)
  })

choresRouter
  .route('/add-chore')
  .post( (req, res, next) => {
    //I want to have elements that are NOT required, but optional.
    const { householdId, points, chore, done, member_name } = req.body;
    const newChore = { householdId: householdId, points, chore, done, member_name }
    for (const [key, value] of Object.entries(newChore)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })
        }
      }
     
      householdService.getHouseholdById(req.app.get('db'), householdId)
        .then(household => {
          if (household) {
            choresService.addChore(
              req.app.get('db'), newChore.householdId, newChore.points, newChore.chore, newChore.done, newChore.member_name
            )
            .then(chore => {
              return res.status(201).json({
                  chore: serializeChore(chore),
                message: `chore added successfully!`
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

choresRouter
  .route('/remove-chore')
  .delete((req, res, next) => {
    const chore = req.body;
    const knexInstance = req.app.get('db');
    householdService.getHouseholdById(req.app.get('db'), chore.householdId)
    .then(household => {
      if (household) {
        choresService.deleteChore(knexInstance, chore.id, chore.householdId)
        .then(numRowsAffected => {
            return res.status(204).json({message: "deleted"})
        })
      } else {
        return res.status(404).json({
          message: `An error occurred while fetching  details!`
        })
      }
    })
    .catch(next)
  })

module.exports = choresRouter
