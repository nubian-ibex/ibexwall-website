---
title: "SELinux ou AppArmor pour un utilisateur de bureau : ce qu'il faut savoir"
description: "Le contrôle d'accès obligatoire limite un programme piraté. Voyez quelles distributions utilisent SELinux ou AppArmor, comment vérifier, et quoi faire quand quelque chose est bloqué."
slug: "selinux-vs-apparmor-for-a-desktop-user"
date: 2026-11-06
updated: 2026-11-06
tags: [selinux, apparmor, mac]
related_hardening: []
faq:
  - q: "Quelle est la différence entre SELinux et AppArmor ?"
    a: "Les deux limitent ce qu'un programme peut toucher, même avec tous les droits. SELinux étiquette chaque fichier et processus et s'appuie sur une politique sur les étiquettes. AppArmor écrit des règles par chemin de fichier pour chaque programme."
  - q: "Dois-je désactiver SELinux ou AppArmor quand quelque chose est bloqué ?"
    a: "Non. Lisez le refus dans le journal, puis corrigez l'étiquette ou mettez seulement ce programme en mode permissif. Couper tout le système retire la protection de tout le monde."
---

Les permissions Linux classiques répondent à une question : cet utilisateur peut-il ouvrir ce fichier ? Le contrôle d'accès obligatoire (MAC) en ajoute une seconde : ce programme précis le peut-il, quel que soit l'utilisateur sous lequel il tourne ? Si un navigateur ou un service réseau est compromis, le MAC limite jusqu'où l'intrus va. Linux a deux systèmes courants pour cela, SELinux et AppArmor, et vous en avez presque certainement déjà un.

## Quelle distribution utilise quoi

- Fedora utilise SELinux, en mode strict par défaut.
- Ubuntu utilise AppArmor, actif par défaut.
- Debian active AppArmor par défaut depuis Debian 10, avec un jeu de profils plus petit que celui d'Ubuntu.
- Arch Linux n'active ni l'un ni l'autre par défaut. On peut en ajouter un, et cela demande du travail manuel.

Vous choisissez rarement. Vous utilisez ce que votre distribution maintient, car sa politique et ses profils sont écrits et testés pour les paquets de ce système.

## En quoi ils diffèrent

SELinux donne à chaque fichier, processus et port une étiquette et écrit une politique sur les étiquettes qui peuvent agir sur les autres. C'est minutieux et fin, et les étiquettes vivent avec le fichier, donc déplacer ou copier un fichier peut le laisser avec une mauvaise étiquette. AppArmor attache un profil à un programme et liste les chemins et capacités qu'il peut utiliser. C'est plus simple à lire et à écrire, et cela suit les noms de fichier plutôt que les étiquettes. Aucun n'est « plus sûr » en général. Leur force dépend de la politique de chaque programme, et ce qui compte sur un bureau est que celui livré par votre distribution soit actif.

## Voir s'il est actif

SELinux (Fedora) :

```sh
getenforce
sestatus
```

`Enforcing` est ce que vous voulez. `Permissive` journalise les problèmes sans les empêcher, et `Disabled` est éteint.

AppArmor (Ubuntu, Debian) :

```sh
sudo aa-status
```

Il liste combien de profils sont chargés, en mode enforce ou complain. Sur Debian, il peut falloir installer les paquets `apparmor` et `apparmor-utils` et activer le module au démarrage ; si `aa-status` dit qu'il n'est pas chargé, le noyau a besoin de `apparmor=1 security=apparmor` sur sa ligne de commande, et le wiki Debian décrit les étapes.

## Quand il bloque quelque chose

Un programme qui marche en root mais échoue sous MAC, ou un service qui échoue après que vous avez déplacé son dossier de données, c'est l'histoire typique. Le système fonctionne : il a arrêté quelque chose que la politique n'attendait pas. La réponse est de lire le refus, pas de couper la protection.

Sous SELinux, cherchez les refus :

```sh
sudo ausearch -m AVC,USER_AVC -ts recent
```

Sur Fedora, SETroubleshoot peut les expliquer en mots si son alerte de bureau ou `sealert` est installé. La cause la plus courante est une mauvaise étiquette sur des fichiers déplacés, que `restorecon -Rv /chemin` corrige. Pour un service qui doit utiliser un dossier hors norme, donnez-lui la bonne étiquette avec `semanage fcontext` puis `restorecon`. Pour tester si SELinux est la cause, `sudo setenforce 0` le rend permissif jusqu'au prochain démarrage, et `sudo setenforce 1` le remet. Ne le laissez pas ainsi.

Sous AppArmor, les refus apparaissent dans le journal du noyau :

```sh
sudo journalctl -k | grep -i 'apparmor="DENIED"'
```

Vous pouvez mettre un seul profil en mode complain avec `sudo aa-complain /chemin/du/programme`, et revenir avec `sudo aa-enforce /chemin/du/programme`. Ou ajouter une surcharge locale dans `/etc/apparmor.d/local/` pour le chemin précis dont le programme a besoin, puis recharger le profil avec `sudo apparmor_parser -r` sur son fichier.

## Avez-vous quelque chose à faire

Le plus souvent, non. Gardez-le actif, mettez à jour le système, et lisez le journal quand quelque chose échoue bizarrement. Ne le désactivez pas en premier réflexe, car cela retire une protection à tous les programmes pour en réparer un seul. Si vous exécutez des programmes hors des paquets de la distribution, comme un binaire du site d'un éditeur, attendez-vous à ce qu'ils soient moins confinés que les paquets.

## Vérifiez avec IbexWall

Le résolveur, le serveur MCP et les plugins d'IbexWall sont confinés par des profils AppArmor sur Debian et Ubuntu, et par un module SELinux sur Fedora, livrés dans des paquets séparés (`ibexwall-apparmor` ou `ibexwall-selinux`). L'écran Posture du système rapporte l'état de la protection de votre système, et vous pouvez relire ce que chaque plugin peut lire et modifier sur l'écran Plugins. Tout changement est un plan que vous relisez et annulez depuis l'Historique. La version 1.0 est en préparation.
