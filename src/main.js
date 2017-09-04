import bigXml from 'big-xml'
import _ from 'lodash'
import Case from 'case'

const RECENT_DATE_REGEX = /^2017-0[789]/

const reader = bigXml.createReader('dinesafe.xml', /^ROW$/)

// { tag: 'ROW',
//   text: '\n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n',
//   children:
//    [ { tag: 'ROW_ID', text: '2489' },
//      { tag: 'ESTABLISHMENT_ID', text: '9003142' },
//      { tag: 'INSPECTION_ID', text: '103851324' },
//      { tag: 'ESTABLISHMENT_NAME', text: 'COACH HOUSE RESTAURANT' },
//      { tag: 'ESTABLISHMENTTYPE', text: 'Restaurant' },
//      { tag: 'ESTABLISHMENT_ADDRESS', text: '574 YONGE ST ' },
//      { tag: 'ESTABLISHMENT_STATUS', text: 'Pass' },
//      { tag: 'MINIMUM_INSPECTIONS_PERYEAR', text: '3' },
//      { tag: 'INFRACTION_DETAILS',
//        text: 'Operator fail to properly wash surfaces in rooms' },
//      { tag: 'INSPECTION_DATE', text: '2016-11-17' },
//      { tag: 'SEVERITY', text: 'M - Minor' },
//      { tag: 'ACTION', text: 'Notice to Comply' },
//      { tag: 'COURT_OUTCOME', text: ' ' },
//      { tag: 'AMOUNT_FINED', text: ' ' } ] }

const inspections = {}

reader.on('record', record => {
  const inspection = _.chain(record.children)
    .keyBy('tag')
    .mapValues('text')
    .value()

  // {
  //   ROW_ID: '27233',
  //   ESTABLISHMENT_ID: '10277628',
  //   INSPECTION_ID: '103956759',
  //   ESTABLISHMENT_NAME: 'LUCKY\'S CORNER',
  //   ESTABLISHMENTTYPE: 'Restaurant',
  //   ESTABLISHMENT_ADDRESS: '2111 JANE ST ',
  //   ESTABLISHMENT_STATUS: 'Conditional Pass',
  //   MINIMUM_INSPECTIONS_PERYEAR: '3',
  //   INFRACTION_DETAILS: 'Operator fail to provide proper equipment',
  //   INSPECTION_DATE: '2017-04-26',
  //   SEVERITY: 'M - Minor',
  //   ACTION: 'Notice to Comply',
  //   COURT_OUTCOME: ' ',
  //   AMOUNT_FINED: ' '
  // }

  const {
    ACTION,
    AMOUNT_FINED,
    COURT_OUTCOME,
    ESTABLISHMENT_ADDRESS,
    ESTABLISHMENT_NAME,
    ESTABLISHMENT_STATUS,
    INFRACTION_DETAILS,
    INSPECTION_DATE,
    INSPECTION_ID,
    SEVERITY,
  } = inspection

  const isFailure = ESTABLISHMENT_STATUS !== 'Pass'
  const isRecent = RECENT_DATE_REGEX.test(INSPECTION_DATE)
  if (!isFailure) return
  if (!isRecent) return

  const HASH_KEY = INSPECTION_DATE + INSPECTION_ID

  // Group by inspection ID. Everything is the same except:
  //  (INFRACTION_*, SEVERITY)
  if (inspections[HASH_KEY] == null) {
    console.log('New inspection ', INSPECTION_ID)
    const summary = {}
    summary.name = ESTABLISHMENT_NAME
    summary.address = ESTABLISHMENT_ADDRESS
    summary.status = ESTABLISHMENT_STATUS
    summary.date = INSPECTION_DATE
    summary.infractions = []
    inspections[HASH_KEY] = summary
  }

  console.log('  infraction ', inspections[HASH_KEY].infractions.length)
  const infraction = {
    details: INFRACTION_DETAILS,
    severity: SEVERITY,
    // action: ACTION,
    // courtOutcome: COURT_OUTCOME,
    // amountFined: AMOUNT_FINED,
  }
  inspections[HASH_KEY].infractions.push(infraction)
})

reader.on('end', () => {
  const reverseSortedObject = input => {
    const output = {}
    Object.keys(input)
      .sort()
      .reverse()
      .forEach(key => {
        output[key] = input[key]
      })
    return output
  }

  const sortedByHashKey = reverseSortedObject(inspections)
  const withoutKeys = Object.values(sortedByHashKey)

  console.log(JSON.stringify(withoutKeys, null, 2))
})
