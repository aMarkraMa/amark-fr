---
title: Linux, C, C++ Unix System Functions
description: "Les processus n'accèdent pas directement à la mémoire physique mais à la **mémoire virtuelle*"
image: /assets/blog/linux-c-system-func/cover.webp
createdAt: 2024-01-22
updatedAt: 2024-01-22
---

# Linux/C fork() exec()

### **Concept de processus**

Les processus n'accèdent pas directement à la mémoire physique mais à la **mémoire virtuelle**

Chaque processus a son **propre espace mémoire** et n'interfère pas avec les autres processus

Chaque processus est contrôlé par un **bloc de contrôle de processus**

### Changement de processus

En gros, lors du changement du processus A à un processus B : l'exécution d'A est interrompue, le système prend le relais et sauvegarde l'état actuel d'A, le système restaure l'état du processus B dans le processeur et le processus B reprend son exécution.

### États d'un processus

Le système gère plusieurs processus, nous avons l'état du processus (bloqué, en cours d'exécution, etc.)

Le système décide de la **planification** des processus (**l'ordonnancement**)

Sous Unix, les processus sont organisés en **hiérarchie (processus père, processus fils)** :

**PID** Process Identifier : **identifiant du processus**

**PPID** Parent Process Identifier : **identifiant du processus père**

Le **processus ancêtre** (ancêtre) PID = 1 est **système** dans LINUX

### Visualisation des processus

ps -e liste tous les processus, équivalent à -A

ps -l liste tous les processus sous forme longue

pstree -p PID affiche l'arborescence des processus sous le PID spécifié, affiche le PID du processus

### Création de processus

Processus père, processus fils

La fonction **Fork(**) crée un processus fils à partir du processus père, le code et la mémoire du processus fils sont **identiques** à ceux du processus père

Valeurs de retour :

Si la création du processus fils réussit, le **processus père renvoie le PID du processus fils** et le **processus fils renvoie 0** (comme le code est identique, nous ne savons pas si le processus actuel est le père ou le fils, nous devons donc utiliser une instruction if pour vérifier la valeur de retour)

En cas d'échec, le processus père renvoie -1 et errno est automatiquement défini

### Fin du processus

La fin d'un processus se fait généralement de deux manières : en retournant de la fonction main() ou en exécutant la fonction void exit(int status)

Une fois qu'un processus se termine, il devient un **zombie**

La mémoire de fin de processus n'est pas complètement libérée, la valeur de retour de la fonction main est conservée en attente

Le processus père appelle la fonction waitpid pour lire le résultat

Si le processus père se termine avant le processus fils, le processus fils est un **orphelin** et est adopté par le processus système ancestral systemd

### 

### Fonction exec()

La fonction exec() remplace le processus courant par un nouveau processus, aucun nouveau processus n'est créé et le PID du processus reste le même

La fonction a une valeur de retour -1 et pointe vers une erreur uniquement lorsque des erreurs se produisent

**execvp**

int execvp(const char *file, char *const argv[]);

Remplace le processus par le fichier du chemin file et les arguments argv

### Communication entre processus

Les processus ne peuvent pas influencer d'autres processus sans effectuer d'appels système

Paramètres principaux de la fonction main :

**argc** : le nombre d'arguments

**argv**[i] : i est compris entre 0 et argc-1, c'est une chaîne de caractères qui se termine par \0, argv[0] est généralement le nom du fichier

### Variables d'environnement

**PATH** : liste des répertoires dans lesquels les exécutables sont recherchés.

echo $VAR affiche la variable VAR

env liste toutes les variables d'environnement

export VAR=value définit une variable d'environnement

# Linux/C : fonction waitpid()

`pid_t waitpid(pid_t pid, int *status, int options)`

Le processus appelant cette fonction passe en mode **bloqué** et attend la fin du processus fils

Dépendances des en-têtes :

`#include <sys/types.h>`

`#include <sys/wait.h>`

**Paramètres :**

**`pid`** : PID du processus fils à attendre. Si 0, attend n'importe quel processus

**`status:`** pointeur vers un entier utilisé pour stocker le code de sortie du processus fils. Lorsque le processus fils se termine, le noyau stocke le code de sortie du processus fils à l'emplacement mémoire pointé par ce paramètre. NULL pour ignorer cette option.

- **`WIFEXITED(status)`** : renvoie une valeur non nulle si le processus fils s'est terminé normalement.
- **`WEXITSTATUS(status)`** : renvoie le code de sortie du processus fils si celui-ci s'est terminé normalement.
- **`WIFSIGNALED(status)`** : renvoie une valeur non nulle si le processus fils s'est terminé à cause d'un signal.
- **`WTERMSIG(status)`** : renvoie le numéro de signal qui a causé la terminaison du processus fils.
- **`WIFSTOPPED(status)`** : renvoie une valeur non nulle si le processus fils a été suspendu.
- **`WSTOPSIG(status)`** : renvoie le numéro de signal qui a causé la suspension du processus fils.
- **`WIFCONTINUED(status)`** : renvoie une valeur non nulle si le processus fils a été repris.

**`options`** :  = 0 attend le processus fils normalement

```
           = WNOHANG, retourne immédiatement s'il n'y a aucun processus fils terminé, sans attendre

```

**Valeur de retour :**

Retourne -1 en cas d'erreur, mets à jour la variable errno

Si le processus fils se termine, renvoie le PID du processus fils

Si aucun processus n'est bloqué et aucun processus fils ne se termine, renvoie 0

**Remarques :**

La fonction **`wait()`** permet au processus père d'attendre la fin du processus fils et d'obtenir le code de sortie du processus fils. Par défaut, le processus père attend la fin du processus fils, mais si **`wait()`** ou **`waitpid()`** n'est pas utilisé pour attendre la fin du processus fils, le processus fils devient un "zombie", ce qui peut entraîner un gaspillage des ressources système.

Lorsqu'un processus fils se termine, il n'est pas immédiatement supprimé du système, mais laisse un descripteur de processus qui contient le code de sortie du processus fils, ces descripteurs de processus sont appelés "zombies". Si le processus père ne vient pas attendre le processus fils, ces descripteurs de processus restent indéfiniment et occupent les ressources système, il est donc nécessaire d'utiliser **`wait()`** ou **`waitpid()`** dans le processus père pour attendre la fin du processus fils et récupérer ses ressources.

# Signaux Linux

## Concept de signal

Sous Unix, tout processus en cours d'exécution peut recevoir des signaux. Les signaux peuvent provenir du terminal ou d'exceptions matérielles/logicielles. Lorsqu'un processus reçoit un signal, il perturbe le flux de contrôle normal du processus. Si le processus a défini une fonction de traitement des signaux, celle-ci est exécutée, sinon la fonction de traitement par défaut est exécutée.

Un signal est un événement asynchrone (peut arriver à tout moment)

## Commandes shell

**kill -s signal pid** envoie un signal spécifique

**ps a** : affiche tous les processus PID, y compris ceux des autres utilisateurs

Exemple : kill -s SIGALRM 11783

**kill -l** liste tous les signaux existants

## C/C++ POSIX

int kill(pid_t pid, int sig) : pour envoyer un signal

kill() envoie le signal spécifié par sig au processus spécifié par pid.

**Dépendances des en-têtes :**

include <signal.h>

**Paramètres :**

pid : 1. pid>0 : envoie le signal au processus dont l'ID est pid. 2. pid=0 : envoie le signal à tous les processus du groupe de processus actuel qui a le même ID que le processus en cours. 3. pid=-1 : envoie le signal à tous les processus du système. 4. pid<0 : envoie le signal à tous les processus du groupe de processus dont l'ID absolu est |pid|.

sig : signal à envoyer, par exemple SIGALRM

**Valeur de retour :**

Retourne 0 en cas de succès, -1 en cas d'erreur.

## Fonction sigaction

sigaction() est utilisée pour définir la manière dont un signal particulier doit être traité à l'aide du numéro de signal spécifié par signum.

int sigaction(int signum, const struct sigaction *act, struct sigaction *oldact)

**Dépendances des en-têtes :**

```
#include <signal.h>

```

**Paramètres :**

signum : signal à traiter

act : nouvelle façon de traiter le signal

oldact : ancienne façon de traiter le signal

La structure d'argument de fonction sigaction est définie comme suit :

```
struct sigaction{
void (*sa_handler) (int);
void  (*sa_sigaction)(int, siginfo_t *, void *);
sigset_t sa_mask;
int sa_flags;
void (*sa_restorer) (void);
}

```

**Valeur de retour :**

0 indique le succès, -1 indique une erreur.

**Un exemple simple**

```
#include <signal.h>
#include <iostream>
using namespace std;

// Compteur global
int cpt = 0;
// Fonction à remplacer
void fct(int s){
  cpt++;
  cout << "M’enfin ! (" << cpt << ")"<< endl;
  if (cpt == 10) {
    cout << "Aie !!!" << endl;
    exit(EXIT_SUCCESS);
  }
}

int main(void) {
  // Installation du gestionnaire pour SIGINT (Ctrl+c)
  struct sigaction s;// this is the default
  if( sigaction(SIGINT, NULL, &s) == -1 ) exit(EXIT_FAILURE);
  s.sa_handler = fct;// replace the default by fct
  if( sigaction(SIGINT, &s, NULL) == -1 ) exit(EXIT_FAILURE);
  while(1) {
    cout << "RRRRR..." << endl;
    sleep(1);
  }
  return EXIT_SUCCESS;
}

```

## Fonction alarm

unsigned int **alarm**(unsigned int seconds)

Envoie un signal SIGALRM au processus appelant après seconds secondes.

Si seconds est spécifié comme 0, l'alarme en attente est annulée. Si un autre événement se produit avant la fin du temps d'attente, l'alarme est également annulée.

Pour un processus, seules les appels à alarm() les plus récents sont valides. La valeur de retour d'alarm() est le temps restant avant l'appel à alarm() précédent.

# Linux/C : ouverture, lecture et écriture de fichiers

### Appels système (POSIX)

Un fichier est manipulé à l'aide d'un entier appelé **descripteur de fichier**.

**STDIN_FILENO** = 0 : entrée standard

**STDOUT_FILENO** = 1 : sortie standard

**STDERR_FILENO** = 2 : erreur standard

### int open(const char * pathname, int flags)

Ouvre le fichier **pathname** en utilisant le **mode flags** et retourne un descripteur de fichier.

**Dépendances des en-têtes :**

#include <sys/types.h>

#include <sys/stat.h>

#include <fcntl.h>

**Paramètres :**

pathname : nom du fichier ou chemin d'accès du fichier à ouvrir

flags : mode d'ouverture du fichier

O_RDONLY : mode lecture seule

O_WRONLY : mode écriture seule

O_RDWR : mode lecture/écriture

**Valeur de retour :**

Retourne le descripteur de fichier du fichier ouvert avec succès

En cas d'erreur, -1 est renvoyé et le code d'erreur est stocké dans errno

### ssize_t read(int fd, void *buf, size_t count);

Appelle la fonction read pour lire les octets de taille maximale count du fichier fd et les stocke dans le tampon buf, puis renvoie le nombre d'octets lus nbrd.

**Dépendances de l'en-tête:**

#include <unistd.h>

**Paramètres:**

fd: descripteur de fichier pour la lecture

buf: adresse du tampon, généralement un tableau de caractères

count: le nombre maximal d'octets à lire à partir du fichier fd

**Valeur de retour:**

count > valeur de retour > 0: la lecture a réussi et la valeur de retour est le nombre d'octets lus

valeur de retour = -1: erreur de lecture et le message d'erreur est enregistré dans errno

valeur de retour = 0: condition normale de fin de fichier. Dépend de la valeur de errno

### ssize_t write(int fd, const void *buf, size_t count);

size_t est un type entier non signé, ssize_t est son équivalent signé

Appelle la fonction write pour écrire les octets de taille maximale count à partir du tampon buf dans le descripteur de fichier fd, puis renvoie le nombre d'octets écrits nbwt.

**Dépendances de l'en-tête:**

#include <unistd.h>

**Paramètres:**

fd: descripteur de fichier pour l'écriture

buf: adresse du tampon, généralement un tableau de caractères

count: le nombre maximal d'octets à écrire dans le fichier fd

**Valeur de retour:**

count > valeur de retour > 0: l'écriture a réussi et la valeur de retour est le nombre d'octets écrits

valeur de retour = -1: erreur de lecture et le message d'erreur est enregistré dans errno

valeur de retour = 0: dépend de la valeur de errno

### int close(int fd);

Ferme le fichier fd

**Dépendances de l'en-tête:**

#include <unistd.h>

**Paramètres:**

fd: descripteur de fichier à fermer

**Valeur de retour:**

En cas de succès, renvoie 0 et le descripteur de fichier est libéré.

valeur de retour = -1: erreur de lecture et le message d'erreur est enregistré dans errno

### Exemple de lecture/écriture de fichier en C++ :

```cpp
#include <iostream>
#include <string>

//strerror
#include <errno.h>

//read write close
#include <unistd.h>

//open
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

using namespace std;

#define LEN 16
int main(int argc, char * argv[]){
  int fd = open(argv[1], O_RDONLY);
  if(fd == -1){
    cerr << "Impossible d'ouvirir" << argv[1] << "en lecture" << endl;
    return EXIT_FAILURE;
  }
  char buf[LEN];

  int nbrd = read(fd, buf, LEN);
  while(nbrd > 0){
    int nbwr = 0;
    int nbr = nbrd;
    //les caractères lus ne peuvent pas être écrits en une seule fois
    while(nbr > 0){
        int nb = write(STDOUT_FILENO, buf+nbwr, nbr);
        if(nb < 0){
          cerr << "error quand on écrire" << endl;
          return 1;
        }
        nbwr += nb;
        nbr -= nb;
    }
    nbrd = read(fd, buf, LEN);
  }
  if(nbrd < 0){
    cerr << "error quand on lire" << endl;
    return 1;
  }
  close(fd);
  return 0;
}

```

# Linux/C : utilisation de creat()

**Description de la fonction:**

La fonction `creat()` est une fonction standard POSIX qui crée un nouveau fichier ou tronque un fichier existant.

**Définition de la fonction**

`int creat(const char *path, mode_t mode);`

**Dépendances de l'en-tête:**

`#include <fcntl.h>`

**Paramètres:**

`path`: chemin et nom du fichier à créer.

`mode`: spécifie les permissions d'accès au fichier.

- `S_IRUSR`: lecture par l'utilisateur. Le propriétaire du fichier peut lire le fichier.
- `S_IWUSR`: écriture par l'utilisateur. Le propriétaire du fichier peut écrire dans le fichier.
- `S_IXUSR`: exécution par l'utilisateur. Le propriétaire du fichier peut exécuter le fichier.
- `S_IRGRP`: lecture par le groupe. Les membres du groupe du fichier peuvent lire le fichier.
- `S_IWGRP`: écriture par le groupe. Les membres du groupe du fichier peuvent écrire dans le fichier.
- `S_IXGRP`: exécution par le groupe. Les membres du groupe du fichier peuvent exécuter le fichier.
- `S_IROTH`: lecture par les autres utilisateurs. Les autres utilisateurs peuvent lire le fichier.
- `S_IWOTH`: écriture par les autres utilisateurs. Les autres utilisateurs peuvent écrire dans le fichier.
- `S_IXOTH`: exécution par les autres utilisateurs. Les autres utilisateurs peuvent exécuter le fichier.
- `S_ISUID`: définit l'ID utilisateur. Lorsque ce drapeau est activé, l'ID utilisateur effectif du processus exécutant le fichier est défini sur l'ID utilisateur du propriétaire du fichier.
- `S_ISGID`: définit l'ID de groupe. Lorsque ce drapeau est activé, l'ID de groupe effectif du processus exécutant le fichier est défini sur l'ID de groupe du fichier.
- `S_ISVTX`: bit collant. Ce drapeau est principalement utilisé pour les fichiers de répertoire. Si un fichier de répertoire a ce drapeau, seul le propriétaire du fichier peut créer, supprimer ou déplacer des fichiers dans ce répertoire, les autres utilisateurs ne le peuvent pas.

Pour définir les permissions d'un nouveau fichier sur **-rw-r--r--**, vous pouvez utiliser le mode 0644 (notation octale) ou 420 (notation décimale).

**Valeur de retour:**

Si la création du fichier réussit, elle renvoie le descripteur de fichier du fichier créé.

Si une erreur se produit, elle renvoie -1 et place le code d'erreur dans errno.

**Remarques:**

Notez que lors de la création d'un fichier à l'aide de la fonction `creat()`, si le fichier existe déjà, il sera tronqué, c'est-à-dire que le contenu du fichier sera effacé, sauf si le flag `O_APPEND` est spécifié. Par conséquent, lors de la création d'un fichier à l'aide de la fonction `creat()`, il est généralement nécessaire de s'assurer que le fichier n'existe pas déjà, ou d'utiliser la fonction `open()` pour ouvrir le fichier et spécifier les indicateurs appropriés.

# Linux/C : utilisation de rename()

**Description de la fonction:**

La fonction `rename()` est utilisée pour renommer un fichier, changer le chemin d'accès d'un fichier ou renommer un répertoire.

**Définition de la fonction**

`int rename(char * oldname, char * newname);`

**Dépendances de l'en-tête:**

`#include <stdio.h>`

**Paramètres:**

oldname: ancien nom de fichier

newname: nouveau nom de fichier

**Valeur de retour:**

Si la modification du nom de fichier réussit, elle renvoie 0. Sinon, elle renvoie -1.

**Remarques:**

- Si oldname et newname sont tous deux des répertoires, le répertoire est renommé.
- Si le répertoire spécifié par newname existe et est un répertoire vide, il est d'abord supprimé.
- Pour les deux répertoires newname et oldname, le processus appelant doit avoir des droits d'écriture.
- Lors du renommage d'un répertoire, newname ne peut pas inclure oldname en tant que préfixe de chemin. Par exemple, il n'est pas possible de renommer /usr en /usr/foo/testdir, car l'ancien nom (/usr/foo) est un préfixe du nouveau nom, il ne peut donc pas être supprimé.

# Linux/C : utilisation de system()

**Description de la fonction:**

La fonction `system()` appelle la commande spécifiée par la chaîne de caractères `command` en utilisant "/bin/sh -c command" et bloque le processus en cours jusqu'à ce que la commande soit exécutée.

Lors de l'exécution de la fonction system, elle appelle les fonctions fork, execve et waitpid.

**Définition de la fonction**

`int system(const char *command);`

**Dépendances de l'en-tête:**

`#include <stdlib.h>`

**Paramètres:**

command: chaîne de caractères contenant la commande à exécuter.

**Valeur de retour:**

Si la commande shell ne peut pas être exécutée, system renverra 127.

Si d'autres erreurs empêchent l'exécution de l'appel système, -1 sera renvoyé.

Si system peut s'exécuter correctement, il renvoie le code de sortie de cette commande.

**Exemple:**

```c
#include <stdio.h>
#include <string.h>
#include<stdlib.h>
int main ()
{
char command[50];
strcpy( command, "ls -l" );
system(command);
return(0);
}

```

# Linux/C : utilisation de sprintf()

**Description de la fonction:**

`sprintf()` est une fonction de bibliothèque standard en langage C qui écrit une chaîne formatée dans une mémoire tampon.

**Définition de la fonction**

`int sprintf(char *str, const char *format, ...)`

**Dépendances de l'en-tête:**

`<stdio.h>`

**Paramètres:**

- **str** -- C'est un pointeur vers un tableau de caractères qui stocke la chaîne C.
- **format** -- C'est une chaîne qui contient le texte à écrire dans la chaîne str. Il peut contenir des balises de format intégrées, les balises de format peuvent être remplacées par des valeurs spécifiées ultérieurement dans les arguments supplémentaires en fonction des besoins. Les propriétés des balises de format sont **%[flags][width][.precision][length]specifier**, expliquées ci-dessous :

**Valeur de retour:**

Si la fonction réussit, elle renvoie le nombre total de caractères écrits, à l'exception du caractère nul final ajouté à la fin de la chaîne. Si elle échoue, elle renvoie un nombre négatif.

**Exemple:**

```c
#include <stdio.h>
#include <math.h>

int main()
{
   char str[80];

   sprintf(str, "La valeur de Pi est = %f", M_PI);
   puts(str);

   return(0);
}

```

# Linux/C : utilisation de lseek()

**Description de la fonction:**

**Déplacer la position de lecture/écriture d'un fichier**

**Définition de la fonction**

`off_t lseek(int fildes, off_t offset, int whence);`

**Dépendances de l'en-tête:**

`#include <sys/types.h>`

`#include <unistd.h>`

**Paramètres:**

`int fildes` est le descripteur de fichier pour lequel déplacer le pointeur de fichier

`off_t offset` est l'offset à déplacer
`int whence` est la façon dont le pointeur de fichier est calculé. Il peut prendre trois valeurs :

```
  SEEK_SET : début du fichier

  SEEK_CUR : position actuelle du fichier

  SEEK_END : fin du fichier

```

**Valeur de retour:**

Lorsqu'elle est appelée avec succès, elle renvoie la position de lecture/écriture actuelle, c'est-à-dire le nombre d'octets à partir du début du fichier.

Si une erreur se produit, elle renvoie -1 et errno contient le code d'erreur correspondant.

**Remarques:**

Le système Linux n'autorise pas `lseek()` à agir sur le périphérique tty, cette action fera renvoyer `lseek()` avec la valeur `ESPIPE`.

# Linux/C : **execve()**

**Description de la fonction:**

Pour la famille de fonctions exec, son rôle est de remplacer le processus actuel par un autre programme exécutable. Lorsque nous exécutons un processus, en utilisant la fonction exec, les segments de données, de code et de pile du processus actuel sont remplacés par les segments de données, de code et de pile du programme exécutable A, et le processus actuel commence à exécuter le contenu de A. Ce processus ne crée pas de nouveau processus et le PID n'est pas modifié.

Les utilisations courantes de la famille de fonctions exec sont les suivantes :

1. Lorsqu'un processus n'a plus besoin de s'exécuter, il peut utiliser une fonction de la famille exec pour continuer à s'exécuter.
2. Si un processus souhaite exécuter un autre programme exécutable, il peut utiliser la fonction fork pour d'abord créer un processus fils, puis utiliser le processus fils pour appeler la fonction exec afin d'implémenter la fonctionnalité du programme exécutable.

Il y a six fonctions au total dans la famille exec, dont execve est un appel système de niveau noyau, et les autres (execl, execle, execlp, execv, execvp) sont des fonctions de bibliothèque qui appellent execve.

**Description de la fonction execve**

execve() est utilisé pour exécuter le fichier spécifié par la chaîne filename.

**Définition de la fonction**

`int execve(const char * filename,char * const argv[ ],char * const envp[ ]);`

**Dépendances de l'en-tête:**

`#include<unistd.h>`

**Paramètres:**

`filename:` le nom du programme à exécuter

`argv:` un tableau de pointeurs utilisé pour passer des arguments au programme exécuté, et doit se terminer par un pointeur nul (NULL)

`envp:` le dernier paramètre est un tableau de nouvelles variables d'environnement à transmettre au programme exécuté.

**Valeur de retour:**

Lorsque la fonction est exécutée avec succès, elle ne retourne pas et entre directement dans le nouveau programme.

Si la fonction renvoie, cela signifie qu'une erreur s'est produite, et vous pouvez obtenir des informations sur l'erreur à travers la valeur de retour.

**Exemple:**

```c

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
int main()
{
	char *argv[] = {"ls", "-l", NULL};
	char *envp[] = {NULL};
	if (execve("/bin/ls", argv, envp) < 0)
	{
		perror("execve error");
		exit(1);
	}
	return 0;
}

```

# Linux/C: Pipe

## Pipe

Fonctionne entre des processus liés par le sang (processus parent et processus enfant, processus apparentés) pour transférer des données. Il suffit d'appeler la fonction système pipe pour créer un pipe.

int pipe(int pipefd[2]);

**Dépendances de l'en-tête:**

```
#include <unistd.h>

```

**Paramètres**

fd[0] → lire ; fd[1] → écrire

Tout comme 0 correspond à l'entrée standard et 1 correspond à la sortie standard.

**Valeur de retour**

Succès : 0 ; échec : -1, définit errno

**Exemple**

```c
int main(void)
{
    int n;
    int fd[2];
    pid_t pid;
    char line[MAXLINE];

    if(pipe(fd) != 0){                 /* Créez d'abord un pipe pour obtenir une paire de descripteurs de fichiers */
        exit(0);
    }

    if((pid = fork()) < 0)            /* Le processus parent copie le descripteur de fichier pour le processus fils */
        exit(1);
    else if(pid > 0){                /* parent écrit */
        close(fd[0]);                /* Ferme le descripteur de lecture */
        write(fd[1], "\\nhello world\\n", 14);
    }
    else{                            /* enfant lit */
        close(fd[1]);                /* Ferme l'extrémité d'écriture */
        n = read(fd[0], line, MAXLINE);
        write(STDOUT_FILENO, line, n);
    }

    exit(0);
}

```

## FIFO (Named Pipe)

**FIFO**, également connu sous le nom de **Named Pipe** ou **Named Pipe**, est un concept de la norme POSIX. Comme nous le savons, le pipe décrit dans la norme POSIX n'a pas de nom, donc son plus grand inconvénient est qu'il ne peut être utilisé que pour la communication entre les processus apparentés. La plus grande caractéristique de FIFO est que chaque FIFO est associé à un nom de chemin, ce qui permet à n'importe quel deux processus sans parenté de communiquer via FIFO. Par conséquent, les deux principales caractéristiques de FIFO sont les suivantes :

Comme le pipe, FIFO ne fournit qu'une communication de données semi-duplex, c'est-à-dire qu'il ne prend en charge qu'un flux de données unidirectionnel ;
Au contraire du pipe, FIFO peut prendre en charge la communication entre **n'importe quel deux processus**.

**Dépendances de l'en-tête:**

`#include <sys/types.h>    #include <sys/stat.h>`

**Définition de la fonction:**

`int mkfifo(const char *pathname, mode_t mode);`

**Paramètres**

pathname: un nom de chemin Linux, qui est le nom de la FIFO. C'est-à-dire que chaque FIFO correspond à un nom de chemin ;
mode: spécifie les droits d'accès du fichier, similaire au troisième argument de la fonction open. C'est-à-dire qu'en créant cette FIFO, il spécifie les droits d'accès de l'utilisateur et a les valeurs suivantes : S_IRUSR, S_IWUSR, S_IRGRP, S_IWGRP, S_IROTH, S_IWOTH.

**Valeur de retour**

Si la création réussit, 0 est renvoyé directement. Si la FIFO existe déjà, la création échoue et -1 est renvoyé avec errno défini sur EEXIST. Pour les autres erreurs, les valeurs errno correspondantes sont définies.

**Exemple**

```c
// FIFOwrite.c
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main(int argc, char *argv[])
{
    int fd;
    int ret;
    ret = mkfifo("my_fifo", 0666); // Créez une FIFO nommée
    if(ret != 0)
    {
        perror("mkfifo");
    }
    fd = open("my_fifo", O_WRONLY); // En attente de lecture
    if(fd < 0)
    {
        perror("open fifo");
    }
    char send[100] = "Hello World";
    write(fd, send, strlen(send));  // Écrire des données
    printf("write to my_fifo buf=%s\\n",send);
    while(1); // Bloquer, assurez-vous que les processus de lecture et d'écriture sont en communication
    close(fd);
    return 0;
}

```

```c
// FIFOread.c
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main(int argc, char *argv[])
{
    int fd;
    int ret;
    ret = mkfifo("my_fifo", 0666); // Créez une FIFO nommée
    if(ret != 0)
    {
        perror("mkfifo");
    }
    fd = open("my_fifo", O_RDONLY); // En attente d'écriture
    if(fd < 0)
    {
        perror("open fifo");
    }
    while(1)
    {
        char recv[100] = {0};
        read(fd, recv, sizeof(recv)); // Lire des données
        printf("read from my_fifo buf=[%s]\\n", recv);
        sleep(1);
    }
    close(fd);
    return 0;
}

```

1. Le pipe est un tampon circulaire qui permet à deux processus de communiquer selon le modèle producteur-consommateur. Il s'agit d'une file d'attente de type FIFO (premier entré, premier sorti), où un processus écrit et un autre processus lit.
2. **Le pipe a une taille fixe en nombre d'octets lors de sa création**. Lorsqu'un processus essaie d'écrire dans le pipe et qu'il y a suffisamment d'espace, la demande d'écriture est exécutée immédiatement ; sinon, le processus est bloqué. Si un processus essaie de lire plus d'octets que le nombre d'octets actuellement présents dans le pipe, il est également bloqué.
3. Le système d'exploitation applique la mutual exclusion, **un seul processus peut accéder au pipe à la fois**.
4. Seuls les processus ayant une parenté (relation père-fils) peuvent partager un pipe anonyme, les processus non apparentés ne peuvent partager qu'un pipe nommé.
5. **Les principaux usages du pipe nommé sont les suivants :**

**(1) Transférer des données d'un pipe à un autre sans créer de fichier temporaire intermédiaire**

**(2) Transférer des données entre des processus client et serveur.**

Référence partielle à [https://blog.csdn.net/daaikuaichuan/article/details/82827994](https://blog.csdn.net/daaikuaichuan/article/details/82827994)

# Linux/C : mkdir() Usage

**Description de la fonction:**

La fonction `mkdir()` crée un répertoire avec le nom spécifié par `pathname` en utilisant le mode spécifié par `mode`.

**Définition de la fonction**

`int mkdir(const char *pathname, mode_t mode);`

**Dépendances de l'en-tête:**

`#include <sys/stat.h>`

`#include <sys/types.h>`

**Paramètres:**

| S_IRWXU | Autorisation 00700, propriétaire du fichier a les autorisations de lecture, écriture et exécution |
| --- | --- |
| S_IRUSR(S_IREAD) | Autorisation 00400, propriétaire du fichier a l'autorisation de lecture |
| S_IWUSR(S_IWRITE) | Autorisation 00200, propriétaire du fichier a l'autorisation d'écriture |
| S_IXUSR(S_IEXEC) | Autorisation 00100, propriétaire du fichier a l'autorisation d'exécution |
| S_IRWXG | Autorisation 00070, groupe d'utilisateurs du fichier a les autorisations de lecture, écriture et exécution |
| S_IRGRP | Autorisation 00040, groupe d'utilisateurs du fichier a l'autorisation de lecture |
| S_IWGRP | Autorisation 00020, groupe d'utilisateurs du fichier a l'autorisation d'écriture |
| S_IXGRP | Autorisation 00010, groupe d'utilisateurs du fichier a l'autorisation d'exécution |
| S_IRWXO | Autorisation 00007, autres utilisateurs du fichier ont les autorisations de lecture, écriture et exécution |
| S_IROTH | Autorisation 00004, autres utilisateurs du fichier ont l'autorisation de lecture |
| S_IWOTH | Autorisation 00002, autres utilisateurs du fichier ont l'autorisation d'écriture |
| S_IXOTH | Autorisation 00001, autres utilisateurs du fichier ont l'autorisation d'exécution |

**Valeur de retour:**

Si la fonction réussit à créer le répertoire, elle renvoie 0 ;

Sinon, elle renvoie -1 et enregistre l'erreur dans la variable globale errno.

# Linux/C : thread

### Description des threads:

Cet article résume l'utilisation des appels système de l'interface pthread, une bibliothèque couramment utilisée dans les programmes POSIX. Voici une présentation des fonctions couramment utilisées de pthread.

### Dépendances de l'en-tête:

`#include <pthread.h>`

### Compilation avec GCC:

`gcc –o executable code.c –lpthread`

### Création de threads:

**Définition de la fonction:**

`int pthread_create(pthread_t *thread,const pthread_attr_t *attr, void *(*start_routine)(void *),void *arg);`

**Paramètres:**

thread: un pointeur vers l'ID du thread à créer

attr: généralement passé NULL, ce qui indique d'utiliser les attributs par défaut du thread ; (définir les attributs du thread)

start_routine

Auteur : Shengqi MA
Créé : 19 janvier 2024 11:09 AM
En vedette : Non
Dernière mise à jour : 21 janvier 2024 21:17
Public : Oui

# Linux/C : thread

### Description des threads :

Cet article résume l'utilisation des appels système de l'interface de la bibliothèque de threads pthread, qui est couramment utilisée selon la norme POSIX.

### Dépendances des fichiers d'en-tête :

`#include <pthread.h>`

### Compilation avec GCC :

`gcc –o exécutable code.c –lpthread`

### Création de threads :

**Définition de la fonction :**

`int pthread_create(pthread_t *thread, const pthread_attr_t *attr, void *(*start_routine)(void *), void *arg);`

**Paramètres :**

thread : **pointeur vers l'ID du thread à créer**

attr : **généralement mis à NULL**, indique l'utilisation des attributs par défaut du thread ; (**définition des attributs du thread**)

start_routine : est un **pointeur de fonction** qui pointe vers une fonction prenant un argument de type void* et renvoyant également un void*, cette fonction est **la fonction exécutée par le thread créé**, une fois le thread créé, il exécutera le code de cette fonction.

arg : spécifie les **arguments réels à passer à la fonction start_routine**, lorsque aucune donnée n'a besoin d'être passée, arg peut être défini sur **NULL**

**Valeur de retour :**

**Si la création du thread est réussie, elle renverra 0** ;

Sinon, elle renverra une valeur non nulle. Chaque valeur non nulle correspond à une macro différente, indiquant la cause de l'échec de la création. Les macros courantes comprennent :

- EAGAIN : Les ressources système sont insuffisantes pour fournir les ressources nécessaires à la création du thread.
- EINVAL : L'argument attr passé à la fonction pthread_create() est invalide.
- EPERM : Dans l'argument attr passé à la fonction pthread_create(), certaines des propriétés sont configurées pour une opération illégale et le programme n'a pas les autorisations appropriées pour cette configuration.

**Exemple :**

```c
#include<stdlib.h>
#include<stdio.h>
#include<pthread.h>

void* myfunc(void* args){
    int i;
    for(i = 0; i < 50; i++){
        printf("%d\\n", i);
    }
    return NULL;
}

int main(){
    pthread_t th1;

    pthread_create(&th1, NULL, myfunc, NULL);

    pthread_join(th1, NULL);

    return 0;
}

```

### Attendre un thread :

**Description de la fonction :**

Le thread principal attend que le thread enfant se termine. Le code après l'appel à pthread_join par le thread principal ne sera exécuté qu'après la fin du thread attendu.

**Définition de la fonction :**

`int pthread_join(pthread_t thread, void **value_ptr)`

**Paramètres :**

thread : le numéro du thread enfant à attendre

value_ptr : représente la valeur de retour reçue, si le thread n'a pas de valeur de retour ou si nous n'avons pas besoin de recevoir la valeur de retour du thread, nous pouvons définir l'argument value_ptr sur NULL.

**Valeur de retour :**

0 pour succès. Échec, retourne un code d'erreur.

### Quitter un thread :

**Description de la fonction :**

Utilisé pour forcer la sortie d'un thread (non terminé), généralement utilisé à l'intérieur d'un thread.

Utilisation combinée : en général, pthread_exit est utilisé pour sortir d'un thread, puis renvoie une valeur. À ce moment-là, vous sauterez à pthread_join du thread principal (parce qu'il attend constamment votre fin), cette valeur de retour sera directement envoyée à pthread_join, ce qui réalise la communication entre le thread principal et le thread secondaire.

**Définition de la fonction :**

`void pthread_exit(void* retval);`

**Paramètres :**

retval : retval est un pointeur de type void*, il peut pointer vers des données de n'importe quel type, les données pointées seront la valeur de retour lorsque le thread se termine. Si le thread n'a pas besoin de retourner de données, vous pouvez définir l'argument retval sur NULL.

**Valeur de retour :**

0 pour succès. Échec, retourne un code d'erreur.

### Annuler un thread :

**Description de la fonction :**

Utilisé pour forcer la sortie d'un thread (non terminé), généralement utilisé à l'intérieur d'un thread.

Utilisation combinée : en général, pthread_exit est utilisé pour sortir d'un thread, puis renvoie une valeur. À ce moment-là, vous sauterez à pthread_join du thread principal (parce qu'il attend constamment votre fin), cette valeur de retour sera directement envoyée à pthread_join, ce qui réalise la communication entre le thread principal et le thread secondaire.

