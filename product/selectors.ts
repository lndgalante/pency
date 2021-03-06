import shortid from "shortid";

import {DEFAULT_PRODUCT, DEFAULT_PRODUCT_VARIANT, DEFAULT_PRODUCT_OPTION} from "./constants";
import {Product, Variant} from "./types";

import {groupBy} from "~/selectors/group";

export function getVariantsString(options: Variant[]): string {
  if (!options?.length) return "";

  return options
    .map((option) => {
      const groups = groupBy(option.value, ({title}) => title);

      return `${option.title}: ${groups
        .map(([title, items]) => `${title}${items.length > 1 ? ` X${items.length}` : ``}`)
        .join(", ")}`;
    })
    .join(" - ");
}

export function getVariantsPrice(variants: Variant[]): number {
  if (!variants?.length) return 0;

  return variants?.reduce((total, option) => {
    if (!option.value?.length) return total;

    return total + option.value.reduce((total, option) => total + Number(option.price || 0), 0);
  }, 0);
}

export function getPrice(product: Product): number {
  const base = Number(product.price);

  return product.options?.length
    ? product.options.reduce((total, option) => {
        return total + option.value.reduce((total, option) => total + Number(option.price || 0), 0);
      }, base)
    : base;
}

export function serverToClient(product: any): Product {
  return {
    id: product.id,
    title: product.title || DEFAULT_PRODUCT.title,
    description: product.description,
    category: product.category,
    image: product.image,
    price: product.price || DEFAULT_PRODUCT.price,
    available: product.available || DEFAULT_PRODUCT.available,
    options: product.options?.length
      ? product.options.map((variant) => ({
          id: variant.id || shortid.generate(),
          title: variant.title || DEFAULT_PRODUCT_VARIANT.title,
          required: variant.required || DEFAULT_PRODUCT_VARIANT.required,
          value: variant.value || DEFAULT_PRODUCT_VARIANT.value,
          count: variant.count === undefined ? DEFAULT_PRODUCT_VARIANT.count : variant.count,
          options: variant.options?.length
            ? variant.options.map((option) => ({
                id: option.id || shortid.generate(),
                title: option.title || DEFAULT_PRODUCT_OPTION.title,
                price: option.price || DEFAULT_PRODUCT_OPTION.price,
              }))
            : [],
        }))
      : [],
    featured: product.featured || DEFAULT_PRODUCT.featured,
  };
}

export function clientToServer(product: any): Omit<Product, "id"> {
  return {
    title: product.title || DEFAULT_PRODUCT.title,
    description: product.description || DEFAULT_PRODUCT.description,
    category: product.category || DEFAULT_PRODUCT.category,
    image: product.image || DEFAULT_PRODUCT.image,
    price: product.price || DEFAULT_PRODUCT.price,
    available: product.available || DEFAULT_PRODUCT.available,
    options: product.options?.length
      ? product.options.map((variant) => ({
          id: variant.id || shortid.generate(),
          title: variant.title || DEFAULT_PRODUCT_VARIANT.title,
          required: variant.required || DEFAULT_PRODUCT_VARIANT.required,
          value: variant.value || DEFAULT_PRODUCT_VARIANT.value,
          count: variant.count === undefined ? DEFAULT_PRODUCT_VARIANT.count : variant.count,
          options: variant.options?.length
            ? variant.options.map((option) => ({
                id: option.id || shortid.generate(),
                title: option.title || DEFAULT_PRODUCT_OPTION.title,
                price: option.price || DEFAULT_PRODUCT_OPTION.price,
              }))
            : [],
        }))
      : [],
    featured: product.featured || DEFAULT_PRODUCT.featured,
  };
}
