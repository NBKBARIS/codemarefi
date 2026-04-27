export const badWords = [
  "aq", "amk", "amına", "göt", "piç", "oç", "sik", "siktir", "yarrak", "taşşak",
  "ibne", "kahpe", "yavşak", "meme", "daşşak", "sg", "ananı", "bacını", "pic",
  "orosbu", "orospu", "gavat", "pipi", "vaji", "penis", "seks", "sex"
];

export function hasBadWords(text: string): boolean {
  const normalizedText = text.toLowerCase().replace(/[0-9]/g, '').replace(/\s+/g, '');
  return badWords.some(word => {
    // Kelimeyi direkt içeriyor mu veya boşluksuz halini içeriyor mu bak
    const regex = new RegExp(word, 'gi');
    return regex.test(text) || normalizedText.includes(word);
  });
}
