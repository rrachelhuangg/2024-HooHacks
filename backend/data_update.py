import pandas as pd
import numpy as np
from datetime import *
import os
from os.path import expanduser

from polygon import RESTClient
client = RESTClient(api_key="h8IoGYiQLCNjfJfU7je02JpmLrk4SJF9")

home = os.path.expanduser("~")
graph_data_path = os.path.join(home, "2024-HooHacks", "resources", "graph_data.csv")


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


def data_runner(graph_data, timespan, multi, days_ago):
    loop_running = True
    tickers = graph_data['ticker']
    ticker_index = 0
    while(loop_running):
        current_ticker = tickers[ticker_index]
        aggs, open, closed, highs, lows, time_index = (([] for i in range(0, 6)))

        end_date = datetime.now().strftime('%Y-%m-%d') #makes string of today
        start_date = (datetime.now() - timedelta(days_ago)).strftime('%Y-%m-%d') #makes string of starting day

        aggs = get_data(current_ticker, timespan, multi, start_date, end_date)

        for i, a in enumerate(aggs):
            highs += [a.high]
            lows += [a.low]
            open += [a.open]
            closed += [a.close]
            time_index += [i]

        print(highs)

        try:
            graph_data.loc[ticker_index] = {'GICS Sector': graph_data.loc[ticker_index]["GICS Sector"], 'ticker': current_ticker, 'open': np.array(open), 'closed': np.array(closed), 'high': np.array(highs), 'low': np.array(lows), 
                                            'index': np.array(time_index), 'time_span': timespan, 'time_value': multi,
                                            'start_date': start_date}
            print("set ticker " + current_ticker)
        except Exception as e:
            print("error in data setting: {}".format(e))

        print(graph_data.loc[ticker_index])

        graph_data.to_csv(graph_data_path, index=False)

        ticker_index = ticker_index + 1
        #if ticker_index > 2: #remove this line to get rid of limitations
        #    loop_running = False

graph_data = pd.read_csv(graph_data_path, dtype=object)
data_runner(graph_data, "hour", "1", 1)