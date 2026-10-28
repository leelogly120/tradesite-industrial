---
title: "Roll-Forming Lift Systems: Clarify Stop-Control Boundaries"
description: "Clarify a roll-forming lift stop-control claim by identifying each machine, the proposed cross-machine boundary and the supplier records needed for review."
date: 2026-10-26
updated: 2026-10-28
author: "ARCLIFT Technical Editorial"
tags: ["roll forming","roll forming lift former emergency stop boundary","buyer planning"]
coverImage: "/images/equipment/coil-real-handling.webp"
coverAlt: "Elevated red forming apparatus beside steel building frames and ground level coils"
coverCaption: "Reference photograph of elevated forming gear beside coils. It cannot show a stop circuit."
draft: false
---

Count stop buttons as separate until a drawing shows that one control stops both the lift and the former. Two red buttons on two machines are two scopes. A sentence that says "emergency stops are included" does not merge them. Electrical boundaries in general are in the [electrical interface guide](/blog/roll-forming-line-electrical-control-interfaces/). The machines themselves are still specified in the [line specification](/blog/roll-forming-line-specification-long-span-roof-panels/).

**Contents**

- Count the stop buttons you were actually offered
- Compare a shared stop with two separate stops
- A combined stop may not fit
- Stop-boundary lines to attach
- FAQ

<!-- audit-section: buyer-intent -->
## Count the stop buttons you were actually offered

### Name each machine's own control

Write the lift and the former as two rows. ARC-T25 or ARC-C25 may be the 25m screen. ARC-T18 may be the 18.5m screen. ARC-RF8 may be the former, with a catalog sheet class of 0.3–1.0mm that says nothing about controls. For each row, ask whether a stop control is included with that machine. A yes on one row is not a yes on the other. An anonymous offer once listed "E-stops" once, under a package title, and the site received a button on the former only.

### Ask if any control is claimed to cross the gap

The only interesting sentence is one that says a control on machine A stops machine B, or that a single station stops both. If the offer does not say that, do not add it. If it does say that, ask for the drawing or the line item, and ask who owns that scope: lift seller, former seller, or a third party. Until that owner is named, the cross claim is a word. Confirm on RFQ belongs on the claim, not on the existence of ordinary buttons.

### Refuse to design the circuit on this page

Do not propose a category, a relay, or a sequence. This page is purchase scope. The supplier either included a described function or did not. Your job is to stop a combined function from being assumed. The destination's own reviewers will read whatever document the supplier actually sends. You cannot replace that document with a blog.

### Keep the sheet class out of the stop row

0.3–1.0mm is not a control statement. A thicker coil does not add a button, and a thinner coil does not remove one. If someone has pasted the sheet class into the controls cell, delete it and put the class back on the material row.

<!-- audit-section: conditions -->
## Compare a shared stop with two separate stops

### Read the offer, then the drawing

| What you were given | How to record it | What you still need |
| --- | --- | --- |
| A stop on the lift only | Lift scope, former unanswered | Ask the former seller |
| A stop on the former only | Former scope, lift unanswered | Ask the lift seller |
| A sentence that says both | A claim, not a circuit | The drawing or line item, and the owner |
| No stop words at all | Unknown | Confirm on RFQ; do not draw a button |

![Forming module suspended beside a red lifting structure](/images/equipment/coil-real-module.webp)

*Reference photograph of a forming module beside the lift. It cannot show a stop button or a circuit.*

### Separate "included" from "coordinated"

Included means that machine has its own control in the price. Coordinated means someone claims a relationship between machines. Buyers mix those words because both sound like safety. They are different purchases. Write the word the offer actually used, and if it used neither, write unknown. Do not upgrade "included" into "coordinated" to make a risk register look closed.

### Ask who tests the claim

If a cross claim exists, ask who will demonstrate it and against which document. Do not set a date and do not describe a test procedure. The useful answer is a name of a party and a document title. If the party is "the site," you have been handed the scope back. Say so on the RFQ before you accept the machine.

### A photograph of two machines is not a link

![Coils and forming equipment at the side of a steel building](/images/equipment/coil-real-cover.webp)

*Reference photograph of coils and equipment at the building. It cannot connect two control systems.*

Machines that stand together in a picture are not electrically together. Use the picture to remember the site. Use the table to remember the scope. If a seller circles the picture, ask them to circle the line on the offer instead.

