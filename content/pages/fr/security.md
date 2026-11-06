---
title: "Sécurité"
description: "Comment IbexWall est conçu pour mériter la confiance : plans et points de restauration, plugins et versions signés, plugins en bac à sable, services confinés, et signalement d'une vulnérabilité."
updated: 2026-11-06
---

Un outil de sécurité doit être plus sûr que l'ordinateur qu'il protège. Cette page liste ce qu'IbexWall fait pour cela, et ce qu'il ne prétend pas faire.

## Des changements visibles et annulables

Rien n'est changé sans plan. Un plan liste les fichiers, les services et les règles de pare-feu exacts, avec un aperçu de la différence et une note sur ce qui pourrait casser. Un point de restauration est créé avant l'application. Un changement qui pourrait couper votre réseau attend votre confirmation et s'annule de lui-même si vous ne la donnez pas. L'Historique liste chaque changement et permet d'annuler n'importe lequel.

## Les plugins proposent, le cœur exécute

Un plugin lit le système et décrit un changement. Il ne peut pas en faire un. Seul le cœur applique les changements, en tant que root, par le plan, le point de restauration et votre approbation. IbexWall ne modifie que ses propres fichiers (des fichiers drop-in dont le nom contient `ibexwall` et sa propre table de pare-feu) et jamais ceux qui appartiennent à votre distribution ou à un autre programme.

## Signé, en bac à sable, confiné

- Les manifestes de plugins sont signés. Le démon est compilé avec la clé publique de la version et refuse un manifeste qui ne se vérifie pas.
- Chacun des 32 plugins s'exécute dans sa propre unité systemd : un utilisateur dynamique, aucune capability sauf s'il les déclare, un système en lecture seule. Le score de l'unité selon `systemd-analyze security` est publié pour chaque plugin.
- Sur Debian et Ubuntu, des profils AppArmor confinent le résolveur, le serveur de l'assistant et les plugins. Sur Fedora, c'est un module SELinux. Les deux sont testés avec l'application des règles activée.

## Des versions que vous pouvez vérifier

Chaque version a des sommes de contrôle, une signature pour chaque fichier, une nomenclature logicielle (CycloneDX) et une attestation de provenance. La compilation est reproductible : compiler deux fois le même commit, dans des dossiers différents, donne des fichiers identiques.

## Ce qu'il ne fait pas

IbexWall ne protège pas un ordinateur contre quelqu'un qui a déjà les droits root dessus, et il ne peut pas rendre sûr un programme qui ne l'est pas. Il réduit la surface d'attaque et vous dit ce qui est exposé. Son modèle de menace est public dans la [documentation](https://docs.ibexwall.com/concepts/security-model/).

## La clé de version

La clé qui signe les versions sera publiée ici et dans le dépôt avant la sortie de la version 1.0. D'ici là, les paquets construits par les tests du projet sont signés avec une clé de développement qui n'est pas valable pour une version.

## Signaler une vulnérabilité

Utilisez le signalement privé de vulnérabilités de GitHub sur le [dépôt](https://github.com/nubian-ibex/ibexwall/security). N'ouvrez pas de ticket public pour un problème de sécurité, et n'incluez pas de secrets dans un signalement. Nous visons une réponse sous quelques jours.
