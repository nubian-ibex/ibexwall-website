---
title: "O que a nota de postura do IbexWall significa"
description: "A nota de 0 a 100 é um resumo do que um programa conseguiu ler sobre a sua máquina. O que ela inclui, o que não inclui, e como lê-la sem confiar demais."
slug: "ibexwall-posture-score-explained"
date: 2026-11-06
updated: 2026-11-06
tags: [postura, nota, verificações, descobertas]
related_hardening: []
---

A tela Visão geral abre com um número, uma nota de 0 a 100. Um número convida à confiança demais, então ajuda saber exatamente o que ele resume e onde ele é deliberadamente silencioso.

## Do que a nota é feita

A nota é calculada a partir dos resultados das verificações que os plugins reportam: criptografia de disco e swap, Secure Boot e lockdown do kernel, o firewall, contas (senhas vazias, uid 0 extraviado, bloqueio), se o sudo exige senha, atualizações, portas abertas e mais. Cada verificação tem um resultado: passou, falhou, não se aplica ou não foi avaliada.

Uma verificação que passou contribui para a nota; uma que falhou a reduz. Verificações não aplicáveis ficam de fora, e verificações não avaliadas nunca contam como aprovadas.

## O que a nota não sabe

A nota é um resumo de configurações que um programa conseguiu ler. Ela não sabe sua senha, se você a reutiliza, o que você baixa ou quais scripts você roda. Não enxerga um e-mail de phishing nem uma extensão maliciosa de navegador. Um número alto significa que o básico está no lugar, não que nada possa acontecer. Trate um número baixo como lista de tarefas, e um alto como "o chão está coberto".

## As partes por trás do número

A Postura do sistema lista cada verificação por trás da nota, agrupada, para você ver qual configuração derrubou o número. As Descobertas são as verificações que falharam, cada uma com uma explicação simples e uma severidade. As Proteções são o que já está no lugar. Quando uma verificação não consegue ler sua entrada, ela diz isso em vez de chutar, porque um número que esconde a própria ignorância é pior que um mais baixo e honesto.

## Como uma correção flui dela

Toda descoberta aponta para uma correção, e toda correção é um plano que você revisa antes: os arquivos, regras ou serviços exatos que vai mudar, e o que pode quebrar. Uma mudança que pode cortar sua rede espera sua confirmação, e o Histórico desfaz qualquer coisa. A nota sobe quando você aplica uma correção, e você pode vê-la mover, que é o ponto: o número é progresso, não um veredito.
