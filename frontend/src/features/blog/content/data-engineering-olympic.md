---
title: JO Data Engineering
description: Les Jeux Olympiques de Paris 2024 représentent un événement d’envergure mondiale, rassemblant des milliers d’athlètes et générant une quantité considérable de données relatives aux compétitions, aux p…
image: /assets/blog/data-engineering-olympic/cover.webp
createdAt: 2025-09-15
updatedAt: 2025-09-15
---

## Sommaire

### **1. Introduction**

Les Jeux Olympiques de Paris 2024 représentent un événement d’envergure mondiale, rassemblant des milliers d’athlètes et générant une quantité considérable de données relatives aux compétitions, aux performances et à l’organisation. La gestion efficace de ces informations constitue un enjeu crucial, tant pour l’analyse des résultats que pour la prise de décisions stratégiques. Dans ce contexte, notre projet vise à concevoir un entrepôt de données permettant d’exploiter ces informations de manière optimale.

L’objectif principal de cette initiative est de structurer, nettoyer et stocker les données olympiques afin de garantir leur qualité et leur fiabilité. L’élaboration d’un modèle de stockage adapté, associé à un processus ETL performant, doit permettre d’uniformiser les informations issues de différentes sources et d’en faciliter l’analyse. Ce projet s’inscrit ainsi dans une démarche rigoureuse de traitement des données, depuis leur extraction jusqu’à leur restitution sous forme de rapports analytiques.

L’utilisation d’outils tels que Talend Open Studio pour l’intégration des données et PostgreSQL pour leur stockage offre un cadre technique robuste et évolutif. De plus, l’exploitation de solutions de visualisation PowerBI permet d’extraire des indicateurs pertinents et de produire des représentations graphiques facilitant l’interprétation des résultats. À travers ce projet, nous cherchons non seulement à répondre aux problématiques posées par la gestion des données olympiques, mais également à proposer une approche méthodologique applicable à d’autres contextes nécessitant une analyse approfondie et structurée des données.

## **2. Analyse de la Métadonnée**

### 2.1 Analyse de la Qualité des Données

Dans le cadre de notre projet, nous avons tout d’abord procédé à une évaluation approfondie de la qualité des données disponibles afin d’identifier les éventuelles anomalies et garantir la fiabilité des analyses ultérieures. Cette analyse s’est concentrée sur plusieurs dimensions clés, notamment le nombre de lignes et de colonnes par table, le taux de valeurs manquantes ainsi que la présence de doublons.

| Nom de la table | Nombre de lignes | Nombre de colonnes | Taux de valeurs manquantes (%) | Nombre de doublons |
| --- | --- | --- | --- | --- |
| **athletes** | 11 113 | 36 | 25,38 % | 0 |
| **coaches** | 974 | 12 | 5,08 % | 0 |
| **events** | 329 | 5 | 0,0 % | 0 |
| **medallists** | 2 315 | 21 | 4,74 % | 0 |
| **medals** | 1 044 | 13 | 0,07 % | 0 |
| **nocs** | 224 | 5 | 0,0 % | 0 |
| **schedules** | 3 895 | 16 | 0,16 % | 8 |
| **schedules_preliminary** | 2 298 | 18 | 41,00 % | 292 |
| **teams** | 1 698 | 16 | 17,24 % | 0 |
| **technical_officials** | 1 021 | 11 | 8,92 % | 0 |
| **torch_route** | 73 | 7 | 1,17 % | 0 |
| **venues** | 35 | 6 | 0,95 % | 0 |

### **2.2 Analyse des valeurs manquantes**

L’examen des jeux de données révèle des disparités notables en termes de qualité. La table `athletes`, qui compte **11 113 lignes et 36 colonnes**, présente un **taux de valeurs manquantes de 25,38 %**, ce qui suggère une couverture partielle des informations relatives aux participants. Une attention particulière devra être portée sur les colonnes les plus impactées afin de définir une stratégie d’imputation ou de suppression des données insuffisantes. À l’inverse, les tables `events` et `nocs` affichent une complétude parfaite, ne présentant **aucune valeur manquante**.

