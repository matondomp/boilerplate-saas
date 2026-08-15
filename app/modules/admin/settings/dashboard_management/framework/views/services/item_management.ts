import * as interact from 'interactjs'
import { convert } from './helpers'
import { componentManagement } from './component_management.js'

export const itemManagement = {
  MINIMUN_WIDTH: 23,
  MINIMUN_HEIGHT: 17,

  getItemDefaultProps() {
    return {
      y: 0,
      x: 0,
      width: this.MINIMUN_WIDTH,
      height: this.MINIMUN_HEIGHT,
    }
  },

  resizeItem({ component, items, callback }: any) {
    interact.default(component).resizable({
      edges: {
        left: true,
        right: true,
        bottom: true,
        top: true,
      },

      listeners: {
        move: function (event: any) {
          // const parentCompoment = component.parentNode.parentNode
          // const parentComponentWidth = parentCompoment.offsetWidth
          // const parentComponentHeight = parentCompoment.offsetHeight

          const {
            width: lastWidth,
            height: lastHeight,
            x: lastX,
            y: lastY,
          } = componentManagement.getComponentCoord({ component })

          const {
            width: newWidth,
            height: newHeight,
            x: newX,
            y: newY,
          } = componentManagement.getNewComponentCoord({
            component,
            xIncrement: event.deltaRect.left,
            yIncrement: event.deltaRect.top,
            widthIncrement: event.deltaRect.width,
            heightIncrement: event.deltaRect.height,
          })

          const isOverlap = overlaping({
            itemToValidate: {
              x: newX,
              y: newY,
              width: newWidth,
              height: newHeight,
            },
            items,
          })

          const coord = {
            x: newX > 0 && !isOverlap.left ? newX : lastX,
            y: newY > 0 && !isOverlap.top ? newY : lastY,
            width: newWidth + lastX > 100 || isOverlap.right ? lastWidth : newWidth,
            height: isOverlap.bottom ? lastHeight : newHeight,
          }

          componentManagement.setComponentCoord({
            component,
            ...coord,
          })
          callback(coord)
        },
      },
    })
  },

  moveItem({ component, items, callback }: any) {
    interact.default(component).draggable({
      listeners: {
        move(event: any) {
          const {
            width,
            height,
            x: lastX,
            y: lastY,
          } = componentManagement.getComponentCoord({ component })

          const { x: newX, y: newY } = componentManagement.getNewComponentCoord({
            component,
            xIncrement: event.dx,
            yIncrement: event.dy,
          })

          const isXBetweenLimits = newX > 0 && newX + width < 100
          const yBetweenLimits = newY > 0

          const isOverlap = overlaping({
            itemToValidate: {
              x: newX,
              y: newY,
              width,
              height,
            },
            items,
          })

          const coord = {
            x: isXBetweenLimits && !(isOverlap.left || isOverlap.right) ? newX : lastX,
            y: yBetweenLimits && !(isOverlap.top || isOverlap.bottom) ? newY : lastY,
            width,
            height,
          }

          callback(coord)
        },
      },
    })
  },

  moveIsolatedItem({ dropzone, component, items, startCallback, moveCallback, endCallback }: any) {
    interact.default(component).draggable({
      listeners: {
        move(event: any) {
          const { x, y } = componentManagement.getComponentCoord({ component })

          const dropzoneWidth = dropzone.offsetWidth
          const dropzoneHeight = dropzone.offsetHeight

          const itemWidth = component.offsetWidth
          const itemHeight = component.offsetHeight
          const itemLeftPadding = 16

          const parentComponentDistanceFromTop =
            component.parentNode.parentNode.getBoundingClientRect().top
          const itemDistanceFromTop = component.getBoundingClientRect().top

          const yRelatedToDropZone = itemDistanceFromTop - parentComponentDistanceFromTop
          const xRelatedToDropzone = dropzoneWidth + (x + itemLeftPadding)

          const coord = {
            width: convert.fromPxToPercentage({
              dataToConvert: itemWidth,
              relatedTo: dropzoneWidth,
            }),
            height: convert.fromPxToPercentage({
              dataToConvert: itemHeight,
              relatedTo: dropzoneHeight,
            }),
            x: convert.fromPxToPercentage({
              dataToConvert: xRelatedToDropzone,
              relatedTo: dropzoneWidth,
            }),
            y: convert.fromPxToPercentage({
              dataToConvert: yRelatedToDropZone,
              relatedTo: dropzoneHeight,
            }),
          }

          moveCallback({
            x: x + event.dx,
            y: y + event.dy,
            coord,
            overlaping: overlaping({
              itemToValidate: coord,
              items,
            }),
          })
        },

        start() {
          startCallback()
        },

        end() {
          endCallback()
        },
      },
    })
  },

  addItemToDashboard({
    component,
    onItemDropCallback,
    onItemDragEnterCallback,
    onItemDragLeaveCallback,
  }: any) {
    interact.default(component).dropzone({
      ondrop: (event: any) =>
        onItemDropCallback({
          dashboard: event.target,
          item: event.relatedTarget,
        }),
      ondragenter: (event: any) =>
        onItemDragEnterCallback({
          dashboard: event.target,
          item: event.relatedTarget,
        }),
      ondragleave: (event: any) =>
        onItemDragLeaveCallback({
          dashboard: event.target,
          item: event.relatedTarget,
        }),
      overlap: 1,
    })
  },
}

