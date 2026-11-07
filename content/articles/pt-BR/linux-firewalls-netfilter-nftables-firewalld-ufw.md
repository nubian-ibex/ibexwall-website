---
title: "Firewalls do Linux: netfilter, nftables, firewalld e ufw"
description: "Todo firewall do Linux assenta sobre o mesmo framework do kernel, o netfilter. O que são iptables, nftables, firewalld e ufw, como suas interfaces diferem, e o que têm em comum."
slug: "linux-firewalls-netfilter-nftables-firewalld-ufw"
date: 2026-11-06
updated: 2026-11-06
tags: [firewall, netfilter, nftables, firewalld, ufw]
related_hardening: []
---

Pergunte qual firewall o Linux usa e a resposta muda por distribuição: firewalld no Fedora, ufw no Ubuntu, nftables puro em outros lugares. Por baixo, todos são a mesma coisa. Este artigo separa as camadas.

## O ponto em comum: netfilter

O netfilter é o framework de filtragem de pacotes dentro do kernel Linux. Todo firewall no Linux é uma interface que grava regras no netfilter. Esse é o único ponto que todos compartilham: seja qual for a ferramenta, a decisão acontece nos mesmos ganchos do kernel, para cada pacote que passa.

## A camada de comando

- O iptables é a ferramenta de espaço de usuário antiga. Ele é anterior ao framework atual e está em modo de manutenção na maioria das distribuições.
- O nftables é seu substituto moderno. Ele une o que antes eram várias ferramentas (IPv4, IPv6, ARP, bridging) em uma só, com um único comando `nft` e uma única sintaxe de regras.

A maioria das pessoas não escreve regras de iptables ou nftables à mão. Elas usam uma interface, e é aí que as interfaces divergem.

## As interfaces e suas UIs

- O firewalld é o daemon no Fedora, RHEL e openSUSE. Ele pensa em zonas (casa, público, trabalho) e serviços, e aplica mudanças em tempo de execução sem derrubar conexões existentes. Suas interfaces são o `firewall-cmd` na linha de comando e o gráfico `firewall-config`.
- O ufw, Uncomplicated Firewall, é o padrão do Debian e do Ubuntu. É uma camada fina sobre iptables ou nftables com uma sintaxe muito mais simples: `ufw allow 22/tcp`, `ufw enable`. Sua interface gráfica é o `gufw`.
- O nftables puro é a escolha no Arch e em contêineres, onde a distribuição não impõe uma interface e o administrador escreve a tabela diretamente.

Ou seja, os "firewalls diferentes" são, na maioria, interfaces diferentes sobre um mesmo motor. A confusão é real porque a sintaxe, os arquivos de configuração e o modelo mental diferem, mas a propriedade de segurança, um pacote é permitido ou descartado por uma regra do netfilter, é idêntica.

## O que as UIs têm em comum

Toda interface de firewall, gráfica ou não, responde as mesmas três perguntas: o que pode entrar, o que pode sair, e está ligado. O firewalld pergunta por zona e serviço; o ufw pergunta como uma lista de regras de permissão; uma tabela nftables pura pergunta como cadeias de regras. Todas compartilham também o mesmo modo de falha: um erro de regra pode te deixar de fora de uma máquina remota, porque o firewall faz exatamente o que foi mandado.

## O que o IbexWall acrescenta

O IbexWall trabalha através do que já existe. Numa máquina com firewalld ou ufw, ele conduz essa interface e deixa as regras da própria distribuição intactas; numa máquina sem nenhum dos dois, ele gerencia sua própria tabela nftables `inet ibexwall`. Em ambos os casos, ele só grava na própria tabela, nunca na tabela de outro programa.

Duas coisas mudam para a pessoa:

- Revisar antes de aplicar. Você vê as regras exatas que uma mudança vai adicionar, o que elas vão afetar e o que pode quebrar, antes de qualquer coisa ser gravada. Uma mudança que pode cortar sua rede espera sua confirmação.
- Controle por programa. Por cima do firewall, o IbexWall usa eBPF para decidir quais programas podem alcançar a rede, e pergunta na primeira vez que um novo tenta.

O firewall continua sendo o mesmo netfilter de sempre. O que o IbexWall muda é que ele vira um plano que você revisa e pode desfazer, em vez de um comando que você roda e torce.
