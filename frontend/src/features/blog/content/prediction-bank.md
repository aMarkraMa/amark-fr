---
title: Prédiction de souscription à une offre d’épargne bancaire
description: "Dans ce projet, notre objectif est d'explorer et de comparer plusieurs méthodes d'apprentissage automatique afin de prédire si les clients souscriront à un dépôt à terme bancaire. Nous évaluerons l'ef…"
image: /assets/blog/prediction-bank/cover.webp
createdAt: 2024-01-31
updatedAt: 2024-01-31
---

# Introduction

Dans ce projet, notre objectif est d'explorer et de comparer plusieurs méthodes d'apprentissage automatique afin de prédire si les clients souscriront à un dépôt à terme bancaire. Nous évaluerons l'efficacité de ces algorithmes différents en utilisant des données réelles de campagnes de télémarketing bancaire. Ce projet vise à comprendre en profondeur les avantages et les limites de chaque algorithme et à trouver la solution la plus adaptée pour améliorer le taux de réussite des campagnes de télémarketing.

# Prétraitement des données

## Importation des données

Nous avons utilisé des données complètes, importées directement de la source officielle à l'aide de la commande "import". Ces données comprennent au total 16 variables caractéristiques, y compris six variables continues, neuf variables nominales et un item cible y. Nous pouvons voir dans "bank_marketing.variables" que trois caractéristiques présentent des valeurs manquantes, donc nous adopterons des méthodes spécifiques dans les étapes suivantes pour les adresser.

```python
!pip install ucimlrepo

from ucimlrepo import fetch_ucirepo
```

```python
from ucimlrepo import fetch_ucirepo

# fetch dataset
bank_marketing = fetch_ucirepo(id=222)

# data (as pandas dataframes)
X = bank_marketing.data.features
y = bank_marketing.data.targets

# metadata
print(bank_marketing.metadata)

# variable information
print(bank_marketing.variables)
```

![Untitled](/assets/blog/prediction-bank/Untitled.png)

![Untitled](/assets/blog/prediction-bank/Untitled%201.png)

```python
import pandas as pd
data_types = X.dtypes
data_type = y.dtypes
print(data_types)
print(data_type)
```

![Untitled](/assets/blog/prediction-bank/Untitled%202.png)

Ici, nous pouvons voir que les types de données sont principalement des types entiers et des objets. La variable cible (y) est de type objet, contenant des valeurs 'yes' ou 'no', donc c'est un problème de classification.

## Imputation

---

Nous commençons d'abord par le traitement des valeurs manquantes. Dans bank_marketing.variables, nous pouvons constater que trois colonnes contiennent des valeurs manquantes. Nous ne savons pas comment compléter ces données, un remplissage incorrect des valeurs manquantes peut souvent introduire de nouveaux bruits dans les données, conduisant à des erreurs de prévision. Par conséquent, nous choisissons d'éliminer les colonnes avec ces valeurs manquantes. Nous supprimons les trois colonnes où les données manquantes sont marquées comme vraies, c'est-à-dire 'contact', 'poutcome' et 'pdays'.

```python
import pandas as pd
import numpy as np

#On supprime des columns qui a missing data est vrai
X = X.drop(['contact', 'poutcome', 'pdays'], axis = 'columns')
```

Ensuite, nous traitons les lignes comportant des valeurs manquantes. Nous pouvons constater qu'avant le traitement, nous avons 45211 lignes de données, et après le traitement, le nombre est réduit à 43193 lignes.

```python
#On supprime des lignes qui a missing data NaN
X_concat = pd.concat([X, y], axis = 'columns', join = 'inner')
print(X_concat)
X_concat = X_concat.dropna(axis=0, how='any')
X = X_concat.drop(['y'], axis = 1)
y = X_concat['y']
print(X)
print(y)
```

## Traitement des données en double

Nous avons tenté de repérer toute donnée en double, bien que les résultats indiquent qu'il n'y a pas de données dupliquées.

```python
X.duplicated()
X.drop_duplicates()
```

![Untitled](/assets/blog/prediction-bank/Untitled%203.png)

## Traitement de données non pertinentes

---

Notre ensemble de caractéristiques contient à la fois des variables discrètes et des variables continues. Par conséquent, nous traitons séparément les variables discrètes et les variables continues.

Nous ne sommes pas sûrs que chaque colonne de caractéristiques soit indépendante les unes des autres, donc des méthodes telles que le test du chi-carré ne sont pas appropriées."

---

