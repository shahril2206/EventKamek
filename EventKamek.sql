--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-21 16:56:35

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16505)
-- Name: assignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignment (
    assignmentid integer NOT NULL,
    eventid integer NOT NULL,
    boothid integer,
    vendoremail character varying(255) NOT NULL,
    boothname character varying(255),
    boothcategory character varying(100),
    remark text,
    iscancelled boolean DEFAULT false,
    cancellationdatetime timestamp without time zone,
    cancellationremark text,
    refundabledepostatus text,
    bookingid integer,
    forfeituredetails text,
    CONSTRAINT assignment_refundabledepostatus_check CHECK ((refundabledepostatus = ANY (ARRAY['Pending'::text, 'Refunded'::text, 'Forfeited'::text]))),
    CONSTRAINT boothid_null_if_cancelled CHECK ((((iscancelled = true) AND (boothid IS NULL)) OR ((iscancelled = false) AND (boothid IS NOT NULL))))
);


ALTER TABLE public.assignment OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16504)
-- Name: assignment_assignmentid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assignment_assignmentid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assignment_assignmentid_seq OWNER TO postgres;

--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 225
-- Name: assignment_assignmentid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assignment_assignmentid_seq OWNED BY public.assignment.assignmentid;


--
-- TOC entry 222 (class 1259 OID 16470)
-- Name: booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking (
    bookingid integer NOT NULL,
    vendoremail character varying(255) NOT NULL,
    eventid integer NOT NULL,
    boothname character varying(255) NOT NULL,
    boothcategory character varying(100) NOT NULL,
    bookingdatetime timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    remark text,
    iscancelled boolean DEFAULT false NOT NULL,
    isassigned boolean DEFAULT false
);


ALTER TABLE public.booking OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16469)
-- Name: booking_bookingid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.booking_bookingid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booking_bookingid_seq OWNER TO postgres;

--
-- TOC entry 4930 (class 0 OID 0)
-- Dependencies: 221
-- Name: booking_bookingid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.booking_bookingid_seq OWNED BY public.booking.bookingid;


--
-- TOC entry 224 (class 1259 OID 16490)
-- Name: booth; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booth (
    boothid integer NOT NULL,
    eventid integer NOT NULL,
    boothno integer NOT NULL,
    isassigned boolean DEFAULT false
);


ALTER TABLE public.booth OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16489)
-- Name: booth_boothid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.booth_boothid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booth_boothid_seq OWNER TO postgres;

--
-- TOC entry 4931 (class 0 OID 0)
-- Dependencies: 223
-- Name: booth_boothid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.booth_boothid_seq OWNED BY public.booth.boothid;


--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: eventorganizer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventorganizer (
    organizeremail character varying(255) NOT NULL,
    organizationname character varying(255) NOT NULL,
    contactnum character varying(20) NOT NULL,
    password character varying(255) NOT NULL,
    profilepic text,
    facebooklink text,
    instagramlink text,
    tiktoklink text,
    websitelink text,
    aboutus text
);


ALTER TABLE public.eventorganizer OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16438)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    eventid integer NOT NULL,
    eventname character varying(255) NOT NULL,
    organizeremail character varying(255) NOT NULL,
    eventstartdate date NOT NULL,
    eventenddate date NOT NULL,
    eventlocation text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    eventdetails text,
    eventimage text,
    eventextlink text,
    status character varying(20),
    eventslug character varying(255) NOT NULL,
    boothbookingenabled boolean DEFAULT false,
    bookingclosingdate date,
    boothslots integer,
    foodboothlimit integer,
    clothingboothlimit integer,
    toysboothlimit integer,
    craftboothlimit integer,
    booksboothlimit integer,
    accessoriesboothlimit integer,
    otherboothlimit integer,
    boothfee numeric(10,2) DEFAULT NULL::numeric,
    refundabledepo numeric(10,2) DEFAULT NULL::numeric,
    nonrefundabledepo numeric(10,2) DEFAULT NULL::numeric,
    fullpayment numeric(10,2) DEFAULT NULL::numeric,
    CONSTRAINT events_status_check CHECK (((status)::text = ANY ((ARRAY['Upcoming'::character varying, 'Ongoing'::character varying, 'Past'::character varying])::text[])))
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16437)
-- Name: events_eventid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_eventid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_eventid_seq OWNER TO postgres;

