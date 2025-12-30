-- Active: 1767107806490@@127.0.0.1@3306@db
create database if not exists db;

create table if not exists user(
email double primary key,
name varchar(100),
password varchar(100)
);

create table if not exists event(
    id double primary key,
    name varchar(100),
    description varchar(255)
);

create table if not exists SportiveEvents(
id_user double,
id_event double,
Constraint user
    Foreign Key (id_user)
    References user(id),
constraint event
    Foreign Key (id_event)
    References event(id),
constraint PRIMARY KEY (id_user, id_event)
);

