// Türkçe ve İngilizce kötü kelimeler + argo filtresi
export const badWords = [
  // Türkçe küfürler
  "aq", "amk", "amına", "amina", "göt", "got", "piç", "pic", "oç", "oc",
  "sik", "siktir", "yarrak", "taşşak", "tassak", "ibne", "kahpe", "yavşak",
  "yavşak", "meme", "daşşak", "sg", "ananı", "anani", "bacını", "bacini",
  "orosbu", "orospu", "gavat", "pipi", "vaji", "vajina", "penis", "seks", "sex",
  "götveren", "göt veren", "amcık", "amcik", "orosbuçocuğu", "bok", "boktan",
  "serefsiz", "şerefsiz", "alçak", "kaltak", "sürtük", "surtuk", "fahişe",
  "fahise", "pezevenk", "salak", "gerizekalı", "gerzek", "aptal", "mal",
  "dangalak", "haysiyetsiz", "namussuz", "iti", "köpek", "eşek", "esek",
  "domuz", "oğlak", "puşt", "pust", "götveren", "dölsüz", "dolsuz",
  // İngilizce
  "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "cock",
  "pussy", "whore", "slut", "nigger", "faggot", "retard", "porn", "nude",
  "naked", "xxx", "nsfw",
  // Spam / reklam kelimeleri (kullanıcı adı için)
  "admin", "yönetici", "moderator", "mod", "nbkbaris", "codemarefi",
];

// Kullanıcı adı için ek yasaklı kelimeler
const usernameBlacklist = [
  "admin", "yönetici", "moderator", "mod", "nbkbaris", "nbk_baris",
  "codemarefi", "system", "bot", "official", "resmi", "destek", "support",
  "root", "superuser", "staff", "team",
];

export function hasBadWords(text: string): boolean {
  if (!text) return false;
  
  // "codemarefi" ve "ekibi" kelimelerini izin ver
  const lowerText = text.toLowerCase();
  if (lowerText.includes('codemarefi') || lowerText.includes('code mare fi')) {
    // codemarefi içeriyorsa, onu geçici olarak temizle
    const cleaned = text.replace(/codemarefi/gi, '').replace(/code\s*mare\s*fi/gi, '');
    if (!cleaned.trim()) return false; // sadece codemarefi varsa izin ver
    text = cleaned; // codemarefi olmadan kontrol et
  }
  
  const normalized = text.toLowerCase()
    .replace(/[0@]/g, 'o')
    .replace(/[1!]/g, 'i')
    .replace(/[3]/g, 'e')
    .replace(/[4]/g, 'a')
    .replace(/\s+/g, ' '); // Boşlukları tek boşluğa çevir (tamamen kaldırma)

  return badWords.some(word => {
    const clean = word.toLowerCase();
    // Kelime sınırları ile kontrol et (tam kelime eşleşmesi)
    const wordBoundaryRegex = new RegExp(`\\b${clean}\\b`, 'gi');
    return wordBoundaryRegex.test(normalized);
  });
}

export function hasUsernameViolation(username: string): boolean {
  if (!username || username.trim().length < 2) return true;
  if (username.trim().length > 30) return true;

  // Sadece harf, rakam, boşluk, alt çizgi, nokta izin ver
  if (!/^[\w\s.\-ğüşıöçĞÜŞİÖÇ]+$/u.test(username)) return false; // özel karakter varsa geç

  const lower = username.toLowerCase().replace(/\s/g, '');

  // Kötü kelime kontrolü
  if (hasBadWords(username)) return true;

  // Yasaklı kullanıcı adları
  if (usernameBlacklist.some(w => lower.includes(w))) return true;

  return false;
}
