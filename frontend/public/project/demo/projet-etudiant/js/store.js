const STORAGE_KEY = "projet-etudiant-demo-v1";

const seed = () => ({
  session: null,
  teachers: [
    { id: "enseignant", password: "demo", nom: "Dupont", prenom: "Marie", email: "marie.dupont@dauphine.eu" },
  ],
  formations: [
    { id: 1, nom: "MIAGE M1", promotion: "2023-2024" },
    { id: 2, nom: "MIAGE M2", promotion: "2023-2024" },
    { id: 3, nom: "Informatique L3", promotion: "2023-2024" },
  ],
  etudiants: [
    { id: 1, nom: "Martin", prenom: "Alice", formationId: 1 },
    { id: 2, nom: "Bernard", prenom: "Lucas", formationId: 1 },
    { id: 3, nom: "Petit", prenom: "Emma", formationId: 1 },
    { id: 4, nom: "Robert", prenom: "Noah", formationId: 1 },
    { id: 5, nom: "Richard", prenom: "Léa", formationId: 2 },
    { id: 6, nom: "Durand", prenom: "Hugo", formationId: 2 },
    { id: 7, nom: "Moreau", prenom: "Chloé", formationId: 3 },
    { id: 8, nom: "Simon", prenom: "Louis", formationId: 3 },
  ],
  projets: [
    { id: 1, nomMatiere: "Génie Logiciel", sujet: "Gestion de projets étudiants", datePrevueRemise: "2024-05-15", pourcentageSoutenance: 40 },
    { id: 2, nomMatiere: "Base de données", sujet: "Modélisation relationnelle", datePrevueRemise: "2024-04-20", pourcentageSoutenance: 30 },
    { id: 3, nomMatiere: "Web", sujet: "Application SPA portfolio", datePrevueRemise: "2024-06-01", pourcentageSoutenance: 50 },
  ],
  binomes: [
    { id: 1, projetId: 1, etudiantIds: [1, 2], dateReelleRemise: "2024-05-12", noteRapport: 15.5 },
    { id: 2, projetId: 1, etudiantIds: [3, 4], dateReelleRemise: "2024-05-14", noteRapport: 14 },
    { id: 3, projetId: 2, etudiantIds: [5, 6], dateReelleRemise: "2024-04-18", noteRapport: 16 },
    { id: 4, projetId: 3, etudiantIds: [7, 8], dateReelleRemise: null, noteRapport: null },
  ],
  notesSoutenance: [
    { projetId: 1, etudiantId: 1, note: 16 },
    { projetId: 1, etudiantId: 2, note: 15 },
    { projetId: 1, etudiantId: 3, note: 14 },
    { projetId: 1, etudiantId: 4, note: 13.5 },
    { projetId: 2, etudiantId: 5, note: 17 },
    { projetId: 2, etudiantId: 6, note: 16.5 },
  ],
  nextIds: { formation: 4, etudiant: 9, projet: 4, binome: 5 },
});

const Store = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const data = seed();
        this.save(data);
        return data;
      }
      return JSON.parse(raw);
    } catch {
      const data = seed();
      this.save(data);
      return data;
    }
  },

  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  reset() {
    const data = seed();
    this.save(data);
    return data;
  },

  formationName(data, id) {
    return data.formations.find((f) => f.id === id)?.nom ?? "—";
  },

  projetById(data, id) {
    return data.projets.find((p) => p.id === id);
  },

  etudiantById(data, id) {
    return data.etudiants.find((e) => e.id === id);
  },

  computeNotes(data) {
    const rows = [];
    for (const binome of data.binomes) {
      const projet = this.projetById(data, binome.projetId);
      if (!projet) continue;
      const pctS = (projet.pourcentageSoutenance ?? 0) / 100;
      const pctR = 1 - pctS;
      for (const etudiantId of binome.etudiantIds) {
        const etudiant = this.etudiantById(data, etudiantId);
        if (!etudiant) continue;
        const sout = data.notesSoutenance.find(
          (n) => n.projetId === projet.id && n.etudiantId === etudiantId
        );
        const noteRapport = binome.noteRapport;
        const noteSoutenance = sout?.note ?? null;
        let noteFinale = null;
        if (noteRapport != null && noteSoutenance != null) {
          noteFinale = +(noteRapport * pctR + noteSoutenance * pctS).toFixed(2);
        }
        rows.push({
          projetId: projet.id,
          nomMatiere: projet.nomMatiere,
          sujet: projet.sujet,
          etudiantId: etudiant.id,
          nom: etudiant.nom,
          prenom: etudiant.prenom,
          noteRapport,
          noteSoutenance,
          noteFinale,
          dateReelleRemise: binome.dateReelleRemise,
        });
      }
    }
    return rows;
  },
};

window.Store = Store;
