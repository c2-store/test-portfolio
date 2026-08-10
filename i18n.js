// Dictionnaire de traduction
const translations = {
  fr: {
    "Qui suis-je ?": "Qui suis-je ?",
    "Projets": "Projets",
    "Un peu plus sur moi": "Un peu plus sur moi",
    "Assistant IA": "Assistant IA",
    "Contact": "Contact",
    "Theo Vigouroux &middot; Etudiant GEII &middot; Futur Ingenieur": "Theo Vigouroux · Étudiant GEII · Futur Ingénieur",
    "Electricite.<br>Code. Innovation.": "Électricité.<br>Code. Innovation.",
    "BUT Genie Electrique et Informatique Industrielle &mdash; passionne par les systemes embarques et l'aeronautique.": "BUT Génie Électrique et Informatique Industrielle — passionné par les systèmes embarqués et l'aéronautique.",
    "Voir mes projets": "Voir mes projets",
    "Mon objectif": "Mon objectif",
    "Technique, leadership,<br>et ambition.": "Technique, leadership,<br>et ambition.",
    "Je combine une solide rigueur technique avec une capacite naturelle a federer des equipes. Ma voie : l'excellence operationnelle dans le secteur aeronautique.": "Je combine une solide rigueur technique avec une capacité naturelle à fédérer des équipes. Ma voie : l'excellence opérationnelle dans le secteur aéronautique.",
    "Electronique &amp; Embarque": "Électronique & Embarqué",
    "De la conception de circuits NE555 a la programmation Arduino, je maitrise la chaine complete de l'electronique industrielle.": "De la conception de circuits NE555 à la programmation Arduino, je maîtrise la chaîne complète de l'électronique industrielle.",
    "Developpement Software": "Développement Software",
    "Programmation en C, MicroPython et Arduino. Creation de logiciels, jeux et systemes de controle embarques.": "Programmation en C, MicroPython et Arduino. Création de logiciels, jeux et systèmes de contrôle embarqués.",
    "Conception CAO": "Conception CAO",
    "Modelisation 3D avec SolidWorks — coques de protection, supports cameras, fabrication orientee contraintes reelles.": "Modélisation 3D avec SolidWorks — coques de protection, supports caméras, fabrication orientée contraintes réelles.",
    "Vision Aeronautique": "Vision Aéronautique",
    "Mon ambition : rejoindre Air France en tant qu'ingenieur cadre, au coeur de la maintenance et de l'innovation de demain.": "Mon ambition : rejoindre Air France en tant qu'ingénieur cadre, au cœur de la maintenance et de l'innovation de demain.",
    "Formation &amp; Experience": "Formation & Expérience",
    "Un parcours construit<br>avec methode.": "Un parcours construit<br>avec méthode.",
    "Realisations": "Réalisations",
    "Projets phares.": "Projets phares.",
    "Voir tous les projets &rarr;": "Voir tous les projets →",
    "Competences": "Compétences",
    "Hard skills &amp; Soft skills.": "Hard skills & Soft skills.",
    "Programmation C": "Programmation C",
    "MicroPython / Arduino": "MicroPython / Arduino",
    "Electronique analogique": "Électronique analogique",
    "SolidWorks (CAO)": "SolidWorks (CAO)",
    "Systemes embarques": "Systèmes embarqués",
    "Electronique numerique": "Électronique numérique",
    "Au-dela du technique": "Au-delà du technique",
    "Decouvrir mon univers &rarr;": "Découvrir mon univers →",
    "L'excellence aeronautique<br>comme horizon.": "L'excellence aéronautique<br>comme horizon.",
    "Cadre Ingenieur<br>chez Air France": "Cadre Ingénieur<br>chez Air France",
    "Travaillons<br>ensemble.": "Travaillons<br>ensemble."
  },
  en: {
    "Qui suis-je ?": "About Me",
    "Projets": "Projects",
    "Un peu plus sur moi": "More About Me",
    "Assistant IA": "AI Assistant",
    "Contact": "Contact",
    "Theo Vigouroux &middot; Etudiant GEII &middot; Futur Ingenieur": "Theo Vigouroux · ECE Student · Future Engineer",
    "Electricite.<br>Code. Innovation.": "Electricity.<br>Code. Innovation.",
    "BUT Genie Electrique et Informatique Industrielle &mdash; passionne par les systemes embarques et l'aeronautique.": "Electrical & Computer Engineering Degree — passionate about embedded systems and aerospace.",
    "Voir mes projets": "View My Projects",
    "Mon objectif": "My Goal",
    "Technique, leadership,<br>et ambition.": "Technical Skills, Leadership,<br>& Ambition.",
    "Je combine une solide rigueur technique avec une capacite naturelle a federer des equipes. Ma voie : l'excellence operationnelle dans le secteur aeronautique.": "I combine technical rigor with a natural ability to unite teams. My goal: operational excellence in the aerospace sector.",
    "Electronique &amp; Embarque": "Electronics & Embedded Systems",
    "De la conception de circuits NE555 a la programmation Arduino, je maitrise la chaine complete de l'electronique industrielle.": "From NE555 circuit design to Arduino programming, I master the full chain of industrial electronics.",
    "Developpement Software": "Software Development",
    "Programmation en C, MicroPython et Arduino. Creation de logiciels, jeux et systemes de controle embarques.": "C, MicroPython and Arduino programming. Creation of software, games and embedded control systems.",
    "Conception CAO": "CAD Design",
    "Modelisation 3D avec SolidWorks — coques de protection, supports cameras, fabrication orientee contraintes reelles.": "3D modeling with SolidWorks — protective shells, camera mounts, real-world constraint manufacturing.",
    "Vision Aeronautique": "Aeronautics Vision",
    "Mon ambition : rejoindre Air France en tant qu'ingenieur cadre, au coeur de la maintenance et de l'innovation de demain.": "My ambition: join Air France as an executive engineer, at the heart of maintenance and innovation.",
    "Formation &amp; Experience": "Education & Experience",
    "Un parcours construit<br>avec methode.": "A path built<br>methodically.",
    "Realisations": "Projects",
    "Projets phares.": "Key Projects.",
    "Voir tous les projets &rarr;": "View all projects →",
    "Competences": "Skills",
    "Hard skills &amp; Soft skills.": "Hard skills & Soft skills.",
    "Programmation C": "C Programming",
    "MicroPython / Arduino": "MicroPython / Arduino",
    "Electronique analogique": "Analog Electronics",
    "SolidWorks (CAO)": "SolidWorks (CAD)",
    "Systemes embarques": "Embedded Systems",
    "Electronique numerique": "Digital Electronics",
    "Au-dela du technique": "Beyond Tech",
    "Decouvrir mon univers &rarr;": "Discover my world →",
    "L'excellence aeronautique<br>comme horizon.": "Aeronautic excellence<br>on the horizon.",
    "Cadre Ingenieur<br>chez Air France": "Executive Engineer<br>at Air France",
    "Travaillons<br>ensemble.": "Let's work<br>together."
  }
};

