import ProductHeader from "../ProductHeader/ProductHeader";
import VariantSelector from "../VariantSelector/VariantSelector";
import ProductActions from "../ProductActions/ProductActions";
import ProductFeatures from "../ProductFeatures/ProductFeatures";
import ProductSpecs from "../ProductSpecs/ProductSpecs";
import "./ProductInfo.css";

const ProductInfo = ({ product, selectedOptions, quantity, onOptionChange, onQuantityChange }) => {
  return (
    <div className="lg:w-1/2">
      <div className="sticky top-8">
        <ProductHeader product={product} />
        
        {/* Variant Selectors */}
        {/* {product.variants?.colors && product.variants.colors.length > 0 && (
          <VariantSelector
            type="color"
            label="Color"
            options={product.variants.colors}
            selectedValue={selectedOptions.color}
            onSelect={(value) => onOptionChange('color', value)}
          />
        )} */}

        {product.variants?.storage && product.variants.storage.length > 0 && (
          <VariantSelector
            type="storage"
            label="Storage"
            options={product.variants.storage}
            selectedValue={selectedOptions.storage}
            onSelect={(value) => onOptionChange('storage', value)}
          />
        )}

        {product.variants?.ram && product.variants.ram.length > 0 && (
          <VariantSelector
            type="ram"
            label="RAM"
            options={product.variants.ram}
            selectedValue={selectedOptions.ram}
            onSelect={(value) => onOptionChange('ram', value)}
          />
        )}

        <ProductActions 
          product={product}
          selectedOptions={selectedOptions}
          quantity={quantity}
          onQuantityChange={onQuantityChange}
        />

        <ProductFeatures features={product.features} />
        <ProductSpecs specs={product.specs} />
      </div>
    </div>
  );
};

export default ProductInfo;