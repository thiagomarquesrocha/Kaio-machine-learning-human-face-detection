from collections import Counter
import numpy as np
from sklearn.model_selection import cross_val_score
from sklearn.cross_validation import train_test_split


def accuracy_score(nome, modelo, X_train, y_train):
    """ Returns accuracy score for input truth and predictions. """
    k = 10
    # Ensure that the number of predictions matches number of outcomes using k-fold
    scores = cross_val_score(modelo, X_train, y_train, cv = k)
    # Calculate and return the accuracy as a percent
    taxa_de_acerto = np.mean(scores) * 100
    msg = "Taxa de acerto do {0}: {1:.2f}%".format(nome, round(taxa_de_acerto, 2))
    print msg
    return taxa_de_acerto 

def performance_metric(resultados, X_train, X_test, y_train, y_test):

    # a eficacia do algoritmo que chuta
    # tudo um unico valor
    acerto_base = max(Counter(y_test).itervalues())
    taxa_de_acerto_base = 100.0 * acerto_base / len(y_test)

    print("Taxa de acerto base: {0:.2f}%".format(round(taxa_de_acerto_base, 2)))

    vencedor = resultados[max(resultados)]

    print "\nVencedor:"
    print vencedor

    vencedor.fit(X_train, y_train)
    resultado = vencedor.predict(X_test)

    acertos = (resultado == y_test)
    total_de_acertos = sum(acertos)
    total_de_elementos = len(y_test)
    taxa_de_acerto = 100.0 * total_de_acertos / total_de_elementos

    print("\nTaxa de acerto do algoritmo vencedor entre os algoritmos no mundo real : {0:.2f}% ".format(round(taxa_de_acerto, 2)))

    total = len(y_train) + len(y_test)

    print("Total de elementos : {}".format(total))

