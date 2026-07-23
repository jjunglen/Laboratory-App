// Helper function that extracts size, condition, and box status
const parseVariantTitle = (variantTitle, productHandle = "") => {
  const splitTitle = variantTitle.split(" - ").map((part) => part.trim());

  const size = splitTitle[0];
  const itemCondition = splitTitle[1] || null;
  const boxCondition = splitTitle[2] || "Original Box (Good)";

  // match condition to the ENUM value
  let condition = "either";
  if (itemCondition === "Brand New") condition = "brand_new";
  if (itemCondition === "Pre-Owned") condition = "pre_owned";

  // Fall back to product handle if variant title doesnt have condition
  if (condition === "either" && productHandle) {
    if (productHandle.startsWith("brand-new-")) condition = "brand_new";
    if (productHandle.startsWith("pre-owned-")) condition = "pre_owned";
    
  }

  return { size, condition, boxCondition };
};

module.exports = { parseVariantTitle };
