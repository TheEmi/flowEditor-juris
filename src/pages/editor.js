import FlowEditorSidebar from "../components/flowEditorSidebar";
import FlowRenderer from "../components/flowRenderer";
import NodeEditDialog from "../components/nodeEditDialog";
const EditorPage = (props, context) => {
    const {getState, setState} = context;
  const exampleRecipe = {
    recipe: {
      title: "Flow 1",
      description: "Testing to see reactivity.",
      nodes: [
        { id: "1", type: "type 1", label: "Spaghetti", quantity: "200g", x: 100, y:100 },
        { id: "2", type: "type 1", label: "Ground Beef", quantity: "300g", x: 100, y:200 },
        { id: "3", type: "type 1", label: "Tomato Sauce", quantity: "1 cup", x: 100, y:300 },
        { id: "4", type: "step", action: "Boil", label: "Boil Spaghetti", duration: "10 minutes", x: 400, y:100 },
        { id: "5", type: "step", action: "Mix", label: "Cook Beef and Sauce", duration: "15 minutes", x: 400, y:250 },
        { id: "6", type: "step", action: "Combine", label: "Mix Spaghetti with Sauce", duration: "5 minutes", x: 700, y:150 }
      ],
      connections: [
        { from: "1", to: "4" },
        { from: "2", to: "5" },
        { from: "3", to: "5" },
        { from: "4", to: "6" },
        { from: "5", to: "6" }
      ]
    }
  };
  setState(`flowNodes`, exampleRecipe.recipe.nodes);
  setState(`flowConnections`, exampleRecipe.recipe.connections);


  return {
    render: () => ({
      div: {
        class: "flex",
        children: [
          {FlowEditorSidebar},
          {
            div: {
              class: "flex-1 overflow-auto",
              children: ()=> [
                {FlowRenderer: {exampleRecipe }},
                {NodeEditDialog}
              ]
            }
          }
        ]
      }
    })
  };
};
export default EditorPage;