**Définition de la fonction :**

`int pthread_cancel(pthread_t thread);`

**Paramètres :**

thread : ID du thread à annuler

**Valeur de retour :**

0 pour succès. Échec, retourne un code d'erreur non nul.

# Linux/C : Mutex:

Le verrou est un mécanisme couramment utilisé dans les programmes, en particulier dans les programmes multithreadés. Sans l'aide d'un verrou, la synchronisation entre les threads peut être très compliquée, voire impossible. Dans pthread, il existe un type de verrou appelé mutex, qui est souvent utilisé sous Linux. Voici une introduction aux fonctions de pthread_mutex_t et à leur utilisation.

**Portée des ressources verrouillées par le mutex :**

Les ressources verrouillées par un thread sont généralement des données ou des ressources qui doivent être partagées entre plusieurs threads, telles que des variables globales. Lorsqu'un thread utilise et verrouille une ressource, toute autre tentative d'accès à cette ressource par un autre thread entraînera un état de verrouillage.

Autres ressources pouvant être verrouillées :

1. Structures de données : telles que des listes chaînées, des files d'attente, des piles, etc., qui peuvent être partagées entre plusieurs threads.
2. Accès aux fichiers ou aux bases de données : lorsqu'il y a plusieurs threads nécessitant l'accès en lecture ou en écriture à un même fichier ou à une même base de données, il est nécessaire de verrouiller l'accès pour garantir la cohérence des données.
3. Accès aux périphériques ou aux ressources externes : par exemple, lorsqu'il y a plusieurs threads nécessitant l'accès à un même périphérique matériel ou à une même connexion réseau, il peut être nécessaire d'utiliser un verrou pour éviter les conflits.

