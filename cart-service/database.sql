-- Create database
create database cart_db;

-- use database
use cart_db;

-- cart
create table cart(
    id integer primary key auto_increment,
    userId integer,
    foodItemId integer,
    quantity integer,
    price float,
    createdTimestamp timestamp default CURRENT_TIMESTAMP
);