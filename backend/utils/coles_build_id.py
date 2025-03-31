from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import re
import time

def get_coles_build_id():
    # Latest working build ID observed manually
    return "20250321.01_v4.54.0"