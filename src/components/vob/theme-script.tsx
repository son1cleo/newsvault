const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("vob-theme");
    var theme = stored === "dark" || stored === "light"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var el = document.currentScript && document.currentScript.parentElement;
    if (el) el.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

// Applies the persisted/preferred theme to the .vob root before paint, so
// there's no flash of the wrong theme on load.
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}
