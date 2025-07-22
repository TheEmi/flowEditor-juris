const FlowRenderer = (props, context) => {
  const { getState, setState } = context;
  const connectionMode = getState("connectionMode", null);

  const onMouseMove = (e) => {
    const draggingNodeId = getState("draggingNodeId", null);
    if (!draggingNodeId) return;

    const nodes = getState("flowNodes", []);
    const nodeIndex = nodes.findIndex(n => n.id === draggingNodeId);
    if (nodeIndex === -1) return;

    const dragOffset = getState("dragOffset", { x: 0, y: 0 });
    const canvasRect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;

    let node = JSON.parse(JSON.stringify(nodes[nodeIndex]));
    node.x = x;
    node.y = y;
    setState(`flowNodes.${nodeIndex}`, node);
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

  const handleDeleteNode = (nodeId) => {
    if (confirm("🗑️ Are you sure you want to delete this node?")) {
      const nodes = getState("flowNodes", []);
      const connections = getState("flowConnections", []);
      
      // Remove node
      const updatedNodes = nodes.filter(n => n.id !== nodeId);
      setState("flowNodes", updatedNodes);
      
      // Remove connections involving this node
      const updatedConnections = connections.filter(c => c.from !== nodeId && c.to !== nodeId);
      setState("flowConnections", updatedConnections);
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
    const nodes = getState("flowNodes", []);
    const hoverLine = getState("hoverLine", null);

    return connections.map((conn, index) => {
      const from = nodes.find(n => n.id === conn.from);
      const to = nodes.find(n => n.id === conn.to);
      if (!from || !to) return null;

      const x1 = from.x + 96; // Center of wider node
      const y1 = from.y + 40; // Center of taller node
      const x2 = to.x + 96;
      const y2 = to.y + 40;
      
      // Calculate midpoint for delete button
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      const isHovered = hoverLine && hoverLine.from === conn.from && hoverLine.to === conn.to;

      // Create curved path
      const dx = x2 - x1;
      const dy = y2 - y1;
      const curve = Math.abs(dx) * 0.3;
      const pathData = `M ${x1} ${y1} C ${x1 + curve} ${y1}, ${x2 - curve} ${y2}, ${x2} ${y2}`;

      const connectionElements = [
        {
          path: {
            d: pathData,
            stroke: isHovered ? "#e11d48" : "#8b5cf6",
            "stroke-width": isHovered ? 6 : 3,
            fill: "none",
            "stroke-linecap": "round",
            style: "cursor: pointer; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));"
          }
        },
        // Arrow head
        {
          polygon: {
            points: `${x2-8},${y2-4} ${x2},${y2} ${x2-8},${y2+4}`,
            fill: isHovered ? "#e11d48" : "#8b5cf6",
            stroke: "none"
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
        class: "relative w-full h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden",
        onmousemove: onMouseMove,
        onmouseup: onMouseUp,
        children: () => {
          const nodes = getState("flowNodes", []);
          return [
            // Background pattern
            {
              div: {
                class: "absolute inset-0 opacity-30",
                style: {
                  backgroundImage: "radial-gradient(circle at 25px 25px, lightgray 2px, transparent 0)",
                  backgroundSize: "50px 50px"
                }
              }
            },
            // SVG for connections
            {
              svg: {
                class: "absolute inset-0 w-full h-full",
                children: renderConnections,
              },
            },
            // Connection mode overlay
            ...(connectionMode ? [{
              div: {
                class: "absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg z-10",
                children: [
                  {
                    div: {
                      class: "flex items-center gap-2",
                      children: [
                        { span: { class: "text-lg", text: "🔗" } },
                        { span: { class: "font-semibold", text: "Connection Mode" } },
                        { span: { class: "text-sm opacity-80", text: "Click another node to connect" } }
                      ]
                    }
                  }
                ]
              }
            }] : []),
            // Nodes
            ...nodes.map((node, index) => {
              const isConnecting = connectionMode?.from === node.id;
              const nodeData = getState(`flowNodes.${index}`);
              const isIngredient = node.type === "ingredient" || node.type === "type 1";
              
              return {
                div: {
                  class: () => {
                    const baseClasses = "group absolute w-48 p-4 rounded-2xl shadow-xl cursor-move transition-all duration-300 transform hover:scale-105 border-2";
                    const typeClasses = isIngredient 
                      ? "bg-gradient-to-br from-amber-100 to-orange-200 border-amber-300 hover:from-amber-200 hover:to-orange-300" 
                      : "bg-gradient-to-br from-blue-100 to-cyan-200 border-blue-300 hover:from-blue-200 hover:to-cyan-300";
                    const connectingClasses = isConnecting ? "ring-4 ring-purple-400 ring-opacity-75 scale-110" : "";
                    
                    return `${baseClasses} ${typeClasses} ${connectingClasses}`;
                  },
                  style: () => ({
                    left: nodeData.x + "px",
                    top: nodeData.y + "px",
                    zIndex: isConnecting ? 20 : 10
                  }),
                  onmousedown: (e) => {
                    e.preventDefault();
                    const nodeRect = e.currentTarget.getBoundingClientRect();
                    const offsetX = e.clientX - nodeRect.left;
                    const offsetY = e.clientY - nodeRect.top;

                    setState("draggingNodeId", node.id);
                    setState("dragOffset", { x: offsetX, y: offsetY });
                  },
                  onclick: () => handleNodeClick(node),
                  oncontextmenu: (e) => handleNodeRightClick(e, node),
                  children: [
                    // Node header with icon
                    {
                      div: {
                        class: "flex items-center gap-2 mb-2",
                        children: [
                          {
                            span: {
                              class: "text-2xl",
                              text: node.icon || (isIngredient ? "🥄" : "⚡")
                            }
                          },
                          {
                            h3: {
                              class: "font-bold text-sm text-gray-800 flex-1",
                              text: node.label.replace(/^[^\s]+\s/, '') || node.label,
                            }
                          }
                        ]
                      }
                    },
                    // Node details
                    {
                      div: {
                        class: "space-y-1",
                        children: [
                          ...(isIngredient ? [
                            {
                              div: {
                                class: "flex items-center gap-2",
                                children: [
                                  { span: { class: "text-xs text-amber-600", text: "📏" } },
                                  { span: { class: "text-xs text-gray-600", text: node.quantity } }
                                ]
                              }
                            }
                          ] : [
                            {
                              div: {
                                class: "flex items-center gap-2",
                                children: [
                                  { span: { class: "text-xs text-blue-600", text: "⚡" } },
                                  { span: { class: "text-xs text-gray-600", text: node.action } }
                                ]
                              }
                            },
                            {
                              div: {
                                class: "flex items-center gap-2",
                                children: [
                                  { span: { class: "text-xs text-blue-600", text: "⏱️" } },
                                  { span: { class: "text-xs text-gray-600", text: node.duration } }
                                ]
                              }
                            }
                          ])
                        ]
                      }
                    },
                    // Connection indicators
                    ...(isConnecting ? [{
                      div: {
                        class: "absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse",
                        text: "🔗"
                      }
                    }] : []),
                    // Delete button
                    {
                      button: {
                        class: "absolute -top-2 -left-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200",
                        text: "✕",
                        onclick: (e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }
                      }
                    },
                    // Hover actions
                    {
                      div: {
                        class: "absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity bg-white rounded-full shadow-lg px-3 py-1",
                        children: [
                          {
                            div: {
                              class: "flex items-center gap-2 text-xs text-gray-600",
                              children: [
                                { span: { text: "💭" } },
                                { span: { text: "Click to edit • Right-click to connect" } }
                              ]
                            }
                          }
                        ]
                      }
                    }
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