---
title: "Electrical Interface List for a Roll-Forming Project"
description: "Define power, signal, safety and handover interfaces before an approved electrical schedule; this guide does not specify wiring, control brands or compliance."
date: 2026-07-27
author: "ARCLIFT Technical Editorial"
tags: ["roll forming", "electrical interfaces", "control handover", "project documentation"]
coverImage: "/images/editorial/electrical-interface-boundary.svg"
coverAlt: "Conceptual boundary between site supply, a coordinated machine group, and handover systems"
coverCaption: "Conceptual planning material. AI-assisted editorial diagram; not evidence of ARCLIFT equipment, configuration, project, capability or result. Cover is a representative editorial concept only; it is not source evidence, a wiring diagram or an approved schedule."
draft: false
---

Electrical discussions become unreliable when a buyer asks for a voltage and receives a control-system promise. A useful first artifact is narrower: an **electrical interface list** that names incoming supply, coordinated subsystems, signals, states, isolation responsibilities and document owners before an approved schedule exists. The list does not specify wiring, choose a PLC or HMI, design cybersecurity, certify a safety function or establish compliance. It gives the project team a controlled place to separate known interfaces from design decisions that remain open.

**Contents**

- Draw the machine boundary
- Record power and isolation inputs
- Build the handover list
- Release controlled documents
- FAQ

<!-- audit-section: buyer-intent -->
## Draw the machine boundary

The buyer's immediate decision is whether the electrical interfaces are defined well enough for a project-specific schedule to begin. This is not the whole line specification covered in the [long-panel roll-forming guide](/blog/roll-forming-line-specification-long-span-roof-panels/), and it is not the operating-zone discussion in the [remote-control safety planning article](/blog/remote-control-aerial-platform-safety-planning/).

### Incoming supply point

Identify the boundary where the site's electrical installation hands supply to the machine or coordinated machine group. Record the document that defines the point, the responsible party on each side and the information still needed. The boundary should be visible on an interface diagram without pretending to be a wiring diagram.

The official consolidated record for <a href="https://webstore.iec.ch/en/publication/71256" target="_blank" rel="noopener noreferrer">IEC 60204-1:2016+AMD1:2021 CSV</a> identifies edition 6.1 and describes electrical, electronic and programmable electronic equipment of machines beginning at the point of connection of the supply. That scope helps locate an interface; it does not prescribe this project's wiring and is not evidence of ARCLIFT or project compliance.

### Coordinated subsystems

A roll-forming project may connect material handling, a feeder, forming stands, cutting equipment, runout support, marking, packaging or other functions. Do not assume that sharing a line layout means sharing one control owner. List each subsystem, its current design status and the physical or informational boundary it presents.

For every interface, identify whether it is power, command, permissive, status, alarm, timing, material flow or documentation. Mark bidirectional exchanges explicitly. If a subsystem is future, optional or supplied by another party, show that status rather than drawing it as a settled part of the machine.

### Site-control boundary

Site systems may request availability, receive status or coordinate upstream and downstream equipment. The interface list should describe the required business or process outcome without selecting a protocol, network, address structure or cybersecurity design. Those details belong in approved project documents.

Separate remote observation from remote control. A status displayed elsewhere does not automatically authorise commands, resets or bypasses. Record who may request each function, where final authority sits and which risk or electrical document will define the behaviour.

![Non-wiring diagram of electrical and control boundaries](/images/editorial/electrical-interface-boundary.svg)

*AI-assisted editorial diagram; not evidence of ARCLIFT equipment, configuration, project, capability or result. Conceptual diagram, not a wiring diagram, safety circuit or approved schedule.*

<!-- audit-section: conditions -->
## Record power and isolation inputs

The interface list should capture the buyer's destination conditions and ownership questions without converting them into a technical design. Values must come from controlled site and project records. Unknowns stay open.

### Voltage, frequency and earthing fields

Record nominal voltage, frequency, phase arrangement, known variation limits and the earthing information requested by the competent electrical reviewer. State the source, revision, units and owner for each value. A website field or email shorthand is not enough for final design.

Do not infer cable size, protective devices, short-circuit rating, electromagnetic measures or power demand from the nominal supply alone. Those outputs depend on the approved configuration, destination rules and detailed design. The interface list only establishes which data must cross the boundary.

### Isolation ownership

Distinguish an operating stop, an emergency stop, a safeguard response and energy isolation. The project risk and electrical documents must define the functions and their relationships. An emergency-stop device is not, by itself, a complete isolation procedure.

In covered U.S. servicing and maintenance context, <a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147" target="_blank" rel="noopener noreferrer">OSHA 29 CFR 1910.147</a> addresses control of hazardous energy. That is U.S. jurisdiction-specific context, not a global design rule. Record who provides isolating means, who controls site procedures and how subsystem energy sources are documented.

### Cable-route constraints

Map the permitted route, entry direction, distance constraints, environmental conditions, mechanical protection needs and separation requirements as project inputs. Do not publish a cable route taken from a sensitive site plan. A preliminary diagram can use anonymised zones and blank distances.

Include interfaces with moving structures, access ways, material travel and maintenance positions. If the route crosses another contractor's scope, name the handover document and owner. Do not let a cable-path assumption become an unrecorded installation constraint.

![Blank matrix for machine states signals responses and owners](/images/editorial/electrical-state-responsibility-matrix.svg)

*AI-assisted editorial diagram; not evidence of ARCLIFT equipment, configuration, project, capability or result. Illustrative states; approved risk and electrical documents define final functions.*

