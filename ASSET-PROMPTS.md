# Tài nguyên hình ảnh

Tạo bằng tool imagegen tích hợp, không dùng CLI/API key. Hai ảnh là tài nguyên độc lập; không dùng ảnh mockup hoàn chỉnh làm bản đồ game.

## Nền — `public/assets/tet-background.png`

```text
Use case: stylized-concept. Asset type: background layer only for a Vietnamese Tet live interactive game, portrait 1080x1920 composition. Deep midnight blue luminous festive sky, subtle stars and clouds, peach blossom branches in upper left, yellow apricot blossoms upper right, warm red hanging lanterns at top corners, small traditional Vietnamese village houses framing bottom corners, lush rice fields and tranquil river at bottom, luxurious gold and electric cyan atmospheric accents, polished detailed 3D fantasy illustration matching neon Tet celebration. Keep the entire central 80 percent very dark uncluttered empty blue for a real interactive Vietnam map and panels added in code. No map, no text, no letters, no logo, no people, no UI, no flags.
```

Nền không trong suốt; native 941 × 1672, dùng CSS cover vào khung thiết kế 1080 × 1920.

## Rồng — `public/assets/golden-dragon.png`

```text
Use case: stylized-concept. Asset type: isolated transparent game sprite for Vietnamese Tet celebration. One magnificent Vietnamese golden dragon in profile facing left, long flowing serpentine body curling gently in a horizontal S, elegant antler horns, long whiskers, detailed shiny gold scales, red mane and amber glow accents, all four small claws, expressive majestic friendly dragon head. Luxurious 3D rendered illustration, crisp silhouette, whole dragon fully visible with generous transparent margin, no ground, no backdrop, no text, no symbols, no other objects. Wide horizontal composition.
```

Yêu cầu `transparent_background: true`. Sprite dùng quỹ đạo động, không phải video alpha hoặc spritesheet có nhiều tư thế.

## PNG từ code

`tools/export-assets.mjs` xuất logo 960 × 170, khung thông tin 760 × 360, khung phim 940 × 540, khung TOP 440 × 300, viền avatar 160 × 160, pin 96 × 128 và 5 icon chức năng 160 × 160. Khung có phần giữa trong suốt. Đây là tài nguyên code-native được xuất thành PNG, không phải ảnh AI cắt từ mockup. Các icon quà thật dùng thư viện chung, tên/xu/ID giữ theo catalog.

## Địa hình nổi trang trí v2 — `public/assets/terrain-relief-v2.png`

Tạo bằng imagegen tích hợp ngày 09/11/2026. Texture được mask riêng trong từng polygon SVG; đây là địa hình minh họa, không phải dữ liệu cao độ thực tế.

```text
Use case: stylized-concept. Asset type: decorative terrain texture for clipping inside real SVG province boundaries in a Vietnamese Tet map game. A square seamless-looking top-down fantasy relief terrain surface, lush emerald green mountains and rolling forested hills, small winding turquoise rivers, fine sculpted ridges, rich jade valleys, tiny speckles of gold sunlight on mountain peaks. Premium detailed miniature diorama map surface, luminous but natural green, soft directional light from upper left, crisp fine texture visible at small scale. Terrain ONLY, no country outline, no borders, no names, no labels, no roads, no buildings, no icons, no UI, no sky, no ocean, no text. Fill the entire square with continuous forest mountain terrain suitable for masking inside vector shapes.
```
