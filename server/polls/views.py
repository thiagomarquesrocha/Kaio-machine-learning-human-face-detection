from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

FIELDS = 'user,rate_blink_left,rate_blink_right,rate_smile_or_not,feel'

def index(request):
    import os
    path = os.path.abspath("polls/index.html")
    #return HttpResponse(path)
    context = {
        
    }
    return render(request, 'polls/index.html', context)

def predict(request):
    from data import get_full_data, get_who_is
    from matplotlib import pyplot as plt
    from sklearn import linear_model
    from predicting_who_is import accuracy_score, performance_metric
    import pandas as pd
    import numpy as np

    X, Y, df = get_full_data()

    # Import 'train_test_split'
    from sklearn.cross_validation import train_test_split

    # Shuffle and split the data into training and testing subsets
    X_train, X_test, y_train, y_test = train_test_split(X, Y, train_size = 0.9, random_state = 0)

    # Success
    #print "Training and testing split was successful."

    from collections import Counter
    
    from sklearn.tree import DecisionTreeClassifier
    modelo = DecisionTreeClassifier(random_state=0)

    X_who_is, Y_who_is, df = get_who_is()

    #X_who_is = df[['blink_left', 'blink_right', 'smile_or_not']]

    #print X_who_is

    modelo.fit(X, Y)

    predict = modelo.predict(X_who_is)

    result = Counter(predict)

    who_is = result.most_common()[0][0]

    #print result

    switcher = {
        0: "Vc parece estar triste! :(",
        1: "Vc parece estar com raiva! :o",
        2: "Vc parece estar feliz! :)"
    }
    msg = switcher.get(who_is, "Normal")
        
    # print msg


    return HttpResponse(msg)

def save_data(request):

    if request.method == 'POST':
        data = request.POST['data']
    else:
        data = request.GET['data']
    
    import csv
    writer = csv.writer(open("detect.csv", 'wb'), delimiter=' ', escapechar=' ', quoting=csv.QUOTE_NONE)
    lines = data.split('|')

    msg = ''
    writer.writerow(FIELDS.split())
    for row in lines:
        r = row.split()
        msg += row + '<br>'
        writer.writerow(r)

    return HttpResponse("Dados de treinamento armazenados com sucesso!")

def save_whois(request):

    if request.method == 'POST':
        whois = request.POST['whois']
    else:
        whois = request.GET['whois']
    
    import csv
    writer = csv.writer(open("whois.csv", 'wb'), delimiter=' ', escapechar=' ', quoting=csv.QUOTE_NONE)
    lines = whois.split('|')

    msg = ''
    writer.writerow(FIELDS.split())
    for row in lines:
        r = row.split()
        msg += row + '<br>'
        writer.writerow(r)
    
    return HttpResponse("Dados do usuario desconhecido armazenado com sucesso!")