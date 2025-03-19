from contextlib import contextmanager
from threading import Lock

MUTEX = Lock()


@contextmanager
def mutex_lock():
    MUTEX.acquire()
    try:
        yield
    finally:
        MUTEX.release()