<!-- audit-section: project-checklist -->
## Build the handover list

The electrical interface list should be short enough to control and rich enough to expose missing owners. A project release check can include:

- Incoming **power** point, voltage, frequency, phase and earthing evidence status.
- Each coordinated subsystem and its material **feed** or process boundary.
- Normal stop, safeguard, fault and recovery **control** states requiring definition.
- Site **access** and cable-route constraints, including protected work zones.
- Isolation points and the signed owner of operating and maintenance procedures.
- Destination electrical review and required **documentation** language.
- Profile or product **length** signals that cross an upstream or downstream boundary.
- Roof, floor or support **geometry** only where it affects route or interface placement.
- Transport and installation handoffs that change the electrical configuration.
- Open assumptions, evidence owner, target document and change-control status.

### Signals and alarms

For each exchange, record the initiating system, receiving system, purpose, normal state, abnormal state and owner. Use functional names such as “ready to receive material” or “cut cycle complete” before assigning a technology. That keeps the list readable to mechanical, electrical and operational reviewers.

Alarms require an expected response and an authority model. A message without a defined owner can produce noise rather than control. If the project has not decided whether an alarm stops equipment, blocks a start or only informs an operator, label the behaviour unresolved.

### Normal stop and safeguard states

Define the questions before the logic: what initiates the state, which subsystems respond, what energy or movement remains, what indication appears and who may reset. The <a href="https://www.iso.org/standard/73481.html" target="_blank" rel="noopener noreferrer">ISO 13849-1:2023 official standard record</a> locates a methodology for safety-related parts of control systems. It does not select this project's safety functions or performance levels.

Avoid the phrase “the E-stop makes the line safe.” A project needs a complete risk-based concept that considers hazards, states, energy and intervention. The interface list records where those decisions will be documented; it does not make them.

### Maintenance energy isolation

List every energy domain identified by the project and the boundary owner for each isolating means. Include stored or supplied energy only when the approved risk process identifies it. Do not turn a generic list into an assertion about a configuration that has not been defined.

Record the document that will govern lockout, verification, release and return to service. In a multi-supplier system, each supplier should provide controlled information for its boundary while the project owner coordinates the site procedure.

<!-- audit-section: evidence-tradeoffs -->
Interface detail has a useful stopping point. Too little detail hides signal ownership and hazardous assumptions; too much preliminary detail freezes a brand or logic architecture before the risk review and design are ready. The trade-off is managed by defining functions, states, owners and evidence first, then reserving implementation for approved schedules.

![Layered example of an electrical handover document stack](/images/editorial/electrical-document-stack.svg)

*AI-assisted editorial diagram; not evidence of ARCLIFT equipment, configuration, project, capability or result. Example set; required documents depend on configuration and destination requirements.*

<!-- audit-section: limitations-not-fit -->
## Release controlled documents

Construction, connection, software implementation, commissioning and functional-safety declarations belong after controlled design. The electrical interface list would not fit those purposes because it records boundaries and open decisions, not an approved solution. Keep every open item visible until the responsible reviewer closes it in signed project documents.

### I/O and document language

Agree the language, units, naming convention, tag structure, revision method and required deliverable formats. Decide which records are editable working files and which are controlled release documents. Avoid publishing actual I/O lists, network information or site identifiers.

An I/O count is an output of design, not a procurement shortcut. The number can change with configuration, safeguards, diagnostics and integration. Keep the preliminary interface list functional and let the approved design establish detailed points.

### Change control

Every change should identify the initiating requirement, affected interfaces, risk-review impact, document revisions and authorising roles. A change to upstream equipment, a product recipe, a site system or a safeguard can cross several boundaries even if the request appears local.

Maintain one change register that links technical decisions to controlled drawings and test records. Do not rely on marked-up screenshots or chat messages as the final configuration record. Preserve the superseded revision according to the project document plan.

### Risk-review sign-off

The project should identify who owns the machinery risk process, electrical design review, site installation review, cybersecurity decisions and destination acceptance path. A supplier's interface data supports those reviews but does not replace them.

Sign-off should state the scope, revision and unresolved items. If an interface remains provisional, the document should say what activities are blocked. A signature without a clear scope can create false confidence.

<!-- audit-section: cta-editorial-note -->
Send only the electrical interface list through a secure project channel to ARCLIFT as a technical selection and supply partner. Include controlled site power information, machine and feed boundaries, signal purposes, isolation owners, destination documentation and signed open-item responsibility. If height, floor, roof geometry, transport route or work-zone access affects cable or subsystem placement, identify it as a project-specific input for the proper reviewer. This request does not promise suitability, fit, approval, quotation, configuration, availability, result or response time. The editorial diagrams are non-wiring explanations and cannot replace final signed electrical, risk or commissioning documents.

## FAQ

#### What starts the electrical interface list?

Start with the incoming supply boundary, coordinated subsystems, site-control boundary, required functions and responsible parties. Add controlled destination inputs and label every unresolved design output.

#### Is an E-stop an isolation procedure?

No. Emergency stopping and hazardous-energy isolation address different conditions. The project risk, electrical and site procedures must define their functions and relationship under applicable destination rules.

#### Who defines handover signals?

The parties on both sides of each interface should agree the purpose, states, response, ownership and controlled record. The project integrator or designated authority coordinates the complete system.

#### Does the record specify a PLC brand?

No. It defines functional interfaces before implementation. Brand, hardware, software, connectivity and detailed I/O remain subject to approved project design and documentation.
