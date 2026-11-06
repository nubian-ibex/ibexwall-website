---
title: "Obtenir IbexWall"
description: "IbexWall 1.0 est en préparation. Voyez comment les versions seront publiées et signées, comment vérifier un téléchargement et comment compiler dès aujourd'hui."
updated: 2026-11-06
---

IbexWall 1.0 n'est pas encore publié. Cette page dit ce que contiendra une version, comment la vérifier, et comment compiler le programme vous-même en attendant.

## Ce que contient une version

Chaque version est un ensemble de fichiers sur la [page des versions GitHub](https://github.com/nubian-ibex/ibexwall/releases) :

- des paquets pour Fedora (RPM), Ubuntu et Debian (DEB) et Arch Linux ;
- le code source au commit étiqueté ;
- des sommes de contrôle, une signature pour chaque fichier, une nomenclature logicielle et une attestation de provenance décrivant comment les fichiers ont été construits.

Les paquets sont séparés pour que vous n'installiez que ce dont vous avez besoin : `ibexwall` (le démon, la ligne de commande et les plugins), `ibexwall-desktop` (la fenêtre, l'icône de la zone de notification et l'agent de session), `ibexwall-mcp` (le serveur pour les assistants IA), et un paquet de confinement adapté à votre système : `ibexwall-apparmor` sur Debian et Ubuntu, `ibexwall-selinux` sur Fedora.

## Systèmes pris en charge

Fedora, Ubuntu 24.04 et 26.04, Debian et Arch Linux. Avant sa publication, chaque version est installée, utilisée, mise à jour, supprimée et purgée dans une machine virtuelle pour chacun d'eux.

## Vérifier ce que vous avez téléchargé

Téléchargez les fichiers de la version dans un même dossier, puis vérifiez la signature de la liste des sommes de contrôle, ensuite chaque somme de contrôle, puis chaque signature :

```sh
git clone https://github.com/nubian-ibex/ibexwall
cd ibexwall
cargo xtask verify-release /path/to/the/folder /path/to/the/folder/ibexwall-release.pub
```

Les fichiers utilisent le format minisign, donc `minisign -V` fonctionne aussi sur un seul fichier. La clé publique est également publiée sur la [page Sécurité](/fr/security/) ; comparez les deux avant de faire confiance à une signature. Le [guide des versions](https://docs.ibexwall.com/reference/release-verification/) explique chaque fichier.

## Compiler depuis les sources

Il vous faut la chaîne d'outils Rust indiquée dans `rust-toolchain.toml` et, pour la fenêtre, les outils Node.js et les paquets de développement WebKitGTK.

```sh
git clone https://github.com/nubian-ibex/ibexwall
cd ibexwall
cargo build --release --workspace
```

Essayez-le sans modifier votre système : `scripts/dev-sandbox.sh` lance le démon et la fenêtre dans un bac à sable qui ne touche jamais à vos fichiers, à vos services ni à votre pare-feu. Le guide du développeur se trouve sur [docs.ibexwall.com](https://docs.ibexwall.com/contributing/).

## Ce que fait l'installation

L'installation crée les utilisateurs système et les répertoires, active les sockets qui lancent le démon et les plugins au besoin, et les démarre. Elle n'applique aucun changement de sécurité : chaque changement reste un plan que vous examinez. Supprimer les paquets annule ce qu'IbexWall a changé, grâce au point de restauration de chaque changement, et conserve vos données jusqu'à la purge.
