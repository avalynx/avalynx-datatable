<?php

$employees = [
	['id'=>1, 'name'=>'Tiger Nixon'],
	['id'=>2, 'name'=>'Garrett Winters'],
	['id'=>3, 'name'=>'Ashton Cox'],
	['id'=>4, 'name'=>'Cedric Kelly'],
	['id'=>5, 'name'=>'Airi Satou'],
	['id'=>6, 'name'=>'Brielle Williamson'],
	['id'=>7, 'name'=>'Herrod Chandler'],
	['id'=>8, 'name'=>'Rhona Davidson'],
	['id'=>9, 'name'=>'Colleen Hurst'],
	['id'=>10, 'name'=>'Sonya Frost'],
	['id'=>11, 'name'=>'Jena Gaines'],
	['id'=>12, 'name'=>'Quinn Flynn'],
	['id'=>13, 'name'=>'Charde Marshall'],
	['id'=>14, 'name'=>'Haley Kennedy'],
	['id'=>15, 'name'=>'Tatyana Fitzpatrick'],
	['id'=>16, 'name'=>'Michael Silva'],
	['id'=>17, 'name'=>'Paul Byrd'],
	['id'=>18, 'name'=>'Gloria Little'],
	['id'=>19, 'name'=>'Bradley Greer'],
	['id'=>20, 'name'=>'Dai Rios'],
	['id'=>21, 'name'=>'Jenette Caldwell'],
	['id'=>22, 'name'=>'Yuri Berry'],
	['id'=>23, 'name'=>'Caesar Vance'],
	['id'=>24, 'name'=>'Doris Wilder'],
];

$months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
$monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

$fixed = 'none';
if (isset($_GET['fixed']) && in_array($_GET['fixed'], ['none', 'start', 'end', 'both'])) {
	$fixed = $_GET['fixed'];
}

$result = [];

$columns = [
	['name'=>'Employee', 'sortable'=>true, 'id'=>'name'],
];
if ($fixed==='start' || $fixed==='both') {
	$columns[0]['fixed'] = 'start';
}
foreach ($months as $index => $month) {
	$columns[] = ['name'=>$monthNames[$index].' 2026', 'sortable'=>true, 'id'=>$month, 'class'=>'text-end'];
}
$columns[] = ['name'=>'Total', 'sortable'=>true, 'id'=>'total', 'class'=>'text-end'];
if ($fixed==='end' || $fixed==='both') {
	$columns[count($columns)-1]['fixed'] = 'end';
}

$result['head']['columns'] = $columns;

if (isset($_GET['sorting'])) {
	$result['sorting'] = json_decode($_GET['sorting'], true);
	if ($result['sorting']===null) {
		$result['sorting'] = [];
	}
	if ($result['sorting']===false) {
		$result['sorting'] = [];
	}
} else {
	$result['sorting'] = [];
}

if (isset($_GET['search'])) {
	$result['search']['value'] = $_GET['search'];
} else {
	$result['search'] = [];
	$result['search']['value'] = '';
}

if (isset($_GET['page'])) {
	$result['page'] = (int)$_GET['page'];
} else {
	$result['page'] = 1;
}

if (isset($_GET['perpage'])) {
	$result['perpage'] = (int)$_GET['perpage'];
} else {
	$result['perpage'] = 10;
}

if (isset($_GET['searchisnew'])) {
	$result['searchisnew'] = (bool)$_GET['searchisnew'];
} else {
	$result['searchisnew'] = false;
}

if ($result['searchisnew']===true) {
	$result['page'] = 1;
}

$rows = [];
foreach ($employees as $employee) {
	if ($result['search']['value']!=='' && stripos($employee['name'], $result['search']['value'])===false) {
		continue;
	}
	$row = ['name'=>$employee['name']];
	$total = 0;
	foreach ($months as $index => $month) {
		$value = (($employee['id'] * 137) + ($index * 61)) % 90000 + 10000;
		$row[$month] = number_format($value, 2, ',', '.').' €';
		$total += $value;
	}
	$row['total'] = number_format($total, 2, ',', '.').' €';
	$rows[] = ['data'=>$row];
}

$totalFiltered = count($rows);
$total = count($employees);

if (!empty($result['sorting'])) {
	usort($rows, function($a, $b) use ($result) {
		foreach ($result['sorting'] as $key => $sort) {
			$av = str_replace(['.', ',', ' €'], ['', '.', ''], $a['data'][$key]);
			$bv = str_replace(['.', ',', ' €'], ['', '.', ''], $b['data'][$key]);
			$cmp = is_numeric($av) && is_numeric($bv) ? $av <=> $bv : strcasecmp($av, $bv);
			if ($cmp !== 0) {
				return strtolower($sort)==='desc' ? -$cmp : $cmp;
			}
		}
		return 0;
	});
}

$result['page'] = max(1, min($result['page'], (int)ceil($totalFiltered / $result['perpage'])));

$result['data'] = array_slice($rows, ($result['page'] - 1) * $result['perpage'], $result['perpage']);

$result['count'] = [
	'all'=>$total,
	'total'=>$total,
	'filtered'=>$totalFiltered,
	'start'=>1 + ($result['page'] - 1) * $result['perpage'],
	'end'=>min($totalFiltered, $result['page'] * $result['perpage']),
	'perpage'=>$result['perpage'],
	'page'=>$result['page'],
];

header('Content-Type: application/json');
echo json_encode($result);
