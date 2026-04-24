-- auto-generated definition

--TABLE USER
create table users
(
    id                 serial
        primary key,
    name               varchar(100) not null,
    email              varchar(100) not null
        unique,
    role               varchar(20) default 'user'::character varying,
    created_at         timestamp   default CURRENT_TIMESTAMP,
    password           varchar(255),
    refresh_token      text,
    verification_token varchar(255),
    is_verified        boolean     default false
);

alter table users
    owner to postgres;


---TABLE ORDER
-- auto-generated definition
create table orders
(
    id             serial
        primary key,
    user_id        integer
        references users
            on delete cascade,
    course_id      integer
        references courses
            on delete cascade,
    amount         integer not null,
    payment_method varchar(50),
    status         varchar(50) default 'pending'::character varying,
    created_at     timestamp   default CURRENT_TIMESTAMP
);

alter table orders
    owner to postgres;

----TABLE KURSUS
-- auto-generated definition
create table courses
(
    id              serial
        primary key,
    title           varchar(255) not null,
    category        varchar(100) not null,
    description     text,
    price           integer   default 0,
    image           text,
    instructor_name varchar(100),
    instructor_role varchar(100),
    created_at      timestamp default CURRENT_TIMESTAMP
);

alter table courses
    owner to postgres;

    --BANK

    -- auto-generated definition
    create table enrollments
    (
        id         serial
            primary key,
        user_id    integer
            references users
                on delete cascade,
        course_id  integer
            references courses
                on delete cascade,
        progress   integer   default 0,
        created_at timestamp default CURRENT_TIMESTAMP
    );

    alter table enrollments
        owner to postgres;




