<?php

try {
	$pdo = new PDO('sqlite:demo.db');

	$result['data']=[
		['id'=>1, 'name'=>'Tiger Nixon', 'age'=>61, 'city'=>'Edinburgh'],
		['id'=>2, 'name'=>'Garrett Winters', 'age'=>63, 'city'=>'Tokyo'],
		['id'=>3, 'name'=>'Ashton Cox', 'age'=>66, 'city'=>'San Francisco'],
		['id'=>4, 'name'=>'Cedric Kelly', 'age'=>22, 'city'=>'Edinburgh'],
		['id'=>5, 'name'=>'Airi Satou', 'age'=>33, 'city'=>'Tokyo'],
		['id'=>6, 'name'=>'Brielle Williamson', 'age'=>61, 'city'=>'New York'],
		['id'=>7, 'name'=>'Herrod Chandler', 'age'=>59, 'city'=>'San Francisco'],
		['id'=>8, 'name'=>'Rhona Davidson', 'age'=>55, 'city'=>'Tokyo'],
		['id'=>9, 'name'=>'Colleen Hurst', 'age'=>39, 'city'=>'San Francisco'],
		['id'=>10, 'name'=>'Sonya Frost', 'age'=>23, 'city'=>'Edinburgh'],
		['id'=>11, 'name'=>'Jena Gaines', 'age'=>30, 'city'=>'London'],
		['id'=>12, 'name'=>'Quinn Flynn', 'age'=>22, 'city'=>'Edinburgh'],
		['id'=>13, 'name'=>'Charde Marshall', 'age'=>36, 'city'=>'San Francisco'],
		['id'=>14, 'name'=>'Haley Kennedy', 'age'=>43, 'city'=>'London'],
		['id'=>15, 'name'=>'Tatyana Fitzpatrick', 'age'=>19, 'city'=>'London'],
		['id'=>16, 'name'=>'Michael Silva', 'age'=>66, 'city'=>'London'],
		['id'=>17, 'name'=>'Paul Byrd', 'age'=>64, 'city'=>'New York'],
		['id'=>18, 'name'=>'Gloria Little', 'age'=>59, 'city'=>'New York'],
		['id'=>19, 'name'=>'Bradley Greer', 'age'=>41, 'city'=>'London'],
		['id'=>20, 'name'=>'Dai Rios', 'age'=>35, 'city'=>'Edinburgh'],
		['id'=>21, 'name'=>'Jenette Caldwell', 'age'=>30, 'city'=>'New York'],
		['id'=>22, 'name'=>'Yuri Berry', 'age'=>40, 'city'=>'New York'],
		['id'=>23, 'name'=>'Caesar Vance', 'age'=>21, 'city'=>'New York'],
		['id'=>24, 'name'=>'Doris Wilder', 'age'=>23, 'city'=>'Sidney'],
		['id'=>25, 'name'=>'Angelica Ramos', 'age'=>47, 'city'=>'London'],
		['id'=>26, 'name'=>'Gavin Joyce', 'age'=>42, 'city'=>'Edinburgh'],
		['id'=>27, 'name'=>'Jennifer Chang', 'age'=>28, 'city'=>'Sidney'],
		['id'=>28, 'name'=>'Brenden Wagner', 'age'=>28, 'city'=>'San Francisco'],
		['id'=>29, 'name'=>'Fiona Green', 'age'=>48, 'city'=>'London'],
		['id'=>30, 'name'=>'Shou Itou', 'age'=>20, 'city'=>'Tokyo'],
		['id'=>31, 'name'=>'Michelle House', 'age'=>37, 'city'=>'Sidney'],
		['id'=>32, 'name'=>'Suki Burks', 'age'=>53, 'city'=>'London'],
		['id'=>33, 'name'=>'Prescott Bartlett', 'age'=>27, 'city'=>'London'],
		['id'=>34, 'name'=>'Gavin Cortez', 'age'=>22, 'city'=>'San Francisco'],
		['id'=>35, 'name'=>'Martena Mccray', 'age'=>46, 'city'=>'Edinburgh'],
		['id'=>36, 'name'=>'Unity Butler', 'age'=>47, 'city'=>'San Francisco'],
		['id'=>37, 'name'=>'Howard Hatfield', 'age'=>51, 'city'=>'San Francisco'],
		['id'=>38, 'name'=>'Hope Fuentes', 'age'=>41, 'city'=>'San Francisco'],
		['id'=>39, 'name'=>'Vivian Harrell', 'age'=>62, 'city'=>'San Francisco'],
		['id'=>40, 'name'=>'Timothy Mooney', 'age'=>37, 'city'=>'London'],
		['id'=>41, 'name'=>'Jackson Bradshaw', 'age'=>65, 'city'=>'New York'],
		['id'=>42, 'name'=>'Olivia Liang', 'age'=>64, 'city'=>'Sidney'],
		['id'=>43, 'name'=>'Bruno Nash', 'age'=>38, 'city'=>'London'],
		['id'=>44, 'name'=>'Sakura Yamamoto', 'age'=>37, 'city'=>'Tokyo'],
		['id'=>45, 'name'=>'Thor Walton', 'age'=>61, 'city'=>'New York'],
		['id'=>46, 'name'=>'Finn Camacho', 'age'=>47, 'city'=>'San Francisco'],
		['id'=>47, 'name'=>'Serge Baldwin', 'age'=>64, 'city'=>'London'],
		['id'=>48, 'name'=>'Zenaida Frank', 'age'=>63, 'city'=>'New York'],
		['id'=>49, 'name'=>'Zorita Serrano', 'age'=>56, 'city'=>'San Francisco'],
		['id'=>50, 'name'=>'Jennifer Acosta', 'age'=>43, 'city'=>'Edinburgh'],
		['id'=>51, 'name'=>'Cara Stevens', 'age'=>46, 'city'=>'New York'],
		['id'=>52, 'name'=>'Hermione Butler', 'age'=>47, 'city'=>'London'],
		['id'=>53, 'name'=>'Lael Greer', 'age'=>21, 'city'=>'London'],
		['id'=>54, 'name'=>'Jonas Alexander', 'age'=>30, 'city'=>'San Francisco'],
		['id'=>55, 'name'=>'Shad Decker', 'age'=>51, 'city'=>'Edinburgh'],
		['id'=>56, 'name'=>'Michael Bruce', 'age'=>29, 'city'=>'Singapore'],
		['id'=>57, 'name'=>'Donna Snider', 'age'=>27, 'city'=>'New York'],
	];
	$stmt = $pdo->prepare("DROP TABLE IF EXISTS personen");
	$stmt->execute();

	$stmt = $pdo->prepare("CREATE TABLE personen (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, city TEXT)");
	$stmt->execute();

	$stmt = $pdo->prepare("INSERT INTO personen (id, name, age, city) VALUES (:id, :name, :age, :city)");

	foreach ($result['data'] as $row) {
		$stmt->execute($row);
	}

	$success = true;
} catch (PDOException $e) {
	$success = false;
}
