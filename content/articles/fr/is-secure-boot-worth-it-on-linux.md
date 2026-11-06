---
title: "Secure Boot vaut-il la peine sous Linux ? Ce qu'il couvre"
description: "Secure Boot vérifie que le code qui démarre votre ordinateur est signé. Ce qu'il protège, ce qu'il ne protège pas, shim et MOK, et comment vérifier le vôtre."
slug: "is-secure-boot-worth-it-on-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [secure boot, démarrage, micrologiciel]
related_hardening: [kernel.kexec]
faq:
  - q: "Vaut-il la peine d'activer Secure Boot sous Linux ?"
    a: "Oui pour la plupart des gens. Il empêche l'exécution de code de démarrage non signé et permet au noyau d'activer le verrouillage. Il ne protège ni les fichiers une fois le système lancé, ni un disque volé non chiffré."
  - q: "Comment vérifier si Secure Boot est activé ?"
    a: "Lancez mokutil --sb-state. Il affiche SecureBoot enabled ou disabled."
---

Pour la plupart des utilisateurs de postes de travail, oui : Secure Boot vaut la peine d'être activé, et les principales distributions Linux fonctionnent avec. Il ferme une porte précise : du code non signé qui s'exécute avant le démarrage de votre système d'exploitation. Il ne rend pas le système en marche sûr, et il ne protège pas les données d'un disque non chiffré.

## Ce qu'il fait

Au démarrage de l'ordinateur, le micrologiciel UEFI peut refuser d'exécuter tout ce dont il ne fait pas confiance à la signature. Avec Secure Boot activé, le micrologiciel vérifie le chargeur de démarrage, le chargeur vérifie le noyau, et le noyau peut vérifier les modules qu'il charge. Un outil qui s'installe dans la chaîne de démarrage (un bootkit) doit être signé par une clé en laquelle le micrologiciel a confiance, sinon il ne s'exécute pas.

Un autre effet compte davantage au quotidien. Quand Secure Boot est activé, le noyau peut démarrer en mode de verrouillage (lockdown), qui ferme des moyens pour root de modifier le noyau en marche, comme écrire dans la mémoire du noyau ou charger des modules non signés.

## Ce qu'il ne fait pas

- Il ne protège pas contre un logiciel malveillant qui s'exécute sous votre identité après le démarrage du système.
- Il ne chiffre rien. Quelqu'un qui a votre portable peut encore lire un disque non chiffré. Voir [le chiffrement du disque avec LUKS et TPM2](/fr/articles/disk-encryption-on-linux-luks-and-tpm2/).
- Il ne vérifie pas vos propres fichiers, vos scripts ni le contenu de votre dossier personnel.
- Il dépend du micrologiciel. Une chaîne de démarrage signée avec un micrologiciel périmé et vulnérable, ou un ancien chargeur révoqué, n'est aussi solide que son maillon le plus faible.
- Il fait confiance aux clés de votre micrologiciel, dont celle qui signe le composant de démarrage courant, shim.

## Shim et MOK

La plupart des micrologiciels font confiance à une clé de Microsoft. Les distributions Linux ne peuvent pas faire signer chaque noyau par elle, donc elles livrent un petit programme signé appelé shim. Le micrologiciel fait confiance à shim, et shim fait confiance à la clé propre de la distribution et à une liste que contrôle le propriétaire, appelée MOK (Machine Owner Key).

MOK est le moyen d'utiliser des modules noyau tiers, comme certains pilotes graphiques ou de virtualisation, avec Secure Boot activé. Vous signez le module (ou laissez l'outil de votre distribution le faire), vous enregistrez la clé avec `mokutil --import`, vous redémarrez, et vous confirmez l'enregistrement sur l'écran bleu affiché au démarrage avec le mot de passe que vous avez choisi. Rien n'est enregistré sans vous devant la console, et c'est tout l'intérêt.

Si un module ne se charge pas et que le journal mentionne « required key not available », il n'est pas signé pour cette chaîne de clés.

## Le verrouillage (lockdown)

Vérifiez dans quel mode se trouve le noyau :

```sh
cat /sys/kernel/security/lockdown
```

Le mode actif est entre crochets : `[none]`, `[integrity]` ou `[confidentiality]`. Integrity bloque ce qui permettrait à root de modifier le noyau. Confidentiality bloque aussi la lecture des secrets du noyau. De nombreux noyaux de distribution choisissent integrity quand Secure Boot est activé, mais vérifiez le vôtre plutôt que de le supposer. Le verrouillage explique pourquoi certains vieux outils, dont l'accès brut à la mémoire, cessent de fonctionner avec Secure Boot activé.

## Comment vérifier

```sh
mokutil --sb-state
```

Installez d'abord `mokutil` si la commande manque. Sur les systèmes systemd, `bootctl status` affiche aussi l'état de Secure Boot et montre la configuration du micrologiciel. Si la machine n'a pas d'UEFI (ancien BIOS ou certaines machines virtuelles), aucune des deux ne montrera de résultat et il n'y a rien à activer.

Pour l'activer, ouvrez la configuration du micrologiciel (en général Suppr, F2 ou F10 au démarrage) et activez Secure Boot. Sur Arch Linux et dans quelques autres cas, vous devez d'abord signer votre propre chargeur de démarrage ou utiliser un outil comme `sbctl`, car l'installation ne livre pas de binaires signés ; suivez la page Secure Boot de l'Arch Wiki plutôt que de deviner l'ordre des étapes.

## Cela vaut-il l'effort

Là où votre distribution gère la signature, le coût est un réglage et un enregistrement de clé occasionnel, et vous gagnez une protection contre une catégorie d'attaques persistantes ainsi que le mode de verrouillage. Si vous compilez des noyaux personnalisés ou dépendez de modules non signés, le travail est plus grand et le gain plus petit. Le chiffrement du disque et les mises à jour méritent d'abord votre attention.

## Vérifier avec IbexWall

L'écran État du système couvre le démarrage, le disque, le pare-feu et les comptes, et les réglages de durcissement du noyau du catalogue expliquent ce que chaque changement touche, comme celui qui [interdit de charger un autre noyau pendant l'exécution](/fr/hardening/kernel.kexec/). IbexWall lit l'état et vous dit quoi corriger. Les changements qu'il fait sont des plans que vous examinez et pouvez annuler depuis l'Historique. La version 1.0 est en préparation.
