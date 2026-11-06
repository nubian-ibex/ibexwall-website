---
title: "Mon ordinateur Linux est-il sûr ? Auto-vérification en 10 minutes"
description: "Vérifiez mises à jour, chiffrement du disque, pare-feu, Secure Boot, ports ouverts, SSH, comptes et sauvegardes en dix minutes, et comprenez ce que signifie un score."
slug: "how-secure-is-my-linux-computer"
date: 2026-11-06
updated: 2026-11-06
tags: [liste de contrôle, bases, état du système]
related_hardening: [mounts.tmp-noexec, fs.protected-files]
faq:
  - q: "Comment vérifier rapidement la sécurité de mon ordinateur Linux ?"
    a: "Regardez huit points : mises à jour en attente, chiffrement du disque, état du pare-feu, Secure Boot, ports à l'écoute, serveur SSH, comptes utilisateurs et sauvegardes. Chacun prend une ou deux minutes avec une seule commande."
  - q: "Un score de sécurité élevé veut-il dire que mon ordinateur est sûr ?"
    a: "Non. Un score compte les réglages qui ont été vérifiés. Il ne voit pas un mot de passe faible, une page d'hameçonnage sur laquelle vous avez cliqué, ni un logiciel que vous avez installé volontairement."
---

Votre ordinateur Linux est probablement en assez bon état s'il installe les mises à jour, a un disque chiffré, fait tourner un pare-feu que vous savez expliquer, et n'offre au réseau rien que vous n'ayez choisi. Vous pouvez tout vérifier en une dizaine de minutes avec les commandes ci-dessous. Quand une commande diffère selon la distribution, le texte le dit.

## Les huit vérifications

### 1. Mises à jour

La plupart des attaques réussies exploitent une faille qui a déjà un correctif. Voyez si des correctifs attendent :

```sh
# Fedora
sudo dnf check-upgrade
# Ubuntu and Debian
sudo apt update && apt list --upgradable
# Arch
checkupdates   # from the pacman-contrib package
```

Si la liste est longue, mettez à jour maintenant. Voyez ensuite si les mises à jour de sécurité s'installent toutes seules : Ubuntu et Debian utilisent `unattended-upgrades`, Fedora utilise `dnf-automatic` (dnf5 a son propre plugin automatique), et Arch n'a pas d'outil de ce genre, car c'est une distribution à publication continue que vous mettez à jour à la main.

### 2. Chiffrement du disque

Si quelqu'un prend votre portable, un disque non chiffré peut être lu en le branchant sur une autre machine. Regardez la disposition :

```sh
lsblk -f
```

Une ligne `crypto_LUKS` au-dessus de votre système de fichiers racine signifie que le disque est chiffré. Notre article sur [LUKS et TPM2](/fr/articles/disk-encryption-on-linux-luks-and-tpm2/) explique ce que cela protège et ce que cela ne protège pas.

### 3. Pare-feu

Vérifiez lequel votre système utilise :

```sh
sudo nft list ruleset | head -40
sudo ufw status            # Ubuntu, if ufw is installed
sudo firewall-cmd --state  # Fedora, if firewalld is installed
```

Une sortie vide pour la première commande et « inactive » pour les autres signifient qu'il n'y a aucun filtrage. Savoir si vous en avez besoin fait l'objet d'[un autre article](/fr/articles/do-you-need-a-firewall-on-linux-desktop/).

### 4. Secure Boot

```sh
mokutil --sb-state
```

« SecureBoot enabled » signifie que le micrologiciel ne lance que des logiciels de démarrage signés. La commande se trouve dans le paquet `mokutil` sur les quatre familles. Voir [Secure Boot vaut-il la peine sous Linux](/fr/articles/is-secure-boot-worth-it-on-linux/) pour ses limites.

### 5. Ports ouverts

Un port est une porte qu'un programme tient ouverte. Listez ceux qui attendent des connexions :

```sh
sudo ss -tulpn
```

Tout ce qui écoute sur `127.0.0.1` ou `::1` n'est joignable que depuis votre propre machine. Les lignes avec `0.0.0.0`, `[::]` ou `*` acceptent des connexions du réseau. Pour chacune, demandez-vous si vous connaissez le programme et si vous voulez qu'il soit là. Sinon, arrêtez son service.

### 6. SSH

Si vous ne vous connectez jamais à cet ordinateur depuis ailleurs, le serveur SSH ne devrait pas tourner :

```sh
systemctl is-active sshd   # Fedora, Arch
systemctl is-active ssh    # Debian, Ubuntu
```

Si vous l'utilisez, vérifiez les réglages effectifs avec `sudo sshd -T | grep -E 'permitrootlogin|passwordauthentication'`. La connexion root devrait être à `no`, et les clés valent mieux que les mots de passe.

### 7. Utilisateurs

```sh
getent group sudo wheel
sudo awk -F: '$2 == "" {print $1}' /etc/shadow
```

La première liste ceux qui peuvent devenir administrateur (le groupe est `sudo` sur Debian et Ubuntu, `wheel` sur Fedora et Arch). La seconde affiche les comptes dont le champ du mot de passe est vide, et elle ne devrait rien afficher.

### 8. Sauvegardes

Aucune commande ne peut vous dire que votre sauvegarde fonctionne. Ouvrez la plus récente et restaurez un seul fichier dans un dossier de test. Si cela échoue, vous avez trouvé votre problème le plus important. Un rançongiciel, un disque qui lâche et un `rm` mal tapé finissent au même endroit.

## Par où commencer quand la liste est longue

N'essayez pas de tout corriger en une soirée. Mettez à jour d'abord, car cela ne coûte rien et ferme des failles connues. Occupez-vous ensuite de tout ce qui écoute sur le réseau sans que vous le reconnaissiez, puis de SSH et des comptes. Le chiffrement du disque et Secure Boot demandent en général une réinstallation ou un passage par les réglages du micrologiciel, donc prévoyez-les pour un week-end. Mettez en place les sauvegardes avant les changements risqués, pas après.

## Ce que signifie un score

Un score sur 100 résume des réglages qu'un programme a pu lire : le pare-feu est-il actif, le disque est-il chiffré, y a-t-il des mises à jour en attente. Il sert à trouver des lacunes et à voir les progrès après un changement. Ce n'est pas un verdict. Il ne sait pas que votre mot de passe est `hunter2`, que vous le réutilisez, ou que vous avez lancé un script trouvé sur un forum. Voyez un chiffre bas comme une liste de choses à faire et un chiffre haut comme « les bases sont couvertes », pas « rien ne peut arriver ».

## Vérifier avec IbexWall

L'écran Vue d'ensemble d'IbexWall montre un score et une liste de ce qu'il faut corriger, et État du système liste chaque vérification qui le compose (démarrage, disque, pare-feu, comptes, mises à jour, ports ouverts). Chaque correctif est un plan que vous examinez d'abord, avec les fichiers exacts et ce qui pourrait casser, et vous pouvez l'annuler depuis l'Historique. La version 1.0 est en préparation, donc il n'y a pas encore de téléchargement ; suivez l'avancement dans la documentation sur docs.ibexwall.com.
