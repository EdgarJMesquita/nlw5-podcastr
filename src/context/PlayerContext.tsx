import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play:(episode:Episode) => void;
    togglePlay:()=>void;
    setPlayState:(state:boolean)=>void;
    playList:(list:Episode[], index:number)=>void;
    playNext:()=>void;
    playPrevious:()=>void;
    toggleLoop:()=>void;
    toggleShuffle:()=>void;
    clearPlayerState:()=> void;
    hasNext:boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    isShuffling: boolean;

}

export const PlayerContext = createContext({} as PlayerContextData);


type PlayerContextProviderProps = {
    children: ReactNode
}

export function PlayerContextProvider({children}: PlayerContextProviderProps){

    const [episodeList,setEpisodeList] = useState([]);
    const [currentEpisodeIndex,setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping,setIsLooping] = useState(false);
    const [isShuffling,setIsShuffling] = useState(false);

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    function play(episode: Episode){
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
        
    }

    function playList(list:Episode[], index: number){
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }
    
    function togglePlay(){
        setIsPlaying(!isPlaying);
    }
    
    function toggleLoop(){
        setIsLooping(!isLooping);
    }

    function toggleShuffle(){
        setIsShuffling(!isShuffling);
        
    }

    function setPlayState(state:boolean){
        setIsPlaying(state);
    }

    function playNext(){

        if(isShuffling){
            const nextRandEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandEpisodeIndex);

        }else if(hasNext){
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }

    }

    function playPrevious(){
        
        if(hasPrevious){
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    function clearPlayerState(){
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }
  return (
      <PlayerContext.Provider 
        value={{ 
            episodeList,
            currentEpisodeIndex, 
            isPlaying, 
            play,
            playList, 
            togglePlay, 
            setPlayState,
            playNext,
            playPrevious,
            toggleLoop,
            toggleShuffle,
            clearPlayerState,
            hasNext,
            hasPrevious,
            isLooping,
            isShuffling
        }}>
          {children}
      </PlayerContext.Provider>
  )

}

export const usePlayer = ()=>{
    return useContext(PlayerContext);
}