export interface ExportTemplate {
  slug: string;
  nameAr: string;
  nameEn: string;
  html: (text: string, source: string, fontDataUri?: string) => string;
}

const COMMON_STYLES = (fontDataUri?: string) => `
  ${fontDataUri ? `
  @font-face {
    font-family: 'KFGQPC Uthmanic Script HAFS';
    src: url('${fontDataUri}') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  ` : ""}
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    width: 1080px;
    height: 1080px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${fontDataUri ? "'KFGQPC Uthmanic Script HAFS'," : ""} 'Traditional Arabic', serif;
  }
  
  .card {
    width: 1080px;
    height: 1080px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 80px;
    position: relative;
    overflow: hidden;
  }
  
  .text-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .arabic-text {
    font-family: ${fontDataUri ? "'KFGQPC Uthmanic Script HAFS'," : ""} 'Traditional Arabic', serif;
    font-size: 48px;
    line-height: 2;
    text-align: center;
    direction: rtl;
    unicode-bidi: bidi-override;
  }
  
  .source {
    font-family: ${fontDataUri ? "'KFGQPC Uthmanic Script HAFS'," : ""} 'Traditional Arabic', serif;
    font-size: 24px;
    text-align: center;
    direction: rtl;
  }
  
  .watermark {
    position: absolute;
    bottom: 30px;
    left: 30px;
    font-family: ${fontDataUri ? "'KFGQPC Uthmanic Script HAFS'," : ""} 'Traditional Arabic', serif;
    font-size: 14px;
    opacity: 0.5;
  }
`;

export const templates: ExportTemplate[] = [
  {
    slug: "minimalist-light",
    nameAr: "بسيط - فاتح",
    nameEn: "Minimalist Light",
    html: (text, source, fontDataUri) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${COMMON_STYLES(fontDataUri)}
    
    .card {
      background: #ffffff;
      border: 1px solid #e5e5e5;
    }
    
    .arabic-text {
      color: #1a1a1a;
    }
    
    .source {
      color: #666666;
      margin-top: 40px;
    }
    
    .watermark {
      color: #999999;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="text-content">
      <div class="arabic-text">${text}</div>
    </div>
    <div class="source">${source}</div>
    <div class="watermark">SHK Islam</div>
  </div>
</body>
</html>`,
  },
  {
    slug: "dark-mode",
    nameAr: "داكن",
    nameEn: "Dark Mode",
    html: (text, source, fontDataUri) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${COMMON_STYLES(fontDataUri)}
    
    .card {
      background: #1a1a1a;
      border: 1px solid #333333;
    }
    
    .arabic-text {
      color: #f5f5f5;
    }
    
    .source {
      color: #aaaaaa;
      margin-top: 40px;
    }
    
    .watermark {
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="text-content">
      <div class="arabic-text">${text}</div>
    </div>
    <div class="source">${source}</div>
    <div class="watermark">SHK Islam</div>
  </div>
</body>
</html>`,
  },
  {
    slug: "geometric-decorative",
    nameAr: "زخرفي",
    nameEn: "Geometric Decorative",
    html: (text, source, fontDataUri) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${COMMON_STYLES(fontDataUri)}
    
    .card {
      background: #fafaf8;
      border: 3px double #8b7355;
      background-image: 
        linear-gradient(30deg, #f5f5f0 12%, transparent 12.5%, transparent 87%, #f5f5f0 87.5%, #f5f5f0),
        linear-gradient(150deg, #f5f5f0 12%, transparent 12.5%, transparent 87%, #f5f5f0 87.5%, #f5f5f0),
        linear-gradient(30deg, #f5f5f0 12%, transparent 12.5%, transparent 87%, #f5f5f0 87.5%, #f5f5f0),
        linear-gradient(150deg, #f5f5f0 12%, transparent 12.5%, transparent 87%, #f5f5f0 87.5%, #f5f5f0),
        linear-gradient(60deg, #ede8e0 25%, transparent 25.5%, transparent 75%, #ede8e0 75%, #ede8e0),
        linear-gradient(60deg, #ede8e0 25%, transparent 25.5%, transparent 75%, #ede8e0 75%, #ede8e0);
      background-size: 80px 140px;
      background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
    }
    
    .arabic-text {
      color: #1a1a1a;
      position: relative;
      z-index: 1;
    }
    
    .source {
      color: #8b7355;
      margin-top: 40px;
      position: relative;
      z-index: 1;
    }
    
    .watermark {
      color: #8b7355;
      position: relative;
      z-index: 1;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="text-content">
      <div class="arabic-text">${text}</div>
    </div>
    <div class="source">${source}</div>
    <div class="watermark">SHK Islam</div>
  </div>
</body>
</html>`,
  },
];

export function getTemplate(slug: string): ExportTemplate | undefined {
  return templates.find((t) => t.slug === slug);
}
