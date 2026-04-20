// Interactive split-sphere — two halves that parallax toward the cursor,
// with an orbiting dashed ring and an animated seam.
(function () {
  const { useEffect, useRef, useState } = React;
  const h = React.createElement;

  function SplitSphere({ size = 560 }) {
    const ref = useRef(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });
    const current = useRef({ x: 0, y: 0 });

    useEffect(() => {
      const handle = (e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / window.innerWidth;
        const dy = (e.clientY - cy) / window.innerHeight;
        target.current = { x: dx, y: dy };
      };
      window.addEventListener("mousemove", handle);
      let raf;
      const tick = () => {
        current.current.x += (target.current.x - current.current.x) * 0.06;
        current.current.y += (target.current.y - current.current.y) * 0.06;
        setMouse({ ...current.current });
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => {
        window.removeEventListener("mousemove", handle);
        cancelAnimationFrame(raf);
      };
    }, []);

    const offL = { x: -24 + mouse.x * -22, y: mouse.y * -10 };
    const offR = { x: 24 + mouse.x * 22, y: mouse.y * 10 };
    const rot = mouse.x * 8;

    return h(
      "div",
      { className: "ss-wrap", ref, style: { width: size, height: size } },
      h(
        "svg",
        {
          viewBox: "0 0 400 400",
          width: "100%",
          height: "100%",
          "aria-hidden": true,
        },
        h(
          "defs",
          null,
          h(
            "linearGradient",
            { id: "ssPurple", x1: "0", y1: "0", x2: "1", y2: "1" },
            h("stop", { offset: "0", stopColor: "#A5A3FF", stopOpacity: 1 }),
            h("stop", { offset: "0.6", stopColor: "#7C7AF6", stopOpacity: 1 }),
            h("stop", { offset: "1", stopColor: "#4F4DD1", stopOpacity: 1 })
          ),
          h(
            "linearGradient",
            { id: "ssDark", x1: "0", y1: "0", x2: "1", y2: "1" },
            h("stop", { offset: "0", stopColor: "#2A2F46", stopOpacity: 1 }),
            h("stop", { offset: "1", stopColor: "#0F1420", stopOpacity: 1 })
          ),
          h(
            "radialGradient",
            { id: "ssGlow", cx: "0.5", cy: "0.5", r: "0.5" },
            h("stop", { offset: "0", stopColor: "#7C7AF6", stopOpacity: 0.55 }),
            h("stop", { offset: "1", stopColor: "#7C7AF6", stopOpacity: 0 })
          ),
          h(
            "mask",
            { id: "halfL2" },
            h("rect", { width: "400", height: "400", fill: "#000" }),
            h("rect", { width: "200", height: "400", fill: "#fff" })
          ),
          h(
            "mask",
            { id: "halfR2" },
            h("rect", { width: "400", height: "400", fill: "#000" }),
            h("rect", { x: "200", width: "200", height: "400", fill: "#fff" })
          ),
          h("filter", { id: "ssBlur" }, h("feGaussianBlur", { stdDeviation: "12" }))
        ),
        h("circle", {
          cx: "200",
          cy: "200",
          r: "170",
          fill: "url(#ssGlow)",
          filter: "url(#ssBlur)",
        }),
        h(
          "g",
          {
            style: {
              transformOrigin: "200px 200px",
              animation: "ss-spin 60s linear infinite",
            },
          },
          h("circle", {
            cx: "200",
            cy: "200",
            r: "178",
            fill: "none",
            stroke: "rgba(165,163,255,0.18)",
            strokeWidth: "0.6",
          }),
          h("circle", {
            cx: "200",
            cy: "200",
            r: "178",
            fill: "none",
            stroke: "rgba(165,163,255,0.6)",
            strokeWidth: "0.6",
            strokeDasharray: "2 300",
            strokeDashoffset: "0",
          })
        ),
        h(
          "g",
          {
            style: {
              transformOrigin: "200px 200px",
              animation: "ss-spin-rev 90s linear infinite",
            },
          },
          h("circle", {
            cx: "200",
            cy: "200",
            r: "150",
            fill: "none",
            stroke: "rgba(165,163,255,0.2)",
            strokeWidth: "0.6",
            strokeDasharray: "1 6",
          })
        ),
        h(
          "g",
          {
            transform: `translate(${offL.x} ${offL.y}) rotate(${-rot} 200 200)`,
          },
          h("circle", {
            cx: "200",
            cy: "200",
            r: "118",
            fill: "url(#ssPurple)",
            mask: "url(#halfL2)",
          }),
          h(
            "g",
            {
              mask: "url(#halfL2)",
              fill: "none",
              stroke: "rgba(255,255,255,0.18)",
              strokeWidth: "0.5",
            },
            h("ellipse", { cx: "200", cy: "200", rx: "118", ry: "30" }),
            h("ellipse", { cx: "200", cy: "200", rx: "118", ry: "60" }),
            h("ellipse", { cx: "200", cy: "200", rx: "118", ry: "90" })
          )
        ),
        h(
          "g",
          {
            transform: `translate(${offR.x} ${offR.y}) rotate(${rot} 200 200)`,
          },
          h("circle", {
            cx: "200",
            cy: "200",
            r: "118",
            fill: "url(#ssDark)",
            mask: "url(#halfR2)",
          }),
          h(
            "g",
            {
              mask: "url(#halfR2)",
              fill: "none",
              stroke: "rgba(165,163,255,0.35)",
              strokeWidth: "0.5",
            },
            h("line", { x1: "200", y1: "82", x2: "200", y2: "318" }),
            h("path", { d: "M 200 82 Q 260 200 200 318" }),
            h("path", { d: "M 200 82 Q 290 200 200 318" })
          )
        ),
        h(
          "line",
          {
            x1: "200",
            y1: "70",
            x2: "200",
            y2: "330",
            stroke: "#CFCEFF",
            strokeWidth: "1.2",
            opacity: "0.85",
          },
          h("animate", {
            attributeName: "opacity",
            values: "0.5;1;0.5",
            dur: "4s",
            repeatCount: "indefinite",
          })
        ),
        h(
          "g",
          {
            stroke: "rgba(165,163,255,0.4)",
            strokeWidth: "0.6",
            fontFamily: "JetBrains Mono",
            fontSize: "7",
            fill: "rgba(165,163,255,0.55)",
            letterSpacing: "1.2",
          },
          h("line", { x1: "200", y1: "30", x2: "200", y2: "44" }),
          h("text", { x: "200", y: "22", textAnchor: "middle" }, "N"),
          h("line", { x1: "200", y1: "356", x2: "200", y2: "370" }),
          h("text", { x: "200", y: "384", textAnchor: "middle" }, "S"),
          h("line", { x1: "30", y1: "200", x2: "44", y2: "200" }),
          h("text", { x: "18", y: "203", textAnchor: "middle" }, "W"),
          h("line", { x1: "356", y1: "200", x2: "370", y2: "200" }),
          h("text", { x: "382", y: "203", textAnchor: "middle" }, "E")
        )
      )
    );
  }

  window.SplitSphere = SplitSphere;
})();
