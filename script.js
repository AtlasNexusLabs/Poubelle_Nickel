document.addEventListener("DOMContentLoaded", () => {
  const nbBacsSelect = document.getElementById("nb-bacs");
  const frequenceSelect = document.getElementById("frequence");
  const adresseInput = document.getElementById("adresse");
  const totalPriceEl = document.getElementById("total-price");
  const bookingForm = document.getElementById("booking-form");
  const feedbackEl = document.getElementById("form-feedback");

  // Calcul : 15 € la 1re poubelle + 10 € par poubelle supplémentaire
  function calculerPrix(nbBacs) {
    if (nbBacs <= 1) return 15;
    return 15 + (nbBacs - 1) * 10;
  }

  function mettreAJourAffichage() {
    const nb = parseInt(nbBacsSelect.value, 10);
    const total = calculerPrix(nb);
    totalPriceEl.textContent = `${total} €`;
  }

  nbBacsSelect.addEventListener("change", mettreAJourAffichage);

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nb = parseInt(nbBacsSelect.value, 10);
    const total = calculerPrix(nb);
    const frequence = frequenceSelect.value;
    const adresse = adresseInput.value.trim();

    const texteSms = `Bonjour Poubelle Nickel, je souhaite réserver un nettoyage (${nb} poubelle(s) - ${frequence}, estimation ${total} €). Secteur : ${adresse}.`;
    const smsUrl = `sms:0787042046?body=${encodeURIComponent(texteSms)}`;

    feedbackEl.textContent = "Ouverture de votre application SMS avec le message pré-rempli...";
    window.location.href = smsUrl;
  });
});
