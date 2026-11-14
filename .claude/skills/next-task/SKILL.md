---
name: next-task
description: Find the next unfinished task in docs/dev-plan.md and return an implementation plan for it, without implementing anything. Use when the user asks for "the next task", "what's next", or runs /next-task (optionally with a task id such as T05).
---

# Plan the next dev-plan task

Optional argument: a task id (for example `T05`). Without one, pick the next task automatically.

This skill only plans. Its result is an implementation plan for the user to review. Do not write or change code, docs, config or dependencies, do not install packages, and do not run commands that change anything (scripts, builds, `npm i`). Read-only inspection is fine.

1. Read `docs/dev-plan.md`. Tasks are headings like `### - [ ] T05 Title` (open) or `### - [x] T05 Title` (done).
2. Choose the task:
   - With an id: use that task. If it is already ticked, say so and ask whether to re-plan it.
   - Without an id: take the first open task, in file order, whose "Needs" tasks are all ticked. Phase-level needs such as "all tasks in phases 1–4" mean every task in those phases.
   - If the first open task is blocked, say which "Needs" are open and offer the first unblocked task instead.
   - If a task has "Needs before starting" or "Decision needed" items (inputs the user must supply), list them and ask the user for them before planning.
3. Read the matching sections of `docs/ski-touring-tatry-v1.md` (spec) that the task cites, for example "spec section 5.1". Check the "Decisions to make along the way" list for decisions that affect the task.
4. Inspect the current code (`src/`, `package.json`, config files) so the plan reuses what exists and matches its style.
5. If the spec, the design canvas and the task disagree, or a choice changes the result, ask the user before finishing the plan.
6. Enter plan mode and write the plan: a short context, the files to create or change, the steps, any docs to update, and how to check the task's "Done when" line. Keep it to what that one task asks for; do not pull in later tasks.
7. Present the plan and stop. Start implementing only when the user explicitly approves or asks for it in a later message.
8. When the work is later done, include ticking the task in `docs/dev-plan.md` as the last step of the plan. Never tick it while planning.
