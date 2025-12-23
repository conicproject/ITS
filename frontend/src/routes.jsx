import Home from "./pages/Home";
import ManageUser from "./pages/ManageUser";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
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
import EnforcementReportFunction from "./pages/Enforcement/function/report-vehicle";
import DetailReportVehicle from "./pages/Enforcement/function/detail-report-vehicle";
import DetectSpeeding from "./pages/Enforcement/function/detect-speeding";
import DetectTruckBarrier from "./pages/Enforcement/function/detect-truck-barrier";
import EnforcementBlacklist from "./pages/Enforcement/function/blacklist";
import DetectLane from "./pages/Enforcement/function/detect-lane";
import DetectParking from "./pages/Enforcement/function/detect-parking";
import DetectRedLight from "./pages/Enforcement/function/detect-red-light";
import DetectSidewalk from "./pages/Enforcement/function/detect-sidewalk";
import InstallationPoint from "./pages/DataCollection/function/installation-point";
import LicensePlateSearch from "./pages/DataCollection/function/license-plate-search";
import RouteAnalysis from "./pages/DataCollection/function/route-analysis";
import VehicleReport from "./pages/DataCollection/function/vehicle.report";
import RelateAccident from "./pages/IncidentAccident/function/relate-accident";
import Irregularities from "./pages/IncidentAccident/function/irregularitie";
import RoadObstruction from "./pages/IncidentAccident/function/road-obstruction";
import SpecialEvent from "./pages/IncidentAccident/function/special-event";
import SpecialHazard from "./pages/IncidentAccident/function/special-hazard";
import TrafficSignal from "./pages/OperationManagement/function/traffic-signal";
import Ambulance from "./pages/OperationManagement/function/Ambulance";
import VIP from "./pages/OperationManagement/function/vip";
import Sequence from "./pages/OperationManagement/function/sequence";


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
    path: "/overview",
    name: "Overview",
    element: (
      <DefaultLayout>
        <Overview />
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
  {
    path: "/enforcement/function/report-vehicle",
    name: "EnforcementReportVehicle",
    element: (
      <DefaultLayout>
        <EnforcementReportFunction />
      </DefaultLayout>
    ),
  },
  {
    path: "/enforcement/function/detail-report-vehicle",
    name: "DetailReportVehicle",
    element: (
      <DefaultLayout>
        <DetailReportVehicle />
      </DefaultLayout>
    ),
  },
  {
    path: "/enforcement/function/detect-speeding",
    name: "DetailReportVehicle",
    element: (
      <DefaultLayout>
        <DetectSpeeding />
      </DefaultLayout>
    ),
  },
  {
    path: "/enforcement/function/detect-truck-barrier",
    name: "DetailReportVehicle",
    element: (
      <DefaultLayout>
        <DetectTruckBarrier />
      </DefaultLayout>
    ),
  },
  {
    path: "/enforcement/function/blacklist",
    name: "EnforcementBlacklist",
    element: (
      <DefaultLayout>
        <EnforcementBlacklist />
      </DefaultLayout>
    ),
  },
  {
    path: "/enforcement/function/detect-lane",
    name: "DetectLane",
    element: (
      <DefaultLayout>
        <DetectLane />
      </DefaultLayout>
    ),
  },
  {
    path: "/enforcement/function/detect-parking",
    name: "DetectParking",
    element: (
      <DefaultLayout>
        <DetectParking />
      </DefaultLayout>
    ),
  },
  {
    path: "/enforcement/function/detect-red-light",
    name: "DetectRedLight",
    element: (
      <DefaultLayout>
        <DetectRedLight />
      </DefaultLayout>
    ),
  },
  {
    path: "/enforcement/function/detect-sidewalk",
    name: "DetectSidewalk",
    element: (
      <DefaultLayout>
        <DetectSidewalk />
      </DefaultLayout>
    ),
  },
  {
    path: "/data-collection/function/installation-point",
    name: "InstallationPoint",
    element: (
      <DefaultLayout>
        <InstallationPoint />
      </DefaultLayout>
    ),
  },
  {
    path: "/data-collection/function/license-plate-search",
    name: "LicensePlateSearch",
    element: (
      <DefaultLayout>
        <LicensePlateSearch />
      </DefaultLayout>
    ),
  },
  {
    path: "/data-collection/function/route-analysis",
    name: "RouteAnalysis",
    element: (
      <DefaultLayout>
        <RouteAnalysis />
      </DefaultLayout>
    ),
  },
  {
    path: "/data-collection/function/vehicle-report",
    name: "VehicleReport",
    element: (
      <DefaultLayout>
        <VehicleReport />
      </DefaultLayout>
    ),
  },
  {
    path: "/incident-accident/function/relate-accident",
    name: "RelateAccident",
    element: (
      <DefaultLayout>
        <RelateAccident />
      </DefaultLayout>
    ),
  },
  {
    path: "/incident-accident/function/irregularitie",
    name: "Irregularities",
    element: (
      <DefaultLayout>
        <Irregularities />
      </DefaultLayout>
    ),
  },
  {
    path: "/incident-accident/function/road-obstruction",
    name: "RoadObstruction",
    element: (
      <DefaultLayout>
        <RoadObstruction />
      </DefaultLayout>
    ),
  },
  {
    path: "/incident-accident/function/special-event",
    name: "SpecialEvent",
    element: (
      <DefaultLayout>
        <SpecialEvent />
      </DefaultLayout>
    ),
  },
  {
    path: "/incident-accident/function/hazardous-incident",
    name: "HazardousIncidents",
    element: (
      <DefaultLayout>
        <SpecialHazard />
      </DefaultLayout>
    ),
  },
  {
    path: "/operation-management/function/traffic-signal",
    name: "TrafficSignal",
    element: (
      <DefaultLayout>
        <TrafficSignal />
      </DefaultLayout>
    ),
  },
  {
    path: "/operation-management/function/ambulance",
    name: "Ambulance",
    element: (
      <DefaultLayout>
        <Ambulance />
      </DefaultLayout>
    ),
  },
  {
    path: "/operation-management/function/vip",
    name: "VIP",
    element: (
      <DefaultLayout>
        <VIP />
      </DefaultLayout>
    ),
  },
  {
    path: "/operation-management/function/sequence",
    name: "Sequence",
    element: (
      <DefaultLayout>
        <Sequence />
      </DefaultLayout>
    ),
  },
];

export default routes;
