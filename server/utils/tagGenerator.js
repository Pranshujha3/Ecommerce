export const generateTags = (name, description) => {
    // Combine name and description, verify they exist to avoid errors
    const text = (name + " " + (description || "")).toLowerCase();
    const tags = new Set(); 

    // 1. Nutrient Mappings
    if (text.includes("orange") || text.includes("lemon") || text.includes("citrus")) {
        tags.add("vitamin c");
        tags.add("immunity");
    }
    if (text.includes("milk") || text.includes("curd") || text.includes("paneer") || text.includes("cheese") || text.includes("whey")) {
        tags.add("calcium");
        tags.add("protein");
        tags.add("dairy");
    }
    if (text.includes("chicken") || text.includes("egg") || text.includes("dal") || text.includes("pulse")) {
        tags.add("high protein");
        tags.add("muscle");
    }
    if (text.includes("spinach") || text.includes("green")) {
        tags.add("iron");
        tags.add("fiber");
    }
    if (text.includes("gym") || text.includes("workout")) {
        tags.add("energy");
    } 

    // 2. Return the array (Must be inside the function logic)
    return Array.from(tags);
};