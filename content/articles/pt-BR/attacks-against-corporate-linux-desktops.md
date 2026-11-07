---
title: "Ataques conhecidos contra desktops Linux corporativos, e como pará-los"
description: "As formas documentadas de invasores entrarem em desktops Linux nas empresas: roubo de credencial, escalada de privilégio, persistência e cadeia de suprimentos. O que para cada uma, e como o IbexWall valida."
slug: "attacks-against-corporate-linux-desktops"
date: 2026-11-06
updated: 2026-11-06
tags: [ataques, corporativo, endurecimento, validação]
related_hardening: []
---

Invasores raramente escrevem um exploit novo para um desktop Linux. Eles reutilizam uma lista curta de técnicas conhecidas, porque elas continuam funcionando. Este artigo lista as técnicas, o que para cada uma, e como o IbexWall transforma "achamos que paramos" numa verificação que afirma.

## Roubo de credencial e contas fracas

A entrada mais comum é uma senha vazia, reutilizada, ou numa máquina onde alguém vira root sem senha. Num desktop corporativo o risco se agrava com SSH deixado aberto e sudo configurado para não pedir senha.

O que para: nenhuma senha vazia, nenhum uid 0 extraviado, bloqueio de conta, sudo que exige senha e SSH endurecido. O IbexWall verifica tudo isso: `accounts.empty_passwords`, `accounts.uid0`, `accounts.lockout`, `posture.sudo_nopasswd` e `ssh.hardening`.

## Escalada de privilégio

Uma vez dentro como usuário sem privilégio, o invasor escala. Rotas comuns são um arquivo sensível gravável, um binário setuid, um kernel antigo com falha conhecida, ou uma sessão destravada.

O que para: corrigir prontamente, permissões estritas em `/etc/shadow`, `/etc/passwd` e `/etc/sudoers`, e bloqueio de tela automático. O IbexWall verifica atualizações pendentes, permissões de arquivos sensíveis (`accounts.file_perms`), registro do sudo e `session_lock.automatic`.

## Persistência

Depois da escalada, o invasor quer sobreviver a um reboot. Técnicas documentadas incluem entradas de autostart, cron, arquivos de inicialização de shell e `LD_PRELOAD`. Um boot limpo que recarrega silenciosamente um backdoor é o objetivo.

O que para: vigiar esses lugares em busca de mudanças. O `endpoint.persistence` do IbexWall faz hash de unidades, timers, cron, autostart, inicialização de shell e `LD_PRELOAD`, e reporta o que é novo ou mudou desde uma linha de base que você aceitou.

## Cadeia de suprimentos e rodar o desconhecido

Um pacote comprometido, um repositório clonado, ou um script de fórum podem plantar código que depois liga para casa ou lê o disco. Isso é menos sobre "varredura de malware" e mais sobre só rodar o que você confia e vigiar o que isso alcança.

O que para: assinaturas de pacote, um firewall que nega entrada por padrão, e controle de rede por programa. O IbexWall verifica que as assinaturas de pacote são exigidas (`updates.signatures`), que o firewall nega por padrão (`firewall.default_deny`), e pergunta na primeira vez que qualquer programa novo alcança a rede.

## O ponto da validação

Nenhuma dessas defesas é nova. O difícil é saber, numa máquina específica, quais realmente valem. Uma política que diz "criptografe o disco e trave as contas" não é criptografia. O IbexWall transforma cada defesa numa verificação que lê o estado real, reporta honestamente quando não consegue ler, e deixa a pessoa corrigir o que falhou por um plano revisado e reversível. Uma empresa ganha uma máquina que prova a própria postura, em vez de uma que apenas foi instruída a ser segura.
