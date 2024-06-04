import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Root from "./components/admin/root";
import Home from "./components/admin/home";
import Error from "./components/admin/error";
import Product from "./components/admin/product";

function App() {
  let router = createBrowserRouter([
    {
      path: "",
      element: <Root />,
      errorElement: <Error />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "product/:id",
          element: <Product />,
        },
      ],
    },
  ]);
  return (
    <div className="App bg-light ">
      <RouterProvider router={router} />
    </div>
  );
}

export default App; 