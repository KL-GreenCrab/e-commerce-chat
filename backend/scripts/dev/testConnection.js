const mongoose = require('mongoose');
const Product = require('./models/Product');
const config = require('./config');

mongoose.connect(config.MONGODB_URI)
    .then(async () => {
        const count = await Product.countDocuments();
        console.log(`Số lượng sản phẩm trong collection Product: ${count}`);
        if (count > 0) {
            const first = await Product.findOne();
            console.log('Sản phẩm đầu tiên:', first);
        } else {
            console.log('Collection Product hiện đang rỗng.');
        }
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Kết nối thất bại:', err);
    });
