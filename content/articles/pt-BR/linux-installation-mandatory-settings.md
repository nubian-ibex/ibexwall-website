---
title: "As configurações para acertar ao instalar o Linux"
description: "As escolhas feitas na instalação, criptografia de disco, Secure Boot, contas e particionamento, que são difíceis de mudar depois, e como o IbexWall valida cada uma."
slug: "linux-installation-mandatory-settings"
date: 2026-11-06
updated: 2026-11-06
tags: [instalação, criptografia, secure-boot, contas]
related_hardening: []
---

A maioria das decisões de segurança do Linux é tomada na primeira hora, durante a instalação, e é chato mudar depois. Este artigo lista as que devem ser acertadas de cara, e como conferi-las depois com o IbexWall.

## Criptografe o disco durante a instalação

Criptografar depois normalmente significa reinstalar. Durante a configuração, escolha criptografia de disco completa (LUKS) e criptografe também o swap, porque um laptop suspenso grava a imagem da memória no swap em claro. Onde o firmware permitir, prenda o desbloqueio ao TPM2 para a máquina iniciar sem segunda senha mas recusar um disco removido.

Confira depois: `posture.disk_encryption` e `posture.swap_encryption` do IbexWall.

## Habilite o Secure Boot

O Secure Boot é uma configuração de firmware, não um checkbox do instalador em toda distribuição, mas é na instalação que você percebe que está desligado. Ligue e habilite o lockdown do kernel para um kernel adulterado ou um módulo sem assinatura ser recusado.

Confira depois: `posture.secure_boot` e `posture.lockdown`.

## Escolha as contas com cuidado

O primeiro usuário é o administrador. Dê a ele uma senha de verdade, nunca vazia, e garanta que só a conta pretendida tem uid 0. Habilite o bloqueio de conta para um adivinhador ser freado até parar.

Confira depois: `accounts.empty_passwords`, `accounts.uid0` e `accounts.lockout`.

## Faça o sudo pedir senha

Alguns instaladores oferecem sudo sem senha por conveniência. Recuse. Um sudo que pede senha é a diferença entre "alguém leu o disco" e "alguém é root". Configure-o para registrar o que executa.

Confira depois: `posture.sudo_nopasswd` e `accounts.sudo_logging`.

## Ligue o firewall desde o primeiro dia

Um firewall que nega entrada por padrão não custa nada na instalação e evita surpresas. O Fedora traz firewalld, o Ubuntu traz ufw; ligue o que estiver lá antes de a máquina ver a rede.

Confira depois: `firewall.default_deny` e a tela de firewall.

## Deixe as atualizações rodarem sozinhas

Habilite atualizações de segurança automáticas no instalador ou logo depois. Uma máquina que se atualiza sozinha fecha falhas conhecidas sem um humano no meio, e é o controle em que os atacantes contam que seja pulado.

Confira depois: `posture.updates_automatic` e `cves.security_updates`.

## As escolhas difíceis de mudar

Criptografia de disco, Secure Boot e o layout de partição são decisões do momento da instalação. Todo o resto, firewall, contas, sudo e atualizações, dá para corrigir depois, mas não deveria precisar. Acertar as difíceis de cara significa que só as fáceis ficam para depois.

## Confira tudo com o IbexWall

Depois da instalação, a tela Visão geral do IbexWall mostra uma nota e as descobertas por trás dela, e a Postura do sistema lista cada verificação: disco, boot, firewall, contas, atualizações e portas abertas. Cada correção é um plano que você revisa antes, com os arquivos exatos e o que pode quebrar, e dá para desfazer pelo Histórico.
