const express = require('express')
const router = express.Router()
const TimeSlotController = require('../controllers/TimeSlotController')
const bodyParser = require('body-parser')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }))


router.post('/add/timeslots', (req, res) => {
    TimeSlotController.AddTimeSlots(req, res);
})

router.get('/timeslots', (req, res) => {
    TimeSlotController.getTimeSlots(req, res);
})

router.delete('/delete/timeslot/:id', (req, res) => {
    TimeSlotController.deleteTimeSlots(req, res)
})

router.get('/timeslot/:id', (req, res) => {
    TimeSlotController.getTimeSlotById(req, res);

})

router.put('/edit/timeslot/:id', (req, res) => {
    TimeSlotController.editTimeSlot(req, res);
})

module.exports = router