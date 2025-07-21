import HomePage from "../pages/home";
import NotFoundPage from "../pages/notFound";
import EditorPage from "../pages/editor";

const Router = (props, context) => {
    const {getState} = context;
  return {
    render: () => ({
      div: {
        children: () => {
          const path = getState('router.path', '/');
          
          switch (path) {
            case '/':
              return [{ EditorPage: {} }];
            case '/editor':
              return [{ EditorPage: {} }];
            case '/':
              return [{ HomePage: {} }];
            default:
              return [{ NotFoundPage: {} }];
          }
        }
      }
    })
  };
};
export default Router;