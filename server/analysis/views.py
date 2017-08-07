#############################################################
#  Views supporting to predict and training
#############################################################

# Import
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render

# Label of my training model
FIELDS = 'user,rate_blink_left,rate_blink_right,rate_smile_or_not,feel'

# Create your views here.

### Load the index.html with the character 'Kaio' animated
def index(request):
    import os
    path = os.path.abspath("analysis/index.html")
    context = {}
    return render(request, 'analysis/index.html', context)

### Get the emotion predicted through the trained model
def predict(request):
    from data import get_full_data, get_predict
    from matplotlib import pyplot as plt
    from sklearn import linear_model
    from predicting import accuracy_score, performance_metric
    import pandas as pd
    import numpy as np

    # Get X (Features) and Y (Target)
    X, Y, df = get_full_data()

    # Import 'train_test_split'
    from sklearn.model_selection import train_test_split

    # Shuffle and split the data into training and testing subsets
    X_train, X_test, y_train, y_test = train_test_split(X, Y, train_size = 0.9, random_state = 0)

    # Success
    #print "Training and testing split was successful."

    from collections import Counter
    
    from sklearn.tree import DecisionTreeClassifier
    modelo = DecisionTreeClassifier(random_state=0)

    features, target, df = get_predict('../server/')

    modelo.fit(X, Y)

    #display(features)

    predict = modelo.predict(features)

    result = Counter(predict)

    predicted = result.most_common()[0][0]

    #print result

    switcher = {
        0: "Vc parece estar triste! :(",
        1: "Vc parece estar com raiva! :o",
        2: "Vc parece estar feliz! :)"
    }
    msg = switcher.get(predicted, "Normal")

    res = { "msg": msg, "emotion" : int(predicted) }

    return JsonResponse(res)

### Save the full training model
def save_data(request):

    if request.method == 'POST':
        data = request.POST['data']
    else:
        data = request.GET['data']
    
    import csv
    writer = csv.writer(open("data/detect.csv", 'wb'), delimiter=' ', escapechar=' ', quoting=csv.QUOTE_NONE)
    lines = data.split('|')

    msg = ''
    writer.writerow(FIELDS.split())
    for row in lines:
        r = row.split()
        msg += row + '<br>'
        writer.writerow(r)

    return HttpResponse("Dados de treinamento armazenados com sucesso!")

### Save the training data for use in predict analysis
def save_training(request):
    # This method receive two kinds of predict:
    # 0 - create whois.csv and add the new lines at the end of csv file
    # 1 - create predict.csv rewriting the existing file if he was created

    if request.method == 'POST':
        predict = request.POST['predict']
        csv_data = request.POST['training']
    else:
        predict = request.GET['predict']
        csv_data = request.GET['training']

    if predict == '0': # CSV com emocoes que deverao ser analisadas e avaliadas
        csv_file = "data/training.csv"
    else: # CSV temporario para prever a emocao no determinado instante
        csv_file = "data/predict.csv"
    
    import csv
    lines = csv_data.split('|')
    msg = ''
    response = ''

    import glob
    import pandas as pd

    all_data = pd.DataFrame() #initializes DF which will hold aggregated csv files

    #list of all df
    dfs = []
    for f in glob.glob(csv_file): #for all csv files in pwd
        #add parameters to read_csv
        if predict == '0':
            df = pd.read_csv(f, header=None) #create dataframe for reading current csv
        with open(csv_file, 'wb') as f1:
            writer = csv.writer(f1, delimiter=' ', escapechar=' ', quoting=csv.QUOTE_NONE)
            if predict == '0':
                for i, row in df.iterrows():
                    line = row.values
                    w = line[0] + ',' + line[1] + ',' +  line[2] + ',' + line[3] + ',' + line[4]
                    #print w.split()
                    writer.writerow(w.split())
            else:
                 writer.writerow(FIELDS.split())
            for row in lines:
                r = row.split()
                #print r
                msg += row + '<br>'
                writer.writerow(r)
    
    return HttpResponse("Predicao armazenada com sucesso!")