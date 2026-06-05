---
title: Prise de décision multicritères pour choisir une université
description: "Dans un monde où des dizaines de milliers d'institutions d'enseignement supérieur existent, les étudiants se trouvent souvent confus et impuissants lorsqu'il s'agit de choisir l'établissement idéal. L…"
image: /assets/blog/decision-making-university/cover.webp
createdAt: 2024-01-18
updatedAt: 2024-01-18
---

## I. Introduction

Dans un monde où des dizaines de milliers d'institutions d'enseignement supérieur existent, les étudiants se trouvent souvent confus et impuissants lorsqu'il s'agit de choisir l'établissement idéal. L'asymétrie de l'information et la dépendance excessive aux classements des écoles, qui se concentrent souvent sur des données quantitatives telles que le ratio enseignants-étudiants ou le financement de la recherche, ne reflètent pas pleinement les besoins individualisés des étudiants, tels que l'intensité de la recherche dans un domaine spécifique, la culture du campus ou la situation géographique. Par conséquent, l'application de la méthode de Analyse Décisionnelle Multicritère (MCDA) offre une solution, permettant aux étudiants de prendre en compte divers facteurs tels que la réputation académique, les opportunités de recherche, la diversité des cours, l'environnement culturel, le coût de la vie et les objectifs professionnels personnels pour évaluer les écoles de manière plus complète et systématique, et ainsi faire des choix mieux adaptés à leurs besoins et attentes. Par exemple, un étudiant issu d'une famille ouvrière française moyenne sera plus enclin à choisir une école dont les frais de scolarité sont moins élevés.

## II. Modélisation

### a**. La spécification et l’analyse du problème décisionnel.**

1. L’objectif de l’analyse
    
    Sur la base des préférences de l'élève, sélectionnez 3 établissements qui correspondent à ses préférences et qui sont les mieux adaptés à sa candidature.
    
2. La problématique d’aide à la décision 
    
    C’est un problématique de choix.
    
