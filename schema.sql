CREATE TABLE machine_type (
     type_id int ,
     machine_name VARCHAR(100)
);
CREATE TABLE machines (
     machine_id int,
     type int ,
     machine_name VARCHAR(100),
     status int,
     hardware_cfg varchar(100),
     software_cfg varchar(100)
);

CREATE TABLE machine_status (
     status_id int,
     status_name VARCHAR(100)
);

INSERT INTO `machine_status` (`status_id`, `status_name`)
VALUES
	(0, 'Ordered'),
	(1, 'Ready'),
	(2, 'In use'),
	(3, 'Fault ');

INSERT INTO `machine_type` (`type_id`, `type_name`)
VALUES
	(1, 'MacOs'),
	(2, 'Ubuntu'),
	(3, 'Windows'),
	(4, 'CentOs');
