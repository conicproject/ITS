# backend/app/src/schemas/violation.py
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal
from datetime import datetime, timedelta
from datetime import date as date_type
from enum import Enum

# ===== HELPER FUNCTIONS =====

def get_yesterday() -> str:
    """Get yesterday's date in YYYY-MM-DD format"""
    from datetime import date  # import ภายใน function
    return (date.today() - timedelta(days=1)).isoformat()

def get_yesterday_datetime() -> str:
    """Get yesterday's datetime in ISO format"""
    return (datetime.now() - timedelta(days=1)).replace(hour=10, minute=30, second=0).isoformat()

def get_month_ago() -> str:
    """Get date from 30 days ago"""
    from datetime import date  # import ภายใน function
    return (date.today() - timedelta(days=30)).isoformat()


# ===== ENUMS =====

class DirectionEnum(str, Enum):
    """Direction of traffic flow"""
    IN = 'IN'
    OUT = 'OUT'


# ===== REQUEST MODELS =====

class CreateViolationRequest(BaseModel):
    """Request model for creating a violation record"""
    checkpoint_id: int = Field(..., gt=0, description="Checkpoint ID (must be positive)")
    direction: DirectionEnum = Field(default=DirectionEnum.IN, description="Traffic direction")
    car_type_id: int = Field(..., gt=0, description="Car type ID")
    volume: int = Field(..., ge=0, description="Number of violations (non-negative)")
    time_range_id: int = Field(..., gt=0, description="Time range ID")
    date: date_type = Field(..., description="Date of violation record")  # 🎯 ใช้ date_type
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "checkpoint_id": 34,
                "direction": "IN",
                "car_type_id": 1,
                "volume": 150,
                "time_range_id": 12,
                "date": get_yesterday()
            }
        }
    )


class UpdateViolationRequest(BaseModel):
    """Request model for updating a violation record"""
    checkpoint_id: Optional[int] = Field(None, gt=0)
    direction: Optional[DirectionEnum] = None
    car_type_id: Optional[int] = Field(None, gt=0)
    volume: Optional[int] = Field(None, ge=0)
    time_range_id: Optional[int] = Field(None, gt=0)
    date: Optional[date_type] = None  # 🎯 ใช้ date_type
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "volume": 200,
                "direction": "OUT"
            }
        }
    )


# ===== RESPONSE MODELS =====

class ViolationRecord(BaseModel):
    """Response model for a single violation record"""
    id: int = Field(..., description="Unique violation ID")
    checkpoint_id: int = Field(..., description="Checkpoint ID")
    direction: DirectionEnum = Field(..., description="Traffic direction")
    car_type_id: int = Field(..., description="Car type ID")
    volume: int = Field(..., description="Number of violations")
    time_range_id: int = Field(..., description="Time range ID")
    date: date_type = Field(..., description="Date of record")  # 🎯 ใช้ date_type
    created_at: datetime = Field(..., description="Creation timestamp")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "checkpoint_id": 34,
                "direction": "IN",
                "car_type_id": 1,
                "volume": 150,
                "time_range_id": 12,
                "date": get_yesterday(),
                "created_at": get_yesterday_datetime()
            }
        }
    )


class ViolationListResponse(BaseModel):
    """Response model for list of violations"""
    violations: List[ViolationRecord] = Field(..., description="List of violation records")
    total: int = Field(..., description="Total number of records")
    page: Optional[int] = Field(None, description="Current page number")
    page_size: Optional[int] = Field(None, description="Items per page")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "violations": [
                    {
                        "id": 1,
                        "checkpoint_id": 34,
                        "direction": "IN",
                        "car_type_id": 1,
                        "volume": 150,
                        "time_range_id": 12,
                        "date": get_yesterday(),
                        "created_at": get_yesterday_datetime()
                    }
                ],
                "total": 1,
                "page": 1,
                "page_size": 20
            }
        }
    )


class ViolationDetailResponse(BaseModel):
    """Response model for single violation detail"""
    success: bool = Field(default=True, description="Operation success status")
    violation: ViolationRecord = Field(..., description="Violation record details")
    message: Optional[str] = Field(None, description="Optional message")


# ===== COMMON RESPONSE MODELS =====

class SuccessResponse(BaseModel):
    """Generic success response"""
    success: bool = Field(default=True, description="Operation status")
    message: str = Field(..., description="Success message")
    data: Optional[dict] = Field(None, description="Optional data payload")


class CreatedResponse(BaseModel):
    """Response for successful creation"""
    success: bool = Field(default=True)
    message: str = Field(default="Created successfully")
    id: int = Field(..., description="ID of created record")
    created_at: datetime = Field(default_factory=datetime.now)


class DeletedResponse(BaseModel):
    """Response for successful deletion"""
    success: bool = Field(default=True)
    message: str = Field(default="Deleted successfully")
    deleted_id: int = Field(..., description="ID of deleted record")


class ErrorDetail(BaseModel):
    """Error detail information"""
    field: Optional[str] = Field(None, description="Field name that caused error")
    message: str = Field(..., description="Error message")
    type: Optional[str] = Field(None, description="Error type")


class ErrorResponse(BaseModel):
    """Standard error response"""
    success: bool = Field(default=False)
    error: str = Field(..., description="Error message")
    details: Optional[List[ErrorDetail]] = Field(None, description="Detailed error information")
    timestamp: datetime = Field(default_factory=datetime.now)
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": False,
                "error": "Validation Error",
                "details": [
                    {
                        "field": "checkpoint_id",
                        "message": "checkpoint_id must be positive",
                        "type": "value_error"
                    }
                ],
                "timestamp": get_yesterday_datetime()
            }
        }
    )


# ===== QUERY PARAMS =====

class ViolationQueryParams(BaseModel):
    """Query parameters for filtering violations"""
    checkpoint_id: Optional[int] = Field(None, gt=0, description="Filter by checkpoint")
    direction: Optional[DirectionEnum] = Field(None, description="Filter by direction")
    car_type_id: Optional[int] = Field(None, gt=0, description="Filter by car type")
    date_from: Optional[date_type] = Field(None, description="Start date for filtering")  # 🎯 ใช้ date_type
    date_to: Optional[date_type] = Field(None, description="End date for filtering")  # 🎯 ใช้ date_type
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(20, ge=1, le=100, description="Items per page")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "checkpoint_id": 34,
                "direction": "IN",
                "date_from": get_month_ago(),
                "date_to": get_yesterday(),
                "page": 1,
                "page_size": 20
            }
        }
    )