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

  return {
    render: () => ({
      div: {
        class: "fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50",
        onclick: (e) => {
          if (e.target.classList.contains("bg-black")) close();
        },
        children: [
          {
            div: {
              class: "bg-white rounded-lg p-6 w-full max-w-md shadow-lg",
              children: [
                {
                  h2: {
                    class: "text-xl font-bold mb-4",
                    text: `Edit ${node.type === "step" ? "Step" : "Ingredient"}`
                  }
                },
                {
                  input: {
                    class: "w-full p-2 mb-3 border rounded",
                    placeholder: "Label",
                    value: node.label,
                    oninput: (e) => {
                      node.label = e.target.value;
                      setState("selectedNode", { ...node });
                    }
                  }
                },
                node.type === "ingredient" && {
                  input: {
                    class: "w-full p-2 mb-3 border rounded",
                    placeholder: "Quantity",
                    value: node.quantity,
                    oninput: (e) => {
                      node.quantity = e.target.value;
                      setState("selectedNode", { ...node });
                    }
                  }
                },
                node.type === "step" && [
                  {
                    input: {
                      class: "w-full p-2 mb-3 border rounded",
                      placeholder: "Action",
                      value: node.action,
                      oninput: (e) => {
                        node.action = e.target.value;
                        setState("selectedNode", { ...node });
                      }
                    }
                  },
                  {
                    input: {
                      class: "w-full p-2 mb-4 border rounded",
                      placeholder: "Duration",
                      value: node.duration,
                      oninput: (e) => {
                        node.duration = e.target.value;
                        setState("selectedNode", { ...node });
                      }
                    }
                  }
                ],
                {
                  div: {
                    class: "flex justify-end gap-3",
                    children: [
                      {
                        button: {
                          class: "bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded",
                          text: "Cancel",
                          onclick: close
                        }
                      },
                      {
                        button: {
                          class: "bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded",
                          text: "Save",
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