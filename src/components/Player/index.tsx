
import Image from 'next/image';

import { useRef, useEffect } from 'react'
import { usePlayer } from '../../context/PlayerContext'

import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'
import styles from  './styles.module.scss'
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';

export default function Player(){
    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay, 
        setPlayState, 
        playNext, 
        playPrevious,
        toggleLoop,
        toggleShuffle,
        isShuffling,
        hasNext,
        hasPrevious,
        isLooping
    } = usePlayer()

    const episode = episodeList[currentEpisodeIndex];

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if(!audioRef.current){
            return;
        }

        if(isPlaying){
            audioRef.current.play();
        }else{
            audioRef.current.pause();
        }
    }, [isPlaying])
    
    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando Agora"/>
                <strong>Tocando agora {episode?.title}</strong>
            </header>

            {
                episode? (
                    <div className={styles.currentEpisode}>
                        <Image 
                            width={592} 
                            height={592} 
                            src={episode?.thumbnail} 
                            alt={episode?.title} 
                            objectFit="cover"
                        />
                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>
                    </div>
                ) : (
                    <div className={styles.emptyPlayer}>
                        <strong>Selecione um podcast para ouvir</strong>
                    </div>
                )
            }

            
            <footer className={!episode? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {
                            !episode? (
                                <div className={styles.emptySlider}/>
                            ) : (
                                <Slider
                                    trackStyle={{ backgroundColor: '#04D361'}}
                                    railStyle={{backgroundColor: '#9F75FF'}}
                                    handleStyle={{borderColor:'#04D361', borderWidth: 4}}
                                />
                            )
                        }
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>  
                {
                    episode && (
                        <audio 
                            ref={audioRef}
                            src={episode.url}
                            autoPlay
                            loop={isLooping}
                            onPlay={()=>{
                                setPlayState(true)
                            }}
                            onPause={()=>{
                                setPlayState(false)
                            }}
                        />
                    )
                }
                <div className={styles.buttons}>
                    <button 
                        onClick={toggleShuffle}
                        className={isShuffling? styles.isActive : ''}
                        type="button" 
                        disabled={!episode || episodeList.length == 1}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button onClick={playPrevious} type="button" disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button onClick={togglePlay} type="button" disabled={!episode} className={styles.playButton}>
                        {
                            isPlaying
                            ?   <img src="/pause.svg" alt="Pausar"/>
                            :   <img src="/play.svg" alt="Play"/>
                            
                        }
                    </button>
                    
                    <button onClick={playNext} type="button" disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Próximo"/>
                    </button>
                    <button 
                        onClick={toggleLoop}
                        className={isLooping?styles.isActive:''} 
                        type="button" 
                        disabled={!episode}
                    >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>    
    )
}