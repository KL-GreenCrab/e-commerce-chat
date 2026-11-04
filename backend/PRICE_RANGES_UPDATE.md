# Price Ranges Update for Chatbot

## Overview
Updated the chatbot price range suggestions to match the actual product prices in the database, which are in USD instead of Vietnamese dong.

## Database Price Analysis
Based on the seed.js file, the actual product prices range from:
- **Minimum**: $179 (Amazon Fire HD 10 Plus)
- **Maximum**: $3,499 (Razer Blade 18)

### Price Distribution by Category:
- **Smartphones**: $699 - $1,199
- **Laptops**: $1,699 - $3,499  
- **Tablets**: $179 - $1,299
- **Accessories**: $199 - $399

## Updated Price Range Buttons

### Old Price Ranges (Vietnamese Dong):
- Dưới 5 triệu (~$200)
- 5 - 10 triệu (~$200-400)
- 10 - 20 triệu (~$400-800)
- Trên 20 triệu (~$800+)

### New Price Ranges (USD):
- **Dưới $500** - Covers accessories and budget tablets
- **$500 - $1000** - Mid-range smartphones and some tablets
- **$1000 - $2000** - Premium smartphones and entry laptops
- **Trên $2000** - High-end laptops and premium devices

## Backend Changes

### 1. Updated Price Range Extraction (`chatbotService.js`)
- Added USD pattern recognition
- Support for formats like "dưới 500 USD", "$500 - $1000"
- Maintained backward compatibility with Vietnamese patterns
- Automatic conversion from Vietnamese "triệu" to USD (rough 1:40 ratio)

### 2. Enhanced Intent Patterns (`chatbotIntents.js`)
- Added USD-specific patterns
- Support for $ symbol and "USD" suffix
- Price ranges that match actual database values

### 3. Frontend Updates (`Chatbot.tsx`)
- Updated price range buttons to show USD values
- Changed button text to reflect realistic price ranges
- Maintained Vietnamese language for user interface

## Pattern Examples

### Supported Price Queries:
- "Tôi muốn tìm sản phẩm dưới 500 USD"
- "Có laptop từ 1000 đến 2000 USD không?"
- "Sản phẩm giá rẻ" (maps to under $500)
- "Laptop cao cấp" (maps to over $2000)
- "$500 - $1000" (direct USD format)

### Legacy Support:
- "Dưới 5 triệu" (converts to ~$200)
- "Từ 10 đến 20 triệu" (converts to ~$400-800)

## Testing
Created test files to verify functionality:
- `test-price-ranges.js` - Tests various price range queries
- `check-price-ranges.js` - Analyzes actual database prices

## Benefits
1. **Accurate Price Matching**: Price ranges now match actual product prices
2. **Better User Experience**: Realistic price suggestions
3. **International Format**: USD is more universally understood
4. **Backward Compatibility**: Still supports Vietnamese price formats
5. **Smart Conversion**: Automatically handles different price formats

## Usage Examples

### User asks: "Tôi cần xem điện thoại"
1. Chatbot shows smartphone brands
2. User clicks on a brand
3. Chatbot shows price range options: "Dưới $500", "$500-$1000", etc.
4. User selects price range
5. Chatbot shows matching products

### User asks: "Có laptop dưới 1500 USD không?"
1. Chatbot recognizes price range intent
2. Searches for laptops under $1500
3. Returns matching products with prices

This update ensures the chatbot provides relevant and accurate price-based recommendations that match the actual product inventory.
