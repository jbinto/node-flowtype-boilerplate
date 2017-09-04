/** @flow */

import { parseBigXmlToInspection, shouldSkip } from '../src/dinesafe'

describe('parseBigXmlToInspection', () => {
  it('has no regressions in snapshot', () => {
    const SAMPLE_OUTPUT_FROM_BIGXML = {
      tag: 'ROW',
      text: '\n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n  \n',
      children: [
        { tag: 'ROW_ID', text: '781' },
        { tag: 'ESTABLISHMENT_ID', text: '9001121' },
        { tag: 'INSPECTION_ID', text: '103970956' },
        { tag: 'ESTABLISHMENT_NAME', text: "BARBERIAN'S STEAK HOUSE" },
        { tag: 'ESTABLISHMENTTYPE', text: 'Restaurant' },
        { tag: 'ESTABLISHMENT_ADDRESS', text: '7 ELM ST ' },
        { tag: 'ESTABLISHMENT_STATUS', text: 'Pass' },
        { tag: 'MINIMUM_INSPECTIONS_PERYEAR', text: '3' },
        {
          tag: 'INFRACTION_DETAILS',
          text: 'FAIL TO STORE FOOD ON RACKS OR SHELVES O. REG  562/90 SEC. 23',
        },
        { tag: 'INSPECTION_DATE', text: '2017-05-17' },
        { tag: 'SEVERITY', text: 'S - Significant' },
        { tag: 'ACTION', text: 'Corrected During Inspection' },
        { tag: 'COURT_OUTCOME', text: ' ' },
        { tag: 'AMOUNT_FINED', text: ' ' },
      ],
    }

    const result = parseBigXmlToInspection(SAMPLE_OUTPUT_FROM_BIGXML)
    expect(result).toMatchSnapshot()
  })
})

describe('shouldSkip', () => {
  it('should skip an older date', () => {
    expect(
      shouldSkip({
        INSPECTION_DATE: '2016-01-01',
      })
    ).toEqual(true)
  })

  it('should skip a Pass', () => {
    expect(
      shouldSkip({
        ESTABLISHMENT_STATUS: 'Pass',
      })
    ).toEqual(true)
  })

  it('should not skip a recent failure', () => {
    expect(
      shouldSkip({
        ESTABLISHMENT_STATUS: 'Conditional Pass',
        INSPECTION_DATE: '2017-08-01',
      })
    ).toEqual(false)
  })
})
