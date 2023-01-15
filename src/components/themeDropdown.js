import '../App.css';

const ThemeDropdown = ({theme, setTheme}) => {
    const handleChange = (e) => {
        setTheme(e.target.value);
        localStorage.setItem('theme', e.target.value);
    }
    return (
        <div className="theme-dropdown">
            <label for="dropdown">THEME</label>
            <select id="dropdown" value={theme} onChange={handleChange}>
                <option value="midnights">Midnights</option>
                <option value="evermore">Evermore</option>
                <option value="lover">Lover</option>
                <option value="red">Red</option>
                <option value="speak-now">Speak Now</option>
            </select>
        </div>
    )
}

export default ThemeDropdown;