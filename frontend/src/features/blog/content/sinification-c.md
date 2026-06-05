---
title: Comprendre les abréviations anglaises dans le langage C
description: "Le langage C comprend de nombreuses fonctions, paramètres, fichiers d'en-tête et types qui sont souvent formés de quelques lettres anglaises. Ne pas connaître leur véritable signification peut nuire à…"
image: /assets/blog/sinification-c/cover.webp
createdAt: 2023-08-15
updatedAt: 2023-08-15
---

Le langage C comprend de nombreuses fonctions, paramètres, fichiers d'en-tête et types qui sont souvent formés de quelques lettres anglaises. Ne pas connaître leur véritable signification peut nuire à la mémorisation à long terme. Par conséquent, je vais récapituler certains acronymes anglais courants mais fréquemment méconnus (mise à jour continue).

```c
#include<stdio.h>
#include<stdlib.h>
int main(int argc, char *argv[]){
	printf("Hello, world!\n");
	return 0;
}
```

**Header**

- std:standard
- io: input and output
- .h: head
- lib:library
- **`unistd.h`**Le nom complet en anglais de "unistd.h" est "Unix Standard Header". C'est un fichier d'en-tête standard en langage C dans des systèmes d'exploitation tels qu'Unix et Linux, qui contient de nombreuses déclarations de fonctions et de constantes symboliques liées aux appels système Unix. Dans les systèmes Unix, le fichier d'en-tête unistd.h est généralement utilisé pour écrire des programmes C au niveau système.
- fcntl.f: file control
- argc: "argument count", est un entier qui indique le nombre d'arguments qui ont été entrés sur la ligne de commande au lancement du programme.
- argv: "argument vector", est un tableau de pointeurs vers des tableaux de caractères.
- printf : print formatted
- scanf: scan formatted

```c
$gcc -Wall -o hello hello.c
```

- gcc:GNU Compiler Collection
- -Wall: warning all
- -Werror: warning error

Type de variable : 

- %d: decimal (base 10)
- %s: string
- %f: float
- %p: pointer
- \n: new line character
- \t: tabulation
- int: integer
- char: character
- s: string
- double: double(float)
- long: long(integer)

- struct: structure
- endl: end line
- malloc: memory allocation
- calloc: contiguous allocation
- size_t: _t means type or typedef
