from abc import ABC, abstractmethod


class BaseSAE(ABC):
    @abstractmethod
    def load(self, *args, **kwargs):
        pass
