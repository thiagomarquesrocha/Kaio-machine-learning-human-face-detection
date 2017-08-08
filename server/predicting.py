#############################################################
#  Predict methods supporting to test accuracy and perfomance
#############################################################

# Import
from collections import Counter
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import learning_curve
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import train_test_split

# Generate a simple plot of the test and training learning curve.
def plot_learning_curve(estimator, title, X, y, ylim=None, cv=None,
                        n_jobs=1, train_sizes=np.linspace(.1, 1.0, 5)):
    """
    Generate a simple plot of the test and training learning curve.

    Parameters
    ----------
    estimator : object type that implements the "fit" and "predict" methods
        An object of that type which is cloned for each validation.

    title : string
        Title for the chart.

    X : array-like, shape (n_samples, n_features)
        Training vector, where n_samples is the number of samples and
        n_features is the number of features.

    y : array-like, shape (n_samples) or (n_samples, n_features), optional
        Target relative to X for classification or regression;
        None for unsupervised learning.

    ylim : tuple, shape (ymin, ymax), optional
        Defines minimum and maximum yvalues plotted.

    cv : int, cross-validation generator or an iterable, optional
        Determines the cross-validation splitting strategy.
        Possible inputs for cv are:
          - None, to use the default 3-fold cross-validation,
          - integer, to specify the number of folds.
          - An object to be used as a cross-validation generator.
          - An iterable yielding train/test splits.

        For integer/None inputs, if ``y`` is binary or multiclass,
        :class:`StratifiedKFold` used. If the estimator is not a classifier
        or if ``y`` is neither binary nor multiclass, :class:`KFold` is used.

        Refer :ref:`User Guide <cross_validation>` for the various
        cross-validators that can be used here.

    n_jobs : integer, optional
        Number of jobs to run in parallel (default 1).
    """
    plt.figure()
    plt.title(title)
    if ylim is not None:
        plt.ylim(*ylim)
    plt.xlabel("Training examples")
    plt.ylabel("Score")
    train_sizes, train_scores, test_scores = learning_curve(
        estimator, X, y, cv=cv, n_jobs=n_jobs, train_sizes=train_sizes)
    train_scores_mean = np.mean(train_scores, axis=1)
    train_scores_std = np.std(train_scores, axis=1)
    test_scores_mean = np.mean(test_scores, axis=1)
    test_scores_std = np.std(test_scores, axis=1)
    plt.grid()

    plt.fill_between(train_sizes, train_scores_mean - train_scores_std,
                     train_scores_mean + train_scores_std, alpha=0.1,
                     color="r")
    plt.fill_between(train_sizes, test_scores_mean - test_scores_std,
                     test_scores_mean + test_scores_std, alpha=0.1, color="g")
    plt.plot(train_sizes, train_scores_mean, 'o-', color="r",
             label="Training score")
    plt.plot(train_sizes, test_scores_mean, 'o-', color="g",
             label="Cross-validation score")

    plt.legend(loc="best")
    return plt

### Get the accuracy score for input truth and predictions.s
def accuracy_score(nome, modelo, X_train, y_train):
    k = 10
    # Ensure that the number of predictions matches number of outcomes using k-fold
    scores = cross_val_score(modelo, X_train, y_train, cv = k)
    # Calculate and return the accuracy as a percent
    taxa_de_acerto = np.mean(scores) * 100
    msg = "Taxa de acerto do {0}: {1:.2f}%".format(nome, round(taxa_de_acerto, 2))
    print msg
    return taxa_de_acerto 

### Get the perfomance score for one algorithm.
def performance_metric(resultados, X_train, X_test, y_train, y_test):
    # A eficacia do algoritmo que chuta, tudo em um unico valor
    acerto_base = max(Counter(y_test).itervalues())
    taxa_de_acerto_base = 100.0 * acerto_base / len(y_test)

    print("Taxa de acerto base: {0:.2f}%".format(round(taxa_de_acerto_base, 2)))

    vencedor = resultados[max(resultados)]

    print "\nVencedor:"
    print vencedor

    real_world(vencedor, X_train, X_test, y_train, y_test)

    total = len(y_train) + len(y_test)

    print("Total de elementos : {}".format(total))

    return vencedor

def real_world(clf, X_train, X_test, y_train, y_test):
    clf.fit(X_train, y_train)
    resultado = clf.predict(X_test)
    total_de_elementos = len(y_test)

    acertos = (resultado == y_test)
    total_de_acertos = sum(acertos)
    taxa_de_acerto = 100.0 * total_de_acertos / total_de_elementos

    print("\nTaxa de acerto do algoritmo vencedor entre os algoritmos no mundo real : {0:.2f}% ".format(round(taxa_de_acerto, 2)))


