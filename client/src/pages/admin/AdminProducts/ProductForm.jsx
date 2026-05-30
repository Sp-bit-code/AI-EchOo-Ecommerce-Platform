// import React from "react";

// import "./ProductForm.css";

// const ProductForm = ({
//   form,
//   setForm,
//   tempState,
//   setTempState,
//   handlers,
// }) => {
//   const productCategories = [
//     "Smartphone",
//     "Laptop",
//     "Tablet",
//     "Accessory",
//     "Wearables",
//     "Gaming",
//     "Audio",
//     "Smart Home",
//     "Camera",
//     "Other",
//   ];

//   const fallbackImage =
//     'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="%23e5e7eb"%3E%3Crect width="300" height="300" rx="8"/%3E%3C/svg%3E';

//   const safeImages = Array.isArray(form?.images) ? form.images : [];
//   const safeSpecs = form?.specs || {};
//   const safeVariants = form?.variants || {};
//   const safeFeatures = Array.isArray(form?.features) ? form.features : [];

//   const updateForm = (key, value) => {
//     setForm({
//       ...form,
//       [key]: value,
//     });
//   };

//   const handleFeatureKeyDown = (event) => {
//     if (event.key !== "Enter") return;

//     event.preventDefault();

//     const value = event.target.value.trim();

//     if (!value) return;

//     handlers.onAddFeature(value);
//     event.target.value = "";
//   };

//   return (
//     <div className="space-y-6">
//       {/* Basic Information */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Product Name *
//           </label>

//           <input
//             type="text"
//             value={form.name || ""}
//             onChange={(event) => updateForm("name", event.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Brand *
//           </label>

//           <input
//             type="text"
//             value={form.brand || ""}
//             onChange={(event) => updateForm("brand", event.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Category *
//           </label>

//           <select
//             value={form.category || "Smartphone"}
//             onChange={(event) => updateForm("category", event.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
//           >
//             {productCategories.map((category) => (
//               <option key={category} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Status
//           </label>

//           <select
//             value={form.status || "active"}
//             onChange={(event) => updateForm("status", event.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
//           >
//             <option value="new">New</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//             <option value="coming-soon">Coming Soon</option>
//             <option value="out-of-stock">Out of Stock</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Price ({form.currency || "INR"}) *
//           </label>

//           <input
//             type="number"
//             value={form.price || 0}
//             onChange={(event) => updateForm("price", event.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
//             min="0"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Currency
//           </label>

//           <select
//             value={form.currency || "INR"}
//             onChange={(event) => updateForm("currency", event.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
//           >
//             <option value="INR">INR</option>
//             <option value="USD">USD</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Stock *
//           </label>

//           <input
//             type="number"
//             value={form.stock || 0}
//             onChange={(event) => updateForm("stock", event.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
//             min="0"
//             required
//           />
//         </div>
//       </div>

//       {/* Short Description */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Short Description
//         </label>

//         <textarea
//           value={form.shortDescription || ""}
//           onChange={(event) =>
//             updateForm("shortDescription", event.target.value)
//           }
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
//           rows="2"
//           placeholder="Brief description of the product..."
//         />
//       </div>

//       {/* Images Section */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Product Images
//         </label>

//         <div className="flex flex-wrap gap-2 mb-3">
//           {safeImages.map((image, index) => (
//             <div key={index} className="relative">
//               <img
//                 src={image || fallbackImage}
//                 alt={`Product ${index + 1}`}
//                 className="h-20 w-20 rounded-lg object-cover border"
//                 onError={(event) => {
//                   event.target.onerror = null;
//                   event.target.src = fallbackImage;
//                 }}
//               />

//               <button
//                 type="button"
//                 onClick={() => handlers.onRemoveImage(index)}
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>

//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={tempState.imageUrl || ""}
//             onChange={(event) => setTempState.setImageUrl(event.target.value)}
//             placeholder="Paste image URL here"
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
//             onKeyDown={(event) => {
//               if (event.key === "Enter") {
//                 event.preventDefault();
//                 handlers.onAddImage();
//               }
//             }}
//           />

//           <button
//             type="button"
//             onClick={handlers.onAddImage}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//           >
//             Add Image
//           </button>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Features
//         </label>

//         <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
//           {safeFeatures.map((feature, index) => (
//             <div
//               key={index}
//               className="flex items-center justify-between bg-gray-50 p-2 rounded"
//             >
//               <span>{feature}</span>

//               <button
//                 type="button"
//                 onClick={() => handlers.onRemoveFeature(index)}
//                 className="text-red-500 hover:text-red-700 ml-2"
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>

