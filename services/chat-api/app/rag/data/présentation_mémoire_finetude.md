# Soutenance mémoire – Script

## 1. Introduction
Bonjour à toutes et à tous.  
Je vous remercie de votre présence aujourd’hui.

Aujourd’hui, je vais présenter mon mémoire de master, intitulé :

**« Prédiction de la faillite des PME avec TabTransformer et analyse de son interprétabilité »**.

Ce travail s’appuie sur mon expérience en alternance au sein du département de modélisation des risques financiers de Bpifrance.

Le sujet vise à répondre à un problème concret :

Comment améliorer la prédiction et l’interprétation du risque de défaillance des entreprises ?

---

## 2. Plan
1. Contexte du problème  
2. Contenu de la recherche  
3. Méthodologie  
4. Analyse des résultats  
5. Conclusion  

---

## 3. Contexte du problème
À la fin avril 2025, le nombre cumulé de faillites d’entreprises sur 12 mois en France a atteint 66 937.

Imaginez que vous êtes banquier. Chaque jour, des entreprises demandent des prêts.

Si vous financez une entreprise qui fait faillite :
- perte financière  
- risque systémique  

Si vous refusez une entreprise saine :
- perte d’opportunité  

Le risque doit être suivi dans le temps.

Peut-on prédire à l’avance la faillite d’une entreprise ?

---

## 4. Contenu de la recherche
### Méthodes statistiques
Régression logistique, Z-score

### Machine Learning
XGBoost, SVM

### Deep Learning
MLP, CNN, RNN

Les modèles ML sont performants mais peu interprétables.

---

## 5. Solution
### TabTransformer
Modèle basé sur l’attention pour données tabulaires.

### SHAP
Méthode d’interprétation basée sur la théorie des jeux.

---

## 6. Méthodologie
### Données
- 34 027 PME françaises  
- Source : Orbis  
- 10 ans de données  

### Prétraitement
- interpolation temporelle  
- médiane sectorielle  
- médiane globale  

### Déséquilibre
- SMOTE  
- SMOTE-ENN  

### Modèles
- Logistique  
- XGBoost  
- TabTransformer  

---

## 7. Résultats
- XGBoost meilleur global  
- TabTransformer compétitif  
- SMOTE efficace  

---

## 8. Interprétabilité
Variables clés :
- EV/EBITDA  
- Net Profit  
- Revenue  
- ROA  

Variables non financières importantes.

---

## 9. Conclusion
### Contributions
- Dataset original  
- Évaluation TabTransformer  
- Interprétabilité SHAP  

### Perspectives
- variables macroéconomiques  
- optimisation du modèle  

---

## 10. Fin
Merci pour votre attention.