L’analyse des doublons indique une **unicité satisfaisante** pour la majorité des tables. Aucune redondance n’a été détectée dans les jeux de données `athletes`, `coaches`, `events`, `medallists` et `nocs`, ce qui témoigne d’une bonne gestion des enregistrements. Toutefois, des vérifications supplémentaires seront nécessaires pour s’assurer que ces données sont cohérentes et exemptes d’anomalies structurelles.

L’ensemble de ces observations met en évidence des défis majeurs liés à la gestion des données manquantes, notamment pour la table `athletes`, dont les informations incomplètes pourraient impacter la qualité des analyses futures.

### **2.3 Conclusion et Actions Correctives**

Puisque certaines colonnes n'ont pas un impact significatif sur nos analyses ultérieures, nous les analyserons en fonction des besoins dans les sections suivantes.

### **2.4 Sélection et Préparation des Données**

Dans le cadre de notre projet, une étape essentielle consiste à effectuer un filtrage des données afin de ne conserver que les informations pertinentes pour nos analyses. L’objectif de cette sélection est d’optimiser la structure de notre base en supprimant les colonnes superflues et en nous concentrant uniquement sur les variables nécessaires à la production des indicateurs demandés.

L’une des représentations exigées concerne la **pyramide des âges des athlètes par sexe**, où nous devons analyser la répartition des participants en fonction de leur âge et de leur genre. Pour répondre à cette exigence, nous avons décidé de conserver les colonnes **`age`** et **`gender`**, disponibles dans nos données sur les athlètes. Par conséquent, dans la table `athletes`, nous avons supprimé les variables non essentielles telles que **la nationalité, la discipline sportive ou encore les résultats détaillés des épreuves**, qui ne sont pas directement utiles à cette analyse.

Un autre indicateur clé porte sur le **nombre de médaillés par pays et par sport**, nécessitant la prise en compte de l’appartenance nationale des athlètes ainsi que de leur statut de médaillé. Nous avons donc conservé les colonnes **`id_athletes`** et **`code_country`** pour établir la relation entre les participants et leur pays. Dans la table `medallists`, nous avons maintenu uniquement l’identifiant des athlètes ainsi que la variable **`is_metallist`**, qui indique s’ils ont remporté une médaille. Les autres informations, bien que potentiellement intéressantes pour d’autres analyses, n’ont pas été retenues ici afin d’assurer une base de données plus concise et mieux adaptée à nos besoins spécifiques.

Enfin, pour garantir une gestion efficace des dimensions et des faits dans notre modèle de données, nous avons appliqué des règles similaires aux autres tables. Dans `nocs`, nous avons conservé uniquement les colonnes **`code_country`** et **`country`**, nécessaires pour établir le lien avec les pays. De même, la table `technical_officials` a été réduite à la seule variable **`gender`**, afin d’assurer une harmonisation des valeurs de genre dans l’ensemble des tables concernées.

Cette étape de sélection permet non seulement d’améliorer la qualité et la lisibilité de notre base de données, mais aussi d’optimiser les performances du processus ETL en limitant le volume de données à traiter. Nous disposons désormais d’un ensemble cohérent et épuré, prêt à être intégré dans notre entrepôt de données et exploité pour nos futures analyses.

### **2.5 Analyse des différences de dénomination des champs de données et recommandations pour la standardisation**

**1. Champs liés au genre (Gender)**

Dans l’ensemble des données, nous avons identifié deux colonnes susceptibles de représenter le genre :

- **`gender`** : format des données `['Female', 'Male']`
- **`team_gender`** : format des données `['M', 'W', 'X', 'O']`
    - `M` : probablement pour "Male" (homme)
    - `W` : probablement pour "Female" (femme)
    - `X`, `O` : pourraient représenter un genre mixte, une autre catégorie ou une valeur inconnue

**2. Autres champs ayant une signification similaire mais avec des noms différents**

