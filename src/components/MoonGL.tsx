import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/browser'
import { Moon } from './Moon'

/**
 * Стилизованная 3D-луна на WebGL2 (без библиотек) в палитре сайта.
 *
 * 1. ЗАПЕКАНИЕ (один раз, полосами по кадрам): процедурная карта поверхности в равнопромежуточной
 *    проекции — крупные и средние кратеры (плоское дно, вал, выбросы) и мягкие «моря».
 *    R+G — высота (16 бит), B — альбедо (светлота поверхности).
 * 2. ОТРИСОВКА (каждый кадр экрана, своя плавная шкала времени): сфера с неглубоким рельефом, мягкий объёмный свет, полупрозрачные тени
 *    кратеров, жемчужно-сиреневые тона, индиго на ночной стороне и сиреневое свечение по краю.
 *
 * Если WebGL2 недоступен — показывается SVG-версия <Moon />.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

const NOISE = `
const float PI = 3.14159265;
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
// Поворот между октавами убирает «решётчатость» шума
const mat3 OCT = mat3(0.00, 0.80, 0.60, -0.80, 0.36, -0.48, -0.60, -0.48, 0.64);
float fbm(vec3 p, int oct) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 7; i++) { if (i >= oct) break; s += a * vnoise(p); p = OCT * p * 2.02 + 1.7; a *= 0.5; }
  return s;
}

// Профиль кратера по нормированному расстоянию d (1 = край):
// чаша с плоским дном, приподнятый вал, выбросы снаружи и центральная горка у крупных
float craterProfile(float d, float depth, float peak) {
  float bowl = d < 1.0 ? max(d * d - 1.0, -0.8) : 0.0;
  float rim = exp(-(d - 1.0) * (d - 1.0) * 24.0) * 0.4;
  float ejecta = d > 1.0 ? exp(-(d - 1.0) * 3.0) * 0.1 : 0.0;
  float cpeak = peak * exp(-d * d * 40.0) * 0.5;
  return (bowl + rim + ejecta + cpeak) * depth;
}

// Поле кратеров одного масштаба. bright копит светлоту свежих кратеров (молодые — светлее).
float craters(vec3 p, float density, float peak, inout float bright) {
  vec3 i = floor(p); vec3 f = fract(p); float h = 0.0;
  for (int x = -1; x <= 1; x++)
  for (int y = -1; y <= 1; y++)
  for (int z = -1; z <= 1; z++) {
    vec3 g = vec3(float(x), float(y), float(z));
    vec3 r = hash3(i + g);
    if (r.x > density) continue;
    vec3 c = g + 0.15 + r * 0.7;
    float rad = mix(0.16, 0.48, r.z * r.z);
    float d = length(c - f) / rad;
    if (d > 2.4) continue;
    float age = fract(r.y * 7.13);
    h += craterProfile(d, mix(0.45, 1.0, age), peak * step(0.3, r.z));
    float fresh = age * age * age;
    bright += fresh * (exp(-(d - 1.0) * (d - 1.0) * 9.0) * 0.5 + (d > 1.0 ? exp(-(d - 1.0) * 2.2) * 0.3 : 0.25));
  }
  return h;
}
`

const BAKE = `#version 300 es
precision highp float;
uniform vec2 uSize;
out vec4 o;
${NOISE}
void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  float lon = (uv.x * 2.0 - 1.0) * PI;
  float lat = (uv.y - 0.5) * PI;
  vec3 p = vec3(cos(lat) * cos(lon), sin(lat), cos(lat) * sin(lon));

  // Моря: крупные тёмные низменности органичной формы (шум с искажением координат)
  vec3 w = vec3(fbm(p * 1.6 + vec3(1.7, 9.2, 3.4), 4), fbm(p * 1.6 + vec3(8.3, 2.8, 5.1), 4), fbm(p * 1.6 + vec3(4.1, 6.6, 0.9), 4));
  float maria = smoothstep(0.42, 0.56, fbm(p * 1.05 + (w - 0.5) * 0.95, 5));
  float quiet = 1.0 - 0.72 * maria; // в морях меньше кратеров

  float bright = 0.0;
  float h = 0.0;
  // Только крупные и средние кратеры — спокойная, «стилизованная» поверхность без россыпи оспин
  h += craters(p * 1.7, 0.3, 0.6, bright) * 1.0;
  h += craters(p * 3.9 + 7.3, 0.32, 0.0, bright) * 0.5 * mix(0.6, 1.0, quiet);
  h += craters(p * 8.7 + 3.1, 0.3, 0.0, bright) * 0.26 * quiet;
  h += craters(p * 19.0 + 11.7, 0.3, 0.0, bright) * 0.13 * mix(0.5, 1.0, quiet);
  h += craters(p * 41.0 + 5.9, 0.24, 0.0, bright) * 0.055 * mix(0.5, 1.0, quiet);
  h += (fbm(p * 5.0, 5) - 0.5) * 0.16 * quiet + (fbm(p * 24.0, 3) - 0.5) * 0.035;
  h -= maria * 0.14;

  // Альбедо: светлые материки, тёмные моря, реголит, свежие кратеры и лучи
  // Альбедо: мягкие светлые материки и плавные тёмные моря
  float alb = 0.8 + (fbm(p * 3.3 + 2.0, 5) - 0.5) * 0.26 + (fbm(p * 11.0, 4) - 0.5) * 0.08;
  alb = mix(alb, 0.3 + (fbm(p * 4.0 + 4.0, 4) - 0.5) * 0.14, maria);
  alb += bright * 0.12;

  float hn = clamp(h * 0.28 + 0.55, 0.0, 1.0);
  float hi = floor(hn * 255.0) / 255.0;
  o = vec4(hi, fract(hn * 255.0), clamp(alb, 0.0, 1.0), 1.0);
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
const float BUMP = 0.09;   // сила рельефа (в долях радиуса на единицу высоты) — мягкий, неглубокий

// Высота — только с нулевого mip-уровня: 16-битное кодирование нельзя усреднять
float H(vec2 uv) { vec4 s = textureLod(uMap, uv, 0.0); return s.r + s.g / 255.0; }

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1,0,0, 0,c,s, 0,-s,c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c,0,-s, 0,1,0, s,0,c); }

vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
float dither(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z) - 0.5; }

void main() {
  vec2 q = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float px = 2.0 / uRes.y;
  float r = length(q);
  // без раннего выхода: производные (dFdx/dFdy) должны считаться во всех пикселях, иначе артефакты у края

  vec3 n0 = vec3(q, sqrt(max(0.0, 1.0 - min(dot(q, q), 1.0))));
  mat3 R = rotX(0.32 + uTilt.y * 0.16) * rotY(uTime * 0.03 + uTilt.x * 0.28);
  vec3 p = R * n0;

  float lon = atan(p.z, p.x);
  float lat = asin(clamp(p.y, -1.0, 1.0));
  vec2 tuv = vec2(lon / (2.0 * PI) + 0.5, lat / PI + 0.5);

  // Производные UV без скачка на шве долготы — для mip-уровней и шага выборки
  vec2 dx = dFdx(tuv), dy = dFdy(tuv);
  dx.x -= floor(dx.x + 0.5);
  dy.x -= floor(dy.x + 0.5);
  vec2 st = max(uTexel, max(abs(dx), abs(dy)) * 0.75);

  float cl = max(cos(lat), 0.06);
  vec3 T = vec3(-sin(lon), 0.0, cos(lon));
  vec3 B = vec3(-sin(lat) * cos(lon), cos(lat), -sin(lat) * sin(lon));

  // Нормаль по рельефу
  float h = H(tuv);
  float dl = (H(tuv + vec2(st.x, 0.0)) - H(tuv - vec2(st.x, 0.0))) / (2.0 * st.x * 2.0 * PI);
  float dt = (H(tuv + vec2(0.0, st.y)) - H(tuv - vec2(0.0, st.y))) / (2.0 * st.y * PI);
  vec3 nObj = normalize(p - BUMP * (dl / cl * T + dt * B));
  vec3 n = transpose(R) * nObj;

  vec3 L = normalize(uLight + vec3(uTilt.x * 0.12, uTilt.y * 0.08, 0.0));
  vec3 Lo = R * L;
  float cosI0 = dot(p, Lo);

  // Тени от рельефа: идём по карте высот в сторону света и проверяем, не выше ли рельеф луча
  float shadow = 1.0;
  vec3 lt = Lo - p * cosI0;
  float tl = length(lt);
  if (cosI0 > -0.04 && tl > 1e-4) {
    vec3 ld = lt / tl;
    float tanE = cosI0 / tl;
    vec2 duv = vec2(dot(ld, T) / cl / (2.0 * PI), dot(ld, B) / PI);
    float s = max(0.0022, max(st.x * 2.0 * PI, st.y * PI) * 1.5);
    for (int i = 0; i < 9; i++) {
      float rise = (H(tuv + duv * s) - h) * BUMP - s * tanE;
      shadow = min(shadow, clamp(1.0 - rise / (s * 0.25 + 1e-4), 0.0, 1.0));
      s *= 1.5;
    }
  }

  // Затенение впадин: сравнение с усреднённой (крупной) высотой
  float hCoarse = textureLod(uMap, tuv, 5.0).r + 0.5 / 255.0;
  float ao = clamp(1.0 + (h - hCoarse) * 2.0, 0.78, 1.07);
  shadow = mix(1.0, shadow, 0.55);   // тени полупрозрачные: объём без чёрных провалов

  // Альбедо с mip-уровнями (без мерцания при вращении)
  float alb = textureGrad(uMap, tuv, dx, dy).b;

  // Отражение Лунный-Ламберт: диск освещён почти равномерно до самого края, как у настоящей Луны
  float cosI = max(dot(n, L), 0.0);
  float cosE = max(n0.z, 0.02);
  // Смесь обычного и «лунного» отражения: шар остаётся объёмным, но без резкого затемнения
  float wrapped = max((dot(n, L) + 0.25) / 1.25, 0.0);
  float lunar = mix(wrapped, cosI / (cosI + cosE) * 1.6, 0.3);
  float term = smoothstep(-0.22, 0.4, cosI0); // широкая, плавная граница дня и ночи

  // Палитра «лунной ночи» в линейном пространстве: серебро материков, сиреневые моря
  // Палитра сайта: жемчужно-сиреневые материки, мягкие фиолетовые моря
  vec3 hiC = pow(vec3(0.9, 0.87, 0.99), vec3(2.2));
  vec3 loC = pow(vec3(0.56, 0.52, 0.72), vec3(2.2));
  vec3 base = mix(loC, hiC, smoothstep(0.22, 0.88, alb));

  vec3 col = base * lunar * shadow * ao * term * 0.78;
  // ночная сторона уходит в глубокий индиго, а не в чёрный
  col += pow(vec3(0.075, 0.05, 0.17), vec3(2.2)) * (1.0 - term) * (0.55 + 0.45 * ao * (0.6 + 0.8 * alb));
  // тень на дневной стороне — с фиолетовым, а не серым оттенком
  col = mix(col, col * vec3(0.95, 0.93, 1.04), 1.0 - term * shadow);
  float fres = pow(1.0 - n0.z, 2.4);
  col += pow(vec3(0.66, 0.55, 1.0), vec3(2.2)) * pow(fres, 1.6) * (0.08 + 0.3 * term); // тонкая сиреневая кайма по краю

  col *= vec3(0.97, 0.955, 1.03);                                     // общий «лунный» сиреневый оттенок
  col = aces(col * 1.0);
  col = pow(col, vec3(1.0 / 2.2));
  col += dither(gl_FragCoord.xy) / 255.0;

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
      const kind = type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'
      throw new Error(`${kind} shader: ${gl.getShaderInfoLog(sh) || (gl.isContextLost() ? 'context lost' : 'no log')}`)
    }
    gl.attachShader(prog, sh)
  }
  gl.bindAttribLocation(prog, 0, 'aPos')
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link error')
  return prog
}

/** Событие «луна готова»: прелоадер ждёт его, чтобы сайт открывался уже с луной */
export const MOON_READY_EVENT = 'nocturne:moon-ready'

