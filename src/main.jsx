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
import { createHashRouter, RouterProvider } from "react-router-dom";

import MyTest from "./TestFilesForBKND/testPage.jsx";

const router = createHashRouter ([
  {
    path: "/",
    element: <Homepage />,
    errorElement: <Error404 />,
  },
  {
    path: "/recipes/",
    element: <Recipes />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot",
    element: <ForgotPassword />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/settings",
    element: <UserSettings />,
  },
  {
    path: "/view/:recipeID",
    element: <RecipeViewer />,
  },
  {
    path: "/editor",
    element: <RecipeEditor />,
  },
  {
    path: "/editor/:recipeID",
    element: <RecipeEditor />,
  },
  {
    path: "/myrecipes",
    element: <MyRecipes />,
  },
  {
    path: "/BKNDTest/",
    element: <MyTest />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