**Déclaration du mutex :**

`pthread_mutex_t mutex;`

Utilisez une variable de type pthread_mutex_t pour représenter un mutex.

**Initialisation du mutex :**

`int pthread_mutex_init(pthread_mutex_t *mutex, const pthread_mutexattr_t *attr);`

- Le paramètre mutex représente le mutex à initialiser ;
- Le paramètre attr est utilisé pour personnaliser les attributs du mutex nouvellement créé. Lorsque la valeur de attr est NULL, cela indique la création du mutex avec les attributs par défaut.

**Verrouillage et déverrouillage du mutex :**

`int pthread_mutex_lock(pthread_mutex_t *mutex);`

`int pthread_mutex_unlock(pthread_mutex_t *mutex);`

- Le paramètre mutex représente le mutex sur lequel nous voulons effectuer des opérations. Lorsque la fonction réussit, elle renvoie 0. Sinon, elle renvoie un nombre non nul.

**Exemple :**

```c
#include<stdio.h>
#include<stdlib.h>
#include<pthread.h>
#include<unistd.h>
int ticket_sum = 10;
// Créer un mutex
pthread_mutex_t myMutex = PTHREAD_MUTEX_INITIALIZER;
// Simuler la vente de billets par le vendeur
void *sell_ticket(void *arg) {
    // Afficher l'ID du thread en cours d'exécution
    printf("ID du thread en cours d'exécution : %u\\n", pthread_self());
    int i;
    int islock = 0;
    for (i = 0; i < 10; i++)
    {
        // Verrouiller le mutex actuel
        islock = pthread_mutex_lock(&myMutex);
        // Si la lock réussit, exécuter le code ci-dessous
        if (islock == 0) {
            // Si le nombre de billets > 0, commencez à vendre des billets
            if (ticket_sum > 0)
            {
                sleep(1);
                printf("%u Vendre le %d billet\\n", pthread_self(), 10 - ticket_sum + 1);
                ticket_sum--;
            }
            // Simulation de la fin du processus de vente de billets du thread actuel, effectuer l'opération de "déverrouillage"
            pthread_mutex_unlock(&myMutex);
        }
    }
    return 0;
}

int main() {
    int flag;
    int i;
    void *ans;
    // Créer 4 threads pour simuler 4 vendeurs
    pthread_t tids[4];
    for (i = 0; i < 4; i++)
    {
        flag = pthread_create(&tids[i], NULL, &sell_ticket, NULL);
        if (flag != 0) {
            printf("Erreur lors de la création du thread !");
            return 0;
        }
    }
    sleep(10);   // Attendez que les 4 threads se terminent
    for (i = 0; i < 4; i++)
    {
        // Bloquer le thread principal jusqu'à ce que les 4 threads se terminent
        flag = pthread_join(tids[i], &ans);
        if (flag != 0) {
            printf("tid=%d attente échouée !", tids[i]);
            return 0;
        }
    }
    return 0;
}

```