Outre le genre, plusieurs champs semblent représenter le même concept sous différentes appellations :

**Champs relatifs aux noms (`name`)**

- `name`
- `name_short`
- `name_tv`
- `nickname`

**Champs relatifs aux pays ou aux équipes (`country`)**

- `birth_country`
- `code_team`
- `country`
- `country_code`
- `country_long`
- `nationality`
- `nationality_code`
- `nationality_long`
- `residence_country`
- `team`
- `team_gender` (peut indiquer le genre de l’équipe)

**Champs relatifs aux événements (`event`)**

- `event`
- `event_medal`
- `event_type`
- `events`
- `url_event`

**Champs relatifs aux médailles (`medal`)**

- `event_medal`
- `is_medallist`
- `medal_code`
- `medal_date`
- `medal_type`

**3. Recommandations pour la standardisation**

- **Standardisation des données de genre** : il est recommandé d’unifier les valeurs de `team_gender`, en remplaçant `M, W` par `Male, Female`, et en précisant la signification des catégories `X, O`.
- **Uniformisation des champs liés aux pays et aux équipes** : il serait pertinent de standardiser `country_code` en utilisant un format ISO et d’uniformiser `team` pour éviter toute confusion.
- **Harmonisation des champs `event` et `medal`** : ces champs peuvent être regroupés et standardisés afin d’éviter la redondance et d’améliorer la cohérence des analyses de données.

## **3. Architecture et Modélisation du Système de Données**

### **3.1 Flux des Données dans le Processus de Modélisation du Data Warehouse**

![image.png](/assets/blog/data-engineering-olympic/image.png)

La mise en place d’un **entrepôt de données** repose sur un processus structuré permettant d’intégrer, transformer et stocker les données de manière optimale. Afin de garantir la fiabilité et la cohérence des informations utilisées pour l’analyse, nous avons défini un **flux de données** clair, illustré par le schéma suivant.

Les données initiales proviennent de fichiers **CSV** contenant les informations brutes sur les Jeux Olympiques, notamment les athlètes, les épreuves, les résultats et les pays participants. Ces fichiers sont chargés dans un **système de base de données transactionnelle** via **Talend**, qui joue un rôle clé dans l’extraction et l’intégration des données.

Une fois les données centralisées dans la base transactionnelle, un processus supplémentaire de transformation est appliqué pour alimenter un **Operational Data Store (ODS)**. Ce stockage opérationnel sert d’étape intermédiaire où les données sont nettoyées, normalisées et préparées pour une exploitation analytique.

Enfin, un dernier traitement via **Talend** permet d’alimenter l’**entrepôt de données (Data Warehouse)**. Cette dernière étape consiste à organiser les données sous une structure optimisée, souvent sous forme de **modèle en étoile ou en flocon**, afin de faciliter les requêtes analytiques et les rapports décisionnels.

Ce flux de données garantit une séparation claire entre les différentes étapes du traitement de l’information :

1. **Extraction des données brutes (CSV → Database)**
2. **Nettoyage et transformation des données (Database → ODS)**
3. **Chargement des données optimisées pour l’analyse (ODS → Data Warehouse)**

En adoptant cette approche, nous assurons une gestion efficace des données et une mise en place structurée du **processus ETL (Extract, Transform, Load)**, garantissant ainsi un entrepôt de données performant et adapté aux analyses décisionnelles.

### **3.2 Base de Données Relationnelle (Database)**

Afin de construire la base de données relationnelle BDD pour permettre l'OLTP, nous utilisons l'outil *oracle data modeler* pour construire des tables et générer des diagrammes UML pour la base de données relationnelle.

Dans notre architecture de données, la **base de données relationnelle** joue un rôle fondamental en tant que premier niveau de stockage structuré après l’extraction des données brutes. Cette étape permet de centraliser les informations en les organisant sous un modèle relationnel, garantissant ainsi **l’intégrité, la cohérence et l’accessibilité des données** avant leur transformation et leur intégration dans le Data Warehouse.

 **Modélisation et Structure de la Base de Données**

