---
title: AI Pac-Man
description: Pac-Man en environnement partiellement observable.
image: /assets/project/pacman/pacman.png
link: https://amark.fr/project/demo/aipacman/
createdAt: 2023-08-03
updatedAt: 2023-08-03
pinned: true
---

Projet d’intelligence artificielle : faire jouer Pac-Man dans une variante **partiellement observable** du jeu. Les fantômes ne sont visibles que s’ils sont dans le champ de vision de Pac-Man (même couloir, sans mur entre les deux). Sinon, l’agent doit raisonner sur un **ensemble de croyances** (`BeliefState`) plutôt que sur une position exacte.

![Pac-Man](/assets/project/pacman/pacman.png)

## Règles 

- Objectif : maximiser le score en mangeant les gommes (10 pts) sans se faire attraper.
- Super-gommes : les fantômes passent en mode peur (bleu) pendant un temps limité ; les manger rapporte 100 pts et les renvoie à leur spawn.
- Déplacements : haut / bas / gauche / droite ; un coup vers un mur ne produit aucun mouvement.
- Spécificité du sujet : environnement **POMDP-like** — positions fantômes inconnues hors ligne de vue, inférées depuis la dernière observation et les déplacements possibles.

Moteur et affichage d’origine : code de Roland Guillaume et Rémi Freret, adapté aux nouvelles règles. L’entrée de l’IA demandée par le sujet est `AI.findNextMove(BeliefState)`.

## Architecture utile

| Classe | Rôle |
|--------|------|
| `BeliefState` | Ensemble de croyances (positions possibles des fantômes, score, vies, gommes, compteurs de peur). Fournit `extendsBeliefState()` pour simuler les actions. |
| `Result` | Ensemble de belief states résultant d’**une** action (un belief state par percept possible). |
| `Plans` | Association actions (`UP`/`DOWN`/`LEFT`/`RIGHT`) → `Result` ; sortie de `extendsBeliefState()`. |
| `AI` | Calcule la prochaine action à partir du belief state courant. |

## Démo web

- Demo : [https://amark.fr/project/demo/aipacman/](https://amark.fr/project/demo/aipacman/)
![Gameplay](/assets/project/pacman/image01.png)

![Interface](/assets/project/pacman/image02.png)

![Partie](/assets/project/pacman/image03.png)

## Fantômes

Pas de pathfinding type BFS/A\* côté fantômes :

- **Visibles et non effrayés** : poursuite gloutonne (alignement ligne puis colonne vers Pac-Man).
- **Invisibles ou en peur** : aux carrefours, choix aléatoire parmi les voisins ouverts (éviter le demi-tour immédiat si possible).



## Stack

- **Java 8** (Swing) : moteur, belief states, IA du sujet
- **Web** : HTML / JS / Canvas, déploiement Vercel, reverse-proxy sous `amark.fr/project/demo/aipacman/`
