# Konnectify Monday App — Architecture Migration

## Phase 1: Architecture Report

### Current Architecture

| Layer | Implementation | Issues |
|-------|----------------|--------|
| UI | `monday-ui-react-core` in all components | Mixed with `@vibe/core`; unsupported legacy APIs |
| Typings | `custom.d.ts` fake `any` exports | Hides compile errors, runtime crashes |
| Navigation | `Tabs`, `TabsContext`, `ButtonGroup` | Crashes / not marketplace-ready |
| Features | Login/Register + Workflow list only | Missing connections, billing, templates, iframes |
| Services | Single `konnectifyApi.ts` + fat hooks | No domain separation |
| Storage | tenant, auth, workflows, eventLogs | Missing connections, billing, templates, metrics |
| Reference | D365/Freshservice MVC app | Source of truth not inherited |

### Target Architecture

```
src/
├── index.tsx                          # ThemeProvider + Router
├── constants/index.ts                 # App IDs, template IDs, routes
├── types/
│   ├── index.ts                       # Domain types
│   └── css.d.ts                       # CSS modules only
├── services/
│   ├── konnectifyClient.ts            # HTTP client (Konnectify REST)
│   ├── authService.ts
│   ├── tenantService.ts
│   ├── connectionService.ts
│   ├── workflowService.ts
│   ├── billingService.ts
│   ├── iframeService.ts               # Bootstrap iframe URLs
│   ├── storageService.ts
│   └── mondayService.ts
├── hooks/
│   ├── KonnectifyProvider.tsx         # App context + service wiring
│   └── index.ts
├── components/
│   ├── common/                        # SideNav, IframeModal, layout
│   ├── account-settings/              # Admin portal (5 sections)
│   └── board-view/                    # Workflow operations
└── styles/global.css
```

### Migration Risks

1. **Token lifecycle** — Bootstrap tokens expire; must mirror D365 `getNewToken` refresh before iframe loads.
2. **Monday SDK context** — Board view needs monday context; storage uses localStorage (Monday App Storage in production).
3. **App IDs** — Monday CRM connector ID must match Konnectify catalog (`monday-com-1.0.0`, `d-365-1.0.0`).
4. **CORS / iframe** — Bootstrap pages must load in modal iframes, never full redirect.
5. **Vibe 4 API drift** — Use `kind` on Button, `Chips` not `Chip`, no legacy `type="primary"`.

### Dependency Changes

| Remove | Add / Keep |
|--------|------------|
| `monday-ui-react-core` | `@vibe/core` ^4.3.0 (only UI lib) |
| Fake typings in custom.d.ts | Real exports from @vibe/core |
| Tabs, TabsContext, Chip, ButtonGroup, EmptyState usage | SideNav, Badge, AttentionBox, Modal+iframe |

---

## Phase 2: Refactor Plan

### Files to Remove

- `src/components/AccountSettings.tsx` (+ module css)
- `src/components/BoardView.tsx` (+ module css)
- `src/components/WorkflowList.tsx` (+ module css)
- `src/components/EventLogs.tsx` (+ module css)
- `src/types/custom.d.ts` (replaced by `css.d.ts`)
- `src/services/konnectifyApi.ts` (replaced by `konnectifyClient.ts`)

### Files to Replace

- `src/hooks/index.ts` — context-based hooks
- `src/index.tsx` — ThemeProvider + new routes
- `src/types/index.ts` — extended domain types
- `src/services/storageService.ts` — extended keys
- `src/services/mondayService.ts` — fix SDK init

### Files to Create

**Services:** auth, tenant, connection, workflow, billing, iframe, konnectifyClient  
**Common:** SideNav, PageLayout, KonnectifyIframeModal, EmptyPlaceholder, useToast  
**Account Settings:** shell, OverviewDashboard, ConnectionsPanel, WorkflowTemplatesPanel, BillingPanel, SetupWizard  
**Board View:** shell, BoardOverview, WorkflowTable, EventLogsPanel  

### Reusable APIs (from existing + D365 reference)

- Auth: `register/service`, `bootstrap-token`, `logout`, `sessions/me`
- Workflows: `konnectors`, `ACTIVE`/`INACTIVE`, `install-from-template/{id}`
- Connections: CRUD + OAuth auth-url
- Billing: `billing/plans`
- Iframes: `{domain}.konnectifyapp.co/ipaas/ui/bootstrap-page?destination=...`