--
-- TOC entry 4932 (class 0 OID 0)
-- Dependencies: 219
-- Name: events_eventid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_eventid_seq OWNED BY public.events.eventid;


--
-- TOC entry 218 (class 1259 OID 16398)
-- Name: vendor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor (
    vendoremail character varying(255) NOT NULL,
    vendorname character varying(255) NOT NULL,
    contactnum character varying(20) NOT NULL,
    password character varying(255) NOT NULL,
    profilepic text,
    facebooklink text,
    instagramlink text,
    tiktoklink text,
    websitelink text,
    aboutus text
);


ALTER TABLE public.vendor OWNER TO postgres;

--
-- TOC entry 4730 (class 2604 OID 16508)
-- Name: assignment assignmentid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment ALTER COLUMN assignmentid SET DEFAULT nextval('public.assignment_assignmentid_seq'::regclass);


--
-- TOC entry 4724 (class 2604 OID 16473)
-- Name: booking bookingid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking ALTER COLUMN bookingid SET DEFAULT nextval('public.booking_bookingid_seq'::regclass);


--
-- TOC entry 4728 (class 2604 OID 16493)
-- Name: booth boothid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booth ALTER COLUMN boothid SET DEFAULT nextval('public.booth_boothid_seq'::regclass);


--
-- TOC entry 4718 (class 2604 OID 16441)
-- Name: events eventid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN eventid SET DEFAULT nextval('public.events_eventid_seq'::regclass);


--
-- TOC entry 4923 (class 0 OID 16505)
-- Dependencies: 226
-- Data for Name: assignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignment (assignmentid, eventid, boothid, vendoremail, boothname, boothcategory, remark, iscancelled, cancellationdatetime, cancellationremark, refundabledepostatus, bookingid, forfeituredetails) FROM stdin;
24	43	122	shahrilrel22@gmail.com	Food gikk	Food	sdasasd	f	\N	\N	Forfeited	24	not showing up
28	42	114	shahrilrel22@gmail.com	Fooddddd	Food	dnadf	f	\N	\N	\N	20	\N
29	42	115	shahrilrel22@gmail.com	fdodji	Food	asdasda	f	\N	\N	\N	28	\N
20	42	119	naiseu0622@gmail.com	itu lah	Accessories	yow dh tukar ke booth 1	f	\N	\N	\N	19	\N
11	42	117	vendor1@example.com	Clothehehe	Clothing	jajajaja	f	\N	\N	\N	16	\N
1	37	51	vendor1@example.com	Buku Kamek	Books	Buku buku islamic yerr	f	2025-06-20 05:02:15.72368	\N	\N	4	\N
2	37	52	vendor3@example.com	buku kitak	Books	nya lah ya ktk pun buku	f	2025-06-20 05:01:46.976601	\N	\N	5	\N
3	37	53	vendor4@example.com	Buku Kita berdua	Books	hehe kita pun buku yeayyy	f	2025-06-20 05:00:55.18009	\N	\N	6	\N
4	37	54	vendor1@example.com	Buku Kita Sekeluarga	Books	ikasbdas	f	2025-06-20 06:17:48.03603	\N	\N	7	\N
5	37	\N	vendor3@example.com	Buku kita semua	Books	ajkdna	t	2025-06-20 06:33:59.070608	lnl	\N	8	\N
21	42	\N	shahrilrel22@gmail.com	kasjdbhnkajsbd	Food	sadfasda	t	2025-06-21 04:24:56.390327	ntah lah	\N	22	\N
22	42	\N	shahrilrel22@gmail.com	Idk	Craft	akjnad	t	2025-06-21 04:27:05.380926	fsdfsdf	\N	21	\N
7	37	55	vendor2@example.com	Harry Potter Booth	Books	Harry Potter Book	f	\N	\N	\N	\N	\N
8	37	56	vendor2@example.com	Narnia	Books	kjnkfvv	f	\N	\N	\N	\N	\N
9	37	57	vendor2@example.com	Healang	Books	buku healing	f	\N	\N	\N	\N	\N
10	37	58	vendor3@example.com	The Extraordinary Bookstore	Books	ljndf	f	\N	\N	\N	14	\N
12	42	112	vendor1@example.com	ShahrilFood	Food	kkuad	f	\N	\N	\N	17	\N
18	42	113	naiseu0622@gmail.com	Buah2	Food	fdftdg	f	\N	\N	\N	18	\N
23	43	121	shahrilrel22@gmail.com	Clothehehe	Clothing	zszddfa	f	\N	\N	Refunded	23	\N
6	41	101	vendor1@example.com	Pak Mat Western	Food	kjabdka	f	\N	\N	Forfeited	9	x bersih
\.


