const NodeEditDialog = (props, context) => {
  const { getState, setState } = context;
  const node = getState("selectedNode", null);

  if (!node) return { render: () => ({}) }; // Don't render if no node selected

  const close = () => setState("selectedNode", null);

  const updateNode = () => {
    const nodes = getState("flowNodes", []);
    const updatedNodes = nodes.map((n) => n.id === node.id ? node : n);
    setState("flowNodes", updatedNodes);
    close();
  };

  const isIngredient = node.type === "ingredient" || node.type === "type 1";

  return {
    render: () => ({
      div: {
        class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm",
        onclick: (e) => {
          if (e.target.classList.contains("bg-black")) close();
        },
        children: [
          {
            div: {
              class: "bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300",
              children: [
                {
                  div: {
                    class: "flex items-center gap-3 mb-6",
                    children: [
                      {
                        span: {
                          class: "text-3xl",
                          text: node.icon || (isIngredient ? "🥄" : "⚡")
                        }
                      },
                      {
                        h2: {
                          class: "text-2xl font-bold text-gray-800",
                          text: `Edit ${isIngredient ? "Ingredient" : "Cooking Step"}`
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: "space-y-4 mb-6",
                    children: [
                      {
                        div: {
                          children: [
                            {
                              label: {
                                class: "block text-sm font-semibold text-gray-700 mb-2",
                                text: isIngredient ? "🏷️ Ingredient Name" : "📝 Step Description"
                              }
                            },
                            {
                              input: {
                                class: "w-full p-4 border-2 border-purple-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all",
                                placeholder: isIngredient ? "e.g., Fresh Basil" : "e.g., Sauté until golden",
                                value: node.label.replace(/^[^\s]+\s/, '') || node.label,
                                oninput: (e) => {
                                  const icon = node.icon || (isIngredient ? "🥄" : "⚡");
                                  node.label = `${icon} ${e.target.value}`;
                                  setState("selectedNode", { ...node });
                                }
                              }
                            }
                          ]
                        }
                      },
                      ...(isIngredient ? [
                        {
                          div: {
                            children: [
                              {
                                label: {
                                  class: "block text-sm font-semibold text-gray-700 mb-2",
                                  text: "📏 Quantity"
                                }
                              },
                              {
                                input: {
                                  class: "w-full p-4 border-2 border-amber-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent focus:bg-white transition-all",
                                  placeholder: "e.g., 2 cups, 500g, 3 cloves",
                                  value: node.quantity,
                                  oninput: (e) => {
                                    node.quantity = e.target.value;
                                    setState("selectedNode", { ...node });
                                  }
                                }
                              }
                            ]
                          }
                        }
                      ] : [
                        {
                          div: {
                            children: [
                              {
                                label: {
                                  class: "block text-sm font-semibold text-gray-700 mb-2",
                                  text: "⚡ Action Type"
                                }
                              },
                              {
                                input: {
                                  class: "w-full p-4 border-2 border-blue-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all",
                                  placeholder: "e.g., Boil, Sauté, Mix",
                                  value: node.action,
                                  oninput: (e) => {
                                    node.action = e.target.value;
                                    setState("selectedNode", { ...node });
                                  }
                                }
                              }
                            ]
                          }
                        },
                        {
                          div: {
                            children: [
                              {
                                label: {
                                  class: "block text-sm font-semibold text-gray-700 mb-2",
                                  text: "⏱️ Duration"
                                }
                              },
                              {
                                input: {
                                  class: "w-full p-4 border-2 border-cyan-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:bg-white transition-all",
                                  placeholder: "e.g., 10 minutes, 2 hours",
                                  value: node.duration,
                                  oninput: (e) => {
                                    node.duration = e.target.value;
                                    setState("selectedNode", { ...node });
                                  }
                                }
                              }
                            ]
                          }
                        }
                      ])
                    ]
                  }
                },
                {
                  div: {
                    class: "flex justify-end gap-4",
                    children: [
                      {
                        button: {
                          class: "bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105",
                          text: "❌ Cancel",
                          onclick: close
                        }
                      },
                      {
                        button: {
                          class: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg",
                          text: "✨ Save Changes",
                          onclick: updateNode
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
    })
  };
};
export default NodeEditDialog;