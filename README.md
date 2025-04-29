# Sketch2Chart

[ English | [繁體中文](docs/README.zh-TW.md) ]

Sketch2Chart is a user-friendly tool that converts hand-drawn sketches into structured visual code (e.g., SVG). Whether it's flowcharts, organizational charts, diagrams, or any other type of visualization, Sketch2Chart quickly transforms your hand-drawn sketches into usable digital formats.

## Key Features

- 🖌️ **Simple Canvas**: Paint-like drawing interface
- 📤 **Image Upload**: Support for uploading existing hand-drawn images
- 🔄 **Smart Conversion**: AI-powered transformation into SVG and other structured formats
- 📝 **Text Assistance**: Enhance or modify output through text descriptions
- ✏️ **Code Editing**: Direct code editing with syntax highlighting
- 💾 **Export Options**: Download generated SVG or other format files
- ⚙️ **Advanced Settings**: Customize API endpoint, model selection, and other parameters

## Usage

1. Download the source code
2. Open `public/index.html` directly in your browser
3. Choose to draw on canvas or upload an existing image
4. Click "Convert" to process
5. Edit generated code or add text descriptions as needed
6. Download or copy the final result

## Technical Stack

- Frontend: HTML5, CSS3, JavaScript
- Drawing: Canvas API
- File Handling: FileReader API
- Code Editing: CodeMirror 5.65.13
- AI Integration: API connection to multimodal language models

## Development Requirements

- Modern browser (Chrome, Firefox, Edge, etc.)
- Internet connection (for AI model calls and CDN loading)

## External Packages

- [CodeMirror](https://codemirror.net/) - For code editing and syntax highlighting

## Project Structure

```
/sketch2chart
  ├── /docs               # Documentation
  ├── /public             # Public resources and static files
  │    ├── index.html     # Main HTML file
  │    ├── /css           # CSS files
  │    │    └── styles.css
  │    ├── /js            # JavaScript files
  │    │    ├── app.js    # Main application logic
  │    │    └── canvas.js # Canvas-related functionality
  │    └── /assets        # Images, icons, and other static assets
  │         └── /images   
  ├── LICENSE             # License file
  └── README.md           # Project documentation
```

## Future Plans

- Frontend-backend separation
- Standalone API service
- Python deployment option
- Support for more output formats
- Model performance and conversion accuracy optimization

## License

MIT License 