--
-- TOC entry 4919 (class 0 OID 16470)
-- Dependencies: 222
-- Data for Name: booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking (bookingid, vendoremail, eventid, boothname, boothcategory, bookingdatetime, remark, iscancelled, isassigned) FROM stdin;
20	shahrilrel22@gmail.com	42	Fooddddd	Food	2025-06-21 00:20:02.661172	dnadf	f	t
28	shahrilrel22@gmail.com	42	fdodji	Food	2025-06-21 06:47:37.50791	asdasda	f	t
4	vendor1@example.com	37	Buku Kamek	Books	2025-06-19 21:17:11.994948	Buku buku islamic	f	t
5	vendor3@example.com	37	buku kitak	Books	2025-06-19 23:58:59.431056	nya lah ya ktk pun buku	f	t
6	vendor4@example.com	37	Buku Kita berdua	Books	2025-06-20 00:04:22.244382	hehe kita pun buku yeayyy	f	t
7	vendor1@example.com	37	Buku Kita Sekeluarga	Books	2025-06-20 00:16:01.15919	ikasbdas	f	t
8	vendor3@example.com	37	Buku kita semua	Books	2025-06-20 06:32:56.257236	ajkdna	t	f
9	vendor1@example.com	41	Pak Mat Western	Food	2025-06-20 07:45:33.22777	kjabdka	f	t
10	vendor2@example.com	37	Harry Potter Booth	Books	2025-06-20 14:17:37.76435	Harry Potter Book	f	t
11	vendor2@example.com	37	Narnia	Books	2025-06-20 14:18:05.607993	kjnkfvv	f	t
12	vendor2@example.com	37	Healang	Books	2025-06-20 14:18:32.215392	buku healing	f	t
13	vendor3@example.com	37	Divergent	Books	2025-06-20 19:29:16.350885	kjnjklafnd	f	f
14	vendor3@example.com	37	The Extraordinary Bookstore	Books	2025-06-20 19:29:58.095891	ljndf	f	t
16	vendor1@example.com	42	Clothehehe	Clothing	2025-06-20 22:45:46.305133	knada	f	t
17	vendor1@example.com	42	ShahrilFood	Food	2025-06-20 22:50:31.88484	kkuad	f	t
18	naiseu0622@gmail.com	42	Buah2	Food	2025-06-21 00:16:54.04904	fdftdg	f	t
19	naiseu0622@gmail.com	42	itu lah	Accessories	2025-06-21 00:17:35.210494	akjnd	f	t
22	shahrilrel22@gmail.com	42	kasjdbhnkajsbd	Food	2025-06-21 03:26:50.737947	sadfasda	t	f
21	shahrilrel22@gmail.com	42	Idk	Craft	2025-06-21 00:20:39.575514	akjnad	t	f
25	shahrilrel22@gmail.com	43	tok toys	Toys	2025-06-21 04:44:11.7647	asdadsa	f	f
26	naiseu0622@gmail.com	43	Buku jak	Books	2025-06-21 04:44:58.092122	aasddas	f	f
27	naiseu0622@gmail.com	43	buku special	Books	2025-06-21 04:45:19.576933	ok buku tok special	f	f
23	shahrilrel22@gmail.com	43	Clothehehe	Clothing	2025-06-21 04:43:17.186803	zszddfa	f	t
24	shahrilrel22@gmail.com	43	Food gikk	Food	2025-06-21 04:43:47.726283	sdasasd	f	t
\.


