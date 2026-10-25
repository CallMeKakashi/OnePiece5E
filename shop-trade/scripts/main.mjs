import { initShop, readyShop } from "./shop.mjs";
Hooks.once("init", initShop);
Hooks.once("ready", readyShop);
