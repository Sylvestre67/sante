const Queue = require('bull')
const { setQueues, BullAdapter } = require('bull-board')
const _ = require('lodash');

const { requestAvailabilities } = require('../processor/proecessor')
const { centers } = require('../routes/centers');

const queues = [];

centers.forEach((center) => {
  const name = _.get(center, 'data.profile.name_with_title_and_determiner');
  
  if(name){
    const queue = new Queue(name);
    queue.process((job) =>  requestAvailabilities(job))

    queue.on('completed', (job, result) => {
      const { data } = job
      const { profile } = data
      const { availabilities = [] } = result

      if (availabilities.length > 0) {
        console.info(
          `${
            profile.name_with_title_and_determiner
          } HAS AVAILABLE APPOITNMENTS ${JSON.stringify(result)}`
        )
      }

      if (availabilities.length === 0) {
        console.info(
          `${
            profile.name_with_title_and_determiner
          } HAS NO APPOITNMENTS ${JSON.stringify(result)}`
        )
      }
    });
    
    queues.push(queue);  
    } 
});

setQueues(queues.map(q => new BullAdapter(q)))

module.exports = {
  queues,
}