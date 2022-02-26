import ArrowKey, { arrowKeys } from '~/enum/ArrowKeys'
import MindMapData from '~/domain/model/MindMapData'
import { assertNever, newNotFoundNodeErr } from '~/util/ExceptionUtil'
import MRootNode, { rootNodeType } from '~/domain/model/MRootNode'
import MNode from '~/domain/model/MNode'

class ArrowKeyUseCase {
  handleArrowKeyDown(
    mindMapData: MindMapData,
    arrowKey: ArrowKey,
    selectedNode: MRootNode | MNode
  ): MindMapData {
    switch (arrowKey) {
      case arrowKeys.Up:
        return this.selectTopNode(mindMapData, selectedNode)
      case arrowKeys.Down:
        return this.selectBottomNode(mindMapData, selectedNode)
      case arrowKeys.Right:
        return this.selectTailNode(mindMapData, selectedNode)
      case arrowKeys.Left:
        return this.selectHeadNode(mindMapData, selectedNode)
      default:
        assertNever(arrowKey, `Not defined arrow key. arrow key = ${arrowKey}`)
        return mindMapData
    }
  }

  selectTopNode(mindMapData: MindMapData, selectedNode: MRootNode | MNode): MindMapData {
    if (mindMapData.rootNode.isSelected) {
      return mindMapData
    }

    mindMapData.deselectNode()

    const topNode = mindMapData.rightMap.children.recursively
      .findChildrenContainsId(selectedNode.id)
      ?.findTopNodeOf(selectedNode.id)
    if (!topNode) {
      throw newNotFoundNodeErr(selectedNode.id)
    }

    topNode.isSelected = true
    return mindMapData
  }

  selectBottomNode(mindMapData: MindMapData, selectedNode: MRootNode | MNode): MindMapData {
    mindMapData.deselectNode()

    const bottomNode = mindMapData.rightMap.children.recursively
      .findChildrenContainsId(selectedNode.id)
      ?.findBottomNodeOf(selectedNode.id)
    if (!bottomNode) {
      throw newNotFoundNodeErr(selectedNode.id)
    }

    bottomNode.isSelected = true
    return mindMapData
  }

  selectHeadNode(mindMapData: MindMapData, selectedNode: MRootNode | MNode): MindMapData {
    if (mindMapData.rootNode.isSelected) {
      return mindMapData
    }

    const headNode = mindMapData.findHeadNode(selectedNode.id)
    if (!headNode) {
      return mindMapData
    }

    mindMapData.deselectNode()
    headNode.isSelected = true

    return mindMapData
  }

  selectTailNode(mindMapData: MindMapData, selectedNode: MRootNode | MNode): MindMapData {
    if (selectedNode.type === rootNodeType) {
      mindMapData.selectTail()
      return mindMapData
    }
    if (selectedNode.group.isHidden) {
      return mindMapData
    }

    const tailNode = mindMapData.rightMap.children.recursively
      .findChildrenContainsId(selectedNode.id)
      ?.findTailNodeOf(selectedNode.id)
    if (!tailNode) {
      return mindMapData
    }

    mindMapData.deselectNode()
    tailNode.isSelected = true

    return mindMapData
  }
}

export default ArrowKeyUseCase
