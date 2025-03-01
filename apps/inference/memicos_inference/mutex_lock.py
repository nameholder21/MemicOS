from threading import Lock
from contextlib import contextmanager

MUTEX = Lock()


@contextmanager
def mutex_lock():
    MUTEX.acquire()
    try:
        yield
    finally:
        MUTEX.release()
