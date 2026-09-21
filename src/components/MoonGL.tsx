import { useEffect, useRef, useState } from 'react'
import { Moon } from './Moon'

/**
 * Настоящая 3D-луна на WebGL2 (без библиотек).
 *
 * 1. Один раз «запекаем» процедурную карту поверхности в текстуру (равнопромежуточная проекция):
 *    рельеф кратеров в трёх масштабах + лунные моря. Высота хранится в 16 битах (R+G), альбедо — в B.
 * 2. Каждый кадр шейдер натягивает карту на сферу, считает нормали по рельефу и освещает её:
 *    объёмные кратеры, мягкий терминатор, сиреневый френель по краю, медленное вращение,
 *    лёгкий наклон за курсором.
 *
 * Если WebGL2 недоступен — показывается SVG-версия <Moon />.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

const NOISE = `
vec3 hash3(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453123);
}
float hash1(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float vnoise(vec3 p) {
  vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash1(i), hash1(i + vec3(1,0,0)), f.x), mix(hash1(i + vec3(0,1,0)), hash1(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash1(i + vec3(0,0,1)), hash1(i + vec3(1,0,1)), f.x), mix(hash1(i + vec3(0,1,1)), hash1(i + vec3(1,1,1)), f.x), f.y),
    f.z);
}
float fbm(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 6; i++) { s += a * vnoise(p); p = p * 2.03 + 1.7; a *= 0.5; }
  return s;
}
// Поле кратеров: чаша внутри радиуса и приподнятый вал по краю
float craters(vec3 p, float density) {
  vec3 i = floor(p); vec3 f = fract(p); float h = 0.0;
  for (int x = -1; x <= 1; x++)
  for (int y = -1; y <= 1; y++)
  for (int z = -1; z <= 1; z++) {
    vec3 g = vec3(float(x), float(y), float(z));
    vec3 r = hash3(i + g);
    if (r.y > density) continue;
    float rad = mix(0.16, 0.46, r.z * r.z);
    vec3 c = g + 0.2 + r * 0.6;
    float d = length(c - f) / rad;
    if (d > 1.7) continue;
    float bowl = d < 1.0 ? (d * d - 1.0) : 0.0;
    float rim = exp(-14.0 * (d - 1.0) * (d - 1.0));
    h += bowl * 0.85 + rim * 0.42;
  }
  return h;
}`

const BAKE = `#version 300 es
precision highp float;
uniform vec2 uSize;
out vec4 o;
${NOISE}
void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  float lon = (uv.x * 2.0 - 1.0) * 3.14159265;
  float lat = (uv.y - 0.5) * 3.14159265;
  vec3 p = vec3(cos(lat) * cos(lon), sin(lat), cos(lat) * sin(lon));

  float h = craters(p * 2.2, 0.2) * 0.6
          + craters(p * 5.0 + 7.3, 0.22) * 0.3
          + craters(p * 11.0 + 3.1, 0.3) * 0.12
          + (fbm(p * 7.0) - 0.5) * 0.3;
  float hn = clamp(h * 0.38 + 0.6, 0.0, 1.0);

  // Моря — крупные тёмные низменности, плюс мелкая пятнистость реголита
  float maria = smoothstep(0.46, 0.64, fbm(p * 1.25 + vec3(3.1, 1.7, 5.2)));
  float alb = 1.0 - maria * 0.58 + (fbm(p * 10.0 + 2.0) - 0.5) * 0.18;
  alb += smoothstep(0.2, 0.5, h) * 0.08;

  float hi = floor(hn * 255.0) / 255.0;
  float lo = fract(hn * 255.0);
  o = vec4(hi, lo, clamp(alb, 0.0, 1.0), 1.0);
}`

const SPHERE = `#version 300 es
precision highp float;
uniform sampler2D uMap;
uniform vec2 uRes;
uniform vec2 uTexel;
uniform float uTime;
uniform vec2 uTilt;
uniform vec3 uLight;
out vec4 o;

const float PI = 3.14159265;

float H(vec2 uv) { vec4 s = texture(uMap, uv); return s.r + s.g / 255.0; }

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1,0,0, 0,c,s, 0,-s,c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c,0,-s, 0,1,0, s,0,c); }

void main() {
  vec2 q = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float r2 = dot(q, q);
  float px = 2.0 / uRes.y;
  float r = sqrt(r2);
  if (r > 1.0 + px) { o = vec4(0.0); return; }

  vec3 n0 = vec3(q, sqrt(max(0.0, 1.0 - r2)));
  mat3 R = rotX(0.32 + uTilt.y * 0.18) * rotY(uTime * 0.035 + uTilt.x * 0.3);
  vec3 p = R * n0;

  float lon = atan(p.z, p.x);
  float lat = asin(clamp(p.y, -1.0, 1.0));
  vec2 tuv = vec2(lon / (2.0 * PI) + 0.5, lat / PI + 0.5);

  // Нормаль по рельефу: градиент высоты в касательной плоскости
  float dl = (H(tuv + vec2(uTexel.x, 0.0)) - H(tuv - vec2(uTexel.x, 0.0))) / (2.0 * uTexel.x * 2.0 * PI);
  float dt = (H(tuv + vec2(0.0, uTexel.y)) - H(tuv - vec2(0.0, uTexel.y))) / (2.0 * uTexel.y * PI);
  float cl = max(cos(lat), 0.08);
  vec3 T = vec3(-sin(lon), 0.0, cos(lon));
  vec3 B = vec3(-sin(lat) * cos(lon), cos(lat), -sin(lat) * sin(lon));
  vec3 nObj = normalize(p - 0.11 * (dl / cl * T + dt * B));
  vec3 n = transpose(R) * nObj;

  float alb = texture(uMap, tuv).b;

  vec3 L = normalize(uLight + vec3(uTilt.x * 0.15, uTilt.y * 0.1, 0.0));
  float soft = smoothstep(-0.18, 0.4, dot(n0, L));
  float diff = max(dot(n, L), 0.0);
  float light = diff * soft;

  vec3 hi = vec3(0.97, 0.95, 1.0);
  vec3 mid = vec3(0.74, 0.68, 0.99);
  vec3 low = vec3(0.36, 0.29, 0.70);
  vec3 base = mix(low, mix(mid, hi, 0.55), alb);

  vec3 col = base * (0.06 + 1.12 * light);
  col += vec3(0.15, 0.09, 0.34) * (1.0 - soft) * 0.55;          // пепельный свет на ночной стороне
  float fres = pow(1.0 - n0.z, 2.6);
  col += vec3(0.58, 0.47, 1.0) * fres * 0.6;                     // сиреневый ореол по краю
  col += vec3(0.9, 0.88, 1.0) * pow(max(dot(reflect(-L, n), vec3(0,0,1)), 0.0), 18.0) * 0.06 * soft;

  float a = 1.0 - smoothstep(1.0 - 1.5 * px, 1.0 + px * 0.5, r);
  o = vec4(col * a, a);
}`

function compile(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const prog = gl.createProgram()!
  for (const [type, src] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ] as const) {
    const sh = gl.createShader(type)!
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(sh) ?? 'shader error')
    }
    gl.attachShader(prog, sh)
  }
  gl.bindAttribLocation(prog, 0, 'aPos')
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link error')
  return prog
}

type Props = {
  className?: string
  halo?: boolean
  /** Направление света (x — вправо, y — вверх, z — на зрителя). z < 0 — контровой свет, «затмение» */
  light?: [number, number, number]
}

