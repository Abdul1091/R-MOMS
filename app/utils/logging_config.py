#!/user/bin/env python3


import os
from logging.handlers import RotatingFileHandler
import logging

def setup_logger():
    # Ensure the logs directory exists
    logs_dir = "logs"
    if not os.path.exists(logs_dir):
        os.makedirs(logs_dir)

    # Create a rotating file handler
    handler = RotatingFileHandler(
        f"{logs_dir}/app.log",
        maxBytes=1_000_000,
        backupCount=3
        )
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)

    # Create logger
    logger = logging.getLogger("app_logger")
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)
    return logger

logger = setup_logger()