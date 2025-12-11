import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme'; 

const ThemeToggle = () => {
    const [theme, setTheme] = useTheme();

    const toggleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };
    
    const isDarkModeActive = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const Icon = isDarkModeActive ? FaSun : FaMoon;
    const nextThemeName = isDarkModeActive ? 'Light' : 'Dark';


    return (
        <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            title={`Switch to ${nextThemeName} Mode`}
        >
            <Icon className="w-5 h-5 text-base-content hover:text-primary transition-colors duration-150" />
        </button>
    );
};

export default ThemeToggle;