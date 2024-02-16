import fs from 'fs'
import * as path from 'path'
import { constructorCss } from '../constructorCss'

export default async function checkBumiFlowPlugin() {
  return {
    // Plugin name
    name: 'bumi-flow',

    // Transform function for code modification
    async transform(code, id) {
      // Check if the file has a '.ts' extension
      if (!id.endsWith('.ts')) {
        return null
      }

      // Read the content of the file
      const fileContent = fs.readFileSync(id, 'utf-8')

      // Check if 'bumiFlow(' is present in the file
      if (fileContent.includes('bumiFlow(')) {
        // Define a regex pattern to match 'bumiFlow' function
        const regexBumiFlow = /bumiFlow\('([^']+)'\)([\s\S]+)\.build\(\)/
        const matchBumiFlow = fileContent.match(regexBumiFlow)
        const bumiFlowFunction = matchBumiFlow ? matchBumiFlow[0] : null

        // Extract values between single quotes using regex
        const regexClass = /'(.*?)'/g
        const valuesBetweenQuotes = []
        let match

        while ((match = regexClass.exec(bumiFlowFunction)) !== null) {
          valuesBetweenQuotes.push(match[1])
        }

        // Resolve the path to the SCSS file
        const cssFilePath = path.resolve(
          __dirname,
          '../src/assets/scss/main.scss'
        )

        const cssClass = valuesBetweenQuotes[0]

        // Extract the remaining values as CSS constructor parameters
        const cssConstructor = valuesBetweenQuotes.slice(1)

        // Slice the array to remove the first element
        const wrapperCss = cssConstructor.join(' ').split(' ').slice(0)

        // Generate CSS content using the 'constructor' function
        const cssContent = constructorCss(wrapperCss)

        // Write the generated CSS to the specified file
        fs.writeFileSync(cssFilePath, `.${cssClass} {${cssContent.join('')}}`)
      }

      // Return the original code
      return code
    }
  }
}
