####################################################
#  Data methods supporting to get the training data
####################################################

# Import
import pandas as pd

######## 
## Cols:  user, feel, rate_blink_left, rate_blink_right, rate_smile_or_not
########

### Get the full training model with dummies
def get_data():
    df = pd.read_csv('data/detect.csv')
    Y_df = df['feel']
    X_df = df[['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not']]
    Xdummies_df = pd.get_dummies(X_df)
    Ydummies_df = Y_df

    X = Xdummies_df.values
    Y = Ydummies_df.values
    return X, Y

### Get the full training model
def get_full_data():
    df = pd.read_csv('..\server\data\detect.csv')
    # df = df.sample(frac=1)
    Y_df = df['feel']
    X_df = df[['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not']]

    Y = Y_df
    X = X_df
    return X, Y, df

### Get a training data
def get_training():
    df = pd.read_csv('data/training.csv')
    Y_df = df['feel']
    X_df = df[['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not']]

    Y = Y_df
    X = X_df
    return X, Y, df

### Get a temporary data to predict wich feeling is
def get_predict(parent=''):
    df = pd.read_csv(parent + 'data/predict.csv')
    Y_df = df['feel']
    X_df = df[['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not']]

    Y = Y_df
    X = X_df
    return X, Y, df


### Get an specific data from training
def get_evaluate():
    df = pd.read_csv('data/whois.csv')
    Y_df = df['feel']
    X_df = df[['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not']]

    Y = Y_df
    X = X_df
    X_train = X[0:4263]
    y_train = Y[0:4263]
    X_test = X[4264:]
    y_test = Y[4264:]
    return X_train, y_train, X_test, y_test