# Changelog

All notable changes to this project will be documented in this file.

## [2025-02-15] - API Enhancement

### FEAT
- Added advanced API settings modal with customizable options
- Implemented model selection with support for various LLMs
- Added temperature and token limit adjustment controls
- Implemented streaming API response processing
- Added support for customizable API endpoint URLs
- Improved SVG code extraction from API responses

### REFACTOR
- Removed simulation code in favor of real API integration
- Improved error handling for API requests and responses
- Enhanced stream processing for efficient large response handling

### STYLE
- Added modal dialog for advanced settings
- Improved form layout and controls for settings management

## [2025-01-25] - Initial Release

### FEAT
- Implemented basic canvas drawing functionality with multiple tools (pencil, line, rectangle, circle, text, eraser).
- Added image upload capability with drag-and-drop support.
- Integrated CodeMirror for SVG code editing with syntax highlighting.
- Implemented SVG preview functionality.
- Added capability to download generated SVG files.

### FIX
- Fixed eraser cursor size to match actual erasing area.
- Fixed text input tool positioning and visibility issues.

### CHORE
- Optimized project directory structure for future expansion.
- Set up basic documentation.
- Implemented API key storage in local storage.

### STYLE
- Created responsive UI layout with left-side input and right-side output areas.
- Implemented tab-based navigation between different sections.
- Added dark theme for code editor.
