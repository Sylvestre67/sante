const express = require('express')
const _ = require('lodash');

const router = express.Router()
const { centers } = require('./centers')

const { queues } = require('../queues/queues')

const addTaskToQueue = (center, idx) => {
  let task;
  const id = _.get(center, 'data.profile.id');
  const queue = queues.find(q => q.name === id.toString())

  if(queue){
    task = queue.add(center.data, {
      repeat: {
        every: (10000 * 6) + idx * 5000, // every minute + idx * 5 sec.
      },
    })
  }
  
  return task
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.post('/sniffer/start', async (req, res) => {
  centers.forEach(async (center, idx) => {
    await addTaskToQueue(center, idx)
  })
  
  res.send({
    process: 'done'
  })
})

router.post('/sniffer/pause/:id', async (req, res) => {
  const {params} = req;
  const {id} = params;

  const queue = queues.find(q => q.name === id)

  if(queue){
    await queue.pause()

    return res.send({
      name,
      status: 'paused'
    })
  }
  
  return res.status(404).send(`${id} - not found`);
})

router.post('/sniffer/resume/:id', async (req, res) => {
  const {params} = req;
  const {id} = params;

  const queue = queues.find(q => q.name === id)

  if(queue){
    await queue.resume()

    return res.send({
      id,
      status: 'resume'
    })
  }

  return res.status(404).send(`${id} - not found`);
})

module.exports = router