const overlaping = ({ items, itemToValidate }: any) => {
  const xFinalItemToValidate = itemToValidate.width + itemToValidate.x
  const yFinalItemToValidate = itemToValidate.height + itemToValidate.y

  const overlap = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  }

  items.forEach((item: any) => {
    Object.assign(item, {
      x: Number.parseFloat(item.x),
      y: Number.parseFloat(item.y),
      width: Number.parseFloat(item.width),
      height: Number.parseFloat(item.height),
    })

    const xFinal = item.width + item.x
    const yFinal = item.height + item.y

    const isItemToValidateInitialYBetweenItemY =
      itemToValidate.y >= item.y && itemToValidate.y <= yFinal
    const isItemToValidateFinalYBetweenItemY =
      yFinalItemToValidate >= item.y && yFinalItemToValidate <= yFinal
    const isItemToValidateFinalYGreaterThanItemFinalY = yFinalItemToValidate >= yFinal
    // const isItemToValidateInitialYGreaterThanItemInitialY = itemToValidate.y >= item.y
    const isItemToValidateInitialYLessThanItemInitialY = itemToValidate.y <= item.y
    // const isItemToValidateFinalYLessThanItemFinalY = yFinalItemToValidate <= yFinal

    const isItemToValidateInitialXBetweenItemX =
      itemToValidate.x >= item.x && itemToValidate.x <= xFinal
    const isItemToValidateFinalXBetweenItemX =
      xFinalItemToValidate >= item.x && xFinalItemToValidate <= xFinal
    const isItemToValidateFinalXGreaterThanItemFinalX = xFinalItemToValidate >= xFinal
    // const isItemToValidateInitialXGreaterThanItemInitialX = itemToValidate.x >= item.x
    const isItemToValidateInitialXLessThanItemInitialX = itemToValidate.x <= item.x
    // const isItemToValidateFinalXLessThanItemFinalX = xFinalItemToValidate <= xFinal

    const horizontalOverlap =
      isItemToValidateInitialXBetweenItemX ||
      isItemToValidateFinalXBetweenItemX ||
      (isItemToValidateInitialXLessThanItemInitialX && isItemToValidateFinalXGreaterThanItemFinalX)

    const verticalOverlap =
      isItemToValidateInitialYBetweenItemY ||
      isItemToValidateFinalYBetweenItemY ||
      (isItemToValidateInitialYLessThanItemInitialY && isItemToValidateFinalYGreaterThanItemFinalY)

    if (isItemToValidateInitialYBetweenItemY && horizontalOverlap) {
      overlap.top = true
    }

    if (isItemToValidateFinalXBetweenItemX && verticalOverlap) {
      overlap.right = true
    }

    if (isItemToValidateFinalYBetweenItemY && horizontalOverlap) {
      overlap.bottom = true
    }

    if (isItemToValidateInitialXBetweenItemX && verticalOverlap) {
      overlap.left = true
    }
  })

  return Object.assign(overlap, {
    some: overlap.bottom || overlap.left || overlap.right || overlap.top,
  })
}