# Linux/C : Condition Variable (Variable Conditionnelle)

### Déclaration de la variable conditionnelle :

`pthread_cond_t cond;`

### Initialisation de la variable conditionnelle :

`int pthread_cond_init(pthread_cond_t *cond, const pthread_condattr_t *restrict attr);`

### Attente bloquante du thread pour un signal :

**Description de la fonction :**

Cette fonction permet au thread de s'endormir jusqu'à ce qu'une certaine condition soit remplie. Lors de l'appel de cette fonction, le thread doit détenir un verrou mutex. Pendant l'exécution de la fonction, le thread libérera d'abord le verrou mutex, puis entrera dans un état bloqué en attendant le signal de la variable conditionnelle.

`pthread_cond_wait()` doit être appelé entre `pthread_mutex_lock()` et `pthread_mutex_unlock()`. Lorsqu'elle est appelée, elle se bloque et libère le verrou mutex. Lorsqu'elle reçoit un signal émis par `pthread_cond_signal()`, `pthread_cond_wait()` reprend le verrou mutex et retourne.

**Définition de la fonction :**

`pthread_cond_wait(&cond1, &mutex1);`

**Valeur de retour :**

0 pour succès. Échec, retourne un code d'erreur non nul.

### Réveiller un thread bloqué :

**Description de la fonction :**

