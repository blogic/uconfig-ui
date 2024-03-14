export const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

export const byteToString = (bytes: number, decimals = 2) => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  if (!bytes || bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const i = Math.floor(Math.log(bytes as number) / Math.log(k as number));
  if (i < 0) return '1 B';
  return `${parseFloat((bytes / k ** i).toFixed(dm).toLocaleString())} ${sizes[i]}`;
};
