const axios = require('axios')
const queryString = require('query-string')
const _ = require('lodash')

const requestAvailabilities = async (job) => {
  const { data } = job
  const { places, profile, agendas } = data

  const practiceIds = places.reduce((acc, place) => {
    const ids = _.get(place, 'practice_ids', [])
    if (ids) {
      return acc.concat(ids)
    }
  }, [])

  const query = {
    practice_ids: practiceIds, // seems to be the center_id
    profileId: profile.id, // profile.id
    visit_motive_ids: ['2534819'], // vaccination_covid  first_visit
    agenda_ids: agendas.map((agenda) => agenda.id), // agendas associated with the practices
    insurance_sector: 'public',
    destroy_temporary: true,
    limit: 100,
    allowNewPatients: true,
    telehealth: false,
    isOrganization: true,
    vaccinationMotive: true,
    vaccinationDaysRange: 26,
    vaccinationCenter: true,
  }

 let search = queryString.stringify(query, {
    arrayFormat: 'comma',
    arrayFormatSeparator: '-',
  })

  search += `${search}&start_date=${new Date().toLocaleDateString('fr-FR').replace('/', '-')}`

  try {
    const response = await axios.get(
      `https://partners.doctolib.fr/availabilities.json?${search}`
    )
    return response.data
  } catch (e) {
    throw e
  }
}

module.exports = {
  requestAvailabilities,
}
