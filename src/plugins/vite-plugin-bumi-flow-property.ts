import { transformAsync, traverse } from '@babel/core'
import fs from 'fs'
import pathFile from 'path'
import { constructorCss } from '../constructorCss'

export default async function checkBumiFlowPlugin(pathCss: string) {
  return {
    name: 'bumi-flow',
    async transform(code, id) {
      if (!id.endsWith('.ts')) {
        return null
      }

      const { ast } = await transformAsync(code, {
        filename: id,
        ast: true,
        parserOpts: { plugins: ['typescript'] }
      })

      // Function to extract parameters from the bumiFlow method and chained methods
      function extractBumiFlowParams(node, params = []) {
        if (node.type === 'CallExpression' && node.callee.name === 'bumiFlow') {
          params.push(...node.arguments.map((arg) => arg.value))
        }

        if (node.type === 'CallExpression' && node.callee.property) {
          // Handle chained methods like .base and .hover
          const methodName = node.callee.property.name
          if (methodName === 'base') {
            params.push(...node.arguments.map((arg) => arg.value))
          }
          if (methodName === 'hover') {
            params.push('hover:' + node.arguments.map((arg) => arg.value))
          }
        }

        return params
      }

      // Search for bumiFlow method parameters in the AST
      const bumiFlowParams = []
      traverse(ast, {
        enter(path) {
          if (path.node.type === 'Program') {
            path.traverse({
              CallExpression(path) {
                extractBumiFlowParams(path.node, bumiFlowParams)
              }
            })
          }
        }
      })

      if (bumiFlowParams.length > 0) {
        const cssFilePath = pathFile.resolve(__dirname, pathCss)

        const cssContent = constructorCss(bumiFlowParams.reverse())

        fs.writeFileSync(
          cssFilePath,
          `.${bumiFlowParams[0]} {${cssContent.join('')}}`
        )
      }
    }
  }
}
