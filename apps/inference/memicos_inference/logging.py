import os
from logging.config import dictConfig


def initialize_logging():
    home_dir = os.environ["HOME_DIR"] if "HOME_DIR" in os.environ else "."
    log_directory = os.path.join(home_dir, "logs")
    os.makedirs(log_directory, exist_ok=True)

    dictConfig(
        {
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "default": {
                    "format": "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
                    "datefmt": "%Y-%m-%d %H:%M:%S",
                }
            },
            "handlers": {
                "console": {
                    "class": "logging.StreamHandler",
                    "stream": "ext://sys.stdout",
                    "formatter": "default",
                    "level": "DEBUG",
                },
                "file": {
                    "class": "logging.handlers.RotatingFileHandler",
                    "filename": f"{log_directory}/server.log",
                    "maxBytes": 10485760,  # 10MB
                    "backupCount": 5,
                    "formatter": "default",
                    "level": "DEBUG",
                },
            },
            "loggers": {
                "memicos_inference": {  # Package logger
                    "level": "DEBUG",
                    "handlers": ["console", "file"],
                    "propagate": False,
                },
                "memicos_inference.endpoints": {  # Endpoints logger
                    "level": "DEBUG",
                    "handlers": ["console", "file"],
                    "propagate": False,
                },
                "memicos_inference.endpoints.steer": {  # Steer module logger
                    "level": "DEBUG",
                    "handlers": ["console", "file"],
                    "propagate": False,
                },
                "uvicorn": {  # Add uvicorn logger
                    "level": "INFO",
                    "handlers": ["console", "file"],
                    "propagate": False,
                },
                "fastapi": {  # Add fastapi logger
                    "level": "INFO",
                    "handlers": ["console", "file"],
                    "propagate": False,
                },
            },
            "root": {  # Root logger
                "level": "INFO",
                "handlers": ["console", "file"],
            },
        }
    )
