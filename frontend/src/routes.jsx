import Home from "./pages/Home";
import CreateUsers from "./pages/CreateUsers";
import Login from "./pages/Login";
import DefaultLayout from "./layouts/DefaultLayout";

const routes = [
  {
    path: "/",
    name: "Login",
    element: (
      <Login />
    ),
  },
  {
    path: "/home",
    name: "Home",
    element: (
      <DefaultLayout>
        <Home />
      </DefaultLayout>
    ),
  },
  {
    path: "/create-user",
    name: "Create User",
    element: (
      <DefaultLayout>
        <CreateUsers />
      </DefaultLayout>
    ),
  },
];

export default routes;
