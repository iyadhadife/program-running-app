-- Active: 1767107806490@@127.0.0.1@3306@db
create database if not exists db;

create table if not exists user(
email varchar(30) primary key,
name varchar(100),
password varchar(100)
);

create table if not exists event(
    id double primary key,
    name varchar(100),
    description varchar(255)
);

create table if not exists SportiveEvents(
email_user varchar(30),
id_event double,
Constraint user
    Foreign Key (email_user)
    References user(email),
constraint event
    Foreign Key (id_event)
    References event(id),
constraint PRIMARY KEY (email_user, id_event)
);