export function MoonGL({ className = '', halo = true, light = [0.5, 0.42, 0.76] }: Props) {
  const [lx, ly, lz] = light
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: false })
    if (!gl) {
      setFailed(true)
      return
    }

    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)

    let raf = 0
    let disposed = false
    try {
      const quad = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, quad)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(0)
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

      // 1. Запекаем карту поверхности
      // Размер карты — по размеру луны на экране: маленьким лунам хватает 1024 (в 4 раза дешевле)
      const TW = !isMobile && canvas.clientWidth * dpr > 700 ? 2048 : 1024
      const TH = TW / 2
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, TW, TH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      const fbo = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
      const bake = compile(gl, VERT, BAKE)
      gl.useProgram(bake)
      gl.uniform2f(gl.getUniformLocation(bake, 'uSize'), TW, TH)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

      // Карту запекаем полосами — по одной за кадр. Целиком за один раз это была тяжёлая
      // задача для GPU, на которой Safari «подвисал» при загрузке страницы.
      const STRIPS = 16
      const stripH = TH / STRIPS
      let baked = 0
      const bakeStrip = () => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
        gl.useProgram(bake)
        gl.viewport(0, baked * stripH, TW, stripH)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        baked++
        if (baked === STRIPS) {
          gl.deleteFramebuffer(fbo)
          gl.deleteProgram(bake)
        }
      }

      // 2. Программа сферы
      const prog = compile(gl, VERT, SPHERE)
      gl.useProgram(prog)
      const uRes = gl.getUniformLocation(prog, 'uRes')
      const uTime = gl.getUniformLocation(prog, 'uTime')
      const uTilt = gl.getUniformLocation(prog, 'uTilt')
      gl.uniform2f(gl.getUniformLocation(prog, 'uTexel'), 1 / TW, 1 / TH)
      gl.uniform1i(gl.getUniformLocation(prog, 'uMap'), 0)
      gl.uniform3f(gl.getUniformLocation(prog, 'uLight'), lx, ly, lz)
      gl.clearColor(0, 0, 0, 0)

      const resize = () => {
        const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
        canvas.width = w
        canvas.height = w
        gl.useProgram(prog)
        gl.uniform2f(uRes, w, w)
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(canvas)

      // Наклон за курсором (только десктоп)
      const tilt = { x: 0, y: 0, tx: 0, ty: 0 }
      const onMove = (e: PointerEvent) => {
        tilt.tx = (e.clientX / window.innerWidth - 0.5) * 2
        tilt.ty = (e.clientY / window.innerHeight - 0.5) * -2
      }
      if (finePointer && !reduced) window.addEventListener('pointermove', onMove, { passive: true })

      // Во время прокрутки луна не перерисовывается: GPU полностью отдан скроллу
      let scrolling = false
      let scrollTimer = 0
      const onScroll = () => {
        scrolling = true
        clearTimeout(scrollTimer)
        scrollTimer = window.setTimeout(() => (scrolling = false), 150)
      }
      window.addEventListener('scroll', onScroll, { passive: true })

      let visible = true
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
      io.observe(canvas)

      const start = performance.now()
      let last = 0
      // 30 кадров/с: вращение очень медленное, разницы с 60 не видно, а нагрузка вдвое меньше
      const frameGap = 1000 / 30
      const draw = (now: number) => {
        tilt.x += (tilt.tx - tilt.x) * 0.05
        tilt.y += (tilt.ty - tilt.y) * 0.05
        gl.useProgram(prog)
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.uniform1f(uTime, reduced ? 0 : (now - start) / 1000)
        gl.uniform2f(uTilt, tilt.x, tilt.y)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
      const loop = (now: number) => {
        if (disposed) return
        if (baked < STRIPS) {
          bakeStrip()
          if (baked === STRIPS) {
            draw(now)
            setReady(true)
            if (reduced) return
          }
        } else if (visible && !scrolling && !document.hidden && now - last >= frameGap - 1) {
          draw(now)
          last = now
        }
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)

      const onLost = (e: Event) => {
        e.preventDefault()
        setFailed(true)
      }
      canvas.addEventListener('webglcontextlost', onLost)

      return () => {
        disposed = true
        cancelAnimationFrame(raf)
        ro.disconnect()
        io.disconnect()
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('scroll', onScroll)
        clearTimeout(scrollTimer)
        canvas.removeEventListener('webglcontextlost', onLost)
        gl.deleteTexture(tex)
        gl.deleteProgram(prog)
        gl.deleteBuffer(quad)
      }
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[MoonGL] fallback to SVG:', err)
      setFailed(true)
      return () => cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (failed) return <Moon className={className} halo={halo} />

  return (
    <div className={`relative aspect-square ${className}`} aria-hidden>
      {halo && (
        <>
          <div
            className="absolute inset-[-40%] animate-breathe-slow rounded-full"
            style={{
              background:
                'radial-gradient(closest-side, rgba(185,166,255,0.34), rgba(124,92,255,0.16) 42%, rgba(42,27,94,0.08) 68%, transparent)',
            }}
          />
          <div
            className="absolute inset-[-10%] rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(237,233,255,0.34), rgba(185,166,255,0.1) 72%, transparent)' }}
          />
        </>
      )}
      <canvas
        ref={canvasRef}
        className="relative h-full w-full transition-opacity duration-1000"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </div>
  )
}
