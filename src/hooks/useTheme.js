import { useState, useEffect } from 'react';


export const useTheme = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'system' 
    );

    useEffect(() => {
        const root = window.document.documentElement;
        
        root.classList.remove('dark');
        root.removeAttribute('data-theme');
        
        let currentTheme; 
        
        if (theme === 'dark') {
            root.classList.add('dark');
            // DaisyUI data-theme 
            root.setAttribute('data-theme', 'dark'); 
            localStorage.setItem('theme', 'dark');
            currentTheme = 'dark';
            
        } else if (theme === 'light') {
            root.classList.remove('dark');
            // DaisyUI data-theme 
            root.setAttribute('data-theme', 'light'); 
            localStorage.setItem('theme', 'light');
            currentTheme = 'light';
            
        } else { // theme === 'system'
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (prefersDark) {
                root.classList.add('dark'); 
                root.setAttribute('data-theme', 'dark'); 
                currentTheme = 'dark';
            } else {
                 root.classList.remove('dark'); 
                 root.setAttribute('data-theme', 'light'); 
                 currentTheme = 'light';
            }
            localStorage.removeItem('theme'); 
        }
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemChange = (e) => {
            if (theme === 'system') {
                if (e.matches) {
                    root.classList.add('dark');
                    root.setAttribute('data-theme', 'dark');
                } else {
                    root.classList.remove('dark');
                    root.setAttribute('data-theme', 'light');
                }
            }
        };

        if (theme === 'system') {
            mediaQuery.addEventListener('change', handleSystemChange);
        }

        return () => {
            mediaQuery.removeEventListener('change', handleSystemChange);
        };
        
    }, [theme]); 

    return [theme, setTheme];
};