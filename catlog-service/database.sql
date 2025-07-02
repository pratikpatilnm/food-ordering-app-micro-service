-- Create database
create database catelog_db;

-- use database
use catelog_db;

-- categories
create table category(
    id integer primary key auto_increment,
    title varchar(100),
    image varchar(100),
    isActive integer(1) default 1,
    createdTimestamp timestamp default CURRENT_TIMESTAMP
);


-- dishes
create table foodItem(
    id integer primary key auto_increment,
    title varchar(100),
    ingredients varchar(1000),
    description varchar(1000),
    image varchar(100), 
    categoryId varchar(100),
    price float,
    isActive integer(1) default 1,
    createdTimestamp timestamp default CURRENT_TIMESTAMP
);