3. L’information disponible
    
    QS est une organisation britannique qui classe les universités du monde entier. Bien que QS ait fait l'objet de nombreuses controverses ces dernières années, il est indéniable que les classements restent le point de référence pour la plupart des entreprises et des employeurs.
    
    ![Untitled](/assets/blog/decision-making-university/Untitled.png)
    
    1. L'Index de Réputation Académique est le point central des Classements Mondiaux des Universités QS, avec un poids de 30%. Il s'agit d'une approche de l'évaluation internationale des universités que QS a initiée en 2004, et c'est le composant qui suscite le plus d'intérêt et d'attention. En conjonction avec l'Index de Réputation des Employeurs, c'est l'aspect qui distingue le plus clairement ce classement de tous les autres. Il vise à répondre à la question essentielle : quelles universités démontrent l'excellence académique ? Pour répondre à cette question, nous résumons l'intelligence collective des universitaires du monde entier qui s'appuient sur leur discipline et leur expertise régionale pour guider leurs réponses. La réponse à cette question éclaire non seulement la qualité de la recherche d'une institution, mais aussi son approche des partenariats académiques, son impact stratégique, son caractère innovant sur le plan éducatif, ainsi que l'impact qu'elle a eu sur l'éducation et la société en général.
    2. La réputation de l'employeur est unique dans les évaluations internationales actuelles, car elle prend en compte une composante essentielle de l'employabilité. Nous sommes toujours les seuls à nous concentrer sur cet aspect crucial du parcours éducatif des étudiants. La plupart des étudiants de premier cycle quittent l'université après avoir obtenu leur premier diplôme pour chercher un emploi, ce qui fait de la réputation de l'employeur un facteur de décision important. L'indice de réputation de l'employeur est un indicateur clé du classement mondial des universités QS, représentant 15 % du poids dans le classement mondial des universités.
    3. Le ratio enseignant-étudiant est l'un des principaux indicateurs de nombreux classements QS. Cet indicateur vise à servir de proxy pour l'environnement d'apprentissage et d'enseignement de l'institution. Plus il y a de ressources académiques mises à la disposition des étudiants, telles que l'enseignement, la supervision, le développement de programmes et le soutien pastoral, meilleure devrait être leur expérience d'apprentissage. Sa méthode de calcul consiste à diviser le nombre d'enseignants vérifiés par QS par le nombre d'étudiants vérifiés par QS. Il vise à servir de critère de mesure proxy de l'environnement d'apprentissage et d'enseignement de l'institution. Cet indicateur recueille des données sur l'équivalent temps plein (ETP) des étudiants et des enseignants à temps plein (ETP).
    4. Le score de citation par enseignant contribue à hauteur de 20 % au classement mondial des universités. Il mesure la force et la quantité relatives de la recherche en cours au sein d'une institution, tout en tenant compte de sa taille. L'évaluation de la citation prend en compte la taille de l'institution, ce qui en fait une mesure largement acceptée et facile à comprendre de la puissance de la recherche.
    5. Le ratio international des enseignants se concentre sur la proportion d'enseignants internationaux par rapport à l'ensemble du personnel. Si une institution attire un grand nombre d'enseignants internationaux, cela présente des avantages pour la diversité et la collaboration dans la recherche et l'enseignement. De plus, si une institution attire un grand nombre d'employés étrangers, cela démontre son attrait suffisant pour le faire. Il calcule la proportion d'enseignants étrangers travaillant à l'université pour l'enseignement académique, la recherche, ou les deux, pendant au moins trois mois, par rapport au nombre total d'enseignants.
    6. La proportion d'étudiants internationaux se concentre sur le pourcentage d'étudiants internationaux par rapport au nombre total d'étudiants. Si un établissement attire un grand nombre d'étudiants internationaux, cela est bénéfique en termes de réseautage, d'échanges culturels, d'expériences d'apprentissage plus diversifiées et de diversité des anciens élèves. De plus, si un établissement attire un grand nombre d'étudiants étrangers, cela indique qu'il possède un attrait suffisant. Sa méthode de calcul est la suivante : le nombre total d'étudiants de premier cycle et de cycles supérieurs étrangers qui étudient dans votre établissement depuis au moins trois mois par rapport au nombre total d'étudiants de premier cycle et de cycles supérieurs.
    7. Le Réseau International de Recherche (RIR) est un standard de mesure de la participation mondiale, en particulier en ce qui concerne la façon dont les institutions établissent et maintiennent des partenariats de recherche, ce qui leur permet de co-écrire des publications avec d'autres institutions transnationales, de collaborer à la résolution de défis mondiaux et de diffuser des résultats de recherche importants à un public plus large. La formule de calcul de l'indice RIR de QS est : `Indice RIR = L / ln(P)`, où ln(P) est le logarithme naturel du nombre distinct de partenaires internationaux (institutions d'enseignement supérieur) et L est le nombre distinct de pays/territoires internationaux représentés par ces partenaires.
    Dans le classement mondial des universités QS, les classements régionaux des universités QS, ainsi que les classements QS par sujet, cette métrique ne considère que les partenariats soutenus, que nous définissons comme ceux qui résultent en 3 articles ou plus publiés conjointement dans le sujet large ou étroit correspondant sur une période de cinq ans.
    8. Les résultats en matière d'emploi reflètent la capacité d'une institution à assurer un haut niveau de capacité d'emploi pour ses diplômés, tout en formant des leaders capables d'avoir un impact dans leurs domaines respectifs à l'avenir. Il combine les deux indicateurs que sont le taux d'emploi des diplômés et l'influence des anciens élèves. L'indice d'influence des anciens élèves est équilibré avec le nombre d'étudiants pour assurer une évaluation proportionnelle des institutions de grande et de petite taille. La valeur résultante est ajustée de 0 à 100 et est utilisée pour ajuster le taux d'emploi des diplômés sur une échelle glissante, avec la formule de calcul suivante : Résultats d'emploi = Indice d'influence des anciens ajusté * ln(taux d'emploi des diplômés)

### b. Définir une famille de critères.

1. La racine de critère construit
    
    Nous avons choisi cinq critères d'évaluation au total, à savoir :
    
    - Considérations sur l'établissement
    - Considérations sur la spécialisation
    - Considérations économiques
    - Considérations géographiques
    - Considérations internationales

**Considérations économiques** : Nous utilisons une formule (avec les valeurs maximales et minimales extraites des 30 écoles sélectionnées).Les écoles et les régions plus coûteuses obtiendront un score plus bas.

$$
Score=20\times\frac{max-x}{max-min}
$$

Pour les critères de considérations sur **l'établissement**, les considérations sur la **spécialisation** et les considérations **internationales**, nous utilisons toujours la formule précédente, mais cette fois-ci, les valeurs maximales et minimales proviennent de l'ensemble des écoles participant au classement QS. Les évaluations des critères avec des scores QS plus élevés seront également plus élevées, ce qui signifie que ces critères sont considérés comme ayant une meilleure évaluation.