La conception de notre base de données repose sur un **modèle relationnel** dans lequel les différentes entités sont interconnectées via des **clés primaires (PK)** et des **clés étrangères (FK)**. Le schéma présenté ci-dessus illustre cette structuration, mettant en évidence plusieurs tables principales :

1. **athletes** : Contient les informations détaillées sur les athlètes (nom, pays, genre, discipline, date de naissance).
2. **countries** : Répertorie les pays participants avec leur identifiant unique.
3. **sports & categories** : Permettent de structurer les disciplines sportives et leurs catégories associées.
4. **events** : Stocke les événements olympiques, associés aux sports et aux lieux de compétition.
5. **venues** : Répertorie les infrastructures où se déroulent les compétitions.
6. **medals & medallists** : Contiennent les informations sur les médailles remportées, avec les détails des épreuves et des gagnants.
7. **teams & team_athletes** : Gèrent les équipes sportives et leurs membres.
8. **schedules** : Enregistre le calendrier des épreuves, y compris les dates de début et de fin.

Chaque table est conçue pour minimiser la redondance et assurer une gestion optimale des données grâce aux **relations normalisées**.

**Intégrité et Qualité des Données**

Dans cette base de données, nous avons mis en place plusieurs **contraintes** pour garantir la fiabilité des données :

- **Clés primaires et étrangères** : Maintiennent la cohérence et empêchent les incohérences relationnelles.
- **Contraintes d’unicité** : Évitent les doublons dans des entités critiques (ex : un `id_athlete` unique par athlète).
- **Validation des types de données** : Assure que chaque colonne respecte son format attendu (ex : `medal_date` en format `DATE`).
- **Gestion des valeurs nulles** : Certaines colonnes essentielles (comme `id_country` pour `athletes`) ne peuvent pas être vides pour éviter des problèmes d’analyse ultérieurs.
- 

**Pourquoi utiliser une Base Relationnelle avant le Data Warehouse ?**

L’utilisation d’une base de données relationnelle intermédiaire présente plusieurs avantages :

1. **Nettoyage et Préparation** : Les données brutes extraites des fichiers CSV peuvent contenir des erreurs, des incohérences ou des valeurs manquantes. En passant par une base relationnelle, nous pouvons **nettoyer et structurer** ces données avant leur transformation.
2. **Stockage Structuré** : Contrairement à un simple stockage de fichiers plats, une base relationnelle permet une organisation **cohérente et optimisée** des informations.
3. **Contrôle des Modifications** : Grâce aux contraintes relationnelles, nous pouvons **assurer l’intégrité des données** avant leur chargement dans l’entrepôt de données.
4. **Flexibilité pour l’ETL** : Les données étant stockées sous un format structuré, elles peuvent être **plus facilement transformées et chargées** dans l’ODS et le Data Warehouse via des requêtes SQL optimisées.

![image.png](/assets/blog/data-engineering-olympic/image%201.png)

### **3.3 Modélisation du Data Warehouse (DWH)**

Lors de la conception de notre **entrepôt de données (DWH)**, nous avons initialement envisagé une **approche Top-Down**, visant à établir une architecture idéale avec **une table de faits centrale et des dimensions bien structurées** dès le début. Cette approche, souvent utilisée dans les grandes entreprises, permet d’avoir un modèle **complet, cohérent et optimisé** pour l’analyse des données. Cependant, nous avons rapidement réalisé que ce choix impliquait un **travail considérable**, avec un temps de développement très long, alors que nos besoins analytiques étaient relativement limités.

Face à cette complexité, nous avons adopté une approche plus pragmatique : le **Middle-Out**, qui consiste à partir des besoins réels pour construire progressivement un **modèle évolutif**. Plutôt que de créer immédiatement un système entièrement structuré et exhaustif, nous avons choisi de **démarrer avec une structure plus simple et adaptable**, nous concentrant sur les analyses les plus pertinentes.

