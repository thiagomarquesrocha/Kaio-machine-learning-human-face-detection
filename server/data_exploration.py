from sklearn.linear_model import LinearRegression
from data import get_full_data
from matplotlib import pyplot as plt
from sklearn import linear_model

X, Y, df = get_full_data()

def show_relationship(label_x, label_y):

    reg = LinearRegression()

    # name of label
    data_x = df[[label_x]]

    #print data_x

    reg.fit(data_x, Y) 
    plt.plot(data_x, reg.predict(data_x), color='red', linewidth=0.5)
    plt.scatter(data_x, Y, alpha=0.5, c=Y)
    plt.xlabel(label_x)
    plt.ylabel(label_y)
    plt.show()

#show_relationship('rate_blink_left', 'user')
#show_relationship('blink_right', 'user')
#show_relationship('smile_or_not', 'user')
