const STORAGE_KEY = "arbre_genealogique_v3";

/* ── Données ── */
let nextId = 1;
let selectedId = null;
let afficherOnclesCousins = false;
const personnes = new Map();

function newPersonne(nom, prenom, dateVie, surnom = "", sexe = "") {
  const id = nextId++;
  personnes.set(id, {
    id, nom: nom.trim(), prenom: prenom.trim(),
    surnom: surnom ? surnom.trim() : "",
    sexe: sexe ? String(sexe).trim() : "",
    dateVie: dateVie ? dateVie.trim() || null : null,
    parents: new Set(), enfants: new Set(), freres: new Set(), conjoints: new Set(),
  });
  return id;
}

function displayName(person) {
  const parts = [];
  if (person.prenom) parts.push(person.prenom);
  if (person.surnom) parts.push(`"${person.surnom}"`);
  if (person.nom) parts.push(person.nom);
  return parts.join(" ").trim() || "(sans nom)";
}

function get(id) {
  const p = personnes.get(Number(id));
  if (!p) throw new Error("Personne introuvable id=" + id);
  return p;
}

function lierFreres(a, b) {
  a = Number(a); b = Number(b);
  if (a === b) return;
  get(a).freres.add(b); get(b).freres.add(a);
}

function addParent(parentId, enfantId) {
  parentId = Number(parentId); enfantId = Number(enfantId);
  if (parentId === enfantId) throw new Error("Relation invalide");
  const par = get(parentId), enf = get(enfantId);
  par.enfants.add(enfantId); enf.parents.add(parentId);
  par.enfants.forEach(sid => { if (sid !== enfantId) lierFreres(enfantId, sid); });
}

function addSibling(id1, id2) {
  id1 = Number(id1); id2 = Number(id2);
  if (id1 === id2) throw new Error("Relation invalide");

  // Transitivité: on fusionne les deux groupes de fratrie (composantes connectées)
  const groupe = new Set();
  const pile = [id1, id2];

  while (pile.length) {
    const current = pile.pop();
    if (groupe.has(current)) continue;
    groupe.add(current);
    get(current).freres.forEach(fid => {
      if (!groupe.has(fid)) pile.push(fid);
    });
  }

  const ids = [...groupe];

  // Tous les membres du groupe deviennent frères/sœurs les uns des autres
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      lierFreres(ids[i], ids[j]);
    }
  }

  // Harmonisation des parents sur tout le groupe
  const unionParents = new Set();
  ids.forEach(id => get(id).parents.forEach(pid => unionParents.add(pid)));

  unionParents.forEach(pid => {
    const parent = get(pid);
    ids.forEach(id => {
      get(id).parents.add(pid);
      parent.enfants.add(id);
    });
  });
}

function addSpouse(id1, id2) {
  id1 = Number(id1); id2 = Number(id2);
  if (id1 === id2) throw new Error("Relation invalide");
  get(id1).conjoints.add(id2);
  get(id2).conjoints.add(id1);
}

function unlinkParent(parentId, enfantId) {
  parentId = Number(parentId);
  enfantId = Number(enfantId);
  if (!personnes.has(parentId) || !personnes.has(enfantId)) return;
  get(parentId).enfants.delete(enfantId);
  get(enfantId).parents.delete(parentId);
}

function unlinkSibling(id1, id2) {
  id1 = Number(id1);
  id2 = Number(id2);
  if (!personnes.has(id1) || !personnes.has(id2)) return;
  get(id1).freres.delete(id2);
  get(id2).freres.delete(id1);
}

function unlinkSpouse(id1, id2) {
  id1 = Number(id1);
  id2 = Number(id2);
  if (!personnes.has(id1) || !personnes.has(id2)) return;
  get(id1).conjoints.delete(id2);
  get(id2).conjoints.delete(id1);
}

function removePerson(personId) {
  personId = Number(personId);
  if (!personnes.has(personId)) return;
  const p = get(personId);

  [...p.parents].forEach(pid => unlinkParent(pid, personId));
  [...p.enfants].forEach(eid => unlinkParent(personId, eid));
  [...p.freres].forEach(fid => unlinkSibling(personId, fid));
  [...p.conjoints].forEach(cid => unlinkSpouse(personId, cid));

  personnes.delete(personId);
  if (selectedId === personId) {
    selectedId = [...personnes.keys()].sort((a, b) => a - b)[0] ?? null;
  }
}

function addRelationFromPerspective(baseId, otherId, type) {
  if (type === "parent") addParent(baseId, otherId);
  else if (type === "enfant") addParent(otherId, baseId);
  else if (type === "frere") addSibling(baseId, otherId);
  else if (type === "conjoint") addSpouse(baseId, otherId);
}

function removeRelationFromPerspective(baseId, otherId, type) {
  if (type === "parent") unlinkParent(baseId, otherId);
  else if (type === "enfant") unlinkParent(otherId, baseId);
  else if (type === "frere") unlinkSibling(baseId, otherId);
  else if (type === "conjoint") unlinkSpouse(baseId, otherId);
}

function relationLabel(type) {
  if (type === "parent") return "parent de";
  if (type === "enfant") return "enfant de";
  if (type === "frere") return "frère/sœur de";
  if (type === "conjoint") return "conjoint de";
  return type;
}

function listPeopleText(excludeId = null) {
  const ids = [...personnes.keys()]
    .filter(id => id !== excludeId)
    .sort((a, b) => a - b);
  if (!ids.length) return "(aucune personne)";
  return ids
    .map(id => {
      const p = get(id);
      return `[${id}] ${p.prenom} ${p.nom}`;
    })
    .join("\n");
}

function getPersonRelations(personId) {
  const p = get(personId);
  const out = [];
  [...p.enfants].sort((a, b) => a - b).forEach(id => out.push({ type: "parent", otherId: id }));
  [...p.parents].sort((a, b) => a - b).forEach(id => out.push({ type: "enfant", otherId: id }));
  [...p.freres].sort((a, b) => a - b).forEach(id => out.push({ type: "frere", otherId: id }));
  [...p.conjoints].sort((a, b) => a - b).forEach(id => out.push({ type: "conjoint", otherId: id }));
  return out;
}

