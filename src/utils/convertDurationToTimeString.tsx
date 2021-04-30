
export default function convertDurationToTimeString(duration: number) {

    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor(duration % 3600 / 60)
    const seconds = Math.floor(duration / 60)

    let timeString = [hours,minutes,seconds]
    .map(unit=>{
       return String(unit).padStart(2,'0')
    }).join(':')

    return timeString
}