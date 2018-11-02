var object = require('json-templater/object')
var jsonfile = require('jsonfile')

var contentJSONPath = './content.json'

const generatedContent = object(
  require('./content.template.json'),
  { address: '1HuQGSKMtDGBwBCLnHr9GND3295s4m82Xj' }
)

jsonfile.writeFile(contentJSONPath, generatedContent, {spaces: 2, EOL: '\r\n'}, () => {
  console.log('DONE')
})