La fonction `pthread_cond_signal()` réveille un thread bloqué sur la variable conditionnelle après que celle-ci a été remplie. Lorsque la variable conditionnelle reçoit un signal, le thread récupère le verrou mutex, puis revient à l'état bloqué.

**Définition de la fonction :**

`int pthread_cond_signal(pthread_cond_t *cond);`

**Valeur de retour :**

0 pour succès. Échec, retourne un code d'erreur non nul.

# Linux/C : Socket

Le socket est un mécanisme de communication utilisé pour la communication entre différents processus sur la même machine ou entre des processus sur différentes machines. En C, les sockets peuvent être utilisés pour la programmation réseau, tels que les protocoles TCP/IP.

En bref, les sockets nous permettent de réaliser une communication entre les processus.

**Dépendances des fichiers d'en-tête :**

`#include <sys/socket.h>`

### Création d'un socket (sock()) :

**Définition de la fonction :**

`int socket(int domain, int type, int protocol);`

**Paramètres :**

domain : type de protocole

Types de protocoles courants :

| AF_INET | Protocole IPv4 |
| --- | --- |
| AF_INET6 | Protocole IPv6 |
| AF_UNIX | Protocole de domaine UNIX (sockets de domaine de fichier, sockets locaux) |

type : type de socket

| SOCK_STREAM | Interface socket de flux de bytes, pour la mise en place de TCP |
| --- | --- |
| SOCK_DGRAM | Interface socket de datagrammes, pour la mise en place de UDP |
| SOCK_RAW | Interface socket brute, permet d'accéder directement à des protocoles |

