from polygon import RESTClient
import matplotlib.pyplot as plt, mpld3
import pandas as pd
import math
import numpy as np
from datetime import datetime
from datetime import timedelta


#test = pd.DataFrame({'symbol': compl_symbols, 'index_slope': index_slopes, 'prev_slope': symbol_slopes, 'mean_diff': variance, 'week_slope': week_slopes})
#test = pd.DataFrame({"symbol": symbols "index_slope": index_slope, "prev_slope": [-10, 5, -3], "mean_diff": [5, 6, 1], "finance":[1, 0, 1], "communication":[1, 0, 1], "health_care": [1, 0, 1], "information_tech": [1, 0, 1],
#                                                  "energy": [1, 0, 1], "industrials": [1, 0, 1], "healthcare": [1, 0, 1], "real_estate": [1, 0, 1], 
#                                                  "utilities":[1, 0, 1],"materials":[1, 0, 1],"consumer_disc":[1, 0, 1],"consumer_staples":[1, 0, 1],"week_slope": [-1, 8, 3]})

#print(test)

#sp = StockRegSlopePredictor(test, 0.0001, 10000)

# stock array = slope of index fund for past month,  slope of past month, avgdiff between high and low vals, array(company types (true or false)), next week slope
# coefficent matrix will hold coefficients as follows: constant (b), slopes (m0 - m(3 + i)) where i is the number of company types 
class StockRegSlopePredictor:
    def __init__(self, stock_data, learning_rate, num_iterations):
        self.stock_data = stock_data
        self.coeff = np.zeros((len(stock_data.columns) - 1))
        self.lr = learning_rate
        self.iterations = num_iterations
    
    
    def gradient_step(self, X, Y, coeff, learning_rate):
        coeff_gradient = np.zeros((len(coeff), 1))
        N = float(len(X.index))
        for i in range(0, int(N)):
            y_pred = np.dot(X, coeff_gradient)
            print(y_pred)
            diff = Y - y_pred
            cost = (1/2*N) * np.sum(np.square(diff), 1)

            coeff_gradient_d = (1/N) * np.dot(X.T, y_pred - Y)
            coeff_gradient = coeff_gradient - (learning_rate * coeff_gradient_d)

        return coeff_gradient
    
    def gradient_descent_runner(self, X, Y, coeff, learning_rate, num_iterations):
        new_coeff = coeff
        for i in range(0, num_iterations):
            new_coeff = self.gradient_step(X, Y, new_coeff, learning_rate)
        return new_coeff


    def train(self, prediction_column):
        data_columns = self.stock_data.columns
        columns = data_columns != prediction_column
        print(columns)
        X = self.stock_data[self.stock_data.columns[columns]]
        Y = self.stock_data[[prediction_column]]
        new_coeff = self.coeff
        new_coeff = self.gradient_descent_runner(X, Y, new_coeff, self.lr, self.iterations)
        self.coeff = new_coeff

    
    def get_coeff(self):
        return self.coeff

test = pd.read_csv('stock_data.csv')
test = test[test.columns[test.columns != 'symbol']]
model = StockRegSlopePredictor(test, 0.0001, 10000)
model.train("week_slope")
print(model.get_coeff())