function persistLocal({ notify = false } = {}) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize()));
    if (notify) alert("Sauvegarde locale effectuée.");
  } catch (err) {
    if (notify) {
      alert("Impossible de sauvegarder en local sur ce navigateur.");
    }
    console.error("Erreur sauvegarde locale:", err);
  }
}

const choiceModalEl = document.getElementById("choiceModal");
const choiceTitleEl = document.getElementById("choiceTitle");
const choiceSubtitleEl = document.getElementById("choiceSubtitle");
const choiceSearchInputEl = document.getElementById("choiceSearchInput");
const choiceListEl = document.getElementById("choiceList");
const personFormModalEl = document.getElementById("personFormModal");
const personFormTitleEl = document.getElementById("personFormTitle");
const personFormEl = document.getElementById("personForm");
const personNomInputEl = document.getElementById("personNomInput");
const personSurnomInputEl = document.getElementById("personSurnomInput");
const personPrenomInputEl = document.getElementById("personPrenomInput");
const personDateInputEl = document.getElementById("personDateInput");
const personSexeInputEl = document.getElementById("personSexeInput");
const personFormCancelEl = document.getElementById("personFormCancel");

function showChoiceModal({
  title,
  subtitle = "",
  options = [],
  showCancelButton = true,
  searchable = false,
  searchPlaceholder = "Rechercher une personne...",
}) {
  return new Promise(resolve => {
    choiceTitleEl.textContent = title;
    choiceSubtitleEl.textContent = subtitle;
    choiceListEl.innerHTML = "";
    choiceSearchInputEl.value = "";
    choiceSearchInputEl.placeholder = searchPlaceholder;
    choiceSearchInputEl.style.display = searchable ? "block" : "none";

    function close(value) {
      choiceModalEl.classList.add("hidden");
      choiceModalEl.setAttribute("aria-hidden", "true");
      choiceModalEl.removeEventListener("click", onBackdrop);
      choiceSearchInputEl.removeEventListener("input", onSearchInput);
      resolve(value ?? null);
    }

    function onBackdrop(e) {
      if (e.target === choiceModalEl) close(null);
    }

    function renderOptions() {
      choiceListEl.innerHTML = "";
      const term = choiceSearchInputEl.value.trim().toLocaleLowerCase("fr");
      const filtered = !searchable || !term
        ? options
        : options.filter(opt => (opt.label || "").toLocaleLowerCase("fr").includes(term));

      if (!filtered.length) {
        const empty = document.createElement("div");
        empty.className = "muted";
        empty.textContent = "Aucun résultat.";
        empty.style.padding = "6px 2px";
        choiceListEl.appendChild(empty);
      }

      filtered.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "choice-btn" + (opt.danger ? " danger" : "") + (opt.primary ? " primary" : "");
        btn.textContent = opt.label;
        btn.addEventListener("click", () => close(opt.value));
        choiceListEl.appendChild(btn);
      });

      if (showCancelButton) {
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "choice-btn";
        cancelBtn.textContent = "Annuler";
        cancelBtn.addEventListener("click", () => close(null));
        choiceListEl.appendChild(cancelBtn);
      }
    }

    function onSearchInput() {
      renderOptions();
    }

    choiceSearchInputEl.addEventListener("input", onSearchInput);
    renderOptions();

    choiceModalEl.classList.remove("hidden");
    choiceModalEl.setAttribute("aria-hidden", "false");
    choiceModalEl.addEventListener("click", onBackdrop);
    if (searchable) {
      requestAnimationFrame(() => choiceSearchInputEl.focus());
    }
  });
}

async function chooseRelationType(message = "Type de relation") {
  return await showChoiceModal({
    title: message,
    options: [
      { value: "parent", label: "Parent de" },
      { value: "enfant", label: "Enfant de" },
      { value: "frere", label: "Frère/Sœur de" },
      { value: "conjoint", label: "Conjoint de" },
    ],
  });
}

async function promptPersonToEdit() {
  if (!personnes.size) return null;
  const options = [...personnes.keys()]
    .sort((a, b) => {
      const pa = get(a);
      const pb = get(b);
      const prenomCmp = (pa.prenom || "").localeCompare(pb.prenom || "", "fr", { sensitivity: "base" });
      if (prenomCmp !== 0) return prenomCmp;
      const nomCmp = (pa.nom || "").localeCompare(pb.nom || "", "fr", { sensitivity: "base" });
      if (nomCmp !== 0) return nomCmp;
      return a - b;
    })
    .map(id => {
      const p = get(id);
      return { value: id, label: `[${id}] ${displayName(p)}` };
    });
  return await showChoiceModal({
    title: "Choisir une personne à éditer",
    subtitle: "Sélectionnez une personne dans la liste",
    options,
  });
}

async function proposerAjouterRelation(baseId) {
  const candidats = [...personnes.keys()].filter(id => id !== baseId);
  if (!candidats.length) return;

  const want = await showChoiceModal({
    title: "Ajouter une relation ?",
    options: [
      { value: "yes", label: "Oui, ajouter une relation" },
      { value: "no", label: "Non" },
    ],
  });
  if (want !== "yes") return;

  const otherId = await showChoiceModal({
    title: "Choisir l'autre personne",
    subtitle: "Utilisez le champ de recherche pour filtrer la liste.",
    searchable: true,
    searchPlaceholder: "Rechercher par prénom, surnom ou nom...",
    options: candidats
      .sort((a, b) => a - b)
      .map(id => {
        const p = get(id);
        return { value: id, label: `[${id}] ${displayName(p)}` };
      }),
  });
  if (otherId == null || !personnes.has(otherId) || otherId === baseId) {
    return;
  }

  const type = await chooseRelationType("Choisir le type de relation");
  if (!type) return;

  addRelationFromPerspective(baseId, otherId, type);
  persistLocal();
}

