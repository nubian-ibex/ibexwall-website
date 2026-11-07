---
title: "Compliance on Linux: what it means and what it does not"
description: "Compliance is not certification. What a compliance check can prove about a Linux machine, the six control states, and what an auditor still has to decide."
slug: "compliance-on-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [compliance, frameworks, attestation, export]
related_hardening: []
---

Compliance and certification are different things, and confusing them is how a tool overclaims. This article separates them, and explains what a local compliance check on Linux can and cannot prove.

## Compliance is not certification

Compliance means the mapped technical controls hold on this machine. Certification comes from an independent audit, which also covers processes, people and scope that no program on one computer can see. A tool can say "these technical controls hold"; it cannot say "this organization is certified". IbexWall says the first and never the second.

## The six states

Each control of a framework lands in one of six states:

- Compliant: every required check passed and is fresh.
- Non-compliant: at least one required check failed.
- Not assessed: a check is missing, stale or unknown. This is never a pass.
- Needs attestation: the control is organizational, so a person has to state it holds, with an owner and an expiry.
- Not applicable: every required check says so.
- Excepted: a risk an owner accepted, shown apart, never counted as compliant.

A framework reports counts of each state, never one percentage that hides the not-assessed and attestation groups.

## The first-release frameworks

The first release maps six: IbexWall Baseline (the project's own recommended set), LGPD article 46, CMN 4.893/2021 as amended by 5.274/2025, NIST SP 800-53 Rev. 5, NIST SP 800-171 Rev. 3, and ISO/IEC 27001:2022 Annex A theme 8. Each control carries the reference number, a URL and the date it was consulted; licensed texts are never copied.

## The honest limits

Unknown is never a pass, so a report that cannot prove a control says so instead of guessing. A mapping that is the project's own reading, like LGPD, says so plainly. Attestation controls are organizational and wait for a person, not a check.

## Export as evidence

`ibexctl compliance export` writes a signed report with the date, the profile version, each control's state, the raw check results, the attestations and the head of the audit chain. It is sealed with a device key, so a tampered copy fails verification. That report is evidence a company can collect, not a certificate it can wave.
