-- Create database
create database user_db;
create database catelog_db;
create database cart_db;
create database order_db;


-- use database
use user_db;

-- user table
create table users(
    id integer primary key auto_increment,
    firstName varchar(30),
    lastName varchar(30),
    email varchar(50) UNIQUE,
    password varchar(100),
    profileImage varchar(100),
    isActive int(1) default 1,
    createdTimestamp timestamp default CURRENT_TIMESTAMP
);

-- user address
create table addresses(
    id integer primary key auto_increment,
    userId integer,
    title varchar(20),
    line1 varchar(100),
    line2 varchar(100),
    line3 varchar(100),
    zipcode integer,
    state varchar(20),
    isDeleted int(1) default 0,
    createdTimestamp timestamp default CURRENT_TIMESTAMP
);

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

-- cart
create table cart(
    id integer primary key auto_increment,
    userId integer,
    foodItemId integer,
    quantity integer,
    price float,
    createdTimestamp timestamp default CURRENT_TIMESTAMP
);

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