(() => {
  let data = Store.load();
  let view = data.session ? "home" : "login";
  let filters = {};

  const app = document.getElementById("app");
  const modalRoot = document.getElementById("modal-root");

  const persist = () => Store.save(data);

  const toast = (msg) => {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  };

  const closeModal = () => {
    modalRoot.innerHTML = "";
  };

  const openModal = (title, bodyHtml, onSubmit) => {
    modalRoot.innerHTML = `
      <div class="modal-backdrop" data-close>
        <form class="modal" id="modal-form">
          <h2>${title}</h2>
          ${bodyHtml}
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-cancel>Annuler</button>
            <button type="submit" class="btn">Enregistrer</button>
          </div>
        </form>
      </div>
    `;
    modalRoot.querySelector("[data-close]").addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-close")) closeModal();
    });
    modalRoot.querySelector("[data-cancel]").addEventListener("click", closeModal);
    modalRoot.querySelector("#modal-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const obj = Object.fromEntries(fd.entries());
      onSubmit(obj, e.target);
    });
  };

  const escapeHtml = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const downloadCsv = (filename, rows) => {
    if (!rows.length) {
      toast("Aucune donnée à exporter");
      return;
    }
    const headers = Object.keys(rows[0]);
    const lines = [
      headers.join(";"),
      ...rows.map((r) =>
        headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(";")
      ),
    ];
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Export CSV téléchargé");
  };

  /* ——— Views ——— */
  const renderLogin = () => `
    <div class="login-page">
      <div class="login-brand">
        <p class="mark">ProjetÉtudiant</p>
        <p>Système de gestion de projets des étudiants.</p>
      </div>
      <div class="login-panel">
        <div class="login-box">
          <h1>Connexion</h1>
          <p class="hint">Démo&nbsp;: <code>enseignant</code> / <code>demo</code></p>
          <p class="error-msg" id="login-error"></p>
          <form id="login-form">
            <div class="field">
              <label for="idEn">Identifiant</label>
              <input id="idEn" name="id" autocomplete="username" required value="enseignant" />
            </div>
            <div class="field">
              <label for="idMot">Mot de passe</label>
              <input id="idMot" name="password" type="password" autocomplete="current-password" required value="demo" />
            </div>
            <button class="btn btn-block" type="submit">Se connecter</button>
          </form>
          <div class="login-links">
            <a href="#" id="link-register">S'inscrire</a>
            <a href="#" id="link-reset">Mot de passe oublié</a>
          </div>
        </div>
      </div>
    </div>
  `;

  const navItems = [
    { id: "home", label: "Accueil" },
    { id: "etudiants", label: "Étudiants" },
    { id: "formations", label: "Formations" },
    { id: "projets", label: "Projets" },
    { id: "binomes", label: "Binômes" },
    { id: "notes", label: "Notes" },
  ];

  const shell = (inner) => `
    <div class="shell">
      <aside class="sidebar">
        <a class="brand" href="#" data-nav="home">ProjetÉtudiant</a>
        <nav>
          ${navItems
            .map(
              (n) =>
                `<button type="button" data-nav="${n.id}" class="${view === n.id ? "active" : ""}">${n.label}</button>`
            )
            .join("")}
        </nav>
        <div class="foot">
          <div>${escapeHtml(data.session?.prenom ?? "")} ${escapeHtml(data.session?.nom ?? "")}</div>
          <button type="button" class="btn btn-ghost btn-sm" id="logout">Déconnexion</button>
        </div>
      </aside>
      <main class="content">${inner}</main>
    </div>
  `;

  const renderHome = () =>
    shell(`
      <div class="page-head">
        <div>
          <h1>Tableau de bord</h1>
          <p>Bienvenue. Choisissez un module pour gérer les données.</p>
        </div>
        <div class="toolbar">
          <button type="button" class="btn btn-ghost" id="reset-data">Réinitialiser les données démo</button>
        </div>
      </div>
      <div class="home-grid">
        <button class="home-tile" data-nav="etudiants"><strong>${data.etudiants.length}</strong><span>Étudiants</span></button>
        <button class="home-tile" data-nav="formations"><strong>${data.formations.length}</strong><span>Formations</span></button>
        <button class="home-tile" data-nav="projets"><strong>${data.projets.length}</strong><span>Projets</span></button>
        <button class="home-tile" data-nav="binomes"><strong>${data.binomes.length}</strong><span>Binômes</span></button>
        <button class="home-tile" data-nav="notes"><strong>${Store.computeNotes(data).length}</strong><span>Notes</span></button>
      </div>
    `);

  const renderEtudiants = () => {
    const f = filters.etudiants || {};
    const rows = data.etudiants.filter((e) => {
      const form = Store.formationName(data, e.formationId).toLowerCase();
      return (
        (!f.nom || e.nom.toLowerCase().includes(f.nom.toLowerCase())) &&
        (!f.prenom || e.prenom.toLowerCase().includes(f.prenom.toLowerCase())) &&
        (!f.formation || form.includes(f.formation.toLowerCase()))
      );
    });
    return shell(`
      <div class="page-head">
        <div>
          <h1>Gestion des étudiants</h1>
          <p>Recherche, ajout, modification et export.</p>
        </div>
        <button type="button" class="btn" id="add-etudiant">+ Ajouter</button>
      </div>
      <div class="toolbar">
        <input name="nom" placeholder="Nom" value="${escapeHtml(f.nom || "")}" data-filter="etudiants" />
        <input name="prenom" placeholder="Prénom" value="${escapeHtml(f.prenom || "")}" data-filter="etudiants" />
        <input name="formation" placeholder="Formation" value="${escapeHtml(f.formation || "")}" data-filter="etudiants" />
        <button type="button" class="btn btn-ghost" id="search-etudiants">Rechercher</button>
        <button type="button" class="btn btn-ghost" id="export-etudiants">Export CSV</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Id</th><th>Nom</th><th>Prénom</th><th>Formation</th><th></th></tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (e) => `
              <tr>
                <td>${e.id}</td>
                <td>${escapeHtml(e.nom)}</td>
                <td>${escapeHtml(e.prenom)}</td>
                <td><span class="badge">${escapeHtml(Store.formationName(data, e.formationId))}</span></td>
                <td class="actions">
                  <button class="btn btn-ghost btn-sm" data-edit-etudiant="${e.id}">Modifier</button>
                  <button class="btn btn-danger btn-sm" data-del-etudiant="${e.id}">Suppr.</button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `);
  };

  const renderFormations = () => {
    const q = (filters.formations?.q || "").toLowerCase();
    const rows = data.formations.filter(
      (f) => !q || f.nom.toLowerCase().includes(q) || f.promotion.toLowerCase().includes(q)
    );
    return shell(`
      <div class="page-head">
        <div>
          <h1>Gestion des formations</h1>
          <p>Promotions et filières rattachées aux étudiants.</p>
        </div>
        <button type="button" class="btn" id="add-formation">+ Ajouter</button>
      </div>
      <div class="toolbar">
        <input name="q" placeholder="Nom ou promotion" value="${escapeHtml(filters.formations?.q || "")}" data-filter="formations" />
        <button type="button" class="btn btn-ghost" id="search-formations">Rechercher</button>
        <button type="button" class="btn btn-ghost" id="export-formations">Export CSV</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Id</th><th>Nom</th><th>Promotion</th><th></th></tr></thead>
          <tbody>
            ${rows
              .map(
                (f) => `
              <tr>
                <td>${f.id}</td>
                <td>${escapeHtml(f.nom)}</td>
                <td>${escapeHtml(f.promotion)}</td>
                <td class="actions">
                  <button class="btn btn-ghost btn-sm" data-edit-formation="${f.id}">Modifier</button>
                  <button class="btn btn-danger btn-sm" data-del-formation="${f.id}">Suppr.</button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `);
  };

  const renderProjets = () => {
    const f = filters.projets || {};
    const rows = data.projets.filter((p) => {
      return (
        (!f.nomMatiere || p.nomMatiere.toLowerCase().includes(f.nomMatiere.toLowerCase())) &&
        (!f.sujet || p.sujet.toLowerCase().includes(f.sujet.toLowerCase()))
      );
    });
    return shell(`
      <div class="page-head">
        <div>
          <h1>Gestion des projets</h1>
          <p>Matières, sujets, échéances et pondération soutenance.</p>
        </div>
        <button type="button" class="btn" id="add-projet">+ Ajouter</button>
      </div>
      <div class="toolbar">
        <input name="nomMatiere" placeholder="Matière" value="${escapeHtml(f.nomMatiere || "")}" data-filter="projets" />
        <input name="sujet" placeholder="Sujet" value="${escapeHtml(f.sujet || "")}" data-filter="projets" />
        <button type="button" class="btn btn-ghost" id="search-projets">Rechercher</button>
        <button type="button" class="btn btn-ghost" id="export-projets">Export CSV</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Id</th><th>Matière</th><th>Sujet</th><th>Remise prévue</th>
              <th>% Soutenance</th><th>% Rapport</th><th></th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map((p) => {
                const pctS = p.pourcentageSoutenance ?? 0;
                return `
              <tr>
                <td>${p.id}</td>
                <td>${escapeHtml(p.nomMatiere)}</td>
                <td>${escapeHtml(p.sujet)}</td>
                <td>${escapeHtml(p.datePrevueRemise || "—")}</td>
                <td>${pctS}%</td>
                <td>${100 - pctS}%</td>
                <td class="actions">
                  <button class="btn btn-ghost btn-sm" data-edit-projet="${p.id}">Modifier</button>
                  <button class="btn btn-danger btn-sm" data-del-projet="${p.id}">Suppr.</button>
                </td>
              </tr>`;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `);
  };

  const renderBinomes = () => {
    const rows = data.binomes.map((b) => {
      const projet = Store.projetById(data, b.projetId);
      const names = b.etudiantIds
        .map((id) => {
          const e = Store.etudiantById(data, id);
          return e ? `${e.prenom} ${e.nom}` : "?";
        })
        .join(" · ");
      return { ...b, projet, names };
    });
    return shell(`
      <div class="page-head">
        <div>
          <h1>Gestion des binômes</h1>
          <p>Composition des groupes, remises et note de rapport.</p>
        </div>
        <button type="button" class="btn" id="add-binome">+ Ajouter</button>
      </div>
      <div class="toolbar">
        <button type="button" class="btn btn-ghost" id="export-binomes">Export CSV</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Id</th><th>Projet</th><th>Étudiants</th>
              <th>Remise réelle</th><th>Note rapport</th><th></th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (b) => `
              <tr>
                <td>${b.id}</td>
                <td>${escapeHtml(b.projet ? `${b.projet.nomMatiere} — ${b.projet.sujet}` : "—")}</td>
                <td>${escapeHtml(b.names)}</td>
                <td>${escapeHtml(b.dateReelleRemise || "—")}</td>
                <td>${b.noteRapport ?? "—"}</td>
                <td class="actions">
                  <button class="btn btn-ghost btn-sm" data-edit-binome="${b.id}">Modifier</button>
                  <button class="btn btn-danger btn-sm" data-del-binome="${b.id}">Suppr.</button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `);
  };

  const renderNotes = () => {
    const f = filters.notes || {};
    let rows = Store.computeNotes(data);
    rows = rows.filter((r) => {
      return (
        (!f.matiere || r.nomMatiere.toLowerCase().includes(f.matiere.toLowerCase())) &&
        (!f.sujet || r.sujet.toLowerCase().includes(f.sujet.toLowerCase())) &&
        (!f.nom || r.nom.toLowerCase().includes(f.nom.toLowerCase())) &&
        (!f.prenom || r.prenom.toLowerCase().includes(f.prenom.toLowerCase()))
      );
    });
    return shell(`
      <div class="page-head">
        <div>
          <h1>Gestion des notes</h1>
          <p>Note finale = rapport × (100−%sout.) + soutenance × %sout.</p>
        </div>
      </div>
      <div class="toolbar">
        <input name="matiere" placeholder="Matière" value="${escapeHtml(f.matiere || "")}" data-filter="notes" />
        <input name="sujet" placeholder="Sujet" value="${escapeHtml(f.sujet || "")}" data-filter="notes" />
        <input name="nom" placeholder="Nom" value="${escapeHtml(f.nom || "")}" data-filter="notes" />
        <input name="prenom" placeholder="Prénom" value="${escapeHtml(f.prenom || "")}" data-filter="notes" />
        <button type="button" class="btn btn-ghost" id="search-notes">Rechercher</button>
        <button type="button" class="btn btn-ghost" id="export-notes">Export CSV</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Projet</th><th>Matière</th><th>Sujet</th><th>Étudiant</th>
              <th>Rapport</th><th>Soutenance</th><th>Finale</th><th></th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `
              <tr>
                <td>${r.projetId}</td>
                <td>${escapeHtml(r.nomMatiere)}</td>
                <td>${escapeHtml(r.sujet)}</td>
                <td>${escapeHtml(r.prenom)} ${escapeHtml(r.nom)}</td>
                <td>${r.noteRapport ?? "—"}</td>
                <td>${r.noteSoutenance ?? "—"}</td>
                <td><strong>${r.noteFinale ?? "—"}</strong></td>
                <td>
                  <button class="btn btn-ghost btn-sm"
                    data-edit-note="${r.projetId}:${r.etudiantId}">Saisir soutenance</button>
                </td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `);
  };

  const views = {
    login: renderLogin,
    home: renderHome,
    etudiants: renderEtudiants,
    formations: renderFormations,
    projets: renderProjets,
    binomes: renderBinomes,
    notes: renderNotes,
  };

  const render = () => {
    if (!data.session && view !== "login") view = "login";
    app.innerHTML = views[view]();
    bind();
  };

  /* ——— Forms helpers ——— */
  const formationOptions = (selected) =>
    data.formations
      .map(
        (f) =>
          `<option value="${f.id}" ${String(f.id) === String(selected) ? "selected" : ""}>${escapeHtml(f.nom)} (${escapeHtml(f.promotion)})</option>`
      )
      .join("");

  const projetOptions = (selected) =>
    data.projets
      .map(
        (p) =>
          `<option value="${p.id}" ${String(p.id) === String(selected) ? "selected" : ""}>${escapeHtml(p.nomMatiere)} — ${escapeHtml(p.sujet)}</option>`
      )
      .join("");

  const etudiantOptions = (selected) =>
    data.etudiants
      .map(
        (e) =>
          `<option value="${e.id}" ${String(e.id) === String(selected) ? "selected" : ""}>${escapeHtml(e.prenom)} ${escapeHtml(e.nom)}</option>`
      )
      .join("");

  const modalEtudiant = (existing) => {
    openModal(
      existing ? "Modifier l'étudiant" : "Ajouter un étudiant",
      `
      <div class="field"><label>Nom</label><input name="nom" required value="${escapeHtml(existing?.nom || "")}" /></div>
      <div class="field"><label>Prénom</label><input name="prenom" required value="${escapeHtml(existing?.prenom || "")}" /></div>
      <div class="field"><label>Formation</label><select name="formationId" required>${formationOptions(existing?.formationId)}</select></div>
      `,
      (obj) => {
        if (existing) {
          existing.nom = obj.nom.trim();
          existing.prenom = obj.prenom.trim();
          existing.formationId = Number(obj.formationId);
        } else {
          data.etudiants.push({
            id: data.nextIds.etudiant++,
            nom: obj.nom.trim(),
            prenom: obj.prenom.trim(),
            formationId: Number(obj.formationId),
          });
        }
        persist();
        closeModal();
        toast(existing ? "Étudiant mis à jour" : "Étudiant ajouté");
        render();
      }
    );
  };

  const modalFormation = (existing) => {
    openModal(
      existing ? "Modifier la formation" : "Ajouter une formation",
      `
      <div class="field"><label>Nom</label><input name="nom" required value="${escapeHtml(existing?.nom || "")}" /></div>
      <div class="field"><label>Promotion</label><input name="promotion" required value="${escapeHtml(existing?.promotion || "")}" /></div>
      `,
      (obj) => {
        if (existing) {
          existing.nom = obj.nom.trim();
          existing.promotion = obj.promotion.trim();
        } else {
          data.formations.push({
            id: data.nextIds.formation++,
            nom: obj.nom.trim(),
            promotion: obj.promotion.trim(),
          });
        }
        persist();
        closeModal();
        toast("Formation enregistrée");
        render();
      }
    );
  };

  const modalProjet = (existing) => {
    openModal(
      existing ? "Modifier le projet" : "Ajouter un projet",
      `
      <div class="field"><label>Matière</label><input name="nomMatiere" required value="${escapeHtml(existing?.nomMatiere || "")}" /></div>
      <div class="field"><label>Sujet</label><input name="sujet" required value="${escapeHtml(existing?.sujet || "")}" /></div>
      <div class="field"><label>Date prévue de remise</label><input name="datePrevueRemise" type="date" value="${escapeHtml(existing?.datePrevueRemise || "")}" /></div>
      <div class="field"><label>% Soutenance (0–100)</label><input name="pourcentageSoutenance" type="number" min="0" max="100" required value="${existing?.pourcentageSoutenance ?? 40}" /></div>
      `,
      (obj) => {
        const pct = Number(obj.pourcentageSoutenance);
        if (Number.isNaN(pct) || pct < 0 || pct > 100) {
          toast("% soutenance invalide (0–100)");
          return;
        }
        const payload = {
          nomMatiere: obj.nomMatiere.trim(),
          sujet: obj.sujet.trim(),
          datePrevueRemise: obj.datePrevueRemise || null,
          pourcentageSoutenance: pct,
        };
        if (existing) Object.assign(existing, payload);
        else data.projets.push({ id: data.nextIds.projet++, ...payload });
        persist();
        closeModal();
        toast("Projet enregistré");
        render();
      }
    );
  };

  const modalBinome = (existing) => {
    openModal(
      existing ? "Modifier le binôme" : "Ajouter un binôme",
      `
      <div class="field"><label>Projet</label><select name="projetId" required>${projetOptions(existing?.projetId)}</select></div>
      <div class="field"><label>Étudiant 1</label><select name="e1" required>${etudiantOptions(existing?.etudiantIds?.[0])}</select></div>
      <div class="field"><label>Étudiant 2</label><select name="e2" required>${etudiantOptions(existing?.etudiantIds?.[1])}</select></div>
      <div class="field"><label>Date réelle de remise</label><input name="dateReelleRemise" type="date" value="${escapeHtml(existing?.dateReelleRemise || "")}" /></div>
      <div class="field"><label>Note rapport (0–20)</label><input name="noteRapport" type="number" min="0" max="20" step="0.5" value="${existing?.noteRapport ?? ""}" /></div>
      `,
      (obj) => {
        if (obj.e1 === obj.e2) {
          toast("Choisissez deux étudiants différents");
          return;
        }
        const note = obj.noteRapport === "" ? null : Number(obj.noteRapport);
        if (note != null && (note < 0 || note > 20)) {
          toast("Note rapport invalide (0–20)");
          return;
        }
        const payload = {
          projetId: Number(obj.projetId),
          etudiantIds: [Number(obj.e1), Number(obj.e2)],
          dateReelleRemise: obj.dateReelleRemise || null,
          noteRapport: note,
        };
        if (existing) Object.assign(existing, payload);
        else data.binomes.push({ id: data.nextIds.binome++, ...payload });
        persist();
        closeModal();
        toast("Binôme enregistré");
        render();
      }
    );
  };

  const modalNote = (projetId, etudiantId) => {
    const current = data.notesSoutenance.find(
      (n) => n.projetId === projetId && n.etudiantId === etudiantId
    );
    openModal(
      "Note de soutenance",
      `
      <div class="field">
        <label>Note (0–20)</label>
        <input name="note" type="number" min="0" max="20" step="0.5" required value="${current?.note ?? ""}" />
      </div>
      `,
      (obj) => {
        const note = Number(obj.note);
        if (Number.isNaN(note) || note < 0 || note > 20) {
          toast("Note invalide (0–20)");
          return;
        }
        if (current) current.note = note;
        else data.notesSoutenance.push({ projetId, etudiantId, note });
        persist();
        closeModal();
        toast("Note enregistrée");
        render();
      }
    );
  };

  const readFilters = (key) => {
    const inputs = app.querySelectorAll(`[data-filter="${key}"]`);
    const obj = {};
    inputs.forEach((input) => {
      obj[input.name] = input.value.trim();
    });
    filters[key] = obj;
  };

  const bind = () => {
    app.querySelectorAll("[data-nav]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        view = el.dataset.nav;
        render();
      });
    });

    const logout = app.querySelector("#logout");
    if (logout) {
      logout.addEventListener("click", () => {
        data.session = null;
        persist();
        view = "login";
        render();
      });
    }

    const loginForm = app.querySelector("#login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(loginForm);
        const id = String(fd.get("id")).trim();
        const password = String(fd.get("password"));
        const teacher = data.teachers.find((t) => t.id === id && t.password === password);
        const err = app.querySelector("#login-error");
        if (!teacher) {
          err.textContent = "Identifiant ou mot de passe incorrect.";
          return;
        }
        data.session = { id: teacher.id, nom: teacher.nom, prenom: teacher.prenom };
        persist();
        view = "home";
        render();
      });
    }

    app.querySelector("#link-register")?.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(
        "Inscription enseignant",
        `
        <div class="field"><label>Identifiant</label><input name="id" required /></div>
        <div class="field"><label>Nom</label><input name="nom" required /></div>
        <div class="field"><label>Prénom</label><input name="prenom" required /></div>
        <div class="field"><label>Email</label><input name="email" type="email" required /></div>
        <div class="field"><label>Mot de passe</label><input name="password" type="password" required /></div>
        `,
        (obj) => {
          if (data.teachers.some((t) => t.id === obj.id.trim())) {
            toast("Cet identifiant existe déjà");
            return;
          }
          data.teachers.push({
            id: obj.id.trim(),
            nom: obj.nom.trim(),
            prenom: obj.prenom.trim(),
            email: obj.email.trim(),
            password: obj.password,
          });
          persist();
          closeModal();
          toast("Compte créé — vous pouvez vous connecter");
        }
      );
    });

    app.querySelector("#link-reset")?.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(
        "Réinitialiser le mot de passe",
        `
        <div class="field"><label>Identifiant</label><input name="id" required /></div>
        <div class="field"><label>Nouveau mot de passe</label><input name="password" type="password" required /></div>
        `,
        (obj) => {
          const t = data.teachers.find((x) => x.id === obj.id.trim());
          if (!t) {
            toast("Enseignant introuvable");
            return;
          }
          t.password = obj.password;
          persist();
          closeModal();
          toast("Mot de passe mis à jour");
        }
      );
    });

    app.querySelector("#reset-data")?.addEventListener("click", () => {
      if (confirm("Réinitialiser toutes les données de démo ?")) {
        const session = data.session;
        data = Store.reset();
        data.session = session;
        persist();
        toast("Données réinitialisées");
        render();
      }
    });

    // Étudiants
    app.querySelector("#add-etudiant")?.addEventListener("click", () => modalEtudiant(null));
    app.querySelector("#search-etudiants")?.addEventListener("click", () => {
      readFilters("etudiants");
      render();
    });
    app.querySelector("#export-etudiants")?.addEventListener("click", () => {
      downloadCsv(
        "etudiants.csv",
        data.etudiants.map((e) => ({
          id: e.id,
          nom: e.nom,
          prenom: e.prenom,
          formation: Store.formationName(data, e.formationId),
        }))
      );
    });
    app.querySelectorAll("[data-edit-etudiant]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const e = data.etudiants.find((x) => x.id === Number(btn.dataset.editEtudiant));
        if (e) modalEtudiant(e);
      });
    });
    app.querySelectorAll("[data-del-etudiant]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.delEtudiant);
        if (!confirm("Supprimer cet étudiant ?")) return;
        data.etudiants = data.etudiants.filter((e) => e.id !== id);
        data.binomes = data.binomes.filter((b) => !b.etudiantIds.includes(id));
        data.notesSoutenance = data.notesSoutenance.filter((n) => n.etudiantId !== id);
        persist();
        toast("Étudiant supprimé");
        render();
      });
    });

    // Formations
    app.querySelector("#add-formation")?.addEventListener("click", () => modalFormation(null));
    app.querySelector("#search-formations")?.addEventListener("click", () => {
      readFilters("formations");
      render();
    });
    app.querySelector("#export-formations")?.addEventListener("click", () => {
      downloadCsv("formations.csv", data.formations);
    });
    app.querySelectorAll("[data-edit-formation]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = data.formations.find((x) => x.id === Number(btn.dataset.editFormation));
        if (f) modalFormation(f);
      });
    });
    app.querySelectorAll("[data-del-formation]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.delFormation);
        if (data.etudiants.some((e) => e.formationId === id)) {
          toast("Des étudiants sont rattachés à cette formation");
          return;
        }
        if (!confirm("Supprimer cette formation ?")) return;
        data.formations = data.formations.filter((f) => f.id !== id);
        persist();
        toast("Formation supprimée");
        render();
      });
    });

    // Projets
    app.querySelector("#add-projet")?.addEventListener("click", () => modalProjet(null));
    app.querySelector("#search-projets")?.addEventListener("click", () => {
      readFilters("projets");
      render();
    });
    app.querySelector("#export-projets")?.addEventListener("click", () => {
      downloadCsv(
        "projets.csv",
        data.projets.map((p) => ({
          ...p,
          pourcentageRapport: 100 - (p.pourcentageSoutenance ?? 0),
        }))
      );
    });
    app.querySelectorAll("[data-edit-projet]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = data.projets.find((x) => x.id === Number(btn.dataset.editProjet));
        if (p) modalProjet(p);
      });
    });
    app.querySelectorAll("[data-del-projet]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.delProjet);
        if (!confirm("Supprimer ce projet et ses binômes associés ?")) return;
        data.projets = data.projets.filter((p) => p.id !== id);
        data.binomes = data.binomes.filter((b) => b.projetId !== id);
        data.notesSoutenance = data.notesSoutenance.filter((n) => n.projetId !== id);
        persist();
        toast("Projet supprimé");
        render();
      });
    });

    // Binômes
    app.querySelector("#add-binome")?.addEventListener("click", () => modalBinome(null));
    app.querySelector("#export-binomes")?.addEventListener("click", () => {
      downloadCsv(
        "binomes.csv",
        data.binomes.map((b) => {
          const p = Store.projetById(data, b.projetId);
          return {
            id: b.id,
            projet: p ? `${p.nomMatiere} — ${p.sujet}` : "",
            etudiants: b.etudiantIds
              .map((id) => {
                const e = Store.etudiantById(data, id);
                return e ? `${e.prenom} ${e.nom}` : "";
              })
              .join(" / "),
            dateReelleRemise: b.dateReelleRemise,
            noteRapport: b.noteRapport,
          };
        })
      );
    });
    app.querySelectorAll("[data-edit-binome]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const b = data.binomes.find((x) => x.id === Number(btn.dataset.editBinome));
        if (b) modalBinome(b);
      });
    });
    app.querySelectorAll("[data-del-binome]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.delBinome);
        if (!confirm("Supprimer ce binôme ?")) return;
        const b = data.binomes.find((x) => x.id === id);
        data.binomes = data.binomes.filter((x) => x.id !== id);
        if (b) {
          data.notesSoutenance = data.notesSoutenance.filter(
            (n) => !(n.projetId === b.projetId && b.etudiantIds.includes(n.etudiantId))
          );
        }
        persist();
        toast("Binôme supprimé");
        render();
      });
    });

    // Notes
    app.querySelector("#search-notes")?.addEventListener("click", () => {
      readFilters("notes");
      render();
    });
    app.querySelector("#export-notes")?.addEventListener("click", () => {
      downloadCsv("notes.csv", Store.computeNotes(data));
    });
    app.querySelectorAll("[data-edit-note]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const [pid, eid] = btn.dataset.editNote.split(":").map(Number);
        modalNote(pid, eid);
      });
    });

    // Enter to search
    app.querySelectorAll("[data-filter]").forEach((input) => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          readFilters(input.dataset.filter);
          render();
        }
      });
    });
  };

  render();
})();
