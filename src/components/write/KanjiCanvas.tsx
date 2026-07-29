import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUUpLeft as Undo2, Eraser, PencilLine as PenLine, Play, Sparkle as Sparkles } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { strokePathsFor } from '@/data/strokeData'
import { loadKanjiVgPaths, KANJIVG_VIEWBOX } from '@/lib/kanjivg'

interface Point {
  x: number // normalized 0..1
  y: number
  p: number // pressure 0..1
}
type Stroke = Point[]

export interface Grade {
  score: number
  precision: number
  coverage: number
  order: number
  strokes: number
  expectedStrokes: number
}

interface KanjiCanvasProps {
  char: string
  expectedStrokes: number
  onGraded?: (g: Grade) => void
  showGuideDefault?: boolean
  allowGuideToggle?: boolean
  showStrokeReference?: boolean
}

const RASTER = 224

export function KanjiCanvas({
  char,
  expectedStrokes,
  onGraded,
  showGuideDefault = true,
  allowGuideToggle = true,
  showStrokeReference = true,
}: KanjiCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokesRef = useRef<Stroke[]>([])
  const currentRef = useRef<Stroke | null>(null)
  const [strokeCount, setStrokeCount] = useState(0)
  const [showGuide, setShowGuide] = useState(showGuideDefault)
  const [grade, setGrade] = useState<Grade | null>(null)

  // Stroke-order reference: prefer KanjiVG (loaded at runtime), fall back to the
  // built-in starter set, else none (trace-only).
  const [strokeData, setStrokeData] = useState<{
    paths: string[]
    viewBox: number
    source: 'kanjivg' | 'builtin'
  } | null>(null)

  useEffect(() => {
    const builtin = strokePathsFor(char)
    setStrokeData(builtin ? { paths: builtin, viewBox: 100, source: 'builtin' } : null)

    let active = true
    loadKanjiVgPaths(char).then((paths) => {
      if (active && paths && paths.length) {
        setStrokeData({ paths, viewBox: KANJIVG_VIEWBOX, source: 'kanjivg' })
      }
    })
    return () => {
      active = false
    }
  }, [char])

  // --- canvas sizing (DPR-aware) --------------------------------------------
  const fitCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const dpr = Math.min(window.devicePixelRatio || 1, 3)
    const size = wrap.clientWidth
    canvas.width = size * dpr
    canvas.height = size * dpr
    redraw()
  }, [])

  useEffect(() => {
    fitCanvas()
    const ro = new ResizeObserver(fitCanvas)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitCanvas])

  // reset when the character changes
  useEffect(() => {
    strokesRef.current = []
    currentRef.current = null
    setStrokeCount(0)
    setGrade(null)
    setShowGuide(showGuideDefault)
    redraw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [char, showGuideDefault])

  // --- drawing ---------------------------------------------------------------
  function ctx() {
    return canvasRef.current?.getContext('2d') ?? null
  }

  function drawStroke(c: CanvasRenderingContext2D, stroke: Stroke, dim: number) {
    if (stroke.length === 0) return
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.strokeStyle = 'rgb(var(--accent))'
    if (stroke.length === 1) {
      const p = stroke[0]
      c.beginPath()
      c.arc(p.x * dim, p.y * dim, (dim * 0.02) * (0.6 + p.p), 0, Math.PI * 2)
      c.fillStyle = 'rgb(var(--accent))'
      c.fill()
      return
    }
    for (let i = 1; i < stroke.length; i++) {
      const a = stroke[i - 1]
      const b = stroke[i]
      c.lineWidth = dim * 0.03 * (0.6 + b.p)
      c.beginPath()
      c.moveTo(a.x * dim, a.y * dim)
      c.lineTo(b.x * dim, b.y * dim)
      c.stroke()
    }
  }

  function redraw() {
    const c = ctx()
    const canvas = canvasRef.current
    if (!c || !canvas) return
    c.clearRect(0, 0, canvas.width, canvas.height)
    for (const s of strokesRef.current) drawStroke(c, s, canvas.width)
    if (currentRef.current) drawStroke(c, currentRef.current, canvas.width)
  }

  function pointFrom(e: React.PointerEvent): Point {
    const rect = canvasRef.current!.getBoundingClientRect()
    return {
      x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
      p: e.pressure && e.pressure > 0 ? e.pressure : 0.5,
    }
  }

  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault()
    canvasRef.current?.setPointerCapture(e.pointerId)
    currentRef.current = [pointFrom(e)]
    redraw()
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!currentRef.current) return
    currentRef.current.push(pointFrom(e))
    redraw()
  }
  function onPointerUp() {
    if (!currentRef.current) return
    strokesRef.current = [...strokesRef.current, currentRef.current]
    currentRef.current = null
    setStrokeCount(strokesRef.current.length)
    setGrade(null)
    redraw()
  }

  function undo() {
    strokesRef.current = strokesRef.current.slice(0, -1)
    setStrokeCount(strokesRef.current.length)
    setGrade(null)
    redraw()
  }
  function clear() {
    strokesRef.current = []
    currentRef.current = null
    setStrokeCount(0)
    setGrade(null)
    redraw()
  }

  // --- replay of the user's own strokes -------------------------------------
  function replay() {
    const c = ctx()
    const canvas = canvasRef.current
    if (!c || !canvas) return
    const all = strokesRef.current
    c.clearRect(0, 0, canvas.width, canvas.height)
    let si = 0
    let pi = 1
    const step = () => {
      if (si >= all.length) return
      const partial = all[si].slice(0, pi)
      // redraw finished strokes + partial current
      c.clearRect(0, 0, canvas.width, canvas.height)
      for (let k = 0; k < si; k++) drawStroke(c, all[k], canvas.width)
      drawStroke(c, partial, canvas.width)
      pi += 2
      if (pi >= all[si].length) {
        si += 1
        pi = 1
      }
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  // --- automatic scoring -----------------------------------------------------
  async function grade_() {
    if (strokesRef.current.length === 0) return
    await document.fonts.load(`${Math.round(RASTER * 0.8)}px "Noto Sans JP"`).catch(() => undefined)

    const target = targetMask(char, strokeData?.paths, strokeData?.viewBox, RASTER * 0.08)
    const targetLoose = targetMask(char, strokeData?.paths, strokeData?.viewBox, RASTER * 0.16)
    const thin = maskFromDraw((c) => rasterStrokes(c, strokesRef.current, RASTER * 0.03))
    const thick = maskFromDraw((c) => rasterStrokes(c, strokesRef.current, RASTER * 0.13))

    let tArea = 0
    let uArea = 0
    let precisionHit = 0
    let coverageHit = 0
    for (let i = 0; i < target.length; i++) {
      const t = target[i]
      if (t) tArea++
      if (thin[i]) {
        uArea++
        if (targetLoose[i]) precisionHit++
      }
      if (t && thick[i]) coverageHit++
    }
    const precision = uArea ? precisionHit / uArea : 0
    const coverage = tArea ? coverageHit / tArea : 0
    const strokeMatch = 1 - Math.min(1, Math.abs(strokesRef.current.length - expectedStrokes) / expectedStrokes)
    const order = estimateStrokeOrder(strokesRef.current, strokeData?.paths, strokeData?.viewBox)
    const score = Math.round(100 * (0.35 * precision + 0.35 * coverage + 0.2 * order + 0.1 * strokeMatch))

    const g: Grade = { score, precision, coverage, order, strokes: strokesRef.current.length, expectedStrokes }
    setGrade(g)
    onGraded?.(g)
  }

  return (
    <div className="w-full">
      <div
        ref={wrapRef}
        className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-2xl border border-line bg-bg-card"
      >
        {/* grid guides */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-line/70" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-line/70" />
        </div>

        {/* faint glyph to trace */}
        {showGuide && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="select-none font-jp leading-none text-fg/10" style={{ fontSize: '78%' }}>
              {char}
            </span>
          </div>
        )}

        {/* reference stroke-order overlay */}
        {showStrokeReference && strokeData && <StrokeReferenceOverlay paths={strokeData.paths} viewBox={strokeData.viewBox} />}

        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="absolute inset-0 h-full w-full touch-none"
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* controls */}
      <div className="mx-auto mt-3 flex max-w-[420px] flex-wrap items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={undo} disabled={strokeCount === 0}>
          <Undo2 className="h-4 w-4" /> Undo
        </Button>
        <Button variant="outline" size="sm" onClick={clear} disabled={strokeCount === 0}>
          <Eraser className="h-4 w-4" /> Clear
        </Button>
        <Button variant="outline" size="sm" onClick={replay} disabled={strokeCount === 0}>
          <Play className="h-4 w-4" /> Replay
        </Button>
        {allowGuideToggle && (
          <Button variant={showGuide ? 'ghost' : 'outline'} size="sm" onClick={() => setShowGuide((s) => !s)}>
            <PenLine className="h-4 w-4" /> {showGuide ? 'Hide guide' : 'Show guide'}
          </Button>
        )}
        <Button size="sm" onClick={grade_} disabled={strokeCount === 0}>
          <Sparkles className="h-4 w-4" /> Grade
        </Button>
      </div>

      {/* score */}
      <div className="mx-auto mt-3 flex max-w-[420px] items-center justify-center gap-2 text-sm">
        <Badge tone="neutral">
          {strokeCount}/{expectedStrokes} strokes
        </Badge>
        {grade && (
          <>
            <Badge tone={grade.score >= 80 ? 'matcha' : grade.score >= 55 ? 'amber' : 'coral'}>
              {grade.score}% match
            </Badge>
            <span className="text-xs text-fg-faint">
              order {Math.round(grade.order * 100)}% · neatness {Math.round(grade.precision * 100)}% · coverage{' '}
              {Math.round(grade.coverage * 100)}%
            </span>
          </>
        )}
      </div>

      {strokeData?.source === 'kanjivg' && (
        <p className="mt-2 text-center text-[11px] text-fg-faint">
          Stroke order:{' '}
          <a
            href="https://kanjivg.tagaini.net/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-accent-fg"
          >
            KanjiVG
          </a>{' '}
          (CC BY-SA 3.0)
        </p>
      )}
    </div>
  )
}

