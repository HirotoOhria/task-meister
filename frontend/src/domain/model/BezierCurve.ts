import { horizontalMargin } from '~/components/organisms/BaseNode'
import { pathLineRatio } from '~/components/atoms/Path'

import Point, { newPoint, pointImpl } from '~/domain/model/Point'
import MBaseNode from '~/domain/model/MBaseNode'

type BezierCurve = {
  startPoint: Point
  firstControlPoint: Point
  secondControlPoint: Point
  endPoint: Point

  pathCommand(): string

  moveTo(): string

  curveTo(): string

  updatePoints(parentNode: MBaseNode, node: MBaseNode): void

  setPoints(
    startPointX: number,
    startPointY: number,
    controlPointX: number,
    endPointX: number,
    endPointY: number
  ): void
}

export const newBezierCurve = (): BezierCurve => {
  return {
    ...bezierCurveImpl,
    startPoint: newPoint(0, 0),
    firstControlPoint: newPoint(0, 0),
    secondControlPoint: newPoint(0, 0),
    endPoint: newPoint(0, 0),
  }
}

export const bezierCurveImpl: BezierCurve = {
  startPoint: pointImpl,
  firstControlPoint: pointImpl,
  secondControlPoint: pointImpl,
  endPoint: pointImpl,

  pathCommand(): string {
    return [this.moveTo(), this.curveTo()].join(' ')
  },

  moveTo(): string {
    return ['M', this.startPoint.toSpaceSeparated()].join(' ')
  },

  curveTo(): string {
    return [
      'C',
      this.firstControlPoint.toSpaceSeparated(),
      this.secondControlPoint.toSpaceSeparated(),
      this.endPoint.toSpaceSeparated(),
    ].join(' ')
  },

  updatePoints(parentNode: MBaseNode, node: MBaseNode) {
    const startPointX = parentNode.getTailBranchX()
    const startPointY = parentNode.getElementCenterY()
    const controlPointX = startPointX + (horizontalMargin * 2 * (1 - pathLineRatio)) / 2
    // Right is startPointX + (horizontalMargin * 2 * (1 - pathLineRatio))
    // But, end point x is head of Node because it is more beautiful.
    const endPointX = startPointX + horizontalMargin * 2
    const endPointY = node.getElementCenterY()

    this.setPoints(startPointX, startPointY, controlPointX, endPointX, endPointY)
  },

  setPoints(
    startPointX: number,
    startPointY: number,
    controlPointX: number,
    endPointX: number,
    endPointY: number
  ) {
    this.startPoint.x = startPointX
    this.startPoint.y = startPointY
    this.firstControlPoint.x = controlPointX
    this.firstControlPoint.y = startPointY
    this.secondControlPoint.x = controlPointX
    this.secondControlPoint.y = endPointY
    this.endPoint.x = endPointX
    this.endPoint.y = endPointY
  },
}
Object.freeze(bezierCurveImpl)

export default BezierCurve
