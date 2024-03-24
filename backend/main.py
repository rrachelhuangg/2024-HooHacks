import threading
import image_maker as im
import data_update as du
import time

if __name__=="__main__":
    data_path = "resources/"
    timespan = "hour"
    multi = 12
    days_ago = 30
    data_scrape_thread = threading.Thread(target=du.data_runner, args=(data_path,timespan, multi, days_ago,))
    graph_make_thread = threading.Thread(target=im.make_graphs, args=(data_path,))

    data_scrape_thread.run()
    #graph_make_thread.run()

    #data_scrape_thread.join()

    print(data_scrape_thread.is_alive())
    #print(graph_make_thread.is_alive())