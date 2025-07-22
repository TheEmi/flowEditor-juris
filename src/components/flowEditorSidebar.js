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
        class: "w-80 h-screen p-4 bg-white border-r shadow-sm overflow-y-auto",
        children: [
          {
            h2: {
              class: "text-xl font-bold text-pink-500 mb-4",
              text: "Ingredients"
            }
          },
          {
            input: {
              class: "w-full p-2 mb-3 border rounded text-sm",
              placeholder: "Search ingredients...",
              value: searchIngredient,
              oninput: (e) => setState("searchIngredient", e.target.value)
            }
          },
          ...filter([...builtInIngredients, ...customIngredients], searchIngredient).map((i) => ({
            div: {
              class: "p-2 bg-yellow-100 mb-2 rounded text-sm",
              children: [
                { span: { class: "font-semibold", text: i.label } },
                { span: { class: "ml-2 text-gray-600", text: i.quantity } }
              ]
            }
          })),
          {
            button: {
              class: "w-full bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded mb-6 text-sm",
              text: "Add Ingredient",
              onclick: addCustomIngredient
            }
          },
          {
            h2: {
              class: "text-xl font-bold text-blue-500 mb-4",
              text: "Steps"
            }
          },
          {
            input: {
              class: "w-full p-2 mb-3 border rounded text-sm",
              placeholder: "Search steps...",
              value: searchStep,
              oninput: (e) => setState("searchStep", e.target.value)
            }
          },
          ...filter([...builtInSteps, ...customSteps], searchStep).map((s) => ({
            div: {
              class: "p-2 bg-blue-100 mb-2 rounded text-sm",
              children: [
                { span: { class: "font-semibold", text: s.label } },
                { span: { class: "ml-2 text-gray-600", text: s.duration } }
              ]
            }
          })),
          {
            button: {
              class: "w-full bg-blue-400 hover:bg-blue-500 text-white py-1 px-2 rounded text-sm",
              text: "Add Step",
              onclick: addCustomStep
            }
          }
        ]
      }
    })
  };
};
export default FlowEditorSidebar;