Pour les variables continues, nous commençons d'abord par une analyse de variance pour observer leur degré de dispersion. Si le degré de dispersion est faible, cela signifie que les données ne varient pas beaucoup, et donc elles ne sont pas d'une grande aide pour prédire nos résultats.

```python
from sklearn.feature_selection import VarianceThreshold

variances = X.var(numeric_only = True)
print(variances)
```

![Untitled](/assets/blog/prediction-bank/Untitled%204.png)

En observant les données de chaque caractéristique et leur variance, elles semblent être relativement dispersées, donc nous analysons davantage leur utilisabilité à travers des histogrammes et des boîtes à moustaches

```python
import seaborn as sns
import matplotlib.pyplot as plt

# visuliser des données
X.hist(bins=50, figsize=(20,15))
plt.xlim(left=-3, right=3)
plt.show()

# visualiser les relations entre des critères et variable cible
for col in X.columns:
    sns.boxplot(x=y, y=X[col], data=X)
    plt.show()
```

![Untitled](/assets/blog/prediction-bank/Untitled%205.png)

En visualisant le diagramme en boîte, nous pouvons constater que 'default' semble ne pas avoir d'impact sur le résultat.

La colonne default contient 42411 'no' et seulement 782 'yes', ce qui indique que presque toutes les observations ont la même valeur. Par conséquent, cette caractéristique pourrait ne pas être très utile pour le modèle.

```python
#Afficher la fréquence de chaques caractéristiques
for column in X.select_dtypes(include=['object', 'category']).columns:
    print(f"Frequency of unique values for {column}:")
    print(X[column].value_counts())
    print("\n")

# Sélection de données catégorielles
categorical_columns = X.select_dtypes(include=['object', 'category']).columns

# Définir la taille globale de l'image
n_rows = (len(categorical_columns) + 3) // 4

# taille d'image
plt.figure(figsize=(20, 5 * n_rows))

# Pour chaque colonne de type de catégorie, créer un diagramme à barres
for i, column in enumerate(categorical_columns, 1):
    plt.subplot(n_rows, 4, i)
    value_counts = X[column].value_counts()
    value_counts.plot(kind='bar')
    plt.title(f'Frequency of unique values for {column}')
    plt.xlabel('Category')
    plt.ylabel('Frequency')

# Ajuster l'espacement entre les sous-graphes
plt.tight_layout()
plt.show()
```

![Untitled](/assets/blog/prediction-bank/Untitled%206.png)

On supprime donc la colonne 'defaut’

```python
X = X.drop(['default'], axis = 'columns')
```

# Entraînement et test du modèle.

---

En raison de l'imbalance des données de la variable cible y, nous utilisons le ROC AUC comme notre critère d'évaluation. L'AUC vise à entraîner un modèle minimisant les faux positifs, c'est-à-dire une approche conservatrice dans l'extrapolation des connaissances, tandis que le F1 vise à ne manquer aucun modèle potentiel, donc une approche plus agressive dans l'extrapolation. Par conséquent, après avoir évalué la situation réelle des données, notamment dans le contexte de la télévente bancaire, nous avons finalement opté pour l'AUC qui est relativement conservatrice et permet d'éviter les problèmes potentiels liés au déséquilibre des données.

---

Compte tenu du type de données du projet, nous avons déterminé qu'il s'agissait d'un problème de classification nécessitant des méthodes d'apprentissage supervisé, et nous avons donc choisi cinq méthodes à étudier : KNN, Bayes, réseaux de neurones, arbres de décision et forêts aléatoires.

---

## Validation croisée à k(5) blocs

---

Pour refléter fidèlement la capacité de généralisation du modèle, nous optons pour une validation croisée à k plis

En voici un exemple

![Untitled](/assets/blog/prediction-bank/Untitled%207.png)

## knn

---

Le knn est l'une des méthodes de machine learning les plus simples et les plus éprouvées. Pour mettre en œuvre le knn et les autre méthodes de machine learning, nous commençons d'abord par standardiser les variables continues afin d'éliminer l'impact des différences d'échelles sur le calcul des distances. Ensuite, nous appliquons un codage one-hot aux variables nominales (par exemple : (0, 0, 1), (1, 0, 0), (0, 1, 0)), car l'utilisation du codage par étiquettes pourrait affecter la distance calculée par le knn

**Standardisation**

```python
from sklearn.preprocessing import StandardScaler

continuous = ['age', 'balance','day_of_week', 'duration', 'campaign', 'previous']

continuous_features = X[continuous]
categorical_features = X.drop(continuous, axis = 1)

scaler = StandardScaler()
scaled_continuous = scaler.fit_transform(continuous_features)

scaled_continuous_X = pd.DataFrame(scaled_continuous, columns=continuous_features.columns)

X_stand = pd.concat([scaled_continuous_X, categorical_features.reset_index(drop=True)], axis=1)

print(X_stand)
```