type Props = {
  className?: string
  halo?: boolean
  /** Направление света (x — вправо, y — вверх, z — на зрителя). z < 0 — контровой свет, «затмение» */
  light?: [number, number, number]
  /** Отложить подготовку до готовности первой луны: не делить видеокарту при загрузке страницы */
  deferred?: boolean
}

let firstMoonReady = false

export function MoonGL({ className = '', halo = true, light = [0.62, 0.38, 0.68], deferred = false }: Props) {
  const [lx, ly, lz] = light
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const announce = () => {
      firstMoonReady = true
      window.dispatchEvent(new Event(MOON_READY_EVENT))
    }
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', {
      premultipliedAlpha: true,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    })
    if (!gl) {
      setFailed(true)
      announce()
      return
    }

    const isMobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
    const reduced = prefersReducedMotion()
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let raf = 0
    let disposed = false
    // Отложенная луна начинает готовиться после первой (или через 4 с, если первой нет на странице)
    let waiting = deferred && !firstMoonReady
    const release = () => (waiting = false)
    const releaseTimer = waiting ? window.setTimeout(release, 4000) : 0
    if (waiting) window.addEventListener(MOON_READY_EVENT, release, { once: true })
    try {
      const quad = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, quad)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(0)
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

      // 1. Карта поверхности. Размер — по размеру луны на экране (больше — чётче, но дольше готовится)
      const diameter = canvas.clientWidth * dpr
      const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number
      const wanted = diameter > 380 ? 2048 : 1024
      const TW = Math.min(wanted, maxTex)
      const TH = TW / 2
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texStorage2D(gl.TEXTURE_2D, Math.log2(TW) + 1, gl.RGBA8, TW, TH)
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

      // Запекаем полосами, по одной за кадр: ~130–260 тыс. пикселей за раз, без подвисаний
      // Первая луна — под прелоадером, крупными порциями; отложенная — мелкими, чтобы не отнимать кадры
      const perFrame = deferred ? 65536 : isMobile ? 131072 : 262144
      const stripH = Math.max(1, Math.min(TH, Math.floor(perFrame / TW)))
      let bakedRows = 0
      const bakeStrip = () => {
        const h = Math.min(stripH, TH - bakedRows)
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
        gl.useProgram(bake)
        gl.viewport(0, bakedRows, TW, h)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        bakedRows += h
        if (bakedRows >= TH) {
          gl.deleteFramebuffer(fbo)
          gl.deleteProgram(bake)
          // mip-уровни + анизотропная фильтрация: поверхность чёткая и не мерцает у края диска
          gl.bindTexture(gl.TEXTURE_2D, tex)
          gl.generateMipmap(gl.TEXTURE_2D)
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
          const aniso = gl.getExtension('EXT_texture_filter_anisotropic')
          if (aniso) {
            const max = gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number
            gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, max))
          }
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
        const changed = canvas.width !== w
        if (changed) {
          canvas.width = w
          canvas.height = w
        }
        // размер кадра передаём в программу всегда: программа могла пересоздаться при том же размере canvas
        gl.useProgram(prog)
        gl.uniform2f(uRes, w, w)
        if (changed && bakedRows >= TH) draw(performance.now())
      }

      // Наклон за курсором (только устройства с мышью)
      const tilt = { x: 0, y: 0, tx: 0, ty: 0 }
      const onMove = (e: PointerEvent) => {
        tilt.tx = (e.clientX / window.innerWidth - 0.5) * 2
        tilt.ty = (e.clientY / window.innerHeight - 0.5) * -2
      }
      if (finePointer && !reduced) window.addEventListener('pointermove', onMove, { passive: true })

      // Во время прокрутки луна не перерисовывается — видеокарта полностью отдана скроллу.
      // Благодаря своей шкале времени после остановки она продолжает с того же места, без скачка.
      let scrolling = false
      let scrollTimer = 0
      const onScroll = () => {
        scrolling = true
        clearTimeout(scrollTimer)
        scrollTimer = window.setTimeout(() => (scrolling = false), 120)
      }
      window.addEventListener('scroll', onScroll, { passive: true })

      // Рисуем, только пока луна видна (с запасом) и вкладка активна
      let visible = true
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '120px' })
      io.observe(canvas)

      // Отложенная луна готовит текстуру, только когда до неё остаётся около полутора экранов
      let near = !deferred
      const ioNear = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) near = true
        },
        { rootMargin: '150% 0px' },
      )
      if (deferred) ioNear.observe(canvas)

      // Собственная шкала времени: вращение прибавляется ровно на длительность кадра (не больше 50 мс).
      // Поэтому после паузы, прокрутки или переключения вкладки луна не «перескакивает», а плавно продолжает.
      let spin = 0
      let lastDraw = 0
      const draw = (now: number) => {
        const dt = lastDraw ? Math.min((now - lastDraw) / 1000, 0.05) : 0
        lastDraw = now
        if (!reduced) spin += dt
        // сглаживание наклона одинаковое при 60, 90 и 120 Гц
        const k = 1 - Math.exp(-dt * 5)
        tilt.x += (tilt.tx - tilt.x) * k
        tilt.y += (tilt.ty - tilt.y) * k
        gl.useProgram(prog)
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.uniform1f(uTime, spin)
        gl.uniform2f(uTilt, tilt.x, tilt.y)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(canvas)

      const loop = (now: number) => {
        if (disposed) return
        if (waiting || !near) {
          // ждём первую луну / приближения к этой
        } else if (bakedRows < TH) {
          bakeStrip()
          if (bakedRows >= TH) {
            draw(now)
            setReady(true)
            announce()
            if (reduced) return
          }
        } else if (visible && !scrolling && !document.hidden) {
          // каждый кадр экрана (60/120 Гц) — без рывков от пропуска кадров
          draw(now)
        } else {
          lastDraw = 0 // после паузы — продолжаем без скачка
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
        clearTimeout(releaseTimer)
        window.removeEventListener(MOON_READY_EVENT, release)
        ro.disconnect()
        io.disconnect()
        window.removeEventListener('pointermove', onMove)
        ioNear.disconnect()
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
      announce()
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
                'radial-gradient(closest-side, rgba(185,166,255,0.3), rgba(124,92,255,0.15) 42%, rgba(42,27,94,0.08) 68%, transparent)',
            }}
          />
          <div
            className="absolute inset-[-9%] rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(237,233,255,0.3), rgba(185,166,255,0.1) 72%, transparent)' }}
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
