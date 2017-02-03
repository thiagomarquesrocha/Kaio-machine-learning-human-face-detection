from collections import Counter
from data import get_data
import numpy as np
from sklearn.model_selection import cross_val_score


def fit_and_predict(nome, modelo, treino_dados, treino_marcacoes):
    k = 10
    scores = cross_val_score(modelo, treino_dados, treino_marcacoes, cv = k)
    taxa_de_acerto = np.mean(scores)
    msg = "Taxa de acerto do {0}: {1}".format(nome, taxa_de_acerto)
    print msg
    return taxa_de_acerto

def evaluate(X, Y):

    # X, Y = get_data()

    porcentagem_de_treino = 0.8

    tamanho_de_treino = porcentagem_de_treino * len(Y)

    tamanho_de_treino = int( tamanho_de_treino )

    treino_dados = X[0:tamanho_de_treino:]
    treino_marcacoes = Y[0:tamanho_de_treino:]

    validacao_dados = X[tamanho_de_treino:]
    validacao_marcacoes = Y[tamanho_de_treino:]

    # a eficacia do algoritmo que chuta
    # tudo um unico valor
    acerto_base = max(Counter(validacao_marcacoes).itervalues())
    taxa_de_acerto_base = 100.0 * acerto_base / len(validacao_marcacoes)

    print("Taxa de acerto base: %f" % taxa_de_acerto_base)

    from sklearn.multiclass import OneVsRestClassifier
    from sklearn.svm import LinearSVC

    modelo = OneVsRestClassifier(LinearSVC(random_state = 0))
    
    resultados = {}

    from sklearn.multiclass import OneVsRestClassifier
    from sklearn.svm import LinearSVC
    modeloOneVsRest = OneVsRestClassifier(LinearSVC(random_state = 0))
    resultadoOneVsRest = fit_and_predict("OneVsRest", modeloOneVsRest, treino_dados, treino_marcacoes)

    resultados[resultadoOneVsRest] = modeloOneVsRest

    from sklearn.multiclass import OneVsOneClassifier
    modeloOneVsOne = OneVsOneClassifier(LinearSVC(random_state = 0))
    resultadoOneVsOne = fit_and_predict("OneVsOne", modeloOneVsOne, treino_dados, treino_marcacoes)

    resultados[resultadoOneVsOne] = modeloOneVsOne

    from sklearn.naive_bayes import MultinomialNB
    modeloMultinomial = MultinomialNB()
    resultadoMultinomial = fit_and_predict("MultinomialNB", modeloMultinomial, treino_dados, treino_marcacoes)

    resultados[resultadoMultinomial] = modeloMultinomial 

    from sklearn.ensemble import AdaBoostClassifier
    modeloAdaBoost = AdaBoostClassifier()
    resultadoAdaBoost = fit_and_predict("AdaBoostClassifier", modeloAdaBoost, treino_dados, treino_marcacoes)

    resultados[resultadoAdaBoost] = modeloAdaBoost

    from sklearn.svm import SVC, LinearSVC
    modeloSVC = SVC(kernel='linear', C=1.0)
    resultadoSVC = fit_and_predict('SVC', modeloSVC, treino_dados, treino_marcacoes)

    resultados[resultadoSVC] = modeloSVC

    modeloLinearSVC = LinearSVC(random_state=111)
    resultadoLinearSVC = fit_and_predict('LinearSVC', modeloLinearSVC, treino_dados, treino_marcacoes)

    resultados[resultadoLinearSVC] = modeloLinearSVC

    vencedor = resultados[max(resultados)]

    print "Vencedor:"
    print vencedor

    vencedor.fit(treino_dados, treino_marcacoes)
    resultado = vencedor.predict(validacao_dados)

    acertos = (resultado == validacao_marcacoes)
    total_de_acertos = sum(acertos)
    total_de_elementos = len(validacao_marcacoes)
    taxa_de_acerto = 100.0 * total_de_acertos / total_de_elementos

    print("Taxa de acerto do algoritmo vencedor entre os algoritmos no mundo real : {0} ".format(taxa_de_acerto))


    print("Total de elementos : %d" % len(Y))

