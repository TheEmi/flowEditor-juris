const FlowRenderer = (props, context) => {
  const { getState, setState } = context;
  const connectionMode = getState("connectionMode", null);

  const onMouseMove = (e) => {
    const draggingNodeId = getState("draggingNodeId", null);
    if (!draggingNodeId) return;

    const dragOffset = getState("dragOffset", { x: 0, y: 0 });
    const canvasRect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;

    let node = JSON.parse(JSON.stringify(getState(`flowNodes.${draggingNodeId-1}`)));
    node.x = x;
    node.y = y;
    setState(`flowNodes.${draggingNodeId-1}`, node);
  };

  const onMouseUp = () => {
    const draggingNodeId = getState("draggingNodeId", null);
    if (draggingNodeId) {
      //commitFlowChange(context); // Save move to undo history
    }
    setState("draggingNodeId", null);
    setState("dragOffset", { x: 0, y: 0 });
  };

  const handleNodeClick = (node) => {
    const connections = getState("flowConnections", []);

    if (connectionMode?.from) {
      if (connectionMode.from !== node.id) {
        setState("flowConnections", [
          ...connections,
          { from: connectionMode.from, to: node.id },
        ]);
      }
      setState("connectionMode", null);
    } else {
      setState("selectedNode", node); // edit dialog
    }
  };

  const handleNodeRightClick = (e, node) => {
    e.preventDefault();
    handleStartConnection(node.id);
  };

  const handleStartConnection = (nodeId) => {
    setState("connectionMode", { from: nodeId });
  };

  const handleDeleteConnection = (conn) => {
    const connections = getState("flowConnections", []);
    setState(
      "flowConnections",
      connections.filter((c) => !(c.from === conn.from && c.to === conn.to))
    );
  };

  const onLineHover = (conn) => {
    setState("hoverLine", conn);
  };

  const onLineLeave = () => {
    setState("hoverLine", null);
  };

  const renderConnections = () => {
    const connections = getState("flowConnections", []);
    const hoverLine = getState("hoverLine", null);

    return connections.map((conn, index) => {
      const from = getState(`flowNodes.${conn.from - 1}`);
      const to = getState(`flowNodes.${conn.to - 1}`);
      if (!from || !to) return null;

      const x1 = from.x + 75;
      const y1 = from.y + 25;
      const x2 = to.x + 75;
      const y2 = to.y + 25;
      
      // Calculate midpoint for delete button
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      const isHovered = hoverLine && hoverLine.from === conn.from && hoverLine.to === conn.to;

      const connectionElements = [
        {
          line: {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            stroke: isHovered ? "#ff6b6b" : "#888",
            "stroke-width": isHovered ? 8 : 4,
            style: "cursor: pointer;"
          }
        },
        // Invisible circle at midpoint for easier hovering (always present)
        {
          circle: {
            cx: midX,
            cy: midY,
            r: 15,
            fill: "transparent",
            onmouseenter: () => onLineHover(conn),
            onmouseleave: () => onLineLeave(),
            style: "cursor: pointer;"
          }
        }
      ];

      // Add delete button if this line is hovered
      if (isHovered) {
        // Larger invisible area for easier interaction
        connectionElements.push({
          circle: {
            cx: midX,
            cy: midY,
            r: 20,
            fill: "transparent",
            onclick: (e) => {
              e.stopPropagation();
              handleDeleteConnection(conn);
            },
            onmouseenter: () => onLineHover(conn),
            onmouseleave: () => onLineLeave(),
            style: "cursor: pointer;"
          }
        });

        // Square delete button background
        connectionElements.push({
          rect: {
            x: midX - 10,
            y: midY - 10,
            width: 20,
            height: 20,
            fill: "#ff6b6b",
            stroke: "#fff",
            "stroke-width": 2,
            rx: 3,
            onclick: (e) => {
              e.stopPropagation();
              handleDeleteConnection(conn);
            },
            onmouseenter: () => onLineHover(conn),
            onmouseleave: () => onLineLeave(),
            style: "cursor: pointer;"
          }
        });

        // X symbol - properly centered
        connectionElements.push({
          text: {
            x: midX,
            y: midY,
            fill: "#fff",
            "font-size": "14",
            "font-weight": "bold",
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            style: "cursor: pointer; user-select: none; pointer-events: none;",
            text: "✕"
          }
        });
      }

      return {
        g: {
          children: connectionElements
        }
      };
    });
  };

  return {
    render: () => ({
      div: {
        class: "relative w-full h-screen bg-gray-50 overflow-hidden",
        onmousemove: onMouseMove,
        onmouseup: onMouseUp,
        children: () => {
          const nodes = getState("flowNodes", []);
          return [
            // SVG for connections
            {
              svg: {
                class: "absolute inset-0 w-full h-full",
                children: renderConnections,
              },
            },
            // Nodes
            ...nodes.map((node) => {
              const isConnecting = connectionMode?.from === node.id;
              return {
                div: {
                  class: () =>
                    `absolute w-40 p-2 rounded shadow cursor-move transition-all duration-150 ${
                      node.type === "type 1"
                        ? "bg-yellow-100"
                        : "bg-blue-100"
                    } ${isConnecting ? "ring-4 ring-pink-300" : ""}`,
                  style: () => {
                    return { 
                      left: getState(`flowNodes.${node.id-1}`).x + `px`, 
                      top: getState(`flowNodes.${node.id-1}`).y + `px` 
                    };
                  },
                  onmousedown: (e) => {
                    e.preventDefault();
                    const canvasRect =
                      e.currentTarget.offsetParent.getBoundingClientRect();
                    const nodeRect = e.currentTarget.getBoundingClientRect();
                    const offsetX = e.clientX - nodeRect.left;
                    const offsetY = e.clientY - nodeRect.top;

                    setState("draggingNodeId", node.id);
                    setState("dragOffset", { x: offsetX, y: offsetY });
                  },
                  onclick: () => handleNodeClick(node),
                  oncontextmenu: (e) => handleNodeRightClick(e, node),
                  children: [
                    {
                      h3: {
                        class: "font-bold text-sm",
                        text: node.label,
                      },
                    },
                    {
                      p: {
                        class: "text-xs text-gray-600",
                        text:
                          node.type === "type 1"
                            ? node.quantity
                            : `${node.action} • ${node.duration}`,
                      },
                    },
                    // Connection indicator when in connection mode
                    ...(isConnecting ? [{
                      div: {
                        class: "absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold",
                        text: "→"
                      }
                    }] : []),
                  ],
                },
              };
            }),
          ];
        },
      },
    }),
  };
};

export default FlowRenderer;