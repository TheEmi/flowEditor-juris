const HomePage = (props, context) => {
  return {
    render: () => ({
      div: {
        class: "min-h-screen bg-white flex flex-col items-center justify-center text-center p-6",
        children: [
          {
            h1: {
              class: "text-4xl md:text-6xl font-extrabold text-pink-500 mb-4",
              text: "CookFlow"
            }
          },
          {
            p: {
              class: "text-lg md:text-xl text-gray-600 max-w-xl mb-8",
              text: "Visualize your recipes like never before. Connect ingredients, steps, and timing in a clear, flow-based interface."
            }
          },
          {
            button: {
              class: "bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-3 rounded-lg shadow transition",
              text: "Get Started",
              onclick: () => context.setState('route', '/recipes')
            }
          }
        ]
      }
    })
  };
};
export default HomePage;