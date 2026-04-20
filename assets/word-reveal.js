// Animated word-by-word hero headline reveal
(function () {
  const { useEffect, useState } = React;
  const h = React.createElement;

  function WordReveal({ text, className = "", delay = 0, stagger = 70, as = "span" }) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
      const t = setTimeout(() => setShown(true), delay);
      return () => clearTimeout(t);
    }, [delay]);
    const words = text.split(" ");
    return h(
      as,
      { className },
      words.map((w, i) =>
        h(
          "span",
          { key: i, className: "wr-word" },
          h(
            "span",
            {
              className: "wr-inner",
              style: {
                transitionDelay: shown ? `${i * stagger}ms` : "0ms",
                transform: shown ? "none" : "translateY(110%)",
                opacity: shown ? 1 : 0,
              },
            },
            w + "\u00a0"
          )
        )
      )
    );
  }

  window.WordReveal = WordReveal;
})();
