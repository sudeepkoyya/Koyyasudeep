# FlowGuard — Emergency-Aware Smart Traffic Controller

FlowGuard is an interactive browser-based educational prototype demonstrating a traffic signal controller as a deterministic finite-state machine (FSM), a Theory of Computation concept.

## Run locally
Open `index.html` in any modern browser. No dependencies, build tools, server, or internet connection are required.

## Features
- Four-way intersection visualization with signal lamps.
- Explicit FSM states and transition table.
- Manual stepping and automatic cycle.
- Simulated emergency and pedestrian requests.
- Adjustable North–South and East–West queue estimates.
- Event log and demand-heuristic explanation.
- Responsive layout for laptop and mobile screens.

## FSM
States: `NS_GREEN`, `NS_YELLOW`, `ALL_RED_TO_EW`, `EW_GREEN`, `EW_YELLOW`, `ALL_RED_TO_NS`.

Normal cycle:
`NS_GREEN → NS_YELLOW → ALL_RED_TO_EW → EW_GREEN → EW_YELLOW → ALL_RED_TO_NS → NS_GREEN`

All-red states represent clearance intervals. Emergency and pedestrian buttons enqueue simulated requests; they do not contact emergency services or control real infrastructure. Queue values are user-entered estimates, not live sensor data.

A formal FSM is commonly written as `M = (Q, Σ, δ, q₀, F)`. For this controller, Q is the state set, Σ the input events, δ the transition function, and q₀ is `NS_GREEN`. F is not needed for ordinary ongoing control.

## Deploy to Vercel
Import this repository in Vercel. The project is static: select **Other** as framework, use no build command, and set the output directory to the repository root if prompted.

## 2-minute demo
1. Explain the current `NS_GREEN` state.
2. Click **Next valid state** to step through yellow and all-red clearance.
3. Queue an emergency request and explain that priority is simulated and only handled at a clearance point.
4. Change the queue sliders and click **Choose next phase by demand**.
5. Show the transition table and event log.

## Limitations
Classroom/exhibition simulation only. It does not use real traffic sensors, validated signal timing, live maps, or certified safety logic. Never connect it to real traffic infrastructure.
