import FlowEditorSidebar from "../components/flowEditorSidebar";
import FlowRenderer from "../components/flowRenderer";
import NodeEditDialog from "../components/nodeEditDialog";
const EditorPage = (props, context) => {
    const {getState, setState} = context;
  const exampleRecipe = {
    recipe: {
      title: "Spaghetti Bolognese Flow",
      description: "A visual recipe for the perfect pasta dish",
      nodes: [
        { id: "node1", type: "ingredient", label: "🍝 Spaghetti", quantity: "400g", icon: "🍝", x: 150, y: 100 },
        { id: "node2", type: "ingredient", label: "🥩 Ground Beef", quantity: "300g", icon: "🥩", x: 150, y: 220 },
        { id: "node3", type: "ingredient", label: "🍅 Tomato Sauce", quantity: "1 cup", icon: "🍅", x: 150, y: 340 },
        { id: "node4", type: "ingredient", label: "🧄 Garlic", quantity: "3 cloves", icon: "🧄", x: 150, y: 460 },
        { id: "node5", type: "step", action: "Boil", label: "💧 Boil Water", duration: "8 minutes", icon: "💧", x: 450, y: 100 },
        { id: "node6", type: "step", action: "Cook", label: "🔥 Cook Pasta", duration: "10 minutes", icon: "🔥", x: 750, y: 100 },
        { id: "node7", type: "step", action: "Sauté", label: "🍳 Sauté Garlic", duration: "2 minutes", icon: "🍳", x: 450, y: 300 },
        { id: "node8", type: "step", action: "Cook", label: "🥩 Brown Beef", duration: "8 minutes", icon: "🥩", x: 750, y: 300 },
        { id: "node9", type: "step", action: "Simmer", label: "🥄 Add Sauce & Simmer", duration: "15 minutes", icon: "🥄", x: 1050, y: 300 },
        { id: "node10", type: "step", action: "Combine", label: "🍽️ Mix & Serve", duration: "3 minutes", icon: "🍽️", x: 1350, y: 200 }
      ],
      connections: [
        { from: "node1", to: "node5" },
        { from: "node5", to: "node6" },
        { from: "node4", to: "node7" },
        { from: "node2", to: "node8" },
        { from: "node7", to: "node8" },
        { from: "node3", to: "node9" },
        { from: "node8", to: "node9" },
        { from: "node6", to: "node10" },
        { from: "node9", to: "node10" }
      ]
    }
  };
  setState(`flowNodes`, exampleRecipe.recipe.nodes);
  setState(`flowConnections`, exampleRecipe.recipe.connections);


  const saveRecipe = () => {
    const nodes = getState("flowNodes", []);
    const connections = getState("flowConnections", []);
    const recipe = {
      title: exampleRecipe.recipe.title,
      description: exampleRecipe.recipe.description,
      nodes,
      connections,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage for now (could be database later)
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    savedRecipes.push(recipe);
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
    
    // Show toast notification instead of alert
    setState("toastMessage", "✨ Recipe saved successfully!");
    setTimeout(() => setState("toastMessage", null), 3000);
  };

  const clearCanvas = () => {
    setState("showClearConfirm", true);
  };

  const confirmClear = () => {
    setState("flowNodes", []);
    setState("flowConnections", []);
    setState("showClearConfirm", false);
    setState("toastMessage", "Canvas cleared!");
    setTimeout(() => setState("toastMessage", null), 3000);
  };

  const exportRecipe = () => {
    const nodes = getState("flowNodes", []);
    const connections = getState("flowConnections", []);
    const recipe = {
      title: exampleRecipe.recipe.title,
      description: exampleRecipe.recipe.description,
      nodes,
      connections,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(recipe, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recipe-flow.json';
    link.click();
  };

  return {
    render: () => ({
      div: {
        class: "flex flex-col h-screen relative",
        children: [
          // Top toolbar
          {
            div: {
              class: "bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 shadow-lg",
              children: [
                {
                  div: {
                    class: "flex items-center justify-between",
                    children: [
                      {
                        div: {
                          class: "flex items-center gap-3",
                          children: [
                            { span: { class: "text-2xl", text: "🍳" } },
                            {
                              h1: {
                                class: "text-xl font-bold",
                                text: exampleRecipe.recipe.title
                              }
                            }
                          ]
                        }
                      },
                      {
                        div: {
                          class: "flex items-center gap-2 md:gap-3",
                          children: [
                            {
                              button: {
                                class: "bg-white/20 hover:bg-white/30 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 transform hover:scale-105",
                                text: "💾 Save",
                                onclick: saveRecipe
                              }
                            },
                            {
                              button: {
                                class: "bg-white/20 hover:bg-white/30 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 transform hover:scale-105",
                                text: "📤 Export",
                                onclick: exportRecipe
                              }
                            },
                            {
                              button: {
                                class: "bg-red-500/80 hover:bg-red-500 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 transform hover:scale-105",
                                text: "🗑️ Clear",
                                onclick: clearCanvas
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
          },
          // Main content
          {
            div: {
              class: "flex flex-1 overflow-hidden",
              children: [
                {FlowEditorSidebar},
                {
                  div: {
                    class: "flex-1 relative",
                    children: ()=> [
                      {FlowRenderer: {exampleRecipe }},
                      {NodeEditDialog}
                    ]
                  }
                }
              ]
            }
          },
          // Toast notifications
          ...(getState("toastMessage") ? [{
            div: {
              class: "fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse",
              text: getState("toastMessage")
            }
          }] : []),
          // Clear confirmation dialog
          ...(getState("showClearConfirm") ? [{
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
                          text: "🗑️ Clear Canvas"
                        }
                      },
                      {
                        p: {
                          class: "text-gray-600 mb-6",
                          text: "Are you sure you want to clear the canvas? This cannot be undone."
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
                                onclick: () => setState("showClearConfirm", false)
                              }
                            },
                            {
                              button: {
                                class: "px-4 py-2 bg-red-500 text-white rounded-lg",
                                text: "Clear All",
                                onclick: confirmClear
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
    })
  };
};
export default EditorPage;