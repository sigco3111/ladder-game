export interface LadderSettings {
  participants: string[];
  results: string[];
  rungCount: number;
  shuffleResults: boolean;
  shuffleParticipants: boolean;
}

const SETTINGS_KEY = 'ladderGameSettings';

export const saveSettings = (settings: LadderSettings): void => {
  try {
    const settingsJson = JSON.stringify(settings);
    localStorage.setItem(SETTINGS_KEY, settingsJson);
  } catch (error) {
    console.error("Could not save settings to localStorage", error);
  }
};

export const loadSettings = (): LadderSettings | null => {
  try {
    const settingsJson = localStorage.getItem(SETTINGS_KEY);
    if (settingsJson === null) {
      return null;
    }
    // Basic validation to ensure the loaded object has the expected keys
    const parsed = JSON.parse(settingsJson);
    if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'participants' in parsed &&
        'results' in parsed &&
        'rungCount' in parsed &&
        'shuffleResults' in parsed &&
        'shuffleParticipants' in parsed
    ) {
        return parsed as LadderSettings;
    }
    // Data is malformed, return null
    return null;
  } catch (error) {
    console.error("Could not load settings from localStorage", error);
    // If there's an error (e.g., corrupted data), clear it to prevent future errors
    localStorage.removeItem(SETTINGS_KEY);
    return null;
  }
};
