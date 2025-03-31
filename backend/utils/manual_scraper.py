from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from time import sleep

query = "plain flour"
url = f"https://www.coles.com.au/search?q={query.replace(' ', '%20')}"
print(f"\n🔍 Searching: {query}")
print(f"🌐 URL: {url}")

chrome_options = Options()
# Don't use headless or user-data-dir
chrome_options.add_argument("--disable-blink-features=AutomationControlled")

# This makes it feel more like a real browser session
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option('useAutomationExtension', False)

driver = webdriver.Chrome(service=Service(), options=chrome_options)
driver.get(url)

sleep(5)  # Give page time to load

# Try to extract product names
try:
    products = driver.find_elements(By.CSS_SELECTOR, '[data-testid="product-title"]')
    if products:
        print(f"✅ Found {len(products)} products:")
        for product in products:
            print(f" - {product.text}")
    else:
        print("⚠️ No product titles found.")
except Exception as e:
    print(f"❌ Error extracting products: {e}")

driver.quit()