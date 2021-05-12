const express = require('express')
const xss = require('xss')
const householdService = require('./household-service')
const householdRouter = express.Router()
const jsonParser = express.json()
const membersService = require('./members-service')

const serializeHousehold = household => ({
  id: household.id,
  householdName: xss(household.householdName),
  //prize: xss(household.prize),
  email: xss(household.email),
  password: xss(household.password),
})

householdRouter
    .route('/signup')
    .post((req, res, next) => {
        const { householdName, email, password } = req.body
        if(!householdName.length || !email.length || !password.length) {
            return res.status(405).json({
                message: `One or more parameters are incorrect/empty!`
            })
        }
        householdService.getHouseholdByEmail(req.app.get('db'), email)
            .then(household => {
                if (household) {
                return res.status(405).json({
                    message: `Household with this email already exists!`
                })
                }
            })
            .catch(next)
        householdService.addNewHousehold(req.app.get('db'), {householdName, email, password})
            .then(household => {
                console.log("\nAdd New household Response: ", household, "\n");
                if (!household) {
                    return res.status(405).json({
                        message: `An error occurred while registering household!`
                    })
                } else {
                    return res.status(201).json({
                        household: household,
                        message: `Household registered successfully!`
                    });
                }
            })
            .catch(next)
    })
householdRouter
    .route('/login')
    .post((req, res, next) => {
        const { email, password } = req.body
        householdService.getHouseholdByEmail(req.app.get('db'), email)
    .then(household => {
        if (!household) {
            return res.status(404).json({
            message: `Household does not exist with this email!`
            })
        } else if(household.password === password) {
            return res.status(200).json({
                //household: household.map(serializeHousehold),
                household: household,
               // members: membersService.getAllMembers(req.app.get('db'), household.id)
                //chores: 
                // message: `User logged in successfully!`
            })
        } else {
            return res.status(404).json({
                message: `Email or password is incorrect!`
            });
        }
    })
    .catch(next)
})
householdRouter
    .route('/prize')
    .post((req, res, next) => {
        const { prize, householdId, goal} = req.body
        console.log("prize: ", prize, "Goal: ", goal,"HHID: ", householdId)
        householdService.getHouseholdById(req.app.get('db'), householdId)
    .then(
        household => {
        if (household) {
            console.log("Here is the household line 85: ", household)
            householdService.addPrize(req.app.get('db'),householdId, prize, goal)
            .then(household => {
                return res.status(201).json({
                    household: household,
                    message: `prize added successfully!`
                });
            })
        } else {
            return res.status(404).json({
                message: `Prize error!`
            });
        }
    })
    .catch(next)
})

  

module.exports = householdRouter
