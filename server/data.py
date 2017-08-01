import pandas as pd

def get_data():
    df = pd.read_csv('data/detect.csv')
    Y_df = df['feel']
    X_df = df[['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not']]
    Xdummies_df = pd.get_dummies(X_df)
    Ydummies_df = Y_df

    X = Xdummies_df.values
    Y = Ydummies_df.values
    return X, Y

def get_full_data():
    df = pd.read_csv('data/detect.csv')
    # df = df.sample(frac=1)
    Y_df = df['feel']
    X_df = df[['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not']]

    Y = Y_df
    X = X_df
    return X, Y, df

def get_who_is():
    df = pd.read_csv('data/whois.csv')
    Y_df = df['feel']
    X_df = df[['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not']]

    Y = Y_df
    X = X_df
    return X, Y, df

def get_predict():
    df = pd.read_csv('data/predict.csv')
    Y_df = df['feel']
    X_df = df[['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not']]

    Y = Y_df
    X = X_df
    return X, Y, df


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