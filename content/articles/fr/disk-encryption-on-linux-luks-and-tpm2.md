---
title: "Chiffrement du disque sous Linux : LUKS, TPM2, swap et veille"
description: "Ce que LUKS protège, ce que le déverrouillage automatique par TPM2 change entre confort et sécurité, le trou du swap et de l'hibernation, et comment vérifier."
slug: "disk-encryption-on-linux-luks-and-tpm2"
date: 2026-11-06
updated: 2026-11-06
tags: [chiffrement, luks, tpm2]
related_hardening: []
faq:
  - q: "Contre quoi le chiffrement de disque LUKS protège-t-il ?"
    a: "Il protège les données au repos. Si votre portable est perdu, volé, ou éteint puis démonté, le contenu du disque est illisible sans la phrase secrète ou la clé."
  - q: "Le déverrouillage automatique par TPM2 est-il aussi sûr que la saisie d'une phrase secrète ?"
    a: "Il sacrifie un peu de sécurité au confort. Le disque s'ouvre sans phrase secrète quand la chaîne de démarrage correspond, donc quelqu'un qui obtient la machine éteinte dans cet état va plus loin. Ajouter un code PIN réduit ce risque."
---

Le chiffrement du disque protège vos fichiers quand quelqu'un a l'ordinateur mais pas vous. Sous Linux, il se fait avec LUKS, un format standard placé sous le système de fichiers. Vous saisissez une phrase secrète au démarrage, le disque se déverrouille, et le système fonctionne comme d'habitude. C'est la protection la plus utile pour un portable qui pourrait être perdu.

## Ce qu'il protège, et ce qu'il ne protège pas

Protège contre :

- Un portable ou un disque perdu ou volé.
- Quelqu'un qui retire le disque et le lit ailleurs.
- Les données restées sur un disque que vous recyclez ou vendez.

Ne protège pas contre :

- Un logiciel malveillant qui s'exécute pendant que vous êtes connecté. Le disque est alors déjà déverrouillé.
- Quelqu'un qui obtient votre phrase secrète.
- Une machine saisie en marche alors qu'elle est déverrouillée, ou une personne hostile qui a accès à la machine et le temps de falsifier la partition de démarrage non chiffrée.

C'est pourquoi il va de pair avec [Secure Boot](/fr/articles/is-secure-boot-worth-it-on-linux/) : l'un couvre les données stockées, l'autre le code de démarrage.

## LUKS2

LUKS a deux versions. LUKS2 est celle que créent les installateurs actuels. Il stocke plus de métadonnées, utilise la fonction de dérivation de clé Argon2id, volontairement coûteuse à deviner, et permet plusieurs emplacements de clé à la fois : une phrase secrète, une clé de récupération et un jeton TPM2 peuvent chacun déverrouiller le même disque.

Vérifiez ce que vous avez :

```sh
lsblk -f
sudo cryptsetup luksDump /dev/nvme0n1p3
```

Remplacez le périphérique par celui que `lsblk` affiche comme `crypto_LUKS`. Cherchez `Version: 2` et les emplacements de clé. Les anciennes installations peuvent être en LUKS1 ; la conversion est possible mais exige une sauvegarde préalable, donc lisez `man cryptsetup` avant de l'essayer.

## Déverrouillage par TPM2

Un TPM2 est une puce présente dans la plupart des ordinateurs récents, capable de garder un secret et de ne le libérer que si l'état mesuré de la machine correspond. Avec `systemd-cryptenroll`, vous pouvez lui lier une clé du disque, pour que la machine démarre sans demander la phrase secrète :

```sh
sudo systemd-cryptenroll --tpm2-device=auto --tpm2-pcrs=7 /dev/nvme0n1p3
```

Le PCR 7 reflète la configuration de Secure Boot. Votre initramfs doit pouvoir utiliser le TPM2 (il lui faut un déverrouillage basé sur systemd), et l'entrée crypttab a besoin de l'option `tpm2-device=auto`. Les étapes exactes diffèrent selon les distributions, donc suivez la documentation de la vôtre.

Le compromis est réel. Le disque s'ouvre tout seul pour quiconque allume la machine dans l'état attendu, donc la demande de mot de passe se déplace vers l'écran de connexion. Un mot de passe utilisateur faible garde alors les données. Ajouter un code PIN avec `--tpm2-with-pin=yes` rétablit un secret que vous saisissez. Gardez la phrase secrète d'origine ou une clé de récupération en lieu sûr : une mise à jour du micrologiciel ou un changement de configuration de démarrage peut modifier les mesures, et le TPM cessera de libérer la clé.

## Swap et hibernation

La mémoire peut atteindre le disque de deux manières, et toutes deux peuvent laisser fuir des clés et des documents si elles ne sont pas protégées.

- L'espace de swap. S'il s'agit d'une partition ordinaire, tout ce qui y est déplacé est lisible. Placez le swap dans le volume chiffré, ou utilisez zram, qui garde les pages déplacées en mémoire.
- L'hibernation. L'image entière de la mémoire est écrite dans le swap puis relue à la reprise, clé du disque comprise. L'hibernation n'est sûre que si le swap qu'elle utilise l'est, donc le swap doit se trouver sur le volume chiffré, et le réglage de reprise doit être configuré par vous ou par l'installateur.

De nombreuses installations par défaut de Fedora et d'Ubuntu placent le swap sur un stockage chiffré ou dans zram, mais « beaucoup » ne veut pas dire « la vôtre ». Vérifiez :

```sh
swapon --show
```

Si un périphérique est listé, confirmez dans `lsblk -f` qu'il se trouve sous un parent `crypto_LUKS`.

## Vidages mémoire

Quand un programme plante, le système peut écrire sa mémoire sur le disque, et cette mémoire peut contenir des mots de passe ou des clés. Même sur un disque chiffré, ces fichiers sont lisibles une fois que vous êtes connecté, donc ne les stocker qu'où vous le voulez est une bonne habitude.

## Par où commencer

Si votre disque n'est pas chiffré, la solution propre est une réinstallation avec le chiffrement choisi dans l'installateur. Chiffrer sur place est possible avec des outils comme `cryptsetup-reencrypt` mais risqué ; faites d'abord une sauvegarde complète.

## Vérifier avec IbexWall

L'état du système indique si le disque est chiffré, et la vérification Vidages mémoire (system.coredump) peut désactiver le stockage des vidages de plantage par un plan. IbexWall ne chiffre pas un disque à votre place et ne change pas les clés LUKS ; il signale le manque. Chaque changement qu'il fait est un plan que vous examinez, avec un point de restauration que vous pouvez annuler depuis l'Historique. La version 1.0 est en préparation.
