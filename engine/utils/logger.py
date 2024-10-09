# File: engine/utils/logger.py
import logging

def setup_logging():
    # Set up logging format
    logging.basicConfig(
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        level=logging.INFO
    )
    logging.info("Logger initialized")
    
def log_info(message):
    logging.info(message)

def log_warning(message):
    logging.warning(message)

def log_error(message):
    logging.error(message)

def log_debug(message):
    logging.debug(message)

# Initialize the logger when imported
setup_logger()
