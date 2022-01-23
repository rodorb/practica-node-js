export const ADVERTISEMENT = {
    item_name: "PS5",
    type: ItemType.Sale,
    price: 499.99,
    image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.esquire.com%2Fes%2Ftecnologia%2Fa34119787%2Fplaystation-5-reservar-ps5-reserva%2F&psig=AOvVaw385w9n6QYiwahKNF6Hch05&ust=1642439658935000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCMCJq9XitvUCFQAAAAAdAAAAABAL',
    tags: [Tag.Mobile, Tag.Work]
}


export class ItemType {
    // Create new instances of the same class as static attributes
    static Sale = new ItemType("sale");
    static Search = new ItemType("search");
    constructor(name) {
        this.name = name;
    }
}

export class Tag {
    // Create new instances of the same class as static attributes
    static Work = new ItemType("work");
    static LifeStyle = new ItemType("lifestyle");
    static Motor = new ItemType("motor");
    static Mobile = new ItemType("mobile");
    constructor(name) {
        this.name = name;
    }
}