---
title: "Sobre o IbexWall"
description: "O IbexWall é uma central de segurança livre e de código aberto para Linux, criada pelo projeto Nubian Ibex. Licença, como é construído e como participar."
updated: 2026-11-06
---

O IbexWall é uma central de segurança livre e de código aberto para desktops Linux, publicada sob a licença GPL-3.0-or-later pelo projeto Nubian Ibex. Ele existe porque verificar um computador Linux, entender o resultado e corrigi-lo com segurança não deveria exigir um dia de leitura.

## Princípios

- Mostrar primeiro, mudar depois: toda alteração é um plano que você revisa e pode desfazer.
- Falar com clareza: cada verificação e cada configuração é explicada em palavras que um não especialista consegue acompanhar, e diz o que pode quebrar.
- Manter tudo seu: sem telemetria, sem conta, sem dependência. Os dados ficam no seu computador e o código é aberto.
- Ficar na própria faixa: o IbexWall altera apenas os próprios arquivos e deixa os da sua distribuição em paz.

## Como é construído

O daemon, a linha de comando, o resolvedor de DNS seguro e o servidor do assistente são escritos em Rust. O controle de rede por programa usa eBPF, o firewall é o nftables, os componentes conversam entre si por varlink, e o polkit decide quem pode fazer o quê. A janela é uma interface Svelte 5 dentro do Tauri 2. Os plugins são um único binário assinado, iniciado pelo systemd para cada plugin em seu próprio isolamento.

## Participe

- Leia a [documentação](https://docs.ibexwall.com) e o [código-fonte](https://github.com/nubian-ibex/ibexwall).
- Traduza: o aplicativo e este site estão em inglês, português, espanhol, francês e alemão, e adicionar um idioma não exige código. O [guia de tradução](https://docs.ibexwall.com/contributing/translating/) explica como.
- Revise uma configuração de endurecimento: cada página lista as suas fontes. Se algo estiver errado ou desatualizado, abra uma issue.

## Idiomas

O programa e este site seguem o idioma do seu sistema. Cada página tem um seletor de idioma; uma página que ainda não foi traduzida mostra o texto em inglês e avisa.
