---
title: Projet décision Eco-score
description: "Lien de git: [https://github.com/aMarkraMa/Decision-Mathematics](https://github.com/aMarkraMa/Decision-Mathematics)"
image: /assets/blog/eco-score/cover.webp
createdAt: 2024-01-18
updatedAt: 2024-01-18
---

Lien de git: [https://github.com/aMarkraMa/Decision-Mathematics](https://github.com/aMarkraMa/Decision-Mathematics)

Groupe: Shengqi MA et Qinming Jiang

Réponses aux questions 3, 4, 7, 8, 9, 11, 12, 13, 14, 15, 16, et 17:

1. Une comparaison deux à deux des trois critères nous a conduit à:

![Untitled](/assets/blog/eco-score/Untitled.png)

![Untitled](/assets/blog/eco-score/Untitled%201.png)

![Untitled](/assets/blog/eco-score/Untitled%202.png)

1. Quelles sont les propriétés vérifiées par la Pareto Dominance ? À quelle structure particulière, vue en cours, correspond-elle? Vous devez apporter des justifications pour les propriétés vérifiées et celles non vérifiées.
- **Irréflexivité** : pour tout alternatives `a`, on ne peut pas dire que `a` est Pareto-domine que lui-même, car il n'y a pas au moins un critère d'évaluation qui rend X mieux que lui-même.
- **Transitivité** : Supposons qu'il existe trois alternatives `a, b et c`. Si l’alternative `a` est Pareto-domine à l’alternative `b` et que l’alternative `b` est Pareto-domine à l’alternative `c` , nous pouvons garantir que l’alternative `a` doit être Pareto-domine à l’alternative `c`. Car dans ce cas, `a` est au moins aussi bon que `b` sur tous les critères et mieux que `b` sur au moins un critère ; `b` est au moins aussi bon que `c` sur tous les critères et mieux que `c` sur au moins un critère. Donc, `a` est au moins aussi bon que Z sur tous les critères et mieux que `c` sur au moins un critère.
- **Asymétrique** : si l’alternative `a` est Pareto-domine à la **`b`**, on ne peut pas dire que l’alternative `b` est Pareto-domine à la **`a`**, car il existe au moins un critère qui rend `a` mieux que `b`.

Les propriétés ci-dessus nous permettent de supposer que Pareto-dominance correspond à une relation d'ordre strict. Mais le propriété asymétrique n’est pas vérifié par la relation d’ordre strict. On peut donc dire que Pareto-dominance est une sous-ensemble de la relation d’ordre strict.

7.

Le programme python donne:

Pourcentage avec 1, 14, 16 critère: 36.536%

1. 

Taux de substitution entre le critère 1 et le critère 14 = w1 / w14 = 21.06e−2/8.51e−2 = 2.4747
Taux de substitution entre le critère 1 et le critère 16 = w1 / w16 = 21.06e−2/7.55e−2 = 2.7894
Taux de substitution entre le critère 14 et le critère 16 = w14 / w16 = 8.51e−2/7.55e−2 = 1.1271

Expliquer ces taux de substitution : Le taux de substitution représente le poids d'un critère par rapport au poids d'un autre critère dans l'Éco-score. Par exemple, le taux de substitution entre le critère 1 et le critère 14 indique combien de fois le poids de le critère 1 est comparé au poids de le critère 14 dans le calcul de la note écologique. Un taux de substitution plus élevé signifie qu'un critère est plus important que l'autre et qu'il a une plus grande incidence sur l'Éco-score.

9.

$$

\begin{equation}
\left\{
\begin{array}{c}
    Min:||w - \hat{w}||_1\\
    SP_w(X) \geq SP_w(Y) \\
    \sum_{i=1}^{16} w_i = 1 \\
    w_i \geq 0, \quad i \in [1, 16]
\end{array}
\right.
\end{equation}

$$

11.

En raison de la taille des données de l'échantillon, il n'a pas été possible de calculer les résultats pour tous les échantillons de remplacement en peu de temps. Nous avons donc tracé un échantillon aléatoire de 10, ce qui a entraîné une certaine erreur dans les résultats à chaque fois, mais après les tests, les résultats étaient généralement similaires.

![Figure_1.png](/assets/blog/eco-score/Figure_1.png)

12.

Mise en œuvre des 2 méthodes:

```python
def p_ord(X, w):
    X_sorted = sorted(X)  
    MPO = sum(w[i] * X_sorted[i] for i in range(len(X)))
    return MPO

def p_geo(X, w):
    X_weighted = [x_i ** w_i for x_i, w_i in zip(X, w)]
    WG = reduce(mul, X_weighted) ** (1 / sum(w))
    return WG
```

Nous pouvons proposer des pondérations égales, avec des pondérations croissantes et décroissantes. Comme nous ne connaissons pas les 16 critères d'évaluation et les réglementations alimentaires qui s'y rapportent, nous devons analyser chaque question séparément. Par exemple, si nous voulons être aussi bénéfiques que possible pour humain, nous devrions augmenter les critères d'évaluation de la cancérogénicité du corps humain. Ou si nous voulons être les meilleurs pour l'environnement, nous devrions augmenter les critères pour d'autres émissions pertinentes.

13.

La moyenne géométrique pondérée et la moyenne pondérée ordonnée sont des alternatives à deux schémas d'évaluation. Contrairement à la somme pondérée, ils partagent une caractéristique commune, à savoir qu'ils satisfont à la non-décomposabilité.

Cela signifie que l'évaluation de l'ensemble du système ne peut pas être combinée linéairement avec les résultats des sous-schémas individuels.

14.$d_{KT} (R, R') =∑0.5(iRj ∧ jR'i) + 0.5((iRj ∧ ¬(iR'j)) ∨ (¬(jRi) ∧ jR'i)).$

La "mesure de distance", doit satisfaire à certaines propriétés de base ci-dessous.

1. **Non-négativité** : $d_{KT}(R, R') \geq 0$
    
    Etant donné que chaque paire de valeurs d'attributs i et j a une valeur de pénalité de 0, 0,5 ou 1 pour la relation de préférence entre elles, $d_{KT}(R, R')$ est la somme de ces valeurs non négatives, de sorte que $d_{KT}(R, R')$ doit être non-négative.
    
    Elle satisfait donc à Non-négativité
    
2. **Réflexivité** : $d_{KT}(R, R') = 0$ ***ssi***  $R = R'$
    
    **Cas R = R’:**
    
    $0,5 * (iRj ∧ jRi)$ : lorsque R = R', il n'existe aucun cas où iRj et jRi sont vrais en même temps, car R est une relation fortement séquentielle qui est antisymétrique. Par conséquent, la valeur de ce terme est toujours 0.
    
    $0,5 * ((iRj ∧ ¬(iRj)) ∨ (¬(jRi) ∧ jRi))$ : chaque sous-terme de ce terme est auto-contradictoire, c'est-à-dire de la forme $A ∧ ¬A$, et sa valeur est toujours fausse. Par conséquent, la valeur de ce terme est également toujours 0.
    En additionnant ces deux termes, on obtient :
    
    $d_{KT}(R, R')= ∑[0 + 0] = 0$
    
    **Cas R = R’:**
    
    Supposons qu'il existe deux relations fortement ordonnées différentes R et R', alors il y a au moins une paire d'éléments (i, j) satisfaisant des relations de préférence différentes pour R et R'. Cela implique qu'au moins l'une des conditions suivantes est remplie :
    
    iRj et jR'i ;
    jRi et iR'j ;
    iRj et ¬(iR'j), mais pas jRi et jR'i ;
    jRi et ¬(jR'i) sans satisfaire à la fois iRj et iR'j.
    
    La valeur de $d_{KT}(R, R')$ est différente de zéro dans l'un ou l'autre des cas ci-dessus.
    
    Elle satisfait donc à réflexivité
    

c. **Symétrique**: $d_{KT}(R, R') = d_{KT}(R', R)$

Nous pouvons constater que la valeur de la pénalité ne change pas lorsque l'on intervertit R et R'. 

Elle satisfait donc à symétrique

d. **Inégalité trigonométrique**: $d_{KT}(R, R'') ≤ d_{KT}(R, R') + d_{KT}(R', R'')$

Quatre combinaisons possibles de relations de préférence (i, j) sont utilisées pour calculer les valeurs de pénalité correspondantes pour $d_{KT}(R, R''), d_{KT}(R, R') ,d_{KT}(R', R'').$

1) iRj est valable à la fois dans R, R' et R'' : dans ce cas, $d_{KT}(R, R'') = d_{KT}(R, R'') = d_{KT}(R', R'') = 0$ et l'inégalité triangulaire est valable.

2) iRj est valable dans R et R' mais pas dans R'' (i.e. jR''i) : dans ce cas $d_{KT}(R, R'') = 1, d_{KT}(R, R') = 0, d_{KT}(R', R'') = 1.$ On voit que $d_{KT}(R, R'') ≤ d_{KT}(R, R') + d_{KT}(R', R'')$, c'est-à-dire 1 ≤ 0 + 1 et l'inégalité trigonométrique est vérifiée.

3) iRj est valable dans R et R'' mais pas dans R' (i.e. jR'i) : dans ce cas $d_{KT}(R, R'') = 0, d_{KT}(R, R') = 1, d_{KT}(R', R'') = 1$. On voit que $d_{KT}(R, R'') ≤ d_{KT}(R, R') + d_{KT}(R', R'')$, i.e. 0 ≤ 1 + 1 et l'inégalité trigonométrique est vérifiée.

4) iRj vaut dans R mais pas dans R' et R'' (c'est-à-dire jR'i et jR''i) : dans ce cas $d_{KT}(R, R'') = 1, d_{KT}(R, R') = 1, d_{KT}(R', R'') = 0$. On voit que $d_{KT}(R, R'') ≤d_{KT}(R, R') + d_{KT}(R', R'')$, c'est-à-dire 1 ≤ 1 + 0, et que l'inégalité triangulaire tient. triangulaire.

L'analyse ci-dessus nous permet de conclure que $d_{KT}(R, R'') ≤ d_{KT}(R, R') + d_{KT}(R', R'')$ est satisfait pour toutes les combinaisons possibles de relations de préférence (i, j), ce qui prouve l'inégalité trigonométrique.

Donc $d_{KT}$ définit bien une distance sur les ordres forts définis sur A.

15.

dKT(MPO, MG): 13286.0

16.

1. La fonction logarithmique est non linéaire.

![Untitled](/assets/blog/eco-score/Untitled%203.png)

b. L'avantage de cette fonction est qu'elle est plus discriminante pour des valeurs proches de 0. L'inconvénient est qu'elle est plus complexe et moins facile à comprendre.

c. On peut propose une alternative linéaire ci-dessous:

Valeur normalisée = (x - valeur minimale) / (valeur maximale - valeur minimale) × 100

valeur minimale = La plus petite valeur de l'ensemble à normaliser

valeur maximale = La plus grand valeur de l’ensemble à normaliser
