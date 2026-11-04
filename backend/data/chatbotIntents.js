const intents = [
    {
        type: 'greeting',
        patterns: [
            'xin chào', 'chào bạn', 'hello', 'hi', 'hey', 'chào',
            'bắt đầu', 'giúp tôi', 'tôi cần giúp đỡ'
        ],
        responses: [
            'Xin chào! Tôi có thể giúp gì cho bạn? Bạn có thể hỏi tôi về các loại sản phẩm, thương hiệu hoặc tầm giá.',
            'Chào bạn! Bạn đang tìm kiếm sản phẩm nào? Tôi có thể tư vấn về thương hiệu và giá cả.',
            'Xin chào! Tôi là trợ lý ảo của cửa hàng. Tôi có thể giúp bạn tìm sản phẩm theo loại, thương hiệu hoặc tầm giá, cũng như trả lời các câu hỏi về chính sách của chúng tôi.'
        ],
        requiresProductQuery: false
    },
    {
        type: 'product_search',
        patterns: [
            'tìm', 'tìm kiếm', 'mua', 'sản phẩm', 'tôi muốn mua',
            'tôi đang tìm', 'có bán', 'bán không', 'tôi cần',
            'tìm giúp tôi', 'tôi muốn tìm', 'tôi đang cần'
        ],
        responses: [
            'Đây là một số sản phẩm phù hợp với yêu cầu của bạn:',
            'Tôi đã tìm thấy những sản phẩm sau đây:',
            'Dựa trên yêu cầu của bạn, đây là các sản phẩm phù hợp:'
        ],
        requiresProductQuery: true
    },
    {
        type: 'category_exploration',
        patterns: [
            // Câu hỏi chung về sản phẩm
            'loại sản phẩm', 'danh mục', 'các loại', 'có những loại nào',
            'sản phẩm gì', 'có bán gì', 'có những sản phẩm nào',
            'có gì', 'bán gì', 'có những gì',

            // Điện thoại - Smartphones
            'smartphone', 'điện thoại', 'phone', 'mobile', 'di động',
            'điện thoại di động', 'smart phone', 'đt', 'fone',
            'có điện thoại gì', 'có phone nào', 'có smartphone nào',
            'điện thoại nào', 'phone nào', 'smartphone nào',
            'loại điện thoại', 'các loại điện thoại', 'dòng điện thoại',

            // Laptop - Máy tính
            'laptop', 'máy tính', 'computer', 'pc', 'notebook',
            'máy tính xách tay', 'máy tính laptop', 'lap top', 'mt',
            'có laptop gì', 'có máy tính nào', 'có computer nào',
            'laptop nào', 'máy tính nào', 'computer nào',
            'loại laptop', 'các loại laptop', 'dòng laptop',
            'loại máy tính', 'các loại máy tính', 'dòng máy tính',

            // Tablet - Máy tính bảng
            'tablet', 'máy tính bảng', 'ipad', 'tab', 'surface',
            'có tablet gì', 'có máy tính bảng nào', 'có ipad nào',
            'tablet nào', 'máy tính bảng nào', 'ipad nào',
            'loại tablet', 'các loại tablet', 'dòng tablet',

            // Phụ kiện - Accessories
            'phụ kiện', 'accessories', 'tai nghe', 'headphone', 'earphone',
            'có phụ kiện gì', 'có tai nghe nào', 'có headphone nào',
            'phụ kiện nào', 'tai nghe nào', 'headphone nào',
            'loại phụ kiện', 'các loại phụ kiện', 'dòng phụ kiện'
        ],
        responses: [
            'Trong danh mục này, chúng tôi có các thương hiệu sau:',
            'Đây là các thương hiệu phổ biến trong danh mục bạn quan tâm:',
            'Chúng tôi có các thương hiệu sau đây trong danh mục này:'
        ],
        requiresProductQuery: true,
        requiresCategoryBrands: true
    },
    {
        type: 'brand_recommendation',
        patterns: [
            // Câu hỏi về thương hiệu
            'thương hiệu', 'hãng', 'nhãn hàng', 'brand', 'hiệu', 'của hãng nào',
            'hãng nào', 'thương hiệu nào', 'brand nào', 'hiệu nào',
            'có hãng gì', 'có thương hiệu gì', 'có brand nào',

            // Smartphone brands
            'apple', 'iphone', 'samsung', 'galaxy', 'xiaomi', 'redmi', 'mi',
            'oppo', 'vivo', 'nokia', 'huawei', 'honor', 'realme', 'oneplus',
            'google', 'pixel', 'nothing', 'asus', 'rog phone',

            // Laptop brands
            'dell', 'hp', 'asus', 'acer', 'lenovo', 'thinkpad', 'msi',
            'gigabyte', 'macbook', 'surface', 'razer', 'alienware',
            'gaming laptop', 'laptop gaming',

            // Accessory brands
            'jbl', 'bose', 'sony', 'sennheiser', 'logitech', 'razer',
            'airpods', 'beats', 'skullcandy', 'audio technica',

            // Câu hỏi cụ thể về thương hiệu
            'có sản phẩm apple', 'có sản phẩm samsung', 'có sản phẩm xiaomi',
            'có điện thoại apple', 'có điện thoại samsung', 'có điện thoại xiaomi',
            'có laptop dell', 'có laptop hp', 'có laptop asus',
            'sản phẩm của apple', 'sản phẩm của samsung', 'sản phẩm của xiaomi'
        ],
        responses: [
            'Đây là một số sản phẩm từ thương hiệu bạn quan tâm:',
            'Tôi đã tìm thấy những sản phẩm sau từ thương hiệu này:',
            'Chúng tôi có các sản phẩm sau đây từ thương hiệu bạn yêu cầu:'
        ],
        requiresProductQuery: true
    },
    {
        type: 'price_range_recommendation',
        patterns: [
            // Câu hỏi về giá
            'giá', 'tầm giá', 'khoảng giá', 'bao nhiêu tiền', 'giá bao nhiêu',
            'giá cả', 'chi phí', 'cost', 'price', 'budget',
            'trong tầm', 'phù hợp với túi tiền', 'có thể mua được',

            // Mô tả giá
            'rẻ', 'đắt', 'mắc', 'giá rẻ', 'giá tốt', 'giảm giá', 'khuyến mãi',
            'bình dân', 'cao cấp', 'sang trọng', 'tiết kiệm', 'hợp lý',
            'phải chăng', 'vừa túi tiền', 'không quá đắt', 'không quá mắc',

            // Khoảng giá cụ thể (USD)
            'dưới', 'trên', 'khoảng', 'từ', 'đến', 'trong khoảng',
            'dưới 500 usd', 'dưới 1000 usd', 'dưới 1500 usd', 'dưới 2000 usd',
            'trên 500 usd', 'trên 1000 usd', 'trên 1500 usd', 'trên 2000 usd',
            'từ 500 đến 1000 usd', 'từ 1000 đến 2000 usd', 'từ 2000 đến 3000 usd',
            'khoảng 500 usd', 'khoảng 1000 usd', 'khoảng 1500 usd', 'khoảng 2000 usd',

            // Legacy Vietnamese patterns
            'dưới 5 triệu', 'dưới 10 triệu', 'dưới 15 triệu', 'dưới 20 triệu',
            'trên 5 triệu', 'trên 10 triệu', 'trên 15 triệu', 'trên 20 triệu',
            'từ 5 đến 10 triệu', 'từ 10 đến 15 triệu', 'từ 15 đến 20 triệu',

            // Số tiền (USD)
            '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1500', '2000', '2500', '3000',
            '$200', '$300', '$400', '$500', '$600', '$700', '$800', '$900', '$1000', '$1500', '$2000',
            'usd', '$',

            // Câu hỏi cụ thể về giá
            'có sản phẩm rẻ không', 'có gì rẻ không', 'có gì giá tốt không',
            'sản phẩm giá rẻ', 'sản phẩm bình dân', 'sản phẩm cao cấp',
            'trong tầm giá sinh viên', 'phù hợp với học sinh', 'cho người mới bắt đầu'
        ],
        responses: [
            'Đây là một số sản phẩm trong tầm giá bạn quan tâm:',
            'Tôi đã tìm thấy những sản phẩm sau trong tầm giá này:',
            'Trong tầm giá bạn yêu cầu, chúng tôi có các sản phẩm sau:'
        ],
        requiresProductQuery: true,
        requiresPriceRange: true
    },
    {
        type: 'product_consultation',
        patterns: [
            // Câu hỏi tư vấn sản phẩm
            'tư vấn', 'tư vấn sản phẩm', 'tư vấn về', 'cho tôi biết về',
            'thông tin về', 'mô tả', 'mô tả sản phẩm', 'chi tiết sản phẩm',
            'thông số', 'thông số kỹ thuật', 'cấu hình', 'đánh giá',
            'review', 'đánh giá sản phẩm', 'có tốt không', 'có nên mua không',

            // Tên sản phẩm cụ thể
            'iphone', 'iphone 15', 'iphone 15 pro', 'iphone 15 pro max',
            'samsung galaxy', 'galaxy s24', 's24 ultra', 'samsung s24',
            'macbook', 'macbook pro', 'macbook air', 'macbook pro 16',
            'dell xps', 'xps 15', 'dell xps 15', 'dell laptop',
            'hp spectre', 'spectre x360', 'hp laptop', 'hp spectre x360',
            'lenovo thinkpad', 'thinkpad', 'thinkpad x1', 'x1 carbon',
            'asus rog', 'rog zephyrus', 'zephyrus g14', 'asus laptop',
            'ipad', 'ipad pro', 'ipad pro 12.9', 'apple tablet',
            'surface', 'surface pro', 'surface pro 9', 'microsoft surface',
            'galaxy tab', 'tab s9', 's9 ultra', 'samsung tablet',
            'sony wh-1000xm5', 'sony headphone', 'wh-1000xm5', 'sony tai nghe',
            'bose quietcomfort', 'bose headphone', 'quietcomfort ultra',
            'airpods', 'airpods pro', 'apple airpods', 'tai nghe apple',

            // Câu hỏi về sản phẩm cụ thể
            'iphone 15 pro max có gì đặc biệt', 'macbook pro có tốt không',
            'samsung galaxy s24 ultra thế nào', 'dell xps 15 có nên mua',
            'thông số iphone 15', 'cấu hình macbook pro', 'đánh giá samsung s24',
            'sony wh-1000xm5 có tốt không', 'airpods pro 2 thế nào',
            'ipad pro 12.9 có đáng mua', 'surface pro 9 như thế nào',

            // Từ khóa tư vấn chung
            'nên chọn', 'lựa chọn nào', 'sản phẩm nào tốt', 'có đáng mua',
            'có nên mua', 'ưu nhược điểm', 'điểm mạnh', 'điểm yếu',
            'so sánh', 'khác biệt', 'phân biệt', 'lựa chọn'
        ],
        responses: [
            'Đây là thông tin chi tiết về sản phẩm bạn quan tâm:',
            'Tôi sẽ cung cấp thông tin tư vấn về sản phẩm này:',
            'Dưới đây là mô tả và thông số kỹ thuật của sản phẩm:'
        ],
        requiresProductQuery: true,
        requiresProductConsultation: true
    },
    {
        type: 'shipping',
        patterns: [
            'vận chuyển', 'giao hàng', 'ship', 'thời gian giao',
            'phí vận chuyển', 'phí giao hàng', 'giao trong bao lâu',
            'khi nào nhận được', 'mất bao lâu để nhận'
        ],
        responses: [
            'Chúng tôi giao hàng trong vòng 2-3 ngày làm việc đối với khu vực nội thành và 3-5 ngày đối với các tỉnh thành khác.',
            'Phí vận chuyển của chúng tôi là 30.000đ cho đơn hàng dưới 500.000đ. Miễn phí vận chuyển cho đơn hàng từ 500.000đ trở lên.',
            'Bạn có thể theo dõi đơn hàng của mình trong phần "Đơn hàng của tôi" sau khi đăng nhập.'
        ],
        requiresProductQuery: false
    },
    {
        type: 'payment',
        patterns: [
            'thanh toán', 'trả tiền', 'phương thức thanh toán',
            'tiền mặt', 'thẻ tín dụng', 'chuyển khoản', 'momo',
            'ví điện tử', 'zalopay', 'cod'
        ],
        responses: [
            'Chúng tôi chấp nhận nhiều phương thức thanh toán: tiền mặt khi nhận hàng (COD), thẻ tín dụng/ghi nợ, chuyển khoản ngân hàng và các ví điện tử như MoMo, ZaloPay.',
            'Bạn có thể thanh toán bằng tiền mặt khi nhận hàng hoặc thanh toán trực tuyến qua thẻ, chuyển khoản hoặc ví điện tử.',
            'Để thanh toán, bạn có thể chọn một trong các phương thức: COD, thẻ tín dụng, chuyển khoản ngân hàng hoặc ví điện tử.'
        ],
        requiresProductQuery: false
    },
    {
        type: 'return_policy',
        patterns: [
            'đổi trả', 'trả lại', 'hoàn tiền', 'chính sách đổi trả',
            'đổi sản phẩm', 'trả hàng', 'không vừa ý', 'không hài lòng',
            'lỗi sản phẩm', 'hư hỏng'
        ],
        responses: [
            'Chúng tôi chấp nhận đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên vẹn và có hóa đơn mua hàng.',
            'Nếu sản phẩm bị lỗi do nhà sản xuất, chúng tôi sẽ đổi mới hoặc hoàn tiền 100% trong vòng 30 ngày.',
            'Để đổi trả sản phẩm, vui lòng liên hệ với chúng tôi qua số hotline hoặc email support@example.com với thông tin đơn hàng của bạn.'
        ],
        requiresProductQuery: false
    },
    {
        type: 'fallback',
        patterns: [],
        responses: [
            'Xin lỗi, tôi không hiểu ý của bạn. Bạn có thể diễn đạt lại được không? Bạn có thể hỏi tôi về các loại sản phẩm, thương hiệu hoặc tầm giá.',
            'Tôi chưa được lập trình để hiểu câu hỏi này. Bạn có thể hỏi về sản phẩm, thương hiệu, tầm giá, vận chuyển, thanh toán hoặc chính sách đổi trả.',
            'Tôi không chắc mình hiểu đúng ý bạn. Bạn có thể hỏi theo cách khác được không? Ví dụ: "Có những loại điện thoại nào?", "Có sản phẩm nào của Apple không?", hoặc "Có laptop nào dưới 15 triệu không?"'
        ],
        requiresProductQuery: false
    }
];

module.exports = intents;
