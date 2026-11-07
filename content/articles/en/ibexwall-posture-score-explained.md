---
title: "What the IbexWall posture score means"
description: "The score out of 100 is a summary of what a program could read about your machine. What it includes, what it does not, and how to read it without overtrusting it."
slug: "ibexwall-posture-score-explained"
date: 2026-11-06
updated: 2026-11-06
tags: [posture, score, checks, findings]
related_hardening: []
---

The Overview screen opens with a number, a score out of 100. A number invites overtrust, so it helps to know exactly what it summarizes and where it is deliberately silent.

## What the score is made of

The score is computed from the check results the plugins report: disk and swap encryption, Secure Boot and kernel lockdown, the firewall, accounts (empty passwords, stray uid 0, lockout), whether sudo needs a password, updates, open ports and more. Each check has an outcome: pass, fail, not applicable, or not assessed.

A passing check contributes to the score; a failing one lowers it. Not applicable checks are left out, and not assessed checks are never counted as passing.

## What the score does not know

The score is a summary of settings a program could read. It does not know your password, whether you reuse it, what you download, or which scripts you run. It cannot see a phishing email or a malicious browser extension. A high number means the basics are in place, not that nothing can happen. Treat a low number as a to-do list, and a high one as "the floor is covered".

## The parts behind the number

System posture lists every check behind the score, grouped, so you can see which setting drove the number down. Findings are the failing checks, each with a plain explanation and a severity. Protections are the things already in place. When a check could not read its input, it says so instead of guessing, because a number that hides its own ignorance is worse than a lower, honest one.

## How a fix flows from it

Every finding links to a fix, and every fix is a plan you review first: the exact files, rules or services it will change, and what it could break. A change that could cut your network waits for your confirmation, and History can undo anything. The score goes up when you apply a fix, and you can watch it move, which is the point: the number is progress, not a verdict.