protocole:

En général, le troisième paramètre peut être laissé à sa valeur par défaut 0, qui correspondra au protocole par défaut en fonction des deux premiers paramètres.

**Valeur de retour:**

Retourne -1 si échec

Sinon, retourne un descripteur de fichier entier non négatif

Exemple:

`int socket = socket(AF_UNIX, SOCK_STREAM, 0);`

### Configuration de l'adresse du socket:

Pour chaque type de socket (AF_INET, AF_INET6, AF_UNIX), il existe une structure d'adresse correspondante.

Structure d'adresse pour AF_INET:

```c
struct sockaddr_in {
    short int sin_family;         // AF_INET
    unsigned short int sin_port;  // Numéro de port
    struct in_addr  sin_addr;     // Adresse IP
};

```

Structure d'adresse pour AF_INET6:

```c
struct sockaddr_in6 {
    sa_family_t     sin6_family;   // Famille d'adresses (AF_INET6)
    in_port_t       sin6_port;     // Numéro de port (16 bits, ordre des octets réseau)
    uint32_t        sin6_flowinfo; // Informations de flux IPv6
    struct in6_addr sin6_addr;     // Adresse IPv6
    uint32_t        sin6_scope_id; // ID de portée utilisé pour traiter les adresses IPv6 avec portée
};

```

Dépendances des structures pour IPv4 et IPv6:

```c
#include<netinet/in.h>

```

Structure d'adresse pour AF_UNIX:

```c
struct sockaddr_un {
    sa_family_t sun_family;     // AF_UNIX ou AF_LOCAL
    char sun_path[108];         // Chemin du socket Unix
};

```

Dépendances des structures pour Unix:

```c
#include<sys/un.h>

```

sun_path: Chemin du socket Unix. Dans un socket Unix, le chemin est un identifiant unique utilisé pour établir une communication entre deux processus sur la même machine. En d'autres termes, **`sun_path`** est un nom de chemin utilisé pour représenter le socket dans le système de fichiers local. Lors de la création d'un socket Unix, un fichier avec le nom de chemin spécifié par **`sun_path`** est créé dans le système de fichiers.

### Liaison du socket bind():

**Définition de la fonction:**

`int bind(int sockfd, const struct sockaddr *addr, socklen_t addrlen);`

**Paramètres:**

sockfd: Descripteur de fichier du socket

addr: Pointeur vers la structure d'adresse du protocole

addrlen: Longueur de l'adresse du socket spécifiée par le deuxième paramètre (la taille de la structure)

**Valeur de retour:**

Retourne 0 en cas de succès, -1 en cas d'erreur

### Écoute des connexions listen():

**Description de la fonction:**

