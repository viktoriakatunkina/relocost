#!/usr/bin/env python3
"""Сборка BRANDBOOK.md → фирменно оформленный HTML для печати в PDF."""
import re
import markdown

SRC = "/Users/viktoriadimark/Desktop/Работа/Клод/relocost/BRANDBOOK.md"
OUT_HTML = "/Users/viktoriadimark/Desktop/Работа/Клод/relocost/BRANDBOOK.html"

with open(SRC, encoding="utf-8") as f:
    md_text = f.read()

# Заголовок-обложка отрезаем — отрисуем своей вёрсткой.
# Убираем вводный блок до первого горизонтального разделителя.
parts = md_text.split("\n---\n", 1)
if len(parts) == 2:
    md_text = parts[1]

body_html = markdown.markdown(
    md_text,
    extensions=["tables", "fenced_code", "sane_lists", "attr_list"],
)

# Подсветим hex-цвета в таблицах — добавим цветной кружок-образец
def colorize(m):
    hexv = m.group(0)
    return f'<span class="swatch" style="background:{hexv}"></span><code>{hexv}</code>'

# В ячейках вида <code>#RRGGBB</code> добавляем образец цвета
body_html = re.sub(
    r"<code>(#[0-9A-Fa-f]{6})</code>",
    lambda m: f'<span class="swatch" style="background:{m.group(1)}"></span><code>{m.group(1)}</code>',
    body_html,
)

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

:root{
  --pine-tree:#1A2105; --surface:#28321A; --kombu:#2C3A24; --elevated:#34401F;
  --dim:#5A6A45; --dingley:#6A784D; --muted:#8A9A6E;
  --copper:#E89B6E; --pale-copper:#D89478; --brandy:#E6CFA8; --cream:#F6F1E8;
  --hairline:rgba(222,197,158,0.16);
}
@page{ size:A4; margin:18mm 16mm; }
*{ box-sizing:border-box; }
body{
  font-family:'Manrope',system-ui,sans-serif;
  background:var(--pine-tree); color:var(--brandy);
  font-size:11.5px; line-height:1.62; margin:0; padding:0;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
.page{ padding:0; }

/* ОБЛОЖКА */
.cover{
  height:261mm; display:flex; flex-direction:column; justify-content:center;
  page-break-after:always; padding:0 6mm;
  background:radial-gradient(120% 80% at 80% 10%, rgba(232,155,110,0.12), transparent 55%), var(--pine-tree);
}
.cover .mark{
  width:84px; height:84px; border-radius:22px; background:var(--pine-tree);
  border:1px solid var(--hairline); display:flex; align-items:center; justify-content:center;
  margin-bottom:34px; box-shadow:0 24px 80px -32px rgba(232,155,110,0.55);
}
.cover .mark svg{ width:48px; height:48px; }
.cover h1{
  font-family:'Cormorant Garamond',Georgia,serif; font-weight:600;
  font-size:88px; line-height:1.0; letter-spacing:-0.02em; color:var(--cream);
  margin:0 0 6px;
}
.cover .sub{
  font-family:'Cormorant Garamond',Georgia,serif; font-size:30px; color:var(--copper);
  margin:0 0 28px; font-weight:500;
}
.cover .meta{
  font-size:11px; text-transform:uppercase; letter-spacing:0.18em; color:var(--muted);
  border-top:1px solid var(--hairline); padding-top:18px; max-width:520px;
}
.cover .meta code{ color:var(--brandy); }

/* ТИПОГРАФИКА КОНТЕНТА */
h1,h2,h3{ font-family:'Cormorant Garamond',Georgia,serif; color:var(--cream); font-weight:600; line-height:1.1; }
h2{
  font-size:30px; margin:30px 0 12px; padding-bottom:8px;
  border-bottom:1px solid var(--hairline); page-break-after:avoid;
}
h2::before{
  content:""; display:inline-block; width:22px; height:2px; background:var(--copper);
  vertical-align:middle; margin-right:12px; transform:translateY(-5px);
}
h3{ font-size:18px; margin:20px 0 8px; color:var(--brandy); page-break-after:avoid; }
p{ margin:8px 0; text-wrap:pretty; }
strong{ color:var(--cream); font-weight:600; }
a{ color:var(--copper); text-decoration:none; }
hr{ display:none; }
ul,ol{ margin:8px 0; padding-left:20px; }
li{ margin:4px 0; }
li::marker{ color:var(--copper); }

code{
  font-family:'SF Mono','Menlo',monospace; font-size:9.5px;
  background:rgba(222,197,158,0.08); color:var(--brandy);
  padding:1px 5px; border-radius:5px; border:1px solid var(--hairline);
}

blockquote{
  margin:14px 0; padding:10px 16px; background:var(--kombu);
  border-left:3px solid var(--copper); border-radius:0 10px 10px 0;
  color:var(--brandy); font-size:11px;
}
blockquote p{ margin:0; }

/* ТАБЛИЦЫ */
table{
  width:100%; border-collapse:collapse; margin:12px 0; font-size:10px;
  background:var(--surface); border-radius:10px; overflow:hidden;
  page-break-inside:avoid; border:1px solid var(--hairline);
}
th{
  background:var(--elevated); color:var(--cream); text-align:left; font-weight:600;
  padding:8px 10px; font-size:9.5px; text-transform:uppercase; letter-spacing:0.05em;
}
td{ padding:7px 10px; border-top:1px solid var(--hairline); vertical-align:top; }
tr:nth-child(even) td{ background:rgba(222,197,158,0.03); }

.swatch{
  display:inline-block; width:11px; height:11px; border-radius:3px;
  border:1px solid rgba(246,241,232,0.25); margin-right:6px; vertical-align:-1px;
}

section.block{ page-break-inside:avoid; }
"""

# Фирменный знак-пин (на базе фавикона) — персик на тёмном
MARK_SVG = """
<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 6c-8 0-14 6-14 14 0 9.5 11.5 19 13.2 20.4a1.2 1.2 0 0 0 1.6 0C26.5 39 38 29.5 38 20c0-8-6-14-14-14z" fill="#E89B6E"/>
  <circle cx="24" cy="20" r="6" fill="#1A2105"/>
</svg>
"""

html = f"""<!DOCTYPE html>
<html lang="ru"><head><meta charset="utf-8">
<title>Relocost — Брендбук</title>
<style>{CSS}</style></head>
<body>
<div class="cover">
  <div class="mark">{MARK_SVG}</div>
  <h1>Relocost</h1>
  <div class="sub">Брендбук</div>
  <div class="meta">
    Версия 0.1 · черновик на утверждение · 2026<br>
    Живой источник токенов: <code>app/globals.css</code>, <code>tailwind.config.ts</code>, <code>app/layout.tsx</code>
  </div>
</div>
<div class="page">
{body_html}
</div>
</body></html>"""

with open(OUT_HTML, "w", encoding="utf-8") as f:
    f.write(html)

print("HTML готов:", OUT_HTML)
