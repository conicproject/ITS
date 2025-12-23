from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from fastapi import HTTPException

class TrafficDetailValidator:

    def __init__(self):
        self.date_format = "%Y-%m-%d"
        self.month_format = "%Y-%m"
        self.year_format = "%Y"
        self.time_types = ['day', 'week', 'month', 'year', 'range']
        self.max_days_range = 14
        self.min_days_range = 1

        self.missing_date_field = 'date field required'
        self.missing_type_field = 'type field required'
        self.missing_checkpoint_field = 'checkpoint field required'

        self.incorrect_time_format = 'incorrect format'
        self.incorrect_time_value = 'incorrect value'
        self.incorrect_type_value = 'incorrect value'
        self.start_date_not_monday = 'start date should be monday'

        self.start_date_gte_end_date = "start date can't be greater than or equal to end date"
        self.out_of_max_range = 'date range allow only 1-14 days'

    # --------------------- Core Validators ---------------------
    def __raise_400(self, message):
        raise HTTPException(status_code=400, detail=message)

    def __validate_date_format(self, date_str):
        try:
            return datetime.strptime(date_str, self.date_format).date()
        except:
            self.__raise_400(self.incorrect_time_format)

    def __validate_date_value(self, date_):
        today = datetime.now().date()
        if date_ >= today:
            self.__raise_400(self.incorrect_time_value)

    def __validate_week_format(self, start_date):
        try:
            return datetime.strptime(start_date, self.date_format)
        except:
            self.__raise_400(self.incorrect_time_format)

    def __validate_is_monday(self, dt):
        if dt.weekday() != 0:
            self.__raise_400(self.start_date_not_monday)

    def __validate_week_value(self, dt):
        end_dt = dt + timedelta(days=7)
        if end_dt >= datetime.now():
            self.__raise_400(self.incorrect_time_value)
        return end_dt

    def __validate_month_format(self, month_value):
        try:
            dt = datetime.strptime(month_value, self.month_format)
            return dt, dt.month, dt.year
        except:
            self.__raise_400(self.incorrect_time_format)

    def __validate_month_value(self, month, year):
        now = datetime.now()
        if year > now.year or (year == now.year and month > now.month):
            self.__raise_400(self.incorrect_time_value)

    def __validate_year_format(self, year_value):
        try:
            return int(year_value)
        except:
            self.__raise_400(self.incorrect_time_format)

    def __validate_year_value(self, year_value):
        now_year = datetime.now().year
        if year_value > now_year:
            self.__raise_400(self.incorrect_time_value)

    def __validate_range_format(self, range_value):
        try:
            start_str, end_str = range_value.split(',')
            start_date = datetime.strptime(start_str, self.date_format).date()
            end_date = datetime.strptime(end_str, self.date_format).date()
            return start_date, end_date
        except:
            self.__raise_400(self.incorrect_time_format)

    def __validate_range_limitation(self, start_date, end_date):
        days_range = (end_date - start_date).days
        if not (self.min_days_range <= days_range <= self.max_days_range):
            self.__raise_400(self.out_of_max_range)

    def __validate_start_end_date(self, start_date, end_date):
        if start_date >= end_date:
            self.__raise_400(self.start_date_gte_end_date)

    def __validate_enddate_value(self, end_date):
        today = datetime.now().date()
        if end_date >= today:
            self.__raise_400(self.incorrect_time_value)

    def __validate_type_field(self, params):
        if 'type' not in params:
            self.__raise_400(self.missing_type_field)
        return params['type']

    def __validate_type_value(self, time_type):
        if time_type not in self.time_types:
            self.__raise_400(self.incorrect_type_value)

    def __validate_date_field(self, params):
        if 'date' not in params:
            self.__raise_400(self.missing_date_field)
        return params['date']

    def __validate_checkpoint_field(self, params):
        if 'checkpoint' not in params:
            self.__raise_400(self.missing_checkpoint_field)
        return params['checkpoint']

    def __validate_checkpoint_id(self, checkpoint_id):
        try:
            return int(checkpoint_id)
        except:
            self.__raise_400(self.incorrect_time_format)

    # --------------------- Type Validators ---------------------
    def validate_type_day(self, datetime_value):
        date_ = self.__validate_date_format(datetime_value)
        self.__validate_date_value(date_)
        return date_

    def validate_type_week(self, datetime_value):
        start_dt = self.__validate_week_format(datetime_value)
        self.__validate_is_monday(start_dt)
        end_dt = self.__validate_week_value(start_dt)
        return start_dt.date(), end_dt.date()

    def validate_type_month(self, datetime_value):
        dt, month, year = self.__validate_month_format(datetime_value)
        self.__validate_month_value(month, year)
        start_date = dt.date()
        end_date = start_date + relativedelta(months=1)
        return start_date, end_date

    def validate_type_year(self, datetime_value):
        year_value = self.__validate_year_format(datetime_value)
        self.__validate_year_value(year_value)
        return year_value

    def validate_type_range(self, datetime_value):
        start_date, end_date = self.__validate_range_format(datetime_value)
        self.__validate_start_end_date(start_date, end_date)
        self.__validate_enddate_value(end_date)
        self.__validate_range_limitation(start_date, end_date)
        end_date += timedelta(days=1)  # inclusive
        return start_date, end_date

    # --------------------- Request Validators ---------------------
    def validate_report_request(self, params):
        time_type = self.__validate_type_field(params)
        datetime_value = self.__validate_date_field(params)
        self.__validate_type_value(time_type)
        return time_type, datetime_value

    def validate_request(self, params):
        time_type = self.__validate_type_field(params)
        datetime_value = self.__validate_date_field(params)
        checkpoint = self.__validate_checkpoint_field(params)
        self.__validate_type_value(time_type)
        checkpoint_id = self.__validate_checkpoint_id(checkpoint)
        return time_type, datetime_value, checkpoint_id