![Untitled](/assets/blog/prediction-bank/Untitled%208.png)

**One-hot encoding**

```python
from sklearn.preprocessing import OneHotEncoder

#Sélection des variables nominales
columns_to_encode = ['job', 'marital', 'education', 'housing', 'loan', 'month']

# on crée instance de OneHotEncoder
encoder = OneHotEncoder(sparse=False)

# Appliquer un OneHotEncoder unique aux colonnes de variables nominales
encoded_columns = encoder.fit_transform(X_stand[columns_to_encode])

# Convertir les données encodées en DataFrame et s'assurer que l'index est aligné avec X_stand
encoded_columns = pd.DataFrame(encoded_columns,index=X_stand.index,columns=encoder.get_feature_names_out(columns_to_encode))

# Retirer les colonnes de données catégorielles brutes de X et ajouter les colonnes encodées
X_encoded = X_stand.drop(columns_to_encode, axis=1)
X_encoded_stand = pd.concat([X_encoded, encoded_columns], axis=1)
```

```python
y = y.map({'no': 0, 'yes': 1})

X_encoded_stand
```

![Untitled](/assets/blog/prediction-bank/Untitled%209.png)

Nous sélectionnons le meilleur k à l'aide du modèle GridSearchCV avec des paramètres ajustés.

Comme les données de la variable cible y sont déséquilibrées (beaucoup plus de 'non' que de 'oui'), nous choisissons le score roc_auc comme critère.

---

Nous avons manuellement ajusté les valeurs présélectionnées pour n_neighbors à plusieurs reprises, avec des valeurs comme 3, 5... 97, 99, et finalement, le modèle a convergé vers le meilleur résultat avec k=89.

Pour la vitesse d'exécution du code, nous avons seulement conservé 3 89 et 99

```python
from sklearn.model_selection import train_test_split
from sklearn.model_selection import GridSearchCV
from sklearn.neighbors import  KNeighborsClassifier
from sklearn.model_selection import  KFold

# Diviser le jeu de données en ensemble d'entraînement et ensemble de test (60 % : 20 %)
X_train, X_test, y_train, y_test = train_test_split(X_encoded_stand, y, test_size=0.2, random_state=42)

#Configurer les valeurs présélectionnées pour n_neighbors
parameters={'n_neighbors':[3, 89, 99]}
knn=KNeighborsClassifier()

#Validation croisée en 5 plis
clf=GridSearchCV(knn,parameters,cv=5,scoring='roc_auc')
clf.fit(X_train,y_train)

print("best roc_auc score：%.3f"%clf.best_score_,"best n_neighbors：",clf.best_params_)
```

`best roc_auc score：0.891 best n_neighbors： {'n_neighbors': 89}`

```python
from sklearn.metrics import roc_auc_score

# Utiliser le modèle avec les paramètres optimaux pour faire des prédictions
best_knn = clf.best_estimator_
# Obtenir la probabilité de la classe positive
y_pred = best_knn.predict_proba(X_test)[:, 1]

# Calculer le score ROC AUC sur l'ensemble de test
test_auc = roc_auc_score(y_test, y_pred)
print("Score ROC AUC sur y_test：%.3f" % test_auc)
```

`Score ROC AUC sur y_test：0.893`

```python
from sklearn.metrics import roc_curve, auc

fpr, tpr, _ = roc_curve(y_test, y_pred)

roc_auc = auc(fpr, tpr)

plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Receiver Operating Characteristic (ROC) Curve')
plt.legend(loc="lower right")
plt.show()
```

![Untitled](/assets/blog/prediction-bank/Untitled%2010.png)

## Classificateur Bayésien naïf

Pour le classificateur Bayésien naïf, nous ne pouvons pas déterminer si chaque caractéristique est indépendante des autres, donc nous avons décidé de ne pas utiliser la classification bayésienne

## Réseaux de Neurones

Nous avons testé différents paramètres pour estimator__hidden_layer_sizes : trois couches de neurones (100, 50, 30), deux couches (100, 50) et une couche (200), (100), (50). La meilleure solution s'est avérée être une seule couche de 100 neurones cachés.

Nous avons passé beaucoup de temps à chercher les meilleurs paramètres et, pour des raisons de performance et de temps d'exécution, nous n'avons gardé que 100 et 50 comme exemples dans le code.

