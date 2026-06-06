/**
 * PriceWise - Product Price Helper
 * Generates realistic and bounded base prices for various category keywords
 * to ensure realistic mockup pricing during presentations.
 */

export function estimateProductBasePrice(productName: string): number {
  const t = productName.toLowerCase();

  // Deterministic seed helper using string characters sum
  const charSum = productName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const getBoundedPrice = (min: number, max: number): number => {
    const range = max - min + 1;
    return min + (charSum % range);
  };

  // 1. Kırtasiye / Küçük Objeler (kalem, defter, silgi, kitap, kupa)
  if (
    t.includes("kalem") || t.includes("defter") || t.includes("silgi") || 
    t.includes("kitap") || t.includes("kupa") || t.includes("pencil") || 
    t.includes("notebook") || t.includes("mug") || t.includes("pen") || 
    t.includes("book") || t.includes("eraser")
  ) {
    return getBoundedPrice(20, 150);
  }

  // 2. Temel Gıda / Market (süt, su, ekmek, çikolata, bisküvi)
  if (
    t.includes("süt") || t.includes("sut") || t.includes("su") || 
    t.includes("ekmek") || t.includes("çikolata") || t.includes("cikolata") || 
    t.includes("bisküvi") || t.includes("biskuvi") || t.includes("milk") || 
    t.includes("water") || t.includes("bread") || t.includes("chocolate") || 
    t.includes("gıda") || t.includes("gida") || t.includes("yağ") || t.includes("yag") ||
    t.includes("un") || t.includes("tuz") || t.includes("seker") || t.includes("şeker")
  ) {
    return getBoundedPrice(15, 80);
  }

  // 3. Kişisel Bakım / Kozmetik (krem, parfüm, ruj, şampuan, güneş)
  if (
    t.includes("krem") || t.includes("parfüm") || t.includes("parfum") || 
    t.includes("ruj") || t.includes("şampuan") || t.includes("sampuan") || 
    t.includes("güneş") || t.includes("gunes") || t.includes("sunscreen") || 
    t.includes("cosmetic") || t.includes("lipstick") || t.includes("shampoo") || 
    t.includes("cream") || t.includes("cilt") || t.includes("soap") || t.includes("sabun")
  ) {
    return getBoundedPrice(150, 600);
  }

  // 4. Ev / Tekstil / Küçük Mutfak (termos, stanley, yastık, kahve makinesi)
  if (
    t.includes("termos") || t.includes("stanley") || t.includes("yastık") || 
    t.includes("yastik") || t.includes("kahve makinesi") || t.includes("kahve") || 
    t.includes("pillow") || t.includes("coffee") || t.includes("thermos") || 
    t.includes("flask") || t.includes("mutfak") || t.includes("bardak") || 
    t.includes("cup") || t.includes("kettle") || t.includes("çay") || t.includes("cay")
  ) {
    return getBoundedPrice(800, 2500);
  }

  // 5. Mobilya / Büyük Ev Eşyası (koltuk, masa, sandalye, yatak, dolap)
  if (
    t.includes("koltuk") || t.includes("masa") || t.includes("sandalye") || 
    t.includes("yatak") || t.includes("dolap") || t.includes("chair") || 
    t.includes("table") || t.includes("sofa") || t.includes("bed") || 
    t.includes("cabinet") || t.includes("furniture") || t.includes("mobilya") ||
    t.includes("gardrop") || t.includes("gardırop") || t.includes("couch")
  ) {
    return getBoundedPrice(3000, 12000);
  }

  // 6. Küçük Elektronik / Aksesuar (kulaklık, airpods, mouse, klavye, saat)
  if (
    t.includes("kulaklık") || t.includes("kulaklik") || t.includes("airpods") || 
    t.includes("mouse") || t.includes("klavye") || t.includes("saat") || 
    t.includes("keyboard") || t.includes("watch") || t.includes("headphones") || 
    t.includes("logitech") || t.includes("aksesuar") || t.includes("charger") || 
    t.includes("sarj") || t.includes("şarj")
  ) {
    return getBoundedPrice(1500, 7000);
  }

  // 7. Büyük Elektronik / Beyaz Eşya (televizyon, tv, buzdolabı, laptop, bilgisayar, iphone, telefon)
  if (
    t.includes("televizyon") || t.includes("tv") || t.includes("buzdolabı") || 
    t.includes("buzdolabi") || t.includes("laptop") || t.includes("bilgisayar") || 
    t.includes("iphone") || t.includes("telefon") || t.includes("phone") || 
    t.includes("fridge") || t.includes("computer") || t.includes("macbook") || 
    t.includes("screen") || t.includes("ekran") || t.includes("tablet") || 
    t.includes("ipad") || t.includes("samsung")
  ) {
    return getBoundedPrice(15000, 45000);
  }

  // 8. Diğer Her Şey (Varsayılan)
  return getBoundedPrice(300, 1500);
}