![image.png](/assets/blog/data-engineering-olympic/image%202.png)

![image.png](/assets/blog/data-engineering-olympic/image%203.png)

**Approche Middle-Out : Un Modèle Évolutif**

1. **Identification des besoins analytiques**
    
    Nous avons d’abord identifié les principales **requêtes et indicateurs** dont nous avions besoin, tels que :
    
    - **Analyse des âges des athlètes**
    - **Répartition des médailles par pays et par sport**
    - **Évolution chronologique des performances**
2. **Développement d’un modèle initial simplifié**
    
    Plutôt que de concevoir une **grande table de faits unique**, nous avons décidé de démarrer avec **un modèle plus restreint**, incluant seulement les dimensions et faits nécessaires pour répondre aux premières analyses.
    
3. **Ajout progressif de nouvelles dimensions et faits**
    
    Une fois le premier modèle en place et testé avec succès, nous avons ajouté progressivement d’autres dimensions et faits selon les besoins émergents, rendant le **DWH flexible et évolutif**.
    

## **4. Défis et Solutions avec Talend**

Dans le cadre du traitement des données, nous avons rencontré plusieurs difficultés avec Talend, principalement liées à la gestion des schémas, aux paramètres d’importation, aux expressions utilisées, aux contraintes d’intégrité et aux erreurs du système. Voici une analyse détaillée des principaux problèmes rencontrés et des solutions appliquées :

![image.png](/assets/blog/data-engineering-olympic/image%204.png)

![image.png](/assets/blog/data-engineering-olympic/image%205.png)

### **4.1 Problème d’identification de la colonne `code` dans la table `medal`**

Dans la table `medal`, la colonne `code` peut correspondre soit à `idteam`, soit à `idathlete`, mais ces deux identifiants ont des formats très différents. Par exemple, `idteam` suit un format de type `"DIVW3MTEAM2-CHN01"`, tandis que `idathlete` est un nombre, comme `"1955079"`. Il est donc essentiel de différencier ces formats afin d’assurer un mappage correct des données et d’éviter toute confusion.

### **4.2 Problème de suppression de colonnes dans `Edit Schema`**

Lorsque nous utilisons l’option **Edit Schema** pour supprimer des colonnes, Talend ne supprime pas réellement la colonne sélectionnée, mais réattribue les colonnes suivantes. Par exemple, si nous supprimons la deuxième colonne, Talend déplace les données de la troisième colonne dans la deuxième position et en modifie le nom. Si les types de données sont différents, cela peut provoquer des erreurs. Il est donc crucial de bien vérifier les mappages après toute modification du schéma.

### **4.3 Configuration des paramètres d’importation (`File Delimited`)**

Pour garantir une importation correcte des fichiers CSV, nous avons utilisé les paramètres suivants :

- **Encodage** : UTF-8
- **Format** : UNIX
- **Séparateur de champ** : `","`
- **Séparateur de ligne** : `"\n"`
- **Délimiteur de texte** : `'"'`

Ces paramètres assurent une lecture correcte des fichiers et évitent les erreurs de parsing.

### **4.4 Expressions utilisées en Talend**

Dans Talend, nous avons utilisé plusieurs expressions pour optimiser le processus ETL. Voici quelques exemples :

- **Vider une table de la base de données** :
    
    ```sql
    TRUNCATE TABLE categories CASCADE;
    
    ```
    
- **Filtrer les données non nulles** :
    
    ```java
    row1.id_venue != null && !row1.id_venue.trim().isEmpty()
    
    ```
    
- **Créer une séquence incrémentale** :
    
    ```java
    Numeric.sequence("seq",1,1).toString()
    
    ```
    
- **Récupérer la valeur actuelle d’une boucle** :
    
    ```java
    ((Integer)globalMap.get("tLoop_1_CURRENT_VALUE")).toString()
    
    ```
    
- **Formatage des mois sous forme de chaîne** :
    
    ```java
    (0+month.month).substring((0+month.month).length()-2)
    
    ```
    
