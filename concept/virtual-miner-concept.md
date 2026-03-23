# Virtual Miner

> Idle mining game berbasis web yang dirancang dengan prinsip: "satu klik lagi sebelum tidur."

Virtual Miner adalah idle mining game tentang transformasi dari penambang miskin dengan linggis karatan menjadi penguasa kerajaan tambang bawah tanah yang terus bekerja bahkan saat pemain offline.

## Ringkasan Konsep

Virtual Miner dibangun di atas empat janji desain utama:

- Menghargai waktu pemain, bukan menghukum ketidakhadiran mereka.
- Menjaga progres offline tetap terasa besar, tetapi tidak menghapus momen bermain aktif.
- Membuat otomasi terasa hidup, saling terhubung, dan penuh bottleneck yang menarik.
- Menjaga momen penemuan biome, rarity tinggi, dan event besar tetap terasa spesial.

## Daftar Isi

- [Rarity System](#rarity-system)
- [AFK System](#afk-system)
- [Offline Ore Production](#offline-ore-production)
- [Offline Depth Progress](#offline-depth-progress)
- [Offline Event Generation](#offline-event-generation)
- [Degradasi Efisiensi Offline Panjang](#degradasi-efisiensi-offline-panjang)
- [Welcome Back Report](#welcome-back-report)
- [Sistem RNG Ore Drop](#sistem-rng-ore-drop)

---

## Rarity System

Virtual Miner menggunakan 15 tier rarity. Tier ini bukan sekadar warna, tetapi bagian dari ritme emosi pemain.

| Tier | Nama | Zona |
| --- | --- | --- |
| 1 | Plain | Familiar |
| 2 | Curious | Familiar |
| 3 | Odd | Familiar |
| 4 | Uncanny | Familiar |
| 5 | Whispered | Familiar |
| 6 | Haunted | Excitement |
| 7 | Hexed | Excitement |
| 8 | Enchanted | Excitement |
| 9 | Hallowed | Excitement |
| 10 | Cursed | Adrenaline |
| 11 | Veiled | Adrenaline |
| 12 | Eldritch | Adrenaline |
| 13 | Arcane | Legendary |
| 14 | Mythic | Legendary |
| 15 | Fabled | Legendary |

---

## AFK System

Sebagian besar idle game menerapkan efisiensi offline rendah, biasanya hanya 30% sampai 60%, untuk mendorong pemain membuka game lebih sering. Virtual Miner mengambil posisi yang berbeda: game ini menghargai waktu pemain. Karena itu, sistem AFK utamanya menargetkan efisiensi offline sebesar 95%.

AFK system menggunakan simulasi multi-subsistem. Setiap komponen memiliki efisiensi, bottleneck, dan interaksi tersendiri.

### Efisiensi Offline per Subsistem

| Subsistem | Online | Offline | Alasan Naratif |
| --- | ---: | ---: | --- |
| Ore Production (Auto-Mine) | 100% | 95% | Mesin tetap berjalan, hanya sedikit kurang efisien tanpa operator. |
| Depth Progress | 100% | 70% | Pekerja menggali lebih hati-hati tanpa supervisi langsung. |
| Auto-Sell (Conveyor) | 100% | 95% | Conveyor bersifat mekanis dan hampir tidak butuh pengawasan. |
| Event Generation | 100% | 40% | Sebagian besar event membutuhkan respons manusia. |
| Contract Progress | 100% | 95% | Kontrak tetap terpenuhi oleh ore yang terus diproduksi. |
| Storage | 100% | 100% | Kapasitas adalah konstanta, bukan laju. |

### Prinsip Desain

- Ore production dan auto-sell tetap tinggi agar progres offline terasa nyata.
- Depth progress sengaja lebih rendah agar biome baru tidak terlewati begitu saja.
- Event generation paling rendah karena nilai utamanya berasal dari interaksi langsung.

---

## Offline Ore Production

Saat pemain menutup game, sistem menyimpan snapshot seluruh variabel yang memengaruhi laju produksi ore.

### Snapshot Data

```ts
const snapshot = {
  drill_level,
  worker_count,
  mining_bot_assignments: [],
  drone_fleet_assignments: [],
  prestige_multipliers: {},
  active_biome,
  current_depth,
  scanner_level,
  storage_capacity,
  storage_current_fill,
  conveyor_level,
  conveyor_speed,
  refinery_queue: [],
  timestamp,
};
```

Saat pemain kembali:

```text
elapsed_seconds = now - snapshot.timestamp
```

### Formula Dasar

Langkah pertama adalah menghitung base production rate online per detik:

```text
R_online = R_drill + R_workers + R_bots + R_drones

R_drill   = drill_base_output(drill_level)
R_workers = sum(worker_output(i)) * worker_synergy(total_workers)
R_bots    = sum(bot_output(i)) * biome_efficiency(assigned_biome)
R_drones  = sum(drone_output(i)) * biome_efficiency(assigned_biome)
```

Langkah kedua adalah menerapkan baseline offline efficiency:

```text
R_offline = R_online * 0.95
```

### Dream Mining

Dream Mining adalah prestige upgrade untuk memperkuat progres offline tanpa pernah melewati performa online. Untuk menjaga perilaku sistem tetap stabil, gunakan formula linear final berikut:

```text
offline_efficiency = 0.95 + (0.05 * dream_mining_level / max_dream_mining_level)
R_offline_final    = R_online * offline_efficiency
```

Dengan `max_dream_mining_level = 10`, hasilnya menjadi:

| Level | Offline Efficiency |
| ---: | ---: |
| 0 | 95.0% |
| 3 | 96.5% |
| 5 | 97.5% |
| 8 | 99.0% |
| 10 | 100.0% |

Langkah ketiga adalah menghitung total ore yang diproduksi sebelum bottleneck diterapkan:

```text
total_ore_produced = R_offline_final * elapsed_seconds
```

Nilai ini tetap dibatasi oleh storage dan conveyor.

### Storage Bottleneck and Conveyor Interaction

#### Skenario A: Conveyor aktif dan cukup cepat

Jika conveyor lebih cepat atau sama cepat dengan production rate, semua ore langsung terjual saat offline.

```text
conveyor_speed_offline = conveyor_speed_online * 0.95

if conveyor_speed_offline >= R_offline_final:
    ore_retained = 0
    gold_earned = total_ore_produced * average_ore_value * refinery_multiplier
```

`average_ore_value` dihitung dari distribusi ore berdasarkan biome dan depth pada saat snapshot.

#### Skenario B: Conveyor tidak aktif atau terlalu lambat

Jika conveyor lebih lambat dari production rate, ore menumpuk di storage. Begitu storage penuh, produksi tidak lagi berjalan bebas.

```text
if conveyor_speed_offline < R_offline_final:
    net_accumulation_rate = R_offline_final - conveyor_speed_offline
    storage_available     = storage_capacity - storage_current_fill
    time_to_full          = storage_available / net_accumulation_rate

    if time_to_full >= elapsed_seconds:
        ore_retained = net_accumulation_rate * elapsed_seconds
        gold_earned  = conveyor_speed_offline * elapsed_seconds * avg_ore_value * refinery_mult
    else:
        ore_retained            = storage_available
        gold_earned_before_full = conveyor_speed_offline * time_to_full * avg_ore_value * refinery_mult
        gold_earned_after_full  = conveyor_speed_offline * (elapsed_seconds - time_to_full) * avg_ore_value * refinery_mult
        gold_earned             = gold_earned_before_full + gold_earned_after_full
        total_ore_produced      = R_offline_final * time_to_full + conveyor_speed_offline * (elapsed_seconds - time_to_full)
```

### Reference Pseudocode

```python
def calculate_offline_ore(elapsed, R_prod, R_conv, storage_cap, storage_fill):
    storage_free = storage_cap - storage_fill

    if R_conv >= R_prod:
        # Conveyor lebih cepat dari production: storage tidak pernah penuh.
        return {
            "ore_in_storage": 0,
            "ore_sold": R_prod * elapsed,
            "gold": R_prod * elapsed * avg_value * refinery_mult,
            "production_uptime": 1.0,
        }

    if R_conv == 0:
        # Tidak ada conveyor.
        time_to_full = storage_free / R_prod
        actual_production_time = min(elapsed, time_to_full)
        return {
            "ore_in_storage": min(storage_free, R_prod * elapsed),
            "ore_sold": 0,
            "gold": 0,
            "production_uptime": actual_production_time / elapsed,
        }

    # Conveyor ada, tetapi lebih lambat dari production.
    net_fill_rate = R_prod - R_conv
    time_to_full = storage_free / net_fill_rate

    if time_to_full >= elapsed:
        # Storage tidak sempat penuh.
        return {
            "ore_in_storage": storage_fill + net_fill_rate * elapsed,
            "ore_sold": R_conv * elapsed,
            "gold": R_conv * elapsed * avg_value * refinery_mult,
            "production_uptime": 1.0,
        }

    # Fase 1: storage terisi sampai penuh.
    ore_sold_phase1 = R_conv * time_to_full

    # Fase 2: production dibatasi conveyor speed.
    remaining_time = elapsed - time_to_full
    ore_sold_phase2 = R_conv * remaining_time

    total_ore_sold = ore_sold_phase1 + ore_sold_phase2

    return {
        "ore_in_storage": storage_cap,
        "ore_sold": total_ore_sold,
        "gold": total_ore_sold * avg_value * refinery_mult,
        "production_uptime": (time_to_full + remaining_time * (R_conv / R_prod)) / elapsed,
    }
```

---

## Offline Depth Progress

Depth progress offline berjalan pada 70% dari laju online. Ini adalah satu-satunya subsistem dengan penalti besar, dan keputusan ini kuat secara naratif maupun mekanis.

### Alasan Naratif

Tanpa pengawasan langsung, pekerja dan mesin beroperasi dengan protokol keselamatan penuh. Tidak ada manual blasting. Tidak ada risk-taking. Penggalian berjalan stabil, tetapi konservatif.

### Alasan Mekanis

Jika depth progress offline setara dengan online, pemain bisa meninggalkan game selama berhari-hari lalu menembus beberapa biome baru tanpa pernah merasakannya. Penemuan biome baru harus menjadi momen yang dialami, bukan dilewati.

### Formula Depth Rate

```text
depth_rate_online = base_drill_depth_rate(drill_level) + dynamite_passive_rate(dynamite_level)

base_drill_depth_rate(level) = 0.5 * level + 0.02 * level^1.3
dynamite_passive_rate(level) = 0.3 * level + 0.01 * level^1.2

depth_rate_offline = depth_rate_online * 0.70
```

### Autonomous Excavation

Autonomous Excavation meningkatkan efisiensi depth offline, tetapi tidak pernah menyamakan depth progress offline dengan online.

```text
offline_depth_efficiency = 0.70 + (0.03 * autonomous_excavation_level)
```

| Level | Offline Depth Efficiency |
| ---: | ---: |
| 0 | 70% |
| 4 | 82% |
| 8 | 94% |

Gap minimum 6% di level maksimum memastikan depth progress online tetap sedikit lebih baik.

### Cap Harian

Untuk mencegah pemain offline terlalu lama menembus terlalu banyak biome:

```text
max_daily_offline_depth = current_depth * 0.15 + 500
```

Contoh:

- Pada depth `1,000m`, cap harian adalah `+650m`.
- Pada depth `10,000m`, cap harian adalah `+2,000m`.
- Pada depth `50,000m`, cap harian adalah `+8,000m`.

---

## Offline Event Generation

Event offline hanya berjalan pada 40% dari laju online. Angka ini sengaja paling rendah dari semua subsistem.

Alasannya sederhana: event adalah momen interaktif. Rich Vein, Gold Rush, atau Gas Pocket hanya benar-benar menarik saat pemain hadir dan bisa merespons. Offline, nilai interaktif itu hilang. Yang tersisa hanya output numeriknya.

### Formula Event Rate

```text
event_frequency_online  = base_event_rate * (1 + 0.20 * cosmic_magnetism_level)
event_frequency_offline = event_frequency_online * 0.40

events_during_offline = floor(event_frequency_offline * elapsed_seconds / 40)
```

Dengan asumsi:

```text
base_event_rate ~= 1 event per 40 seconds online
```

### Resolusi Event Offline

Setiap event yang terjadi saat offline langsung di-resolve menggunakan average outcome, bukan best case atau worst case.

```text
for each offline_event:
    roll event_type from weighted_event_pool
    apply average_positive_outcome
    add result to offline_report
```

Event jackpot seperti Ancient Chest atau Meteor Strike mendapat batas tambahan:

```text
jackpot_offline_modifier = 0.25
```

Artinya, jackpot hanya memiliki 25% peluang muncul offline dibanding online.

---

## Degradasi Efisiensi Offline Panjang

Efisiensi 95% berlaku penuh untuk 24 jam pertama. Setelah itu, efisiensi turun bertahap agar pemain tidak mendapat simulasi sempurna selama berhari-hari tanpa batas.

```python
def offline_efficiency(elapsed_hours):
    if elapsed_hours <= 24:
        return 0.95
    elif elapsed_hours <= 48:
        return 0.95 - 0.05 * ((elapsed_hours - 24) / 24)   # 95% -> 90%
    elif elapsed_hours <= 72:
        return 0.90 - 0.05 * ((elapsed_hours - 48) / 24)   # 90% -> 85%
    elif elapsed_hours <= 168:
        return 0.85 - 0.10 * ((elapsed_hours - 72) / 96)   # 85% -> 75%
    else:
        return 0.75
```

### Cap Absolut

Simulasi offline berhenti total setelah `168 jam` atau `7 hari`.

Ini bukan penalti. Ini adalah statement desain: Virtual Miner adalah game yang dimainkan, bukan game yang ditinggalkan.

### Dream Mining vs. Degradasi

Dream Mining juga bisa mengurangi dampak degradasi jangka panjang:

```python
def offline_efficiency_with_prestige(elapsed_hours, dream_level):
    base = offline_efficiency(elapsed_hours)
    floor_boost = 0.02 * dream_level
    degradation_resist = 1 - (0.05 * dream_level)

    degraded_portion = 0.95 - base
    mitigated_degradation = degraded_portion * degradation_resist

    return max(0.75 + floor_boost, 0.95 - mitigated_degradation)
```

---

## Welcome Back Report

Welcome Back Report bukan afterthought. Ini adalah momen re-engagement yang harus membuat pemain ingin langsung bermain lagi.

### Panel 1: Duration and Efficiency

```text
"Welcome back, Miner."
"Your operation ran for 8 hours 14 minutes."
"Overall efficiency: 94.2%"
```

Tampilkan progress bar visual. Jika efisiensi turun di bawah 80%, ubah warna menjadi kuning dan tampilkan hint:

```text
"Upgrade Storage or Conveyor to improve offline output."
```

### Panel 2: Ore Produced

Gunakan animated counter untuk total ore, lalu pecah per rarity.

```text
Total ores mined: 4,847

Plain:     3,210
Curious:     891
Odd:         412
Uncanny:     187
Whispered:    94
Haunted:      38
Hexed:        11
Enchanted:     3
Hallowed:      1
```

Tier di atas `Hexed` mendapat highlight khusus. Jika ada drop `Mythic` atau `Fabled`, panel ini harus mendapat animasi spesial.

### Panel 3: Gold Earned

```text
Gold from auto-sell: 127,450
Gold from events:      8,200
Total:               135,650
```

### Panel 4: Events Log

```text
Events occurred: 4

- Rich Vein: bonus 312 ores
- Earthquake: gained 85m depth
- Cave Collapse: lost 14 Coal, found 3 Obsidian
- Gas Pocket: exposed rare minerals
```

### Panel 5: Depth Gained

```text
Depth progress: +247m (8,147m -> 8,394m)
"72% to Bioluminescent Deep"
```

Tambahkan progress bar ke biome berikutnya.

### Panel 6: New Discoveries

Jika ada temuan baru:

```text
NEW DISCOVERY: Mycelite
"Your workers stumbled upon a strange fungal mineral."
"Museum entry unlocked."
```

---

## Sistem RNG Ore Drop

### Rarity Architecture

Kelima belas tier rarity dibagi ke dalam empat zona psikologis.

#### Zona Familiar (Tier 1-5: Plain -> Whispered)

Ore di zona ini muncul terus-menerus. Mereka menjadi white noise dari kegiatan menambang: value per unit rendah, volume tinggi, dan hampir tidak memicu reaksi emosional. Ini disengaja. Zona familiar adalah baseline yang membuat tier berikutnya terasa penting.

#### Zona Excitement (Tier 6-9: Haunted -> Hallowed)

Di sinilah pemain mulai bereaksi. Haunted memberi rasa puas kecil. Enchanted membuat pemain berhenti sejenak. Hallowed membuat pemain benar-benar senang. Ini adalah zona dopamine utama: cukup sering untuk terasa mungkin, cukup langka untuk terasa spesial.

#### Zona Adrenaline (Tier 10-12: Cursed -> Eldritch)

Zona ini memicu ketegangan. Cursed bisa memancing respons spontan. Eldritch terasa layak untuk di-screenshot. Inilah zona hook yang membuat pemain berkata, "mungkin satu run lagi."

#### Zona Legendary (Tier 13-15: Arcane -> Fabled)

Drop di zona ini mendefinisikan sesi bermain. Mythic adalah momen yang diingat. Fabled adalah cerita yang dibagikan ke orang lain. Tier ini bisa muncul sekali per hari atau bahkan lebih jarang.

### Base Drop Rate Distribution

Distribusi 15 tier harus dirancang hati-hati. Total probabilitas harus sama dengan `1.0`, dan setiap loncatan tier harus terasa berbeda dari tier sebelumnya.

| Tier | Rarity | Probability | Percentage |
| ---: | --- | ---: | ---: |
| 1 | Plain | 0.3200 | 32.00% |
| 2 | Curious | 0.2200 | 22.00% |
| 3 | Odd | 0.1500 | 15.00% |
| 4 | Uncanny | 0.1000 | 10.00% |
| 5 | Whispered | 0.0650 | 6.50% |
| 6 | Haunted | 0.0420 | 4.20% |
| 7 | Hexed | 0.0270 | 2.70% |
| 8 | Enchanted | 0.0170 | 1.70% |
| 9 | Hallowed | 0.0105 | 1.05% |
| 10 | Cursed | 0.0062 | 0.62% |
| 11 | Veiled | 0.0035 | 0.35% |
| 12 | Eldritch | 0.0018 | 0.18% |
| 13 | Arcane | 0.00080 | 0.080% |
| 14 | Mythic | 0.00030 | 0.030% |
| 15 | Fabled | 0.00010 | 0.010% |
|  | **Total** | **1.00000** | **100.00%** |

### Rasio Antar Tier

| Perbandingan | Rasio | Catatan |
| --- | ---: | --- |
| Plain / Curious | 1.45x | Perbedaan tipis; keduanya sangat sering muncul. |
| Curious / Odd | 1.47x |  |
| Odd / Uncanny | 1.50x |  |
| Uncanny / Whispered | 1.54x |  |
| Whispered / Haunted | 1.55x | Gap mulai terasa. |
| Haunted / Hexed | 1.56x |  |
| Hexed / Enchanted | 1.59x |  |
| Enchanted / Hallowed | 1.62x | Gap makin terasa. |
| Hallowed / Cursed | 1.69x |  |
| Cursed / Veiled | 1.77x | Lonjakan makin besar. |
| Veiled / Eldritch | 1.94x |  |
| Eldritch / Arcane | 2.25x | Lompatan besar. |
| Arcane / Mythic | 2.67x |  |
| Mythic / Fabled | 3.00x | Gap terbesar di puncak. |

### Rekomendasi Sistem RNG

Gunakan sistem `Hybrid Adaptive` yang menggabungkan:

- `PRD` untuk mengurangi streak buruk ekstrem.
- `Pity` untuk menjaga drop langka tetap terasa mungkin.
- `Lucky Strike` untuk memberi ruang bagi momen kejutan yang benar-benar memorable.