Le descripteur de fichier de socket créé est de type actif (c'est-à-dire qu'il appelle activement connect pour se connecter à d'autres), mais après l'appel à listen, il devient actif et commence à écouter les connexions sur le descripteur de socket, attendant les connexions des utilisateurs.

**Définition de la fonction:**

`int listen(int sockfd, int backlog);`

**Paramètres:**

sockfd: Définit le descripteur de fichier

backlog: Nombre maximal de connexions dans la file d'attente.

Si une demande de connexion arrive et que la file d'attente est pleine, le socket du serveur refusera la demande de connexion.

**Valeur de retour:**

Retourne 0 en cas de succès

Retourne -1 en cas d'erreur

### Accepter les connexions accept():

Après l'appel à la fonction accept, le serveur restera bloqué en attendant une connexion client, puis renverra un **nouveau descripteur de fichier fd** qui représente la connexion TCP avec le client.

**Définition de la fonction:**

`int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);`

**Paramètres:**

sockfd: Le descripteur de fichier du socket créé précédemment à l'aide de la fonction sock()

addr: Utilisé pour recevoir l'adresse du client, si vous ne souhaitez pas modifier l'adresse, vous pouvez laisser NULL

addrlen: Doit pointer vers une variable de type **`socklen_t`**, qui sera utilisée pour stocker la taille de la structure d'adresse du client.

Pour éviter tout problème potentiel, je vous recommande de créer une variable **`socklen_t`** et de passer son adresse, plutôt que de forcer la conversion de **`sizeof(sockaddr_client)`**. Cela garantit la correction et la lisibilité du code.

**Valeur de retour:**

Retourne le socket du client

Retourne -1 en cas d'échec

### Connexion connect():

**Description de la fonction:**

Cette fonction est utilisée par le client pour se connecter au serveur.

**Définition de la fonction:**

`int connect(int sockfd, const struct sockaddr *addr, socklen_t addrlen);`

**Paramètres:**

sockfd: Le socket du client

addr: Pointeur vers la structure d'adresse du socket client

addrlen: Doit pointer vers une variable de type **`socklen_t`**, qui sera utilisée pour stocker la taille de la structure d'adresse du client.

**Valeur de retour:**

Retourne 0 en cas de succès

Retourne -1 en cas d'erreur

### Envoi et réception de chaînes:

**int** send(**int** sockfd, **const void** *buf**, size_t** len**, int** flags);
**int** recv(**int** sockfd, **const void** *buf**, size_t** len**, int** flags);

### Diagramme de flux de socket TCP:

![](/assets/blog/linux-c-system-func/Untitled.png)

# Linux/C : Sémaphore

**Dépendances des en-têtes:**

`#include<semaphore.h>`

### Déclaration d'un sémaphore:

**Description de la fonction:**

Définit une variable sémaphore qui représente un sémaphore.

**Définition:**

`sem_t semaphore;`

### Initialisation d'un sémaphore:

**Description de la fonction:**

Initialise un sémaphore. Le premier argument est un pointeur vers la variable sémaphore, le deuxième argument indique si le sémaphore est partagé entre les processus (0 pour non partagé, 1 pour partagé), le troisième argument est la valeur initiale du sémaphore, qui représente le nombre maximal de processus ou de threads pouvant accéder simultanément à la ressource.

**Définition de la fonction:**

`int sem_init(sem_t *sem, int pshared, unsigned int value);`

**Paramètres:**

sem: Pointeur vers la variable sémaphore

pshared: Indique si le sémaphore est partagé entre les processus, 0 pour non partagé, 1 pour partagé

value: Définit la valeur initiale du sémaphore

**Valeur de retour:**

Retourne 0 en cas de succès, 1 en cas d'erreur

### Décrémentation d'un sémaphore:

**Description de la fonction:**

Décrémente la valeur d'un sémaphore de manière atomique. Si la valeur du sémaphore est supérieure à 0, elle est décrémentée de 1. Si la valeur du sémaphore est 0, l'appel de cette fonction bloque le thread ou le processus appelant jusqu'à ce que la valeur du sémaphore soit supérieure à 0.

**Définition de la fonction:**

`int sem_wait(sem_t* sem);`

**Paramètres:**

sem: Pointeur vers le sémaphore à manipuler

**Valeur de retour:**

Retourne 0 en cas de succès, -1 en cas d'erreur

### Incrémentation d'un sémaphore:

**Description de la fonction:**

Incrémente la valeur d'un sémaphore de manière atomique. Cette fonction incrémente la valeur du sémaphore de 1. Si des threads ou des processus étaient bloqués en attente de l'opération de décrémentation, cette fonction leur donne une chance de reprendre l'exécution.

**Définition de la fonction:**

`int sem_post(sem_t* sem);`

**Paramètres:**

sem: Pointeur vers le sémaphore à manipuler

**Valeur de retour:**

Retourne 0 en cas de succès, -1 en cas d'erreur

### Obtention de la valeur actuelle d'un sémaphore:

**Définition de la fonction:**

`int sem_getvalue(sem_t *sem, int *sval);`

**Paramètres:**

sem: Pointeur vers le sémaphore à interroger

sval: Pointeur vers une variable entière utilisée pour stocker la valeur actuelle du sémaphore

**Valeur de retour:**

Retourne 0 en cas de succès, -1 en cas d'erreur

### Autres fonctions:

`int sem_trywait(sem_t* sem);`

- La fonction sem_trywait() fonctionne de la même manière que sem_wait(), sauf que si la valeur du sémaphore est 0, sem_trywait() ne bloquera pas le thread appelant, mais renverra immédiatement -1.

`int sem_destroy(sem_t* sem);`

- La fonction sem_destroy() est utilisée pour détruire manuellement un sémaphore.

### Remarque pour MacOS:

Les fonctions **`sem_init`** et **`sem_destroy`** sont marquées comme obsolètes (deprecated) sur MacOS, c'est pourquoi vous obtenez un avertissement lors de la compilation. Sur MacOS, il est recommandé d'utiliser les fonctions **`sem_open`** et **`sem_close`** pour créer et fermer les sémaphores nommés, au lieu d'utiliser **`sem_init`** et **`sem_destroy`**.

Cependant, même si **`sem_init`** et **`sem_destroy`** sont marquées comme obsolètes sur MacOS, ce code fonctionnera toujours sur d'autres systèmes Unix-like (comme Linux) sans avertissement.

### Exemple:

```c
#include<stdlib.h>
#include<stdio.h>
#include<pthread.h>
#include<semaphore.h>
#include<unistd.h>

#define NB_CLIENT 100
#define NB_PLACE 10
#define NB_ENTIERS 1000

sem_t sem;

typedef struct{
    int entier[NB_ENTIERS];
}panneau;

void* client(void * args){
    panneau* p = (panneau*) args;

    sem_wait(&sem);
    int position = rand() % NB_ENTIERS;
    printf("Je lis la case %d\\n", position);
    sleep(1);
    printf("La case contient %d\\n", p->entier[position]);
    sem_post(&sem);

    pthread_exit(NULL);
}

int main(){

    pthread_t th[NB_CLIENT];
    panneau p = {0};

    for(int i = 0; i < NB_ENTIERS;i++){
        p.entier[i] = rand()%10;
    }

    if(sem_init(&sem, 0, NB_PLACE) != 0){
        printf("Erreur lors de l'initialisation du sémaphore\\n");
        exit(1);
    }

    for(int i = 0;i < NB_CLIENT; i++){
        if(pthread_create(&th[i], NULL, client, (void*)&p) != 0){
            perror("Erreur lors de la création du thread\\n");
            exit(1);
        }
    }

    for(int i = 0; i < NB_CLIENT;i++){
        if(pthread_join(th[i], NULL) != 0){
            perror("Erreur lors de l'attente du thread\\n");
            exit(1);
        }
    }

    sem_destroy(&sem);
    exit(0);
}

```

# Linux/C : Mémoire partagée

La mémoire partagée (shared memory) sous Linux est un mécanisme de communication interprocessus (IPC) qui permet à plusieurs processus d'accéder et de manipuler la même région mémoire. La mémoire partagée est l'une des méthodes les plus rapides de communication interprocessus, car elle permet aux processus d'accéder directement à la même adresse mémoire, sans aucune transmission de données. La région de mémoire partagée est mappée dans l'espace d'adressage du processus lors de sa création, ce qui permet au processus de manipuler directement cette région.

**Dépendances des en-têtes:**

`#include<sys/shm.h>`

### Création de la mémoire partagée avec **shmget():**

**Description de la fonction:**

Cette fonction est utilisée pour créer un nouveau segment de mémoire partagée ou récupérer un segment de mémoire partagée existant.

**Définition de la fonction:**

`int shmget(key_t key, size_t size, int shmflg);`

**Paramètres:**

key: Clé du segment de mémoire partagée, utilisée pour identifier de manière unique le segment de mémoire partagée.

size: Taille du segment de mémoire partagée (en octets).

shmflg: Indicateurs pour la création et les autorisations d'accès. Ces indicateurs incluent généralement IPC_CREAT (pour créer un nouveau segment de mémoire partagée) et les autorisations d'accès (par exemple, 0600, 0666).

IPC_CREAT: Crée un nouveau segment de mémoire partagée.

IPC_EXCL: Utilisé avec IPC_CREAT, indique que si le segment de mémoire partagée à créer existe déjà, une erreur est renvoyée.

IPC_NOWAIT: Utilisé lors de la lecture/écriture de la mémoire partagée pour spécifier que le processus ne doit pas être bloqué si les conditions requises pour la lecture/écriture de la mémoire partagée ne sont pas remplies.

0: Si un fichier est ouvert et qu'il existe déjà, écrire 0.

Le troisième argument de la fonction **`shmget`** est un indicateur d'autorisation utilisé pour définir les autorisations d'accès au segment de mémoire partagée. Les autorisations 0600 et 0666 sont toutes deux des indicateurs d'autorisation exprimés en octal.

- 0600: Ces autorisations indiquent que le créateur du segment de mémoire partagée (propriétaire) a des autorisations de lecture (read) et d'écriture (write), tandis que les autres utilisateurs (groupe et autres) n'ont aucune autorisation. Chaque chiffre dans le nombre octal représente une autorisation différente, le premier chiffre représente les autorisations du propriétaire du fichier, le deuxième chiffre représente les autorisations des autres utilisateurs du même groupe, et le troisième chiffre représente les autorisations des autres groupes. En particulier, **`6`** représente les autorisations de lecture et d'écriture (4 représente la lecture, 2 représente l'écriture, donc 4 + 2 = 6), et **`0`** représente aucune autorisation.
- 0666: Ces autorisations indiquent que le créateur du segment de mémoire partagée (propriétaire), les autres utilisateurs du même groupe (groupe) et les autres groupes d'utilisateurs (autres) ont tous des autorisations de lecture (read) et d'écriture (write). Ici, les trois **`6`** représentent toutes les autorisations de lecture et d'écriture.

