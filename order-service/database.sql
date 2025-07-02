-- Create database
create database order_db;

-- use database
use order_db;

-- order master
create table orderMaster(
    id integer primary key auto_increment,
    userId integer,
    addressId integer,
    totalPrice float,
    discount float,
    finalAmount float,
    paymentStatus varchar(50),
    paaymentId varchar(50),
    status varchar(20) default 'placed',
    createdTimestamp timestamp default CURRENT_TIMESTAMP
);

-- order details
create table orderDetails(
    id integer primary key auto_increment,
    orderId integer,
    foodItemId integer,
    quantity integer,
    price float,
    createdTimestamp timestamp default CURRENT_TIMESTAMP
);