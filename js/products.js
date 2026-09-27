const PRODUCTS = [
  {
    id: "raw-100",
    name: "Raw Whipped Shea Butter",
    category: "raw",
    categoryLabel: "Raw",
    sizeMl: 100,
    price: 80,
    summary: "100% raw shea butter, sourced from Ghana.",
    image: "images/raw-100.png",
    alt: "Pale yellow raw shea butter in a glass bowl",
  },
  {
    id: "raw-260",
    name: "Raw Whipped Shea Butter",
    category: "raw",
    categoryLabel: "Raw",
    sizeMl: 260,
    price: 200,
    summary: "100% raw shea butter, sourced from Ghana.",
    image: "images/raw-260.png",
    alt: "A hand holding an open jar of pale whipped shea butter",
  },
  {
    id: "raw-500",
    name: "Raw Whipped Shea Butter",
    category: "raw",
    categoryLabel: "Raw",
    sizeMl: 500,
    price: 450,
    summary: "100% raw shea butter, sourced from Ghana.",
    image: "images/raw-500.png",
    alt: "Two tubs of whipped shea butter on a wooden table, one lid showing the S'Bani B label",
  },
  {
    id: "infused-100",
    name: "Infused Whipped Shea Butter",
    category: "infused",
    categoryLabel: "Infused",
    sizeMl: 100,
    price: 150,
    summary: "Raw shea butter whipped with coconut oil, avocado butter, and citrus essential oils.",
    image: "images/infused-100.png",
    alt: "An open tub of whipped shea butter beside closed S'Bani B tubs",
  },
  {
    id: "infused-260",
    name: "Infused Whipped Shea Butter",
    category: "infused",
    categoryLabel: "Infused",
    sizeMl: 260,
    price: 300,
    summary: "Raw shea butter whipped with coconut oil, avocado butter, and citrus essential oils.",
    image: "images/infused-260.png",
    alt: "A square jar of shea butter with a gold lid and the S'Bani B label",
  },
  {
    id: "infused-500",
    name: "Infused Whipped Shea Butter",
    category: "infused",
    categoryLabel: "Infused",
    sizeMl: 500,
    price: 650,
    summary: "Raw shea butter whipped with coconut oil, avocado butter, and citrus essential oils.",
    image: "images/infused-500.png",
    alt: "Two large tubs of whipped shea butter on a wooden table",
  },
];

function formatMoney(amount) {
  return "R" + Number(amount).toLocaleString("en-ZA");
}

function getProduct(id) {
  return PRODUCTS.find((product) => product.id === id);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
