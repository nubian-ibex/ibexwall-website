---
title: "Pourquoi un outil de sécurité ne doit rien renvoyer chez lui, et comment vérifier"
description: "Un outil de sécurité voit vos ports, vos applis et vos journaux, donc il ne doit jamais téléphoner chez lui. Voici ce qu'IbexWall envoie, c'est-à-dire rien, et comment le vérifier vous-même."
slug: "no-telemetry-in-a-security-tool"
date: 2026-11-06
updated: 2026-11-06
tags: [vie-privée, télémétrie, confiance]
related_hardening: []
faq:
  - q: "IbexWall envoie-t-il des données à ses auteurs ?"
    a: "Non. Pas de télémétrie, pas d'analytics, pas de compte. Le trafic réseau n'existe que quand vous le demandez, comme une requête DNS que vous faites ou une mise à jour de paquets que vous lancez."
  - q: "Comment vérifier qu'un programme n'envoie rien ?"
    a: "Regardez ses connexions avec ss ou une capture de paquets pendant qu'il tourne, ou posez une règle de pare-feu qui bloque son trafic sortant et constatez que rien ne casse."
---

Un outil de sécurité lit des choses que la plupart des programmes ne voient jamais : quels services écoutent sur votre machine, quels programmes se connectent où, quels comptes existent, ce que disent vos journaux. Si un tel outil renvoyait aussi chez lui, même de façon anonyme « sans danger », ce serait une carte de votre système qui quitte les lieux. La règle est donc simple : il ne doit rien envoyer, sauf si vous le demandez. IbexWall suit cette règle. Pas de télémétrie, pas d'analytics, pas de compte, et pas d'appel au serveur de l'auteur.

## Pourquoi cela compte davantage ici

Dans une app ordinaire, la télémétrie dit aux auteurs quel bouton est cliqué. Dans un outil de sécurité, le même canal transporterait des faits comme « cet ordinateur a un port SSH ouvert et un noyau ancien ». Ce genre de données est utile à la seule personne qui ne devrait pas les avoir. Les anonymiser est difficile, car les détails de machine sont souvent assez uniques pour vous identifier. Le design sûr le plus simple est de ne pas collecter.

Il y a aussi la confiance. Un outil qui demande root, lit l'état du système et applique des changements doit la mériter. « Rien ne quitte la machine » est une affirmation qu'on peut tester, ce qui vaut mieux qu'une politique de confidentialité à laquelle il faut croire.

## Ce qu'IbexWall envoie

Rien de lui-même. Les cas où du trafic existe sont ceux que vous provoquez :

- Une requête DNS que vous faites. Si vous utilisez l'écran DNS sécurisé, le résolveur transmet vos requêtes au serveur amont que vous avez choisi, parce que c'est son travail.
- Une mise à jour de paquets que vous lancez avec votre gestionnaire.
- Une connexion d'assistant à distance, si vous l'activez. Le serveur MCP n'accepte de connexions que par TLS et seulement quand vous activez l'option distante.
- Des téléchargements que vous demandez, comme les listes de blocage du filtre DNS.

La vérification des vulnérabilités connues fonctionne hors ligne, depuis le cache du gestionnaire de paquets. Rien n'est envoyé nulle part à cause d'elle.

## Comment vérifier vous-même

Vous n'avez pas à nous croire sur parole, et ce n'est pas nécessaire. Voici trois voies.

Listez les connexions d'un programme à l'instant :

```sh
sudo ss -tupn | grep -i ibex
```

Regardez la vraie interface réseau pendant que vous l'utilisez (trouvez son nom avec `ip -br link`) :

```sh
sudo tcpdump -ni wlan0 -w ibex.pcap
```

Ouvrez le fichier ensuite avec `tcpdump -nr ibex.pcap` ou Wireshark et cherchez les destinations que vous ne reconnaissez pas. N'oubliez pas que vos autres programmes parlent aussi, donc filtrez par le moment où vous avez utilisé IbexWall et par ce que vous avez fait.

Le test le plus fort est une règle. Créez une règle de pare-feu qui bloque le trafic sortant de l'utilisateur du programme, ou de toute la machine, utilisez l'outil, et constatez qu'il marche encore. Les fonctions qui ont besoin du réseau par nature, comme un serveur DNS amont, s'arrêteront bien sûr.

L'écran Applis et réseau d'IbexWall montre quel programme parle à quelle destination, donc il peut aussi rendre compte de lui-même et de tout le reste de votre machine.

## Ce qu'il faut demander à n'importe quel outil

Les mêmes questions valent pour tout programme que vous installez, outil de sécurité ou non. A-t-il besoin d'un compte ? Dit-il ce qu'il envoie et quand ? Continue-t-il de fonctionner réseau coupé ? Pouvez-vous lire le code source ou au moins inspecter le trafic ? Y a-t-il un interrupteur d'arrêt qui est respecté ? Un outil qui ne répond pas à cela clairement vous a déjà dit quelque chose.

## L'autre télémétrie de votre système

Votre distribution et certaines de vos applis peuvent envoyer des rapports d'usage. C'est une affaire à part de l'outil de sécurité, et cela peut vous importer ou non. Le plugin Télémétrie (privacy.telemetry) liste ce qu'il trouve pour que vous décidiez, et il ne fait que lister. Pour l'habitude plus large de vérifier, voyez [l'auto-vérification en dix minutes](/fr/articles/how-secure-is-my-linux-computer/).

## Ce qui va avec

L'open source aide ici. Le code est sur GitHub sous GPL-3.0-or-later, donc chacun peut lire comment l'accès réseau est utilisé, et les versions prévoient de livrer des sommes de contrôle, des signatures, un SBOM et une déclaration de provenance. La première version n'est pas encore publiée.

## Vérifiez avec IbexWall

Ouvrez Applis et réseau pour voir les connexions de chaque programme, et Plugins pour lire ce que chaque plugin peut lire et modifier. Tout changement est un plan que vous relisez, avec un instantané et une annulation dans l'Historique. La version 1.0 est en préparation.
