document.addEventListener("DOMContentLoaded", () => {
  const TEL_INTL = "+33787042046";
  const PRIX_PREMIERE = 15;
  const PRIX_SUPPLEMENT = 10;
  const MIN = 1;
  const MAX = 30;

  const nbInput = document.getElementById("nb");
  const moins = document.getElementById("moins");
  const plus = document.getElementById("plus");
  const frequenceSelect = document.getElementById("frequence");
  const prenomInput = document.getElementById("prenom");
  const nomInput = document.getElementById("nom");
  const adresseInput = document.getElementById("adresse");
  const communeInput = document.getElementById("commune");
  const collecteSelect = document.getElementById("collecte");
  const totalEl = document.getElementById("total-price");
  const noteEl = document.getElementById("estimate-note");
  const form = document.getElementById("booking-form");
  const resultBox = document.getElementById("sms-result");
  const smsText = document.getElementById("sms-text");
  const copierBtn = document.getElementById("copier");
  const copieOk = document.getElementById("copie-ok");

  // 15 € la première poubelle, puis 10 € de plus par poubelle supplémentaire
  function calculerPrix(nb) {
    return PRIX_PREMIERE + (nb - 1) * PRIX_SUPPLEMENT;
  }

  // Lit le nombre saisi et le garde entre MIN et MAX
  function lireNombre() {
    let nb = parseInt(nbInput.value, 10);
    if (Number.isNaN(nb)) nb = MIN;
    return Math.min(MAX, Math.max(MIN, nb));
  }

  function mettreAJour() {
    const nb = lireNombre();
    totalEl.textContent = calculerPrix(nb) + "\u00a0€";

    // Une note n’est affichée que pour l’abonnement
    const abonnement = frequenceSelect.selectedIndex === 1;
    if (abonnement) {
      noteEl.textContent = "Tarif par passage. Le prix de l’abonnement est confirmé avec vous par SMS.";
      noteEl.hidden = false;
    } else {
      noteEl.textContent = "";
      noteEl.hidden = true;
    }
  }

  function changerNombre(delta) {
    nbInput.value = Math.min(MAX, Math.max(MIN, lireNombre() + delta));
    mettreAJour();
  }

  moins.addEventListener("click", () => changerNombre(-1));
  plus.addEventListener("click", () => changerNombre(1));
  nbInput.addEventListener("input", mettreAJour);
  nbInput.addEventListener("blur", () => {
    nbInput.value = lireNombre();
    mettreAJour();
  });
  frequenceSelect.addEventListener("change", mettreAJour);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Le navigateur bloque l’envoi si prénom, nom, adresse ou commune sont vides
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nb = lireNombre();
    nbInput.value = nb;
    const total = calculerPrix(nb);

    const lignes = [
      "Bonjour Atlas,",
      "je souhaite réserver " + frequenceSelect.value + " pour " + nb + " poubelle" + (nb > 1 ? "s" : "") +
        " (estimation : " + total + " €).",
      "Nom : " + prenomInput.value.trim() + " " + nomInput.value.trim(),
      "Adresse : " + adresseInput.value.trim() + ", " + communeInput.value.trim()
    ];
    if (collecteSelect.value) {
      lignes.push("Jour de collecte : " + collecteSelect.value);
    }
    lignes.push("Quand pouvez-vous passer ?");
    const message = lignes.join("\n");

    // Le message est toujours affiché, pour pouvoir le copier si l’appli SMS ne s’ouvre pas
    smsText.value = message;
    resultBox.hidden = false;
    copieOk.textContent = "";

    window.location.href = "sms:" + TEL_INTL + "?&body=" + encodeURIComponent(message);
  });

  copierBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(smsText.value);
    } catch (err) {
      smsText.select();
      document.execCommand("copy");
    }
    copieOk.textContent = "Message copié.";
  });

  mettreAJour();
});
