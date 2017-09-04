/* eslint-disable import/prefer-default-export */
import bigXml from 'big-xml'
import _ from 'lodash'
import InspectionList from './InspectionList'

const RECENT_DATE_REGEX = /^2017-0[789]/

export const parseBigXmlToInspection = record =>
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

export const shouldSkip = inspection => {
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

if (require.main === module) {
  // Running from command line, not reqire/import
  processDinesafeXMLtoJSON()
}
