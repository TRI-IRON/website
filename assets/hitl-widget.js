// Live "Human-in-the-loop" widget — the signature interactive moment.
// Mock AI draft console with streaming text, hover-to-review controls,
// and ink-wipe commits into a "final" column.
(function () {
  const { useState, useEffect, useRef } = React;
  const h = React.createElement;

  const DRAFTS = [
    {
      id: 1,
      text: "Secure frontends are where most usability failures in regulated software happen — we specialise in them.",
      status: "draft",
    },
    {
      id: 2,
      text: "Human-AI teaming interfaces should make the review, the edit and the approval first-class, not afterthoughts.",
      status: "draft",
    },
    {
      id: 3,
      text: "Identity and data-integrity tooling built for environments where the audit trail matters more than the animation.",
      status: "draft",
    },
  ];

  function Caret() {
    return h("span", { className: "hitl-caret", "aria-hidden": true }, "▍");
  }

  function HITLWidget() {
    const [drafts, setDrafts] = useState(
      DRAFTS.map((d) => ({ ...d, shown: "" }))
    );
    const [streamingId, setStreamingId] = useState(1);
    const [hoverId, setHoverId] = useState(null);
    const [committed, setCommitted] = useState([]);
    const [, setRejectedIds] = useState([]);
    const intervalRef = useRef(null);

    useEffect(() => {
      if (streamingId == null) return;
      const target = DRAFTS.find((d) => d.id === streamingId);
      if (!target) return;
      let i = (drafts.find((d) => d.id === streamingId)?.shown || "").length;
      intervalRef.current = setInterval(() => {
        i++;
        setDrafts((prev) =>
          prev.map((d) =>
            d.id === streamingId ? { ...d, shown: target.text.slice(0, i) } : d
          )
        );
        if (i >= target.text.length) {
          clearInterval(intervalRef.current);
          setTimeout(() => {
            const nextId = streamingId + 1;
            if (nextId <= DRAFTS.length) setStreamingId(nextId);
            else setStreamingId(null);
          }, 500);
        }
      }, 14);
      return () => clearInterval(intervalRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [streamingId]);

    const approve = (id) => {
      const d = drafts.find((x) => x.id === id);
      if (!d || committed.find((c) => c.id === id)) return;
      setCommitted((prev) => [...prev, d]);
      setDrafts((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: "approved" } : x))
      );
    };
    const reject = (id) => {
      setRejectedIds((prev) => [...prev, id]);
      setDrafts((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: "rejected" } : x))
      );
    };

    const allDone = streamingId == null;
    const approvedCount = committed.length;

    const reset = () => {
      setDrafts(DRAFTS.map((d) => ({ ...d, shown: "", status: "draft" })));
      setCommitted([]);
      setRejectedIds([]);
      setStreamingId(1);
    };

    const svgCheck = h(
      "svg",
      { width: 12, height: 12, viewBox: "0 0 12 12", fill: "none" },
      h("path", {
        d: "M2 6L5 9L10 3",
        stroke: "currentColor",
        strokeWidth: 1.6,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      })
    );
    const svgEdit = h(
      "svg",
      { width: 12, height: 12, viewBox: "0 0 12 12", fill: "none" },
      h("path", {
        d: "M8 2L10 4L4 10L1.5 10.5L2 8L8 2Z",
        stroke: "currentColor",
        strokeWidth: 1.2,
        strokeLinejoin: "round",
      })
    );
    const svgX = h(
      "svg",
      { width: 12, height: 12, viewBox: "0 0 12 12", fill: "none" },
      h("path", {
        d: "M3 3L9 9M9 3L3 9",
        stroke: "currentColor",
        strokeWidth: 1.6,
        strokeLinecap: "round",
      })
    );
    const svgArrow = h(
      "svg",
      { viewBox: "0 0 40 20", width: 40, height: 20 },
      h("path", {
        d: "M0 10H36M36 10L28 3M36 10L28 17",
        stroke: "currentColor",
        strokeWidth: 1.2,
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      })
    );

    return h(
      "div",
      { className: "hitl" },
      h(
        "div",
        { className: "hitl-head" },
        h(
          "div",
          { className: "hitl-dots" },
          h("span"),
          h("span"),
          h("span")
        ),
        h(
          "div",
          { className: "hitl-title" },
          h("span", { className: "hitl-dim" }, "tri-iron / "),
          "hitl-console",
          h("span", { className: "hitl-sep" }, "·"),
          h(
            "span",
            { className: "hitl-status" },
            h("span", {
              className: "hitl-pulse" + (allDone ? "" : " live"),
            }),
            allDone ? " awaiting review" : " streaming"
          )
        ),
        h(
          "button",
          { className: "hitl-reset", onClick: reset },
          "↻ reset"
        )
      ),
      h(
        "div",
        { className: "hitl-body" },
        h(
          "div",
          { className: "hitl-col" },
          h(
            "div",
            { className: "hitl-col-label" },
            h("span", { className: "k" }, "01"),
            " AI DRAFT",
            h(
              "span",
              { className: "hitl-count" },
              `${drafts.filter((d) => d.status === "draft" && d.shown).length} pending`
            )
          ),
          h(
            "div",
            { className: "hitl-paragraphs" },
            drafts.map((d) => {
              const hidden = d.status === "approved" || d.status === "rejected";
              const fullText = DRAFTS.find((x) => x.id === d.id).text;
              const isFullyShown = d.shown === fullText;
              return h(
                "div",
                {
                  key: d.id,
                  className:
                    "hitl-p " +
                    d.status +
                    (hoverId === d.id ? " hover" : "") +
                    (hidden ? " gone" : ""),
                  onMouseEnter: () => {
                    if (d.status === "draft" && isFullyShown) setHoverId(d.id);
                  },
                  onMouseLeave: () => setHoverId(null),
                },
                h("span", { className: "hitl-p-mark" }, "¶"),
                h(
                  "span",
                  { className: "hitl-p-text" },
                  d.shown,
                  streamingId === d.id ? h(Caret) : null
                ),
                d.status === "draft" && isFullyShown
                  ? h(
                      "div",
                      { className: "hitl-actions" },
                      h(
                        "button",
                        {
                          className: "hitl-btn approve",
                          onClick: () => approve(d.id),
                        },
                        svgCheck,
                        "approve"
                      ),
                      h(
                        "button",
                        { className: "hitl-btn edit" },
                        svgEdit,
                        "edit"
                      ),
                      h(
                        "button",
                        {
                          className: "hitl-btn reject",
                          onClick: () => reject(d.id),
                        },
                        svgX,
                        "reject"
                      )
                    )
                  : null
              );
            })
          )
        ),
        h(
          "div",
          { className: "hitl-arrow", "aria-hidden": true },
          svgArrow
        ),
        h(
          "div",
          { className: "hitl-col final" },
          h(
            "div",
            { className: "hitl-col-label" },
            h("span", { className: "k" }, "02"),
            " APPROVED",
            h(
              "span",
              { className: "hitl-count" },
              `${approvedCount} / ${DRAFTS.length}`
            )
          ),
          h(
            "div",
            { className: "hitl-paragraphs" },
            committed.length === 0
              ? h(
                  "div",
                  { className: "hitl-empty" },
                  h("span", { className: "hitl-empty-line" }),
                  h("span", null, "nothing approved yet — hover a paragraph")
                )
              : null,
            committed.map((c, i) =>
              h(
                "div",
                {
                  key: c.id,
                  className: "hitl-p committed",
                  style: { animationDelay: `${i * 60}ms` },
                },
                h("span", { className: "hitl-p-mark" }, "✓"),
                h("span", { className: "hitl-p-text" }, c.text)
              )
            )
          )
        )
      ),
      h(
        "div",
        { className: "hitl-foot" },
        h("span", { className: "hitl-foot-k" }, "interface thesis →"),
        h("span", null, "draft, review, approve. someone stays in the loop.")
      )
    );
  }

  window.HITLWidget = HITLWidget;
})();
