const FlowEditorSidebar = (props, context) => {
  const { getState, setState } = context;

  const builtInIngredients = [
    { label: "🍝 Spaghetti", quantity: "200g", icon: "🍝" },
    { label: "🥩 Ground Beef", quantity: "300g", icon: "🥩" },
    { label: "🍅 Tomato Sauce", quantity: "1 cup", icon: "🍅" },
    { label: "🧄 Garlic", quantity: "3 cloves", icon: "🧄" },
    { label: "🧅 Onion", quantity: "1 medium", icon: "🧅" }
  ];

  const builtInSteps = [
    { action: "Boil", label: "💧 Boil Water", duration: "5 minutes", icon: "💧" },
    { action: "Cook", label: "🔥 Cook Pasta", duration: "10 minutes", icon: "🔥" },
    { action: "Sauté", label: "🍳 Sauté Vegetables", duration: "8 minutes", icon: "🍳" },
    { action: "Mix", label: "🥣 Combine Ingredients", duration: "5 minutes", icon: "🥣" }
  ];

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addToCanvas = (item, type) => {
    const nodes = getState("flowNodes", []);
    const newNode = {
      id: generateId(),
      type: type,
      label: item.label,
      icon: item.icon || (type === "ingredient" ? "🥄" : "⚡"),
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      ...(type === "ingredient" ? { quantity: item.quantity } : { action: item.action, duration: item.duration })
    };
    setState("flowNodes", [...nodes, newNode]);
  };

  return {
    render: () => ({
      div: {
        class: "w-96 h-full bg-gradient-to-br from-purple-50 to-pink-50 border-r border-purple-200 shadow-xl overflow-y-auto flex-shrink-0",
        children: [
          {
            div: {
              class: "p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white",
              children: [
                {
                  h1: {
                    class: "text-2xl font-bold mb-2",
                    text: "✨ Recipe Builder"
                  }
                },
                {
                  p: {
                    class: "text-purple-100 text-sm",
                    text: "Click items to add to canvas"
                  }
                }
              ]
            }
          },
          
          {
            div: {
              class: "p-6",
              children: [
                {
                  h2: {
                    class: "text-xl font-bold text-gray-800 mb-4",
                    text: "🥘 Ingredients"
                  }
                },
                {
                  div: {
                    class: "space-y-2 mb-6",
                    children: builtInIngredients.map((i) => ({
                      div: {
                        class: "p-3 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 border border-amber-200",
                        onclick: () => addToCanvas(i, "ingredient"),
                        children: [
                          {
                            div: {
                              class: "flex items-center justify-between",
                              children: [
                                {
                                  span: {
                                    class: "font-semibold text-gray-800 text-sm",
                                    text: i.label
                                  }
                                },
                                {
                                  span: {
                                    class: "text-xs text-gray-600 bg-white/50 px-2 py-1 rounded-full",
                                    text: i.quantity
                                  }
                                }
                              ]
                            }
                          }
                        ]
                      }
                    }))
                  }
                },
                {
                  h2: {
                    class: "text-xl font-bold text-gray-800 mb-4",
                    text: "👩‍🍳 Cooking Steps"
                  }
                },
                {
                  div: {
                    class: "space-y-2",
                    children: builtInSteps.map((s) => ({
                      div: {
                        class: "p-3 bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 border border-blue-200",
                        onclick: () => addToCanvas(s, "step"),
                        children: [
                          {
                            div: {
                              class: "flex items-center justify-between",
                              children: [
                                {
                                  span: {
                                    class: "font-semibold text-gray-800 text-sm",
                                    text: s.label
                                  }
                                },
                                {
                                  span: {
                                    class: "text-xs text-gray-600 bg-white/50 px-2 py-1 rounded-full",
                                    text: s.duration
                                  }
                                }
                              ]
                            }
                          }
                        ]
                      }
                    }))
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
export default FlowEditorSidebar;
