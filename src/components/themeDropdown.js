import "../App.css";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  font-weight: bold;
  width: fit-content;
  align-self: start;
  gap: 4px;
`;

const Label = styled.label`
  width: fit-content;
`;

const ThemeDropdown = ({ theme, setTheme }) => {
  const handleChange = (e) => {
    setTheme(e.target.value);
    localStorage.setItem("theme", e.target.value);
  };
  return (
    <Container>
      <Label for="dropdown">THEME</Label>
      <select id="dropdown" value={theme} onChange={handleChange}>
        <option value="midnights">Midnights</option>
        <option value="evermore">Evermore</option>
        <option value="lover">Lover</option>
        <option value="red">Red</option>
        <option value="speak-now">Speak Now</option>
      </select>
    </Container>
  );
};

export default ThemeDropdown;
