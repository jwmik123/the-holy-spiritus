import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

let wooCommerceApi: WooCommerceRestApi | null = null;

export function getWooCommerceClient() {
  if (!wooCommerceApi) {
    wooCommerceApi = new WooCommerceRestApi({
      url: process.env.NEXT_PUBLIC_WORDPRESS_URL!,
      consumerKey: process.env.WC_CONSUMER_KEY!,
      consumerSecret: process.env.WC_CONSUMER_SECRET!,
      version: "wc/v3",
    });
  }
  return wooCommerceApi;
}
