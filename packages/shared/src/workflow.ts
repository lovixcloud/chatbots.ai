import { WorkflowExecutionResult, WorkflowNodeType } from './types.js';

export interface NodeData {
  id: string;
  nodeType: WorkflowNodeType;
  label: string;
  content?: string | null;
  variableName?: string | null;
  options?: any;
  config?: any;
}

export interface EdgeData {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  condition?: string | null;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  nodes: NodeData[];
  edges: EdgeData[];
}

export function executeWorkflowStep(
  workflow: WorkflowDefinition,
  currentNodeId: string | null,
  userInput: string | null,
  contextVariables: Record<string, string>
): WorkflowExecutionResult {
  const nodesMap = new Map<string, NodeData>(workflow.nodes.map((n) => [n.id, n]));
  const edgesFromSource = new Map<string, EdgeData[]>();

  for (const edge of workflow.edges) {
    const existing = edgesFromSource.get(edge.sourceNodeId) || [];
    existing.push(edge);
    edgesFromSource.set(edge.sourceNodeId, existing);
  }

  let activeNode: NodeData | undefined;

  if (!currentNodeId) {
    // Start node is the node with no incoming edge or the first MESSAGE node
    const targetNodeIds = new Set(workflow.edges.map((e) => e.targetNodeId));
    activeNode = workflow.nodes.find((n) => !targetNodeIds.has(n.id)) || workflow.nodes[0];
  } else {
    activeNode = nodesMap.get(currentNodeId);
  }

  if (!activeNode) {
    return {
      currentNodeId: '',
      nodeType: 'END',
      requiresInput: false,
      isCompleted: true,
      nextMessage: 'Workflow completed.'
    };
  }

  // If active node required input and userInput is provided, capture variable and transition
  if (userInput && activeNode.variableName) {
    contextVariables[activeNode.variableName] = userInput.trim();
  }

  // Find next transition node if userInput is provided or activeNode is non-input
  let nextNodeId: string | null = null;
  const outgoingEdges = edgesFromSource.get(activeNode.id) || [];

  if (outgoingEdges.length === 1) {
    nextNodeId = outgoingEdges[0].targetNodeId;
  } else if (outgoingEdges.length > 1 && userInput) {
    // Match edge condition with user choice
    const matchedEdge = outgoingEdges.find(
      (e) => e.condition && e.condition.toLowerCase() === userInput.trim().toLowerCase()
    );
    nextNodeId = matchedEdge ? matchedEdge.targetNodeId : outgoingEdges[0].targetNodeId;
  }

  // If userInput was processed for a variable or transition, advance to next node
  if (userInput && nextNodeId) {
    const nextNode = nodesMap.get(nextNodeId);
    if (nextNode) {
      activeNode = nextNode;
    }
  }

  const isInputNode = [
    'QUESTION',
    'COLLECT_TEXT',
    'COLLECT_EMAIL',
    'COLLECT_PHONE',
    'COLLECT_ORDER_ID',
    'MULTIPLE_CHOICE'
  ].includes(activeNode.nodeType);

  let options: string[] | undefined;
  if (activeNode.options) {
    if (typeof activeNode.options === 'string') {
      try {
        options = JSON.parse(activeNode.options);
      } catch {
        options = undefined;
      }
    } else if (Array.isArray(activeNode.options)) {
      options = activeNode.options;
    }
  }

  return {
    currentNodeId: activeNode.id,
    nodeType: activeNode.nodeType,
    nextMessage: activeNode.content || undefined,
    requiresInput: isInputNode,
    inputVariable: activeNode.variableName || undefined,
    quickReplies: options ? options.map((opt) => ({ label: opt, payload: opt })) : undefined,
    isCompleted: activeNode.nodeType === 'END'
  };
}