Ces autorisations sont similaires aux autorisations utilisées dans le système de fichiers Unix pour contrôler l'accès des utilisateurs à un segment de mémoire partagée. Veuillez noter que ces autorisations doivent être combinées avec le dernier argument de **`shmget`** (généralement **`IPC_CREAT`** ou **`IPC_CREAT | IPC_EXCL`**) à l'aide de l'opérateur de combinaison de bits (|) pour créer ou ouvrir le segment de mémoire partagée.

**Valeur de retour:**

Elle renvoie un identifiant de segment de mémoire partagée (shmID) qui est utilisé pour référencer le segment de mémoire partagée.

En cas d'erreur, elle renvoie -1.

### Attachement du segment de mémoire partagée avec **shmat()**

**Description de la fonction:**

Cette fonction est utilisée pour attacher le segment de mémoire partagée à l'espace d'adressage du processus appelant.

**Définition de la fonction:**

`void *shmat(int shmid, const void *shmaddr, int shmflg);`

**Paramètres:**

shmid: Valeur renvoyée par shmget(), identifiant le segment de mémoire partagée alloué par le système d'exploitation. Il est utilisé pour spécifier le segment de mémoire partagée à attacher au processus actuel.

shmaddr: Pointeur spécifiant l'emplacement dans l'espace d'adressage du processus pour attacher le segment. En général, il est défini sur NULL et le noyau choisit une adresse.

shmflg: Indicateur utilisé pour spécifier les options d'attachement.

0: Aucune option spéciale.

SHM_RDONLY: Indique que l'attachement est utilisé en tant que segment de mémoire partagée en lecture seule.

Autres indicateurs pour le mode de lecture/écriture.

**Valeur de retour:**

En cas de succès, elle renvoie un pointeur vers le segment de mémoire partagée, qui représente l'adresse de début du segment de mémoire partagée dans l'espace d'adressage actuel.

En cas d'erreur, elle renvoie -1.

### Détachement du segment de mémoire partagée avec **shmdt()**

**Description de la fonction:**

Cette fonction est utilisée pour détacher le segment de mémoire partagée du processus actuel. Veuillez noter que le détachement du segment de mémoire partagée ne le supprime pas, il le rend simplement indisponible pour le processus actuel. Son prototype est le suivant :

**Définition de la fonction:**

`int shmdt(const void *shmaddr);`

**Paramètres:**

shmaddr: Pointeur d'adresse renvoyé par la fonction shmat(),

**Valeur de retour:**

En cas de succès, elle renvoie 0.

En cas d'erreur, elle renvoie -1.

### Contrôle du segment de mémoire partagée avec **shmctl()**

**Description de la fonction:**

**Définition de la fonction:**

`int shmctl(int shmid, int cmd, struct shmid_ds *buf);`

**Paramètres:**

shmid: Identifiant de segment de mémoire partagée renvoyé par la fonction shmget().

cmd:

- IPC_STAT: Met à jour la structure shmid_ds avec les valeurs actuelles du segment de mémoire partagée, remplace les valeurs actuelles par les valeurs actuelles du segment de mémoire partagée.
- IPC_SET: Modifie les valeurs actuelles du segment de mémoire partagée avec les valeurs spécifiées dans la structure shmid_ds, si le processus a les autorisations appropriées.
- IPC_RMID: Supprime le segment de mémoire partagée.

buf: Pointeur de structure pointant vers les modes d'accès et les autorisations du segment de mémoire partagée.

### **Exemple:**

Créez un espace mémoire et écrivez dedans

```c
#include <stdlib.h>
#include <stdio.h>
#include <sys/shm.h>

#define NB_MAX 10
typedef struct
{
    char text[NB_MAX];
    int tableau[NB_MAX];
} MEM_TAB;

int main()
{
    MEM_TAB *pointeur;
    int shmid;
    // Crée le segment de mémoire partagée
    if ((shmid = shmget(1234, sizeof(MEM_TAB), IPC_CREAT | 0600)) == -1)
        perror("erreur\\n");

    if ((pointeur = (MEM_TAB *)shmat(shmid, NULL, 0)) == NULL) // Attache le segment de mémoire partagée
        perror("erreur\\n");

    scanf("%s", pointeur->text);
    pointeur->tableau[0] = 10;

    if (shmdt(pointeur) == -1)
        perror("erreur\\n");

}

```

Connectez-vous à un espace partagé et lisez-le

```c
#include <stdlib.h>
#include <stdio.h>
#include <sys/shm.h>
#define NB_MAX 10

typedef struct
{
    char text[NB_MAX];
    int tableau[NB_MAX];
} MEM_TAB;

int main()
{
    MEM_TAB *pointeur;
    int shmid;
    if ((shmid = shmget(1234, sizeof(MEM_TAB), IPC_CREAT | 0600)) == -1)
        perror("erreur\\n");
    if ((pointeur = (MEM_TAB *)shmat(shmid, NULL, 0)) == NULL)
        perror("erreur\\n");
    printf("%s - %d\\n", pointeur->text, pointeur->tableau[0]);
    // Détache le segment de mémoire partagée
    if (shmdt(pointeur) == -1)
        perror("erreur\\n");
    // Détruit le segment de mémoire partagée (lorsque le dernier lien est détaché)
    if (shmctl(shmid, IPC_RMID, 0) == -1)
        perror("erreur\\n");
}

```
