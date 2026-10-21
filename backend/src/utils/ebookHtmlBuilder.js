function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEbookLinksHtml(examSections = []) {
  return examSections
    .map((section) => {
      const linksHtml = section.links
        .map(
          (link) => `
            <p style="margin:0 0 10px 0;">
              <span style="color:#0b5ed7;font-weight:bold;">&#128279;</span>
              <a href="${escapeHtml(link.url)}" style="color:#0b5ed7;text-decoration:none;font-weight:bold;word-break:break-all;">
                ${escapeHtml(link.url)}
              </a>
            </p>
          `
        )
        .join("");

      return `
        <div style="margin-bottom:26px;">
          <p style="margin:0 0 12px 0;color:#111827;font-size:18px;font-weight:bold;">
            * ${escapeHtml(section.examName)} eBook
          </p>
          ${linksHtml}
        </div>
      `;
    })
    .join("");
}

module.exports = {
  buildEbookLinksHtml,
  escapeHtml,
};
