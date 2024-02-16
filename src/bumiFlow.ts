type StyleOptions = {
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

type styleFunction = {
  base(value: string): styleFunction
  hover(value: string): styleFunction
  dark(value: string): styleFunction
  disabled(value: string): styleFunction
  case(
    size: string,
    styles: Record<string, Record<string, string>>
  ): styleFunction
  if(condition: boolean, styles: Record<string, string>): styleFunction
  breakpoints(values: Record<string, string>): styleFunction
  build(): string
}

import { constructorCss } from './constructorCss'

class StyleBuilder implements styleFunction {
  private element: string
  private styles: string[] = []

  constructor(element: string) {
    this.element = element
  }

  base(value: string): styleFunction {
    const auxValue = value.split(' ')
    this.styles = auxValue
    return this
  }

  hover(value: string): styleFunction {
    this.styles.push(value)
    return this
  }

  dark(value: string): styleFunction {
    this.styles.push(`dark-${value}`)
    return this
  }

  disabled(value: string): styleFunction {
    this.styles.push(`disabled-${value}`)
    return this
  }

  case(
    size: string,
    styles: Record<string, Record<string, string>>
  ): styleFunction {
    if (styles[size]) {
      this.styles.push(styles[size].base)
    }
    return this
  }

  if(condition: boolean, styles: Record<string, string>): styleFunction {
    if (condition) {
      this.styles.push(styles.base)
      if (styles.hover) {
        this.styles.push(`${styles.hover}`)
      }
    }
    return this
  }

  breakpoints(values: Record<string, string>): styleFunction {
    for (const key in values) {
      this.styles.push(`@media (${key}): { ${values[key]} }`)
    }
    return this
  }

  build(): string {
    // const className = `${this.element}__${this.generateRandomString()}`
    // const className = `${this.element}__${this.generateRandomString()}`
    // this.addNewClass(className, this.styles)

    // return className

    return this.element
  }

  private generateRandomString() {
    return Math.random().toString(36).substring(7)
  }

  private addNewClass(className: string, styles: string[]) {
    // // Create a new style element
    // var style = document.createElement('style')

    // // Append the style element to the head of the document
    // document.head.appendChild(style)

    // // Reference to the stylesheet
    // var sheet = style.sheet

    const newStylesCss = constructorCss(styles)

    // Define the new class styles
    var newClassStyles = `.${className} { ${newStylesCss.join(' ')} }`

    // Add the new class styles to the stylesheet
    // style.textContent = newClassStyles

    //Add the new class styles hidden dom
    // sheet?.insertRule(newClassStyles, 0)

    // VitePluginBumiFlow(newClassStyles)

    return newClassStyles
  }
}

export const bumiFlow = (element: string): StyleBuilder =>
  new StyleBuilder(element)

export const props: StyleOptions = {
  size: 'md',
  loading: false
}