async function createPersonFlow() {
  const infos = await saisirPersonne();
  if (!infos) return;
  const id = newPersonne(infos.nom, infos.prenom, infos.dateVie, infos.surnom, infos.sexe);
  selectedId = id;
  await proposerAjouterRelation(id);
  persistLocal();
}

async function editPersonInfo(personId) {
  const p = get(personId);
  const infos = await saisirPersonne(
    {
      nom: p.nom || "",
      surnom: p.surnom || "",
      prenom: p.prenom || "",
      dateVie: p.dateVie || "",
      sexe: p.sexe || "",
    },
    `Modifier les infos de [${p.id}] ${displayName(p)}`
  );
  if (!infos) return false;

  p.nom = infos.nom.trim();
  p.surnom = (infos.surnom || "").trim();
  p.prenom = infos.prenom.trim();
  p.dateVie = infos.dateVie.trim() || null;
  p.sexe = (infos.sexe || "").trim();
  persistLocal();
  return true;
}

async function manageExistingRelation(personId) {
  const relations = getPersonRelations(personId);
  if (!relations.length) {
    alert("Aucune relation à éditer.");
    return;
  }

  const relationChoice = await showChoiceModal({
    title: "Choisir la relation à gérer",
    options: relations.map((r, i) => {
      const p = get(r.otherId);
      return {
        value: i,
        label: `${relationLabel(r.type)} [${r.otherId}] ${displayName(p)}`,
      };
    }),
  });
  if (relationChoice == null) return;

  const rel = relations[relationChoice];
  const action = await showChoiceModal({
    title: "Action sur la relation",
    options: [
      { value: "edit", label: "Modifier le type" },
      { value: "delete", label: "Supprimer le lien", danger: true },
    ],
  });
  if (!action) return;

  if (action === "delete") {
    removeRelationFromPerspective(personId, rel.otherId, rel.type);
    persistLocal();
    return;
  }

  if (action === "edit") {
    const newType = await chooseRelationType("Nouveau type de relation");
    if (!newType) {
      alert("Type invalide.");
      return;
    }
    removeRelationFromPerspective(personId, rel.otherId, rel.type);
    addRelationFromPerspective(personId, rel.otherId, newType);
    persistLocal();
  }
}

async function editPersonFlow(initialPersonId = null, openInfoFirst = false) {
  const personId = initialPersonId != null ? Number(initialPersonId) : await promptPersonToEdit();
  if (personId == null || !personnes.has(Number(personId))) return;

  if (openInfoFirst) {
    const ok = await editPersonInfo(personId);
    if (!ok) return;
  }

  while (true) {
    const p = get(personId);
    const choice = await showChoiceModal({
      title: `Édition de [${p.id}] ${displayName(p)}`,
      options: [
        { value: "add-relation", label: "Ajouter une relation" },
        { value: "center", label: "Centrer la vue sur cette personne" },
        { value: "manage-relation", label: "Éditer/Supprimer une relation" },
        { value: "delete-person", label: "Supprimer cette personne", danger: true },
        { value: "done", label: "Enregistrer", primary: true },
        { value: "cancel", label: "Annuler" },
      ],
      showCancelButton: false,
    });

    if (choice == null || choice === "done" || choice === "cancel") break;
    try {
      if (choice === "add-relation") {
        await proposerAjouterRelation(personId);
      } else if (choice === "manage-relation") {
        await manageExistingRelation(personId);
      } else if (choice === "delete-person") {
        if (confirm("Supprimer cette personne et tous ses liens ?")) {
          removePerson(personId);
          persistLocal();
          break;
        }
      } else if (choice === "center") {
        selectedId = personId;
      } else {
        alert("Choix invalide.");
      }
    } catch (err) {
      alert(err.message || "Erreur pendant l'édition.");
    }
  }
}

async function openPersonEditor() {
  const action = await showChoiceModal({
    title: "Gestion des personnes",
    options: [
      { value: "create", label: "Ajouter une personne" },
      { value: "edit", label: "Éditer une personne existante" },
    ],
  });

  if (!action) return;
  if (action === "create") await createPersonFlow();
  else if (action === "edit") await editPersonFlow();
}

function extractBirthYear(dateVie) {
  if (!dateVie) return null;
  const matches = String(dateVie).match(/\d{4}/g);
  if (!matches || !matches.length) return null;
  const year = Number(matches[0]);
  return Number.isFinite(year) ? year : null;
}

function compareByAgeThenName(aId, bId) {
  const a = get(aId);
  const b = get(bId);

  const aYear = extractBirthYear(a.dateVie);
  const bYear = extractBirthYear(b.dateVie);

  // Plus âgé d'abord => année de naissance plus petite en premier
  if (aYear != null && bYear != null && aYear !== bYear) return aYear - bYear;
  if (aYear != null && bYear == null) return -1;
  if (aYear == null && bYear != null) return 1;

  const prenomCmp = (a.prenom || "").localeCompare(b.prenom || "", "fr", { sensitivity: "base" });
  if (prenomCmp !== 0) return prenomCmp;
  const surnomCmp = (a.surnom || "").localeCompare(b.surnom || "", "fr", { sensitivity: "base" });
  if (surnomCmp !== 0) return surnomCmp;
  const nomCmp = (a.nom || "").localeCompare(b.nom || "", "fr", { sensitivity: "base" });
  if (nomCmp !== 0) return nomCmp;
  return aId - bId;
}

/* ── Layout ── */
const NODE_W = 160, NODE_H = 66, GAP_X = 54, GAP_Y = 56;

