const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/* ---------------- GET PRODUCTS ---------------- */
app.get('/getProducts', (req, res) => {
    try {
        const data = fs.readFileSync('products.json', 'utf-8');
        const products = JSON.parse(data);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Error reading products" });
    }
});

/* ---------------- ADD PRODUCT ---------------- */
app.post('/addProduct', (req, res) => {
    try {
        const newProduct = req.body;

        let products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
        products = products.filter(p => p); // remove nulls

        products.push(newProduct);

        fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

        res.json({ message: "Product added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Add failed" });
    }
});

/* ---------------- DELETE PRODUCT BY ID ---------------- */
app.delete('/deleteProduct/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        let products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

        // remove null / invalid entries
        products = products.filter(p => p && p.productId);

        const index = products.findIndex(p => p.productId === id);

        if (index === -1) {
            return res.status(404).json({
                message: `Product with ID ${id} not found`
            });
        }

        products.splice(index, 1);

        fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

        res.json({ message: "Product deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Delete failed" });
    }
});

/* ---------------- DELETE LAST PRODUCT ---------------- */
app.delete('/deleteLastProduct', (req, res) => {
    try {
        let products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
        products = products.filter(p => p);

        if (products.length === 0) {
            return res.status(404).json({ message: "No products to delete" });
        }

        products.pop();

        fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

        res.json({ message: "Last product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete last failed" });
    }
});

/* ---------------- UPDATE PRODUCT ---------------- */
app.put('/updateProduct/:id', (req, res) => {
    try {
        const id = Number(req.params.id);

        let products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
        products = products.filter(p => p);

        const product = products.find(p => p.productId === id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.description =
            "Preferred by Both Vegetarians and Non Vegetarians";

        fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

        res.json({ message: "Product updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

/* ---------------- SERVER ---------------- */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
