import React,{useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import {faPlay,faAngleLeft,faAngleRight,faPause} from "@fortawesome/free-solid-svg-icons";
import Logo1 from "./1.png";
import Logo2 from "./2.png";
import Logo3 from "./3.png";

const Player = ({setSongs,setCurrentSong, songs,songInfo,setSongInfo,audioRef,currentSong,isPlaying,setIsPlaying}) => {
    useEffect(()=>{
        const newSongs = songs.map((song) => {
            if(song.id === currentSong.id){
                return {
                    ...song,
                    active:true,
                };
            }
            else
            {
                return {
                    ...song,
                    active:false,
                };
            }
        });
        setSongs(newSongs);
    },[currentSong])
    const playSongHandler = () => {
        if(isPlaying)
        {
            audioRef.current.pause();
            setIsPlaying(!isPlaying);
        }
        else
        {
            audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const getTime = (time) => {
        return(
            Math.floor(time/60) + ":" + ("0"+Math.floor(time%60)).slice(-2)
        );
    };
    const dragHandler = (e) => {
        audioRef.current.currentTime = e.target.value;
        setSongInfo({...songInfo,currentTime:e.target.value});
    };
    const skipTrackHandler = async (direction) => {
        let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
        if (direction === "skip-forward") {
            const next = songs[(currentIndex + 1) % songs.length];
            await setCurrentSong(next);
            activeLibraryHandler(next)
        }
        if (direction === "skip-back") {
            if ((currentIndex - 1) % songs.length === -1) {
                const prev = songs[songs.length - 1];
                await setCurrentSong(prev);
                activeLibraryHandler(prev)
                if (isPlaying) audioRef.current.play();
                return;
            }
            await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
            activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
        }
        if (isPlaying) audioRef.current.play();
    };
    // Add styles 
    const trackAnim = {
        transform: `translateX(${songInfo.animationPercentage}%)`
    };
    const activeLibraryHandler = (nextPrev) => {
        const newSongs = songs.map((song) => {
            if (song.id === nextPrev.id) {
                return {
                    ...song,
                    active: true,
                }
            } else {
                return {
                    ...song,
                    active: false,
                }
            }
        });
        setSongs(newSongs);
    }
    return(
        <div className="player">
            <div className="time-control">
                <p>{getTime(songInfo.currentTime)}</p>
                <div style={{background: `linear-gradient(to right,${currentSong.color[0]},${currentSong.color[1]})`}}className="track">
                <input 
                onChange={dragHandler} 
                min={0} 
                max={songInfo.duration || 0} 
                value={songInfo.currentTime} 
                type="range" />
                <div style={trackAnim} className="animate-track"></div>
                </div>
                <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
            </div>
            <div className="play-control">
                <FontAwesomeIcon onClick={() => skipTrackHandler("skip-back")} className = "skip-back" size="2x" icon={faAngleLeft}/>
                <FontAwesomeIcon onClick = {playSongHandler} className = "play" size="2x" icon={isPlaying? faPause:faPlay}/>
                <FontAwesomeIcon onClick={() => skipTrackHandler("skip-forward")} className = "skip-forward" size="2x" icon={faAngleRight}/>
            </div>
            <div class="container">
                <div class="line line-1">
                    <div class="wave wave1" style={{backgroundImage: `url(${Logo1})`}}></div>
                </div>
                
                <div class="line line-2">
                    <div class={"wave wave2 " + (isPlaying ? 'wavetwo' : '')} style={{backgroundImage: `url(${Logo2})`}}></div>
                </div>

                <div class="line line-3">
                    <div class={"wave wave3 " + (isPlaying ? 'wavethree' : '')} style={{backgroundImage: `url(${Logo3})`}}></div>
                </div>
            </div>    
        </div>
    )
}

export default Player;