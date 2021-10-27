export const getAllProducts = async () => {
    let data = await fetch("http://localhost:5000");
    let products = await data.json();
    return products;
}
export const getProductsByBarCode = async (barCode) => {
    let data = await fetch("http://localhost:5000?_id=" + barCode);
    let Product = await data.json();
    return Product;
};
export const getProductsByName = async (name) => {
    let data = await fetch("http://localhost:5000?name=" + name);
    let Product = await data.json();
    return Product;
};
export const getProductsBySupplier = async (supplier) => {
    let data = await fetch("http://localhost:5000?supplier=" + supplier);
    let Product = await data.json();
    return Product;
};
export const editProduct = async (id, PriceProductDetails) => {
    await fetch("http://localhost:5000/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(PriceProductDetails),
    });
};