--
-- TOC entry 4921 (class 0 OID 16490)
-- Dependencies: 224
-- Data for Name: booth; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booth (boothid, eventid, boothno, isassigned) FROM stdin;
2	36	2	f
3	36	3	f
6	36	6	f
7	36	7	f
8	36	8	f
9	36	9	f
10	36	10	f
11	36	11	f
12	36	12	f
13	36	13	f
14	36	14	f
15	36	15	f
16	36	16	f
17	36	17	f
18	36	18	f
19	36	19	f
20	36	20	f
21	36	21	f
22	36	22	f
23	36	23	f
24	36	24	f
25	36	25	f
26	36	26	f
27	36	27	f
28	36	28	f
29	36	29	f
30	36	30	f
31	36	31	f
32	36	32	f
33	36	33	f
34	36	34	f
35	36	35	f
36	36	36	f
37	36	37	f
38	36	38	f
39	36	39	f
40	36	40	f
41	36	41	f
42	36	42	f
43	36	43	f
44	36	44	f
45	36	45	f
46	36	46	f
47	36	47	f
48	36	48	f
49	36	49	f
50	36	50	f
60	37	10	f
61	37	11	f
62	37	12	f
63	37	13	f
64	37	14	f
65	37	15	f
66	37	16	f
67	37	17	f
68	37	18	f
69	37	19	f
70	37	20	f
51	37	1	t
52	37	2	t
53	37	3	t
54	37	4	t
101	41	1	t
55	37	5	t
56	37	6	t
57	37	7	t
58	37	8	t
116	42	6	f
118	42	8	f
120	42	10	f
102	41	2	f
103	41	3	f
105	41	5	f
106	41	6	f
107	41	7	f
108	41	8	f
109	41	9	f
110	41	10	f
112	42	2	t
1	36	1	f
104	41	4	f
113	42	3	t
5	36	5	f
117	42	7	t
4	36	4	f
59	37	9	f
123	43	3	f
124	43	4	f
125	43	5	f
126	43	6	f
127	43	7	f
128	43	8	f
129	43	9	f
130	43	10	f
131	43	11	f
132	43	12	f
133	43	13	f
134	43	14	f
135	43	15	f
121	43	1	t
122	43	2	t
114	42	4	t
115	42	5	t
111	42	1	f
119	42	9	t
\.


--
-- TOC entry 4914 (class 0 OID 16389)
-- Dependencies: 217
-- Data for Name: eventorganizer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventorganizer (organizeremail, organizationname, contactnum, password, profilepic, facebooklink, instagramlink, tiktoklink, websitelink, aboutus) FROM stdin;
organization1@example.com	organizer1	0148965784	$2b$10$UYyvYpXdycBV1kmzOxrSZOokfIfz/LPKh03GL5eQHgYx4zvXNReAi	dummyProfilePic.png	\N	\N	\N	\N	\N
organization2@example.com	organizer2	0134586795	$2b$10$bhCN.MAy9JsLWDeAw/1DK.xhIS3mV6SKGwuw46lBrNXtcgLojMfKe	dummyProfilePic.png	\N	\N	\N	\N	\N
organization3@example.com	organizer3	0154789564	$2b$10$pEP/4Yb.0vyMETJNrcfvVupgzOUGhpbP35el5CNadIM7YDlj0wjz2	dummyProfilePic.png	\N	\N	\N	\N	\N
organization4@example.com	organizer4	01785946878	$2b$10$iIKhXUs56Ze/vao7t2N.Z.NCPZ5CSs/bXtnAJlLcfV3h8jdQcFBtO	dummyProfilePic.png	facebook.com/organization4	instagram.com/organization4	tiktok.com/organization4		ada desc
naiseu0622@gmail.com	shahril	0146228473	$2b$10$I1wC3ub9Ob08l0KJvdhCIOMijHIZvI/HOi0oZGUoaFyzS89JBURuC	dummyProfilePic.png	\N	\N	\N	\N	\N
\.


