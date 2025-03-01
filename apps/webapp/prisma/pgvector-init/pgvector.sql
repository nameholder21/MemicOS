ALTER DATABASE postgres SET hnsw.iterative_scan = relaxed_order;
ALTER DATABASE postgres SET hnsw.ef_search = 250;