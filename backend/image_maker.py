import matplotlib.pyplot as plt, mpld3
import pandas as pd
import os
from datetime import datetime
from os.path import expanduser
import time
import numpy as np

home = os.path.expanduser("~")
graph_data_path = os.path.join(home, "2024-HooHacks", "resources", "graph_data.csv")

def make_graphs():
    loop_running = True
    ticker_index = 0
    while(loop_running):
        graph_data = pd.read_csv(graph_data_path)

        ticker = graph_data.loc[ticker_index]['ticker']
        current_stock = graph_data.loc[ticker_index]
        print(current_stock)
        print(current_stock.open[3])
        current_stock_frame = {'open': np.fromstring(current_stock.open.strip("[]"), dtype=float), 'closed': current_stock.closed,
                               'high': current_stock.high, 'low': current_stock.low,
                               'index': current_stock.index}
        print(current_stock_frame)
        up = current_stock_frame[current_stock_frame.closed >= current_stock_frame.open]
        down = graph_data[current_stock_frame.closed < current_stock_frame.open]
        print(up)
        print(down)
        width = 0.5
        width2 = 0.1
        col1 = "red"
        col2 = "green"
        up_closed = np.fromstring(up.closed.to_numpy())
        up_open = np.fromstring(up.open.to_numpy())
        up_high = np.fromstring(up.high.to_numpy())
        up_low = np.fromstring(up.low.to_numpy())
        down_closed = np.fromstring(down.closed.to_numpy())
        down_open = np.fromstring(down.open.to_numpy())
        down_high = np.fromstring(down.high.to_numpy())
        down_low = np.fromstring(down.low.to_numpy())
        plt.bar(up.index, up_closed-up_open, width, bottom=up_open, color=col2) # thick bar (close-open)
        plt.bar(up.index, up_high-up_closed, width2, bottom=up_closed, color=col2) # top thin bar (high)
        plt.bar(up.index, up_low-up_open, width2, bottom=up_open, color=col2) # bot thin bar (low)
        plt.bar(down.index, down_closed-down_open, width, bottom=down_open, color=col1) # thick bar (open-close)
        plt.bar(down.index, down_high-down_open, width2, bottom=down_open, color=col1) # top thin bar (high)
        plt.bar(down.index, down_low-down_closed, width2, bottom=down_closed, color=col1) # bot thin bar (low)


        plt.title("%s Stock From %s - %s" % (ticker, graph_data.start_date, datetime.now()))
        plt.xlabel("Number of Hours Into the Week Time Span")
        plt.xlim(0, len(graph_data.index))
        plt.ylabel("Stock Value in USD")
        plt.ylim(min(np.fromstring(graph_data.low.to_numpy()))-0.01*min(np.fromstring(graph_data.low.to_numpy())), max(np.fromstring(graph_data.high.to_numpy())) + 0.01*max(np.fromstring(graph_data.high.to_numpy()))) #setting the bounds for the y-axis
        mpld3.save_html(plt, "{}.json".format(ticker))

        ticker_index = ticker_index + 1
        if ticker_index > len(graph_data.index):
            ticker_index = 0
        if(ticker_index > 3):
            loop_running = False
        
        time.sleep(5)

make_graphs()


