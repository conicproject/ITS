// src/routes.jsx - อัพเดทให้ใช้ ProtectedRoute
import Home from "./pages/Home";
import ManageUser from "./pages/ManageUser";
import Login from "./pages/Login";
import Overview from "./pages/Overview/dashboard";
import DefaultLayout from "./layouts/DefaultLayout";
import ProtectedRoute from "./components/ProtectedRoute";
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
import RouteAnalysis from "./pages/DataCollection/function/route-analysis";
import VehicleReport from "./pages/DataCollection/function/vehicle.report";
import TrafficSignal from "./pages/DataCollection/function/traffic-signal";
import RelateAccident from "./pages/IncidentAccident/function/relate-accident";
import Irregularities from "./pages/IncidentAccident/function/irregularitie";
import RoadObstruction from "./pages/IncidentAccident/function/road-obstruction";
import SpecialEvent from "./pages/IncidentAccident/function/special-event";
import SpecialHazard from "./pages/IncidentAccident/function/special-hazard";
import Ambulance from "./pages/OperationManagement/function/Ambulance";
import VIP from "./pages/OperationManagement/function/vip";
import Sequence from "./pages/OperationManagement/function/sequence";
import DetectChangeLane from "./pages/Enforcement/function/detect-change-lane";
import DetectHelmet from "./pages/Enforcement/function/detect-helmet";
import DetectOverLine from "./pages/Enforcement/function/detect-over-line";
import DetectPhone from "./pages/Enforcement/function/detect-phone";
import DetectReverse from "./pages/Enforcement/function/detect-reverse";
import DetectSeatBelt from "./pages/Enforcement/function/detect-seatbelt";
import DetectSignTraffic from "./pages/Enforcement/function/detect-sign-traffic";
import DetectStopCrosswalk from "./pages/Enforcement/function/detect-stop-crosswalk";
import DetectStopZone from "./pages/Enforcement/function/detect-stop-zone";
import DetectUturn from "./pages/Enforcement/function/detect-uturn";
import ViolationSearch from "./pages/Enforcement/function/violation-search";
import OverviewFunction from "./pages/Overview/function";
import InstallationPoint from "./pages/Overview/function/installation-point"
import LicensePlateSearch from "./pages/Overview/function/license-plate-search";
import AuthorizationFunction from "./pages/Authorization/function";
import BlacklistFunction from "./pages/Authorization/function/blacklist/blacklist";
import GreenlistFunction from "./pages/Authorization/function/greenlist/greenlist";
import TaxFunction from "./pages/Authorization/function/tax/tax";
import AmbulanceFunction from "./pages/Authorization/function/ambulance/ambulance";
import VipFunction from "./pages/Authorization/function/vip/vip";
import DetectBlacklist from "./pages/Authorization/function/blacklist/function/detect-blacklist";
import ManageBlacklist from "./pages/Authorization/function/blacklist/function/manage-blacklist";
import DetectGreenlist from "./pages/Authorization/function/greenlist/function/detect-greenlist";
import ManageGreenlist from "./pages/Authorization/function/greenlist/function/manage-greenlist";
import DetectTax from "./pages/Authorization/function/tax/function/detect-tax";
import ManageTax from "./pages/Authorization/function/tax/function/manage-tax";
import DetectAmbulance from "./pages/Authorization/function/ambulance/function/detect-ambulance";
import ManageAmbulance from "./pages/Authorization/function/ambulance/function/manage-ambulance";
import DetectVip from "./pages/Authorization/function/vip/function/detect-vip";
import ManageVip from "./pages/Authorization/function/vip/function/manage-vip";


