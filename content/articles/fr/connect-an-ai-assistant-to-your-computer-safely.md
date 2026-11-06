---
title: "Connecter un assistant IA à votre ordinateur Linux en sécurité"
description: "Ce qu'est MCP, ce qu'un assistant IA peut lire, planifier et proposer avec IbexWall (jamais appliquer), le rôle des clés et des préréglages, et les risques."
slug: "connect-an-ai-assistant-to-your-computer-safely"
date: 2026-11-06
updated: 2026-11-06
tags: [mcp, ia, contrôle d'accès]
related_hardening: []
faq:
  - q: "Qu'est-ce que MCP ?"
    a: "Le Model Context Protocol est une manière standard pour un assistant IA d'appeler les outils qu'un programme propose, comme lire un état ou récupérer un rapport."
  - q: "Un assistant IA peut-il modifier mon système via IbexWall ?"
    a: "Non. Il peut lire l'état, expliquer les constats et proposer un changement. Une personne doit approuver une proposition, et l'assistant n'a aucun outil pour appliquer, approuver ou annuler quoi que ce soit."
---

Vous pouvez laisser un assistant IA lire l'état de sécurité de votre ordinateur et suggérer des correctifs, sans le laisser rien changer. C'est ainsi que la connexion d'assistant d'IbexWall est conçue : l'assistant lit, planifie et propose, et vous décidez. Aucun outil ne lui permet d'appliquer un changement.

## Ce qu'est MCP

Le Model Context Protocol (MCP) est un standard qui permet à un assistant IA d'appeler les outils offerts par un autre programme. Un assistant de programmation comme Claude Code, OpenCode ou un éditeur compatible MCP lance ou joint un serveur MCP, apprend la liste des outils et les appelle quand il en a besoin. Voyez cela comme un menu : c'est le serveur qui décide de ce qui y figure.

Le serveur MCP d'IbexWall (`ibexwall-mcp`) s'exécute sous votre utilisateur, pas sous root. Il offre neuf outils. Certains lisent : l'état du système, les constats, l'explication d'un constat, les événements, quelles applications se sont connectées où, le lancement d'une vérification. Un montre ce qu'un correctif ferait sans le mettre en file d'attente (une simulation). Un crée une proposition.

## Ce qu'un assistant peut faire

- Lire votre score de sécurité et la liste des constats.
- Expliquer un constat en termes simples.
- Lancer une vérification et consulter les événements récents.
- Montrer ce qu'un changement donné ferait, sous forme de simulation.
- Créer une proposition : un plan de changement, en attente dans une file.

## Ce qu'il ne peut pas faire

- Appliquer, approuver, annuler ou rejeter quoi que ce soit. Ces outils n'existent pas, et le système d'exploitation le garantit : polkit n'autorise pas ces actions à l'utilisateur sous lequel tourne un assistant.
- Modifier ses propres permissions ou une politique quelconque.
- Voir les comptes système, les disques ou les périphériques gérés. Cela reste fermé à tous les clients.

Une proposition apparaît sur l'écran Assistant. Vous voyez les opérations réelles que le changement effectuerait, les propres mots de l'assistant dans une citation signalée comme écrite par l'IA et non vérifiée, et ce qui pourrait casser. Vous approuvez ou rejetez. Si le plan a changé entre la proposition et votre approbation, l'approbation est refusée. Un changement approuvé passe par le point de restauration habituel, donc l'Historique peut l'annuler. Une proposition qui ne pourrait pas être annulée est refusée dès sa création.

## Préréglages et clés

L'accès se choisit parmi des préréglages : lire, planifier ou proposer. Lire ne voit que l'état et les constats. Planifier peut aussi lancer des simulations. Proposer peut aussi mettre une proposition en file. Un client qui n'est pas nommé dans la configuration n'obtient que l'état du système et les constats, à faible cadence.

Un assistant sur le même ordinateur exige que votre utilisateur soit dans le groupe `ibexwall-assistants`. Pour un assistant sur une autre machine, IbexWall peut proposer une connexion en HTTPS avec un jeton. Vous créez le jeton dans IbexWall, vous le nommez, vous lui donnez un préréglage et, si vous voulez, une date d'expiration. Le secret n'est affiché qu'une fois, seule une empreinte est conservée, et le jeton n'apparaît dans aucun journal. Gardez-le dans une variable d'environnement sur le client plutôt que dans un fichier que vous versez dans un dépôt.

## Les risques à connaître

Soyez honnête avec vous-même sur ces points.

- Tout ce que le préréglage autorise est envoyé au modèle que vous connectez. Les valeurs privées sont remplacées par des pseudonymes stables (noms d'utilisateurs et de machines, noms de réseaux, adresses matérielles et privées ; les dossiers personnels deviennent `~`), mais cette expurgation réduit le risque sans rendre confidentiel un modèle distant. Pour la meilleure confidentialité, utilisez un modèle qui tourne sur votre machine.
- Un assistant peut être induit en erreur par un texte qu'il lit, comme un nom de processus ou une ligne de journal. IbexWall marque le texte externe comme donnée non fiable, et la conception fait qu'un assistant trompé peut au pire mettre en file une proposition que vous pouvez rejeter. Il peut néanmoins vous dire des choses trompeuses, donc lisez vous-même ce qu'il propose.
- Un jeton volé fonctionne jusqu'à ce que vous le supprimiez ou qu'il expire. Fixez une expiration et révoquez les jetons que vous n'utilisez plus.
- Chaque appel est écrit dans un journal de votre propre répertoire avant son exécution, chaque ligne étant chaînée à la précédente pour que les modifications soient détectables. Le même utilisateur peut cependant supprimer le fichier entier.

## Vérifier avec IbexWall

Ouvrez Connecter une IA pour configurer l'accès, ou lancez `ibexctl mcp config claude-code` (aussi `opencode` et `vscode`) pour obtenir l'extrait à coller dans votre assistant. Le plugin Assistants IA (system.assistant) contrôle ce qu'il peut lire, planifier ou proposer. Activer ou désactiver l'accès est un plan que vous examinez, et l'Historique peut l'annuler. La version 1.0 est en préparation. Commencez sans accès distant, et pensez à ce que [votre outil envoie ailleurs](/fr/articles/no-telemetry-in-a-security-tool/) avant de l'élargir.
