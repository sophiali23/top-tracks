import '../App.css';

const VersionRadioGroup = ({isTaylorVersion, handleVersionChange}) => {
    return (
        <div className="radio-group">
            <div className="gr">
              <input checked={!isTaylorVersion} type="radio" id="original" name="version" value="original"
                onChange={() => handleVersionChange(false)}/>
              <label for="original">ORIGINAL VERSION</label><br></br>
            </div>
            <div className="gr">
              <input checked={isTaylorVersion} type="radio" id="taylor" name="version" value="taylor"
                onChange={() => handleVersionChange(true)}/>
              <label for="taylor">TAYLOR SWIFT VERSION</label><br></br>
            </div>
        </div>
    )
}

export default VersionRadioGroup;
