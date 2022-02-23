import MindMapData from '~/domain/model/MindMapData'
import DropPosition from '~/domain/model/DropPosition'

class MindMapUseCase {
  public init(mindMapData: MindMapData): MindMapData {
    mindMapData.setNodeSize()

    mindMapData.updateRootNodePlacement()
    if (mindMapData.rightMap.children.nodes.length !== 0) {
      const firstNode = mindMapData.rightMap.children.nodes[0]
      mindMapData.rightMap.updatePlacement(firstNode.id)
    }
    mindMapData.updateNonNodePlacement()

    return mindMapData
  }

  public setNodeIsInputting(
    mindMapData: MindMapData,
    id: string,
    isInputting: boolean
  ): MindMapData {
    const targetNode = mindMapData.findNodeById(id)
    if (!targetNode) {
      throw new Error(`Can not found Node by id. id = ${id}`)
    }
    targetNode.isInputting = isInputting

    return mindMapData
  }

  public selectNode(mindMapData: MindMapData, selectedNodeId: string): MindMapData {
    mindMapData.deselectNode()

    const selectedNode = mindMapData.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw new Error(`Can not found selected node by id. id = ${selectedNodeId}`)
    }
    selectedNode.isSelected = true

    return mindMapData
  }

  public processNodeTextChanges(mindMapData: MindMapData, id: string, text: string): MindMapData {
    id === mindMapData.rootNode.id
      ? (mindMapData.rootNode.text = text)
      : mindMapData.rightMap.setTextById(id, text)

    mindMapData.updateAllPlacement(id)

    return mindMapData
  }

  public toggleCollapse(mindMapData: MindMapData, selectedNodeId: string) {
    if (mindMapData.rootNode.isSelected) {
      return mindMapData
    }

    mindMapData.rightMap.collapseNodes(selectedNodeId)
    mindMapData.updateNonNodePlacement()

    return mindMapData
  }

  public updateRelationshipLine(mindMapData: MindMapData, id: string, text: string): MindMapData {
    // TODO Optimize in following cases
    //   - change text
    //   - new line
    //   - add node
    mindMapData.updateRelationshipLine()
    return mindMapData
  }

  public updateAllRelationshipLine(mindMapData: MindMapData): MindMapData {
    mindMapData.updateRelationshipLine()
    return mindMapData
  }

  public processNodeDrop(
    mindMapData: MindMapData,
    movedNodeId: string,
    dropPosition: DropPosition
  ): MindMapData {
    if (mindMapData.rootNode.onTail(dropPosition.left)) {
      mindMapData.processNodeDropToRight(movedNodeId)
      return mindMapData
    }

    mindMapData.rightMap.processNodeDrop(movedNodeId, dropPosition)
    mindMapData.updateNonNodePlacement()

    return mindMapData
  }
}

export default MindMapUseCase
