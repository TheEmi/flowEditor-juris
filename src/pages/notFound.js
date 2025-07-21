const NotFoundPage = (props, context) => {
  return {
    render: () => ({
      div: {
        class: "flex flex-col items-center justify-center h-screen bg-gray-100 text-center",
        children: [
          {
            h1: {
              class: "text-6xl font-bold text-pink-500 mb-4",
              text: "404"
            }
          },
          {
            h2: {
              class: "text-2xl font-semibold text-gray-700 mb-2",
              text: "Page Not Found"
            }
          },
          {
            p: {
              class: "text-gray-500 mb-6",
              text: "The page you're looking for doesn't exist."
            }
          },
          {
            button: {
              class: "bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition",
              text: "Go Home",
              onclick: () => window.location.href = "/"
            }
          }
        ]
      }
    })
  };
};
export default NotFoundPage