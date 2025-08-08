export const getPastelColors = (seed?: string) => {
  if (!seed) return { bg: "rgb(240, 240, 240)", text: "rgb(120, 120, 120)" };

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const baseR = 220 + (hash % 30);
  const baseG = 220 + ((hash >> 8) % 30);
  const baseB = 220 + ((hash >> 16) % 30);

  return {
    bg: `rgb(${baseR}, ${baseG}, ${baseB})`,
    text: `rgb(${Math.max(50, baseR - 100)}, ${Math.max(
      50,
      baseG - 100
    )}, ${Math.max(50, baseB - 100)})`,
  };
};