```python
from sklearn.pipeline import Pipeline
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler

RANDOM_SEED = 42
GRID = [
    {'estimator': [MLPClassifier(random_state=RANDOM_SEED)],
     'estimator__solver': ['adam'],
     'estimator__learning_rate_init': [0.0001],
     'estimator__max_iter': [300],
     'estimator__hidden_layer_sizes': [(100,), (50,)],
     'estimator__activation': ['relu'],
     'estimator__early_stopping': [True, False]
     }
]

PIPELINE = Pipeline([('scaler', None), ('estimator', MLPClassifier())])
```

```python
from sklearn.metrics import accuracy_score

# ffnn = MLPClassifier(hidden_layer_sizes=(100,), max_iter=300, activation='relu', solver='adam', random_state=42)

# ffnn.fit(X_train, y_train)

# y_pred_ffnn = ffnn.predict(X_test)

# y_pred_ffnn

grid_search = GridSearchCV(estimator=PIPELINE, param_grid=GRID,
                            scoring='roc_auc',
                            n_jobs=-1, cv=5, refit=True, verbose=1,
                            return_train_score=False)

grid_search.fit(X_train, y_train)

y_pred_ffnn = grid_search.predict(X_test)

y_pred_ffnn
```

`Fitting 5 folds for each of 4 candidates, totalling 20 fits
array([0, 0, 0, ..., 0, 0, 0])`

```python
y_pred_proba_ffnn = grid_search.predict_proba(X_test)[:, 1]

fpr_ffnn, tpr_ffnn, _ = roc_curve(y_test, y_pred_proba_ffnn)

auc_ffnn = auc(fpr_ffnn, tpr_ffnn)

best_params = grid_search.best_params_
print(best_params)

plt.figure(figsize=(8, 6))
plt.plot(fpr_ffnn, tpr_ffnn, color='darkorange', lw=2, label=f'FFNN ROC curve (area = {auc_ffnn:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Receiver Operating Characteristic')
plt.legend(loc="lower right")
plt.show()
```

![Untitled](/assets/blog/prediction-bank/Untitled%2011.png)

print(auc_ffnn)

## Arbre de decision

### One-hot encoding

Parce que l'arbre de décision est un modèle basé sur la division, par exemple l'arbre de décision ID3 repose sur le critère de division maximal de gain d'information, et cette division n'est pas influencée par tout changement monotone. Comme il s'agit d'un changement monotone, cela n'affecte pas le classement des valeurs des caractéristiques et n'affecte pas la division, nous n'avons donc pas besoin d'utiliser un ensemble de données standardisé.

```python
columns_to_encode = ['job', 'marital', 'education', 'housing', 'loan', 'month']

encoder = OneHotEncoder(sparse=False)

encoded_columns = encoder.fit_transform(X[columns_to_encode])

encoded_columns_df = pd.DataFrame(encoded_columns, index=X.index)
new_column_names = encoder.get_feature_names_out(columns_to_encode)
encoded_columns_df.columns = new_column_names

new_X = pd.concat([X, encoded_columns_df], axis=1)
new_X = new_X.drop(columns_to_encode, axis=1)
```

```python
y = y.map({'no': 0, 'yes': 1})
```

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(new_X, y, test_size=0.2, random_state=42)
```

Dans notre modèle d'arbre de décision, nous avons finalement choisi une profondeur de 10, un minimum de 10 échantillons pour rediviser un nœud interne et un minimum de 4 échantillons pour les feuilles, car nous avons constaté que dans cette configuration, le modèle ne surajuste pas et offre les meilleures performances. Nous avons choisi l'entropie comme critère de décision plutôt que l'indice de Gini, car nous avons trouvé que le calcul du log peut prévenir les débordements de calcul, ce qui est adapté pour traiter des probabilités très faibles.

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import roc_auc_score

param_grid = {
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'criterion': ['gini', 'entropy']
}

dt = DecisionTreeClassifier(random_state=42)

grid_search = GridSearchCV(dt, param_grid, cv=5, scoring='roc_auc', n_jobs=-1, verbose=2)

grid_search.fit(X_train, y_train)

best_params = grid_search.best_params_
print(f"Best parameters: {best_params}")

best_dt = DecisionTreeClassifier(**best_params, random_state=42)

best_dt.fit(X_train, y_train)

y_pred_proba_best_dt = best_dt.predict_proba(X_test)[:, 1]
roc_auc_best_dt = roc_auc_score(y_test, y_pred_proba_best_dt)
print(f"ROC AUC of Best Decision Tree on Test Set: {roc_auc_best_dt:.4f}")
```

