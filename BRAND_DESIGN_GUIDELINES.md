# College ERP - Brand Design Guidelines

This is the official design system documentation for the College ERP platform. All modules must follow these guidelines to ensure visual consistency across the application.

**Last Updated:** January 18, 2026

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Page Layout Structure](#page-layout-structure)
3. [Typography System](#typography-system)
4. [Spacing System](#spacing-system)
5. [Color System](#color-system)
6. [Component Library](#component-library)
7. [Icon System](#icon-system)
8. [Button System](#button-system)
9. [Form Elements](#form-elements)
10. [Table System](#table-system)
11. [Card System](#card-system)
12. [Empty States](#empty-states)
13. [Loading States](#loading-states)
14. [Responsive Design](#responsive-design)
15. [Module-Specific Patterns](#module-specific-patterns)
16. [Migration Checklist](#migration-checklist)

---

## Design Philosophy

### Core Principles

1. **Compact & Efficient**: Maximize content visibility with minimal chrome. Every pixel matters.
2. **Consistency**: Same patterns across all modules for familiar, learnable UX.
3. **Light Theme Only**: Clean white backgrounds with subtle blue/slate gradients. NO dark headers.
4. **Information Dense**: Show more data with less scrolling.
5. **Professional**: Clean, corporate aesthetic suitable for educational institutions.

### Visual Language

- **Rounded Corners**: `rounded-lg` (8px) for cards, `rounded-md` (6px) for buttons, `rounded-full` for avatars
- **Shadows**: Subtle `shadow-sm` for depth, `shadow-md` for elevated elements
- **Borders**: Light `border-slate-200` for structure
- **Transitions**: Smooth `transition-all` for interactive states

---

## Page Layout Structure

### Background Container (MANDATORY)
```jsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
```

### Page Header (Compact Hero)
```jsx
<div className="relative overflow-hidden bg-white border-b border-slate-200">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white to-slate-50/50"></div>
  <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 relative">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <div className="flex items-center gap-3">
        {/* Optional back button */}
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        {/* Icon chip */}
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md shadow-blue-500/20">
          <Icon className="h-5 w-5 text-white" />
        </div>
        {/* Title block */}
        <div>
          <h1 className="text-lg lg:text-xl font-bold tracking-tight text-slate-900">Page Title</h1>
          <p className="text-slate-500 text-xs">Brief description of the page</p>
        </div>
      </div>
      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Icon className="h-3.5 w-3.5 mr-1.5" />Action
        </Button>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5 mr-1.5" />Create
        </Button>
      </div>
    </div>
  </div>
</div>
```

### Content Container
```jsx
<div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
  {/* Page content */}
</div>
```

---

## Typography System

### Scale Reference

| Element | Classes | Usage |
|---------|---------|-------|
| **Page Title** | `text-lg lg:text-xl font-bold tracking-tight text-slate-900` | Main page heading |
| **Page Description** | `text-xs text-slate-500` | Subtitle under page title |
| **Section Title** | `text-base font-semibold text-slate-900` | Major section headers |
| **Section Description** | `text-xs text-slate-500` | Section subtitles |
| **Card Title** | `text-base font-semibold` | Card headers |
| **Card Description** | `text-xs text-slate-500` | Card subtitles |
| **Metric Value** | `text-xl font-bold` | Dashboard numbers |
| **Metric Label** | `text-xs text-slate-500` | Dashboard labels |
| **Table Header** | `text-xs font-medium text-slate-500 uppercase tracking-wide` | Column headers |
| **Table Cell** | `text-sm text-slate-600` | Table data |
| **Table Link** | `text-sm text-blue-600 hover:text-blue-800 font-medium` | Clickable table data |
| **Form Label** | `text-xs font-medium text-slate-600` | Input labels |
| **Helper Text** | `text-xs text-slate-500` | Form help text |
| **Body Text** | `text-sm text-slate-600` | General content |
| **Muted Text** | `text-xs text-slate-400` | Secondary information |
| **Empty State Title** | `text-sm font-medium text-slate-500` | No data headers |
| **Empty State Desc** | `text-xs text-slate-400` | No data details |

---

## Spacing System

### Standard Measurements

| Context | Value | Notes |
|---------|-------|-------|
| **Page Header** | `py-3 px-4 lg:px-6` | Compact header |
| **Content Area** | `py-4 px-4 lg:px-6` | Main content |
| **Card Header** | `py-3 px-4` | Card top section |
| **Card Content** | `px-4 pb-4` or `px-4 py-4` | Card body |
| **Grid Gaps** | `gap-3` (compact) / `gap-4` (standard) | Between grid items |
| **Element Gaps** | `gap-2` (tight) / `gap-3` (standard) | Between elements |
| **Section Margin** | `mb-3` (compact) / `mb-4` (standard) | Between sections |
| **List Spacing** | `space-y-2` or `space-y-3` | Vertical lists |

### Container Widths

| Container | Class |
|-----------|-------|
| Max content width | `max-w-7xl` |
| Narrow content | `max-w-4xl` |
| Form dialogs | `max-w-md` or `max-w-lg` |

---

## Color System

### Primary Brand Colors

```css
/* Primary Blue Gradient (Page Icons) */
bg-gradient-to-br from-blue-500 to-blue-600
shadow-md shadow-blue-500/20

/* Primary Button */
bg-blue-600 hover:bg-blue-700 text-white

/* Primary Link */
text-blue-600 hover:text-blue-800
```

### Status Colors

| Status | Text | Background | Border | Usage |
|--------|------|------------|--------|-------|
| **Success/Active** | `text-emerald-600` | `bg-emerald-50` | `border-emerald-200` | Active states, success messages |
| **Info** | `text-blue-600` | `bg-blue-50` | `border-blue-200` | Information, links |
| **Warning** | `text-amber-600` | `bg-amber-50` | `border-amber-200` | Warnings, pending |
| **Error/Danger** | `text-red-600` | `bg-red-50` | `border-red-200` | Errors, delete actions |
| **Neutral** | `text-slate-600` | `bg-slate-50` | `border-slate-200` | Default, disabled |
| **Purple** | `text-purple-600` | `bg-purple-50` | `border-purple-200` | **Primary Navigation**, Mega Menu, Academic Roles |

### Text Colors

| Purpose | Class |
|---------|-------|
| Headings | `text-slate-900` |
| Body text | `text-slate-600` |
| Descriptions | `text-slate-500` |
| Muted/Disabled | `text-slate-400` |
| Links | `text-blue-600 hover:text-blue-800` |

### Background Colors

| Purpose | Class |
|---------|-------|
| Page background | `bg-gradient-to-br from-slate-50 via-white to-blue-50/30` |
| Card background | `bg-white` |
| Table header | `bg-slate-50` |
| Hover state | `hover:bg-blue-50/50` |
| Selected state | `bg-blue-50 border-blue-200` |

---

## Component Library

### Section Headers (Form Sections)

```jsx
<div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
    {sectionNumber}
  </div>
  <div>
    <h3 className="text-sm font-semibold text-slate-800">{sectionName}</h3>
    {description && <p className="text-xs text-slate-500">{description}</p>}
  </div>
</div>
```

### Stats/Metric Cards

```jsx
<Card className="shadow-sm border-slate-200">
  <CardContent className="py-3 px-4">
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-blue-100 rounded-md">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>
      <div>
        <p className="text-xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  </CardContent>
</Card>
```

Grid: `grid grid-cols-3 gap-3`

### Navigation/Action Cards

```jsx
<Card className="cursor-pointer transition-all hover:shadow-md border-slate-200">
  <CardContent className="py-3 px-4">
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-blue-50">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
    </div>
  </CardContent>
</Card>
```

---

## Icon System

### Size Reference

| Context | Icon Size | Container |
|---------|-----------|-----------|
| **Page header** | `h-5 w-5` | `p-2` container |
| **Card icons** | `h-5 w-5` | `p-2` container |
| **Stats icons** | `h-4 w-4` | `p-1.5` container |
| **Button icons** | `h-3.5 w-3.5` | `mr-1.5` spacing |
| **Section numbers** | `text-xs font-bold` | `w-6 h-6` circle |
| **Inline icons** | `h-4 w-4` | No container |
| **Action buttons** | `h-3.5 w-3.5` | `h-7 w-7` button |
| **Navigation back** | `h-4 w-4` | `h-8 w-8` button |

### Icon Library

Use **Lucide React** exclusively for all icons.

---

## Button System

### Sizes

| Size | Usage |
|------|-------|
| `size="sm"` | Default for action buttons |
| `size="icon" className="h-8 w-8"` | Navigation (back) buttons |
| `size="icon" className="h-7 w-7"` | Table action buttons |
| `size="icon" className="h-6 w-6"` | Compact inline actions |

### Variants

| Purpose | Classes |
|---------|---------|
| **Primary** | `bg-blue-600 hover:bg-blue-700 text-white` |
| **Secondary** | `variant="outline" size="sm"` |
| **Ghost** | `variant="ghost" size="sm"` |
| **Danger** | `variant="destructive" size="sm"` |
| **Navigation** | `variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 h-8 w-8"` |

### Button with Icon

```jsx
<Button variant="outline" size="sm">
  <Icon className="h-3.5 w-3.5 mr-1.5" />
  Label
</Button>
```

---

## Form Elements

### Form Labels

```jsx
<Label className="text-xs font-medium text-slate-600">
  Field Label {required && <span className="text-red-500">*</span>}
</Label>
```

### Form Field Container

```jsx
<div className="space-y-1.5">
  <Label>...</Label>
  <Input />
  {helpText && <p className="text-xs text-slate-500">{helpText}</p>}
</div>
```

### Form Grid

```jsx
{/* Filter grids */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">

{/* Form fields */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## Table System

### Table Container

```jsx
<div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
```

### Table Header

```jsx
<thead>
  <tr className="bg-slate-50 border-b border-slate-200">
    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
      Column
    </th>
  </tr>
</thead>
```

### Table Body

```jsx
<tbody className="divide-y divide-slate-100">
  <tr className="hover:bg-blue-50/50 transition-colors">
    <td className="px-3 py-2 text-sm text-slate-600">
      {value}
    </td>
  </tr>
</tbody>
```

### Table Action Buttons

```jsx
<td className="px-3 py-2 text-right">
  <div className="flex items-center justify-end gap-1">
    <Button variant="ghost" size="icon" className="h-7 w-7">
      <Icon className="h-3.5 w-3.5" />
    </Button>
  </div>
</td>
```

---

## Card System

### Standard Card

```jsx
<Card className="shadow-sm border-slate-200">
  <CardHeader className="py-3 px-4">
    <CardTitle className="flex items-center gap-2 text-base">
      <Icon className="h-4 w-4" />
      {title}
    </CardTitle>
    <CardDescription className="text-xs">{description}</CardDescription>
  </CardHeader>
  <CardContent className="px-4 pb-4">
    {/* Content */}
  </CardContent>
</Card>
```

### Card with Colored Header

```jsx
<Card className="shadow-sm border-slate-200 overflow-hidden">
  <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-4 py-3 border-b border-slate-200">
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-blue-500 rounded-lg">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
    </div>
  </div>
  <CardContent className="px-4 py-4">
    {/* Content */}
  </CardContent>
</Card>
```

---

## Empty States

### Standard Empty State

```jsx
<div className="text-center py-10">
  <Icon className="h-10 w-10 mx-auto text-slate-300 mb-3" />
  <p className="text-sm font-medium text-slate-500">No data found</p>
  <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
  <Button size="sm" className="mt-4">
    <Plus className="h-3.5 w-3.5 mr-1.5" />
    Add New
  </Button>
</div>
```

### Compact Empty State (Tables)

```jsx
<tr>
  <td colSpan={columns.length} className="text-center py-8">
    <Icon className="h-6 w-6 mx-auto text-slate-300" />
    <p className="mt-2 text-slate-500 text-sm">No results</p>
  </td>
</tr>
```

---

## Loading States

### Full Page Loading

```jsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
  <div className="text-center">
    <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-3" />
    <p className="text-sm text-slate-600">Loading...</p>
  </div>
</div>
```

### Inline Loading

```jsx
<div className="flex items-center justify-center py-10">
  <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
</div>
```

---

## Responsive Design

### Breakpoint Reference

| Breakpoint | Width | Common Columns |
|------------|-------|----------------|
| Default | < 768px | 1-2 columns |
| `md` | 768px+ | 2-3 columns |
| `lg` | 1024px+ | 3-4 columns |
| `xl` | 1280px+ | 4-6 columns |

### Common Patterns

```jsx
{/* Stats grid */}
grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3

{/* Card grid */}
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3

{/* Filter grid */}
grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3

{/* Form fields */}
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
```

---

## Module-Specific Patterns

### Form Builder (Draggable Sections/Fields)

**Section Header:**
```jsx
<div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-200 bg-slate-50/50">
  <GripVertical className="h-3.5 w-3.5 text-slate-400" />
  <button className="p-1 hover:bg-slate-200 rounded">
    {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
  </button>
  <span className="text-sm font-semibold text-slate-800">{name}</span>
  <Badge className="text-xs">{fields.length} fields</Badge>
</div>
```

**Field Row:**
```jsx
<div className="flex items-center gap-1.5 px-2 py-1.5 bg-white border border-slate-200 rounded-md">
  <GripVertical className="h-3.5 w-3.5 text-slate-400" />
  <div className="w-6 h-6 rounded-md border flex items-center justify-center">
    <TypeIcon className="h-3.5 w-3.5" />
  </div>
  <span className="text-sm font-medium text-slate-800">{label}</span>
  <Badge className="text-xs">{type}</Badge>
  <div className="ml-auto flex items-center gap-1">
    <Button variant="ghost" size="icon" className="h-6 w-6">
      <Settings className="h-3 w-3" />
    </Button>
  </div>
</div>
```

### Student/Staff View (Read-only Data Display)

**Photo Grid:**
```jsx
<div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
  <div className="text-center">
    <img className="w-20 h-20 rounded-lg object-cover mx-auto shadow-sm ring-2 ring-blue-200" />
    <p className="text-xs text-slate-600 mt-1.5 font-medium">Label</p>
  </div>
</div>
```

**Field Display:**
```jsx
<div className="group">
  <dt className="text-xs font-medium text-slate-500 mb-0.5">{label}</dt>
  <dd className="text-sm font-medium text-slate-900">{value || '-'}</dd>
</div>
```

---

## Migration Checklist

When updating existing pages:

### Page Structure
- [ ] Background: `min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30`
- [ ] Header: `py-3 px-4 lg:px-6` (NOT `py-8`, `p-6`)
- [ ] Content: `py-4 px-4 lg:px-6` (NOT `py-8`, `p-8`)

### Typography
- [ ] Page title: `text-lg lg:text-xl` (NOT `text-2xl`, `text-3xl`)
- [ ] Page description: `text-xs` (NOT `text-sm`, `text-base`)
- [ ] Section titles: `text-base font-semibold` (NOT `text-lg`, `text-xl`)
- [ ] Card descriptions: `text-xs` (NOT `text-sm`)

### Components
- [ ] Card headers: `py-3 px-4` (NOT `p-6`)
- [ ] Card content: `px-4 pb-4` (NOT `pt-6`, `p-6`)
- [ ] Stats values: `text-xl` (NOT `text-2xl`, `text-3xl`)
- [ ] Form labels: `text-xs font-medium` (NOT `text-sm`)

### Icons & Buttons
- [ ] Page icon: `h-5 w-5` in `p-2` container (NOT `h-8 w-8`, `p-3`)
- [ ] Button icons: `h-3.5 w-3.5 mr-1.5` (NOT `h-4 w-4 mr-2`)
- [ ] Action buttons: `size="sm"` (NOT default size)
- [ ] Table action buttons: `h-7 w-7` (NOT `h-8 w-8`)

### Spacing
- [ ] Grid gaps: `gap-3` or `gap-4` (NOT `gap-6`)
- [ ] Section margins: `mb-3` or `mb-4` (NOT `mb-6`, `mb-8`)
- [ ] Card shadows: `shadow-sm` (NOT `shadow-lg`)

---

## DO's and DON'Ts

### DO
- Use `size="sm"` for most buttons
- Keep headers compact with `py-3`
- Use `text-xs` for descriptions and metadata
- Use consistent `gap-3` spacing
- Apply `shadow-sm` for subtle card depth
- Use slate color palette for neutrals
- Add hover states for interactive elements

### DON'T
- Use large headers (`py-8`, `text-3xl`)
- Use `p-6` or `pt-6` for card content
- Mix icon sizes randomly
- Use heavy shadows (`shadow-lg`, `shadow-xl`)
- Add unnecessary vertical spacing
- Use dark backgrounds in headers
- Create inconsistent button sizes

---

## File References

- **Main Guidelines (this file)**: `docs/BRAND_DESIGN_GUIDELINES.md`
- **SIS Module Specific**: `docs/ui/brand-guidelines-sis.md`
- **Replit Config**: `replit.md` (contains quick reference in User Preferences)

---

*This document is the single source of truth for design decisions. All new pages and components must follow these guidelines.*
