---
title: "Configuração obrigatória para um desktop Linux corporativo"
description: "O checklist que uma empresa deve aplicar em todo desktop Linux antes de entregar a um funcionário: criptografia de disco, Secure Boot, contas, firewall, atualizações e SSH, e como o IbexWall prova que cada item vale."
slug: "corporate-linux-desktop-mandatory-setup"
date: 2026-11-06
updated: 2026-11-06
tags: [corporativo, instalação, checklist, conformidade]
related_hardening: []
---

Uma empresa que adota Linux nos desktops costuma escrever uma política e depois confiar que cada máquina a segue. Este artigo transforma essa política num checklist concreto e aponta as verificações do IbexWall que provam que cada item vale de verdade na máquina.

## Criptografia de disco, antes de qualquer coisa

Criptografe o disco e o swap, e desbloqueie com chave presa ao TPM2 onde o firmware permitir, para a máquina iniciar sem segunda senha mas ainda recusar um disco removido. Sem criptografia, todo o resto é inútil: os dados saem pela porta junto com o laptop.

O que o IbexWall valida: `posture.disk_encryption` e `posture.swap_encryption` leem o estado real do disco e do swap, e reportam com honestidade quando não conseguem.

## Secure Boot e lockdown do kernel

Ligue o Secure Boot e habilite o lockdown do kernel. Juntos, impedem um invasor de iniciar um kernel adulterado ou carregar um módulo sem assinatura num sistema em execução.

O que o IbexWall valida: `posture.secure_boot` e `posture.lockdown`.

## Contas: sem senha vazia, sem root extraviado, bloqueio ligado

Um desktop corporativo tem exatamente um caminho de administrador, e ele exige senha. Verifique que nenhuma conta tem senha vazia, que só as contas pretendidas têm uid 0 e que falhas de login bloqueiam a conta.

O que o IbexWall valida: `accounts.empty_passwords`, `accounts.uid0` e `accounts.lockout`.

## sudo pede senha, e registra

Configure o sudo para exigir a senha do usuário e para registrar o que executa. Um sudo sem senha transforma uma sessão roubada em root instantâneo; um sudo sem registro esconde o que foi feito.

O que o IbexWall valida: `posture.sudo_nopasswd` e `accounts.sudo_logging`.

## Um firewall que nega entrada por padrão

Nada deve escutar novas conexões salvo o que a empresa abriu. No Fedora é o firewalld, no Ubuntu o ufw, e o IbexWall trabalha através do que estiver presente.

O que o IbexWall valida: `firewall.default_deny`, e a tela de firewall fecha o que não deveria escutar.

## Atualizações que se instalam sozinhas

Habilite atualizações de segurança automáticas para uma falha conhecida ser fechada sem esperar uma pessoa. É o controle mais barato que existe e aquele em que os invasores contam que você pule.

O que o IbexWall valida: `posture.updates_automatic`, `updates.automatic` e `cves.security_updates`.

## SSH, se estiver ligado

Se um desktop aceita SSH, endureça: sem login de root, sem login só por senha, e sem chaves curtas. Se não precisa de SSH, desligue.

O que o IbexWall valida: `ssh.hardening`.

## Backups, testados restaurando

Nenhuma verificação prova que um backup funciona. A regra é: uma vez por mês, restaure um arquivo do backup mais recente para uma pasta de rascunho. Ransomware, um disco falhando e um `rm` digitado errado terminam no mesmo lugar.

## Prove, por máquina

Uma política que diz "criptografe o disco" não é criptografia. O valor do IbexWall numa adoção corporativa é que cada máquina prova a própria postura, e um gestor de frota coleta um relatório assinado (`ibexctl compliance export`) sem o IbexWall ligar para casa. A tela de Compliance compara a máquina com LGPD, NIST e ISO onde a empresa precisa de evidência para auditoria.