- **Conversion du genre** :
    
    ```java
    row10.gender.equals("Male")?"M":"W"
    
    ```
    
- **Vérifier si une chaîne contient des lettres** :
    
    ```java
    row23.code.matches(".*[A-Za-z].*")
    
    ```
    

### **4.5 Problème d’incomplétude des catégories sportives**

Les catégories sportives fournies dans le sujet étaient incomplètes. Initialement, nous avons créé un fichier `category.csv` basé sur les catégories mentionnées dans le sujet, mais nous avons rencontré des erreurs lors de son chargement dans Talend. Après une analyse approfondie, nous avons constaté que les données réelles contenaient davantage de catégories que celles listées. Nous avons donc extrait directement toutes les catégories sportives depuis les données brutes et ajouté une catégorie `"Others"` pour couvrir les disciplines non répertoriées.

### **4.6 Contraintes de base de données et erreurs de parsing**

Lors de l’intégration des données, nous avons rencontré plusieurs problèmes liés aux contraintes de la base de données :

- **Valeur trop longue** (`value too long`), empêchant l’insertion correcte des données.
- **Violation de clé étrangère** (`foreign key violation`), empêchant certaines données d’être correctement associées aux tables principales.
- **Violation de contrainte d’unicité** (`violate constraint`), provoquant l’échec de l’insertion.

Pour remédier à ces problèmes, nous avons ajusté les types de données et les longueurs des champs dans la base, et ajouté des contrôles supplémentaires dans le processus ETL pour garantir que les données respectent les contraintes de la base.

### **4.7 Erreurs de parsing des données**

Dans certains cas, Talend n’a pas réussi à interpréter correctement certaines valeurs :

- **Erreur de parsing sur `birth_date`** : `Couldn't parse value for column 'birth_date' in 'row10', value is 'Athlete'.` Cela indique que Talend a tenté d’interpréter une valeur textuelle comme une date, ce qui a entraîné une erreur de format.
- **Taille de champ dépassée** : `value too long for type character varying(10)`, indiquant que la valeur d’un champ dépasse la longueur définie dans la base. Pour corriger cela, nous avons soit modifié la structure de la base, soit tronqué les valeurs trop longues.

Ces défis nous ont permis de mieux comprendre les limites de Talend et d’adopter des stratégies d’optimisation pour garantir un traitement des données fluide et efficace.

## **5. Visualisation des Données avec Power BI**

Nous avons conçu plusieurs **visualisations interactives** à l’aide de **Power BI** afin d’exploiter efficacement les données de notre Data Warehouse. Ces tableaux de bord permettent une exploration approfondie des performances des athlètes, de la répartition des médailles et des tendances observées lors des Jeux Olympiques.

---

![image.png](/assets/blog/data-engineering-olympic/image%206.png)

### **5.1 Pyramide des âges des athlètes par sexe**

📊 **Description** : Cette pyramide des âges montre la répartition des athlètes en fonction de leur âge et de leur sexe. Elle met en évidence la structure démographique des participants, en distinguant les hommes (M) et les femmes (W).

---

### **5.2 Répartition des athlètes par pays et par sexe**

📊 **Description** : Ce graphique en barres représente le **nombre total d’athlètes** par pays, avec une distinction entre **hommes et femmes**. Il permet de voir la répartition des compétiteurs dans chaque nation.

---

![image.png](/assets/blog/data-engineering-olympic/image%207.png)

### **5.3 Ratio des médaillés par rapport aux participants par pays**

📊 **Description** : Cette visualisation compare le **nombre total d’athlètes** d’un pays avec le **nombre de médaillés**, mettant ainsi en évidence le taux d’efficacité des nations en compétition.

---

### **5.4 Répartition des médailles par pays et type de médaille**

![image.png](/assets/blog/data-engineering-olympic/image%208.png)

📊 **Description** : Ce graphique en barres empilées représente le **nombre total de médailles** remportées par chaque pays, en distinguant les **médailles d’or, d’argent et de bronze**.

