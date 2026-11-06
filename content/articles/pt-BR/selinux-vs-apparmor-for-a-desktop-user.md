---
title: "SELinux ou AppArmor para um usuário de desktop: o que saber"
description: "O controle de acesso obrigatório limita um programa invadido. Veja quais distribuições usam SELinux ou AppArmor, como conferir e o que fazer quando algo é bloqueado."
slug: "selinux-vs-apparmor-for-a-desktop-user"
date: 2026-11-06
updated: 2026-11-06
tags: [selinux, apparmor, mac]
related_hardening: []
faq:
  - q: "Qual a diferença entre SELinux e AppArmor?"
    a: "Ambos limitam o que um programa pode tocar, mesmo rodando com todos os direitos. O SELinux rotula cada arquivo e processo e usa uma política sobre rótulos. O AppArmor escreve regras por caminho de arquivo para cada programa."
  - q: "Devo desligar o SELinux ou o AppArmor quando algo é bloqueado?"
    a: "Não. Leia a negação no log, depois corrija o rótulo ou ponha só aquele programa em modo permissivo. Desligar o sistema inteiro remove a proteção de tudo."
---

As permissões normais do Linux respondem uma pergunta: este usuário pode abrir este arquivo? O controle de acesso obrigatório (MAC) adiciona uma segunda: este programa específico pode, seja qual for o usuário em que roda? Se um navegador ou um serviço de rede é comprometido, o MAC limita até onde o intruso vai. O Linux tem dois sistemas comuns para isso, o SELinux e o AppArmor, e você quase com certeza já tem um deles.

## Qual distribuição usa qual

- O Fedora usa SELinux, em modo obrigatório por padrão.
- O Ubuntu usa AppArmor, ativo por padrão.
- O Debian tem o AppArmor ativado por padrão desde o Debian 10, com um conjunto de perfis menor que o do Ubuntu.
- O Arch Linux não ativa nenhum dos dois por padrão. Você pode adicionar qualquer um, e dá trabalho manual.

Você raramente escolhe. Usa o que a sua distribuição mantém, porque a política e os perfis dela são escritos e testados para os pacotes daquele sistema.

## Como eles diferem

O SELinux dá a cada arquivo, processo e porta um rótulo e escreve uma política sobre quais rótulos podem agir sobre quais. É minucioso e fino, e os rótulos vivem com o arquivo, então mover ou copiar um arquivo pode deixá-lo com o rótulo errado. O AppArmor anexa um perfil a um programa e lista os caminhos e capacidades que ele pode usar. É mais simples de ler e escrever, e segue nomes de arquivo em vez de rótulos. Nenhum é "mais seguro" em geral. A força deles depende da política de cada programa, e o que importa num desktop é que o que a sua distribuição entrega esteja ligado.

## Veja se está ligado

SELinux (Fedora):

```sh
getenforce
sestatus
```

`Enforcing` é o que você quer. `Permissive` registra problemas sem impedi-los, e `Disabled` é desligado.

AppArmor (Ubuntu, Debian):

```sh
sudo aa-status
```

Ele lista quantos perfis estão carregados e em modo enforce ou complain. No Debian pode ser preciso instalar os pacotes `apparmor` e `apparmor-utils` e ativar o módulo no boot; se o `aa-status` disser que não está carregado, o kernel precisa de `apparmor=1 security=apparmor` na linha de comando, e a wiki do Debian descreve os passos.

## Quando ele bloqueia algo

Um programa que funciona como root mas falha sob o MAC, ou um serviço que falha depois que você moveu a pasta de dados dele, é a história típica. O sistema está funcionando: ele parou algo que a política não esperava. A resposta é ler a negação, não desligar a proteção.

No SELinux, procure as negações:

```sh
sudo ausearch -m AVC,USER_AVC -ts recent
```

No Fedora, o SETroubleshoot consegue explicá-las em palavras se o alerta de desktop ou o `sealert` estiver instalado. A causa mais comum é rótulo errado em arquivos que você moveu, que `restorecon -Rv /caminho` corrige. Para um serviço que precisa usar uma pasta fora do padrão, dê a ela o rótulo certo com `semanage fcontext` e depois `restorecon`. Se quiser testar se o SELinux é a causa, `sudo setenforce 0` o deixa permissivo até a próxima reinicialização, e `sudo setenforce 1` o liga de novo. Não o deixe assim.

No AppArmor, as negações aparecem no log do kernel:

```sh
sudo journalctl -k | grep -i 'apparmor="DENIED"'
```

Você pode pôr um único perfil em modo complain com `sudo aa-complain /caminho/do/programa`, e voltar com `sudo aa-enforce /caminho/do/programa`. Ou adicionar um override local em `/etc/apparmor.d/local/` para o caminho específico que o programa precisa, e recarregar o perfil com `sudo apparmor_parser -r` no arquivo dele.

## Você precisa fazer algo

Na maioria dos casos, não. Mantenha ligado, atualize o sistema e leia o log quando algo falhar de modo estranho. Não o desative como primeiro passo, porque isso remove uma proteção de todos os programas em troca de consertar um. Se você roda programas fora dos pacotes da distribuição, como um binário do site de um fornecedor, espere que fiquem menos confinados que os empacotados.

## Confira com o IbexWall

O resolvedor, o servidor MCP e os plugins do IbexWall são confinados por perfis AppArmor no Debian e no Ubuntu e por um módulo SELinux no Fedora, entregues em pacotes separados (`ibexwall-apparmor` ou `ibexwall-selinux`). A tela de Postura do sistema informa o estado da proteção do seu sistema, e você pode rever o que cada plugin pode ler e mudar na tela de Plugins. Qualquer mudança é um plano que você revisa e desfaz pelo Histórico. A versão 1.0 está em preparação.
