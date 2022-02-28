import RightMap, { rightMapImpl } from '~/domain/model/RightMap'
import MRootNode, { rootNodeImpl } from '~/domain/model/MRootNode'
import MNode from '~/domain/model/MNode'

type MindMapData = {
  rootNode: MRootNode
  rightMap: RightMap
  leftMap: RightMap

  isInputting(): boolean

  isFirstLayerNode(id: string): boolean

  findNodeById(id: string): MRootNode | MNode | undefined

  findNodeIsSelected(): MRootNode | MNode | undefined

  findHeadNode(id: string): MRootNode | MNode | undefined

  setNodeSize(): void

  deselectNode(): void

  selectTail(): void

  updateAllPlacement(id: string): void

  updateNodePlacement(id: string): void

  updateRootNodePlacement(): void

  updateAccessoryPlacement(): void

  processNodeDropToRight(movedNodeId: string): void
}

export const newMindMapData = (
  rootNode: MRootNode,
  rightMap: RightMap,
  leftMap: RightMap
): MindMapData => {
  return {
    ...mindMapDataImpl,
    rootNode: rootNode,
    rightMap: rightMap,
    leftMap: leftMap,
  }
}

export const mindMapDataImpl: MindMapData = {
  rootNode: rootNodeImpl,
  rightMap: rightMapImpl,
  leftMap: rightMapImpl,

  isInputting(): boolean {
    return this.rightMap.children.recursively.isInputting() || this.rootNode.isInputting
  },

  isFirstLayerNode(id: string): boolean {
    return !!this.rightMap.children.nodes.find((node) => node.id === id)
  },

  findNodeById(id: string): MRootNode | MNode | undefined {
    if (this.rootNode.id === id) {
      return this.rootNode
    }

    return this.rightMap.children.recursively.findNodeById(id)
  },

  findNodeIsSelected(): MRootNode | MNode | undefined {
    if (this.rootNode.isSelected) {
      return this.rootNode
    }

    return this.rightMap.children.recursively.findNodeIsSelected()
  },

  findHeadNode(id: string): MRootNode | MNode | undefined {
    if (this.isFirstLayerNode(id)) {
      return this.rootNode
    }

    return this.rightMap.children.recursively.findHeadNode(id)
  },

  setNodeSize() {
    this.rootNode.setSize()
    this.rightMap.children.recursively.setNodeSize()
  },

  deselectNode() {
    if (this.rootNode.isSelected) {
      this.rootNode.isSelected = false
      return
    }

    this.rightMap.children.recursively.deselectNode()
  },

  selectTail() {
    if (!this.rightMap.children.nodes[0]) return

    this.deselectNode()
    this.rightMap.children.nodes[0].isSelected = true
  },

  updateAllPlacement(id: string) {
    this.updateNodePlacement(id)
    this.updateAccessoryPlacement()
  },

  updateNodePlacement(id: string) {
    if (id === this.rootNode.id) {
      this.updateRootNodePlacement()
      return
    }

    this.rightMap.updateNodePlacement(id)
  },

  updateRootNodePlacement() {
    this.rootNode.updatePlacement()
    this.rightMap.children.recursively.setNodeLeft(this.rootNode.left, this.rootNode.width)
  },

  updateAccessoryPlacement() {
    this.rootNode.updatePathLine()
    this.rightMap.children.recursively.updateAccessoryPlacement(this.rootNode)
  },

  processNodeDropToRight(movedNodeId: string) {
    const movedNode = this.rightMap.children.recursively.removeNodeById(movedNodeId)
    this.rightMap.children.nodes.push(movedNode)

    const newLeft = this.rootNode.width / 2
    this.rightMap.updateNodesLateral(movedNode, newLeft)
    this.rightMap.updateNodesVertical(movedNode)
  },
}

Object.freeze(mindMapDataImpl)

export default MindMapData