<!-- audit-section: evidence-tradeoffs -->
The trade-off is a simple pair of buttons against a claimed link. Separate buttons are easy to count and easy to buy. A link is a different scope and needs an owner. The limitation is that package language hides the link inside one noun. The constraint is the missing drawing. The interface, if it exists, is that drawing, not the fact that both machines are red or stand on the same slab.

An anonymous line offer used one sentence: "emergency stops are included with the package." The lift page showed a button on the platform. The former page showed a button at the operator station. No drawing showed a wire, a relay, or a stated function between them. The buyer counted one stop because the sentence was singular. The machines still had two buttons and no stated link. The useful reply asked the seller to split the sentence into two rows: stop on the lift, in this purchase; stop on the former, in this purchase; cross-machine link, not in this purchase. ARC-T25, ARC-C25, and ARC-RF8 could stay on the height and sheet screen while that third row stayed open.

A second anonymous file treated a wind stop for the panel as if it were the machine stop. The panel line had a cut-off when wind rose. That cut-off did not open a circuit on the lift, and it did not open a circuit on the former. Writing "stops included" next to the wind note made a reviewer think the machines were tied together. They were not. The note that replaced it listed the wind stop as a panel rule, the lift button as a lift device, and the former button as a former device. Any claim that one action drops both machines had to arrive as a drawing, or it stayed out of the file.

Do not recommend a circuit from this page. Count devices you can see on the offer, name the machine each device is mounted on, and mark every missing link unknown. A shared color, a shared slab, or a shared commercial noun is not a stop boundary. Confirm on RFQ who owns the drawing if a seller says the link exists and cannot attach it.

<!-- audit-section: limitations-not-fit -->
## A combined stop may not fit

### One noun for two machines

This shortlist may not fit when the only evidence of a combined stop is the word package, line, or system. Those nouns are commercial. They do not move a signal. Split the rows. If the seller cannot split them, the combined claim is not in the offer.

### A button counted twice

It may not fit when the lift button is also described as the former button without a second device or a stated link. Count devices. If you see one, write one, and name the machine it is mounted on. The other machine stays unknown.

### A destination rule used as a wiring diagram

It may not fit when a buyer pastes a destination rule into the RFQ as if the rule itself supplied the circuit. The rule may tell you to ask. It does not draw the ask. Keep the rule in the document list. Keep the circuit question as unknown until a supplier answers it.

### Height class offered as reassurance

It may not fit when 25m is treated as a more complete control package than 18.5m. Both are catalog height screens. Neither is a stop circuit. Choosing C25 over T18 because the stop question feels safer is a change of base, not a change of control scope.

![Long panel beside elevated forming equipment](/images/equipment/coil-real-panel.webp)

*Reference photograph of a panel leaving the equipment. It cannot prove a stop link between machines.*

<!-- audit-section: project-checklist -->
## Stop-boundary lines to attach

- Work height and the catalog screen, 18.5m or 25m
- Roof geometry at the outlet
- Profile, material, and thickness, kept off the stop row
- Wind stop for the panel, which is not the machine stop
- Ground or floor under both machines
- Access for the people who will stand at the controls
- Outrigger or track footprint
- Destination country and who reviews controls there
- Chassis or carrier, so a truck cab is not confused with a stop station
- Transport split between lift and former
- Power and who owns each stop control
- Documents: any drawing that claims a cross-machine stop, or "none supplied"

<!-- audit-section: cta-editorial-note -->
Send the work height, the site, the destination, the transport split, the handover zone, and the floor note. The signed schedule is project-specific. Editorial images do not link two stop circuits.

Open [ARC-T25](/products/arc-t25-truck-mounted-roll-forming-lift/), [ARC-C25](/products/arc-c25-crawler-roll-forming-lift/), or [ARC-RF8](/products/arc-rf8-roll-forming-machine/). [Request a quote](/contact/?request=quote), WhatsApp +86 15515922444, or [leelogly120@gmail.com](mailto:leelogly120@gmail.com). The <a href="https://www.hse.gov.uk/work-equipment-machinery/puwer.htm" target="_blank" rel="noopener noreferrer">HSE guidance on work equipment</a> is a Great Britain note. It does not draw the boundary between these machines.

## FAQ

#### If both machines have a stop, are they linked?
No. Count them as separate until a drawing says one control stops both.

#### Can you recommend a circuit?
No. Ask who included the function. This page does not design it.

#### Does the sheet class matter here?
Only as a material line. 0.3–1.0mm is the ARC-RF8 catalog band, not a control.

#### What do I send if the offer is silent?
Write unknown next to each machine, and send that with the height screen.