`Fitting 5 folds for each of 72 candidates, totalling 360 fits
Best parameters: {'criterion': 'entropy', 'max_depth': 10, 'min_samples_leaf': 4, 'min_samples_split': 10}
ROC AUC of Best Decision Tree on Test Set: 0.8730`

```python
from sklearn.metrics import roc_curve, auc
import matplotlib.pyplot as plt

fpr, tpr, thresholds = roc_curve(y_test, y_pred_proba_best_dt)

roc_auc = auc(fpr, tpr)

plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC Curve (area = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Receiver Operating Characteristic (ROC) Curve')
plt.legend(loc="lower right")
plt.show()
```

```
from sklearn.metrics import roc_curve, auc
import matplotlib.pyplot as plt

fpr, tpr, thresholds = roc_curve(y_test, y_pred_proba_best_dt)

roc_auc = auc(fpr, tpr)

plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC Curve (area = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Receiver Operating Characteristic (ROC) Curve')
plt.legend(loc="lower right")
plt.show()
```

## Random Forests

Dans la forêt aléatoire, nous avons utilisé une recherche sur grille, évaluant les performances de différentes combinaisons de paramètres par validation croisée pour trouver la meilleure combinaison de paramètres prédéfinis.

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import roc_auc_score

random_forest = RandomForestClassifier(random_state=42)

param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [None, 10, 20],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

grid_search = GridSearchCV(estimator=random_forest, param_grid=param_grid, cv=5, scoring='roc_auc', n_jobs=-1, verbose=2)

grid_search.fit(X_train, y_train)

best_params = grid_search.best_params_
print(f"Best parameters: {best_params}")

best_random_forest = RandomForestClassifier(**best_params, random_state=42)

best_random_forest.fit(X_train, y_train)
```

![Untitled](/assets/blog/prediction-bank/Untitled%2012.png)

![Untitled](/assets/blog/prediction-bank/Untitled%2013.png)

# Conclusion

---

Dans ce projet, nous avons d'abord confirmé le problème et l'objectif, puis nous avons décrit les données, éliminé les valeurs manquantes, les doublons et les valeurs et variables peu utiles pour nos prédictions.

---

Pour mieux entraîner, nous avons standardisé les données en fonction des besoins de différentes méthodes et numérisé les données catégorielles.

---

Nous avons également utilisé la validation croisée k-fold, car elle peut réduire le surajustement dans une certaine mesure.

---

Ensuite, compte tenu du type de données du projet, nous avons déterminé qu'il s'agissait d'un problème de classification nécessitant des méthodes d'apprentissage supervisé, et nous avons donc choisi cinq méthodes à étudier : KNN, Bayes, réseaux de neurones, arbres de décision et forêts aléatoires.

---

Lors de l'entraînement, nous avons constaté que pour le classificateur bayésien naïf, nous ne pouvions pas être certains de l'indépendance de chaque caractéristique par rapport aux autres, donc nous avons décidé de ne pas utiliser la classification bayésienne.

---

De plus, nous avons comparé les méthodes de test ROC/AUC et F1. Nous avons finalement choisi ROC/AUC plutôt que F1 pour tester ce modèle d'apprentissage machine car nous avons trouvé que l'ensemble de données de la banque présentait un déséquilibre, avec beaucoup plus d'échantillons négatifs que positifs. De plus, dans la pratique, nous sommes plus préoccupés par le fait de recommander aux utilisateurs des options financières dont ils n'ont pas besoin, ce qui pourrait réduire l'expérience utilisateur, plutôt que de manquer des options financières qui pourraient intéresser les utilisateurs, donc dans ce cas, ROC/AUC est plus approprié.

---

Voici les données des quatre autres méthodes :

| Méthode | ROC, AUC | Temps |
| --- | --- | --- |
| knn | 0.89 | 25 s |
| Réseau neuronal | 0.92 | 340 s |
| Arbre de décision | 0.87 | 60 s |
| Forêt aléatoire | 0.93 | 2520 s |

En comparant les scores finaux de tous les modèles, nous pouvons voir que les indicateurs AUC des quatre modèles sont tous entre 0,85 et 0,95, ce qui est très bon, et aucun d'eux n'est en surajustement ou en généralisation excessive. Parmi eux, la forêt aléatoire a le plus haut AUC (0,93), suivi par le réseau neuronal (0,92). Mais de même, nous avons constaté que la forêt aléatoire a le temps d'exécution le plus long et le coût de calcul le plus élevé.
