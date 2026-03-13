import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const getTimeBasedTheme = () => {
    const hour = new Date().getHours();
    // 6 AM to 6 PM is Day (Light), 6 PM to 6 AM is Night (Dark)
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
  };

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // If user has a preference, use it, otherwise use time-based
    return savedTheme || getTimeBasedTheme();
  });

  const [timeOfDay, setTimeOfDay] = useState(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 16) return 'afternoon';
    if (hour >= 16 && hour < 19) return 'evening';
    return 'night';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-time', timeOfDay);
  }, [theme, timeOfDay]);

  // Periodic check for time-based theme updates (every minute)
  useEffect(() => {
    const timer = setInterval(() => {
      const currentHour = new Date().getHours();
      
      // Update timeOfDay label
      let newTimeLabel = 'night';
      if (currentHour >= 5 && currentHour < 10) newTimeLabel = 'morning';
      else if (currentHour >= 10 && currentHour < 16) newTimeLabel = 'afternoon';
      else if (currentHour >= 16 && currentHour < 19) newTimeLabel = 'evening';
      
      if (newTimeLabel !== timeOfDay) setTimeOfDay(newTimeLabel);

      // Only auto-switch theme if the user hasn't set a manual preference in this session
      // (Simplified: if we don't have a 'manual_switch' flag)
      if (!localStorage.getItem('theme')) {
        const autoTheme = getTimeBasedTheme();
        if (autoTheme !== theme) {
          setTheme(autoTheme);
        }
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [theme, timeOfDay]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, timeOfDay }}>
      {children}
    </ThemeContext.Provider>
  );
};