// --- helpers -----------------------------------------------------------------

function maskFromDraw(draw: (c: CanvasRenderingContext2D) => void): Uint8Array {
  const off = document.createElement('canvas')
  off.width = RASTER
  off.height = RASTER
  const c = off.getContext('2d')!
  c.clearRect(0, 0, RASTER, RASTER)
  draw(c)
  const data = c.getImageData(0, 0, RASTER, RASTER).data
  const mask = new Uint8Array(RASTER * RASTER)
  for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4 + 3] > 40 ? 1 : 0
  return mask
}

function rasterStrokes(c: CanvasRenderingContext2D, strokes: Stroke[], width: number) {
  c.strokeStyle = '#000'
  c.lineCap = 'round'
  c.lineJoin = 'round'
  c.lineWidth = width
  for (const s of strokes) {
    if (s.length < 2) {
      if (s.length === 1) {
        c.beginPath()
        c.arc(s[0].x * RASTER, s[0].y * RASTER, width / 2, 0, Math.PI * 2)
        c.fillStyle = '#000'
        c.fill()
      }
      continue
    }
    c.beginPath()
    c.moveTo(s[0].x * RASTER, s[0].y * RASTER)
    for (let i = 1; i < s.length; i++) c.lineTo(s[i].x * RASTER, s[i].y * RASTER)
    c.stroke()
  }
}

