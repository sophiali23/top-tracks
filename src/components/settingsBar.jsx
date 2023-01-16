import "../App.css";
import styled from "styled-components";

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0px;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

const NumStepper = styled.input`
  min-width: 30px;
`;

const SettingsBar = ({
  showLimit,
  handleLimitChange,
  limit,
  timeRange,
  handleTimeRangeChange,
  handleResults,
  updateShowModal,
  isGetResultsButtonDisabled,
  isCreatePlaylistButtonDisabled,
}) => {
  return (
    <Bar>
      {showLimit && (
        <div className="limit">
          <label className="limit" for="limit">
            Limit:{" "}
          </label>
          <NumStepper
            type="number"
            id="limit"
            onChange={handleLimitChange}
            value={limit}
            min="0"
            max="50"
          />
        </div>
      )}
      <select
        id="time-range"
        value={timeRange}
        onChange={handleTimeRangeChange}
      >
        <option value="short_term">Last 4 weeks</option>
        <option value="medium_term">Last 6 months</option>
        <option value="long_term">All time</option>
      </select>
      <button disabled={isGetResultsButtonDisabled} onClick={handleResults}>
        Get Results
      </button>
      <button
        disabled={isCreatePlaylistButtonDisabled}
        onClick={() => updateShowModal(true)}
      >
        Create Playlist
      </button>
    </Bar>
  );
};

export default SettingsBar;