//         <input
//           type="text"
//           placeholder="Type feature and press Enter"
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//           onKeyDown={handleFeatureKeyDown}
//         />
//       </div>

//       {/* Specifications Section */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Specifications (Key-Value Pairs)
//         </label>

//         <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
//           {Object.entries(safeSpecs).map(([key, value], index) => (
//             <div
//               key={index}
//               className="flex items-center justify-between bg-gray-50 p-2 rounded"
//             >
//               <div className="flex-1">
//                 <span className="font-medium">{key}:</span>
//                 <span className="ml-2">{String(value)}</span>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => handlers.onRemoveSpec(key)}
//                 className="text-red-500 hover:text-red-700 ml-2"
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-2 gap-2 mb-2">
//           <input
//             type="text"
//             value={tempState.specKey || ""}
//             onChange={(event) => setTempState.setSpecKey(event.target.value)}
//             placeholder="Specification key"
//             className="px-3 py-2 border border-gray-300 rounded-lg"
//           />

//           <input
//             type="text"
//             value={tempState.specValue || ""}
//             onChange={(event) => setTempState.setSpecValue(event.target.value)}
//             placeholder="Specification value"
//             className="px-3 py-2 border border-gray-300 rounded-lg"
//           />
//         </div>

//         <button
//           type="button"
//           onClick={handlers.onAddSpec}
//           className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//         >
//           Add Specification
//         </button>
//       </div>

//       {/* Variants Section */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Variants
//         </label>

//         <div className="space-y-3 mb-3 max-h-40 overflow-y-auto">
//           {Object.entries(safeVariants).map(([variantType, variantValues]) => {
//             const values = Array.isArray(variantValues) ? variantValues : [];

//             return (
//               <div key={variantType} className="bg-gray-50 p-3 rounded">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="font-medium capitalize">
//                     {variantType}
//                   </span>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       const currentVariants = {
//                         ...(form.variants || {}),
//                       };

//                       delete currentVariants[variantType];

//                       setForm({
//                         ...form,
//                         variants: currentVariants,
//                       });
//                     }}
//                     className="text-red-500 hover:text-red-700 text-sm"
//                   >
//                     Remove All
//                   </button>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                   {values.map((value, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center bg-white px-2 py-1 rounded border"
//                     >
//                       <span>{value}</span>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           handlers.onRemoveVariant(variantType, index)
//                         }
//                         className="text-red-500 hover:text-red-700 ml-1"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div className="flex gap-2">
//           <select
//             value={tempState.variantKey || ""}
//             onChange={(event) =>
//               setTempState.setVariantKey(event.target.value)
//             }
//             className="px-3 py-2 border border-gray-300 rounded-lg"
//           >
//             <option value="">Select variant type</option>
//             <option value="storage">Storage</option>
//             <option value="ram">RAM</option>
//             <option value="colors">Colors</option>
//             <option value="sizes">Sizes</option>
//             <option value="models">Models</option>
//           </select>

//           <input
//             type="text"
//             value={tempState.variantValue || ""}
//             onChange={(event) =>
//               setTempState.setVariantValue(event.target.value)
//             }
//             placeholder="Variant value"
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
//             onKeyDown={(event) => {
//               if (event.key === "Enter" && tempState.variantKey) {
//                 event.preventDefault();
//                 handlers.onAddVariant(tempState.variantKey);
//               }
//             }}
//           />

//           <button
//             type="button"
//             onClick={() => {
//               if (tempState.variantKey) {
//                 handlers.onAddVariant(tempState.variantKey);
//               }
//             }}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//           >
//             Add Variant
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;


import React from "react";

import "./ProductForm.css";

