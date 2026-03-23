# RNG System

> Hybrid Adaptive RNG for Virtual Miner: `PRD + Pity + Lucky Strike`

Dokumen ini menjelaskan sistem RNG utama untuk drop ore di Virtual Miner. Tujuannya bukan hanya menghasilkan distribusi statistik yang sehat, tetapi juga membangun ritme emosi pemain: stabil di tier rendah, menegangkan di tier menengah, dan benar-benar memorable di tier tertinggi.

## Tujuan Desain

Sistem ini dirancang untuk memenuhi lima sasaran:

- Mencegah drought ekstrem pada tier tinggi.
- Mencegah clustering absurd pada ultra-rare drop.
- Menjaga kejutan tetap hidup melalui jalur chaos yang terkontrol.
- Memungkinkan scaling yang jelas dari upgrade, biome, dan event.
- Menjaga rarity tinggi tetap terasa bernilai secara psikologis dan visual.

## Ringkasan Arsitektur

RNG menggunakan tiga layer yang berjalan bersama:

| Layer | Nama | Fungsi Utama |
| --- | --- | --- |
| 1 | `Pseudo-Random Distribution (PRD)` | Engine utama untuk mengurangi streak buruk dan membuat distribusi lebih stabil. |
| 2 | `Pity Timer` | Safety net absolut untuk mencegah drought ekstrem. |
| 3 | `Lucky Strike` | Jalur chaos yang langka untuk menciptakan momen kejutan. |

## Daftar Isi

