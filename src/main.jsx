import React from "react";
import ReactDOM from "react-dom/client";
import Homepage from "./pages/Homepage.jsx";
import Recipes from "./pages/Recipes.jsx";
import MyRecipes from "./pages/MyRecipes.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import RecipeViewer from "./pages/RecipeViewer.jsx";
import RecipeEditor from "./pages/RecipeEditor.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UserSettings from "./pages/UserSettings.jsx";
import Error404 from "./pages/Error404.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./scss/styles.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MyTest from "./TestFilesForBKND/testPage.jsx";

const router = createBrowserRouter([
  {
    path: "/Plum-Pantry",
    element: <Homepage />,
    errorElement: <Error404 />,
  },
  {
    path: "/Plum-Pantry/recipes",
    element: <Recipes />,
  },
  {
    path: "/Plum-Pantry/about",
    element: <About />,
  },
  {
    path: "/Plum-Pantry/login",
    element: <Login />,
  },
  {
    path: "/Plum-Pantry/forgot",
    element: <ForgotPassword />,
  },
  {
    path: "/Plum-Pantry/register",
    element: <Register />,
  },
  {
    path: "/Plum-Pantry/settings",
    element: <UserSettings />,
  },
  {
    path: "/Plum-Pantry/view/:recipeID",
    element: <RecipeViewer />,
  },
  {
    path: "/Plum-Pantry/editor",
    element: <RecipeEditor />,
  },
  {
    path: "/Plum-Pantry/editor/:recipeID",
    element: <RecipeEditor />,
  },
  {
    path: "/Plum-Pantry/myrecipes",
    element: <MyRecipes />,
  },
  {
    path: "/Plum-Pantry/BKNDTest",
    element: <MyTest />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
