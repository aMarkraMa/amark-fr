---
title: Adresse IPv4
description: "Une adresse IPv4 comprend une partie réseau et une partie hôte. La partie réseau indique le réseau sur lequel l'appareil est situé, tandis que la partie hôte désigne un appareil spécifique au sein du…"
image: /assets/blog/ipv4-adresse/cover.webp
createdAt: 2021-03-03
updatedAt: 2021-03-03
---

## Intro

Une adresse IPv4 comprend une partie réseau et une partie hôte. La partie réseau indique le réseau sur lequel l'appareil est situé, tandis que la partie hôte désigne un appareil spécifique au sein du réseau. Pour distinguer ces deux parties, il est nécessaire de connaître la classe de l'adresse.

Dans les adresses IPv4, il y a cinq classes (A, B, C, D et E), mais habituellement, nous utilisons seulement trois d'entre elles (A, B et C). Ces trois classes d'adresses ont des parties réseau et hôte de longueurs différentes, pour répondre aux besoins des réseaux de différentes échelles.

- Classe A (0) : la partie réseau est de 8 bits et la partie hôte de 24 bits. Le premier bit est 0, donc la plage d'adresses de classe A va de 1.0.0.0 à 126.255.255.255.
- Classe B (10) : la partie réseau est de 16 bits et la partie hôte de 16 bits. Les deux premiers bits sont 10, donc la plage d'adresses de classe B va de 128.0.0.0 à 191.255.255.255.
- Classe C (110) : la partie réseau est de 24 bits et la partie hôte de 8 bits. Les trois premiers bits sont 110, donc la plage d'adresses de classe C va de 192.0.0.0 à 223.255.255.255.
- Classe D (1110) est une catégorie spéciale d'adresses, appelées adresses de multicast. Les adresses de multicast sont utilisées pour envoyer des données d'un émetteur à plusieurs récepteurs. Les quatre premiers bits d'une adresse de classe D sont 1110, et sa plage va de 224.0.0.0 à 239.255.255.255.

## **Masque de sous-réseau**

Le masque de sous-réseau est un nombre binaire de 32 bits associé à une adresse IP, qui sert à distinguer la partie réseau de la partie hôte de l'adresse IP. Le rôle du masque de sous-réseau est d'aider l'appareil à déterminer si l'adresse IP de destination se trouve sur le même sous-réseau, et donc de décider si le paquet de données doit être envoyé directement à l'appareil de destination ou doit être transmis par une passerelle (routeur).

Dans un masque de sous-réseau, les bits de la partie réseau sont tous 1 et ceux de la partie hôte sont tous 0. Lorsque nous effectuons une opération ET binaire entre une adresse IP et un masque de sous-réseau, nous obtenons l'adresse réseau. Par exemple, si l'adresse IP de l'appareil est 192.168.1.10 et que le masque de sous-réseau est 255.255.255.0, l'opération ET binaire donne l'adresse réseau : 192.168.1.0.

Maintenant, expliquons plus en détail la signification du masque de sous-réseau :

1. Distinguer la partie réseau et la partie hôte : le rôle principal du masque de sous-réseau est de diviser l'adresse IP en une partie réseau et une partie hôte. Cela aide les appareils à identifier quelles adresses IP se trouvent sur le même sous-réseau. Par exemple, si deux appareils ont la même adresse réseau après avoir appliqué le même masque de sous-réseau, alors ces deux appareils se trouvent sur le même sous-réseau.
2. Déterminer la méthode d'envoi des paquets de données : le masque de sous-réseau aide à déterminer comment les paquets de données doivent être envoyés. Si l'adresse IP de destination est sur le même sous-réseau, l'appareil enverra directement le paquet de données à l'appareil de destination ; si l'adresse IP de destination n'est pas sur le même sous-réseau, l'appareil devra envoyer le paquet de données à une passerelle (routeur), qui transmettra ensuite le paquet à l'appareil de destination.
3. Personnaliser la division des sous-réseaux : le masque de sous-réseau peut également être utilisé pour personnaliser la division des sous-réseaux, c'est-à-dire diviser un réseau plus grand en plusieurs sous-réseaux plus petits. Cela peut améli

![Untitled](/assets/blog/ipv4-adresse/Untitled.png)

### **Notation CIDR**

La notation CIDR (Classless Inter-Domain Routing, Routage inter-domaine sans classe) est une méthode de représentation des adresses IP qui transcende la traditionnelle classification en classes A, B et C. Elle permet une personnalisation plus flexible du masque de sous-réseau pour répondre aux besoins de différents réseaux.

Pour simplifier la représentation des masques de sous-réseau, on peut utiliser la notation CIDR.

La notation CIDR combine l'adresse IP et le masque de sous-réseau en une représentation concise. Elle est composée de l'adresse IP, d'une barre oblique (/) et du nombre de bits à 1 dans le masque de sous-réseau en notation binaire. Cette méthode de représentation nous permet d'exprimer un réseau et son masque de sous-réseau de manière plus pratique.

Par exemple, supposons que nous ayons une adresse réseau 192.168.0.0 avec un masque de sous-réseau de 255.255.0.0. La représentation binaire du masque de sous-réseau est : 11111111.11111111.00000000.00000000. Dans ce masque, il y a 16 bits à 1. Par conséquent, nous pouvons représenter ce réseau et son masque de sous-réseau en notation CIDR comme suit : 192.168.0.0/16. Le “/16” indique que 16 bits du masque de sous-réseau sont à 1.

L'avantage de la notation CIDR est sa clarté et sa simplicité, ce qui facilite la compréhension rapide des réseaux et de leurs subdivisions. Elle permet une division de sous-réseaux en fonction des besoins réels et n'est pas restreinte par la classification traditionnelle en classes d'adresses, ce qui permet une allocation d'espace d'adresses IP plus flexible.

### **Deux adresses spéciales :**

Si l'adresse de l'hôte est **toute à 0** : il s'agit de l'**adresse réseau**

Par exemple : 192.168.1.**0 (les huit derniers bits de l'adresse de l'hôte sont 0000 0000)**

Si l'adresse de l'hôte est **toute à 1** : il s'agit de l'**adresse de diffusion (broadcast)**

Par exemple : 192.168.1.**255 (les huit derniers bits de l'adresse de l'hôte sont 1111 1111)**

Ces deux adresses ne peuvent pas être utilisées, et quand nous calculons le nombre d'adresses IP qui peuvent être attribuées, nous devons les exclure.
