export function formatTime(timeInSeconds: number): string {
  if (isNaN(timeInSeconds)) return "00:00";
  
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const formattedMinutes = minutes.toString().padStart(hours > 0 ? 2 : 1, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }
  
  return `${formattedMinutes}:${formattedSeconds}`;
}
