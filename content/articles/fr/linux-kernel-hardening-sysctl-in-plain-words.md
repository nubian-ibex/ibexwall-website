---
title: "Durcir le noyau Linux avec sysctl, en clair"
description: "Ce qu'est le durcissement via sysctl, par quels réglages commencer sans risque, lesquels peuvent casser Flatpak, un VPN ou IPv6, et comment appliquer puis annuler proprement."
slug: "linux-kernel-hardening-sysctl-in-plain-words"
date: 2026-11-06
updated: 2026-11-06
tags: [sysctl, noyau, durcissement]
related_hardening: [kernel.kptr-restrict, kernel.dmesg-restrict, net.tcp-syncookies, kernel.user-namespaces]
faq:
  - q: "Qu'est-ce que le durcissement par sysctl ?"
    a: "Le noyau a des réglages modifiables pendant qu'il tourne. Durcir consiste à choisir des valeurs plus strictes, comme masquer les adresses du noyau aux programmes ordinaires, pour rendre une faille plus difficile à exploiter."
  - q: "Comment annuler un changement sysctl ?"
    a: "Supprimez le fichier que vous avez créé dans /etc/sysctl.d, puis remettez l'ancienne valeur avec sysctl -w, ou redémarrez. Notez l'ancienne valeur d'abord."
---

Sysctl est la liste des réglages que le noyau Linux en cours d'exécution vous laisse modifier sans le recompiler. Durcir avec sysctl consiste à choisir des valeurs plus strictes pour ceux qui touchent à la sécurité. Chaque réglage est petit, et la plupart sont sûrs. Certains peuvent casser un logiciel que vous utilisez, donc l'approche raisonnable est de commencer par les inoffensifs et de tester le reste un par un.

## Comment cela marche

Lire une valeur :

```sh
sysctl kernel.kptr_restrict
```

La changer jusqu'au prochain démarrage :

```sh
sudo sysctl -w kernel.kptr_restrict=2
```

La garder après redémarrage en la mettant dans un fichier sous `/etc/sysctl.d/`, dont les fichiers finissent par `.conf` et sont lus par ordre de nom :

```sh
echo 'kernel.kptr_restrict = 2' | sudo tee /etc/sysctl.d/90-exemple.conf
sudo sysctl --system
```

Cela fonctionne pareil sur Fedora, Ubuntu, Debian et Arch. Ne modifiez pas les fichiers livrés par votre distribution ; ajoutez les vôtres, pour qu'une mise à jour n'écrase pas votre travail et que vous puissiez les retirer ensuite. Comme les fichiers sont lus dans l'ordre, un nom plus tardif l'emporte quand deux définissent la même clé.

## Ceux sans risque pour commencer

Ils changent peu de choses sur un ordinateur de bureau et ont un bénéfice clair.

- [`kernel.kptr_restrict`](/fr/hardening/kernel.kptr-restrict/) masque les adresses mémoire du noyau aux programmes ordinaires. Les attaquants s'en servent pour viser un exploit.
- [`kernel.dmesg_restrict`](/fr/hardening/kernel.dmesg-restrict/) ne laisse qu'un administrateur lire le journal du noyau, qui peut montrer des adresses et des détails matériels.
- [`net.ipv4.tcp_syncookies`](/fr/hardening/net.tcp-syncookies/) garde la machine en train de répondre quand on l'inonde de connexions à moitié ouvertes. Beaucoup de distributions le mettent déjà à 1.
- `fs.protected_symlinks`, `fs.protected_hardlinks`, `fs.protected_fifos` et `fs.protected_regular` bloquent les vieux tours où un attaquant dépose un lien ou un fichier dans un dossier partagé comme `/tmp` pour qu'un programme privilégié écrive où il veut. Le catalogue les regroupe sous [protéger les dossiers partagés](/fr/hardening/fs.protected-files/).

Certains sont probablement déjà actifs sur votre système. Lire la valeur d'abord vous le dit.

## Ceux qui peuvent casser des choses

Une valeur plus stricte peut retirer ce dont un programme a besoin. Cas connus :

- [`user.max_user_namespaces=0`](/fr/hardening/kernel.user-namespaces/) retire une grande partie de la surface d'attaque du noyau, et il empêche aussi Flatpak, les bacs à sable de Chromium et Firefox, les conteneurs sans root et beaucoup d'AppImages de fonctionner. Pour la plupart des ordinateurs de bureau, c'est trop coûteux.
- `kernel.yama.ptrace_scope` à un niveau plus strict signifie qu'un débogueur comme `gdb` ou `strace` ne peut plus s'attacher à un programme lancé sans droits supplémentaires. Les développeurs le remarquent vite.
- `kernel.perf_event_paranoid` élevé arrête le profilage sans privilège avec `perf`.
- `net.ipv4.conf.all.rp_filter=1` jette les paquets qui arrivent sur une interface que le noyau n'utiliserait pas pour répondre. Cela peut casser certains VPN et machines à plusieurs routes réseau.
- Ignorer les annonces de routeur IPv6 peut laisser IPv6 sans adresse sur la plupart des réseaux domestiques.
- `kernel.sysrq=0` retire les touches d'urgence d'une machine figée.
- Verrouiller kexec ne s'annule qu'au prochain démarrage, et cela touche les outils de capture d'incident.

La règle est simple : changez une chose, servez-vous de l'ordinateur une journée, et gardez le reste pour plus tard.

## Comment tester un changement

Après chaque changement, utilisez la machine comme d'habitude. Ouvrez le navigateur, lancez une app Flatpak si vous en avez, connectez votre VPN, branchez un appareil, compilez quelque chose. Si vous travaillez à distance, gardez une seconde session ouverte. Les problèmes de sysctl se montrent en général comme un programme qui échoue avec « permission denied » ou « operation not permitted » sans cause évidente ; donc, quand cela arrive juste après un changement, soupçonnez-le d'abord. Changer une valeur à la fois rend le coupable évident, et l'annulation tient en une ligne.

## Appliquer et annuler

Notez les valeurs actuelles avant de toucher à quoi que ce soit :

```sh
sysctl kernel.kptr_restrict kernel.dmesg_restrict
```

Pour annuler un changement persistant, retirez le fichier et remettez l'ancienne valeur, car supprimer le fichier seul ne change pas le noyau en cours :

```sh
sudo rm /etc/sysctl.d/90-exemple.conf
sudo sysctl -w kernel.kptr_restrict=0
```

Un redémarrage revient aussi à ce que disent les fichiers restants et le défaut du noyau. Si un réglage casse quelque chose sans que vous sachiez lequel, divisez : retirez la moitié de votre fichier, lancez `sudo sysctl --system`, et testez.

## Vérifiez avec IbexWall

L'écran Durcissement liste 26 réglages noyau, réseau, système de fichiers et modules, chacun avec ce qu'il peut casser, et vous cochez ceux que vous voulez. Le plugin de durcissement du noyau (system.sysctl) lit chaque valeur, la compare à la référence et applique votre choix par un plan. Le plan montre le fichier exact, écrit par IbexWall sous `/etc/sysctl.d/90-ibexwall.conf`, et le diff avant que rien ne se passe. Un instantané est pris d'abord, et l'Historique annule. La version 1.0 est en préparation.
