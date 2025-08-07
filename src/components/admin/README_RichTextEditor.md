# RichTextEditor Component Documentation

## 📝 Overview

RichTextEditor е WYSIWYG (What You See Is What You Get) редактор подобен на Microsoft Word, който позволява създаване и редактиране на богато форматиран текст с интуитивен интерфейс.

## ✨ Features

### 🎨 Text Formatting
- **Шрифтове**: 10 популярни шрифта (Arial, Helvetica, Times New Roman, etc.)
- **Размер на шрифта**: От 12px до 72px
- **Стилове**: Bold, Italic, Underline
- **Цветове**: 20 предварително зададени цвята за текст и фон
- **Подравняване**: Ляво, център, дясно

### 📋 Content Structure
- **Заглавия**: H1, H2, H3, параграф, цитат
- **Списъци**: С точки и номерирани
- **Връзки**: Добавяне на URL връзки
- **Изображения**: Вмъкване на изображения по URL

### 🔧 Tools
- **Undo/Redo**: Отмени и повтори действия
- **Word Count**: Брой думи и символи в реално време
- **Keyboard Shortcuts**: Поддръжка на стандартни комбинации

## 🚀 Usage

```tsx
import RichTextEditor from '@/components/admin/RichTextEditor'

function ArticleEditor() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Започнете да пишете статията..."
      className="min-h-96"
    />
  )
}
```

## 📋 Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | ✅ | - | HTML съдържание на редактора |
| `onChange` | `(value: string) => void` | ✅ | - | Callback функция при промяна |
| `placeholder` | `string` | ❌ | - | Placeholder текст |
| `className` | `string` | ❌ | `''` | Допълнителни CSS класове |

## 🎯 Integration Examples

### В ArticleEditor компонента:
```tsx
import RichTextEditor from './RichTextEditor'

// Заменяме textarea с RichTextEditor
<RichTextEditor
  value={formData.content}
  onChange={(value) => handleInputChange('content', value)}
  placeholder="Въведете съдържанието на статията..."
  className={`${errors.content ? 'border-red-500' : ''}`}
/>
```

### В TemplateBasedArticleCreator:
```tsx
{contentMode === 'rich' && (
  <div className="space-y-4">
    <RichTextEditor
      value={articleData.content}
      onChange={handleContentChange}
      placeholder="Започнете да пишете статията..."
      className="min-h-96"
    />
  </div>
)}
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + B` | Bold |
| `Ctrl + I` | Italic |
| `Ctrl + U` | Underline |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Shift + Enter` | Line break |

## 🎨 Customization

### Добавяне на нови шрифтове:
```tsx
const FONTS = [
  // Съществуващи шрифтове...
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' }
]
```

### Добавяне на нови цветове:
```tsx
const COLORS = [
  // Съществуващи цветове...
  '#ff6b6b', // Червен
  '#4ecdc4', // Тюркоазен
  '#45b7d1'  // Син
]
```

## 🔧 Technical Details

### Използвани технологии:
- **contentEditable**: Нативен HTML contentEditable API
- **document.execCommand**: За форматиране (deprecated но все още работещ)
- **React Hooks**: useState, useRef, useEffect
- **Tailwind CSS**: За стилизиране

### Browser Support:
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🐛 Known Issues

1. **document.execCommand**: Deprecated API, но все още работи в повечето браузъри
2. **Paste Formatting**: При копиране от Word може да запази нежелано форматиране
3. **Image Upload**: Засега поддържа само URL, не и file upload

## 🔮 Future Improvements

- [ ] File upload за изображения
- [ ] Table support
- [ ] Code block formatting
- [ ] Custom color picker
- [ ] Spell checker integration
- [ ] Auto-save functionality

## 📚 Related Components

- `ArticleEditor` - Основен редактор за статии
- `TemplateBasedArticleCreator` - Създаване на статии с темплейти
- `ArticlePreview` - Предварителен преглед на статиите
