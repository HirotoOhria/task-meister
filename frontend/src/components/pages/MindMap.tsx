import React, { DragEvent, FC, useEffect, useRef, useState } from "react";
import Origin, { OriginHandles } from "~/components/organisms/Origin";
import Node from "~/components/organisms/Node";
import Nodes from "~/components/organisms/Nodes";
import MindMapData, { newMindMapData } from "~/domain/model/MindMapData";
import { newRightNodesData } from "~/domain/model/RightMapData";
import { newNodeData } from "~/domain/model/NodeData";
import { newGroup } from "~/domain/model/Group";
import { newChildren } from "~/domain/model/Children";
import { newDropPosition } from "~/domain/model/DropPosition";
import { newShortcutController } from "~/domain/model/ShortcutController";
import { getShortcut } from "~/enum/Shortcut";

const node1_2_1 = newNodeData(
  "id1-2-1 of right",
  "id1-2-1 of right",
  newGroup(),
  newChildren([])
);
const node1_2_2 = newNodeData(
  "id1-2−2 of right",
  "id1-2-2 of right",
  newGroup(),
  newChildren([])
);
const node1_2_3 = newNodeData(
  "id1-2−3 of right",
  "id1-2-3 of right",
  newGroup(),
  newChildren([])
);

const node1_1 = newNodeData(
  "id1-1 of right",
  "id1-1 of right",
  newGroup(),
  newChildren([])
);
const node1_2 = newNodeData(
  "id1-2 of right",
  "id1-2 of right",
  newGroup(),
  newChildren([node1_2_1, node1_2_2, node1_2_3])
);
const node1_3 = newNodeData(
  "id1-3 of right",
  "id1-3 of right",
  newGroup(),
  newChildren([])
);

const node1 = newNodeData(
  "id1 of right",
  "id1 of right",
  newGroup(),
  newChildren([node1_1, node1_2, node1_3])
);
const node2 = newNodeData(
  "id2 of right",
  "id2 of right",
  newGroup(),
  newChildren([])
);

const mindMapDataObj = newMindMapData(
  newNodeData("rootNode", "rootNode", newGroup(), newChildren([])),
  newRightNodesData(newChildren([node1, node2])),
  newRightNodesData(newChildren([]))
);

const shortcutController = newShortcutController(mindMapDataObj);

const MindMap: FC = () => {
  const originElement = useRef<OriginHandles>(null);
  const [mindMapData, setMindMapData] = useState<MindMapData>(mindMapDataObj);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");

  const setNodeDataText = (id: string, text: string) => {
    mindMapData.setNodeTextById(id, text);
    setMindMapData({ ...mindMapData });
  };

  const handleNodeTextChanges = (id: string, width: number, height: number) => {
    mindMapData.handleTextChanges(id, width, height);
    setMindMapData({ ...mindMapData });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (originElement.current == null) return;

    const nodeId = e.dataTransfer!.getData("text/plain");
    const originPoint = originElement.current.getPoint();
    const dropPosition = newDropPosition(e, originPoint!);

    mindMapData.handleDropNode(nodeId, dropPosition);
    setMindMapData({ ...mindMapData });
  };

  const handleKeypress = (e: KeyboardEvent) => {
    const shortcut = getShortcut(e.key);
    if (shortcut == null) return;

    // TODO Take id from global store.
    shortcutController.handleKeypress(shortcut, selectedNodeId);
    setMindMapData({ ...mindMapData });
  };

  const handleKeypressEventListerEffect = (): (() => void) => {
    document.body.addEventListener("keypress", handleKeypress);
    return () => document.body.removeEventListener("keypress", handleKeypress);
  };

  useEffect(handleKeypressEventListerEffect, [handleKeypress]);

  // TODO Why is display smaller on monitor?
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ width: window.innerWidth, height: window.innerHeight }}
    >
      <Origin ref={originElement}>
        {/* TODO Make tail of root node to draggable */}
        <Node
          nodeData={mindMapData.rootNodeData}
          setSelectedNodeId={setSelectedNodeId}
          setNodeDataText={setNodeDataText}
          handleNodeTextChanges={handleNodeTextChanges}
        />
        <Nodes
          nodes={mindMapData.rightMapData.nodes}
          setSelectedNodeId={setSelectedNodeId}
          setNodeDataText={setNodeDataText}
          handleNodeTextChanges={handleNodeTextChanges}
        />
      </Origin>
    </div>
  );
};

export default MindMap;