Considérations **géographiques** : Nous attribuons des scores de 0 à 20 en fonction du pays où se trouve l'école par rapport au pays d'origine des étudiants, par exemple, 20 lorsque l'école est située dans le pays d'origine des étudiants.

1. Hiérarchie des critères
    
    **g1 :** **Considération sur l’établissement(max)**
    
    - g1.1:Réputation académique : Reflète la position et l'influence de l'école au sein de la communauté universitaire. Une grande réputation académique d'une école implique généralement une excellente qualité de l'enseignement et de la recherche.
    - g1.2:Réputation auprès des employeurs:montre l'attractivité des diplômés sur le marché du travail. Une haute réputation auprès des employeurs suggère que les diplômés de l'établissement sont hautement estimés dans le monde professionnel.
    - g1.3:Citations par membre du corps professoral : mesure l'impact et la qualité de la recherche académique. Un nombre élevé de citations indique souvent que l'établissement occupe une position de leader dans certains domaines académiques.
    - g1.4:Résultats d'emploi : reflètent le taux et la qualité de l'emploi des diplômés. De bons résultats en matière d'emploi signifient que les étudiants trouvent un travail satisfaisant après l'obtention de leur diplôme.
    
    ![Untitled](/assets/blog/decision-making-university/Untitled%201.png)
    
    **g2 : Considération de la spécialité (max)**
    
    - 2.1:Classement des disciplines : fournit des informations sur le classement des établissements dans des disciplines ou domaines de spécialité spécifiques. Cela aide les étudiants à choisir une école adaptée à leurs intérêts professionnels.
    
    ![Untitled](/assets/blog/decision-making-university/Untitled%202.png)
    

**g3 : Considérations géographiques (max)**

- g3.1:Emplacement géographique : l'emplacement géographique peut influencer l'expérience de vie et l'environnement d'apprentissage des étudiants. Prendre en compte la localisation géographique aide à s'assurer que le lieu de l'établissement correspond aux préférences personnelles et aux objectifs professionnels de l'étudiant.
    
    ![Untitled](/assets/blog/decision-making-university/Untitled%203.png)
    

**g4 : Considérations économiques (max)**

- g4.1:Frais de scolarité (USD) : liés directement à l'accessibilité financière de l'éducation. Comprendre le niveau des frais de scolarité aide les étudiants à évaluer leurs capacités financières et la pression financière potentielle.
- g4.2:Coût de la vie : inclut les frais d'hébergement, de nourriture, de transport, etc. Les variations du coût de la vie entre différentes régions peuvent affecter la charge financière globale des étudiants.

![Untitled](/assets/blog/decision-making-university/Untitled%204.png)

**g5 : Considérations internationales (max)**

- g5.1:Personnel académique international : reflète le degré d'internationalisation et l'environnement multiculturel de l'établissement, ce qui est très important pour développer une perspective globale et s'adapter à une culture diversifiée.
- g5.2:Étudiants internationaux : la proportion d'étudiants internationaux indique la capacité de l'établissement à attirer des étudiants du monde entier et le niveau d'internationalisation de sa culture campus.

![Untitled](/assets/blog/decision-making-university/Untitled%205.png)

## III. Analyse de cas

### a. Déscription de décideur

Peter vient de terminer ses études de premier cycle en informatique dans une université publique française et souhaite poursuivre un master. Cependant, Peter est un étudiant très exigeant et méticuleux dans ses choix. Pour postuler à l'école de ses rêves, il décide d'utiliser la méthode de prise de décision multicritère(Electre IS) qu'il a apprise pour choisir les établissements où il postulera.

1. Peter pense qu'il est absurde de dépenser des dizaines de milliers, voire plus de cent mille euros pour un diplôme de master, donc il ne veut pas payer des frais de scolarité excessifs.
2. Peter ne prévoit pas de poursuivre un doctorat après son diplôme. Il estime que le salaire après l'obtention du diplôme et la réputation auprès des employeurs sont les critères les plus importants pour évaluer une école.
3. De plus, en tant que personne qui tient à sa famille, Peter ne souhaite pas étudier dans un pays trop éloigné.
4. Peter accorde avant tout de l'importance au niveau global de l'école ainsi qu'aux frais d'études à l'étranger. Il ne se préoccupe pas beaucoup du classement de la spécialité et de l'internationalité

