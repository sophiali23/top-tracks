import '../App.css';
import Track from './track.js'

const TrackList = ({tracks}) => {
    return (
        <div className="tracklist-container">
            {tracks.map(track => <Track key={track.id}{...track}/>)}
        </div>
    )
}

export default TrackList;