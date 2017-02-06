import pandas as pd

def get_data():
    df = pd.read_csv('detect.csv')
    Y_df = df['user']
    X_df = df[['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not', 'blink_left', 'blink_right', 'smile_or_not']]
    Xdummies_df = pd.get_dummies(X_df)
    Ydummies_df = Y_df

    X = Xdummies_df.values
    Y = Ydummies_df.values
    return X, Y

def get_full_data():
    df = pd.read_csv('detect.csv')
    Y_df = df['user']
    X_df = df[['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not', 'blink_left', 'blink_right', 'smile_or_not']]

    Y = Y_df
    X = X_df
    return X, Y, df

def get_who_is():
    df = pd.read_csv('whois.csv')
    Y_df = df['user']
    X_df = df[['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not', 'blink_left', 'blink_right', 'smile_or_not']]

    Y = Y_df
    X = X_df
    return X, Y, df
