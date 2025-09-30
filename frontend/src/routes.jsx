import Home from "./pages/Home";
import ManageUser from "./pages/ManageUser";
import Login from "./pages/Login";
import DefaultLayout from "./layouts/DefaultLayout";
import AppLayout from "./layouts/AppLayout";

const routes = [
  {
    path: "/",
    name: "Login",
    element: (
      <AppLayout>
        <Login />
      </AppLayout>)
  },
  {
    path: "/manageUser",
    name: "ManageUser",
    element: (
      <DefaultLayout>
        <AppLayout>
          <ManageUser />
        </AppLayout>
      </DefaultLayout>
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
  }
];

export default routes;
