import { themeReducer } from './theme.reducer';
import { setTheme, toggleTheme } from './theme.actions';

describe('themeReducer', () => {
  it('toggles and sets dark mode', () => {
    const initial = themeReducer(undefined, { type: '@@init' });
    expect(initial.isDarkMode).toBe(false);
    expect(themeReducer(initial, toggleTheme()).isDarkMode).toBe(true);
    expect(themeReducer(initial, setTheme({ isDarkMode: true })).isDarkMode).toBe(true);
  });
});