const routes = [   
  {
    path: "/",
    name: "Login",
    element: <Login />,
  },
  {
    path: "/manageuser",
    name: "ManageUser",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <ManageUser />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/home",
    name: "Home",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <Home />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/overview/dashboard",
    name: "OverviewDashboard",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <Overview />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/overview/function",
    name: "OverviewFunction",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <OverviewFunction />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/overview/function/installation-point",
    name: "InstallationPoint",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <InstallationPoint />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/overview/function/license-plate-search",
    name: "LicensePlateSearch",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <LicensePlateSearch />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/dashboard",
    name: "EnforcementDashboard",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <EnforcementDashboard />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function",
    name: "EnforcementFunction",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <EnforcementFunction />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/data-collection/dashboard",
    name: "DataCollectionDashboard",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DataCollectionDashboard />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/data-collection/function",
    name: "DataCollectionFunction",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DataCollectionFunction />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/operation-management/dashboard",
    name: "OperationManagementDashboard",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <OperationManagementDashboard />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/operation-management/function",
    name: "OperationManagementFunction",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <OperationManagementFunction />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/incident-accident/dashboard",
    name: "IncidentAccidentDashboard",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <IncidentAccidentDashboard />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/incident-accident/function",
    name: "IncidentAccidentFunction",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <IncidentAccidentFunction />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/report-vehicle",
    name: "EnforcementReportVehicle",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <EnforcementReportFunction />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detail-report-vehicle",
    name: "DetailReportVehicle",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetailReportVehicle />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-speeding",
    name: "DetectSpeeding",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectSpeeding />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-truck-barrier",
    name: "DetectTruckBarrier",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectTruckBarrier />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/blacklist",
    name: "EnforcementBlacklist",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <EnforcementBlacklist />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-lane",
    name: "DetectLane",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectLane />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-parking",
    name: "DetectParking",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectParking />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-red-light",
    name: "DetectRedLight",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectRedLight />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-sidewalk",
    name: "DetectSidewalk",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectSidewalk />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-change-lane",
    name: "DetectChangeLane",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectChangeLane />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-helmet",
    name: "DetectHelmet",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectHelmet />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-over-line",
    name: "DetectOverLine",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectOverLine />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-phone",
    name: "DetectPhone",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectPhone />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-reverse",
    name: "DetectReverse",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectReverse />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-seatbelt",
    name: "DetectSeatBelt",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectSeatBelt />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-sign-traffic",
    name: "DetectSignTraffic",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectSignTraffic />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-stop-crosswalk",
    name: "DetectStopCrosswalk",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectStopCrosswalk />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-stop-zone",
    name: "DetectStopZone",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectStopZone />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/detect-uturn",
    name: "DetectUturn",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectUturn />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/enforcement/function/violation-search",
    name: "ViolationSearch",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <ViolationSearch />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/data-collection/function/route-analysis",
    name: "RouteAnalysis",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <RouteAnalysis />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/data-collection/function/vehicle-report",
    name: "VehicleReport",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <VehicleReport />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/data-collection/function/traffic-signal",
    name: "TrafficSignal",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <TrafficSignal />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/incident-accident/function/relate-accident",
    name: "RelateAccident",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <RelateAccident />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/incident-accident/function/irregularitie",
    name: "Irregularities",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <Irregularities />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/incident-accident/function/road-obstruction",
    name: "RoadObstruction",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <RoadObstruction />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/incident-accident/function/special-event",
    name: "SpecialEvent",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <SpecialEvent />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/incident-accident/function/hazardous-incident",
    name: "HazardousIncidents",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <SpecialHazard />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/operation-management/function/ambulance",
    name: "Ambulance",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <Ambulance />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/operation-management/function/vip",
    name: "VIP",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <VIP />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/operation-management/function/sequence",
    name: "Sequence",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <Sequence />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function",
    name: "AuthorizationFunction",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <AuthorizationFunction />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/blacklist-function",
    name: "Blacklistfunction",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <BlacklistFunction />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/detect-blacklist",
    name: "DetectBlacklist",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectBlacklist />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/manage-blacklist",
    name: "ManageBlacklist",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <ManageBlacklist />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/greenlist-function",
    name: "Greenlistfunction",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <GreenlistFunction />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/detect-greenlist",
    name: "DetectGreenlist",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectGreenlist />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/manage-greenlist",
    name: "ManageGreenlist",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <ManageGreenlist />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/tax-function",
    name: "Taxfunction",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <TaxFunction />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/detect-tax",
    name: "DetectTax",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectTax />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/manage-tax",
    name: "ManageTax",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <ManageTax />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/ambulance-function",
    name: "Ambulancefunction",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <AmbulanceFunction />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/detect-ambulance",
    name: "DetectAmbulance",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectAmbulance />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/manage-ambulance",
    name: "ManageAmbulance",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <ManageAmbulance />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/vip-function",
    name: "Vipfunction",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <VipFunction />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/detect-vip",
    name: "DetectVip",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <DetectVip />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/authorization/function/manage-vip",
    name: "ManageVip",
    element: (
      <ProtectedRoute>
        <DefaultLayout>
          <ManageVip />
        </DefaultLayout>
      </ProtectedRoute>
    ),
  },
];

export default routes;