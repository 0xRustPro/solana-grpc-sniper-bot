--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15
-- Dumped by pg_dump version 14.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: sol_algo; Type: SCHEMA; Schema: -; Owner: -
--
CREATE SCHEMA sol_algo;




--
-- Name: date_to_unix_ms(date); Type: FUNCTION; Schema: sol_algo; Owner: -
--

CREATE FUNCTION sol_algo.date_to_unix_ms(input_date date) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
begin
	return (extract(epoch from input_date)::bigint *1000);
end;
$$;

--
-- Name: unix_ms_to_data(double precision); Type: FUNCTION; Schema: sol_algo; Owner: -
--

CREATE FUNCTION sol_algo.unix_ms_to_data(ms_timestamp double precision) RETURNS date
    LANGUAGE plpgsql
    AS $$
begin
	return to_timestamp(ms_timestamp/1000)::date;
end;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;




--
-- Name: fee_detection_partitioned; Type: TABLE; Schema: sol_algo; Owner: -
--

CREATE TABLE sol_algo.pumpfun_trades_partitioned (
    token_address character varying(100) NOT NULL,
    tx_id character varying(100) NOT NULL,
    block_id bigint NOT NULL,
    "timestamp" double precision NOT NULL,
    trader character varying(60),
    action character varying(5)
);


--
-- Name: pumpfun_graduate_detection; Type: TABLE; Schema: sol_algo; Owner: -
--

CREATE TABLE sol_algo.pumpfun_graduate_detection (
    token_address character varying(50) NOT NULL,
    "timestamp" real,
    is_migrated integer DEFAULT 0,
    block_id integer
);



--
-- Name: pumpfun_latest_tokens_partitioned; Type: TABLE; Schema: sol_algo; Owner: -
--

CREATE TABLE sol_algo.pumpfun_latest_tokens_partitioned (
    token_address character varying(100) NOT NULL,
    dev_address character varying(100),
    bought_sol double precision,
    "timestamp" double precision NOT NULL,
    start_price character varying(100),
    bought_token_amount double precision
);




--
-- Name: pumpswap_migrated_pool; Type: TABLE; Schema: sol_algo; Owner: -
--

CREATE TABLE sol_algo.pumpswap_migrated_pool (
    token_address character varying(100) NOT NULL,
    pool_id character varying(100),
    "timestamp" real
);



--
-- Name: pumpfun_launch_txn; Type: TABLE; Schema: sol_algo; Owner: -
--

CREATE TABLE sol_algo.pumpfun_launch_txn (
    id integer NOT NULL,
    token_address character varying(100),
    txn_signature character varying(100)
);



--
-- Name: pumpswap_bought_history; Type: TABLE; Schema: sol_algo; Owner: -
--

CREATE TABLE sol_algo.pumpswap_bought_history (
    token_address character varying(100),
    bought_token_amount double precision,
    bought_sol_amount double precision,
    entry_price double precision,
    "timestamp" double precision,
    status character varying(100),
    wallet_address character varying(100),
    sold_token_amount double precision,
    sold_sol_amount double precision
);

--
-- Name: pumpfun_bought_history; Type: TABLE; Schema: sol_algo; Owner: -
--

CREATE TABLE sol_algo.pumpfun_bought_history (
    token_address character varying(100) NOT NULL,
    bought_amount double precision,
    entry_price double precision,
    "timestamp" double precision,
    status character varying(100),
    entry_marketcap double precision,
    wallet_address character varying(100) NOT NULL
);



--
-- Name: create_daily_partition_table(date); Type: PROCEDURE; Schema: sol_algo; Owner: -
--

CREATE PROCEDURE sol_algo.create_daily_partition_table(IN target_date date)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- First table (pumpfun latest_tokens)
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS sol_algo.pumpfun_latest_tokens_p_%s PARTITION OF sol_algo.pumpfun_latest_tokens_partitioned
        FOR VALUES FROM (%L) TO (%L)',
        to_char(target_date, 'YYYY_MM_DD'),
        extract(epoch FROM target_date)*1000,
        extract(epoch FROM target_date + interval '1 day')*1000
    );
    -- second table (pumpfun trades)
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS sol_algo.pumpfun_trades_p_%s PARTITION OF sol_algo.pumpfun_trades_partitioned
        FOR VALUES FROM (%L) TO (%L)',
        to_char(target_date, 'YYYY_MM_DD'),
        extract(epoch FROM target_date)*1000,
        extract(epoch FROM target_date + interval '1 day')*1000
    );
END;
$$;