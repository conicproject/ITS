from cgi import test
import datetime
import pandas as pd
import numpy as np
from dateutil.relativedelta import relativedelta
from src.repositories.violation import ViolationRepository
from src.validators.trafficDetail import TrafficDetailValidator
from src.repositories.timeRange import TimeRangeRepository
from src.repositories.record import RecordRepository
from src.repositories.oracleCheckpoint import OracleCheckpointRepository
from src.repositories.oracleVehicleType import OracleVehicleTypeRepository

class TrafficDetailLogic:

    def __init__(self):
        self.date_format = "%Y-%m-%d"
        self.type = ['day', 'week', 'month', 'year', 'range']
        self.day_range = 288
        self.hour_range = 12
        self.last_time_range = 288

        self.record_repository = RecordRepository()
        self.violation_repository = ViolationRepository()
        self.time_range_repository = TimeRangeRepository()
        self.traffic_detail_validator = TrafficDetailValidator()
        self.checkpoint_repo = OracleCheckpointRepository()
        self.vehicle_type_repo = OracleVehicleTypeRepository()


    def get_checkpoint_detail(self, checkpoint_id):
        checkpoint_detail = self.checkpoint_repo.get_by_id(id=checkpoint_id)

        return checkpoint_detail


    def get_time_range_data(self):
        time_ranges = self.time_range_repository.get_all()
        time_range_ids = [ time_range['id'] for time_range in time_ranges ]
        time_range_end_times = [ time_range['end_time'] for time_range in time_ranges ]

        return time_range_ids, time_range_end_times

    def get_day_data(self, date, checkpoint_id,record_type):
        car_type_list_id = self.vehicle_type_repo.get_list_id()
        car_type_list_name = self.vehicle_type_repo.get_list_name()
        car_type_unique_name = self.vehicle_type_repo.get_list_active_name()
        
        if(record_type == '0'):
            query_data = self.record_repository.get_by_date(
                        date=date, checkpoint_id=checkpoint_id
                )
        elif(record_type == '1'):
            query_data = self.violation_repository.get_by_date(
                        date=date, checkpoint_id=checkpoint_id
                )
            total_all_type = self.violation_repository.get_volume_by_date(
                date=date, checkpoint_id=checkpoint_id
            )
            total_car = sum(d['volume'] for d in total_all_type)
            dfRecord = pd.DataFrame(total_all_type)
            dfRecord = dfRecord.rename(
                columns={
                    'time_range_id': 'time',
                    'car_type_id': 'car_type'
                }
            )
            dfRecord['car_type'] = dfRecord['car_type'].replace(
                car_type_list_id, car_type_list_name
            )
            dfRecord = dfRecord[['direction', 'time', 'car_type','date', 'volume']].groupby(by=['direction', 'car_type', 'time','date']).sum()
            dfRecord = dfRecord.reset_index()
            dfRecord['pcu'] = 0
            name_pcu_list = self.vehicle_type_repo.get_list_active_name_pcu()

            for item_data in name_pcu_list:
                dfRecord.loc[dfRecord['car_type'] == item_data['name'], 'pcu'] = item_data['pcu']
        
        
        df = pd.DataFrame(query_data)
        df = df.rename(
            columns={
                'time_range_id': 'time',
                'car_type_id': 'car_type'
            }
        )
        df['car_type'] = df['car_type'].replace(
            car_type_list_id, car_type_list_name
        )

        df = df[['direction', 'time', 'car_type', 'date', 'volume']].groupby(by=['direction', 'car_type', 'time', 'date']).sum()
        df = df.reset_index()

        df['pcu'] = 0
        name_pcu_list = self.vehicle_type_repo.get_list_active_name_pcu()

        for item_data in name_pcu_list:
            df.loc[df['car_type'] == item_data['name'], 'pcu'] = item_data['pcu']

        time_range_ids, time_range_end_times = self.get_time_range_data()
        zero_value = len(df[df['volume'].isin([0])].index)

        if zero_value != len(df.index):
            ## total, inbound_total, outbound_total
            total = df['volume'].sum()
            inbound_total = df[df['direction'] == 'IN']['volume'].sum()
            outbound_total = df[df['direction'] == 'OUT']['volume'].sum()

            df_car_type = df[['car_type', 'volume']].groupby(by='car_type').sum()
            df_car_type = df_car_type.reset_index()
            df_car_type['percent'] = (df_car_type['volume'] / df_car_type['volume'].sum()) * 100

            car_type_data = df_car_type[['car_type', 'volume','percent']].to_dict('records')
            car_type_percent_data = df_car_type[['car_type', 'percent']].to_dict('records')

            # graph
            df_graph_ = df[['direction', 'time', 'date', 'volume']].groupby(by=['direction', 'time', 'date']).sum()
            df_graph_ = df_graph_.reset_index()

            df_volume = df_graph_[['volume']].groupby(df_graph_.index // self.hour_range).sum()
            df_graph = df_graph_[df_graph_.index % self.hour_range == (self.hour_range - 1)]

            # return  df_volume
            df_graph['volume'] = df_volume['volume'].to_list()
            df_graph[['time']] = df_graph[['time']].replace(
                time_range_ids, time_range_end_times
            )


            df_graph[['time']] = df_graph[['time']].replace('00:00', '24:00')

            df_graph_inbound = df_graph[df_graph['direction'] == 'IN'][['time', 'date', 'volume']]
            graph_inbound_data = df_graph_inbound.to_dict('records')

            df_graph_outbound = df_graph[df_graph['direction'] == 'OUT'][['time', 'date', 'volume']]
            graph_outbound_data = df_graph_outbound.to_dict('records')


            report_data = {
                'inbound': {},
                'outbound': {}
            }

            for car_type in car_type_unique_name:
                report_car_type = df[(df['car_type'] == car_type) & (df['direction'] == 'IN')].sort_values(by=['time'])
                report_car_type = report_car_type.reset_index(drop=True)
                report_car_type = report_car_type[['time', 'date', 'volume']]

                volume_car_type = report_car_type[['volume']].groupby(report_car_type.index // self.hour_range).sum()
                report_car_type = report_car_type[report_car_type.index % self.hour_range == (self.hour_range - 1)]
                report_car_type['volume'] = volume_car_type['volume'].to_list()
                report_car_type[['time']] = report_car_type[['time']].replace(
                    time_range_ids, time_range_end_times
                )
                
                report_car_type[['time']] = report_car_type[['time']].replace('00:00', '24:00')
                report_data['inbound'][car_type] = {}

                report_data['inbound'][car_type]['data'] = report_car_type.to_dict('records')
                report_data['inbound'][car_type]['total'] = report_car_type['volume'].sum()
                if(record_type == '1'):
                    report_car_type_record = dfRecord[(dfRecord['car_type'] == car_type) & (dfRecord['direction'] == 'IN')]
                    report_car_type_record = report_car_type_record[['date', 'volume']]
                    total_by_cat = report_car_type_record['volume'].sum()
                    if(total_by_cat > 0):
                        report_data['inbound'][car_type]['percent'] =  (report_car_type['volume'].sum()/total_by_cat)*100
                    else:
                        report_data['inbound'][car_type]['percent'] = 0



            ## pcu inbound
            df_pcu = df[df['direction'] == 'IN']
            df_pcu = df_pcu[['time', 'date', 'car_type', 'volume', 'pcu']].groupby(by=['car_type', 'time', 'date','pcu']).sum()
            df_pcu = df_pcu.reset_index()

            pcu_value = df_pcu.volume * df_pcu.pcu
            df_pcu['pcu_value'] = pcu_value

            df_pcu = df_pcu[['time', 'date', 'pcu_value']].groupby(by=['time', 'date']).sum()
            df_pcu = df_pcu.reset_index()
            df_pcu = df_pcu.rename(columns={
                'pcu_value': 'volume'
            })

            volume_pcu = df_pcu[['volume']].groupby(df_pcu.index // self.hour_range).sum()
            df_pcu = df_pcu[df_pcu.index % self.hour_range == (self.hour_range - 1)]
            df_pcu['volume'] = volume_pcu['volume'].to_list()
            df_pcu[['time']] = df_pcu[['time']].replace(
                time_range_ids, time_range_end_times
            )
            df_pcu[['time']] = df_pcu[['time']].replace('00:00', '24:00')

            pcu = df_pcu.to_dict('records')
            report_data['inbound']['pcu'] = {}
            report_data['inbound']['pcu']['data'] = pcu
            report_data['inbound']['pcu']['total'] = df_pcu['volume'].sum()
            if(record_type == '1'):
                df_pcu_record = dfRecord[dfRecord['direction'] == 'IN']
                df_pcu_record = df_pcu_record[['time','date', 'car_type', 'volume', 'pcu']].groupby(by=['car_type','time','date','pcu']).sum()
                df_pcu_record = df_pcu_record.reset_index()

                pcu_record_value = df_pcu_record.volume * df_pcu_record.pcu
                df_pcu_record['pcu_value'] = pcu_record_value
                df_pcu_record = df_pcu_record[['time','date','pcu_value']].groupby(by=['time','date']).sum()
                df_pcu_record = df_pcu_record.reset_index()
                df_pcu_record = df_pcu_record.rename(columns={
                    'pcu_value': 'volume'
                })
                total_by_cat = df_pcu_record['volume'].sum()
                if(total_by_cat > 0):
                    report_data['inbound']['pcu']['percent'] =  (df_pcu['volume'].sum()/total_by_cat)*100
                else:
                    report_data['inbound']['pcu']['percent'] = 0


            ## total group by time inbound
            df_total = df[df['direction'] == 'IN']
            df_total = df_total[['time', 'date', 'volume',]].groupby(by=['time', 'date']).sum()
            df_total = df_total.reset_index()

            volume_total = df_total[['volume']].groupby(df_total.index // self.hour_range).sum()
            df_total = df_total[df_total.index % self.hour_range == (self.hour_range - 1)]
            df_total['volume'] = volume_total['volume'].to_list()
            df_total[['time']] = df_total[['time']].replace(
                time_range_ids, time_range_end_times
            )
            df_total[['time']] = df_total[['time']].replace('00:00', '24:00')

            total_by_time = df_total.to_dict('records')
            report_data['inbound']['total'] = {}
            report_data['inbound']['total']['data'] = total_by_time
            report_data['inbound']['total']['total'] = df_total['volume'].sum()
            if(record_type == '1'):
                df_record_total = dfRecord[dfRecord['direction'] == 'IN']
                df_record_total = df_record_total[['time','date', 'volume']].groupby(by=['time','date']).sum()
                df_record_total = df_record_total.reset_index()
                total_by_cat = df_record_total['volume'].sum()
                if(total_by_cat > 0):
                    report_data['inbound']['total']['percent'] =  (df_total['volume'].sum()/total_by_cat)*100
                else:
                    report_data['inbound']['total']['percent'] = 0


            for car_type in car_type_unique_name:
                report_car_type = df[(df['car_type'] == car_type) & (df['direction'] == 'OUT')].sort_values(by=['time'])
                report_car_type = report_car_type.reset_index(drop=True)
                report_car_type = report_car_type[['time', 'date', 'volume']]

                volume_car_type = report_car_type[['volume']].groupby(report_car_type.index // self.hour_range).sum()
                report_car_type = report_car_type[report_car_type.index % self.hour_range == (self.hour_range - 1)]
                report_car_type['volume'] = volume_car_type['volume'].to_list()
                report_car_type[['time']] = report_car_type[['time']].replace(
                    time_range_ids, time_range_end_times
                )

                report_car_type[['time']] = report_car_type[['time']].replace('00:00', '24:00')
                report_data['outbound'][car_type] = {}

                report_data['outbound'][car_type]['data'] = report_car_type.to_dict('records')
                report_data['outbound'][car_type]['total'] = report_car_type['volume'].sum()
                if(record_type == '1'):
                    report_car_type_record = dfRecord[(dfRecord['car_type'] == car_type) & (dfRecord['direction'] == 'OUT')]
                    report_car_type_record = report_car_type_record[['date', 'volume']]
                    total_by_cat = report_car_type_record['volume'].sum()
                    if(total_by_cat > 0):
                        report_data['outbound'][car_type]['percent'] =  (report_car_type['volume'].sum()/total_by_cat)*100
                    else:
                        report_data['outbound'][car_type]['percent'] = 0


            ## pcu outbound
            df_pcu = df[df['direction'] == 'OUT']
            df_pcu = df_pcu[['time', 'date', 'car_type', 'volume', 'pcu']].groupby(by=['car_type', 'time', 'date','pcu']).sum()
            df_pcu = df_pcu.reset_index()

            pcu_value = df_pcu.volume * df_pcu.pcu
            df_pcu['pcu_value'] = pcu_value

            df_pcu = df_pcu[['time', 'date', 'pcu_value']].groupby(by=['time', 'date']).sum()
            df_pcu = df_pcu.reset_index()
            df_pcu = df_pcu.rename(columns={
                'pcu_value': 'volume'
            })

            volume_pcu = df_pcu[['volume']].groupby(df_pcu.index // self.hour_range).sum()
            df_pcu = df_pcu[df_pcu.index % self.hour_range == (self.hour_range - 1)]
            df_pcu['volume'] = volume_pcu['volume'].to_list()
            df_pcu[['time']] = df_pcu[['time']].replace(
                time_range_ids, time_range_end_times
            )
            df_pcu[['time']] = df_pcu[['time']].replace('00:00', '24:00')

            pcu = df_pcu.to_dict('records')
            report_data['outbound']['pcu'] = {}
            report_data['outbound']['pcu']['data'] = pcu
            report_data['outbound']['pcu']['total'] = df_pcu['volume'].sum()
            if(record_type == '1'):
                df_pcu_record = dfRecord[dfRecord['direction'] == 'OUT']
                df_pcu_record = df_pcu_record[['time','date', 'car_type', 'volume', 'pcu']].groupby(by=['car_type','time','date','pcu']).sum()
                df_pcu_record = df_pcu_record.reset_index()

                pcu_record_value = df_pcu_record.volume * df_pcu_record.pcu
                df_pcu_record['pcu_value'] = pcu_record_value
                df_pcu_record = df_pcu_record[['time','date','pcu_value']].groupby(by=['time','date']).sum()
                df_pcu_record = df_pcu_record.reset_index()
                df_pcu_record = df_pcu_record.rename(columns={
                    'pcu_value': 'volume'
                })
                total_by_cat = df_pcu_record['volume'].sum()
                if(total_by_cat > 0):
                    report_data['outbound']['pcu']['percent'] =  (df_pcu['volume'].sum()/total_by_cat)*100
                else:
                    report_data['outbound']['pcu']['percent'] = 0


            ## total group by time outbound
            df_total = df[df['direction'] == 'OUT']
            df_total = df_total[['time', 'date', 'volume',]].groupby(by=['time', 'date']).sum()
            df_total = df_total.reset_index()

            volume_total = df_total[['volume']].groupby(df_total.index // self.hour_range).sum()
            df_total = df_total[df_total.index % self.hour_range == (self.hour_range - 1)]
            df_total['volume'] = volume_total['volume'].to_list()
            df_total[['time']] = df_total[['time']].replace(
                time_range_ids, time_range_end_times
            )
            df_total[['time']] = df_total[['time']].replace('00:00', '24:00')

            total_by_time = df_total.to_dict('records')
            report_data['outbound']['total'] = {}
            report_data['outbound']['total']['data'] = total_by_time
            report_data['outbound']['total']['total'] = df_total['volume'].sum()
            if(record_type == '1'):
                df_record_total = dfRecord[dfRecord['direction'] == 'OUT']
                df_record_total = df_record_total[['time','date', 'volume']].groupby(by=['time','date']).sum()
                df_record_total = df_record_total.reset_index()
                total_by_cat = df_record_total['volume'].sum()
                if(total_by_cat > 0):
                    report_data['outbound']['total']['percent'] =  (df_total['volume'].sum()/total_by_cat)*100
                else:
                    report_data['outbound']['total']['percent'] = 0

            if(record_type == '1'):
                data = {
                    'total': total,
                    'graph_inside' :{
                        'violation': (total/total_car)*100,
                        'normal': ((total_car/total_car)*100) - ((total/total_car)*100)
                    },
                    'direction': {
                        'inbound': inbound_total,
                        'outbound': outbound_total
                    },
                    'car_type': {
                        'volume': car_type_data,
                        'percent': car_type_percent_data
                    },
                    'graph': {
                        'inbound': graph_inbound_data,
                        'outbound': graph_outbound_data
                    },
                    'report': report_data
                }
            elif(record_type == '0'):
                data = {
                    'total': total,
                    'direction': {
                        'inbound': inbound_total,
                        'outbound': outbound_total
                    },
                    'car_type': {
                        'volume': car_type_data,
                        'percent': car_type_percent_data
                    },
                    'graph': {
                        'inbound': graph_inbound_data,
                        'outbound': graph_outbound_data
                    },
                    'report': report_data
                }
        
        else:
            time_range_hours_list = [
                '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
                '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
                '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
                '21:00', '22:00', '23:00', '24:00'
            ]

            car_type_data = {
                'volume': [],
                'percent': []
            }

            for car_type in car_type_unique_name:
                volume_data = {
                    'car_type': car_type,
                    'volume': 0
                }
                percent_data = {
                    'car_type': car_type,
                    'percent': 0
                }

                car_type_data['volume'].append(volume_data)
                car_type_data['percent'].append(percent_data)

            graph = {
                'inbound': [],
                'outbound': []
            }

            for hour in time_range_hours_list:
                inbound_data = {
                    'time': hour,
                    'date': date,
                    'volume': 0
                }
                outbound_data = {
                    'time': hour,
                    'date': date,
                    'volume': 0
                }

                graph['inbound'].append(inbound_data)
                graph['outbound'].append(outbound_data)
            
            report = {
                'inbound': {},
                'outbound': {}
            }

            car_type_unique_name.extend(['pcu', 'total'])
            report_config_list = car_type_unique_name
            
            for config in report_config_list:
                report['inbound'][config] = {
                    'data': [],
                    'total': 0
                }
                report['outbound'][config] = {
                    'data': [],
                    'total': 0
                }

                for hour in time_range_hours_list:
                    inbound_data = {
                        'time': hour,
                        'date': date,
                        'volume': 0
                    }
                    outbound_data = {
                        'time': hour,
                        'date': date,
                        'volume': 0
                    }

                    report['inbound'][config]['data'].append(inbound_data)
                    report['outbound'][config]['data'].append(outbound_data)
            if(record_type == '1'):
                data = {
                    'total': 0,
                    'graph_inside' :{
                        'violation': 0,
                        'normal': 0
                    },
                    'direction': {
                        'inbound': 0,
                        'outbound': 0
                    },
                    'car_type': car_type_data,
                    'graph': graph,
                    'report': report
                }
            elif(record_type == '0'):
                 data = {
                    'total': 0,
                    'direction': {
                        'inbound': 0,
                        'outbound': 0
                    },
                    'car_type': car_type_data,
                    'graph': graph,
                    'report': report
                }

        return data


    def get_day_range_data(self, start_date, end_date, checkpoint_id,record_type):
        
        car_type_list_id = self.vehicle_type_repo.get_list_id()
        car_type_list_name = self.vehicle_type_repo.get_list_name()
        car_type_unique_name = self.vehicle_type_repo.get_list_active_name()

        if(record_type == '0'):
            query_data = self.record_repository.get_by_date_range(
                        start_date=start_date, end_date=end_date, checkpoint_id=checkpoint_id
                )
        elif(record_type == '1'):
            query_data = self.violation_repository.get_by_date_range(
                        start_date=start_date, end_date=end_date, checkpoint_id=checkpoint_id
                )
            total_all_type = self.violation_repository.get_volume_by_date_range(
                start_date=start_date, end_date=end_date, checkpoint_id=checkpoint_id
            )
            total_car = sum(d['volume'] for d in total_all_type)
            dfRecord = pd.DataFrame(total_all_type)
            dfRecord = dfRecord.rename(
                columns={
                    'car_type_id': 'car_type'
                }
            )
            dfRecord['car_type'] = dfRecord['car_type'].replace(
                car_type_list_id, car_type_list_name
            )
            dfRecord = dfRecord[['direction', 'car_type','date', 'volume']].groupby(by=['direction', 'car_type','date']).sum()
            dfRecord = dfRecord.reset_index()
            dfRecord['pcu'] = 0
            name_pcu_list = self.vehicle_type_repo.get_list_active_name_pcu()

            for item_data in name_pcu_list:
                dfRecord.loc[dfRecord['car_type'] == item_data['name'], 'pcu'] = item_data['pcu']
            zero_record_value = len(dfRecord[dfRecord['volume'].isin([0])].index)
        

        ## to dataframe
        df = pd.DataFrame(query_data)
        df = df.rename(
            columns={
                'time_range_id': 'time',
                'car_type_id': 'car_type'
            }
        )
        df['car_type'] = df['car_type'].replace(
            car_type_list_id, car_type_list_name
        )
        df = df[['direction', 'car_type', 'date', 'volume']].groupby(by=['direction', 'car_type', 'date']).sum()
        df = df.reset_index()

        df['pcu'] = 0
        name_pcu_list = self.vehicle_type_repo.get_list_active_name_pcu()

        for item_data in name_pcu_list:
            df.loc[df['car_type'] == item_data['name'], 'pcu'] = item_data['pcu']

        zero_value = len(df[df['volume'].isin([0])].index)

        if zero_value != len(df.index):
            ## total, inbound_total, outbound_total
            total = df['volume'].sum()
            inbound_total = df[df['direction'] == 'IN']['volume'].sum()
            outbound_total = df[df['direction'] == 'OUT']['volume'].sum()

            ## car type data
            df_car_type = df[['car_type', 'volume']].groupby(by='car_type').sum()
            df_car_type = df_car_type.reset_index()
            df_car_type['percent'] = (df_car_type['volume'] / df_car_type['volume'].sum()) * 100

            car_type_data = df_car_type[['car_type', 'volume','percent']].to_dict('records')
            car_type_percent_data = df_car_type[['car_type', 'percent']].to_dict('records')

            ## graph
            df_graph = df[['direction', 'date', 'volume']].groupby(by=['direction', 'date']).sum()
            df_graph = df_graph.reset_index()

            df_graph_inbound = df_graph[df_graph['direction'] == 'IN'][['date', 'volume']]
            graph_inbound_data = df_graph_inbound.to_dict('records')

            df_graph_outbound = df_graph[df_graph['direction'] == 'OUT'][['date', 'volume']]
            graph_outbound_data = df_graph_outbound.to_dict('records')

            report_data = {
                'inbound': {},
                'outbound': {}
            }

            ####### INBOUND #########

            for car_type in car_type_unique_name:
                report_car_type = df[(df['car_type'] == car_type) & (df['direction'] == 'IN')]
                report_car_type = report_car_type[['date', 'volume']]

                report_data['inbound'][car_type] = {}
                report_data['inbound'][car_type]['data'] = report_car_type.to_dict('records')
                report_data['inbound'][car_type]['total'] = report_car_type['volume'].sum()
                if(record_type == '1'):
                    report_car_type_record = dfRecord[(dfRecord['car_type'] == car_type) & (dfRecord['direction'] == 'IN')]
                    report_car_type_record = report_car_type_record[['date', 'volume']]
                    total_by_cat = report_car_type_record['volume'].sum()
                    if(total_by_cat > 0):
                        report_data['inbound'][car_type]['percent'] =  (report_car_type['volume'].sum()/total_by_cat)*100
                    else:
                        report_data['inbound'][car_type]['percent'] = 0


            ## pcu inbound
            df_pcu = df[df['direction'] == 'IN']
            df_pcu = df_pcu[['date', 'car_type', 'volume', 'pcu']].groupby(by=['car_type', 'date','pcu']).sum()
            df_pcu = df_pcu.reset_index()

            pcu_value = df_pcu.volume * df_pcu.pcu
            df_pcu['pcu_value'] = pcu_value

            df_pcu = df_pcu[['date', 'pcu_value']].groupby(by=['date']).sum()
            df_pcu = df_pcu.reset_index()
            df_pcu = df_pcu.rename(columns={
                'pcu_value': 'volume'
            })

            pcu = df_pcu.to_dict('records')
            report_data['inbound']['pcu'] = {}
            report_data['inbound']['pcu']['data'] = pcu
            report_data['inbound']['pcu']['total'] = df_pcu['volume'].sum()
            if(record_type == '1'):
                df_pcu_record = dfRecord[dfRecord['direction'] == 'IN']
                df_pcu_record = df_pcu_record[['date', 'car_type', 'volume', 'pcu']].groupby(by=['car_type','date','pcu']).sum()
                df_pcu_record = df_pcu_record.reset_index()

                pcu_record_value = df_pcu_record.volume * df_pcu_record.pcu
                df_pcu_record['pcu_value'] = pcu_record_value
                df_pcu_record = df_pcu_record[['date','pcu_value']].groupby(by=['date']).sum()
                df_pcu_record = df_pcu_record.reset_index()
                df_pcu_record = df_pcu_record.rename(columns={
                    'pcu_value': 'volume'
                })
                total_by_cat = df_pcu_record['volume'].sum()
                if(total_by_cat > 0):
                    report_data['inbound']['pcu']['percent'] =  (df_pcu['volume'].sum()/total_by_cat)*100
                else:
                    report_data['inbound']['pcu']['percent'] = 0



            ## total group by time inbound
            df_total = df[df['direction'] == 'IN']
            df_total = df_total[['date', 'volume',]].groupby(by=['date']).sum()
            df_total = df_total.reset_index()

            total_by_time = df_total.to_dict('records')
            report_data['inbound']['total'] = {}
            report_data['inbound']['total']['data'] = total_by_time
            report_data['inbound']['total']['total'] = df_total['volume'].sum()
            if(record_type == '1'):
                df_record_total = dfRecord[dfRecord['direction'] == 'IN']
                df_record_total = df_record_total[['date', 'volume']].groupby(by=['date']).sum()
                df_record_total = df_record_total.reset_index()
                total_by_cat = df_record_total['volume'].sum()
                if(total_by_cat > 0):
                    report_data['inbound']['total']['percent'] =  (df_total['volume'].sum()/total_by_cat)*100
                else:
                    report_data['inbound']['total']['percent'] = 0

            ####### OUTBOUND #########

            for car_type in car_type_unique_name:
                report_car_type = df[(df['car_type'] == car_type) & (df['direction'] == 'OUT')]
                report_car_type = report_car_type[['date', 'volume']]

                report_data['outbound'][car_type] = {}
                report_data['outbound'][car_type]['data'] = report_car_type.to_dict('records')
                report_data['outbound'][car_type]['total'] = report_car_type['volume'].sum()
                if(record_type == '1'):
                    report_car_type_record = dfRecord[(dfRecord['car_type'] == car_type) & (dfRecord['direction'] == 'OUT')]
                    report_car_type_record = report_car_type_record[['date', 'volume']]
                    total_by_cat = report_car_type_record['volume'].sum()
                    if(total_by_cat > 0):
                        report_data['outbound'][car_type]['percent'] =  (report_car_type['volume'].sum()/total_by_cat)*100
                    else:
                        report_data['outbound'][car_type]['percent'] = 0


            ## pcu outbound
            df_pcu = df[df['direction'] == 'OUT']
            df_pcu = df_pcu[['date', 'car_type', 'volume', 'pcu']].groupby(by=['car_type', 'date','pcu']).sum()
            df_pcu = df_pcu.reset_index()

            pcu_value = df_pcu.volume * df_pcu.pcu
            df_pcu['pcu_value'] = pcu_value

            df_pcu = df_pcu[['date', 'pcu_value']].groupby(by=['date']).sum()
            df_pcu = df_pcu.reset_index()
            df_pcu = df_pcu.rename(columns={
                'pcu_value': 'volume'
            })

            pcu = df_pcu.to_dict('records')
            report_data['outbound']['pcu'] = {}
            report_data['outbound']['pcu']['data'] = pcu
            report_data['outbound']['pcu']['total'] = df_pcu['volume'].sum()
            if(record_type == '1'):
                df_pcu_record = dfRecord[dfRecord['direction'] == 'OUT']
                df_pcu_record = df_pcu_record[['date', 'car_type', 'volume', 'pcu']].groupby(by=['car_type','date','pcu']).sum()
                df_pcu_record = df_pcu_record.reset_index()

                pcu_record_value = df_pcu_record.volume * df_pcu_record.pcu
                df_pcu_record['pcu_value'] = pcu_record_value
                df_pcu_record = df_pcu_record[['date','pcu_value']].groupby(by=['date']).sum()
                df_pcu_record = df_pcu_record.reset_index()
                df_pcu_record = df_pcu_record.rename(columns={
                    'pcu_value': 'volume'
                })
                total_by_cat = df_pcu_record['volume'].sum()
                if(total_by_cat > 0):
                    report_data['outbound']['pcu']['percent'] =  (df_pcu['volume'].sum()/total_by_cat)*100
                else:
                    report_data['outbound']['pcu']['percent'] = 0


            ## total group by time outbound
            df_total = df[df['direction'] == 'OUT']
            df_total = df_total[['date', 'volume',]].groupby(by=['date']).sum()
            df_total = df_total.reset_index()

            total_by_time = df_total.to_dict('records')
            report_data['outbound']['total'] = {}
            report_data['outbound']['total']['data'] = total_by_time
            report_data['outbound']['total']['total'] = df_total['volume'].sum()
            if(record_type == '1'):
                df_record_total = dfRecord[dfRecord['direction'] == 'OUT']
                df_record_total = df_record_total[['date', 'volume']].groupby(by=['date']).sum()
                df_record_total = df_record_total.reset_index()
                total_by_cat = df_record_total['volume'].sum()
                if(total_by_cat > 0):
                    report_data['outbound']['total']['percent'] =  (df_total['volume'].sum()/total_by_cat)*100
                else:
                    report_data['outbound']['total']['percent'] = 0

            if(record_type == '1'):
                data = {
                    'total': total,
                    'graph_inside' :{
                        'violation': (total/total_car)*100,
                        'normal': ((total_car/total_car)*100) - ((total/total_car)*100)
                    },
                    'direction': {
                        'inbound': inbound_total,
                        'outbound': outbound_total
                    },
                    'car_type': {
                        'volume': car_type_data,
                        'percent': car_type_percent_data
                    },
                    'graph': {
                        'inbound': graph_inbound_data,
                        'outbound': graph_outbound_data
                    },
                    'report': report_data
                }
            elif(record_type == '0'):
                data = {
                    'total': total,
                    'direction': {
                        'inbound': inbound_total,
                        'outbound': outbound_total
                    },
                    'car_type': {
                        'volume': car_type_data,
                        'percent': car_type_percent_data
                    },
                    'graph': {
                        'inbound': graph_inbound_data,
                        'outbound': graph_outbound_data
                    },
                    'report': report_data
                }
        else:
            date_list = df['date'].unique()

            car_type_data = {
                'volume': [],
                'percent': []
            }

            for car_type in car_type_unique_name:
                volume_data = {
                    'car_type': car_type,
                    'volume': 0
                }
                percent_data = {
                    'car_type': car_type,
                    'percent': 0
                }

                car_type_data['volume'].append(volume_data)
                car_type_data['percent'].append(percent_data)

            graph = {
                'inbound': [],
                'outbound': []
            }

            for date_ in date_list:
                inbound_data = {
                    'date': date_,
                    'volume': 0
                }
                outbound_data = {
                    'date': date_,
                    'volume': 0
                }

                graph['inbound'].append(inbound_data)
                graph['outbound'].append(outbound_data)
            
            report = {
                'inbound': {},
                'outbound': {}
            }
            
            car_type_unique_name.extend(['pcu', 'total'])
            report_config_list = car_type_unique_name
            if(record_type == '1'):
                for config in report_config_list:
                    report['inbound'][config] = {
                        'data': [],
                        'total': 0,
                        'percent': 0
                    }
                    report['outbound'][config] = {
                        'data': [],
                        'total': 0,
                        'percent': 0
                    }

                    for date_ in date_list:
                        inbound_data = {
                            'date': date_,
                            'volume': 0
                        }
                        outbound_data = {
                            'date': date_,
                            'volume': 0
                        }

                        report['inbound'][config]['data'].append(inbound_data)
                        report['outbound'][config]['data'].append(outbound_data)
            elif(record_type == '0'):
                for config in report_config_list:
                    report['inbound'][config] = {
                        'data': [],
                        'total': 0,
                        'percent': 0
                    }
                    report['outbound'][config] = {
                        'data': [],
                        'total': 0,
                        'percent': 0
                    }

                    for date_ in date_list:
                        inbound_data = {
                            'date': date_,
                            'volume': 0
                        }
                        outbound_data = {
                            'date': date_,
                            'volume': 0
                        }

                        report['inbound'][config]['data'].append(inbound_data)
                        report['outbound'][config]['data'].append(outbound_data)
            if(record_type == '1'):
                data = {
                    'total': 0,
                    'graph_inside' :{
                        'violation': 0,
                        'normal': 0
                    },
                    'direction': {
                        'inbound': 0,
                        'outbound': 0
                    },
                    'car_type': car_type_data,
                    'graph': graph,
                    'report': report
                }
            elif(record_type == '0'):
                data = {
                    'total': 0,
                    'direction': {
                        'inbound': 0,
                        'outbound': 0
                    },
                    'car_type': car_type_data,
                    'graph': graph,
                    'report': report
                }

        return data


    def get_year_data(self, year, checkpoint_id,record_type):
        
        car_type_list_id = self.vehicle_type_repo.get_list_id()
        car_type_list_name = self.vehicle_type_repo.get_list_name()
        car_type_unique_name = self.vehicle_type_repo.get_list_active_name()
        if(record_type == '0'):
            query_data = self.record_repository.get_by_year(
                year=year, checkpoint_id=checkpoint_id
            )
        elif(record_type == '1'):
            query_data = self.violation_repository.get_by_year(
                year=year, checkpoint_id=checkpoint_id
            )
            total_all_type = self.violation_repository.get_volume_by_year(
                year=year, checkpoint_id=checkpoint_id
            )
            total_car = sum(d['volume'] for d in total_all_type)
            dfRecord = pd.DataFrame(total_all_type)
            dfRecord = dfRecord.rename(
                columns={
                    'date__month': 'month',
                    'car_type_id': 'car_type'
                }
            )
            dfRecord['car_type'] = dfRecord['car_type'].replace(
                car_type_list_id, car_type_list_name
            )
            dfRecord = dfRecord[['direction', 'car_type','month', 'volume']].groupby(by=['direction', 'car_type','month']).sum()
            dfRecord = dfRecord.reset_index()
            dfRecord['pcu'] = 0
            name_pcu_list = self.vehicle_type_repo.get_list_active_name_pcu()

            for item_data in name_pcu_list:
                dfRecord.loc[dfRecord['car_type'] == item_data['name'], 'pcu'] = item_data['pcu']

        ## to dataframe
        df = pd.DataFrame(query_data)

        df = df.rename(
            columns={
                'date__month': 'month',
                'car_type_id': 'car_type'
            }
        )
        df['car_type'] = df['car_type'].replace(
            car_type_list_id, car_type_list_name
        )
        df = df[['direction', 'car_type', 'month', 'volume']].groupby(by=['direction', 'car_type', 'month']).sum()
        df = df.reset_index()

        df['pcu'] = 0
        name_pcu_list = self.vehicle_type_repo.get_list_active_name_pcu()

        for item_data in name_pcu_list:
            df.loc[df['car_type'] == item_data['name'], 'pcu'] = item_data['pcu']

        ## total, inbound_total, outbound_total
        total = df['volume'].sum()
        inbound_total = df[df['direction'] == 'IN']['volume'].sum()
        outbound_total = df[df['direction'] == 'OUT']['volume'].sum()

        ## car type data
        df_car_type = df[['car_type', 'volume']].groupby(by='car_type').sum()
        df_car_type = df_car_type.reset_index()
        # df_car_type['percent_type'] = (df_car_type['volume'] / total) * 100
        df_car_type['percent'] = (df_car_type['volume'] / df_car_type['volume'].sum()) * 100

        car_type_data = df_car_type[['car_type', 'volume','percent']].to_dict('records')
        car_type_percent_data = df_car_type[['car_type', 'percent']].to_dict('records')

        ## graph
        df_graph = df[['direction', 'month', 'volume']].groupby(by=['direction', 'month']).sum()
        df_graph = df_graph.reset_index()

        df_graph_inbound = df_graph[df_graph['direction'] == 'IN'][['month', 'volume']]
        graph_inbound_data = df_graph_inbound.to_dict('records')

        df_graph_outbound = df_graph[df_graph['direction'] == 'OUT'][['month', 'volume']]
        graph_outbound_data = df_graph_outbound.to_dict('records')

        report_data = {
            'inbound': {},
            'outbound': {}
        }

        ####### INBOUND #########

        for car_type in car_type_unique_name:
            report_car_type = df[(df['car_type'] == car_type) & (df['direction'] == 'IN')]
            report_car_type = report_car_type[['month', 'volume']]

            report_data['inbound'][car_type] = {}
            report_data['inbound'][car_type]['data'] = report_car_type.to_dict('records')
            report_data['inbound'][car_type]['total'] = report_car_type['volume'].sum()
            if(record_type == '1'):
                report_car_type_record = dfRecord[(dfRecord['car_type'] == car_type) & (dfRecord['direction'] == 'IN')]
                report_car_type_record = report_car_type_record[['month', 'volume']]
                total_by_cat = report_car_type_record['volume'].sum()
                if(total_by_cat > 0):
                    report_data['inbound'][car_type]['percent'] =  (report_car_type['volume'].sum()/total_by_cat)*100
                else:
                    report_data['inbound'][car_type]['percent'] = 0
                


        ## pcu inbound
        df_pcu = df[df['direction'] == 'IN']
        df_pcu = df_pcu[['month', 'car_type', 'volume', 'pcu']].groupby(by=['car_type', 'month','pcu']).sum()
        df_pcu = df_pcu.reset_index()

        pcu_value = df_pcu.volume * df_pcu.pcu
        df_pcu['pcu_value'] = pcu_value

        df_pcu = df_pcu[['month', 'pcu_value']].groupby(by=['month']).sum()
        df_pcu = df_pcu.reset_index()
        df_pcu = df_pcu.rename(columns={
            'pcu_value': 'volume'
        })

        pcu = df_pcu.to_dict('records')
        report_data['inbound']['pcu'] = {}
        report_data['inbound']['pcu']['data'] = pcu
        report_data['inbound']['pcu']['total'] = df_pcu['volume'].sum()
        if(record_type == '1'):
            df_pcu_record = dfRecord[dfRecord['direction'] == 'IN']
            df_pcu_record = df_pcu_record[['month', 'car_type', 'volume', 'pcu']].groupby(by=['car_type','month','pcu']).sum()
            df_pcu_record = df_pcu_record.reset_index()

            pcu_record_value = df_pcu_record.volume * df_pcu_record.pcu
            df_pcu_record['pcu_value'] = pcu_record_value
            df_pcu_record = df_pcu_record[['month','pcu_value']].groupby(by=['month']).sum()
            df_pcu_record = df_pcu_record.reset_index()
            df_pcu_record = df_pcu_record.rename(columns={
                'pcu_value': 'volume'
            })
            total_by_cat = df_pcu_record['volume'].sum()
            if(total_by_cat > 0):
                report_data['inbound']['pcu']['percent'] =  (df_pcu['volume'].sum()/total_by_cat)*100
            else:
                report_data['inbound']['pcu']['percent'] = 0
            


        ## total group by time inbound
        df_total = df[df['direction'] == 'IN']
        df_total = df_total[['month', 'volume']].groupby(by=['month']).sum()
        df_total = df_total.reset_index()

        total_by_time = df_total.to_dict('records')
        report_data['inbound']['total'] = {}
        report_data['inbound']['total']['data'] = total_by_time
        report_data['inbound']['total']['total'] = df_total['volume'].sum()
        if(record_type == '1'):
            df_record_total = dfRecord[dfRecord['direction'] == 'IN']
            df_record_total = df_record_total[['month', 'volume']].groupby(by=['month']).sum()
            df_record_total = df_record_total.reset_index()
            total_by_cat = df_record_total['volume'].sum()
            if(total_by_cat > 0):
                report_data['inbound']['total']['percent'] =  (df_total['volume'].sum()/total_by_cat)*100
            else:
                report_data['inbound']['total']['percent'] = 0
            
        
        ####### OUTBOUND #########

        for car_type in car_type_unique_name:
            report_car_type = df[(df['car_type'] == car_type) & (df['direction'] == 'OUT')]
            report_car_type = report_car_type[['month', 'volume']]

            report_data['outbound'][car_type] = {}
            report_data['outbound'][car_type]['data'] = report_car_type.to_dict('records')
            report_data['outbound'][car_type]['total'] = report_car_type['volume'].sum()
            if(record_type == '1'):
                report_car_type_record = dfRecord[(dfRecord['car_type'] == car_type) & (dfRecord['direction'] == 'OUT')]
                report_car_type_record = report_car_type_record[['month', 'volume']]
                total_by_cat = report_car_type_record['volume'].sum()
                if(total_by_cat > 0):
                    report_data['outbound'][car_type]['percent'] =  (report_car_type['volume'].sum()/total_by_cat)*100
                else:
                    report_data['outbound'][car_type]['percent'] = 0


        ## pcu outbound
        df_pcu = df[df['direction'] == 'OUT']
        df_pcu = df_pcu[['month', 'car_type', 'volume', 'pcu']].groupby(by=['car_type', 'month','pcu']).sum()
        df_pcu = df_pcu.reset_index()

        pcu_value = df_pcu.volume * df_pcu.pcu
        df_pcu['pcu_value'] = pcu_value

        df_pcu = df_pcu[['month', 'pcu_value']].groupby(by=['month']).sum()
        df_pcu = df_pcu.reset_index()
        df_pcu = df_pcu.rename(columns={
            'pcu_value': 'volume'
        })

        pcu = df_pcu.to_dict('records')
        report_data['outbound']['pcu'] = {}
        report_data['outbound']['pcu']['data'] = pcu
        report_data['outbound']['pcu']['total'] = df_pcu['volume'].sum()
        if(record_type == '1'):
            df_pcu_record = dfRecord[dfRecord['direction'] == 'OUT']
            df_pcu_record = df_pcu_record[['month', 'car_type', 'volume', 'pcu']].groupby(by=['car_type','month','pcu']).sum()
            df_pcu_record = df_pcu_record.reset_index()

            pcu_record_value = df_pcu_record.volume * df_pcu_record.pcu
            df_pcu_record['pcu_value'] = pcu_record_value
            df_pcu_record = df_pcu_record[['month','pcu_value']].groupby(by=['month']).sum()
            df_pcu_record = df_pcu_record.reset_index()
            df_pcu_record = df_pcu_record.rename(columns={
                'pcu_value': 'volume'
            })
            total_by_cat = df_pcu_record['volume'].sum()
            if(total_by_cat > 0):
                report_data['outbound']['pcu']['percent'] =  (df_pcu['volume'].sum()/total_by_cat)*100
            else:
                report_data['outbound']['pcu']['percent'] = 0


        ## total group by time outbound
        df_total = df[df['direction'] == 'OUT']
        df_total = df_total[['month', 'volume',]].groupby(by=['month']).sum()
        df_total = df_total.reset_index()

        total_by_time = df_total.to_dict('records')
        report_data['outbound']['total'] = {}
        report_data['outbound']['total']['data'] = total_by_time
        report_data['outbound']['total']['total'] = df_total['volume'].sum()
        if(record_type == '1'):
            df_record_total = dfRecord[dfRecord['direction'] == 'OUT']
            df_record_total = df_record_total[['month', 'volume']].groupby(by=['month']).sum()
            df_record_total = df_record_total.reset_index()
            total_by_cat = df_record_total['volume'].sum()
            if(total_by_cat > 0):
                report_data['outbound']['total']['percent'] =  (df_total['volume'].sum()/total_by_cat)*100
            else:
                report_data['outbound']['total']['percent'] = 0

        if(record_type == '1'):
            data = {
                'total': total,
                'graph_inside' :{
                    'violation': (total/total_car)*100,
                    'normal': ((total_car/total_car)*100) - ((total/total_car)*100)
                },
                'direction': {
                    'inbound': inbound_total,
                    'outbound': outbound_total
                },
                'car_type': {
                    'volume': car_type_data,
                    'percent': car_type_percent_data
                },
                'graph': {
                    'inbound': graph_inbound_data,
                    'outbound': graph_outbound_data
                },
                'report': report_data
            }
        elif(record_type == '0'):
            data = {
                'total': total,
                'direction': {
                    'inbound': inbound_total,
                    'outbound': outbound_total
                },
                'car_type': {
                    'volume': car_type_data,
                    'percent': car_type_percent_data
                },
                'graph': {
                    'inbound': graph_inbound_data,
                    'outbound': graph_outbound_data
                },
                'report': report_data
            }
        return data

    def _convert_to_json_serializable(self, obj):
            """Convert numpy/pandas types to Python native types for JSON serialization"""
            if isinstance(obj, dict):
                return {key: self._convert_to_json_serializable(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [self._convert_to_json_serializable(item) for item in obj]
            elif isinstance(obj, (np.integer, np.int64, np.int32, np.int16, np.int8)):
                return int(obj)
            elif isinstance(obj, (np.floating, np.float64, np.float32, np.float16)):
                return float(obj)
            elif isinstance(obj, np.bool_):
                return bool(obj)
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            elif pd.isna(obj):
                return None
            elif isinstance(obj, (pd.Timestamp, datetime.datetime)):
                return obj.isoformat()
            else:
                return obj

    def get_data(self, type, datetime_value, checkpoint_id,record_type):

        if type == 'day':
            date_query = self.traffic_detail_validator.validate_type_day(
                datetime_value=datetime_value
            )
            data = self.get_day_data(
                date=date_query, checkpoint_id=checkpoint_id, record_type = record_type
            )

        elif type == 'week':
            start_date, end_date = self.traffic_detail_validator.validate_type_week(
                datetime_value=datetime_value
            )
            data = self.get_day_range_data(
                start_date=start_date, end_date=end_date, checkpoint_id=checkpoint_id,record_type = record_type
            )

        elif type == 'month':
            start_date, end_date = self.traffic_detail_validator.validate_type_month(
                datetime_value=datetime_value
            )
            data = self.get_day_range_data(
                start_date=start_date, end_date=end_date, checkpoint_id=checkpoint_id,record_type = record_type
            )

        elif type == 'year':
            year = self.traffic_detail_validator.validate_type_year(
                datetime_value=datetime_value
            )
            data = self.get_year_data(
                year=year, checkpoint_id=checkpoint_id,record_type = record_type
            )

        elif type == 'range':
            start_date, end_date = self.traffic_detail_validator.validate_type_range(
                datetime_value=datetime_value
            )

            data = self.get_day_range_data(
                start_date=start_date, end_date=end_date, checkpoint_id=checkpoint_id,record_type = record_type
            )
        
        return self._convert_to_json_serializable(data)



