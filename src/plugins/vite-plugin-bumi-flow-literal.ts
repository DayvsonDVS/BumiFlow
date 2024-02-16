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

      const idIncludeBumiFlow = []
      const listCss = []

      traverse(ast, {
        CallExpression(path) {
          const callee = path.get('callee')

          if (callee.isIdentifier({ name: 'bumiFlow' })) {
            idIncludeBumiFlow.push(id)
            console.log(callee.isExpression)
          }
        },
        Literal(path) {
          if (
            path.node.type === 'StringLiteral' &&
            idIncludeBumiFlow.includes(id) &&
            !listCss.includes(path.node.value)
          ) {
            listCss.push(path.node.value)
          }
        }
      })

      if (listCss.length > 0) {
        const cssFilePath = pathFile.resolve(__dirname, pathCss)

        const wrapperCss = listCss.join(' ').split(' ')

        const cssContent = constructorCss(wrapperCss)

        fs.writeFileSync(
          cssFilePath,
          `.${wrapperCss[0]} {${cssContent.join('')}}`
        )
      }
    }
  }
}
