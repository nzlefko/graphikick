import i18next from 'i18next';

const resources = {
  en: {
    translation: {
      errors: {
        unsupportedLanguage: 'Language {{language}} is not supported. Available languages: {{available}}',
        invalidSeason: 'Season {{season}} is not supported. Please try a season between 2021 and 2023.',
        unknownQueryType: 'Could not understand the query. Try asking about:\n- League standings\n- Top scorers\n- Match results\n- Team information\n- Available competitions',
        invalidQuery: 'Invalid query: Query must be a non-empty string'
      }
    }
  },
  he: {
    translation: {
      errors: {
        unsupportedLanguage: 'שפה {{language}} אינה נתמכת. שפות זמינות: {{available}}',
        invalidSeason: 'עונה {{season}} אינה נתמכת. אנא נסה עונה בין 2021 ל-2023.',
        unknownQueryType: 'לא הצלחתי להבין את השאילתה. נסה לשאול על:\n- טבלת הליגה\n- מלך השערים\n- תוצאות משחקים\n- מידע על קבוצה\n- ליגות זמינות',
        invalidQuery: 'שאילתה לא תקינה: השאילתה חייבת להיות מחרוזת לא ריקה'
      }
    }
  }
};

i18next.init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export const t = i18next.t.bind(i18next);
export const changeLanguage = i18next.changeLanguage.bind(i18next);