/** @flow */

import InspectionList from '../src/InspectionList'

const INSPECTION_1 = {
  ROW_ID: '6497',
  ESTABLISHMENT_ID: '9009514',
  INSPECTION_ID: '104037228',
  ESTABLISHMENT_NAME: 'MANDARIN',
  ESTABLISHMENTTYPE: 'Restaurant',
  ESTABLISHMENT_ADDRESS: '2200 YONGE ST ',
  ESTABLISHMENT_STATUS: 'Conditional Pass',
  MINIMUM_INSPECTIONS_PERYEAR: '3',
  INFRACTION_DETAILS: 'Operator fail to provide adequate pest control',
  INSPECTION_DATE: '2017-08-22',
  SEVERITY: 'S - Significant',
  ACTION: 'Notice to Comply',
  COURT_OUTCOME: ' ',
  AMOUNT_FINED: ' ',
}
const INSPECTION_2 = {
  ROW_ID: '6415',
  ESTABLISHMENT_ID: '9009431',
  INSPECTION_ID: '104009693',
  ESTABLISHMENT_NAME: 'MAIN KITCHEN - BASEMENT',
  ESTABLISHMENTTYPE: 'Serving Kitchen',
  ESTABLISHMENT_ADDRESS: '301 FRONT ST W',
  ESTABLISHMENT_STATUS: 'Conditional Pass',
  MINIMUM_INSPECTIONS_PERYEAR: '3',
  INFRACTION_DETAILS: 'Operator fail to properly maintain mechanical washer',
  INSPECTION_DATE: '2017-07-12',
  SEVERITY: 'S - Significant',
  ACTION: 'Notice to Comply',
  COURT_OUTCOME: ' ',
  AMOUNT_FINED: ' ',
}
const INSPECTION_1_2ND_VIOLATION = {
  ROW_ID: '6496',
  ESTABLISHMENT_ID: '9009514',
  INSPECTION_ID: '104037228',
  ESTABLISHMENT_NAME: 'MANDARIN',
  ESTABLISHMENTTYPE: 'Restaurant',
  ESTABLISHMENT_ADDRESS: '2200 YONGE ST ',
  ESTABLISHMENT_STATUS: 'Conditional Pass',
  MINIMUM_INSPECTIONS_PERYEAR: '3',
  INFRACTION_DETAILS: 'Operator fail to properly maintain rooms',
  INSPECTION_DATE: '2017-08-22',
  SEVERITY: 'M - Minor',
  ACTION: 'Notice to Comply',
  COURT_OUTCOME: ' ',
  AMOUNT_FINED: ' ',
}

describe('xxx', () => {
  let list
  beforeEach(() => {
    list = new InspectionList()
  })

  it('adds a inspection to the list', () => {
    list.add(INSPECTION_1)
    expect(list.count()).toEqual(1)
    expect(list).toMatchSnapshot()
  })

  it('adds 2 inspections from different establishments to the list', () => {
    list.add(INSPECTION_1)
    list.add(INSPECTION_2)
    expect(list.count()).toEqual(2)
    expect(list).toMatchSnapshot()
  })

  it('groups multiple violations in the same inspection', () => {
    list.add(INSPECTION_1)
    list.add(INSPECTION_1_2ND_VIOLATION)
    expect(list.count()).toEqual(1)
    expect(list).toMatchSnapshot()
  })
})