--
-- TOC entry 4917 (class 0 OID 16438)
-- Dependencies: 220
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (eventid, eventname, organizeremail, eventstartdate, eventenddate, eventlocation, latitude, longitude, eventdetails, eventimage, eventextlink, status, eventslug, boothbookingenabled, bookingclosingdate, boothslots, foodboothlimit, clothingboothlimit, toysboothlimit, craftboothlimit, booksboothlimit, accessoriesboothlimit, otherboothlimit, boothfee, refundabledepo, nonrefundabledepo, fullpayment) FROM stdin;
37	Book Fest 2025	organization2@example.com	2025-07-06	2025-07-07	Pustaka Negeri Sarawak, Jalan Pustaka, Petra Jaya, 93050 Kuching, Sarawak, Malaysia	1.58342590	110.34991950	buku buku	dummy.jpg	http	Upcoming	book-fest-2025	t	2025-07-03	20	8	\N	0	\N	\N	0	\N	50.00	20.00	10.00	80.00
41	event suka suka	organization2@example.com	2025-06-18	2025-06-19	H949+R4 Kuching, Sarawak, Malaysia	1.55702956	110.36786590	mandi sungai	dummy.jpg	http	Past	event-suka-suka	t	2025-06-24	1	\N	0	0	\N	0	0	0	50.00	20.00	10.00	80.00
43	shahril pun event	naiseu0622@gmail.com	2025-06-20	2025-06-20	45, Jalan Wawasan, 93000 Kuching, Sarawak, Malaysia	1.55693620	110.34641619	sdasd	dummy.jpg	http://example.com/suka-suka-shahril	Past	shahril-pun-event	t	2025-06-22	15	\N	\N	\N	0	\N	0	\N	50.00	30.00	20.00	100.00
42	event shahril	naiseu0622@gmail.com	2025-06-25	2025-06-26	Batu Jetty, 93000 Kuching, Sarawak, Malaysia	1.56123865	110.34590721	Jum Healing - kanosdas asdasda	dummy.jpg	http://example.com/healing-darul-hana	Upcoming	event-shahril	t	2025-06-23	16	\N	0	\N	\N	\N	0	0	50.00	20.00	10.00	80.00
36	Mega Bazaar 2025	organization4@example.com	2025-07-01	2025-07-03	Padang Merdeka, Kuching	1.55721210	110.34367390	bazaar banyak	dummy.jpg	http://example.com/mega-bazaar-2025	Upcoming	mega-bazaar-2025	t	2025-06-29	50	\N	5	5	5	5	5	5	60.00	50.00	20.00	130.00
\.


--
-- TOC entry 4915 (class 0 OID 16398)
-- Dependencies: 218
-- Data for Name: vendor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendor (vendoremail, vendorname, contactnum, password, profilepic, facebooklink, instagramlink, tiktoklink, websitelink, aboutus) FROM stdin;
vendor1@example.com	vendor1	0165478956	$2b$10$LX0NE.2Q5DBG0P3uU4iu8Oy0uYi8BDKdDF/qe2PlyNON6HP/7SYmi	dummyProfilePic.png	\N	\N	\N	\N	\N
vendor3@example.com	vendor3	0154789654	$2b$10$IQZul77UVuBtSxo4zyb8sulFnbYCcGZF8HN45b/e2XYfTZDt7GLoe	dummyProfilePic.png	\N	\N	\N	\N	\N
vendor4@example.com	vendor4	01458796548	$2b$10$QfMLxUgjfYjwl4Ssmf0CHO5bA.731dcCYstX8j7twixlG71WVUNle	dummyProfilePic.png	\N	\N	\N	\N	\N
vendor2@example.com	vendor2	01245896578	$2b$10$j..ygUgGGUtnU2KHD7SeGusdGMt5rOQ5E.1qCfD8XyK8FMDR/t3BK	dummyProfilePic.png	facebook.com/shahrilaimar	instagram.com/shahril	tiktok.com/shahrilaimar		adaaa
naiseu0622@gmail.com	vendorshahril	0146228473	$2b$10$OFBE/VCskvtQ/F2v15PxBeJ/76dCnFF06gt.0B56/u4p.V.Mndx8W	dummyProfilePic.png	\N	\N	\N	\N	\N
shahrilrel22@gmail.com	aimarvendor	0178099054	$2b$10$Jqh5qLSLG1tiSPQcA8e9/eZ5DGUZCC4JWCbiFRUIn0/0YttUeyKI6	dummyProfilePic.png	\N	\N	\N	\N	\N
\.


--
-- TOC entry 4933 (class 0 OID 0)
-- Dependencies: 225
-- Name: assignment_assignmentid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assignment_assignmentid_seq', 29, true);


--
-- TOC entry 4934 (class 0 OID 0)
-- Dependencies: 221
-- Name: booking_bookingid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.booking_bookingid_seq', 28, true);


--
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 223
-- Name: booth_boothid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.booth_boothid_seq', 135, true);


--
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 219
-- Name: events_eventid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_eventid_seq', 43, true);