---

### **5.5 Évolution des médailles au fil du temps**

![image.png](/assets/blog/data-engineering-olympic/image%209.png)

📊 **Description** : Ce graphique en courbes montre **l’évolution du nombre de médailles remportées au fil des jours** pendant les Jeux Olympiques. Il permet d’analyser la dynamique des performances des nations tout au long de la compétition.

🔍 **Analyse** :

- Certains pays ont un **départ rapide**, gagnant de nombreuses médailles dès le début des Jeux, tandis que d’autres progressent plus lentement.
- Il est possible d’identifier des **pics de performance**, correspondant à des jours où de nombreuses finales sont organisées.
- Cette visualisation permet aussi d’analyser **l’impact de la programmation des épreuves sur les résultats des différentes nations**.

---

### **5.6 Répartition des médailles par discipline sportive**

![image.png](/assets/blog/data-engineering-olympic/image%2010.png)

📊 **Description** : Ce graphique en barres représente **le nombre total de médailles gagnées par sport**, avec une distinction selon le genre des compétiteurs (M, W, X).

---

### **5.7 Répartition des médailles par catégorie de sport**

![image.png](/assets/blog/data-engineering-olympic/image%2011.png)

📊 **Description** : Ce **diagramme en treemap** regroupe les sports en grandes catégories (sports de force, sports de vitesse, sports d’endurance, etc.) et affiche le nombre de médailles gagnées pour chaque catégorie.

---

### **5.8 Répartition des athlètes par pays sur une carte géographique**

![image.png](/assets/blog/data-engineering-olympic/image%2012.png)

📊 **Description** : Cette carte interactive représente **le nombre d’athlètes par pays**, avec une distinction entre les médaillés et les non-médaillés.

---

### **5.9 Répartition des médailles par pays sur une carte géographique**

![image.png](/assets/blog/data-engineering-olympic/image%2013.png)

📊 **Description** : Cette carte représente **les médailles gagnées par pays**, en distinguant les différentes catégories de médailles et en indiquant le sexe des médaillés.

---

## 6. Annale

Cette partie contient des codes pour créer la BDD.

```sql
CREATE TABLE athletes (
id_athlete VARCHAR(20) NOT NULL,
id_country VARCHAR(20) NOT NULL,
name VARCHAR(50),
gender VARCHAR(5),
sport VARCHAR(50),
event VARCHAR(50),
birth_date DATE,
PRIMARY KEY (id_athlete)
);
```

```sql
CREATE TABLE categories (
id_category VARCHAR(20) NOT NULL,
category VARCHAR(50),
PRIMARY KEY (id_category)
);
```

```sql
CREATE TABLE countries (
id_country VARCHAR(20) NOT NULL,
country VARCHAR(50),
PRIMARY KEY (id_country)
);
```

```sql
CREATE TABLE events (
id_event VARCHAR(20) NOT NULL,
id_sport VARCHAR(20) NOT NULL,
event VARCHAR(50),
PRIMARY KEY (id_event)
);
```

```sql
CREATE TABLE medals (
id_medal VARCHAR(20) NOT NULL,
id_country VARCHAR(20) NOT NULL,
id_event VARCHAR(20) NOT NULL,
id_team VARCHAR(20),
id_athlete VARCHAR(20),
medal_date DATE,
medal_type VARCHAR(50),
gender VARCHAR(5),
CONSTRAINT medals_PK PRIMARY KEY (id_medal),
CONSTRAINT chk_medal CHECK (
(id_athlete IS NOT NULL AND id_team IS NULL) OR
(id_athlete IS NULL AND id_team IS NOT NULL)
)
);
```

```sql
CREATE TABLE metallists (
id_medalliste VARCHAR(20) NOT NULL,
id_country VARCHAR(20) NOT NULL,
id_event VARCHAR(20) NOT NULL,
id_athlete VARCHAR(20) NOT NULL,
id_team VARCHAR(20),
medal_type VARCHAR(10),
gender VARCHAR(5),
medal_date DATE,
is_medallist CHAR(1),
PRIMARY KEY (id_medalliste)
);
```

