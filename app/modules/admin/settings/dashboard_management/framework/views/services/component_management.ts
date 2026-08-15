import { convert } from './helpers'

const attributes = {
  x: 'data-x',
  y: 'data-y',
  width: 'data-width',
  height: 'data-height',
}

export const componentManagement = {
  getComponentAttribute({ component, attribute }: any) {
    return Number.parseFloat(component.getAttribute(attribute))
  },
  getComponentCoord({ component }: any) {
    return {
      x:
        this.getComponentAttribute({
          component: component,
          attribute: attributes.x,
        }) || 0,
      y:
        this.getComponentAttribute({
          component: component,
          attribute: attributes.y,
        }) || 0,
      width:
        this.getComponentAttribute({
          component: component,
          attribute: attributes.width,
        }) || 0,
      height:
        this.getComponentAttribute({
          component: component,
          attribute: attributes.height,
        }) || 0,
    }
  },
  setComponentCoord({ component, x, y, width, height }: any) {
    component.setAttribute(attributes.x, x)
    component.setAttribute(attributes.y, y)
    component.setAttribute(attributes.width, width)
    component.setAttribute(attributes.height, height)
  },
  getNewComponentCoord({
    component,
    xIncrement,
    yIncrement,
    widthIncrement,
    heightIncrement,
  }: any) {
    const { x, y, width, height } = this.getComponentCoord({ component })
    const parentCompoment = component.parentNode.parentNode
    const parentComponentWidth = parentCompoment.offsetWidth
    const parentComponentHeight = parentCompoment.offsetHeight

    return {
      x:
        (x || 0) +
        convert.fromPxToPercentage({
          dataToConvert: xIncrement || 0,
          relatedTo: parentComponentWidth,
        }),
      y:
        (y || 0) +
        convert.fromPxToPercentage({
          dataToConvert: yIncrement || 0,
          relatedTo: parentComponentHeight,
        }),
      width:
        (width || 0) +
        convert.fromPxToPercentage({
          dataToConvert: widthIncrement || 0,
          relatedTo: parentComponentWidth,
        }),
      height:
        (height || 0) +
        convert.fromPxToPercentage({
          dataToConvert: heightIncrement || 0,
          relatedTo: parentComponentHeight,
        }),
    }
  },
}