--
-- TOC entry 4756 (class 2606 OID 16513)
-- Name: assignment assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_pkey PRIMARY KEY (assignmentid);


--
-- TOC entry 4750 (class 2606 OID 16478)
-- Name: booking booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY (bookingid);


--
-- TOC entry 4752 (class 2606 OID 16496)
-- Name: booth booth_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booth
    ADD CONSTRAINT booth_pkey PRIMARY KEY (boothid);


--
-- TOC entry 4736 (class 2606 OID 16397)
-- Name: eventorganizer eventorganizer_organizationname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventorganizer
    ADD CONSTRAINT eventorganizer_organizationname_key UNIQUE (organizationname);


--
-- TOC entry 4738 (class 2606 OID 16395)
-- Name: eventorganizer eventorganizer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventorganizer
    ADD CONSTRAINT eventorganizer_pkey PRIMARY KEY (organizeremail);


--
-- TOC entry 4744 (class 2606 OID 16461)
-- Name: events events_eventname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_eventname_key UNIQUE (eventname);


--
-- TOC entry 4746 (class 2606 OID 16463)
-- Name: events events_eventslug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_eventslug_key UNIQUE (eventslug);


--
-- TOC entry 4748 (class 2606 OID 16459)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (eventid);


--
-- TOC entry 4759 (class 2606 OID 16541)
-- Name: assignment unique_bookingid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT unique_bookingid UNIQUE (bookingid);


--
-- TOC entry 4754 (class 2606 OID 16498)
-- Name: booth unique_event_boothno; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booth
    ADD CONSTRAINT unique_event_boothno UNIQUE (eventid, boothno);


--
-- TOC entry 4740 (class 2606 OID 16404)
-- Name: vendor vendor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor
    ADD CONSTRAINT vendor_pkey PRIMARY KEY (vendoremail);


--
-- TOC entry 4742 (class 2606 OID 16406)
-- Name: vendor vendor_vendorname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor
    ADD CONSTRAINT vendor_vendorname_key UNIQUE (vendorname);


--
-- TOC entry 4757 (class 1259 OID 16529)
-- Name: unique_active_assignment_per_booth; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_active_assignment_per_booth ON public.assignment USING btree (boothid) WHERE (iscancelled = false);


--
-- TOC entry 4760 (class 1259 OID 16531)
-- Name: unique_boothid_if_not_cancelled; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_boothid_if_not_cancelled ON public.assignment USING btree (boothid) WHERE (iscancelled = false);


--
-- TOC entry 4765 (class 2606 OID 16542)
-- Name: assignment fk_booking; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT fk_booking FOREIGN KEY (bookingid) REFERENCES public.booking(bookingid) ON DELETE SET NULL;


--
-- TOC entry 4766 (class 2606 OID 16519)
-- Name: assignment fk_booth_assignment; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT fk_booth_assignment FOREIGN KEY (boothid) REFERENCES public.booth(boothid) ON DELETE CASCADE;


--
-- TOC entry 4762 (class 2606 OID 16484)
-- Name: booking fk_event; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT fk_event FOREIGN KEY (eventid) REFERENCES public.events(eventid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4767 (class 2606 OID 16514)
-- Name: assignment fk_event_assignment; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT fk_event_assignment FOREIGN KEY (eventid) REFERENCES public.events(eventid) ON DELETE CASCADE;


--
-- TOC entry 4764 (class 2606 OID 16499)
-- Name: booth fk_event_booth; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booth
    ADD CONSTRAINT fk_event_booth FOREIGN KEY (eventid) REFERENCES public.events(eventid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4761 (class 2606 OID 16464)
-- Name: events fk_eventorganizer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_eventorganizer FOREIGN KEY (organizeremail) REFERENCES public.eventorganizer(organizeremail) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4763 (class 2606 OID 16479)
-- Name: booking fk_vendor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT fk_vendor FOREIGN KEY (vendoremail) REFERENCES public.vendor(vendoremail) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4768 (class 2606 OID 16524)
-- Name: assignment fk_vendor_assignment; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT fk_vendor_assignment FOREIGN KEY (vendoremail) REFERENCES public.vendor(vendoremail) ON DELETE CASCADE;


-- Completed on 2025-06-21 16:56:35

--
-- PostgreSQL database dump complete
--