- [Layer 1: Pseudo-Random Distribution](#layer-1-pseudo-random-distribution)
- [Layer 2: Pity Timer](#layer-2-pity-timer)
- [Layer 3: Lucky Strike](#layer-3-lucky-strike)
- [Modifier System](#modifier-system)
- [Ore Selection Within Rarity](#ore-selection-within-rarity)
- [Quantity per Drop](#quantity-per-drop)
- [Offline Ore Distribution](#offline-ore-distribution)
- [Visual Feedback per Rarity Tier](#visual-feedback-per-rarity-tier)

---

## Layer 1: Pseudo-Random Distribution

PRD menjadi engine utama karena dengan 15 tier rarity, pure random akan menghasilkan drought yang terasa tidak adil di tier atas. Secara statistik, pemain bisa melakukan ribuan hingga puluhan ribu mine tanpa melihat drop ultra-rare, lalu menyimpulkan bahwa game rusak. PRD mencegah pengalaman itu.

### Cara Kerja PRD

Untuk setiap rarity tier `i`, sistem menyimpan counter `n_i` yang menghitung berapa kali mine terjadi sejak terakhir mendapat tier `i` atau lebih tinggi.

- Jika mine gagal menghasilkan tier `i`, counter naik.
- Jika tier `i` atau tier yang lebih tinggi didapat, counter yang relevan di-reset.

Probabilitas efektif untuk tier `i` pada mine ke-`n_i`:

```text
P_effective(i, n_i) = min(1.0, n_i * C_i * M)
```

Keterangan:

- `C_i` = konstanta PRD untuk tier `i`
- `M` = combined modifier dari semua bonus aktif

### Menghitung Konstanta `C_i`

Konstanta `C_i` dipilih agar expected drop rate tetap sama dengan target probability `P_i`.

```text
P_i = sum(n=1..inf) [n * C_i * product(k=1..n-1)(1 - k * C_i)]
```

Karena tidak ada closed-form yang praktis, `C_i` dihitung secara iteratif.

### Tabel Konstanta PRD

| Tier | Target P | PRD Constant `C_i` | Avg Mine to Drop | Max Mine to Drop |
| --- | ---: | ---: | ---: | ---: |
| Plain | 0.3200 | 0.2090 | ~2.4 | ~5 |
| Curious | 0.2200 | 0.1275 | ~3.6 | ~8 |
| Odd | 0.1500 | 0.0786 | ~5.4 | ~13 |
| Uncanny | 0.1000 | 0.0480 | ~8.2 | ~21 |
| Whispered | 0.0650 | 0.0290 | ~12.8 | ~35 |
| Haunted | 0.0420 | 0.0175 | ~20.0 | ~57 |
| Hexed | 0.0270 | 0.0107 | ~31.4 | ~93 |
| Enchanted | 0.0170 | 0.0064 | ~50.3 | ~156 |
| Hallowed | 0.0105 | 0.0038 | ~81.8 | ~263 |
| Cursed | 0.0062 | 0.0021 | ~140 | ~476 |
| Veiled | 0.0035 | 0.0012 | ~248 | ~833 |
| Eldritch | 0.0018 | 0.00058 | ~486 | ~1,724 |
| Arcane | 0.00080 | 0.00025 | ~1,100 | ~4,000 |
| Mythic | 0.00030 | 0.000090 | ~2,963 | ~11,111 |
| Fabled | 0.00010 | 0.000029 | ~8,929 | ~34,483 |

`Max Mine to Drop` adalah titik saat `P_effective` mencapai `1.0`, yaitu kira-kira `1 / C_i`.

### Properti Kunci

- Mine pertama untuk `Fabled` hanya memiliki peluang `0.0029%`, sehingga dua Fabled berurutan nyaris mustahil.
- Setelah ribuan mine tanpa Fabled, peluang mulai naik signifikan.
- Pada sekitar `34,000` mine tanpa Fabled, drop menjadi guaranteed oleh PRD saja.
- Dalam praktik, pity timer akan aktif jauh sebelum titik ini.

### Evaluasi per Mine

```python
def roll_rarity(counters, modifiers):
    # Evaluasi dari tier tertinggi ke terendah.
    for tier in [
        "Fabled", "Mythic", "Arcane", "Eldritch", "Veiled",
        "Cursed", "Hallowed", "Enchanted", "Hexed", "Haunted",
        "Whispered", "Uncanny", "Odd", "Curious", "Plain"
    ]:
        n = counters[tier]
        C = PRD_CONSTANTS[tier]
        M = calculate_combined_modifier(modifiers)

        P = min(1.0, n * C * M)

        if random() < P:
            reset_counters_at_and_below(counters, tier)
            return tier
        else:
            counters[tier] += 1

    # Fallback; secara praktis tidak seharusnya tercapai.
    return "Plain"
```

### Counter Reset Logic

Saat pemain mendapat tier `i`, semua counter untuk tier `i` dan tier di bawahnya ikut di-reset. Alasannya: jika pemain mendapat `Eldritch`, maka kebutuhan emosional untuk `Cursed`, `Veiled`, dan tier rendah lain dianggap sudah "terpuaskan" oleh drop yang lebih tinggi.

```python
def reset_counters_at_and_below(counters, obtained_tier):
    tier_order = [
        "Plain", "Curious", "Odd", "Uncanny", "Whispered",
        "Haunted", "Hexed", "Enchanted", "Hallowed", "Cursed",
        "Veiled", "Eldritch", "Arcane", "Mythic", "Fabled"
    ]
    obtained_index = tier_order.index(obtained_tier)

    for i in range(0, obtained_index + 1):
        counters[tier_order[i]] = 0
```

---

## Layer 2: Pity Timer

Pity timer berjalan paralel dengan PRD sebagai safety net absolut. Secara teori PRD sudah cukup kuat untuk mencegah drought ekstrem, tetapi pity timer menjaga edge case seperti early game, modifier rendah, atau kombinasi nasib buruk yang sangat panjang.

### Formula Threshold

Setiap tier memiliki dua threshold:

```text
S_i = floor(2.0 / P_i)   # soft pity
H_i = floor(4.0 / P_i)   # hard pity
```

Artinya:

- `Soft pity` mulai aktif pada `2x` expected drop.
- `Hard pity` aktif pada `4x` expected drop.

### Tabel Pity Threshold

| Tier | Expected `1/P` | Soft Pity `2/P` | Hard Pity `4/P` |
| --- | ---: | ---: | ---: |
| Plain | 3 | 6 | 12 |
| Curious | 5 | 10 | 20 |
| Odd | 7 | 14 | 28 |
| Uncanny | 10 | 20 | 40 |
| Whispered | 15 | 30 | 60 |
| Haunted | 24 | 48 | 96 |
| Hexed | 37 | 74 | 148 |
| Enchanted | 59 | 118 | 236 |
| Hallowed | 95 | 190 | 380 |
| Cursed | 161 | 322 | 644 |
| Veiled | 286 | 572 | 1,144 |
| Eldritch | 556 | 1,112 | 2,224 |
| Arcane | 1,250 | 2,500 | 5,000 |
| Mythic | 3,333 | 6,666 | 13,332 |
| Fabled | 10,000 | 20,000 | 40,000 |

### Mekanik Soft Pity

Di antara `S_i` dan `H_i`, probabilitas mendapat tier tersebut mendapat bonus escalation.

```python
if counter[tier] >= S_i and counter[tier] < H_i:
    pity_boost = ((counter[tier] - S_i) / (H_i - S_i)) ** 0.8 * max_pity_mult
    P_with_pity = P_effective * (1 + pity_boost)
```

Eksponen `0.8` membuat kurva berbentuk concave: boost naik cepat di awal, lalu melandai. Ini membuat zona pity terasa seperti tekanan yang meningkat, bukan ramp linear yang mekanis.

### `max_pity_mult` per Zona

| Zona | Tier | Max Pity Multiplier |
| --- | --- | ---: |
| Familiar | 1-5 | 3 |
| Excitement | 6-9 | 5 |
| Adrenaline | 10-12 | 8 |
| Legendary | 13-15 | 15 |

### Mekanik Hard Pity

```python
if counter[tier] >= H_i:
    P_effective = 1.0
```

Untuk `Fabled`, hard pity terjadi di `40,000` mine. Angka ini terdengar besar, tetapi pada auto-mine rate `10/detik` di late game, itu setara sekitar `67 menit` mining nonstop. Dalam praktik nyata, kombinasi PRD dan soft pity akan mendorong drop jauh sebelum hard pity.

---

## Layer 3: Lucky Strike

Lucky Strike adalah bypass sistem yang memberikan momen plot twist. Saat Lucky Strike aktif, PRD diabaikan sementara dan drop dievaluasi menggunakan weighted random khusus dari tier minimum tertentu.

### Formula Trigger

```text
P(lucky_strike) = base_lucky_rate * event_modifier * cosmic_magnetism_bonus

base_lucky_rate = 0.0015
event_modifier = 1.0 (normal), 3.0 (Gold Rush), 5.0 (Meteor)
cosmic_magnetism_bonus = 1 + 0.10 * cosmic_magnetism_level
```

### Distribusi Lucky Strike

Lucky Strike selalu memberikan sesuatu yang setidaknya "bagus", sehingga minimum tier-nya adalah `Haunted`.

| Tier | Weight |
| --- | ---: |
| Haunted | 30 |
| Hexed | 25 |
| Enchanted | 18 |
| Hallowed | 12 |
| Cursed | 7 |
| Veiled | 4 |
| Eldritch | 2 |
| Arcane | 1.2 |
| Mythic | 0.5 |
| Fabled | 0.3 |

Total weight = `100`

### Pseudocode Lucky Strike

```python
def lucky_strike_roll():
    weights = {
        "Haunted": 30,
        "Hexed": 25,
        "Enchanted": 18,
        "Hallowed": 12,
        "Cursed": 7,
        "Veiled": 4,
        "Eldritch": 2,
        "Arcane": 1.2,
        "Mythic": 0.5,
        "Fabled": 0.3,
    }

    total = sum(weights.values())
    roll = random() * total
    cumulative = 0

    for tier, weight in weights.items():
        cumulative += weight
        if roll < cumulative:
            return tier
```

### Aturan Penting

- Lucky Strike tidak me-reset counter PRD.
- Lucky Strike adalah bonus murni, bukan pengganti progres PRD.
- Sistem ini menjaga elemen kejutan tanpa merusak kestabilan statistik jangka panjang.

### Visual Saat Lucky Strike

- Screen flash putih-emas yang sangat cepat.
- Teks `LUCKY STRIKE` muncul di tengah layar.
- Ore hasil Lucky Strike memakai animasi ledakan khusus.
- Semua partikel dan efek menjadi `3x` lebih intens dari drop normal pada rarity yang sama.

---

## Modifier System

Semua modifier digabungkan ke dalam satu nilai:

```text
M = scanner_mod * prestige_mod * biome_mod * depth_mod * event_mod * collection_mod * combo_mod
```

### Scanner Modifier

Scanner adalah upgrade paling langsung terhadap drop rate.

```text
scanner_mod = 1 + 0.08 * scanner_level + 0.005 * scanner_level^1.3
```

| Scanner Level | Modifier |
| ---: | ---: |
| 0 | 1.000 |
| 5 | 1.425 |
| 10 | 1.900 |
| 20 | 2.953 |
| 40 | 5.286 |

Scaling di level tinggi memang agresif. Scanner adalah alat utama pemain untuk mendorong rare drop rate.

### Prestige Modifier: Fortune Blessing

```text
prestige_mod = 1 + 0.12 * fortune_level
```

| Fortune Level | Modifier |
| ---: | ---: |
| 0 | 1.00 |
| 5 | 1.60 |
| 10 | 2.20 |

Modifier ini linear, tetapi tetap terasa kuat di setiap level.

### Biome Modifier

Biome modifier meningkat secara accelerating. Ini membuat endgame biome terasa jauh lebih rewarding dibanding area awal.

```text
biome_mod = biome_rarity_bonus[current_biome]
```

| Biome | Modifier |
| --- | ---: |
| Topsoil Quarry | 1.00 |
| Sediment Drift | 1.02 |
| Ironvein Tunnels | 1.05 |
| Underground River | 1.08 |
| Fungal Grotto | 1.12 |
| Magma Chamber | 1.18 |
| Crystal Cathedral | 1.25 |
| Sulfur Wastes | 1.30 |
| Fossil Abyss | 1.38 |
| Geode Hollow | 1.45 |
| Frozen Depths | 1.55 |
| Bioluminescent Deep | 1.65 |
| Tectonic Rift | 1.78 |
| Echo Cavern | 1.90 |
| Gilded Vault | 2.05 |
| Plasma Vein | 2.25 |
| Petrified World | 2.50 |
| Shadow Rift | 2.80 |
| Astral Mines | 3.20 |
| The Abyss Core | 4.00 |

### Depth Modifier

Depth modifier menggunakan logarithmic scaling: naik cepat di awal, lalu melandai di akhir. Ini mencegah depth menjadi sumber power yang terlalu dominan di endgame.

```text
depth_mod = 1 + ln(1 + depth / 1000) * 0.15
```

| Depth | Modifier |
| --- | ---: |
| 0m | 1.000 |
| 1,000m | 1.104 |
| 5,000m | 1.269 |
| 10,000m | 1.360 |
| 50,000m | 1.588 |
| 75,000m | 1.651 |

### Event Modifier

```text
event_mod = {
    normal: 1.0,
    rich_vein: 1.5,
    gold_rush: 3.0,
    earthquake: 2.0,
    meteor: 5.0,
}
```

Catatan desain:

- `Rich Vein` menambah volume ore, bukan membuat tier jauh lebih langka.
- `Gold Rush` membuat counter PRD terasa seperti "melompat" beberapa langkah per mine.
- `Meteor` adalah spike pendek yang sangat kuat.

### Collection Modifier

Setiap resource unik yang ditemukan memberi bonus kecil namun kumulatif.

```text
collection_mod = 1 + 0.01 * unique_resources_discovered
```

| Resources Discovered | Modifier |
| ---: | ---: |
| 0 | 1.00 |
| 25 | 1.25 |
| 50 | 1.50 |
| 58 | 1.58 |

Pemain yang sudah menemukan semua resource memiliki bonus `58%` terhadap rare drop chance.

### Combo Modifier

Combo hanya berlaku saat active clicking.

```text
combo_mod = 1 + min(combo_count, 100) * 0.003
```

| Combo Count | Modifier |
| ---: | ---: |
| 0 | 1.000 |
| 10 | 1.030 |
| 30 | 1.090 |
| 50 | 1.150 |
| 100 | 1.300 |

Combo memberi bonus kecil tetapi konsisten. Pemain yang masuk ke flow state mendapat keuntungan yang terasa, tanpa membuat sistem condong penuh ke active clicking.

---

## Ore Selection Within Rarity

Setelah rarity tier terpilih, sistem masih harus memilih ore spesifik dari pool yang valid.

### Step 1: Determine Eligible Pool

```ts
const eligible = all_ores.filter((ore) =>
  ore.rarity === selected_tier &&
  unlocked_biomes.includes(ore.source_biome)
);
```

### Step 2: Apply Biome Proximity Weight

Ore dari biome yang lebih dekat ke current depth mendapat bobot lebih tinggi.

```python
for ore in eligible:
    biome_center = (biome.depth_start + biome.depth_end) / 2
    distance = abs(current_depth - biome_center)
    proximity_weight = 1 / (1 + (distance / 2000) ** 1.5)
```

Contoh:

- Jika `current_depth = 10,000m` dan biome center ore = `1,000m`, maka bobotnya sangat kecil.
- Jika biome center tepat di `10,000m`, maka bobotnya `1.0` dan menjadi kandidat paling kuat.

### Step 3: Weighted Random Selection

```python
total_weight = sum(ore.proximity_weight for ore in eligible)
roll = random() * total_weight

cumulative = 0
for ore in eligible:
    cumulative += ore.proximity_weight
    if roll < cumulative:
        return ore
```

---

## Quantity per Drop

Satu mine tidak harus selalu menghasilkan tepat satu ore. Quantity ditentukan oleh kombinasi power, event, combo, dan rarity penalty.

### Formula Quantity

```python
base_qty = 1
click_bonus = floor(click_power / 10)

event_qty_mult = {
    "normal": 1,
    "rich_vein": 3,
    "gold_rush": 1,
    "earthquake": 2,
}

combo_qty = 1 + floor(combo_count / 20)

rarity_qty_mult = {
    "Plain": 1.0,
    "Curious": 1.0,
    "Odd": 0.9,
    "Uncanny": 0.8,
    "Whispered": 0.7,
    "Haunted": 0.5,
    "Hexed": 0.4,
    "Enchanted": 0.3,
    "Hallowed": 0.25,
    "Cursed": 0.2,
    "Veiled": 0.15,
    "Eldritch": 0.1,
    "Arcane": 0.08,
    "Mythic": 0.05,
    "Fabled": 0.03,
}

final_qty = max(
    1,
    floor((base_qty + click_bonus) * event_qty_mult * combo_qty * rarity_qty_mult)
)
```

### Tabel Rarity Quantity Multiplier

| Rarity | Multiplier |
| --- | ---: |
| Plain | 1.00 |
| Curious | 1.00 |
| Odd | 0.90 |
| Uncanny | 0.80 |
| Whispered | 0.70 |
| Haunted | 0.50 |
| Hexed | 0.40 |
| Enchanted | 0.30 |
| Hallowed | 0.25 |
| Cursed | 0.20 |
| Veiled | 0.15 |
| Eldritch | 0.10 |
| Arcane | 0.08 |
| Mythic | 0.05 |
| Fabled | 0.03 |

### Contoh Perhitungan

Contoh 1: pemain dengan `click_power = 50`, `combo = 40`, sedang dalam `Rich Vein`, lalu mendapat `Fabled`.

```text
base + click_bonus = 1 + 5 = 6
after event         = 6 * 3 = 18
after combo         = 18 * 3 = 54
after rarity        = 54 * 0.03 = 1.62
final               = max(1, floor(1.62)) = 1
```

Hasil: `Fabled` hampir selalu tetap `1` per drop.

Contoh 2: konfigurasi yang sama untuk `Plain`.

```text
6 * 3 * 3 * 1.0 = 54 ore
```

Hasil ini memastikan tier rendah terasa seperti hujan resource, sedangkan tier tinggi terasa seperti harta karun.

---

## Offline Ore Distribution

Saat simulasi offline berjalan, sistem tidak melakukan ribuan roll PRD individual karena terlalu berat secara komputasi. Sebagai gantinya, sistem menggunakan expected distribution yang telah disesuaikan oleh modifier.

### Pseudocode

```python
def calculate_offline_ore_distribution(total_ore, modifiers):
    distribution = {}
    M = calculate_combined_modifier(modifiers)

    for tier in all_tiers:
        adjusted_P = min(0.99, base_P[tier] * M)

        # Tier atas tidak boleh melampaui tier di bawahnya secara absurd.
        adjusted_P = min(adjusted_P, adjusted_P_of_tier_below * 0.9)

        expected_count = floor(total_ore * adjusted_P)

        # Tambahkan sedikit variance agar hasil tidak terasa terlalu steril.
        variance = expected_count * 0.10
        actual_count = max(
            0,
            floor(expected_count + (random() * 2 - 1) * variance)
        )

        distribution[tier] = actual_count

    diff = total_ore - sum(distribution.values())
    distribution["Plain"] += diff

    return distribution
```

### Penalti Ultra-Rare Offline

Untuk menjaga discovery tier tertinggi tetap terasa lebih hidup saat online, gunakan penalti tambahan berikut:

| Tier | Offline Penalty |
| --- | ---: |
| Arcane | 0.80 |
| Mythic | 0.60 |
| Fabled | 0.30 |

```text
adjusted_P_offline[tier] = adjusted_P[tier] * ultra_rare_offline_penalty[tier]
```

Ini adalah keputusan desain yang disengaja. Menemukan `Fabled` sebaiknya menjadi momen yang dialami langsung, bukan sekadar angka di Welcome Back Report. Namun, karena penalty-nya `0.30`, kejutan itu tetap mungkin terjadi.

---

## Visual Feedback per Rarity Tier

Reward loop modern menuntut feedback yang proporsional. Setiap tier memiliki recipe visual dan audio sendiri. Skala efek harus naik terus, dari hampir tak terlihat pada `Plain` hingga full celebration pada `Fabled`.

### Tier 1-5: Familiar Zone

#### Plain (Tier 1)

- Floating text: kecil, abu, hilang cepat dalam `0.5 detik`
- Partikel: `0`
- Screen effect: tidak ada
- Sound: `tick` ringan
- Intent: pemain hampir tidak sadar

#### Curious (Tier 2)

- Floating text: kecil, hijau pucat, `0.6 detik`
- Partikel: `1-2` titik
- Screen effect: tidak ada
- Sound: `tick` sedikit lebih nyaring

#### Odd (Tier 3)

- Floating text: sedang, biru muda, `0.7 detik`
- Partikel: `2-3` titik biru
- Screen effect: tidak ada
- Sound: `clink` ringan

#### Uncanny (Tier 4)

- Floating text: sedang, ungu muda, `0.8 detik`
- Partikel: `3-4` titik
- Screen effect: micro-glow sesaat
- Sound: `clink` yang lebih resonan

#### Whispered (Tier 5)

- Floating text: sedang-besar, teal bercahaya, `0.9 detik`
- Partikel: `5-6` titik dengan trail
- Screen effect: subtle vignette pulse
- Sound: chord minor pendek + whisper SFX

### Tier 6-9: Excitement Zone

#### Haunted (Tier 6)

- Floating text: besar, indigo bercahaya, `1.0 detik`, slight wobble
- Partikel: `8-10` dengan glow
- Screen effect: brief shadow pulse
- Sound: chord + ethereal hum
- Notification: small toast `Haunted ore found`

#### Hexed (Tier 7)

- Floating text: besar, magenta, glow effect, `1.1 detik`
- Partikel: `12-15` burst
- Screen effect: hexagonal pattern flash
- Sound: ascending chime
- Notification: toast dengan border magenta

#### Enchanted (Tier 8)

- Floating text: besar, emas, sparkle trail, `1.2 detik`
- Partikel: `15-20` golden burst
- Screen effect: golden vignette + mini shake
- Sound: magical chime sequence
- Notification: prominent toast, gold border, glow

#### Hallowed (Tier 9)

- Floating text: sangat besar, putih-emas, holy glow, `1.5 detik`
- Partikel: `20-25` radial burst putih
- Screen effect: brief full-screen white flash + medium shake
- Sound: choir hit + bell
- Notification: banner notifikasi selama `3 detik`

### Tier 10-12: Adrenaline Zone

#### Cursed (Tier 10)

- Floating text: besar, merah gelap-hitam, glitch effect, `1.5 detik`
- Partikel: `20-30` merah gelap dan hitam, gerak erratic
- Screen effect: screen crack visual + heavy shake + red vignette
- Sound: deep bass drop + distortion
- Notification: full-width banner selama `4 detik`
- Special: brief screen invert `50ms`

#### Veiled (Tier 11)

- Floating text: besar, semi-transparent, phase in/out, `2 detik`
- Partikel: `25-30` smoke-like dan translucent
- Screen effect: fog roll + shake
- Sound: reverse reverb + whisper chorus
- Notification: banner yang muncul dari kabut

#### Eldritch (Tier 12)

- Floating text: sangat besar, warna berubah-ubah, tentacle-like glow, `2 detik`
- Partikel: `30+` warping dan color-shifting
- Screen effect: reality distortion + heavy shake + color shift
- Sound: otherworldly drone + crystalline shatter
- Notification: full banner + screen border glow selama `5 detik`
- Special: seluruh UI briefly distort

### Tier 13-15: Legendary Zone

#### Arcane (Tier 13)

- Floating text: massive, runic symbols orbit, `2.5 detik`
- Partikel: `40+` dengan runic patterns
- Screen effect: full flash + sustained glow + `1 detik` shake
- Sound: epic orchestral hit + magical surge
- Notification: cinematic banner selama `6 detik` dengan particle shower
- Special: background temporarily transforms

#### Mythic (Tier 14)

- Floating text: massive, multi-layered glow, aurora trail, `3 detik`
- Partikel: `60+` spectacular burst, multi-colored
- Screen effect: full-screen aurora + heavy sustained shake + white flash
- Sound: full orchestral crescendo + choir + crystal resonance
- Notification: takeover banner yang menutup sekitar `30%` layar selama `8 detik`
- Special: semua animasi berjalan berhenti sejenak untuk dramatic time stop

#### Fabled (Tier 15)

- Floating text: layar penuh, teks berputar masuk ke tengah, `4 detik`
- Partikel: `100+`, full-screen celebration, fireworks, stars
- Screen effect: flash + shake + color cycle + distortion + aurora
- Sound: complete fanfare, orchestral + choir + bells + impact
- Notification: full-screen takeover selama `10 detik`
- Special: time stop penuh `1 detik`, lalu slow-motion resume
- Special: konfeti jatuh dari atas layar selama `5 detik`
- Special: ore icon melayang ke museum collection dengan trail bintang

### Prinsip Eskalasi

Eskalasi intensitas ini sengaja sangat curam:

- `Plain` hampir invisible.
- `Haunted` mulai memicu reaksi sadar.
- `Cursed` harus terasa seperti lompatan intensitas yang mengejutkan.
- `Fabled` harus menghentikan seluruh game untuk merayakan momen itu.

Itulah inti dari sistem ini: rarity bukan hanya angka probabilitas. Rarity adalah pengalaman.
