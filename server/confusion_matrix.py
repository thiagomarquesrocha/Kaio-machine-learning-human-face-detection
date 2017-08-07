#!/usr/bin/env python
# -*- coding: utf-8 -*-

import numpy as np
import matplotlib.pyplot as plt

from sklearn import datasets
from sklearn.tree import DecisionTreeClassifier
from sklearn import model_selection
from sklearn.metrics import confusion_matrix

##################################################
# Função auxiliar para a construção dos gráficos
# com a matriz de confusão.
##################################################
def plot_cm(target_names, cm, cm_norm):
    plt.figure(figsize=(10, 5))
    plt.title(u'Matriz de Confusão')

    # a = plt.subplot(121)
    # a.set_title(u"Matriz de Confusão Regular", fontsize=16)
    # plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    # plt.colorbar(fraction=0.046, pad=0.10)

    tick_marks = np.arange(len(target_names))
    # plt.xticks(tick_marks, target_names, rotation=45)
    # plt.yticks(tick_marks, target_names)
    # plt.ylabel(u'Classe Verdadeira', fontsize=16)
    # plt.xlabel(u'Classe Estimada', fontsize=16)

    b = plt.subplot(122)
    b.set_title(u"Matriz de Confusão Normalizada", fontsize=16)
    plt.imshow(cm_norm, interpolation='nearest', cmap=plt.cm.Blues)
    plt.colorbar(fraction=0.046, pad=0.10)

    plt.xticks(tick_marks, target_names, rotation=45)
    plt.yticks(tick_marks, target_names)
    plt.ylabel(u'Classe Verdadeira', fontsize=16)
    plt.xlabel(u'Classe Estimada', fontsize=16)

    plt.tight_layout()

##################################################

def evaluate(X_train, Y_train, X_test, Y_test, model, table_names):
    # Define os dados de interesse para o problema

    # Treina com a partição de treinamento
    model.fit(X_train, Y_train)

    # Verificação com a partição de teste
    Y_pred = model.predict(X_test)
    score = model.score(X_test, Y_test)

    print("Score médio: {0:.2f}".format(score))

    # Cria a matriz de confusão regular e normalizada
    cm = confusion_matrix(Y_test, Y_pred)
    cm_norm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]

    # Imprime as matrizes de confusão
    np.set_printoptions(precision=2)

    plot_cm(table_names, cm, cm_norm)

    # Exibe todas as figuras
    plt.show()

def partition(X, Y, model, table_names):
    # Define os dados de interesse para o problema
    # X é o vetor de Características (no seu exemplo, você chamou de "features")
    # Y é o vetor de Classes (no seu exemplo, você chamou de "labels")

    # Cria 10 partições com os dados de disponíveis
    kf = cross_validation.StratifiedKFold(Y, n_folds=10)

    # Treina o modelo com base nos dados de treinamento EM CADA PARTIÇÃO
    # e calcula os escores 
    round = 1
    scores = []

    for train_index, test_index in kf:
        X_train, X_test = X[train_index], X[test_index]
        Y_train, Y_test = Y[train_index], Y[test_index]

        # Instancia o algoritmo desejado (no caso, uma Árvore de Decisão)
        #model = DecisionTreeClassifier()

        # Treina com a partição de treinamento
        model.fit(X_train, Y_train)

        # Verificação com a partição de teste
        Y_pred = model.predict(X_test)
        score = model.score(X_test, Y_test)
        scores.append(score)

        # Cria a matriz de confusão regular e normalizada
        cm = confusion_matrix(Y_test, Y_pred)
        cm_norm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]

        # Imprime as matrizes de confusão
        np.set_printoptions(precision=2)
        #print(u"Rodada #{0} (score: {1:.2f})").format(round, score)
        round = round + 1

        #print(u"Partição de treinamento: do índice #{} ao índice #{}").format(train_index[0], train_index[-1])
        #print(u"Partição de teste: do índice #{} ao índice #{}").format(test_index[0], test_index[-1])
        #print(u"----------------------------")

        #print(u'Matriz de Confusão Regular')
        #print(cm)
        #print(u'Matriz de Confusão Normalizada')
        #print(cm_norm)

        plot_cm(table_names, cm, cm_norm)

    # Imprime o score mínimo, máximo e médio
    scores = np.array(scores)
    print(u"Score mínimo: {0:.2f} Score máximo: {1:.2f} Score médio: {2:.2f}").format(scores.min(), scores.max(), scores.mean())

    # Exibe todas as figuras
    plt.show()