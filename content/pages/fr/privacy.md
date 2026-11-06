---
title: "Confidentialité"
description: "IbexWall n'a ni télémétrie, ni compte, ni statistiques d'usage. Ce qu'il stocke sur votre ordinateur, ce que le résolveur enregistre, et comment vérifier que rien ne sort."
updated: 2026-11-06
---

IbexWall ne collecte aucune donnée sur vous ni sur votre ordinateur. Il n'y a ni télémétrie, ni compte, ni statistiques d'usage, ni vérification de mise à jour qui contacte quelqu'un. Ce site n'utilise aucun cookie, aucun outil de mesure d'audience et aucune requête vers des tiers ; ses polices et ses images sont servies depuis la même adresse que les pages.

## Ce qui reste sur votre ordinateur

- L'état du programme (plans, Historique, journal d'audit) se trouve dans `/var/lib/ibexwall`, et ses réglages dans `/etc/ibexwall`. Ils ne sont lisibles que par root là où ils doivent l'être.
- Le journal d'audit est une chaîne : chaque ligne porte l'empreinte de la précédente, donc une ligne supprimée ou modifiée est détectée.
- Le résolveur DNS sécurisé compte les requêtes et les blocages. Il n'enregistre jamais les noms que vous consultez.

## Ce qui quitte votre ordinateur, et seulement quand vous le demandez

IbexWall utilise le réseau quand vous le lui dites : une requête DNS que vous faites va vers le résolveur que vous avez choisi, par une connexion chiffrée ; une mise à jour de paquets que vous lancez va vers votre distribution. Un assistant IA que vous connectez peut lire un état expurgé, par une connexion que vous avez configurée, avec une clé que vous pouvez retirer.

## Vérifiez par vous-même

Vous n'avez pas à nous croire sur parole. Surveillez les connexions avec `ss -tup`, capturez le trafic avec `tcpdump`, ou utilisez la vue réseau par programme du logiciel pour voir qui chaque processus contacte. L'article [Pas de télémétrie dans un outil de sécurité](/fr/articles/no-telemetry-in-a-security-tool/) montre comment.

## Ce site

Les pages sont des fichiers statiques. Il n'y a ni cookies, ni scripts d'autres sites, ni suivi. Les liens vers d'autres sites, comme GitHub et la documentation, sont de simples liens.
