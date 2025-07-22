const HomePage = (props, context) => {
  const { setState } = context;

  const createNewRecipe = () => {
    window.location.href = "/editor";
  };

  return {
    render: () => ({
      div: {
        class: "min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50",
        children: [
          // Header
          {
            div: {
              class: "bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16",
              children: [
                {
                  div: {
                    class: "max-w-4xl mx-auto text-center px-6",
                    children: [
                      {
                        h1: {
                          class: "text-6xl font-bold mb-6",
                          text: "🍳 Recipe Flow Editor"
                        }
                      },
                      {
                        p: {
                          class: "text-2xl text-purple-100 mb-8 leading-relaxed",
                          text: "Create beautiful visual recipe flows that will make cooking fun and organized ✨"
                        }
                      },
                      {
                        div: {
                          class: "flex justify-center gap-6",
                          children: [
                            {
                              button: {
                                class: "bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl",
                                text: "🚀 Start Creating",
                                onclick: createNewRecipe
                              }
                            },
                            {
                              a: {
                                href: "/editor",
                                class: "bg-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl border-2 border-purple-400 inline-block",
                                text: "👀 View Sample"
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
          // Features
          {
            div: {
              class: "py-20",
              children: [
                {
                  div: {
                    class: "max-w-6xl mx-auto px-6",
                    children: [
                      {
                        h2: {
                          class: "text-4xl font-bold text-center text-gray-800 mb-16",
                          text: "✨ Why You'll Love This"
                        }
                      },
                      {
                        div: {
                          class: "grid md:grid-cols-3 gap-8",
                          children: [
                            {
                              div: {
                                class: "bg-white rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-100",
                                children: [
                                  {
                                    div: {
                                      class: "text-6xl mb-4 text-center",
                                      text: "🎨"
                                    }
                                  },
                                  {
                                    h3: {
                                      class: "text-2xl font-bold text-gray-800 mb-4 text-center",
                                      text: "Beautiful Visual Design"
                                    }
                                  },
                                  {
                                    p: {
                                      class: "text-gray-600 text-center leading-relaxed",
                                      text: "Gorgeous gradients, smooth animations, and delightful icons make recipe creation a joy"
                                    }
                                  }
                                ]
                              }
                            },
                            {
                              div: {
                                class: "bg-white rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300 border border-amber-100",
                                children: [
                                  {
                                    div: {
                                      class: "text-6xl mb-4 text-center",
                                      text: "🔗"
                                    }
                                  },
                                  {
                                    h3: {
                                      class: "text-2xl font-bold text-gray-800 mb-4 text-center",
                                      text: "Intuitive Flow Building"
                                    }
                                  },
                                  {
                                    p: {
                                      class: "text-gray-600 text-center leading-relaxed",
                                      text: "Drag, drop, and connect ingredients to cooking steps in a visual workflow that makes sense"
                                    }
                                  }
                                ]
                              }
                            },
                            {
                              div: {
                                class: "bg-white rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-100",
                                children: [
                                  {
                                    div: {
                                      class: "text-6xl mb-4 text-center",
                                      text: "📱"
                                    }
                                  },
                                  {
                                    h3: {
                                      class: "text-2xl font-bold text-gray-800 mb-4 text-center",
                                      text: "Easy Sharing & Export"
                                    }
                                  },
                                  {
                                    p: {
                                      class: "text-gray-600 text-center leading-relaxed",
                                      text: "Save, export, and share your recipe flows with friends. Perfect for social media!"
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
                }
              ]
            }
          }
        ]
      }
    })
  };
};
export default HomePage;