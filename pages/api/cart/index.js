import { promises } from "fs";
import path from "path";
import getConfig from "next/config";
const {
  serverRuntimeConfig: { PROJECT_ROOT },
} = getConfig();

export default async function handler(req, res) {
  try {
    const items = JSON.parse(
      await promises.readFile(path.join(PROJECT_ROOT, "data/items.json"))
    );
    let cart = JSON.parse(
      await promises.readFile(path.join(PROJECT_ROOT, "data/cart.json"))
    );

    const saveData = () => {
      promises.writeFile(
        path.join(PROJECT_ROOT, "data/cart.json"),
        JSON.stringify(cart, null, "\t"),
        (err) => {
          if (err) throw new Error("Can't write file");
        }
      );
    };

    const addProduct = (id) => {
      if (!id) throw new Error("No id provided");
      const product = items.find((item) => item.id == id);
      if (!product) return;
      if (!cart.items_list[id]) {
        cart.items_list[id] = {
          ...product,
          quantity: 1,
          total_price: product.price,
        };
        cart.cart_value += product.price;
        cart.total_items += 1;
      } else {
        cart.items_list[id].quantity += 1;
        cart.items_list[id].total_price += product.price;
        cart.cart_value += product.price;
        cart.total_items += 1;
      }
      saveData();
    };

    const removeProduct = (id) => {
      if (!id) throw new Error("No id provided");
      if (!cart.items_list[id]) return;
      const product = items.find((item) => item.id == id);
      if (!product) return;
      cart.items_list[id].quantity -= 1;
      cart.items_list[id].total_price -= product.price;
      cart.cart_value -= product.price;
      cart.total_items -= 1;
      if (!cart.items_list[id].quantity) {
        delete cart.items_list[id];
      }
      saveData();
    };

    const resetCart = () => {
      cart = {
        cart_value: 0,
        total_items: 0,
        items_list: {},
      };
      saveData();
    };

    if (req.method === "POST") {
      const { operation, id } = req.body;
      switch (operation) {
        case "ADD":
          addProduct(id);
          break;
        case "REMOVE":
          removeProduct(id);
          break;
        case "REMOVE_ALL":
          resetCart();
          break;
        default:
          addProduct(id);
          break;
      }
    }
    res.status(200).json({ cart: cart });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: "Server error" });
  }
}
