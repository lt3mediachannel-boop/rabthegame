export type Language = "en" | "it";

export const translations = {
  it: {
    app: {
      name: "RAB Skills Challenge",
      subtitle: "Challenge Arena",
    },

    nav: {
      home: "Home",
      leaderboard: "Classifica",
      admin: "Admin",
    },

    home: {
      badge: "Challenge Arena",
      title: "Completa le sfide e scala la classifica",
      description:
        "Inserisci il tuo ID badge o scansiona il QR personale per accedere alla dashboard.",
      participantId: "Il tuo ID partecipante",
      placeholder: "001",
      enter: "Entra",
      liveLeaderboard: "Classifica Live",
    },

    player: {
      title: "Dashboard partecipante",
      participantNotFound: "Partecipante non trovato",
      participantNotFoundText:
        "Controlla il codice o rivolgiti allo staff.",
      badgeId: "Badge ID",
      totalPoints: "Punti totali",
      stations: "Stazioni",
      quizzes: "Quiz",
      noQuizCompleted: "Nessun quiz completato",
      goToStation: "Vai alla stazione",
      score: "Punteggio",
      completed: "Completata",
      pending: "Da completare",
    },

    station: {
      title: "Stazione",
      insertBadge: "Inserisci il tuo Badge ID",
      getPoints: "Ottieni punti",
      loading: "Invio...",
      pointsAssigned: "Punti assegnati",
      alreadyClaimed:
        "Hai già ottenuto i punti di questa stazione",
    },

    quiz: {
      title: "Quiz",
      submit: "Invia quiz",
      completed: "Quiz completato",
      alreadyCompleted: "Hai già completato questo quiz",
      score: "Punteggio",
      missingCode: "Codice partecipante mancante",
      missingCodeText:
        "Apri il quiz dalla dashboard o tramite QR Code.",
    },

    leaderboard: {
      title: "Classifica Live",
      rank: "Pos.",
      participant: "Partecipante",
      points: "Punti",
      stations: "Stazioni",
      quizzes: "Quiz",
    },

    admin: {
      title: "Pannello Amministrazione",
      participants: "Partecipanti",
      stations: "Stazioni",
      quizzes: "Quiz",
      dashboard: "Dashboard",
      newParticipant: "Nuovo partecipante",
      newStation: "Nuova stazione",
      createQuiz: "Crea quiz",
      addQuestion: "Aggiungi domanda",
      qrCode: "QR Code",
      download: "Scarica",
    },

    errors: {
        generic: "Errore",
        missingData: "Dati mancanti",
        duplicated: "Elemento già esistente",
    },

    common: {
      save: "Salva",
      cancel: "Annulla",
      edit: "Modifica",
      delete: "Elimina",
      active: "Attivo",
      inactive: "Disattivo",
      loading: "Caricamento...",
      search: "Cerca",
      back: "Indietro",
    },
  },

  en: {
    app: {
      name: "RAB Skills Challenge",
      subtitle: "Challenge Arena",
    },

    nav: {
      home: "Home",
      leaderboard: "Leaderboard",
      admin: "Admin",
    },

    home: {
      badge: "Challenge Arena",
      title: "Complete challenges and climb the leaderboard",
      description:
        "Enter your badge ID or scan your personal QR code to access your dashboard.",
      participantId: "Your Participant ID",
      placeholder: "001",
      enter: "Enter",
      liveLeaderboard: "Live Leaderboard",
    },

    player: {
      title: "Participant Dashboard",
      participantNotFound: "Participant not found",
      participantNotFoundText:
        "Please check your code or contact event staff.",
      badgeId: "Badge ID",
      totalPoints: "Total Points",
      stations: "Stations",
      quizzes: "Quizzes",
      noQuizCompleted: "No completed quizzes",
      goToStation: "Go to station",
      score: "Score",
      completed: "Completed",
      pending: "Pending",
    },

    station: {
      title: "Station",
      insertBadge: "Enter your Badge ID",
      getPoints: "Get points",
      loading: "Submitting...",
      pointsAssigned: "Points assigned",
      alreadyClaimed:
        "You have already collected points from this station",
    },

    quiz: {
      title: "Quiz",
      submit: "Submit Quiz",
      completed: "Quiz completed",
      alreadyCompleted:
        "You have already completed this quiz",
      score: "Score",
      missingCode: "Missing participant code",
      missingCodeText:
        "Open the quiz from your dashboard or QR code.",
    },

    leaderboard: {
      title: "Live Leaderboard",
      rank: "Rank",
      participant: "Participant",
      points: "Points",
      stations: "Stations",
      quizzes: "Quizzes",
    },

    admin: {
      title: "Administration Panel",
      participants: "Participants",
      stations: "Stations",
      quizzes: "Quizzes",
      dashboard: "Dashboard",
      newParticipant: "New Participant",
      newStation: "New Station",
      createQuiz: "Create Quiz",
      addQuestion: "Add Question",
      qrCode: "QR Code",
      download: "Download",
    },

    errors: {
        generic: "Error",
        missingData: "Missing data",
        duplicated: "Element already exists",
    },

    common: {
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      active: "Active",
      inactive: "Inactive",
      loading: "Loading...",
      search: "Search",
      back: "Back",
    },
  },
} as const;

export function getTranslations(lang: Language = "en") {
  return translations[lang];
}