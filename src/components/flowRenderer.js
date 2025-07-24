const FlowRenderer = (props, context) => {
  const { getState, setState } = context;

  const onMouseMove = (e) => {
    const draggingNodeId = getState("draggingNodeId", null);
    if (!draggingNodeId) return;

    const dragOffset = getState("dragOffset", { x: 0, y: 0 });
    const canvasRect = e.currentTarget.getBoundingClientRect();

    const clientX =
      e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY =
      e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    const x = clientX - canvasRect.left - dragOffset.x;
    const y = clientY - canvasRect.top - dragOffset.y;

    // Direct position update for smooth movement
    setState(`flowNodes.${draggingNodeId}`,  { ...getState(`flowNodes.${draggingNodeId}`, {}), x, y });
  };

  const onMouseUp = () => {
    setState("draggingNodeId", null);
    setState("dragOffset", { x: 0, y: 0 });
  };

  const handleNodeClick = (id,node) => {
    const connectionMode = getState("connectionMode", null);
    const connections = getState("flowConnections", []);

    if (connectionMode?.from) {
      if (connectionMode.from !== id) {
        setState("flowConnections", [
          ...connections,
          { from: connectionMode.from, to: id },
        ]);
        setState("toastMessage", "Connection created!");
        setTimeout(() => setState("toastMessage", null), 2000);
      }
      setState("connectionMode", null);
    } else {
      setState("selectedNode", node);
    }
  };

  const handleConnectButtonClick = (nodeId) => {
    const connectionMode = getState("connectionMode", null);

    if (connectionMode?.from === nodeId) {
      // Cancel connection mode
      setState("connectionMode", null);
      setState("toastMessage", "Connection cancelled");
      setTimeout(() => setState("toastMessage", null), 2000);
    } else {
      // Start connection mode
      setState("connectionMode", { from: nodeId });
      setState("toastMessage", "Click another node to connect");
      setTimeout(() => setState("toastMessage", null), 3000);
    }
  };

  const handleDeleteNode = (nodeId) => {
    const nodes = getState("flowNodes", {});
    const connections = getState("flowConnections", []);

    const updatedNodes = { ...nodes };
    delete updatedNodes[nodeId];
    setState("flowNodes", updatedNodes);

    const updatedConnections = connections.filter(
      (c) => c.from !== nodeId && c.to !== nodeId
    );
    setState("flowConnections", updatedConnections);

    setState("toastMessage", "Node deleted!");
    setTimeout(() => setState("toastMessage", null), 2000);
  };

  const handleDeleteConnection = (conn) => {
    const connections = getState("flowConnections", []);
    setState(
      "flowConnections",
      connections.filter((c) => !(c.from === conn.from && c.to === conn.to))
    );
    setState("toastMessage", "Connection deleted!");
    setTimeout(() => setState("toastMessage", null), 2000);
  };

  const renderConnections = () => {
    const connections = getState("flowConnections", []);

    return connections.map((conn, index) => {
      const from = getState(`flowNodes.${conn.from}`, null);
      const to = getState(`flowNodes.${conn.to}`, null);
      if (!from || !to) return null;

      const x1 = from.x + 96;
      const y1 = from.y + 40;
      const x2 = to.x + 96;
      const y2 = to.y + 40;

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      const dx = x2 - x1;
      const curve = Math.abs(dx) * 0.3;
      const pathData = `M ${x1} ${y1} C ${x1 + curve} ${y1}, ${
        x2 - curve
      } ${y2}, ${x2} ${y2}`;

      return {
        g: {
          key: `connection-${index}`,
          children: [
            {
              path: {
                d: pathData,
                stroke: "#8b5cf6",
                "stroke-width": 3,
                fill: "none",
                "stroke-linecap": "round",
              },
            },
            {
              polygon: {
                points: `${x2 - 8},${y2 - 4} ${x2},${y2} ${x2 - 8},${y2 + 4}`,
                fill: "#8b5cf6",
              },
            },
            {
              circle: {
                cx: midX,
                cy: midY,
                r: 15,
                fill: "#ef4444",
                stroke: "#fff",
                "stroke-width": 2,
                style: {
                  cursor: "pointer",
                },
                onclick: (e) => {
                  e.stopPropagation();
                  handleDeleteConnection(conn);
                },
              },
            },
            {
              text: {
                x: midX,
                y: midY + 1,
                fill: "#fff",
                "font-size": "12",
                "text-anchor": "middle",
                "dominant-baseline": "middle",
                style: {
                  "pointer-events": "none",
                  "user-select": "none",
                },
                text: "✕",
              },
            },
          ],
        },
      };
    });
  };

  // Add state for node action button visibility
  const visibleNodeActions = getState("visibleNodeActions", null);
  // Detect mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  // Track dragging
  const draggingNodeId = getState("draggingNodeId", null);
  // Hide node actions on click outside (mobile)
  if (typeof window !== "undefined" && isMobile) {
    window.__jurisNodeActionListener =
      window.__jurisNodeActionListener || false;
    if (!window.__jurisNodeActionListener) {
      window.addEventListener("click", (e) => {
        if (!e.target.closest(".node-action-area"))
          setState("visibleNodeActions", null);
      });
      window.__jurisNodeActionListener = true;
    }
  }

  return {
    render: () => ({
      div: {
        class:
          "relative w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-x-auto overflow-y-auto",
        onmousemove: onMouseMove,
        onmouseup: onMouseUp,
        ontouchmove: onMouseMove,
        ontouchend: onMouseUp,
        children: () => {
          const nodes = getState("flowNodes", {});
          const connectionMode = getState("connectionMode", null);

          return [
            {
              div: {
                class: "block",
                style: {
                  width: "2000px",
                  height: "1500px",
                  minWidth: "1200px",
                  minHeight: "100%",
                },
                children:  [
                  {
                    div: {
                      class: "absolute inset-0 opacity-30",
                      style: {
                        backgroundImage:
                          "radial-gradient(circle at 25px 25px, lightgray 2px, transparent 0)",
                        backgroundSize: "50px 50px",
                      },
                    },
                  },
                  {
                    svg: {
                      class: "absolute inset-0 w-full h-full",
                      children: renderConnections,
                    },
                  },
                  ...(connectionMode
                    ? [
                        {
                          div: {
                            class:
                              "absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg z-10",
                            children: [
                              {
                                span: {
                                  class: "font-semibold",
                                  text: "🔗 Connection Mode - Click another node to connect",
                                },
                              },
                            ],
                          },
                        },
                      ]
                    : []),
                  ...Object.entries(nodes).map(([id, node]) => {
                    const isConnecting = connectionMode?.from === id;
                    const isIngredient =
                      node.type === "ingredient" || node.type === "type 1";
                    const showActions = isMobile
                      ? visibleNodeActions === id
                      : getState("hoveredNodeId") === id;
                    return {
                      div: {
                        key: `node-${id}`,
                        class: () => {
                          const baseClasses =
                            "absolute w-48 p-4 rounded-2xl shadow-xl cursor-move transition-all duration-200 border-2";
                          const isHovered =
                            getState("hoveredNodeId") === id;
                          const typeClasses = isIngredient
                            ? "bg-gradient-to-br from-amber-100 to-orange-200 border-amber-300" +
                              (isHovered ? " from-amber-200 to-orange-300" : "")
                            : "bg-gradient-to-br from-blue-100 to-cyan-200 border-blue-300" +
                              (isHovered ? " from-blue-200 to-cyan-300" : "");
                          const connectingClasses = isConnecting
                            ? "ring-4 ring-purple-400 scale-110"
                            : isHovered
                            ? "z-100 scale-105"
                            : "z-10";
                          return `${baseClasses} ${typeClasses} ${connectingClasses}`;
                        },
                        style: () => ({
                          left: node.x + "px",
                          top: node.y + "px",
                          zIndex: isConnecting ? 20 : 10,
                        }),
                        onmousedown: (e) => {
                          e.preventDefault();
                          const nodeRect =
                            e.currentTarget.getBoundingClientRect();
                          const offsetX = e.clientX - nodeRect.left;
                          const offsetY = e.clientY - nodeRect.top;
                          setState("draggingNodeId", id);
                          setState("dragOffset", { x: offsetX, y: offsetY });
                        },
                        ontouchstart: (e) => {
                          e.preventDefault();
                          const touch = e.touches[0];
                          const nodeRect =
                            e.currentTarget.getBoundingClientRect();
                          const offsetX = touch.clientX - nodeRect.left;
                          const offsetY = touch.clientY - nodeRect.top;
                          setState("draggingNodeId", id);
                          setState("dragOffset", { x: offsetX, y: offsetY });
                        },
                        onmouseenter: () => {
                          if (!isMobile && !draggingNodeId)
                            setState("hoveredNodeId", id);
                        },
                        onmouseleave: () => {
                          if (!isMobile && !draggingNodeId)
                            setState("hoveredNodeId", null);
                        },
                        onclick: (e) => {
                          if (isMobile) {
                            setState(
                              "visibleNodeActions",
                              visibleNodeActions === id ? null : id
                            );
                            e.stopPropagation();
                          } else {
                            // Only trigger node click if not dragging
                            if (!draggingNodeId) handleNodeClick(id,node);
                          }
                        },
                        children: [
                          {
                            div: {
                              class: "flex items-center gap-2 mb-2",
                              children: [
                                {
                                  span: {
                                    class: "text-2xl",
                                    text:
                                      node.icon || (isIngredient ? "🥄" : "⚡"),
                                  },
                                },
                                {
                                  h3: {
                                    class:
                                      "font-bold text-sm text-gray-800 flex-1",
                                    text:
                                      node.label.replace(/^[^\s]+\s/, "") ||
                                      node.label,
                                  },
                                },
                              ],
                            },
                          },
                          {
                            div: {
                              class: "space-y-1",
                              children: [
                                ...(isIngredient
                                  ? [
                                      {
                                        div: {
                                          class: "flex items-center gap-2",
                                          children: [
                                            {
                                              span: {
                                                class: "text-xs text-amber-600",
                                                text: "📏",
                                              },
                                            },
                                            {
                                              span: {
                                                class: "text-xs text-gray-600",
                                                text: node.quantity,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ]
                                  : [
                                      {
                                        div: {
                                          class: "flex items-center gap-2",
                                          children: [
                                            {
                                              span: {
                                                class: "text-xs text-blue-600",
                                                text: "⚡",
                                              },
                                            },
                                            {
                                              span: {
                                                class: "text-xs text-gray-600",
                                                text: node.action,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                      {
                                        div: {
                                          class: "flex items-center gap-2",
                                          children: [
                                            {
                                              span: {
                                                class: "text-xs text-blue-600",
                                                text: "⏱️",
                                              },
                                            },
                                            {
                                              span: {
                                                class: "text-xs text-gray-600",
                                                text: node.duration,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ]),
                              ],
                            },
                          },
                          ...(isConnecting
                            ? [
                                {
                                  div: {
                                    class:
                                      "absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse",
                                    text: "🔗",
                                  },
                                },
                              ]
                            : []),
                          showActions
                            ? {
                                div: {
                                  class:
                                    "absolute -top-2 -right-2 flex gap-1 node-action-area",
                                  children: [
                                    {
                                      button: {
                                        class:
                                          "w-8 h-8 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-all duration-200",
                                        text: "🔗",
                                        onclick: (e) => {
                                          e.stopPropagation();
                                          handleConnectButtonClick(id);
                                        },
                                      },
                                    },
                                    {
                                      button: {
                                        class:
                                          "w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-all duration-200",
                                        text: "✕",
                                        onclick: (e) => {
                                          e.stopPropagation();
                                          handleDeleteNode(id);
                                        },
                                      },
                                    },
                                    {
                                      button: {
                                        class:
                                          "w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-all duration-200",
                                        text: "✏️",
                                        onclick: (e) => {
                                          e.stopPropagation();
                                          setState("selectedNode", { ...node });
                                          setState("selectedNodeId", id);
                                        },
                                      },
                                    },
                                  ],
                                },
                              }
                            : null,
                        ],
                      },
                    };
                  }),
                ],
              },
            },
          ];
        },
      },
    }),
  };
};

export default FlowRenderer;
