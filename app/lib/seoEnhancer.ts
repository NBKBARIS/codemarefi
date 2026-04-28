/**
 * SEO Otomatik Düzeltici
 * Kullanıcı gönderilerini SEO dostu hale getirir.
 * Yapay zeka gerektirmez — kural tabanlı çalışır.
 */

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export interface SeoResult {
  content: string;       // düzenlenmiş HTML içerik
  metaDescription: string; // 155 karakter meta description
  seoScore: number;      // 0-100 puan
  improvements: string[]; // yapılan iyileştirmeler listesi
}

export function enhanceSeo(
  title: string,
  content: string,
  categories: string[],
): SeoResult {
  const improvements: string[] = [];
  let html = content;
  const plain = stripHtml(content);
  const wordCount = plain.split(/\s+/).filter(Boolean).length;

  // ── 1. H1 zaten başlık olarak var, H2/H3 yoksa ekle ──────────
  const hasH2 = /<h2/i.test(html);
  const hasH3 = /<h3/i.test(html);

  if (!hasH2 && !hasH3) {
    // Paragrafları bul, 3. paragraftan sonra H2 ekle
    const paragraphs = html.split(/<\/p>/i);
    if (paragraphs.length >= 3) {
      const keyword = categories[0]?.replace(/-/g, ' ') || 'Konu';
      paragraphs[2] = paragraphs[2] +
        `</p>\n<h2 style="color:#fff;margin-top:28px;margin-bottom:12px;">${title} Hakkında Detaylar</h2>`;
      html = paragraphs.join('');
      improvements.push('H2 başlık eklendi');
    }
  }

  // ── 2. İlk paragrafta anahtar kelime yoksa ekle ───────────────
  const titleWords = title.toLowerCase().split(/\s+/).slice(0, 3);
  const firstPara = html.match(/<p[^>]*>(.*?)<\/p>/is)?.[1] || '';
  const firstParaPlain = stripHtml(firstPara).toLowerCase();
  const hasKeyword = titleWords.some(w => w.length > 3 && firstParaPlain.includes(w));

  if (!hasKeyword && firstPara) {
    // İlk paragrafın başına anahtar kelime içeren cümle ekle
    const keyword = categories[0]?.replace(/-/g, ' ') || title.split(' ').slice(0, 2).join(' ');
    html = html.replace(
      /<p([^>]*)>/i,
      `<p$1><strong>${title}</strong> konusunda hazırladığımız bu rehberde `
    );
    improvements.push('İlk paragrafta anahtar kelime vurgulandı');
  }

  // ── 3. İçerik çok kısaysa uyarı notu ekle ────────────────────
  if (wordCount < 150) {
    html += `\n<div style="background:rgba(230,0,0,0.08);border-left:4px solid #e60000;padding:15px;margin-top:20px;border-radius:0 4px 4px 0;">
      <strong style="color:#e60000;">CodeMareFi Notu:</strong>
      <p style="color:#ccc;margin:8px 0 0;">Bu konu hakkında daha fazla bilgi almak için yorum bölümünden sorularınızı iletebilirsiniz. Topluluğumuz size yardımcı olmaktan memnuniyet duyar.</p>
    </div>`;
    improvements.push('İçerik zenginleştirme notu eklendi');
  }

  // ── 4. Görsel alt text yoksa ekle ────────────────────────────
  const imgWithoutAlt = /<img(?![^>]*alt=)[^>]*>/gi;
  if (imgWithoutAlt.test(html)) {
    html = html.replace(/<img(?![^>]*alt=)([^>]*)>/gi, `<img$1 alt="${title}">`);
    improvements.push('Görsel alt metinleri eklendi');
  }

  // ── 5. İç linkler — kategoriye link ekle ─────────────────────
  if (categories.length > 0) {
    const catSlug = encodeURIComponent(categories[0]);
    const catName = categories[0].replace(/-/g, ' ');
    if (!html.includes('/kategori/')) {
      html += `\n<p style="margin-top:20px;color:#888;font-size:13px;">
        <i class="fa-solid fa-tag" style="color:#e60000;margin-right:6px;"></i>
        Bu yazı <a href="/kategori/${catSlug}" style="color:#e60000;">${catName}</a> kategorisinde yayınlanmıştır.
      </p>`;
      improvements.push('Kategori iç linki eklendi');
    }
  }

  // ── 6. Meta description oluştur ───────────────────────────────
  const cleanPlain = stripHtml(html);
  const metaDescription = cleanPlain.slice(0, 155) + (cleanPlain.length > 155 ? '...' : '');

  // ── 7. SEO Skoru hesapla ──────────────────────────────────────
  let score = 40; // base
  if (title.length >= 30 && title.length <= 60) score += 15;
  if (wordCount >= 300) score += 15;
  else if (wordCount >= 150) score += 8;
  if (/<h2/i.test(html)) score += 10;
  if (/<h3/i.test(html)) score += 5;
  if (categories.length > 0) score += 10;
  if (/<img[^>]+alt=/i.test(html)) score += 5;
  score = Math.min(100, score);

  return { content: html, metaDescription, seoScore: score, improvements };
}
