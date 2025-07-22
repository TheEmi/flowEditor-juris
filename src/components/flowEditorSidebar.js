const FlowEditorSidebar = (props, context) => {
  const { getState, setState } = context;

  const builtInIngredients = [
    { label: "🍝 Spaghetti", quantity: "200g", icon: "🍝" },
    { label: "🥩 Ground Beef", quantity: "300g", icon: "🥩" },
    { label: "🍅 Tomato Sauce", quantity: "1 cup", icon: "🍅" },
    { label: "🧄 Garlic", quantity: "3 cloves", icon: "🧄" },
    { label: "🧅 Onion", quantity: "1 medium", icon: "🧅" },
    { label: "🧈 Butter", quantity: "2 tbsp", icon: "🧈" },
    { label: "🧀 Parmesan", quantity: "50g", icon: "🧀" },
    { label: "🌿 Basil", quantity: "fresh leaves", icon: "🌿" },
    { label: "🫒 Olive Oil", quantity: "2 tbsp", icon: "🫒" },
    { label: "🧂 Salt", quantity: "to taste", icon: "🧂" }
  ];

  const builtInSteps = [
    { action: "Boil", label: "💧 Boil Water", duration: "5 minutes", icon: "💧" },
    { action: "Cook", label: "🔥 Cook Pasta", duration: "10 minutes", icon: "🔥" },
    { action: "Sauté", label: "🍳 Sauté Vegetables", duration: "8 minutes", icon: "🍳" },
    { action: "Simmer", label: "🥄 Simmer Sauce", duration: "15 minutes", icon: "🥄" },
    { action: "Mix", label: "🥣 Combine Ingredients", duration: "5 minutes", icon: "🥣" },
    { action: "Season", label: "🌶️ Add Seasoning", duration: "2 minutes", icon: "🌶️" },
    { action: "Serve", label: "🍽️ Plate & Serve", duration: "3 minutes", icon: "🍽️" }
  ];

  const searchIngredient = getState("searchIngredient", "");
  const searchStep = getState("searchStep", "");

  const customIngredients = getState("customIngredients", []);
  const customSteps = getState("customSteps", []);

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

  const addCustomIngredient = () => {
    const label = prompt("Enter ingredient name:");
    const quantity = prompt("Enter quantity:");
    const icon = prompt("Enter emoji icon (optional):") || "🥄";
    if (label && quantity) {
      const newIngredient = { label: `${icon} ${label}`, quantity, icon };
      const updated = [...customIngredients, newIngredient];
      setState("customIngredients", updated);
    }
  };

  const addCustomStep = () => {
    const label = prompt("Enter step label:");
    const action = prompt("Enter action (e.g. Boil, Mix):");
    const duration = prompt("Enter duration (e.g. 10 minutes):");
    const icon = prompt("Enter emoji icon (optional):") || "⚡";
    if (label && action && duration) {
      const newStep = { label: `${icon} ${label}`, action, duration, icon };
      const updated = [...customSteps, newStep];
      setState("customSteps", updated);
    }
  };

  const filter = (arr, keyword) =>
    arr.filter((item) => item.label.toLowerCase().includes(keyword.toLowerCase()));

  return {
    render: () => ({
      div: {
        class: "w-96 h-screen bg-gradient-to-br from-purple-50 to-pink-50 border-r border-purple-200 shadow-xl overflow-y-auto",
        children: [
          // Header
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
                    text: "Drag & drop to create your perfect recipe"
                  }
                }
              ]
            }
          },
          
          // Ingredients Section
          {
            div: {
              class: "p-6",
              children: [
                {
                  div: {
                    class: "flex items-center gap-3 mb-4",
                    children: [
                      { span: { class: "text-2xl", text: "🥘" } },
                      {
                        h2: {
                          class: "text-xl font-bold text-gray-800",
                          text: "Ingredients"
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: "relative mb-4",
                    children: [
                      {
                        span: {
                          class: "absolute left-3 top-3 text-gray-400",
                          text: "🔍"
                        }
                      },
                      {
                        input: {
                          class: "w-full pl-10 pr-4 py-3 border border-purple-200 rounded-xl text-sm bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all",
                          placeholder: "Search ingredients...",
                          value: searchIngredient,
                          oninput: (e) => setState("searchIngredient", e.target.value)
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: "space-y-2 mb-4 max-h-64 overflow-y-auto",
                    children: filter([...builtInIngredients, ...customIngredients], searchIngredient).map((i) => ({
                      div: {
                        class: "group p-3 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg border border-amber-200",
                        onclick: () => addToCanvas(i, "ingredient"),
                        children: [
                          {
                            div: {
                              class: "flex items-center justify-between",
                              children: [
                                {
                                  div: {
                                    class: "flex items-center gap-2",
                                    children: [
                                      { span: { class: "text-lg", text: i.icon || "🥄" } },
                                      { span: { class: "font-semibold text-gray-800 text-sm", text: i.label.replace(/^[^\s]+\s/, '') } }
                                    ]
                                  }
                                },
                                { span: { class: "text-xs text-gray-600 bg-white/50 px-2 py-1 rounded-full", text: i.quantity } }
                              ]
                            }
                          },
                          {
                            div: {
                              class: "text-xs text-amber-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
                              text: "Click to add to canvas"
                            }
                          }
                        ]
                      }
                    }))
                  }
                },
                {
                  button: {
                    class: "w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl",
                    text: "➕ Create Custom Ingredient",
                    onclick: addCustomIngredient
                  }
                }
              ]
            }
          },

          // Steps Section
          {
            div: {
              class: "p-6 pt-0",
              children: [
                {
                  div: {
                    class: "flex items-center gap-3 mb-4",
                    children: [
                      { span: { class: "text-2xl", text: "👩‍🍳" } },
                      {
                        h2: {
                          class: "text-xl font-bold text-gray-800",
                          text: "Cooking Steps"
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: "relative mb-4",
                    children: [
                      {
                        span: {
                          class: "absolute left-3 top-3 text-gray-400",
                          text: "🔍"
                        }
                      },
                      {
                        input: {
                          class: "w-full pl-10 pr-4 py-3 border border-purple-200 rounded-xl text-sm bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all",
                          placeholder: "Search cooking steps...",
                          value: searchStep,
                          oninput: (e) => setState("searchStep", e.target.value)
                        }
                      }
                    ]
                  }
                },
                {
                  div: {
                    class: "space-y-2 mb-4 max-h-64 overflow-y-auto",
                    children: filter([...builtInSteps, ...customSteps], searchStep).map((s) => ({
                      div: {
                        class: "group p-3 bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg border border-blue-200",
                        onclick: () => addToCanvas(s, "step"),
                        children: [
                          {
                            div: {
                              class: "flex items-center justify-between",
                              children: [
                                {
                                  div: {
                                    class: "flex items-center gap-2",
                                    children: [
                                      { span: { class: "text-lg", text: s.icon || "⚡" } },
                                      { span: { class: "font-semibold text-gray-800 text-sm", text: s.label.replace(/^[^\s]+\s/, '') } }
                                    ]
                                  }
                                },
                                { span: { class: "text-xs text-gray-600 bg-white/50 px-2 py-1 rounded-full", text: s.duration } }
                              ]
                            }
                          },
                          {
                            div: {
                              class: "text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
                              text: "Click to add to canvas"
                            }
                          }
                        ]
                      }
                    }))
                  }
                },
                {
                  button: {
                    class: "w-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl",
                    text: "➕ Create Custom Step",
                    onclick: addCustomStep
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