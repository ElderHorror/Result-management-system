import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import LoginPage from "./LoginPage";
import NotFoundPage from "./NotFoundPage";

import StudentApp from "./StudentPage";
import CourseApp from "./CoursePage";
import ResultApp from "./ResultPage";
import LevelApp from "./LevelPage";
import View from "./View";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/course",
    element: <CourseApp />,
  },
  {
    path: "/student",
    element: <StudentApp />,
  },
  {
    path: "/result",
    element: <ResultApp />,
  },
  {
  path: "/level",
  element: <LevelApp />,
  },
  {
  path: "/view",
  element: <View />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
