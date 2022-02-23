import _ from 'lodash'

import NodeData, { nodeDataImpl } from '~/domain/model/NodeData'
import Group, { groupImpl, newGroup } from '~/domain/model/Group'
import Children, { childrenImpl, newChildren } from '~/domain/model/Children'
import NodeAccessory, { newNodeAccessory, nodeAccessoryImpl } from '~/domain/model/NodeAccessory'

// type to distinguish from RootNode.
const nodeType = 'node'

type Node = NodeData & {
  type: typeof nodeType
  group: Group
  children: Children
  accessory: NodeAccessory

  hasNodeById(childId: string): boolean

  updateTop(): void

  setLeft(parentLeft: number, parentWidth: number): void

  toggleCollapse(): void
}

export const newNode = (id: string, text: string, group: Group, children: Children): Node => {
  return {
    ...nodeImpl,
    id: id,
    text: text,
    group: group,
    children: children,
    accessory: newNodeAccessory(),
  }
}

export const newAddNode = (left: number): Node => {
  return {
    ...nodeImpl,
    id: _.uniqueId('node_'),
    text: '',
    left: left,
    isInputting: true,
    isSelected: true,
    group: newGroup(),
    children: newChildren([]),
    accessory: newNodeAccessory(),
  }
}

// Data of node to be placed on MindMap.
// NodeData consists of a node and children's nodes.
// Whole group is called a group.
// NodeData is not group, but holds value of group to calculate placement.
export const nodeImpl: Node = {
  ...nodeDataImpl,

  type: nodeType,

  group: groupImpl,

  // children nodes of this node
  children: childrenImpl,

  accessory: nodeAccessoryImpl,

  hasNodeById(childId: string): boolean {
    return !!this.children.recursively.findNodeById(childId)
  },

  // Update node top of self
  updateTop() {
    const fromGroupTop =
      this.children.height < this.height ? 0 : (this.children.height - this.height) / 2
    this.top = this.group.top + fromGroupTop
  },

  setLeft(parentLeft: number, parentWidth: number) {
    this.left = parentLeft + parentWidth
  },

  toggleCollapse() {
    this.group.isHidden = !this.group.isHidden
    this.children.recursively.toggleHidden()
  },
}

Object.freeze(nodeImpl)

export default Node
