# Dynamic Division Pages Implementation

## Overview
This implementation creates a dynamic system for managing division pages with a unified UI but different content per division.

## Features

### 1. Dynamic Pages
- Each division has its own page at `/divisions/{slug}`
- Same UI structure across all divisions
- Three main sections: Hero, About, Services
- Services section supports multiple tabs

### 2. Admin Interface

#### Sidebar Navigation
- **Divisions** dropdown in the left menu
- Shows all existing divisions
- Click any division to edit its content
- **"+ Create New"** option to add divisions
- **"Divisions Page"** option to edit the listing page

#### Edit Individual Division
Navigate to: `/admin/dashboard/pages/divisions/{slug}`

Edit the following sections:
- **Hero Section**: Title, subtitle, background image
- **About Section**: Badge, title, multiple description paragraphs
- **Services Section**: 
  - Header: Badge, title, subtitle
  - Multiple service tabs with:
    - Tab ID, number, title, heading
    - Multiple description paragraphs
    - Image

#### Create New Division
Navigate to: `/admin/dashboard/pages/divisions/new`

1. Enter division name (auto-generates slug)
2. Edit slug if needed (shows URL preview)
3. Add optional tagline and subtitle
4. Click "Create Division"
5. Automatically redirected to edit page

## Migration

To migrate existing hardcoded content to the database:

```bash
curl -X POST "http://your-domain/api/divisions/migrate?tenant=kisan-plant-technologies"
```

This will:
- Create or update `kisan-plantiq` division
- Create or update `kisan-agriq` division
- Preserve all existing content

## API Endpoints

### List Divisions
```
GET /api/divisions?tenant={tenant-slug}
```

### Create Division
```
POST /api/divisions?tenant={tenant-slug}
Body: { name, slug, tagline, subtitle }
```

### Get Division Content
```
GET /api/pages/divisions/{slug}/content?tenant={tenant-slug}
```

### Update Division Content
```
PUT /api/pages/divisions/{slug}/content?tenant={tenant-slug}
Body: { content: { hero, about, services } }
```

## Database Schema

The Division model includes:
- Basic fields: name, slug, tagline, subtitle, description
- Images: heroImage, cardImage
- pageContent: Complete page structure (hero, about, services)
- order: Display order
- isActive: Visibility flag

## Usage Workflow

1. **First Time Setup**: Run migration endpoint to populate existing divisions
2. **Edit Content**: Use admin sidebar → Divisions → Select division
3. **Create New**: Click "+ Create New" in sidebar dropdown
4. **Manage Listing**: Click "Divisions Page" to edit the main divisions page

## Notes

- All changes are saved to the database
- Frontend automatically fetches from database
- Fallback to hardcoded content if database is not configured
- Each website/tenant has separate divisions
