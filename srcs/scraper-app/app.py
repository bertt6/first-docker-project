import requests
from bs4 import BeautifulSoup
import pandas as pd
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.types import String, Numeric, DateTime
from datetime import datetime

# Web scraping
URL = 'https://www.amazon.com.tr/Apple-iPhone-14-128-GB/dp/B0BDJ8DCJQ?th=1'
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
}
page = requests.get(URL, headers=headers)
content = BeautifulSoup(page.content, 'html.parser')

product_name = content.find(id='productTitle')
if product_name:
    product_name = product_name.get_text().strip()
else:
    product_name = "Product title not found"
product_prices = content.find_all("span", attrs='a-price-whole')
product_prices = [float(price.text.strip().replace('.', '').replace(',', '.')) for price in product_prices]

# Ensure both lists have the same length
min_length = min(len(product_prices), 1)
product_prices = product_prices[:min_length]

# PostgreSQL connection parameters
db_params = {
    "host": "postgres",
    "port": 5432,
    "user": "bert6",
    "password": "123",
    "database": "postgresql"
}

# Create a connection to PostgreSQL
conn = psycopg2.connect(**db_params)

# Create a PostgreSQL engine using SQLAlchemy
engine = create_engine(f'postgresql://{db_params["user"]}:{db_params["password"]}@{db_params["host"]}:{db_params["port"]}/{db_params["database"]}')

# Prepare data for insertion
data = {
    "model": [product_name] * min_length,
    "price": product_prices
}
df = pd.DataFrame(data)

# Insert data 