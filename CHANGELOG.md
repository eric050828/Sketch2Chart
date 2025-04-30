# Changelog

All notable changes to this project will be documented in this file.

## [2025-04-30] - Internationalization Support

### FEAT
- Implemented complete i18n support with English and Traditional Chinese
- Added language preference persistence using localStorage
- Created language selector UI with smooth switching
- Implemented dynamic content translation system

### STYLE
- Added language selector styling with hover effects
- Implemented responsive design for language selector
- Added active state indication for selected language

### REFACTOR
- Updated all static text content to use i18n keys
- Improved error message handling with translations
- Enhanced toast notification system with i18n support

## [2025-04-30] - History Feature Implementation

### FEAT
- Added conversion history sidebar with thumbnails
- Implemented local storage for history persistence
- Added ability to reload previous SVG from history
- Added delete functionality for history items
- Implemented hash-based duplicate prevention
- Added responsive layout for history sidebar on mobile devices

### STYLE
- Added compact history preview thumbnails
- Implemented hover effects and active state for history items
- Added timestamp display for history items

## [2025-04-30] - Documentation Update

### DOCS
- Add English README
- Added advanced settings configuration steps in usage guide
- Reorganized usage steps for better clarity

## [2025-04-30] - SVG Interaction Enhancement

### FEAT
- Added SVG preview area zoom and pan functionality
- Integrated SVG.js and PanZoom library for interactive operations
- Added zoom control buttons (zoom in, zoom out, reset)
- Implemented real-time preview update functionality when editing SVG code

### STYLE
- Refactored output area layout to vertical alignment
- Hidden preview area scrollbar for improved visual experience
- Added circular control buttons and hover effect
- Optimized error message display

## [2025-04-29] - API Enhancement

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

## [2025-04-29] - Initial Release

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
