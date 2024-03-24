import pandas as pd
import numpy as np
from datetime import *
import os
from os.path import expanduser
import csv

from polygon import RESTClient
client = RESTClient(api_key="h8IoGYiQLCNjfJfU7je02JpmLrk4SJF9")

home = os.path.expanduser("~")
graph_data_path = os.path.join(home, "2024-HooHacks", "resources", "")


def get_data(ticker, timespan, multiplier, start_date, end_date):
    aggs = []
    error = True
    while(error):
        error = False
        try:
            for a in client.list_aggs(ticker=ticker, multiplier=multiplier, timespan=timespan, from_=start_date, to=end_date, limit=50000):
                aggs.append(a)
        except:
            error = True
            print("error")
    return aggs


def data_runner(graph_data_path, timespan, multi, days_ago):
    loop_running = True
    string_data = pd.read_csv(graph_data_path + "tickers.csv")
    tickers = string_data.ticker
    ticker_index = 0
    while(loop_running):
        current_ticker = tickers[ticker_index]
        path = graph_data_path + current_ticker + ".csv"

        aggs, opened, closed, highs, lows, time_index = (([] for i in range(0, 6)))

        end_date = datetime.now().strftime('%Y-%m-%d') #makes string of today
        start_date = (datetime.now() - timedelta(days_ago)).strftime('%Y-%m-%d') #makes string of starting day
        aggs = get_data(current_ticker, timespan, multi, start_date, end_date)

        for i, a in enumerate(aggs):
            highs += [a.high]
            lows += [a.low]
            opened += [a.open]
            closed += [a.close]
            time_index += [i]
        graph_data = {}
        try:
            graph_data = pd.DataFrame({'open': opened, 'closed': closed, 'high': highs, 'low': lows, 
                                            'index': time_index})
            print("set ticker " + current_ticker)
        except Exception as e:
            print("error in data setting: {}".format(e))

        if not os.path.isfile(path):
            with open(path, mode="w") as f:
                pass
        
        graph_data.to_csv(path, index=False)

        ticker_index = ticker_index + 1
        print("scraped " + current_ticker)
        if ticker_index >= len(string_data.index):
            ticker_index = 0
        #if ticker_index > 2: #remove this line to get rid of limitations
        #    loop_running = False
            
data_runner(graph_data_path, "hour", "1", 1)