```sql
CREATE TABLE schedules (
id_schedule VARCHAR(20) NOT NULL,
id_event VARCHAR(20) NOT NULL,
id_venue VARCHAR(20) NOT NULL,
"date" DATE,
start_date TIMESTAMPTZ,
end_date TIMESTAMPTZ,
event_medal NUMERIC,
phase VARCHAR(50),
PRIMARY KEY (id_schedule)
);
```

```sql
CREATE TABLE sports (
id_sport VARCHAR(20) NOT NULL,
id_category VARCHAR(20) NOT NULL,
sport VARCHAR(100),
PRIMARY KEY (id_sport)
);
```

```sql
CREATE TABLE team_athletes (
athletes_id_athlete VARCHAR(20) NOT NULL,
teams_id_team VARCHAR(20) NOT NULL,
PRIMARY KEY (athletes_id_athlete, teams_id_team)
);
```

```sql
CREATE TABLE teams (
id_team VARCHAR(20) NOT NULL,
id_country VARCHAR(20) NOT NULL,
team VARCHAR(50),
team_gender VARCHAR(5),
PRIMARY KEY (id_team)
);
```

```sql
CREATE TABLE venues (
id_venue VARCHAR(20) NOT NULL,
venue VARCHAR(100),
PRIMARY KEY (id_venue)
);
```

```jsx
- Foreign Keys
```

```sql
ALTER TABLE athletes ADD CONSTRAINT athletes_countries_FK FOREIGN KEY (id_country) REFERENCES countries (id_country);
ALTER TABLE events ADD CONSTRAINT events_sports_FK FOREIGN KEY (id_sport) REFERENCES sports (id_sport);
ALTER TABLE medals ADD CONSTRAINT medals_athletes_FK FOREIGN KEY (id_athlete) REFERENCES athletes (id_athlete);
ALTER TABLE medals ADD CONSTRAINT medals_countries_FK FOREIGN KEY (id_country) REFERENCES countries (id_country);
ALTER TABLE medals ADD CONSTRAINT medals_events_FK FOREIGN KEY (id_event) REFERENCES events (id_event);
ALTER TABLE medals ADD CONSTRAINT medals_teams_FK FOREIGN KEY (id_team) REFERENCES teams (id_team);
ALTER TABLE metallists ADD CONSTRAINT metallists_athletes_FK FOREIGN KEY (id_athlete) REFERENCES athletes (id_athlete);
ALTER TABLE metallists ADD CONSTRAINT metallists_countries_FK FOREIGN KEY (id_country) REFERENCES countries (id_country);
ALTER TABLE metallists ADD CONSTRAINT metallists_events_FK FOREIGN KEY (id_event) REFERENCES events (id_event);
ALTER TABLE metallists ADD CONSTRAINT metallists_teams_FK FOREIGN KEY (id_team) REFERENCES teams (id_team);
ALTER TABLE schedules ADD CONSTRAINT Schedule_events_FK FOREIGN KEY (id_event) REFERENCES events (id_event);
ALTER TABLE schedules ADD CONSTRAINT Schedule_venues_FK FOREIGN KEY (id_venue) REFERENCES venues (id_venue);
ALTER TABLE sports ADD CONSTRAINT sports_categories_FK FOREIGN KEY (id_category) REFERENCES categories (id_category);
ALTER TABLE team_athletes ADD CONSTRAINT team_athletes_athletes_FK FOREIGN KEY (athletes_id_athlete) REFERENCES athletes (id_athlete);
ALTER TABLE team_athletes ADD CONSTRAINT team_athletes_teams_FK FOREIGN KEY (teams_id_team) REFERENCES teams (id_team);
ALTER TABLE teams ADD CONSTRAINT teams_countries_FK FOREIGN KEY (id_country) REFERENCES countries (id_country);
```
