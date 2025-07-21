const FlowEditorSidebar = (props, context) => {
  const { getState, setState } = context;

  const builtInIngredients = [
    { label: "Spaghetti", quantity: "200g" },
    { label: "Ground Beef", quantity: "300g" },
    { label: "Tomato Sauce", quantity: "1 cup" }
  ];

  const builtInSteps = [
    { action: "Boil", label: "Boil Spaghetti", duration: "10 minutes" },
    { action: "Mix", label: "Cook Beef and Sauce", duration: "15 minutes" },
    { action: "Combine", label: "Mix Spaghetti with Sauce", duration: "5 minutes" }
  ];

  const searchIngredient = getState("searchIngredient", "");
  const searchStep = getState("searchStep", "");

  const customIngredients = getState("customIngredients", []);
  const customSteps = getState("customSteps", []);

  const addCustomIngredient = () => {
    const label = prompt("Enter ingredient name:");
    const quantity = prompt("Enter quantity:");
    if (label && quantity) {
      const updated = [...customIngredients, { label, quantity }];
      setState("customIngredients", updated);
    }
  };

  const addCustomStep = () => {
    const label = prompt("Enter step label:");
    const action = prompt("Enter action (e.g. Boil, Mix):");
    const duration = prompt("Enter duration (e.g. 10 minutes):");
    if (label && action && duration) {
      const updated = [...customSteps, { label, action, duration }];
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