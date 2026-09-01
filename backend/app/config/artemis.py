# backend/app/src/config/artemis.py
import os

ARTEMIS_HOST = os.getenv("ARTEMIS_HOST_IP", "10.110.1.12:443")
ARTEMIS_APP_KEY = os.getenv("ARTEMIS_APP_KEY", "26809411")
ARTEMIS_APP_SECRET = os.getenv("ARTEMIS_APP_SECRET", "185g95WVReEBqaEh5qGy")