function computeLayout(rootId) {
  const sorted = s => [...s].sort((a, b) => a - b);
  const pos = new Map();
  const root = get(rootId);
  const STEP = NODE_W + GAP_X;

  function placeRow(ids, y) {
    if (!ids.length) return;
    const totalW = ids.length * NODE_W + (ids.length - 1) * GAP_X;
    let x = -totalW / 2 + NODE_W / 2;
    ids.forEach(id => { pos.set(id, { x, y }); x += STEP; });
  }

  function placeChildrenRow(ids, y, allowedParents = null) {
    if (!ids.length) return;

    const groups = new Map();
    ids.forEach(id => {
      const parentIds = [...get(id).parents]
        .filter(pid => pos.has(pid) && (!allowedParents || allowedParents.has(pid)))
        .sort((a, b) => (pos.get(a).x + NODE_W / 2) - (pos.get(b).x + NODE_W / 2) || a - b);

      const key = parentIds.join("|") || `solo:${id}`;
      if (!groups.has(key)) {
        const anchorCenter = parentIds.length
          ? parentIds.reduce((sum, pid) => sum + pos.get(pid).x + NODE_W / 2, 0) / parentIds.length
          : 0;
        groups.set(key, { ids: [], anchorCenter });
      }
      groups.get(key).ids.push(id);
    });

    const orderedGroups = [...groups.values()]
      .map(group => ({
        ...group,
        ids: group.ids.sort(compareByAgeThenName),
      }))
      .sort((a, b) => a.anchorCenter - b.anchorCenter);

    let lastPlacedX = null;
    orderedGroups.forEach(group => {
      const totalW = group.ids.length * NODE_W + (group.ids.length - 1) * GAP_X;
      let startX = group.anchorCenter - totalW / 2;

      if (lastPlacedX != null) {
        startX = Math.max(startX, lastPlacedX + STEP);
      }

      group.ids.forEach((id, index) => {
        const x = startX + index * STEP;
        pos.set(id, { x, y });
        lastPlacedX = x;
      });
    });
  }

  /* ── Collecte ── */
  const parents1 = sorted(root.parents);
  const parents1Set = new Set(parents1);

  const enfants1 = [...root.enfants].sort(compareByAgeThenName);
  const enfants1Set = new Set(enfants1);
  const enfants2 = [...new Set(enfants1.flatMap(eid => [...get(eid).enfants]))]
    .filter(id => id !== root.id && !enfants1Set.has(id))
    .sort(compareByAgeThenName);

  /* Oncles/tantes : frères/sœurs des parents */
  const onclesTantes = afficherOnclesCousins
    ? [...new Set(parents1.flatMap(pid => [...get(pid).freres]))]
        .filter(id => id !== root.id && !parents1Set.has(id))
        .sort(compareByAgeThenName)
    : [];
  const onclesSet = new Set(onclesTantes);

  /* Cousins : enfants des oncles/tantes */
  const freresViaParents = [...new Set(parents1.flatMap(pid => [...get(pid).enfants]))]
    .filter(id => id !== root.id)
    .sort(compareByAgeThenName);

  const cousins = afficherOnclesCousins
    ? [...new Set(onclesTantes.flatMap(oid => [...get(oid).enfants]))]
        .filter(id => id !== root.id && !enfants1Set.has(id) && !freresViaParents.includes(id))
        .sort(compareByAgeThenName)
    : [];

  /* Grands-parents : parents des parents + parents des oncles */
  const gpAll = sorted([...new Set(
    [...parents1, ...onclesTantes].flatMap(id => [...get(id).parents])
  )]).filter(id => id !== root.id && !parents1Set.has(id) && !onclesSet.has(id));
  const gpSet = new Set(gpAll);

  /* ── Niveau -1 : parents + oncles triés pour réduire les croisements ── *
   * Principe : les enfants d'un même grand-parent sont regroupés et placés
   * consécutivement selon l'ordre gauche→droite des grands-parents.          */
  const level1Row = [...parents1, ...onclesTantes].sort((a, b) => {
    function gpKey(id) {
      const gps = [...get(id).parents].filter(p => gpSet.has(p));
      if (!gps.length) return gpAll.length / 2;
      return gps.reduce((s, p) => s + gpAll.indexOf(p), 0) / gps.length;
    }
    const diff = gpKey(a) - gpKey(b);
    if (Math.abs(diff) > 0.001) return diff;
    return compareByAgeThenName(a, b);
  });

  if (level1Row.length) {
    placeRow(level1Row, -(NODE_H + GAP_Y));
    /* Recentrer la ligne sur les parents directs (pas les oncles) */
    if (parents1.length > 0) {
      const cx1 = parents1.reduce((s, pid) => s + pos.get(pid).x, 0) / parents1.length;
      level1Row.forEach(id => { pos.get(id).x -= cx1; });
    }
  }

  /* ── Niveau -2 : grands-parents au-dessus du centre de leurs enfants ── */
  if (gpAll.length) {
    gpAll.forEach(gpid => {
      const ch = [...get(gpid).enfants].filter(id => pos.has(id));
      const avgX = ch.length ? ch.reduce((s, id) => s + pos.get(id).x, 0) / ch.length : 0;
      pos.set(gpid, { x: avgX, y: -2 * (NODE_H + GAP_Y) });
    });
    /* Éviter les chevauchements entre grands-parents */
    const gpsX = [...gpAll].sort((a, b) => pos.get(a).x - pos.get(b).x);
    for (let i = 1; i < gpsX.length; i++) {
      const prev = pos.get(gpsX[i - 1]);
      const curr = pos.get(gpsX[i]);
      if (curr.x - prev.x < STEP) curr.x = prev.x + STEP;
    }
  }

  /* ── Niveau 0 : racine, frères, conjoints, cousins ── */
  pos.set(root.id, { x: 0, y: 0 });

  /* Frères/sœurs à gauche, uniquement via parent(s) commun(s) */
  const freres = freresViaParents;
  freres.slice().reverse().forEach((fid, i) =>
    pos.set(fid, { x: -(i + 1) * STEP, y: 0 })
  );

  /* Conjoints à droite, décalés verticalement */
  const conjoints = sorted(root.conjoints);
  const spouseStepY = NODE_H + 22;
  const spouseStartY = -((conjoints.length - 1) * spouseStepY) / 2;
  conjoints.forEach((cid, i) =>
    pos.set(cid, { x: STEP, y: spouseStartY + i * spouseStepY })
  );

  /* Cousins :
   * - oncle à gauche (x < 0) → cousin à GAUCHE des frères (ligne croisement nul)
   * - oncle à droite (x ≥ 0) → cousin à DROITE des conjoints                     */
  if (cousins.length) {
    const leftC = [], rightC = [];
    cousins.forEach(cid => {
      const op = [...get(cid).parents].find(pid => onclesSet.has(pid) && pos.has(pid));
      const ox = op ? pos.get(op).x : 0;
      (ox < 0 ? leftC : rightC).push({ cid, ox });
    });

    /* Cousins gauches : oncle le + à gauche → cousin le + à gauche */
    leftC.sort((a, b) => a.ox - b.ox);
    const minFx = freres.length ? -(freres.length) * STEP : 0;
    let lx = minFx - leftC.length * STEP;
    leftC.forEach(({ cid }) => { pos.set(cid, { x: lx, y: 0 }); lx += STEP; });

    /* Cousins droits : à droite du dernier conjoint/nœud niveau 0 */
    rightC.sort((a, b) => a.ox - b.ox);
    let maxRx = 0;
    pos.forEach(({ x, y }) => { if (y === 0 && x > maxRx) maxRx = x; });
    let rx = maxRx + STEP;
    rightC.forEach(({ cid }) => { pos.set(cid, { x: rx, y: 0 }); rx += STEP; });
  }

  /* ── Niveaux +1 et +2 ── */
  placeChildrenRow(enfants1, NODE_H + GAP_Y, new Set([root.id, ...conjoints]));
  placeChildrenRow(enfants2, 2 * (NODE_H + GAP_Y), new Set(enfants1));

  /* Normaliser avec padding */
  const PAD = 64;
  let minX = Infinity, minY = Infinity;
  pos.forEach(({ x, y }) => { if (x < minX) minX = x; if (y < minY) minY = y; });
  const out = new Map();
  pos.forEach((v, id) => out.set(id, { x: v.x - minX + PAD, y: v.y - minY + PAD }));
  return out;
}