### b**. L’ensemble des actions potentielles.**

- **Les différentes actions normalisé(critères construits inclus)**

![Untitled](/assets/blog/decision-making-university/Untitled%206.png)

- **Les différentes actions normalisé(critères racines)**

![Untitled](/assets/blog/decision-making-university/Untitled%207.png)

### c. Calcule automatiquement les matrices avec Java

En raison du nombre élevé d'actions, nous utilisons un programme pour calculer automatiquement C(a, b) et D(a, b) ainsi que  σ(a, b). Le programme lit automatiquement les données à partir d'un fichier xlsx et écrit les résultats des calculs dans un nouveau fichier xlsx créé.

Code export:

```java
for (int i = 0; i < 20; i++) {
            rows[i] = sheetD.createRow(i);
            rowsS[i] = sheetSigma.createRow(i);
        }

        for(int i = 0; i < 20;i++){
            for(int j = 0;j < 20;j++){
                rows[i].createCell(j).setCellValue(mD[i][j]);
                rowsS[i].createCell(j).setCellValue(mSigma[i][j]);
            }
        }
        FileOutputStream fileOutputStream = new FileOutputStream("src/main/java/org/example/Dab.xlsx");
        workbookD.write(fileOutputStream);
        fileOutputStream.close();
```

Matrice discordance

```java
for(int i = 0;i < 20;i++){
            for(int j = 0;j < 20;j++){
                boolean veto = false;
                for(int k = 0;k < 5;k++){
                    if(mG[i][k] < mG[j][k] - v[k]){
                        veto = true;
                    }
                }
                if(veto){
                    mD[i][j] = 1;
                }else{
                    mD[i][j] = 0;
                }
            }
        } 
```

Matrice σ(ui, uj)

```java
for(int i = 0;i < 20;i++){
            for(int j = 0;j < 20;j++){
                if(mC[i][j] > 0.7 && mD[i][j] != 1){
                    mSigma[i][j] = 1;
                }else{
                    mSigma[i][j] = 0;
                }
            }
        }
```

Résultat de programme

- Matrice C(ui, uj)

![Untitled](/assets/blog/decision-making-university/Untitled%208.png)

- Matrice D(ui, uj)

![Untitled](/assets/blog/decision-making-university/Untitled%209.png)

- Matrice σ(ui, uj)

![Untitled](/assets/blog/decision-making-university/Untitled%2010.png)

Pour tenir compte des différences relatives entre les options, pour une comparaison plus détaillée et pour prendre en considération l'incertitude, nous avons finalement utilisé la méthode Electre III. En utilisant les deux approches différentes, ascendante et descendante, pour établir des relations de préordre, pour le processus de classement dans la méthode de support à la décision Electre III. La descendante fait référence à un processus de filtrage descendant, utilisé pour identifier l'ensemble des meilleures actions de décision. L'ascendante, quant à elle, est un processus de filtrage ascendant, utilisé pour déterminer l'ensemble des actions de décision moins bonnes.

![Untitled](/assets/blog/decision-making-university/Untitled%2011.png)

![Untitled](/assets/blog/decision-making-university/Untitled%2012.png)

## IV. Conclusion

Nous avons constaté que les résultats des processus ascendante et descendante sont différents, ce qui est courant dans la méthode Electre III, car ils commencent respectivement par éliminer les pires et les meilleures options. La différence des résultats signifie que, dans le processus décisionnel, certaines options peuvent sembler attrayantes lorsqu'on considère leurs avantages (et donc se classent plus haut dans le filtrage descendant), mais moins séduisantes lorsqu'on prend en compte leurs inconvénients (et donc se classent plus bas dans le filtrage ascendant). Ainsi, après une considération globale, nous avons finalement recommandé à Peter les trois universités suivantes : 

- U3 (Université d'Oxford)
- U2 (Université de Cambridge)
- U16 (Université PSL)

## B**ibliographie**

- QS Rank: [https://support.qs.com/hc/en-gb/articles/4405955370898-QS-World-University-Rankings-](https://support.qs.com/hc/en-gb/articles/4405955370898-QS-World-University-Rankings-)
- THE Rank: [https://www.timeshighereducation.com/cn/world-university-rankings/2024/subject-ranking/computer-science#](https://www.timeshighereducation.com/cn/world-university-rankings/2024/subject-ranking/computer-science#)