function targetMask(char: string, paths: string[] | undefined, viewBox: number | undefined, width: number): Uint8Array {
  if (paths?.length && viewBox) {
    return maskFromDraw((c) => rasterPaths(c, paths, viewBox, width))
  }

  return maskFromDraw((c) => {
    c.fillStyle = '#000'
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.font = `${Math.round(RASTER * 0.8)}px "Noto Sans JP"`
    c.fillText(char, RASTER / 2, RASTER / 2 + RASTER * 0.03)
  })
}

function rasterPaths(c: CanvasRenderingContext2D, paths: string[], viewBox: number, width: number) {
  const scale = RASTER / viewBox
  c.save()
  c.scale(scale, scale)
  c.strokeStyle = '#000'
  c.lineCap = 'round'
  c.lineJoin = 'round'
  c.lineWidth = width / scale
  for (const d of paths) c.stroke(new Path2D(d))
  c.restore()
}

function estimateStrokeOrder(strokes: Stroke[], paths?: string[], viewBox = 100): number {
  if (!paths?.length) return strokes.length ? 0.75 : 0
  const paired = Math.min(strokes.length, paths.length)
  if (paired === 0) return 0

  let total = 0
  for (let i = 0; i < paired; i++) {
    const user = strokes[i]
    const start = user[0]
    const end = user[user.length - 1] ?? start
    const ref = pathEndpoints(paths[i], viewBox)
    if (!start || !end || !ref) continue

    const startDist = distance(start, ref.start)
    const endDist = distance(end, ref.end)
    const reversedStartDist = distance(start, ref.end)
    const reversedEndDist = distance(end, ref.start)
    const forward = Math.max(0, 1 - (startDist + endDist) / 0.75)
    const reversed = Math.max(0, 1 - (reversedStartDist + reversedEndDist) / 0.75) * 0.55
    total += Math.max(forward, reversed)
  }

  const missingPenalty = 1 - Math.min(1, Math.abs(strokes.length - paths.length) / paths.length)
  return Math.max(0, Math.min(1, (total / paths.length) * missingPenalty))
}

function pathEndpoints(d: string, viewBox: number): { start: Point; end: Point } | null {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  try {
    const length = path.getTotalLength()
    const start = path.getPointAtLength(0)
    const end = path.getPointAtLength(length)
    return {
      start: { x: start.x / viewBox, y: start.y / viewBox, p: 1 },
      end: { x: end.x / viewBox, y: end.y / viewBox, p: 1 },
    }
  } catch {
    return null
  }
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function StrokeReferenceOverlay({ paths, viewBox }: { paths: string[]; viewBox: number }) {
  return (
    <svg viewBox={`0 0 ${viewBox} ${viewBox}`} className="pointer-events-none absolute inset-0 h-full w-full">
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="rgb(var(--accent-fg))"
          strokeWidth={viewBox > 100 ? 3.5 : 4}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.16 }}
        />
      ))}
    </svg>
  )
}
