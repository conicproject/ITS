# backend/app/src/repositories/open_api.py
import requests
import logging

logger = logging.getLogger(__name__)

class OpenAPIRepository:
    def __init__(self):
        self.base_url = "https://10.151.1.76:443"

    def get_auth(self):
        url = f"{self.base_url}/artemis/oauth/token"

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        }

        data = {
            "grant_type": "client_credentials",
            "client_id": "25239392",
            "client_secret": "JSyWspAtKjCvzDdFgE3F",
        }

        response = requests.post(
            url,
            data=data,
            headers=headers,
            verify=False,
            timeout=30
        )

        if response.status_code != 200:
            raise Exception(response.text)

        return response.json()

    def get_vehicle_data(
        self,
        token: str,
        start_time: str,
        end_time: str,
        page_no: int,
        page_size: int = 500
    ):
        url = f"{self.base_url}/artemis/api/aiapplication/v1/vehicle/data/query"

        headers = {
            "Content-Type": "application/json",
            "access_token": token,
        }

        payload = {
            "data": {
                "plateNo": "",
                "beginTime": start_time,
                "endTime": end_time,
                "crossIndexCodes": "",
                "laneNo": "",
                "plateProvince": "",
                "queryType": "vehiclealarm",
            },
            "metadata": {
                "pageNo": page_no,
                "pageSize": page_size,
            }
        }

        try:
            response = requests.post(
                url,
                json=payload,
                headers=headers,
                verify=False,
                timeout=30
            )

            if response.status_code != 200:
                raise Exception(response.text)

            return response.json()

        except requests.exceptions.Timeout:
            raise Exception("0x02401033 backend timeout")