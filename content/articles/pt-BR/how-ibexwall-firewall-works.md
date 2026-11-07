---
title: "Como funciona o firewall do IbexWall: nftables mais controle por programa"
description: "O IbexWall usa duas camadas: nftables para regras de entrada e eBPF para decidir quais programas podem alcançar a rede. Como elas se encaixam, e como uma mudança continua revisável."
slug: "how-ibexwall-firewall-works"
date: 2026-11-06
updated: 2026-11-06
tags: [firewall, eBPF, nftables, por-aplicativo]
related_hardening: []
---

Um firewall responde duas perguntas diferentes: o que pode chegar nesta máquina de fora, e o que pode sair dela. A maioria dos firewalls do Linux só responde a primeira. O IbexWall responde as duas com duas camadas, e transforma cada mudança num plano que você revisa antes.

## Camada um: entrada, através da distribuição

Para tráfego de entrada, o IbexWall não substitui o seu firewall. Numa máquina com firewalld ou ufw, ele conduz essa interface; numa máquina sem nenhum dos dois, ele gerencia sua própria tabela nftables `inet ibexwall`. Em ambos os casos, ele só grava na própria tabela, nunca na tabela de outro programa.

A primeira coisa a habilitar é negar-entrada por padrão: nada pode escutar novas conexões a menos que você tenha aberto. A partir daí, a tela de firewall mostra o que está alcançável, o que você abriu, e deixa fechar. Uma mudança é um plano que lista as regras exatas, e o Histórico pode devolvê-las.

## Camada dois: saída, por programa

A segunda pergunta, o que pode sair da máquina, é onde mora o controle de verdade. O IbexWall carrega um pequeno programa eBPF que observa cada conexão que um programa tenta abrir. Na primeira vez que um programa novo alcança a rede, o IbexWall pergunta: permitir, bloquear ou sempre permitir. Sua resposta é lembrada por programa e por destino.

Isso é mais forte que um firewall por porta, que só enxerga portas. Um navegador e um keylogger usam ambos HTTPS na porta 443; a porta não os distingue. A camada por programa distingue, e funciona sobre TCP, UDP e QUIC.

## Modo Perguntar e a válvula de segurança

Um programa sobre o qual você ainda não decidiu pode ficar no modo Perguntar: a primeira conexão dele espera até você responder, e as conexões retidas mais antigas aparecem primeiro. Uma mudança que pode cortar seu próprio acesso à rede é marcada como arriscada e espera sua confirmação; se você não confirmar a tempo, ela se desfaz sozinha.

## Por que isso continua revisável

Toda mudança de firewall, de entrada ou por programa, passa pelo mesmo motor de qualquer outra mudança no IbexWall: um plano mostra as operações, um snapshot é tirado e o Histórico pode reverter. Um firewall só é tão bom quanto a confiança que você tem nele, e a confiança vem de conseguir ver e desfazer cada regra.
