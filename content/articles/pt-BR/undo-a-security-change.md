---
title: "Como desfazer uma alteração de segurança no Linux e sair de um bloqueio"
description: "Crie um instantâneo antes de cada alteração, desfaça pelo Histórico, entenda por que mudanças de rede esperam confirmação e recupere o acesso após um bloqueio."
slug: "undo-a-security-change"
date: 2026-11-06
updated: 2026-11-06
tags: [reversão, recuperação, segurança]
related_hardening: [kernel.kexec, net.rp-filter]
faq:
  - q: "Como desfaço uma alteração de firewall ou DNS que quebrou a minha rede?"
    a: "Num terminal ou console local, liste as alterações recentes e desfaça a última. Se você a fez com o IbexWall e não a confirmou a tempo, ela é desfeita sozinha."
  - q: "E se eu ficar bloqueado fora de uma máquina remota?"
    a: "Uma alteração que poderia cortar a rede espera confirmação e é revertida se você não confirmar. Com outras ferramentas, use o console do provedor, ou um boot de recuperação, para remover a regra."
---

A melhor proteção contra uma alteração ruim é poder desfazê-la. Antes de editar um firewall, uma configuração de DNS ou um parâmetro do kernel, guarde o que existe agora, mude uma coisa, teste e mantenha um caminho de volta que não dependa do que você está mudando. Este artigo trata desse hábito e de como o IbexWall o faz por você.

## Por que o instantâneo vem primeiro

A maioria das alterações de segurança são pequenas edições em arquivos: uma linha em `/etc/sysctl.d`, um drop-in do SSH, um conjunto de regras do nftables. Se você copiar o arquivo antigo antes, desfazer é copiar de volta. Quando a alteração mexe em várias coisas ao mesmo tempo, um erro numa delas dificulta lembrar como eram as outras.

À mão, o mínimo é:

```sh
sudo cp -a /etc/ssh/sshd_config.d /root/sshd_config.d.bak
```

Edite, teste e só depois feche a sua sessão antiga. Em mudanças de firewall, a ordem segura é abrir um segundo terminal, aplicar a regra, conferir se você ainda consegue se conectar com uma nova conexão e manter o primeiro terminal aberto até conseguir.

## Alterações que podem cortar o seu acesso

Algumas alterações tiram o caminho pelo qual você chegou à máquina: uma regra de firewall que bloqueia a porta SSH, uma configuração de DNS que aponta para um resolvedor inalcançável, um kill switch de VPN, uma regra que isola o host. O perigo não é a alteração, é que você não consegue corrigi-la de onde está.

O IbexWall trata esses casos de outro jeito. Uma alteração marcada como risco de rede espera a sua confirmação, por padrão dentro de 60 segundos. Se você não confirmar, porque perdeu a conexão ou a página parou de responder, ela se desfaz sozinha. É essa a ideia: o desfazer não depende de você. Se o próprio daemon parar no meio do caminho, quando ele iniciar de novo reverte uma alteração que estava sendo aplicada ou esperando confirmação.

Você confirma pela interface ou pela linha de comando:

```sh
ibexctl confirm <transaction-id>
```

## Desfazer pelo Histórico

Toda alteração que o IbexWall aplica cria antes um instantâneo. A tela Histórico lista todas, e desfazer uma restaura o que havia. O mesmo num terminal:

```sh
ibexctl history
ibexctl rollback <transaction-id>
```

Algumas alterações não são totalmente reversíveis, e o IbexWall avisa antes de você aplicá-las. Por exemplo, [proibir o carregamento de outro kernel](/pt-br/hardening/kernel.kexec/) não pode ser desfeito até a próxima reinicialização. Outras podem quebrar uma configuração específica, como [descartar pacotes com endereço de origem forjado](/pt-br/hardening/net.rp-filter/), que pode não servir a algumas VPNs e a máquinas com várias rotas. O plano mostra esses avisos primeiro.

## Recuperar o acesso após um bloqueio

Se você usou outras ferramentas, ou a reversão automática não ajudou, trabalhe a partir do lugar mais próximo onde você ainda tem controle.

1. Máquina local: mude para um console de texto com Ctrl+Alt+F3, ou use o desktop com a rede desligada. Você não precisa de rede para executar um comando local.
2. Servidor virtual: use o console web do provedor, que não passa pela rede que você quebrou.
3. Remova a causa. Para as regras de firewall do IbexWall, `ibexctl rollback` é o caminho. Em último caso, a tabela dele pode ser apagada, porque é uma tabela separada que guarda só as próprias regras: `sudo nft delete table inet ibexwall`. Não apague tabelas que você não criou.
4. Para um arquivo de sysctl, remova-o de `/etc/sysctl.d/` e defina o valor antigo com `sysctl -w`.
5. Se nada iniciar, faça boot de um sistema live ou da entrada de recuperação, monte o sistema de arquivos raiz e restaure a sua cópia do arquivo.

Depois, descubra por que falhou antes de tentar de novo. Muitas vezes foi um detalhe inesperado, como uma segunda interface de rede.

## Mantenha um registro

Uma regra prática que vale para pessoas e para ferramentas: anote o que você mudou, por quê e como reverter. O Histórico do IbexWall guarda isso, e cada entrada é gravada num registro de auditoria cujas linhas são encadeadas, de modo que edições em linhas antigas podem ser detectadas (`ibexctl audit verify`).

## Verifique com o IbexWall

A tela Histórico lista as alterações e as desfaz, e `ibexctl history` e `ibexctl rollback` fazem o mesmo num terminal. Toda alteração é um plano que você revisa antes, com um instantâneo que pode ser restaurado, e as alterações com risco de rede esperam a sua confirmação ou voltam sozinhas. O modo de emergência (endpoint.isolate), que corta a rede exceto para os endereços que você indicar, também é desfeito pelo Histórico. A versão 1.0 está em preparação.
