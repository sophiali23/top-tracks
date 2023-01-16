import "../App.css";
import styled from "styled-components";

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  font-weight: bold;
  gap: 4px;
`;

const RadioContainer = styled.div`
  display: flex;
  gap: 2px;
  justify-content: left;
  align-items: center;
`;

const RadioButton = styled.input`
  margin-top: 0px;
  margin-left: 0px;
`;

const VersionRadioGroup = ({ isTaylorVersion, handleVersionChange }) => {
  return (
    <RadioGroup>
      <RadioContainer>
        <RadioButton
          checked={!isTaylorVersion}
          type="radio"
          id="original"
          name="version"
          value="original"
          onChange={() => handleVersionChange(false)}
        />
        <label for="original">ORIGINAL VERSION</label>
      </RadioContainer>
      <RadioContainer>
        <RadioButton
          checked={isTaylorVersion}
          type="radio"
          id="taylor"
          name="version"
          value="taylor"
          onChange={() => handleVersionChange(true)}
        />
        <label for="taylor">TAYLOR SWIFT VERSION</label>
      </RadioContainer>
    </RadioGroup>
  );
};

export default VersionRadioGroup;
