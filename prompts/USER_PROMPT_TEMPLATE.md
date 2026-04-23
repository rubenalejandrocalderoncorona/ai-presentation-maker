# User Prompt Template — AI Presentation Maker

Copy this template and fill in your details. Then send it together with the SYSTEM_PROMPT to any AI model.

---

## PRESENTATION SPEC

### Basic info
- **Title:** [Your presentation title]
- **Subtitle:** [Optional subtitle or tagline]
- **Language:** [Spanish / English / other]
- **Author name:** [Your name — shown on cover/presenter slide]
- **Author role:** [Your job title]
- **Color theme:** [light-blue / dark-indigo / light-white / dark-navy / custom: #hex]

### Slides
Number of slides: [e.g. 8]

List each slide with:
- Slide number
- Title
- Content (bullet points, key data, comparisons, etc.)
- Slide type (cover / timeline / cards-grid / pipeline / lifecycle-wheel / training-sim / text-bullets / comparison / final)
- Animation preference: `auto` (AI decides) | `none` | or describe specifically

---

## EXAMPLE SPEC (filled in)

### Basic info
- **Title:** Kubernetes en Producción
- **Subtitle:** De contenedores a clusters en 45 minutos
- **Language:** Spanish
- **Author name:** Ana García
- **Author role:** Platform Engineer @ Spotify
- **Color theme:** light-blue

### Slides: 7

**Slide 0 — Cover**
- Type: cover
- Chips to reveal (one per spacebar press): Pods, Services, Deployments, Helm, GitOps
- Animation: auto

**Slide 1 — Por qué Kubernetes**
- Type: text-bullets
- Content:
  - El problema: "funciona en mi máquina"
  - Escalado manual → cuellos de botella
  - Sin rollback → despliegues de terror
  - K8s: orquestación declarativa + auto-healing
- Animation: auto (stagger reveal per bullet on spacebar)

**Slide 2 — Arquitectura del Cluster**
- Type: pipeline
- Content: 5 nodes:
  - Developer → Git Repo → CI (GitHub Actions) → Registry → Cluster (3 Pods)
- Animation: reveal each layer on spacebar (5 steps), then animate data flowing between nodes

**Slide 3 — Los objetos clave**
- Type: cards-grid
- Content: 6 cards
  - Pod (blue): unidad mínima de despliegue
  - Service (green): balanceo de carga interno
  - Deployment (violet): gestión de réplicas
  - ConfigMap (amber): configuración externalizada
  - Secret (red): credenciales cifradas
  - Ingress (cyan): routing HTTP externo
- Animation: each card reveals on spacebar press (6 steps)

**Slide 4 — Helm: el gestor de paquetes**
- Type: training-sim (use for any "process simulation")
- Content: Show a helm install sequence:
  - Step 1: helm repo add + helm search
  - Step 2: values.yaml customization
  - Step 3: helm install → watch pods come alive
  - Step 4: helm upgrade → zero-downtime rollout
- Animation: 4 spacebar steps, each step reveals + animates that stage

**Slide 5 — GitOps con ArgoCD**
- Type: comparison
- Left panel: Traditional deployment (manual kubectl, no auditability)
- Right panel: GitOps (Git as source of truth, auto-sync, full audit)
- Animation: Left panel reveals first (step 1), right panel (step 2)

**Slide 6 — Final**
- Type: final
- Tagline: "¿Preguntas?"
- Pills: Kubernetes, Helm, GitOps, ArgoCD, CI/CD
- Animation: auto (brain/network animation or particle field)

### Images / Logos
- `/public/k8s-logo.png` — Kubernetes logo, use on cover
- `/public/argocd-logo.png` — ArgoCD logo, use on Slide 5 right panel

### Additional notes
- Use dark code blocks (bg-slate-800) for any command-line content
- Slide 4 terminal commands should use monospace font and green text (#6ee7b7)
- Navigation: Space = step through animations, Arrows = change slide, B = step back
