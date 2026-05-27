--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    id text NOT NULL,
    nome text NOT NULL,
    email text NOT NULL,
    senha_hash text NOT NULL,
    criado_em timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    atualizado_em timestamp(3) without time zone NOT NULL,
    bloqueado boolean DEFAULT false NOT NULL,
    bloqueado_em timestamp(3) without time zone,
    bloqueado_por_id text,
    desbloqueado_em timestamp(3) without time zone,
    desbloqueado_por_id text,
    foto_url text,
    penultima_senha_hash text,
    primeiro_acesso boolean DEFAULT true NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    senha_alterada_em timestamp(3) without time zone,
    senha_expirada_em timestamp(3) without time zone,
    tentativas_login integer DEFAULT 0 NOT NULL,
    ultima_senha_hash text
);


--
-- Name: carteiras; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carteiras (
    id text NOT NULL,
    codigo_unico text NOT NULL,
    nome text NOT NULL,
    foto_url text,
    situacao_atual text,
    hash_validacao text,
    ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    atualizado_em timestamp(3) without time zone NOT NULL,
    cargo text,
    cpf text,
    criado_por_id text,
    data_nascimento text,
    unidades_administradas text
);


--
-- Name: logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.logs (
    id text NOT NULL,
    tipo text NOT NULL,
    entidade text,
    entidade_id text,
    usuario_id text,
    usuario_nome text,
    usuario_email text,
    usuario_role text,
    acao text NOT NULL,
    detalhes jsonb,
    ip text,
    user_agent text,
    sucesso boolean DEFAULT true NOT NULL,
    erro text,
    criado_em timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
720ff057-74fb-4c18-ac17-e53f0061249a	f3d87b181efce899254f3d6770e228475072f1218105a90fbedefc59176ecba5	2026-05-26 19:33:52.534326-03	20260523173849_init	\N	\N	2026-05-26 19:33:52.527019-03	1
64c24f67-3bf1-4671-8f52-673ffe7c8e66	68ed06db7e4860c8b90410a8c02a93ec25dc09f4f1766ba05dddd022a434588b	2026-05-26 19:33:52.535842-03	20260524171332_add_cim_field	\N	\N	2026-05-26 19:33:52.534779-03	1
320f6e73-2690-4381-a033-8a0d119975db	f44fbf18b53f0f1b3b7974235645f11257d4fbae5a98fe35e0da430932c6e58f	2026-05-26 19:33:52.537424-03	20260524173629_remove_cim_field	\N	\N	2026-05-26 19:33:52.536272-03	1
68b6ef16-30c3-4d79-8a53-29e8e5bb7e81	e964a123ed841bbc1c451855e569173ecf8da57f093d75b3a6201223fa68f771	2026-05-26 19:33:52.5389-03	20260525013414_add_loja_field	\N	\N	2026-05-26 19:33:52.537846-03	1
a3b8350c-b645-4a20-b69d-2fe4d27e4a3b	5e66a07316e1ac53e4643118453eef4c7dd253bed9513d0826f6fa29821ef103	2026-05-26 19:33:53.33625-03	20260526223353_complete_structure	\N	\N	2026-05-26 19:33:53.304118-03	1
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admins (id, nome, email, senha_hash, criado_em, ativo, atualizado_em, bloqueado, bloqueado_em, bloqueado_por_id, desbloqueado_em, desbloqueado_por_id, foto_url, penultima_senha_hash, primeiro_acesso, role, senha_alterada_em, senha_expirada_em, tentativas_login, ultima_senha_hash) FROM stdin;
36802c65-6484-4af0-8547-9d90a7df6961	scrb	scrb@sistema.com	$2b$10$R8nf5tDeb0e.bG4pGGL4Eev/dxtxgPYQDXJ19z/gZ.t.HO5Ph5PVi	2026-05-26 23:24:06.811	t	2026-05-27 02:17:41.757	f	\N	\N	\N	\N	\N	\N	f	admin	2026-05-26 23:24:56.379	2026-11-22 23:24:56.379	0	$2b$10$uPuB.aU3An5m7pY3WL9ide/mjck4I7d2eGQl1w0rHcY5PVs9mUquW
\.


--
-- Data for Name: carteiras; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carteiras (id, codigo_unico, nome, foto_url, situacao_atual, hash_validacao, ativo, criado_em, atualizado_em, cargo, cpf, criado_por_id, data_nascimento, unidades_administradas) FROM stdin;
c2adf5ae-8b51-40a7-bb10-fe2d9a047d13	ZZL5BLT6TK3WUR9Z	Diego Gomes	https://api.controle-hrrb.com.br/uploads/928a8fa5fdfd017df239cedf26dce10b.png	DESLIGADO	2d1656074f9b9ca468181326a8ef388e	t	2026-05-26 23:44:26.439	2026-05-26 23:48:29.758	EXEMPLO	999.999.999-99	36802c65-6484-4af0-8547-9d90a7df6961	01/01/2001	Santa Casa de Ruy Barbosa
\.


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.logs (id, tipo, entidade, entidade_id, usuario_id, usuario_nome, usuario_email, usuario_role, acao, detalhes, ip, user_agent, sucesso, erro, criado_em) FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: carteiras carteiras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carteiras
    ADD CONSTRAINT carteiras_pkey PRIMARY KEY (id);


--
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- Name: admins unique_admin_nome; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT unique_admin_nome UNIQUE (nome);


--
-- Name: admins_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX admins_email_key ON public.admins USING btree (email);


--
-- Name: carteiras_codigo_unico_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX carteiras_codigo_unico_key ON public.carteiras USING btree (codigo_unico);


--
-- Name: logs_criado_em_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX logs_criado_em_idx ON public.logs USING btree (criado_em);


--
-- Name: logs_entidade_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX logs_entidade_idx ON public.logs USING btree (entidade);


--
-- Name: logs_tipo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX logs_tipo_idx ON public.logs USING btree (tipo);


--
-- Name: logs_usuario_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX logs_usuario_id_idx ON public.logs USING btree (usuario_id);


--
-- Name: carteiras carteiras_criado_por_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carteiras
    ADD CONSTRAINT carteiras_criado_por_id_fkey FOREIGN KEY (criado_por_id) REFERENCES public.admins(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