const ProductForm = ({
  form,
  setForm,
  tempState,
  setTempState,
  handlers,
}) => {
  const productCategories = [
    "Smartphone",
    "Laptop",
    "Tablet",
    "Accessory",
    "Wearables",
    "Gaming",
    "Audio",
    "Smart Home",
    "Camera",
    "Other",
  ];

  const fallbackImage =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="%23e5e7eb"%3E%3Crect width="300" height="300" rx="8"/%3E%3C/svg%3E';

  const safeImages = Array.isArray(form?.images) ? form.images : [];
  const safeSpecs = form?.specs || {};
  const safeVariants = form?.variants || {};
  const safeFeatures = Array.isArray(form?.features) ? form.features : [];

  const updateForm = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const handleFeatureKeyDown = (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const value = event.target.value.trim();

    if (!value) return;

    handlers.onAddFeature(value);
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>

          <input
            type="text"
            value={form.name || ""}
            onChange={(event) => updateForm("name", event.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand *
          </label>

          <input
            type="text"
            value={form.brand || ""}
            onChange={(event) => updateForm("brand", event.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>

          <select
            value={form.category || "Smartphone"}
            onChange={(event) => updateForm("category", event.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          >
            {productCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>

          <select
            value={form.status || "active"}
            onChange={(event) => updateForm("status", event.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          >
            <option value="new">New</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="coming-soon">Coming Soon</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (INR) *
          </label>

          <input
            type="number"
            value={form.price || 0}
            onChange={(event) => updateForm("price", event.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock *
          </label>

          <input
            type="number"
            value={form.stock || 0}
            onChange={(event) => updateForm("stock", event.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            min="0"
            required
          />
        </div>
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Short Description
        </label>

        <textarea
          value={form.shortDescription || ""}
          onChange={(event) =>
            updateForm("shortDescription", event.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          rows="2"
          placeholder="Brief description of the product..."
        />
      </div>

      {/* Images Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images
        </label>

        <div className="flex flex-wrap gap-2 mb-3">
          {safeImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image || fallbackImage}
                alt={`Product ${index + 1}`}
                className="h-20 w-20 rounded-lg object-cover border"
                onError={(event) => {
                  event.target.onerror = null;
                  event.target.src = fallbackImage;
                }}
              />

              <button
                type="button"
                onClick={() => handlers.onRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={tempState.imageUrl || ""}
            onChange={(event) => setTempState.setImageUrl(event.target.value)}
            placeholder="Paste image URL here"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handlers.onAddImage();
              }
            }}
          />

          <button
            type="button"
            onClick={handlers.onAddImage}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Add Image
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features
        </label>

        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
          {safeFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <span>{feature}</span>

              <button
                type="button"
                onClick={() => handlers.onRemoveFeature(index)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="Type feature and press Enter"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          onKeyDown={handleFeatureKeyDown}
        />
      </div>

      {/* Specifications Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specifications (Key-Value Pairs)
        </label>

        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
          {Object.entries(safeSpecs).map(([key, value], index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <div className="flex-1">
                <span className="font-medium">{key}:</span>
                <span className="ml-2">{String(value)}</span>
              </div>

              <button
                type="button"
                onClick={() => handlers.onRemoveSpec(key)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            type="text"
            value={tempState.specKey || ""}
            onChange={(event) => setTempState.setSpecKey(event.target.value)}
            placeholder="Specification key"
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            value={tempState.specValue || ""}
            onChange={(event) => setTempState.setSpecValue(event.target.value)}
            placeholder="Specification value"
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="button"
          onClick={handlers.onAddSpec}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Add Specification
        </button>
      </div>

      {/* Variants Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Variants
        </label>

        <div className="space-y-3 mb-3 max-h-40 overflow-y-auto">
          {Object.entries(safeVariants).map(([variantType, variantValues]) => {
            const values = Array.isArray(variantValues) ? variantValues : [];

            return (
              <div key={variantType} className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium capitalize">
                    {variantType}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const currentVariants = {
                        ...(form.variants || {}),
                      };

                      delete currentVariants[variantType];

                      setForm({
                        ...form,
                        variants: currentVariants,
                      });
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove All
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {values.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-white px-2 py-1 rounded border"
                    >
                      <span>{value}</span>

                      <button
                        type="button"
                        onClick={() =>
                          handlers.onRemoveVariant(variantType, index)
                        }
                        className="text-red-500 hover:text-red-700 ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <select
            value={tempState.variantKey || ""}
            onChange={(event) =>
              setTempState.setVariantKey(event.target.value)
            }
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select variant type</option>
            <option value="storage">Storage</option>
            <option value="ram">RAM</option>
            <option value="colors">Colors</option>
            <option value="sizes">Sizes</option>
            <option value="models">Models</option>
          </select>

          <input
            type="text"
            value={tempState.variantValue || ""}
            onChange={(event) =>
              setTempState.setVariantValue(event.target.value)
            }
            placeholder="Variant value"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            onKeyDown={(event) => {
              if (event.key === "Enter" && tempState.variantKey) {
                event.preventDefault();
                handlers.onAddVariant(tempState.variantKey);
              }
            }}
          />

          <button
            type="button"
            onClick={() => {
              if (tempState.variantKey) {
                handlers.onAddVariant(tempState.variantKey);
              }
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Add Variant
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;