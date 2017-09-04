export default class InspectionList {
  constructor() {
    this.inspections = {}
  }

  add(inspection) {
    console.log('---', inspection, '-----------------------------')
    const {
      // ACTION,
      // AMOUNT_FINED,
      // COURT_OUTCOME,
      ESTABLISHMENT_ADDRESS,
      ESTABLISHMENT_NAME,
      ESTABLISHMENT_STATUS,
      INFRACTION_DETAILS,
      INSPECTION_DATE,
      INSPECTION_ID,
      SEVERITY,
    } = inspection

    // File is in random order; store using a naturally sortable key
    const hashKey = INSPECTION_DATE + INSPECTION_ID

    // Group by inspection ID. Everything is the same except:
    //  (INFRACTION_*, SEVERITY)
    if (this.inspections[hashKey] == null) {
      const summary = {
        name: ESTABLISHMENT_NAME,
        address: ESTABLISHMENT_ADDRESS,
        status: ESTABLISHMENT_STATUS,
        date: INSPECTION_DATE,
        infractions: [],
      }
      this.inspections[hashKey] = summary
    }

    const infraction = {
      details: INFRACTION_DETAILS,
      severity: SEVERITY,
      // action: ACTION,
      // courtOutcome: COURT_OUTCOME,
      // amountFined: AMOUNT_FINED,
    }
    this.inspections[hashKey].infractions.push(infraction)
  }

  count() {
    return Object.keys(this.inspections).length
  }

  toObject() {
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

    return reverseSortedObject(this.inspections)
  }

  toArray() {
    return Object.values(this.toObject())
  }
}
