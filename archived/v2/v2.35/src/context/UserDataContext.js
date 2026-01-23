import React, { createContext, useState, useContext, useEffect } from 'https://esm.sh/react@18.2.0';

const UserDataContext = createContext(null);

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};

export const UserDataProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        const savedBookmarks = localStorage.getItem('user_bookmarks');
        if (savedBookmarks) {
            try {
                setBookmarks(JSON.parse(savedBookmarks));
            } catch (e) {
                console.error("Error parsing bookmarks from localStorage", e);
                setBookmarks([]);
            }
        }
    }, []);

    const addBookmark = (itemId) => {
        setBookmarks(prevBookmarks => {
            if (prevBookmarks.includes(itemId)) {
                return prevBookmarks;
            }
            const newBookmarks = [...prevBookmarks, itemId];
            localStorage.setItem('user_bookmarks', JSON.stringify(newBookmarks));
            return newBookmarks;
        });
    };

    const removeBookmark = (itemId) => {
        setBookmarks(prevBookmarks => {
            const newBookmarks = prevBookmarks.filter(id => id !== itemId);
            localStorage.setItem('user_bookmarks', JSON.stringify(newBookmarks));
            return newBookmarks;
        });
    };

    const isBookmarked = (itemId) => bookmarks.includes(itemId);

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked
    };

    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    );
};
