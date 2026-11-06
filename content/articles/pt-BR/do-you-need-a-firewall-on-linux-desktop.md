---
title: "Você precisa de um firewall num desktop Linux? O que ele faz"
description: "Um desktop Linux aceita tudo por padrão. Veja o que realmente escuta, como nftables, ufw e firewalld se relacionam e a diferença entre regras de entrada e por programa."
slug: "do-you-need-a-firewall-on-linux-desktop"
date: 2026-11-06
updated: 2026-11-06
tags: [firewall, nftables, rede]
related_hardening: [net.tcp-syncookies, net.source-routing]
faq:
  - q: "Preciso de um firewall num desktop Linux?"
    a: "Se nada escuta conexões externas, um firewall tem pouco a bloquear. Ainda vale tê-lo como rede de proteção para serviços que você instalar depois e para redes em que você não confia."
  - q: "ufw, firewalld e nftables são firewalls diferentes?"
    a: "Não. O nftables é o filtro de pacotes do kernel. ufw e firewalld são ferramentas que escrevem regras de nftables ou iptables para você, com comandos mais simples."
---

Um desktop Linux não precisa de firewall para ser usável, e muitos rodam sem um. Mas ele é uma rede de proteção barata: se um programa passar a escutar numa porta mais tarde, seja por um pacote que você instala, um servidor de desenvolvimento que você esquece ou um serviço que a distribuição ativa, o firewall decide se a rede pode alcançá-lo. A pergunta mais útil é o que está escutando agora.

## Permitir por padrão, em palavras simples

O kernel Linux não filtra nada até que regras sejam adicionadas. O Fedora Workstation vem com o firewalld ativado. O Ubuntu traz o ufw, mas o deixa desligado. Debian e Arch não instalam firewall por padrão. Então, numa máquina Debian ou Arch recém-instalada, toda porta que um programa abre pode ser alcançada pela sua rede.

Isso é menos alarmante do que parece, porque um desktop recém-instalado abre pouquíssimas. Os roteadores domésticos também bloqueiam tráfego não solicitado vindo da internet. O risco é a rede local: um café, um hotel, um apartamento compartilhado, um escritório.

## Veja o que escuta

```sh
sudo ss -tulpn
```

As colunas que importam são o endereço local e o programa. `127.0.0.1` significa que só este computador pode se conectar. `0.0.0.0` ou `[::]` significa qualquer máquina que consiga alcançar você. Entradas normais num desktop são o stub de DNS local, o serviço mDNS (Avahi, UDP 5353) e o serviço de impressão (CUPS, que normalmente fica no loopback). Qualquer coisa que você não reconheça merece uma olhada.

Você também pode testar de fora com o `nmap` em outra máquina, o que mostra o que a rede realmente enxerga, e não o que a máquina acha que oferece.

## nftables, ufw e firewalld

São três camadas, não três rivais.

- O nftables é o mecanismo de filtragem no kernel, e `nft` é o seu comando.
- O ufw ("uncomplicated firewall") é uma interface simples, comum no Ubuntu. O uso típico é `sudo ufw enable` e `sudo ufw allow 22/tcp`.
- O firewalld é uma interface construída em torno de zonas como `public` e `home`, usada pelo Fedora. O uso típico é `sudo firewall-cmd --list-all`.

Escolha a que a sua distribuição já usa. Rodar duas interfaces que gerenciam regras leva a resultados confusos. Para ler o que estiver ativo, `sudo nft list ruleset` sempre funciona, porque toda interface acaba ali ou na antiga camada iptables, que hoje muitas vezes fica sobre o nftables.

## Entrada contra saída

Uma regra de entrada decide quem pode iniciar uma conexão com você. Num desktop, o padrão sensato é recusar tráfego de entrada não solicitado e permitir as respostas às conexões que você iniciou. As três ferramentas fazem isso de fábrica quando ativadas.

A filtragem de saída é outro trabalho. As ferramentas clássicas filtram por endereço e porta, não por programa, então não conseguem dizer "o Firefox pode se conectar, este binário desconhecido não". O controle de saída por programa exige que o kernel diga ao filtro qual processo é dono de uma conexão, e é isso que as ferramentas baseadas em eBPF fazem. É útil para notar um programa que fala com um servidor que você não esperava. Também dá mais trabalho no dia a dia, porque você responde a uma pergunta na primeira vez que cada programa se conecta.

## Quando importa mais

Três situações aumentam o valor de um firewall. Você usa redes públicas ou compartilhadas com frequência. Você roda servidores de desenvolvimento, bancos de dados ou compartilhamentos de arquivos que por padrão escutam em todos os endereços, e se esquece deles. Ou você divide a máquina com outras pessoas, e uma instalação descuidada pode abrir uma porta para todos. Se nada disso se aplica e o `ss` não mostra nada fora do loopback, o firewall é um cinto de segurança que você raramente usa. Mantê-lo ligado custa muito pouco.

## Uma configuração razoável

1. Use a interface que a sua distribuição traz e ligue-a.
2. Mantenha o padrão de recusar conexões de entrada não solicitadas.
3. Abra uma porta só quando você souber dizer qual é o serviço e por quê.
4. Olhe o `ss -tulpn` de novo depois de instalar software de servidor.
5. Se quiser ver o comportamento de saída, adicione monitoramento por programa em vez de escrever regras à mão.

Num notebook que muda de rede, zonas ou perfis ajudam: a zona `public` do firewalld é estrita, e a `home` é mais solta.

## Verifique com o IbexWall

A tela de Firewall lista as regras de entrada e trabalha por meio do firewall que o seu sistema já usa, e a tela de Apps e rede mostra qual programa fala com onde e pergunta na primeira vez que um programa se conecta. O IbexWall guarda as próprias regras em `table inet ibexwall` e nunca edita as da sua distribuição. Cada alteração é um plano que você revisa, com um instantâneo que pode ser desfeito pelo Histórico, e uma regra que poderia cortar a sua conexão espera a sua confirmação. A versão 1.0 está em preparação. Para ter o quadro geral, comece pela [verificação em dez minutos](/pt-br/articles/how-secure-is-my-linux-computer/).
