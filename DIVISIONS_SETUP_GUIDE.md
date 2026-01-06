# Divisions Setup Guide

## Quick Start

### Step 1: Migrate Existing Data (First Time Only)

1. Go to admin panel: `/admin/dashboard`
2. Select your website
3. Navigate to: **Pages → Divisions** (in sidebar)
4. Click the **"Migrate to DB"** button
5. Wait for success message
6. Page will auto-reload

✅ This migrates `kisan-plantiq` and `kisan-agriq` to the database

### Step 2: Verify Divisions

After migration, the **Divisions** menu in sidebar should show:
- Divisions Page (listing page editor)
- Kisan PLANTIQ
- Kisan AGRIQ  
- + Create New

### Step 3: Edit Individual Division

1. Click **Divisions** in sidebar to expand
2. Click any division name (e.g., "Kisan PLANTIQ")
3. Edit content in tabs:
   - **Hero Section**: Title, subtitle, background image
   - **About Section**: Badge, title, descriptions
   - **Services Section**: Badge, title, subtitle, service tabs
4. Click **"Save Changes"**

## Creating New Division

### From Sidebar:
1. Expand **Divisions** dropdown
2. Click **"+ Create New"**

### Fill in All Sections:

**Basic Info Tab:**
- Name: "Kisan SECURE"
- Slug: auto-generates (editable)
- Tagline: "Smart Security Solutions"
- Subtitle: "Agro & Environmental Security"

**Hero Section Tab:**
- Title: Add your main heading
- Subtitle: Supporting text
- Background Image: Upload hero image

**About Section Tab:**
- Badge: "About KISAN SECURE"
- Title: Division title
- Description: Add multiple paragraphs (click "+ Add Paragraph")

**Services Section Tab:**
- Badge: "Our Services"
- Title: Services heading
- Subtitle: Overview text
- Service Tabs:
  - Add multiple tabs (click "+ Add Service Tab")
  - For each tab:
    - ID: unique identifier
    - Number: "01", "02", etc.
    - Title: Tab label
    - Heading: Display heading
    - Description: Multiple paragraphs
    - Image: Service image

**Click "Create Division"** → Automatically redirects to editor

## Frontend Access

All divisions are accessible at:
```
/divisions/kisan-plantiq
/divisions/kisan-agriq
/divisions/your-new-slug
```

## Common Issues

### "Division not found"
**Solution:** Run migration first
1. Go to `/admin/dashboard/pages/divisions`
2. Click "Migrate to DB" button

### Divisions not in sidebar
**Solution:** Refresh page after migration
- The page auto-reloads after migration
- If not, manually refresh browser

### Can't edit content
**Ensure:**
1. Website is selected (top of sidebar)
2. Migration completed successfully
3. Division exists in database

## Tips

- **Auto-populate**: Name field auto-fills hero and about titles
- **Slug**: Auto-generated from name, but editable
- **Line breaks**: Use `\n` in text fields
- **Images**: Click upload button or paste image URL
- **Order**: Divisions display in order added
- **Multiple tabs**: Add as many service tabs as needed

## Architecture

- **Frontend**: `/divisions/[slug]/page.tsx` (dynamic route)
- **Admin**: `/admin/dashboard/pages/divisions/[slug]` (editor)
- **API**: `/api/pages/divisions/[slug]/content`
- **Database**: MongoDB Division model with pageContent

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify MongoDB connection in `.env`
3. Ensure website is selected in admin
4. Run migration if divisions missing
