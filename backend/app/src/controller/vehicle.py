# backend/app/src/controller/vehicle.py

from fastapi import status, Query, Path, Request
from fastapi.responses import JSONResponse
from src.logic.vehicle import TrafficDetailLogic
from src.validators.trafficDetail import TrafficDetailValidator
from src.services.vehicle import VehicleService

class VehicleController:
    def __init__(self):
        self.traffic_detail_validator = TrafficDetailValidator()
        self.traffic_detail_logic = TrafficDetailLogic()
        self.service = VehicleService()

    def get_traffic_detail(self, request: Request, record_type: str):

        type_, datetime_value, checkpoint_id = self.traffic_detail_validator.validate_request(
            params=request.query_params
        )

        response = self.traffic_detail_logic.get_data(
            type=type_, datetime_value=datetime_value, checkpoint_id=checkpoint_id, record_type=record_type
        )
        checkpoint_detail = self.traffic_detail_logic.get_checkpoint_detail(
            checkpoint_id=checkpoint_id
        )
        response['checkpoint'] = checkpoint_detail

        return JSONResponse(content=response, status_code=status.HTTP_200_OK)
    
    def get_data_collection_dashboard(self, filters: dict = None):
        return self.service.get_data_collection_dashboard(filters)
    
    def service_vehicle_5m(self, filters: dict = None):
        return self.service.service_vehicle_5m(filters)
