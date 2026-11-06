---
title: "Annuler un changement de sécurité sur Linux, et se sortir d'un verrouillage"
description: "Prenez un instantané avant chaque changement, revenez en arrière depuis l'Historique, voyez pourquoi les changements réseau attendent confirmation, et récupérez quand une règle vous a enfermé dehors."
slug: "undo-a-security-change"
date: 2026-11-06
updated: 2026-11-06
tags: [annulation, récupération, sécurité]
related_hardening: [kernel.kexec, net.rp-filter]
faq:
  - q: "Comment annuler un changement de pare-feu ou de DNS qui a cassé mon réseau ?"
    a: "Depuis un terminal local ou la console, listez les changements récents et annulez le dernier. Si vous l'avez fait avec IbexWall et ne l'avez pas confirmé à temps, il revient tout seul."
  - q: "Et si je suis enfermé hors d'une machine distante ?"
    a: "Un changement qui peut couper le réseau attend votre confirmation et revient si vous ne confirmez pas. Avec d'autres outils, utilisez la console de l'hébergeur, ou un démarrage de secours, pour retirer la règle."
---

La meilleure protection contre un mauvais changement, c'est de pouvoir le reprendre. Avant d'éditer un pare-feu, un réglage DNS ou un paramètre du noyau, sauvegardez ce qui est là maintenant, changez une seule chose, testez-la, et gardez une voie de retour qui ne dépend pas de la chose que vous changez. Cet article couvre l'habitude, et la façon dont IbexWall le fait pour vous.

## Pourquoi l'instantané vient d'abord

La plupart des changements de sécurité sont de petites éditions de fichiers : une ligne dans `/etc/sysctl.d`, un drop-in pour SSH, un jeu de règles nftables. Si vous copiez l'ancien fichier d'abord, annuler est une recopie. Quand le changement touche plusieurs choses à la fois, une erreur sur l'une rend difficile de se rappeler les autres.

À la main, le minimum est :

```sh
sudo cp -a /etc/ssh/sshd_config.d /root/sshd_config.d.bak
```

Éditez, testez, et seulement ensuite fermez votre ancienne session. Pour le pare-feu, l'ordre sûr est d'ouvrir un second terminal, d'appliquer la règle, de vérifier que vous pouvez encore vous connecter avec une nouvelle connexion, et de garder le premier terminal ouvert jusque-là.

## Les changements qui peuvent vous couper

Certains changements retirent le chemin par lequel vous joigniez la machine : une règle de pare-feu qui bloque le port SSH, un réglage DNS qui pointe vers un résolveur injoignable, un kill switch de VPN, une règle qui isole l'hôte. Le danger n'est pas le changement, c'est de ne pas pouvoir le corriger d'où vous êtes.

IbexWall traite ces cas différemment. Un changement signalé comme risque réseau attend que vous le confirmiez, par défaut dans les 60 secondes. Si vous ne confirmez pas, parce que la connexion est perdue ou la page ne répond plus, il revient de lui-même. C'est le but : l'annulation n'a pas besoin de vous. Si le démon lui-même s'arrête en cours de route, au redémarrage il annule un changement qui était en cours d'application ou en attente de confirmation.

Vous confirmez depuis l'interface, ou en ligne de commande :

```sh
ibexctl confirm <transaction-id>
```

## Annuler depuis l'Historique

Chaque changement qu'IbexWall applique prend d'abord un instantané. L'écran Historique les liste tous, et annuler l'un d'eux restaure ce qui était là. La même chose depuis un terminal :

```sh
ibexctl history
ibexctl rollback <transaction-id>
```

Certains changements ne sont pas entièrement réversibles, et IbexWall le dit avant que vous les appliquiez. Par exemple, [interdire de charger un autre noyau](/fr/hardening/kernel.kexec/) ne s'annule qu'au prochain démarrage. D'autres peuvent casser une configuration précise, comme [jeter les paquets à adresse d'expéditeur forgée](/fr/hardening/net.rp-filter/), qui ne convient pas à certains VPN et machines à plusieurs routes. Le plan montre ces avertissements d'abord.

## Récupérer quand vous êtes enfermé dehors

Si vous avez utilisé d'autres outils, ou que l'annulation automatique n'a pas suffi, travaillez depuis l'endroit le plus proche où vous gardez le contrôle.

1. Machine locale : passez sur une console texte avec Ctrl+Alt+F3, ou utilisez le bureau réseau coupé. Vous n'avez pas besoin du réseau pour lancer une commande locale.
2. Serveur virtuel : utilisez la console web de l'hébergeur, qui ne passe pas par le réseau que vous avez cassé.
3. Retirez la cause. Pour les règles de pare-feu d'IbexWall, `ibexctl rollback` est la voie. En dernier recours, sa table peut être supprimée, car c'est une table séparée qui ne contient que ses propres règles : `sudo nft delete table inet ibexwall`. Ne supprimez pas des tables que vous n'avez pas créées.
4. Pour un fichier sysctl, retirez-le de `/etc/sysctl.d/` et remettez l'ancienne valeur avec `sysctl -w`.
5. Si rien ne démarre, démarrez un système live ou l'entrée de récupération, montez le système de fichiers racine, et restaurez votre copie du fichier.

Ensuite, découvrez pourquoi cela a échoué avant de réessayer. Souvent, c'était un détail inattendu, comme une seconde interface réseau.

## Garder une trace

Une règle de bon sens qui marche pour les gens et pour les outils : notez ce que vous avez changé, pourquoi, et comment le défaire. L'Historique d'IbexWall le garde, et chaque entrée est écrite dans un journal d'audit dont les lignes sont chaînées, de sorte qu'une modification d'anciennes lignes se détecte (`ibexctl audit verify`).

## Vérifiez avec IbexWall

L'écran Historique liste les changements et les annule, et `ibexctl history` et `ibexctl rollback` font pareil depuis un terminal. Chaque changement est un plan que vous relisez d'abord, avec un instantané à restaurer, et les changements à risque réseau attendent votre confirmation ou reviennent d'eux-mêmes. Le mode d'urgence (endpoint.isolate), qui coupe le réseau sauf les adresses que vous nommez, s'annule aussi depuis l'Historique. La version 1.0 est en préparation.
