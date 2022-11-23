
export const seed = ["Broccoli", "Kale", "Wheat", "Turnip", "Garlic", "Carrot", "Peas", "Radish", "Cauliflower", "Watermelon", "Pumpkin", "Cabbage", "Potato", "Tomato", "Beetroot", "Onion", "Strawberry", "Blueberry", "Raspberry", "Bell Pepper", "Corn", "Dill", "Rosemary", "Oregano", "Basil", "Thyme", "Sage", "Parsley", "Cilantro", "Tulip", "French Beans", "Chamomile", "Cucumber", "Lavender", "Hops", "White Rose", "Kidney Beans", "Ginger", "Rice", "Hot Pepper", "Leek", "Eggplant", "Sunflower", "Sweet Potato", "Napa Cabbage", "Jack-o-Lantern"]
export const land = ["Average Farmland", "Fertile Land", "Awesome Land","Hi-Tec Land","Trinity Land","Cemetery"]

export const seedAndLand = [...seed, ...land];

export const seed_nfts: Set<string> = new Set(seed);
export const land_nfts: Set<string> = new Set(land);

export const common_land: Set<string> = new Set(["Average Farmland"]);
export const rare_land: Set<string> = new Set(["Fertile Land"]);
export const epic_land: Set<string> = new Set(["Awesome Land", "Cemetery"]);
export const legendary_land: Set<string> = new Set(["Hi-Tec Land","Trinity Land"]);