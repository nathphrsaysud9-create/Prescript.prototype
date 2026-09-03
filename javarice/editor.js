(() => {
  const editorButton = document.getElementById("managePrescriptsBtn");
  if (!editorButton || !window.prescriptStore) return;

  let draft = [];

  const editor = document.createElement("section");
  editor.id = "prescriptEditor";
  editor.className = "prescript-editor";
  editor.hidden = true;
  editor.setAttribute("aria-labelledby", "prescriptEditorTitle");
  editor.innerHTML = `
    <div class="prescript-editor-card" role="dialog" aria-modal="true">
      <div class="prescript-editor-header">
        <div>
          <p class="prescript-editor-kicker">LOCAL SETTINGS</p>
          <h2 id="prescriptEditorTitle">Edit Prescripts</h2>
          <p class="prescript-editor-help">Changes are saved in this browser only.</p>
        </div>
        <button class="prescript-close-btn" type="button" data-editor-action="close" aria-label="Close editor">×</button>
      </div>
      <div class="prescript-editor-toolbar">
        <span id="prescriptEditorCount" class="prescript-editor-count"></span>
        <button class="prescript-secondary-btn" type="button" data-editor-action="add">+ Add prescript</button>
      </div>
      <div id="prescriptList" class="prescript-list"></div>
      <div class="prescript-editor-footer">
        <button class="prescript-reset-btn" type="button" data-editor-action="reset">Reset defaults</button>
        <div class="prescript-editor-actions">
          <button class="prescript-secondary-btn" type="button" data-editor-action="cancel">Cancel</button>
          <button class="prescript-save-btn" type="button" data-editor-action="save">Save changes</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(editor);

  const list = editor.querySelector("#prescriptList");
  const count = editor.querySelector("#prescriptEditorCount");

  function makeDraft() {
    return window.prescriptStore.get().map(item => ({ ...item }));
  }

  function renderList() {
    list.innerHTML = "";
    count.textContent = `${draft.length} prescript${draft.length === 1 ? "" : "s"}`;

    if (!draft.length) {
      list.innerHTML = `
        <div class="prescript-empty-state">
          <strong>No prescripts yet.</strong>
          <span>Add at least one prescript before saving.</span>
        </div>
      `;
      return;
    }

    draft.forEach((item, index) => {
      const row = document.createElement("article");
      row.className = "prescript-row";
      row.dataset.index = String(index);
      row.innerHTML = `
        <div class="prescript-row-number">${String(index + 1).padStart(2, "0")}</div>
        <div class="prescript-row-fields">
          <label class="prescript-text-field">
            <span>Prescript text</span>
            <textarea data-field="text" rows="2" maxlength="240" placeholder="Enter a prescript...">${escapeHtml(item.text)}</textarea>
          </label>
          <div class="prescript-number-fields">
            <label>
              <span>Weight</span>
              <input data-field="weight" type="number" min="1" max="1000" step="1" value="${item.weight}">
            </label>
            <label>
              <span>Min. count</span>
              <input data-field="minCount" type="number" min="0" max="9999" step="1" value="${item.minCount}">
            </label>
            <label>
              <span>Uses</span>
              <input data-field="amounts" type="number" min="0" max="9999" step="1" value="${item.amounts}">
            </label>
          </div>
        </div>
        <button class="prescript-delete-btn" type="button" data-editor-action="delete" aria-label="Delete prescript ${index + 1}">Delete</button>
      `;
      list.appendChild(row);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function readDraftFromForm() {
    [...list.querySelectorAll(".prescript-row")].forEach(row => {
      const index = Number(row.dataset.index);
      draft[index].text = row.querySelector('[data-field="text"]').value.trim();
      draft[index].weight = Number(row.querySelector('[data-field="weight"]').value);
      draft[index].minCount = Number(row.querySelector('[data-field="minCount"]').value);
      draft[index].amounts = Number(row.querySelector('[data-field="amounts"]').value);
    });
  }

  function validateDraft() {
    if (!draft.length) {
      window.alert("Add at least one prescript before saving.");
      return false;
    }

    const invalidIndex = draft.findIndex(item => (
      !item.text ||
      !Number.isFinite(item.weight) || item.weight < 1 ||
      !Number.isFinite(item.minCount) || item.minCount < 0 ||
      !Number.isFinite(item.amounts) || item.amounts < 0
    ));

    if (invalidIndex !== -1) {
      window.alert(`Please complete prescript ${invalidIndex + 1}. Text, weight, and uses are required.`);
      return false;
    }
    return true;
  }

  function openEditor() {
    draft = makeDraft();
    renderList();
    editor.hidden = false;
    document.body.classList.add("prescript-editor-open");
    editor.querySelector("textarea, input, button")?.focus();
  }

  function closeEditor() {
    editor.hidden = true;
    document.body.classList.remove("prescript-editor-open");
  }

  editorButton.addEventListener("click", openEditor);

  editor.addEventListener("click", event => {
    const actionTarget = event.target.closest("[data-editor-action]");
    if (!actionTarget) return;

    const action = actionTarget.dataset.editorAction;
    if (action === "close" || action === "cancel") {
      closeEditor();
      return;
    }

    if (action === "add") {
      readDraftFromForm();
      draft.push({ text: "", weight: 10, minCount: 0, amounts: 1 });
      renderList();
      list.lastElementChild?.querySelector("textarea")?.focus();
      return;
    }

    if (action === "delete") {
      readDraftFromForm();
      const row = actionTarget.closest(".prescript-row");
      draft.splice(Number(row.dataset.index), 1);
      renderList();
      return;
    }

    if (action === "reset") {
      if (window.confirm("Reset all prescripts to the original defaults?")) {
        draft = window.prescriptStore.getDefaults();
        renderList();
      }
      return;
    }

    if (action === "save") {
      readDraftFromForm();
      if (!validateDraft()) return;
      window.prescriptStore.replace(draft);
      closeEditor();
    }
  });

  editor.addEventListener("keydown", event => {
    if (event.key === "Escape") closeEditor();
  });
})();
