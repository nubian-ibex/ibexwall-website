---
title: "Vale a pena ligar o Secure Boot no Linux? O que ele cobre e o que não"
description: "O Secure Boot confere a assinatura do código que inicia o computador. Veja o que ele protege, o que não protege, como funcionam o shim e a MOK, e como conferir o seu."
slug: "is-secure-boot-worth-it-on-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [secure-boot, boot, firmware]
related_hardening: [kernel.kexec]
faq:
  - q: "Vale a pena ligar o Secure Boot no Linux?"
    a: "Sim, para a maioria. Ele impede que código não assinado rode na inicialização e permite que o kernel ligue o lockdown. Ele não protege arquivos com o sistema rodando, nem um disco roubado que não está cifrado."
  - q: "Como sei se o Secure Boot está ligado?"
    a: "Rode mokutil --sb-state. Ele imprime SecureBoot enabled ou disabled."
---

Para a maioria dos usuários de desktop, sim: o Secure Boot vale a pena ligar, e as principais distribuições Linux funcionam com ele. Ele fecha uma porta específica, que é código não assinado rodando antes do início do sistema operacional. Ele não torna seguro o sistema em execução e não protege dados num disco que não está cifrado.

## O que ele faz

Quando o computador liga, o firmware UEFI pode recusar qualquer coisa cuja assinatura ele não confia. Com o Secure Boot ligado, o firmware confere o gerenciador de boot, o gerenciador confere o kernel, e o kernel pode conferir os módulos que carrega. Uma ferramenta que se instala na cadeia de boot (um bootkit) precisa estar assinada por uma chave em que o firmware confia, ou não roda.

Outro efeito importa mais no dia a dia. Com o Secure Boot ligado, o kernel pode iniciar em modo lockdown, que fecha caminhos de o root alterar o kernel em execução, como escrever na memória do kernel ou carregar módulos não assinados.

## O que ele não faz

- Não protege contra malware que roda como você depois que o sistema iniciou.
- Não cifra nada. Quem tiver seu notebook ainda lê um disco não cifrado. Veja [criptografia de disco com LUKS e TPM2](/pt-br/articles/disk-encryption-on-linux-luks-and-tpm2/).
- Não confere seus arquivos, scripts ou o conteúdo da sua pasta pessoal.
- Depende do firmware. Uma cadeia de boot assinada com firmware desatualizado e vulnerável, ou um gerenciador antigo e revogado, é tão forte quanto a parte mais fraca.
- Ele confia nas chaves do seu firmware, incluindo a que assina o componente de boot comum, o shim.

## Shim e MOK

A maioria dos firmwares confia numa chave da Microsoft. As distribuições Linux não conseguem assinar todo kernel com ela, então entregam um programa pequeno e assinado chamado shim. O firmware confia no shim, e o shim confia na chave da própria distribuição e numa lista que o dono controla, chamada MOK (Machine Owner Key).

A MOK é o jeito de rodar módulos de kernel de terceiros, como alguns drivers de vídeo ou virtualização, com o Secure Boot ligado. Você assina o módulo (ou deixa a ferramenta da sua distribuição fazer isso), registra a chave com `mokutil --import`, reinicia e confirma o registro na tela azul mostrada na inicialização, com a senha que você escolheu. Nada é registrado sem você no console, e é essa a intenção.

Se um módulo não carrega e o registro menciona "required key not available", ele não está assinado para essa cadeia de chaves.

## Lockdown

Confira o modo do kernel:

```sh
cat /sys/kernel/security/lockdown
```

O modo ativo aparece entre colchetes: `[none]`, `[integrity]` ou `[confidentiality]`. O integrity bloqueia o que permitiria ao root modificar o kernel. O confidentiality também bloqueia a leitura de segredos do kernel. Muitos kernels de distribuição escolhem integrity quando o Secure Boot está ligado, mas confira o seu em vez de supor. O lockdown é o motivo de ferramentas antigas, incluindo acesso direto à memória, pararem de funcionar com o Secure Boot ativado.

## Como conferir

```sh
mokutil --sb-state
```

Instale o `mokutil` primeiro se o comando não existir. Em sistemas com systemd, `bootctl status` também mostra o estado do Secure Boot e a configuração do firmware. Onde a máquina não tem UEFI (BIOS antigo ou algumas máquinas virtuais), nenhum dos dois mostra resultado e não há o que ligar.

Para ligar, abra a configuração do firmware (geralmente Del, F2 ou F10 durante a inicialização) e ative o Secure Boot. No Arch Linux e em algumas outras configurações você precisa antes assinar seu próprio gerenciador de boot ou usar uma ferramenta como o `sbctl`, porque a instalação não traz binários assinados; siga a página de Secure Boot da wiki do Arch em vez de adivinhar a ordem dos passos.

## Vale o esforço

Onde sua distribuição cuida da assinatura, o custo é uma configuração e um registro ocasional de chave, e você ganha proteção contra uma classe de ataques persistentes e o modo lockdown. Se você compila kernels próprios ou depende de módulos não assinados, o trabalho é maior e o ganho menor. Criptografia de disco e atualizações merecem atenção primeiro.

## Confira com o IbexWall

A tela de Postura do sistema cobre boot, disco, firewall e contas, e as configurações de hardening do kernel no catálogo explicam o que cada mudança afeta, como a que [proíbe carregar outro kernel durante a execução](/pt-br/hardening/kernel.kexec/). O IbexWall lê o estado e diz o que corrigir. As mudanças nele são planos que você revisa e pode desfazer pelo Histórico. A versão 1.0 está em preparação.
