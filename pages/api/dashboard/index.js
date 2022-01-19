import { promises } from "fs";
import path from "path";
import getConfig from "next/config";
const {
  serverRuntimeConfig: { PROJECT_ROOT },
} = getConfig();

export default async function handler(req, res) {
  try {
    const { search_string } = req.query;
    let items = JSON.parse(
      await promises.readFile(path.join(PROJECT_ROOT, "data/items.json"))
    );
    const cart = JSON.parse(
      await promises.readFile(path.join(PROJECT_ROOT, "data/cart.json"))
    );

    if (search_string) {
      items = items.filter((item) =>
        item.title.toLowerCase().includes(search_string.toLowerCase())
      );
    }

    res.status(200).json({ items: items, cart: cart });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: "Server error" });
  }
}
