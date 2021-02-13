const express = require('express')
const _ = require('lodash');

const router = express.Router()
const { centers } = require('./centers')

const { queues } = require('../queues/queues')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

const addTaskToQueue = (center, idx) => {
  let task;
  const name = _.get(center, 'data.profile.name_with_title_and_determiner');

  const queue = queues.find(q => q.name === name)

  if(queue){
    task = queue.add(center.data, {
      repeat: {
        every: 10000 * 3, // every 30 seconds
        limit: 5, // limit to 10 for now
      },
    })
  }
  
  return task
}

router.post('/sniffer/start', async (req, res, next) => {
  centers.forEach(async (center) => {
    await addTaskToQueue(center)
  })
  
  res.send({
    process: 'done'
  })
})

router.post('/sniffer/pause', async (req, res, next) => {
  const pause = await snifferQueue.pasue()
  res.send(pause)
})

router.post('/sniffer/resume', async (req, res, next) => {
  const resume = await snifferQueue.resume()
  res.send(resume)
})

module.exports = router
