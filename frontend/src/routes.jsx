import Home from "./pages/Home";
import ManageUser from "./pages/ManageUser";
import Login from "./pages/Login";
import DefaultLayout from "./layouts/DefaultLayout";
import AppLayout from "./layouts/AppLayout";
import EnforcementDashboard from "./pages/Enforcement/dashboard";
import EnforcementFunction from "./pages/Enforcement/function";
import DataCollectionDashboard from "./pages/DataCollection/dashboard";
import DataCollectionFunction from "./pages/DataCollection/function";
import OperationManagementDashboard from "./pages/OperationManagement/dashboard";
import OperationManagementFunction from "./pages/OperationManagement/function";
import IncidentAccidentDashboard from "./pages/IncidentAccident/dashboard";
import IncidentAccidentFunction from "./pages/IncidentAccident/function";

const routes = [
  {
    path: "/",
    name: "Login",
    element: (
        <Login />
    ),
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
  },
  {
    path: "/enforcement/dashboard",
    name: "EnforcementDashboard",
    element: (
      <DefaultLayout>
        <EnforcementDashboard />
      </DefaultLayout>
    ),
  },
  {
    path: "/enforcement/function",
    name: "EnforcementFunction",
    element: (
      <DefaultLayout>
        <EnforcementFunction />
      </DefaultLayout>
    ),
  },
  {
    path: "/data-collection/dashboard",
    name: "DataCollectionDashboard",
    element: (
      <DefaultLayout>
        <DataCollectionDashboard />
      </DefaultLayout>
    ),
  },
  {
    path: "/data-collection/function",
    name: "DataCollectionFunction",
    element: (
      <DefaultLayout>
        <DataCollectionFunction />
      </DefaultLayout>
    ),
  },
  {
    path: "/operation-management/dashboard",
    name: "OperationManagementDashboard",
    element: (
      <DefaultLayout>
        <OperationManagementDashboard />
      </DefaultLayout>
    ),
  },
  {
    path: "/operation-management/function",
    name: "OperationManagementFunction",
    element: (
      <DefaultLayout>
        <OperationManagementFunction />
      </DefaultLayout>
    ),
  },
  {
    path: "/incident-accident/dashboard",
    name: "IncidentAccidentDashboard",
    element: (
      <DefaultLayout>
        <IncidentAccidentDashboard />
      </DefaultLayout>
    ),
  },
  {
    path: "/incident-accident/function",
    name: "IncidentAccidentFunction",
    element: (
      <DefaultLayout>
        <IncidentAccidentFunction />
      </DefaultLayout>
    ),
  },
];

export default routes;
