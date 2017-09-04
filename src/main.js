import bigXml from 'big-xml'
import _ from 'lodash'
import readline from 'readline'

const RECENT_DATE_REGEX = /^2017-0[789]/

class InspectionList {
  constructor() {
    this.inspections = {}
  }

  add(inspection) {
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

const parseBigXmlToInspection = record =>
  // `big-xml` returns records in the following format:
  //   children:
  //    [ { tag: 'ROW_ID', text: '2489' },
  //      { tag: 'ESTABLISHMENT_ID', text: '9003142' },
  //    ...

  // convert to the following:
  // {
  //   ROW_ID: '27233',
  //   ESTABLISHMENT_ID: '10277628',
  //   ...
  // }
  _.chain(record.children)
    .keyBy('tag')
    .mapValues('text')
    .value()

const shouldSkip = inspection => {
  const isPass = inspection.ESTABLISHMENT_STATUS === 'Pass'
  const isOld = !RECENT_DATE_REGEX.test(inspection.INSPECTION_DATE)
  return isPass || isOld
}

const processDinesafeXMLtoJSON = (path = './dinesafe.xml') => {
  const inspectionList = new InspectionList()

  const processRecord = record => {
    try {
      const inspection = parseBigXmlToInspection(record)
      if (shouldSkip(inspection)) return
      inspectionList.add(inspection)
      process.stderr.write('.')
    } catch (ex) {
      process.stderr.write('processRecord ERROR', ex)
      process.exit(111)
    }
  }

  const processEnd = () => {
    process.stderr.write(
      `\nOutputting ${inspectionList.count()} failed inspections\n`
    )
    const array = inspectionList.toArray()
    const json = JSON.stringify(array, null, 2)
    process.stdout.write(json.substr(0, 100))
  }

  const reader = bigXml.createReader(path, /^ROW$/)
  reader.on('record', processRecord)
  reader.on('end', processEnd)
}

processDinesafeXMLtoJSON()
