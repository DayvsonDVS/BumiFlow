type Prop = {
  property: string
  value: string
}

const prop: Prop[] = [
  { property: 'text-white', value: 'color:#fff;' },
  { property: 'text-black', value: 'color:black;' },
  { property: 'text-red', value: 'color:red;' },
  { property: 'border-rounded', value: 'border-radius:100px;' },
  { property: 'background-yellow', value: 'background: yellow;' }
]

export function constructorCss(declaration: string[]) {
  const newDeclaration = declaration.map((css) => {
    if (css.includes('hover:')) {
      return hasHover(css)
    } else {
      return findStatement(css.split(' '))
    }
  })

  return newDeclaration.filter((value) => value !== '')
}

function hasHover(hover: string) {
  const hoverDeclaration: String[] = []
  hoverDeclaration.push(' &:hover{')
  prop.find((value) => {
    if (hover.includes(value.property)) {
      hoverDeclaration.push(value.value)
    }
  })
  hoverDeclaration.push('}')

  return hoverDeclaration.join(' ')
}

function findStatement(declaration: string[]) {
  const basicDeclaration: string[] = []
  declaration.map((itemCss) => {
    prop.map((itemProp) => {
      if (itemProp.property === itemCss) {
        basicDeclaration.push(itemProp.value)
      }
    })
  })
  return basicDeclaration.join(' ')
}
