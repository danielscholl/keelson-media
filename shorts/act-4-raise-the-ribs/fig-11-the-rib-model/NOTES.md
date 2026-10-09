# the-rib-model (FIG. 11)

**Concept (what, why, how):** what: a rib is a capability in its own `@keelson/rib-<id>` package, added to a harness that never changes. Why: the alternatives (a fork you maintain, a plugin waiting on review, a sidecar with its own protocol) all cost more than a dependency you add and remove; and Keelson works on its own without any rib. How: `keelson rib add` hands the source to bun; at boot the server discovers rib packages, validates each against the contract and registers it (a broken one is skipped with one warning); optional hooks land tools, snapshots and surfaces, workflows, policies, docs, agents and commands in the harness's registries; the namespace boundary is enforced (snapshot keys and credentials), tool names collide first-wins, and it is not a sandbox.

**Structure:** all plate, five boards on one growing sheet (packages not forks, installed then active, what a rib contributes, the boundary, zero wiring with a dot tracing one tool call), the lay-the-keel opener with "Figure eleven. The rib model." and the closer with SHEET 11 · ACT IV. The series map names it a plate figure; the next three figures put real ribs on screen.

**Weak:** 139 s, all narration; captions are long on every board. No footage, by design.
