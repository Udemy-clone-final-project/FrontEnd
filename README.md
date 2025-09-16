# Redbubble Clone Project

This project is a clone of the Redbubble website, implemented with two different approaches:
1.  **HTML/CSS/JS:** A pure, non-framework version of the project, focusing on semantic HTML and modern CSS practices. This version is located in the `HTML` folder.
2.  **Angular:** A more robust and scalable version built with the Angular framework. This version is located in the `RedBubble` folder.

## Project Structure

```
.
├── HTML/               # Pure HTML, CSS, and JS version
│   ├── CSS/
│   │   └── style.css
│   ├── JS/
│   │   └── script.js
│   └── index.html
│
├── RedBubble/          # Angular project
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   └── ...
│   ├── angular.json
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## Getting Started

### HTML Version (Non-Framework)

This version is intended as a temporary, lightweight demonstration. No special setup is required.

**To run:**

1.  Open the `HTML/index.html` file in your web browser.

### Angular Version

This is the main, feature-rich version of the project.

**Prerequisites:**

*   [Node.js](https://nodejs.org/) (which includes npm)
*   [Angular CLI](https://angular.io/cli)

**To run:**

1.  Navigate to the `RedBubble` directory:
    ```bash
    cd RedBubble
    ```
2.  Install the required dependencies:
    ```bash
    pnpm install
    ```
3.  Start the development server:
    ```bash
    pnpm start
    ```
4.  Open your browser and navigate to `http://localhost:4200/`.

---
### Mock Catalog API (serve:catalog)

This project uses a local mock REST API powered by `json-server` for the catalog data.

**Script**: `pnpm run serve:catalog`

**Base URL**: `http://localhost:3001`

**How to run (in a separate terminal):**
```bash
cd RedBubble
pnpm run serve:catalog
```

The server watches `db.catalog.json` for changes and hot-reloads.

**Available routes (examples):**
- `GET /products`
- `GET /products/:id`
- `GET /products?slug=uss-enterprise-star-trek-classic-t-shirt`
- `GET /categories`
- `GET /related?productId=2527`

**Useful query params (json-server):**
- Full-text search: `q=spaceship`
- Filter by field: `style=Classic%20T-Shirt`
- Partial match: `tags_like=space`
- Sort: `_sort=price&_order=asc`
- Pagination: `_page=1&_limit=12`

**Used by the app:**
- `src/app/Services/product.service.ts` calls `http://localhost:3001/products...` for product-by-id, slug lookup, and related products.

Note: Run this alongside the Angular dev server (`pnpm start`). To change the port temporarily:
```bash
pnpm run serve:catalog -- --port 4000
```

---

## Best Practices

### HTML (Semantic)

*   **Use Semantic Tags:** Employ tags like `<header>`, `<footer>`, `<main>`, `<section>`, `<nav>`, and `<article>` to give meaning to your content. This improves accessibility and SEO.
*   **Maintain a Clean Structure:** Keep your HTML organized and readable. Use proper indentation and nest elements correctly.
*   **Mobile-First Design:** Design for mobile devices first, then use media queries to adapt the layout for larger screens.
*   **Descriptive Class Names:** Use clear and descriptive class names that reflect the content or function of the element (e.g., `.product-card`, `.featured-products-carousel`).
*   **Accessibility (a11y):** Ensure your site is accessible to all users. Use `alt` attributes for images, ARIA roles where necessary, and maintain a logical tab order.

### Angular

*   **Component-Based Architecture:** Break down your UI into small, reusable components. This makes your codebase easier to manage and scale.
*   **Lazy Loading:** Use lazy loading for feature modules to improve the initial load time of your application.
*   **State Management:** For complex applications, consider using a state management library like NgRx or Akita to manage application state in a predictable way.
*   **Reactive Forms:** Use Angular's Reactive Forms for complex forms with validation and dynamic controls.
*   **TypeScript Best Practices:**
    *   Use strong typing to catch errors at compile time.
    *   Use interfaces to define data structures.
    *   Avoid using the `any` type whenever possible.
*   **Follow the Angular Style Guide:** Adhere to the official [Angular Style Guide](https://angular.io/guide/styleguide) for consistent and maintainable code.
