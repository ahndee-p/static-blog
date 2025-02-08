# Modern CSS Features You Should Know

CSS has evolved significantly in recent years, introducing powerful features that make web development easier and more efficient. Let's explore some of the most exciting modern CSS features.

## CSS Grid

CSS Grid has revolutionized web layouts. It provides a two-dimensional grid system that makes complex layouts simple:

```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}
```

## CSS Custom Properties (Variables)

Variables in CSS make theming and maintenance much easier:

```css
:root {
    --primary-color: #6366f1;
    --text-color: #1a1a1a;
}

.button {
    background-color: var(--primary-color);
    color: var(--text-color);
}
```

## Container Queries

Container queries allow you to style elements based on their parent container's size, not just the viewport:

```css
.card {
    container-type: inline-size;
}

@container (min-width: 400px) {
    .card-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
    }
}
```

## Conclusion

These features are just the tip of the iceberg. Modern CSS is powerful, flexible, and more developer-friendly than ever. Stay tuned for more deep dives into each of these features! 