// Initialisation et sauvegarde des textes d'origine
document.addEventListener("DOMContentLoaded", function() {
  var elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(function(el) {
    if (!el.getAttribute("data-original")) {
      el.setAttribute("data-original", el.innerHTML.trim());
    }
  });

  // Charger la langue enregistrée ou 'fr' par défaut
  var savedLang = localStorage.getItem("portfolio_lang") || "fr";
  setLanguage(savedLang);
});

// Fonction globale pour changer la langue avec animation de la barre bleue
function setLanguage(lang) {
  if (!translations[lang]) return;

  var progressBar = document.getElementById("i18nProgressBar");

  if (progressBar) {
    // 1. Activer la barre et la faire monter à 40%
    progressBar.style.width = "0%";
    progressBar.classList.add("active");
    
    setTimeout(function() {
      progressBar.style.width = "40%";
    }, 20);
  }

  // 2. Exécuter la traduction
  setTimeout(function() {
    localStorage.setItem("portfolio_lang", lang);
    document.documentElement.lang = lang;

    var elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(function(el) {
      var key = el.getAttribute("data-original") || el.innerHTML.trim();
      if (translations[lang] && translations[lang][key] !== undefined) {
        el.innerHTML = translations[lang][key];
      }
    });

    if (progressBar) {
      // 3. Compléter la barre à 100%
      progressBar.style.width = "100%";

      // 4. Masquer la barre en douceur
      setTimeout(function() {
        progressBar.classList.remove("active");
        setTimeout(function() {
          progressBar.style.width = "0%";
        }, 300);
      }, 350);
    }
  }, 120);
}
