import React from 'react'
import './ThemeToggle.css'

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
    return (
        <div className={`theme-toggle-wrapper ${isDarkMode ? 'dark' : ''}`}>
            <label className="switch" htmlFor="theme-switch">
                <input
                    type="checkbox"
                    id="theme-switch"
                    checked={isDarkMode}
                    onChange={toggleTheme}
                />
                <div className="sunmoon">
                    <div className="darkside"></div>
                </div>
                <div className="border"></div>
                <div className="clouds">
                    <img src="/images/theme-toggle/cloud_1.svg" alt="" className="cloud cloud-1" />
                    <img src="/images/theme-toggle/cloud_2.svg" alt="" className="cloud cloud-2" />
                    <img src="/images/theme-toggle/cloud_3.svg" alt="" className="cloud cloud-3" />
                    <img src="/images/theme-toggle/cloud_4.svg" alt="" className="cloud cloud-4" />
                    <img src="/images/theme-toggle/stars.svg" alt="" className="stars" />
                </div>
            </label>
        </div>
    )
}

export default ThemeToggle
