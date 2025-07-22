const FlowRenderer = (props, context) => {
  const { getState, setState } = context;
  const connectionMode = getState("connectionMode", null);

  const onMouseMove = (e) => {
    const draggingNodeId = getState("draggingNodeId", null);
    if (!draggingNodeId) return;

    // Throttle updates to improve performance
    const now = Date.now();
    const lastUpdate = getState("lastMoveUpdate", 0);
    if (now - lastUpdate < 16) return; // ~60fps max
    setState("lastMoveUpdate", now);

    const nodes = getState("flowNodes", []);
    const nodeIndex = nodes.findIndex(n => n.id === draggingNodeId);
    if (nodeIndex === -1) return;

    const dragOffset = getState("dragOffset", { x: 0, y: 0 });
    const canvasRect = e.currentTarget.getBoundingClientRect();

    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    const x = clientX - canvasRect.left - dragOffset.x;
    const y = clientY - canvasRect.top - dragOffset.y;

    // Update only the specific node position directly
    const updatedNodes = [...nodes];
    updatedNodes[nodeIndex] = { ...updatedNodes[nodeIndex], x, y };
    setState("flowNodes", updatedNodes);
  };

  const onMouseUp = () => {
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
      setState("selectedNode", node);
    }
  };

  const handleDeleteNode = (nodeId) => {
    setState("nodeToDelete", nodeId);
  };

  const confirmDeleteNode = (nodeId) => {
    const nodes = getState("flowNodes", []);
    const connections = getState("flowConnections", []);
    
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    setState("flowNodes", updatedNodes);
    
    const updatedConnections = connections.filter(c => c.from !== nodeId && c.to !== nodeId);
    setState("flowConnections", updatedConnections);
    
    setState("nodeToDelete", null);
    setState("toastMessage", "Node deleted!");
    setTimeout(() => setState("toastMessage", null), 3000);
  };

  const handleNodeRightClick = (e, node) => {
    e.preventDefault();
    handleStartConnection(node.id);
  };

  const handleConnectButtonClick = (nodeId) => {
    handleStartConnection(nodeId);
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

    const nodeMap = {};
    nodes.forEach(node => {
      nodeMap[node.id] = node;
    });

    return connections.map((conn, index) => {
      const from = nodeMap[conn.from];
      const to = nodeMap[conn.to];
      if (!from || !to) return null;

      const x1 = from.x + 96;
      const y1 = from.y + 40;
      const x2 = to.x + 96;
      const y2 = to.y + 40;
      
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const isHovered = hoverLine && hoverLine.from === conn.from && hoverLine.to === conn.to;

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
            style: "cursor: pointer;"
          }
        },
        {
          polygon: {
            points: `${x2-8},${y2-4} ${x2},${y2} ${x2-8},${y2+4}`,
            fill: isHovered ? "#e11d48" : "#8b5cf6",
            stroke: "none"
          }
        },
        {
          circle: {
            cx: midX,
            cy: midY,
            r: 20,
            fill: "transparent",
            onmouseenter: () => onLineHover(conn),
            onmouseleave: () => onLineLeave(),
            ontouchstart: () => onLineHover(conn),
            onclick: () => {
              if (!getState("hoverLine")) {
                onLineHover(conn);
              } else {
                handleDeleteConnection(conn);
              }
            },
            style: "cursor: pointer;"
          }
        }
      ];

      if (isHovered) {
        // Larger clickable area for easier interaction
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
            ontouchstart: (e) => {
              e.stopPropagation();
              handleDeleteConnection(conn);
            },
            style: "cursor: pointer;"
          }
        });

        // Visible delete button
        connectionElements.push({
          circle: {
            cx: midX,
            cy: midY,
            r: 12,
            fill: "#ef4444",
            stroke: "#fff",
            "stroke-width": 2,
            style: "pointer-events: none;"
          }
        });

        // Delete icon
        connectionElements.push({
          text: {
            x: midX,
            y: midY,
            fill: "#fff",
            "font-size": "12",
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            style: "pointer-events: none; user-select: none;",
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
        class: "relative w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-auto",
        onmousemove: onMouseMove,
        onmouseup: onMouseUp,
        ontouchmove: onMouseMove,
        ontouchend: onMouseUp,
        children: () => {
          const nodes = getState("flowNodes", []);
          
          const minX = Math.min(...nodes.map(n => n.x), 0) - 200;
          const maxX = Math.max(...nodes.map(n => n.x + 200), 1600);
          const minY = Math.min(...nodes.map(n => n.y), 0) - 200;
          const maxY = Math.max(...nodes.map(n => n.y + 100), 1200);
          
          return [
            {
              div: {
                class: "relative",
                style: {
                  width: `${maxX - minX}px`,
                  height: `${maxY - minY}px`,
                  minWidth: "100%",
                  minHeight: "100%"
                },
                children: [
                  {
                    div: {
                      class: "absolute inset-0 opacity-30",
                      style: {
                        backgroundImage: "radial-gradient(circle at 25px 25px, lightgray 2px, transparent 0)",
                        backgroundSize: "50px 50px"
                      }
                    }
                  },
                  {
                    svg: {
                      class: "absolute inset-0 w-full h-full",
                      children: renderConnections,
                    },
                  },
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
                  ...nodes.map((node, index) => {
                    const isConnecting = connectionMode?.from === node.id;
                    const nodeData = getState(`flowNodes.${index}`);
                    const isIngredient = node.type === "ingredient" || node.type === "type 1";
                    
                    return {
                      div: {
                        class: () => {
                          const baseClasses = "group absolute w-48 p-4 rounded-2xl shadow-xl cursor-move transition-all duration-300 transform hover:scale-105 border-2 touch-manipulation";
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
                        ontouchstart: (e) => {
                          e.preventDefault();
                          const touch = e.touches[0];
                          const nodeRect = e.currentTarget.getBoundingClientRect();
                          const offsetX = touch.clientX - nodeRect.left;
                          const offsetY = touch.clientY - nodeRect.top;

                          setState("draggingNodeId", node.id);
                          setState("dragOffset", { x: offsetX, y: offsetY });
                        },
                        onclick: () => handleNodeClick(node),
                        oncontextmenu: (e) => handleNodeRightClick(e, node),
                        children: [
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
                          ...(isConnecting ? [{
                            div: {
                              class: "absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse",
                              text: "🔗"
                            }
                          }] : []),
                          {
                            div: {
                              class: "absolute -top-2 -right-2 flex gap-1",
                              children: [
                                {
                                  button: {
                                    class: "w-7 h-7 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200",
                                    text: "🔗",
                                    onclick: (e) => {
                                      e.stopPropagation();
                                      handleConnectButtonClick(node.id);
                                    },
                                    ontouchstart: (e) => {
                                      e.stopPropagation();
                                      handleConnectButtonClick(node.id);
                                    }
                                  }
                                },
                                {
                                  button: {
                                    class: "w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200",
                                    text: "✕",
                                    onclick: (e) => {
                                      e.stopPropagation();
                                      handleDeleteNode(node.id);
                                    },
                                    ontouchstart: (e) => {
                                      e.stopPropagation();
                                      handleDeleteNode(node.id);
                                    }
                                  }
                                }
                              ]
                            }
                          }
                        ],
                      },
                    };
                  }),
                  ...(getState("nodeToDelete") ? [{
                    div: {
                      class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
                      children: [
                        {
                          div: {
                            class: "bg-white rounded-2xl p-6 max-w-md mx-4",
                            children: [
                              {
                                h3: {
                                  class: "text-xl font-bold text-gray-800 mb-4",
                                  text: "🗑️ Delete Node"
                                }
                              },
                              {
                                p: {
                                  class: "text-gray-600 mb-6",
                                  text: "Are you sure you want to delete this node? All connections will also be removed."
                                }
                              },
                              {
                                div: {
                                  class: "flex gap-3 justify-end",
                                  children: [
                                    {
                                      button: {
                                        class: "px-4 py-2 bg-gray-200 rounded-lg text-gray-800",
                                        text: "Cancel",
                                        onclick: () => setState("nodeToDelete", null)
                                      }
                                    },
                                    {
                                      button: {
                                        class: "px-4 py-2 bg-red-500 text-white rounded-lg",
                                        text: "Delete",
                                        onclick: () => confirmDeleteNode(getState("nodeToDelete"))
                                      }
                                    }
                                  ]
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }] : [])
                ]
              }
            }
          ];
        },
      },
    }),
  };
};

export default FlowRenderer;
