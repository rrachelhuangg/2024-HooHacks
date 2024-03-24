import matplotlib.pyplot as plt, mpld3
import pandas as pd
import os
from datetime import datetime
from os.path import expanduser
import time
import numpy as np

home = os.path.expanduser("~")
graph_data_path = os.path.join(home, "2024-HooHacks", "resources", "")

def make_graphs(graph_data_path):
    loop_running = True
    path = graph_data_path + "tickers.csv" 
    string_data = pd.read_csv(path)
    tickers = string_data.ticker
    start_dates = string_data.start_date
    ticker_index = 0
    while(loop_running):
        current_ticker = tickers[ticker_index]
        graph_data = pd.read_csv(graph_data_path + current_ticker + ".csv")

        up = graph_data[graph_data.closed >= graph_data.open]
        down = graph_data[graph_data.closed < graph_data.open]
        print(up)
        print(down)
        width = 0.5
        width2 = 0.1
        col1 = "red"
        col2 = "green"
        plt.bar(up.index, up.closed-up.open, width, bottom=up.open, color=col2) # thick bar (close-open)
        plt.bar(up.index, up.high-up.closed, width2, bottom=up.closed, color=col2) # top thin bar (high)
        plt.bar(up.index, up.low-up.open, width2, bottom=up.open, color=col2) # bot thin bar (low)
        plt.bar(down.index, down.closed-down.open, width, bottom=down.open, color=col1) # thick bar (open-close)
        plt.bar(down.index, down.high-down.open, width2, bottom=down.open, color=col1) # top thin bar (high)
        plt.bar(down.index, down.low-down.closed, width2, bottom=down.closed, color=col1) # bot thin bar (low)


        plt.title("%s Stock From %s - %s" % (current_ticker, start_dates[ticker_index], datetime.now()))
        plt.xlabel("Number of Hours Into the Week Time Span")
        plt.xlim(0, len(graph_data.index))
        plt.ylabel("Stock Value in USD")
        plt.ylim(min(graph_data.low)-0.01*min(graph_data.low), max(graph_data.high) + 0.01*max(graph_data.high)) #setting the bounds for the y-axis
        plt.savefig(graph_data_path + "{}.png".format(current_ticker))

        ticker_index = ticker_index + 1
        if ticker_index > len(graph_data.index):
            ticker_index = 0
        
        time.sleep(5)

make_graphs(graph_data_path)


