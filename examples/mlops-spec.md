# MLOps Presentation Spec

### Basic info
- **Title:** MLOps en Producción
- **Subtitle:** Del experimento al sistema productivo en 45 minutos
- **Language:** Spanish
- **Author name:** María López
- **Author role:** Senior ML Engineer @ Fintech Corp
- **Color theme:** light-blue

### Slides: 8

---

**Slide 0 — Cover**
- Type: cover
- Chips to reveal (one per spacebar press): Feature Store, CI/CD, Model Registry, Serving, Monitoring
- Animation: auto

---

**Slide 1 — El Problema**
- Type: text-bullets
- Content:
  - "Funciona en mi laptop" → falla en producción
  - Sin versionado de datos ni modelos → reproducibilidad imposible
  - Monitoreo manual → degradación silenciosa
  - Reentrenamiento ad-hoc → inconsistencias entre versiones
- Animation: stagger reveal, one bullet per spacebar press (4 steps)

---

**Slide 2 — Roles en un Equipo MLOps**
- Type: cards-grid
- Content: 6 cards
  - Data Engineer (cyan): pipelines de datos, Feature Store, calidad
  - Data Scientist (green): experimentación, modelos, métricas de negocio
  - ML Engineer (blue): entrenamiento a escala, optimización, reproducibilidad
  - Platform Engineer (violet): infraestructura, Kubernetes, CI/CD
  - Data Analyst (amber): análisis exploratorio, dashboards, negocio
  - MLOps Lead (red): gobernanza, estándares, coordinación entre equipos
- Animation: each card reveals on spacebar press (6 steps), then all highlighted on step 7

---

**Slide 3 — Deriva de Datos**
- Type: drift-explainer
- Left panel: Deriva de Datos — input feature distribution shifts over time. Show two overlapping normal curves; second curve slides rightward. Example: modelo de taxis entrenado con viajes cortos, en producción aparecen viajes al aeropuerto (distancias mayores)
- Right panel: Deriva de Concepto — the relationship P(Y|X) changes. Show a scatter plot with a decision boundary; new points appear that cross the boundary. Example: modelo de fraude entrenado en 2022, patrones de fraude cambian en 2024
- Animation: left panel draws first (auto), right panel draws on spacebar (step 1)

---

**Slide 4 — El Ciclo MLOps**
- Type: lifecycle-wheel
- 8 spokes (clockwise from top):
  1. Recolección — datos crudos, validación de esquema
  2. EDA — distribuciones, correlaciones, outliers
  3. Feature Engineering — transformaciones, Feature Store
  4. Entrenamiento — experimentos, hyperparams, MLflow
  5. Evaluación — métricas, fairness, comparación con baseline
  6. Empaquetado — containerización, versionado de artefactos
  7. Despliegue — canary releases, A/B testing, rollback
  8. Monitoreo + Reentrenamiento — drift alerts, CT trigger
- Animation: each spoke reveals on spacebar (8 steps), brief data animation per step

---

**Slide 5 — Pipeline de Entrenamiento**
- Type: pipeline
- 5 nodes:
  - Feature Store → Data Validation → Training (MLflow) → Evaluation Gate → Model Registry
- Show data flowing through the pipeline as animated packets
- Evaluation Gate has a conditional: green check → Registry, red X → back to Training
- Animation: reveal each node on spacebar (5 steps), then animate data flow packets continuously

---

**Slide 6 — Sirviendo el Modelo**
- Type: comparison
- Left panel (antes — REST API manual):
  - Flask app monolítica, sin versioning, sin health checks
  - Deploy manual via SSH, downtime durante actualizaciones
  - Sin métricas de latencia ni errores
- Right panel (ahora — MLOps serving):
  - FastAPI + Docker, Model Registry versionado
  - Canary deployment: 10% → 50% → 100% tráfico
  - /metrics Prometheus, alertas automáticas por latencia/errores
- Animation: left panel fades in (step 1), right panel fades in (step 2), comparison highlights on step 3

---

**Slide 7 — Final**
- Type: final
- Tagline: "¿Preguntas?"
- Pills: Feature Store, MLflow, FastAPI, Prometheus, Docker, Kubernetes
- QR code area: (no QR — leave as placeholder text "github.com/tu-usuario/mlops-demo")
- Animation: auto (particle field or network animation)

---

### Additional notes
- Use consistent indigo/blue accent color for all node borders and highlights
- All terminal/code blocks: dark background `bg-slate-800`, text `text-green-300`, monospace
- Slide transitions: slide from right on advance, slide to left on back
- Navigation: Space = step animations, Arrow keys = change slide, B = step back within slide
- Keep Spanish throughout — do not mix languages within a slide
