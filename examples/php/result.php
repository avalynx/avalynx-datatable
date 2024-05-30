<?php

if (!file_exists('demo.db')) {
	include 'createdb.php';
}

$result=[];

$result['head']=[];

$result['head']['columns']=[
	['name'=>'Name', 'sortable'=>true, 'id'=>'name'],
	['name'=>'ID', 'sortable'=>true, 'id'=>'id', 'hidden'=>true],
	['name'=>'Alter', 'id'=>'age'],
	['name'=>'Stadt', 'sortable'=>true, 'id'=>'city'],
];

if (isset($_POST['sorting'])) {
	$result['sorting']=json_decode($_POST['sorting'], true);
	if ($result['sorting']===null) {
		$result['sorting']=[];
	}
	if ($result['sorting']===false) {
		$result['sorting']=[];
	}
} else {
	$result['sorting']=[];
}

if (isset($_POST['search'])) {
	$result['search']['value']=$_POST['search'];
} else {
	$result['search']=[];
	$result['search']['value']='';
}

if (isset($_POST['page'])) {
	$result['page']=(int)$_POST['page'];
} else {
	$result['page']=1;
}

if (isset($_POST['perpage'])) {
	$result['perpage']=(int)$_POST['perpage'];
} else {
	$result['perpage']=10;
}

if (isset($_POST['searchisnew'])) {
	$result['searchisnew']=(bool)$_POST['searchisnew'];
} else {
	$result['searchisnew']=false;
}

if ($result['searchisnew']===true) {
	$result['page']=1;
}

try {
	$pdo = new PDO('sqlite:demo.db');
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$where = [];
	$params = [];
	if ($result['search']['value']!=='') {
		$where[] = "(name LIKE :search OR city LIKE :search)";
		$params[':search'] = '%'.$result['search']['value'].'%';
	}

	$orderBy = [];
	foreach ($result['sorting'] as $key => $sort) {
		$orderBy[] = $key . ' ' . $sort;
	}
	$orderBy = empty($orderBy) ? '' : 'ORDER BY ' . implode(', ', $orderBy);
	$where = empty($where) ? '' : 'WHERE ' . implode(' AND ', $where);

	$query = 'SELECT COUNT(*) FROM personen '.$where;
	$stmt = $pdo->prepare($query);
	$stmt->execute($params);
	$totalFiltered = $stmt->fetchColumn();

	$query = "SELECT COUNT(*) FROM personen";
	$stmt = $pdo->query($query);
	$total = $stmt->fetchColumn();

	$result['data']=[];
	$query = "SELECT * FROM personen $where $orderBy LIMIT :limit OFFSET :offset";

	$result['page']=max(1, min($result['page'], ceil($totalFiltered / $result['perpage'])));

	$stmt = $pdo->prepare($query);
	$params[':limit'] = $result['perpage'];
	$params[':offset'] = ($result['page'] - 1) * $result['perpage'];
	$stmt->execute($params);
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$result['data'][]=['data' => $row, 'config' => ['test' => 'test_text']];
	}
} catch (PDOException $e) {
	$result['error']=$e->getMessage();
}

$result['count']=[
	'total'=>$total,
	'filtered'=>$totalFiltered,
	'start'=>1 + ($result['page'] - 1) * $result['perpage'],
	'end'=>min($totalFiltered, $result['page'] * $result['perpage']),
	'perpage'=>$result['perpage'],
	'page'=>min($result['page'], ceil($totalFiltered / $result['perpage'])),
];

header('Content-Type: application/json');
echo json_encode($result);