/* ── Rendu SVG des arêtes ── */
const edgeSvg   = document.getElementById("edgeSvg");
const treeNodes = document.getElementById("treeNodes");
const treeZone  = document.getElementById("treeZone");

function cx(pos, id) { const p = pos.get(id); return p ? p.x + NODE_W / 2 : 0; }
function cy(pos, id) { const p = pos.get(id); return p ? p.y + NODE_H / 2 : 0; }
function topY(pos, id)    { const p = pos.get(id); return p ? p.y : 0; }
function bottomY(pos, id) { const p = pos.get(id); return p ? p.y + NODE_H : 0; }

function renderEdges(rootId, pos) {
  const root = get(rootId);
  const paths = [];
  const sorted = s => [...s].sort((a, b) => a - b);

  const parents1 = sorted(root.parents).filter(pid => pos.has(pid));
  const enfants1 = sorted(root.enfants).filter(eid => pos.has(eid));
  const freresViaParents = [...new Set(parents1.flatMap(pid => [...get(pid).enfants]))]
    .filter(id => id !== root.id && pos.has(id))
    .sort(compareByAgeThenName);
  const onclesTantes = afficherOnclesCousins
    ? [...new Set(
      parents1.flatMap(pid => [...get(pid).freres])
    )].filter(id => id !== root.id && pos.has(id))
    : [];
  const cousins = afficherOnclesCousins
    ? [...new Set(onclesTantes.flatMap(oid => [...get(oid).enfants]))]
      .filter(id => id !== root.id && pos.has(id))
    : [];
  const petitsEnfants = [...new Set(enfants1.flatMap(eid => [...get(eid).enfants]))]
    .filter(id => pos.has(id))
    .sort(compareByAgeThenName);

  const drawLine = (x1, y1, x2, y2, stroke = "var(--edge-color)") => {
    paths.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
      stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>`);
  };

  const drawFamilyConnector = (parentIds, childIds) => {
    const parents = [...new Set(parentIds)]
      .filter(id => pos.has(id))
      .sort((a, b) => cx(pos, a) - cx(pos, b) || a - b);
    const children = [...new Set(childIds)]
      .filter(id => pos.has(id))
      .sort((a, b) => cx(pos, a) - cx(pos, b) || a - b);

    if (!parents.length || !children.length) return;

    const parentBottom = Math.max(...parents.map(id => bottomY(pos, id)));
    const childTop = Math.min(...children.map(id => topY(pos, id)));
    let joinY = parentBottom + 14;
    let childBarY = childTop - 16;

    if (childBarY <= joinY) {
      const midY = (parentBottom + childTop) / 2;
      joinY = midY - 6;
      childBarY = midY + 6;
    }

    const parentXs = parents.map(id => cx(pos, id));
    const familyX = parentXs.length === 1
      ? parentXs[0]
      : (parentXs[0] + parentXs[parentXs.length - 1]) / 2;

    parents.forEach(pid => {
      drawLine(cx(pos, pid), bottomY(pos, pid), cx(pos, pid), joinY);
    });

    if (parents.length > 1) {
      drawLine(parentXs[0], joinY, parentXs[parentXs.length - 1], joinY);
    }

    drawLine(familyX, joinY, familyX, childBarY);

    if (children.length > 1) {
      const minChildX = Math.min(familyX, ...children.map(id => cx(pos, id)));
      const maxChildX = Math.max(familyX, ...children.map(id => cx(pos, id)));
      drawLine(minChildX, childBarY, maxChildX, childBarY);
    }

    children.forEach(cid => {
      drawLine(cx(pos, cid), childBarY, cx(pos, cid), topY(pos, cid));
    });
  };

  const drawGroupedFamilies = (childIds, allowedParents = null) => {
    const groups = new Map();

    childIds.forEach(childId => {
      const visibleParents = [...get(childId).parents]
        .filter(pid => pos.has(pid) && (!allowedParents || allowedParents.has(pid)))
        .sort((a, b) => cx(pos, a) - cx(pos, b) || a - b);

      if (!visibleParents.length) return;

      const key = visibleParents.join("|");
      if (!groups.has(key)) {
        groups.set(key, { parentIds: visibleParents, childIds: [] });
      }
      groups.get(key).childIds.push(childId);
    });

    [...groups.values()]
      .sort((a, b) => {
        const ax = a.parentIds.reduce((sum, id) => sum + cx(pos, id), 0) / a.parentIds.length;
        const bx = b.parentIds.reduce((sum, id) => sum + cx(pos, id), 0) / b.parentIds.length;
        return ax - bx;
      })
      .forEach(group => {
        drawFamilyConnector(group.parentIds, group.childIds.sort(compareByAgeThenName));
      });
  };

  drawGroupedFamilies([rootId, ...freresViaParents], new Set(parents1));

  const grandsParentsVisibles = [...new Set(
    [...parents1, ...onclesTantes].flatMap(id => [...get(id).parents])
  )].filter(id => pos.has(id));
  drawGroupedFamilies([...parents1, ...onclesTantes], new Set(grandsParentsVisibles));

  const conjointsVisible = [...root.conjoints].filter(cid => pos.has(cid));
  drawGroupedFamilies(enfants1, new Set([rootId, ...conjointsVisible]));
  drawGroupedFamilies(petitsEnfants, new Set(enfants1));
  drawGroupedFamilies(cousins, new Set(onclesTantes));

  /* conjoint (ligne rose dédiée par conjoint) */
  root.conjoints.forEach(cid => {
    if (!pos.has(cid)) return;
    const x1 = pos.get(rootId).x + NODE_W;
    const x2 = pos.get(cid).x;
    const y1 = cy(pos, rootId);
    const y2 = cy(pos, cid);
    const mx = (x1 + x2) / 2;
    paths.push(`<path d="M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}"
      fill="none" stroke="var(--edge-spouse)" stroke-width="2" stroke-linecap="round"/>`);
  });

  /* Taille du SVG */
  let maxX = 0, maxY = 0;
  pos.forEach(({ x, y }) => {
    if (x + NODE_W > maxX) maxX = x + NODE_W;
    if (y + NODE_H > maxY) maxY = y + NODE_H;
  });
  edgeSvg.setAttribute("width",  maxX + 64);
  edgeSvg.setAttribute("height", maxY + 64);
  edgeSvg.innerHTML = paths.join("\n");
}

/* ── Rendu des nœuds ── */
function buildNodeEl(id, pos, isSelected, isConjoint = false) {
  const p = get(id);
  const { x, y } = pos.get(id);
  const div = document.createElement("div");
  const sexClass = p.sexe === "homme" ? " sex-homme" : p.sexe === "femme" ? " sex-femme" : p.sexe === "autre" ? " sex-autre" : "";
  div.className = "node" + sexClass + (isSelected ? " selected" : "") + (isConjoint ? " conjoint" : "");
  div.dataset.nodeId = id;
  div.title = "Cliquer pour centrer l'arbre";
  div.style.left = x + "px";
  div.style.top  = y + "px";
  div.innerHTML = `
    <button class="node-edit-btn" data-edit-id="${id}" title="Éditer cette personne">✏️</button>
    <button class="plus top"    data-action="add-parent"  data-id="${id}" title="Ajouter un parent">+</button>
    <button class="plus spouse" data-action="add-spouse"  data-id="${id}" title="Ajouter un conjoint">♥</button>
    <button class="plus left"   data-action="add-sibling" data-id="${id}" title="Ajouter un frère/sœur">+</button>
    <button class="plus bottom" data-action="add-child"   data-id="${id}" title="Ajouter un enfant">+</button>
    <div class="name">${displayName(p)}</div>
    <div class="date">${p.dateVie || "Date non renseignée"}</div>
  `;
  return div;
}

/* ── Bouton enfant sur la relation conjugale ── */
function renderCoupleButtons(rootId, pos) {
  const root = get(rootId);
  root.conjoints.forEach(cid => {
    if (!pos.has(cid)) return;
    const rp   = pos.get(rootId);
    const cp   = pos.get(cid);
    // Zone de survol couvrant la courbe conjoint
    const x1 = rp.x + NODE_W;
    const x2 = cp.x;
    const y1 = rp.y + NODE_H / 2;
    const y2 = cp.y + NODE_H / 2;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const zone = document.createElement("div");
    zone.className = "couple-child-zone";
    zone.style.left = Math.min(x1, x2) + "px";
    zone.style.top = (Math.min(y1, y2) - 9) + "px";
    zone.style.width = Math.max(24, Math.abs(x2 - x1)) + "px";
    zone.style.height = (Math.abs(y2 - y1) + 18) + "px";

    const btn  = document.createElement("button");
    btn.className        = "couple-child-btn";
    btn.title            = "Ajouter un enfant au couple";
    btn.textContent      = "+";
    btn.style.left       = (midX - Math.min(x1, x2) - 13) + "px";
    btn.style.top        = (midY - Math.min(y1, y2) - 13) + "px";
    btn.dataset.parentA  = String(rootId);
    btn.dataset.parentB  = String(cid);

    zone.appendChild(btn);
    treeNodes.appendChild(zone);
  });
}

/* ── Rendu principal ── */
function renderSelect() {
  const sel = document.getElementById("personneRacine");
  const all = [...personnes.values()].sort((a, b) => a.id - b.id);
  sel.innerHTML = all.map(p =>
    `<option value="${p.id}">[${p.id}] ${displayName(p)}</option>`
  ).join("");
  if (selectedId == null || !personnes.has(selectedId))
    selectedId = all[0]?.id ?? null;
  sel.value = String(selectedId);
}

function centerViewportOnSelected(pos, id) {
  const p = pos.get(id);
  if (!p || !treeZone) return;

  const targetX = p.x + NODE_W / 2 - treeZone.clientWidth / 2;
  const targetY = p.y + NODE_H / 2 - treeZone.clientHeight / 2;

  const maxX = Math.max(0, treeZone.scrollWidth - treeZone.clientWidth);
  const maxY = Math.max(0, treeZone.scrollHeight - treeZone.clientHeight);

  treeZone.scrollTo({
    left: Math.max(0, Math.min(maxX, targetX)),
    top: Math.max(0, Math.min(maxY, targetY)),
    behavior: "smooth",
  });
}

function renderTree() {
  treeNodes.innerHTML = "";
  edgeSvg.innerHTML   = "";

  if (!personnes.size) {
    treeNodes.innerHTML = `<div class="empty">Aucune personne.<br>Cliquez sur "👥 Gestion des personnes" pour commencer.</div>`;
    renderSelect();
    return;
  }

  renderSelect();
  const pos = computeLayout(selectedId);

  /* Taille conteneur */
  let maxX = 0, maxY = 0;
  pos.forEach(({ x, y }) => {
    if (x + NODE_W + 64 > maxX) maxX = x + NODE_W + 64;
    if (y + NODE_H + 64 > maxY) maxY = y + NODE_H + 64;
  });
  treeNodes.style.width  = maxX + "px";
  treeNodes.style.height = maxY + "px";

  renderEdges(selectedId, pos);
  const rootNode = get(selectedId);
  pos.forEach((_, id) => treeNodes.appendChild(
    buildNodeEl(id, pos, id === selectedId, rootNode.conjoints.has(id))
  ));
  renderCoupleButtons(selectedId, pos);

  requestAnimationFrame(() => centerViewportOnSelected(pos, selectedId));
}

/* ── Interactions ── */
function saisirPersonne(initial = { nom: "", surnom: "", prenom: "", dateVie: "", sexe: "" }, title = "Ajouter une personne") {
  return new Promise(resolve => {
    personFormTitleEl.textContent = title;
    personNomInputEl.value = initial.nom ?? "";
    personSurnomInputEl.value = initial.surnom ?? "";
    personPrenomInputEl.value = initial.prenom ?? "";
    personDateInputEl.value = initial.dateVie ?? "";
    personSexeInputEl.value = initial.sexe ?? "";

    function close(value) {
      personFormModalEl.classList.add("hidden");
      personFormModalEl.setAttribute("aria-hidden", "true");
      personFormEl.removeEventListener("submit", onSubmit);
      personFormCancelEl.removeEventListener("click", onCancel);
      personFormModalEl.removeEventListener("click", onBackdrop);
      resolve(value ?? null);
    }

    function onSubmit(e) {
      e.preventDefault();
      const nom = personNomInputEl.value.trim();
      const surnom = personSurnomInputEl.value.trim();
      const prenom = personPrenomInputEl.value.trim();
      const dateVie = personDateInputEl.value.trim();
      const sexe = personSexeInputEl.value.trim();
      if (!prenom) {
        alert("Le prénom est obligatoire.");
        personPrenomInputEl.focus();
        return;
      }
      close({ nom, surnom, prenom, dateVie, sexe });
    }

    function onCancel() { close(null); }
    function onBackdrop(e) {
      if (e.target === personFormModalEl) close(null);
    }

    personFormEl.addEventListener("submit", onSubmit);
    personFormCancelEl.addEventListener("click", onCancel);
    personFormModalEl.addEventListener("click", onBackdrop);

    personFormModalEl.classList.remove("hidden");
    personFormModalEl.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => personPrenomInputEl.focus());
  });
}

async function handlePlus(action, baseId) {
  baseId = Number(baseId);

  if (action === "add-sibling") {
    const base = get(baseId);

    // Éligibles =
    // 1) frère/sœur d'un frère/sœur existant de base
    // 2) enfant d'au moins un parent de base
    const eligibles = new Set();

    base.freres.forEach(fid => {
      get(fid).freres.forEach(candidateId => eligibles.add(candidateId));
    });

    base.parents.forEach(pid => {
      get(pid).enfants.forEach(candidateId => eligibles.add(candidateId));
    });

    const candidats = [...eligibles]
      .filter(id => id !== baseId && !base.freres.has(id))
      .sort((a, b) => a - b);

    const choice = await showChoiceModal({
      title: "Ajouter un frère/une sœur",
      subtitle: candidats.length
        ? "Les personnes éligibles sont proposées directement ci-dessous."
        : "Aucune personne éligible à rattacher. Vous pouvez créer une nouvelle personne.",
      options: [
        { value: "new", label: "Créer un nouveau frère/une nouvelle sœur" },
        ...candidats.map(id => {
          const p = get(id);
          return {
            value: `existing:${id}`,
            label: `Rattacher : [${id}] ${p.prenom} ${p.nom}`,
          };
        }),
      ],
    });

    if (!choice) return;

    if (typeof choice === "string" && choice.startsWith("existing:")) {
      const otherId = Number(choice.split(":")[1]);
      if (!personnes.has(otherId)) return;
      addSibling(baseId, Number(otherId));
      persistLocal();
      renderTree();
      return;
    }

    if (choice !== "new") return;
  }

  const infos = await saisirPersonne();
  if (!infos) return;
  const nid = newPersonne(infos.nom, infos.prenom, infos.dateVie, infos.surnom, infos.sexe);
  if      (action === "add-parent")  addParent(nid, baseId);
  else if (action === "add-child")   addParent(baseId, nid);
  else if (action === "add-sibling") addSibling(baseId, nid);
  else if (action === "add-spouse")  addSpouse(baseId, nid);
  persistLocal();
  renderTree();
}

async function handleCoupleChildAdd(parentAId, parentBId) {
  parentAId = Number(parentAId);
  parentBId = Number(parentBId);
  const parentA = get(parentAId);
  const parentB = get(parentBId);

  const candidats = [...new Set([...parentA.enfants, ...parentB.enfants])]
    .filter(childId => {
      const child = get(childId);
      return !(child.parents.has(parentAId) && child.parents.has(parentBId));
    })
    .sort((a, b) => a - b);

  const choice = await showChoiceModal({
    title: "Ajouter un enfant au couple",
    subtitle: `${displayName(parentA)} + ${displayName(parentB)}`,
    options: [
      { value: "new", label: "Créer un nouvel enfant" },
      ...candidats.map(id => {
        const c = get(id);
        return {
          value: `existing:${id}`,
          label: `Rattacher : [${id}] ${displayName(c)}`,
        };
      }),
    ],
  });

  if (!choice) return;

  if (choice === "new") {
    const infos = await saisirPersonne();
    if (!infos) return;
    const nid = newPersonne(infos.nom, infos.prenom, infos.dateVie, infos.surnom, infos.sexe);
    addParent(parentAId, nid);
    addParent(parentBId, nid);
    persistLocal();
    return;
  }

  if (typeof choice === "string" && choice.startsWith("existing:")) {
    const childId = Number(choice.split(":")[1]);
    if (!personnes.has(childId)) return;
    addParent(parentAId, childId);
    addParent(parentBId, childId);
    persistLocal();
  }
}

treeNodes.addEventListener("click", async e => {
  /* Crayon sur le nœud: édition directe de la personne */
  const editBtn = e.target.closest(".node-edit-btn");
  if (editBtn) {
    e.stopPropagation();
    try {
      await editPersonFlow(Number(editBtn.dataset.editId), true);
      renderTree();
    } catch (err) {
      alert(err.message || "Erreur pendant l'édition.");
    }
    return;
  }

  /* Bouton enfant du couple */
  const coupleBtn = e.target.closest(".couple-child-btn");
  if (coupleBtn) {
    e.stopPropagation();
    try {
      await handleCoupleChildAdd(coupleBtn.dataset.parentA, coupleBtn.dataset.parentB);
      renderTree();
    } catch (err) { alert(err.message); }
    return;
  }
  /* Boutons + sur les nœuds */
  const plus = e.target.closest(".plus");
  if (plus) {
    e.stopPropagation();
    try { await handlePlus(plus.dataset.action, Number(plus.dataset.id)); }
    catch (err) { alert(err.message); }
    return;
  }
  /* Clic sur un nœud : recentrer l'arbre */
  const node = e.target.closest(".node");
  if (node) { selectedId = Number(node.dataset.nodeId); renderTree(); }
});

document.getElementById("personneRacine").addEventListener("change", e => {
  selectedId = Number(e.target.value); renderTree();
});

document.getElementById("btnNouvelleRacine").addEventListener("click", async () => {
  await openPersonEditor();
  renderTree();
});

/* ── Persistance ── */
function serialize() {
  return {
    nextId, selectedId, afficherOnclesCousins,
    personnes: [...personnes.values()].map(p => ({
      ...p, parents: [...p.parents], enfants: [...p.enfants],
      freres: [...p.freres], conjoints: [...p.conjoints],
    })),
  };
}

function deserialize(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Format de sauvegarde invalide.");
  }

  personnes.clear();
  nextId     = Number(data?.nextId ?? 1);
  selectedId = data?.selectedId != null ? Number(data.selectedId) : null;
  afficherOnclesCousins = Boolean(data?.afficherOnclesCousins ?? false);
  (data?.personnes ?? []).forEach(p => {
    personnes.set(Number(p.id), {
      id: Number(p.id), nom: p.nom, prenom: p.prenom, dateVie: p.dateVie ?? null,
      surnom: p.surnom ?? "",
      sexe: p.sexe ?? "",
      parents:   new Set(p.parents   ?? []),
      enfants:   new Set(p.enfants   ?? []),
      freres:    new Set(p.freres    ?? []),
      conjoints: new Set(p.conjoints ?? []),
    });
  });
  if (selectedId && !personnes.has(selectedId)) selectedId = null;
  const toggle = document.getElementById("toggleOnclesCousins");
  if (toggle) toggle.checked = afficherOnclesCousins;
  renderTree();
}

document.getElementById("toggleOnclesCousins").addEventListener("change", (e) => {
  afficherOnclesCousins = Boolean(e.target.checked);
  persistLocal();
  renderTree();
});

document.getElementById("btnSauver").addEventListener("click", () => {
  persistLocal({ notify: true });
});

document.getElementById("btnCharger").addEventListener("click", () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      alert("Aucune sauvegarde trouvée.");
      return;
    }
    deserialize(JSON.parse(raw));
    alert("Chargement effectué.");
  } catch (err) {
    alert("Sauvegarde invalide ou inaccessible.");
    console.error("Erreur chargement local:", err);
  }
});

document.getElementById("btnExporter").addEventListener("click", () => {
  try {
    const data = serialize();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const stamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      "_",
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
    ].join("");

    const a = document.createElement("a");
    a.href = url;
    a.download = `arbre-genealogique-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  } catch (err) {
    alert("Erreur pendant l'export JSON.");
    console.error("Erreur export JSON:", err);
  }
});

document.getElementById("btnImporter").addEventListener("click", () => {
  const input = document.getElementById("fileImporter");
  input.value = "";
  input.click();
});

document.getElementById("fileImporter").addEventListener("change", async (e) => {
  try {
    const input = e.target;
    const file = input.files && input.files[0];
    if (!file) return;

    const text = await file.text();
    const data = JSON.parse(text);
    deserialize(data);
    alert("Import JSON effectué.");
  } catch (err) {
    alert("Fichier JSON invalide ou import impossible.");
    console.error("Erreur import JSON:", err);
  }
});

document.getElementById("btnVider").addEventListener("click", () => {
  if (!confirm("Supprimer toutes les données ?")) return;
  personnes.clear();
  selectedId = null;
  nextId = 1;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Erreur suppression sauvegarde locale:", err);
  }
  renderTree();
});

/* Démarrage */
(function init() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      deserialize(JSON.parse(raw));
      return;
    }
  } catch (err) {
    console.error("Erreur auto-chargement local:", err);
  }
  const toggle = document.getElementById("toggleOnclesCousins");
  if (toggle) toggle.checked = afficherOnclesCousins;
  renderTree();
})();
