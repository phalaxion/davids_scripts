<?php

function iterate($nums) {
	if (count($nums) == 1) {
		return [$nums[0] == 10, []];
	}

	$OPS = ["+", "-", "*", "/", "AP", "POW"];
	
	for ($i = 0; $i < count($nums); $i++) {
		for ($j = 0; $j < count($nums); $j++) {
			if ($i == $j) continue;

			foreach ($OPS as $op) {
				if (($nums[$i] == 0 || $nums[$j] == 0) && $op == '/') {
					continue;
				}
				else if ($nums[$i] == 0 && $nums[$j] && $op == 'POW') {
					continue;
				}
				$NewVal = calc($nums[$i], $nums[$j], $op);
				
				$NewNums = $nums;
				unset($NewNums[$i]);
				unset($NewNums[$j]);
				$NewNums[] = $NewVal;
				
				list($result, $steps) = iterate(array_values($NewNums));
				if ($result) {
					$steps[] = $nums[$i].$op.$nums[$j].'='.$NewVal;
					return [$result, $steps];
				}
			}						
		}
	}

	return [false, []];
}

function calc($a, $b, $op) {
	if ($op == '+') {
		return $a + $b;
	}
	else if ($op == '-') {
		return $a - $b;
	}
	else if ($op == '*') {
		return $a * $b;
	}
	else if ($op == '/') {
		return $a / $b;
	}
	else if ($op == 'AP') {
		return floatval(strval($a).strval($b));
	}
	else if ($op == 'POW') {
		return pow($a, $b);
	}
	else {
		throw new Exception('Unsupported op - '.$op);
	}
}

for ($i = 0; $i < 1000; $i++) {
	$num = str_pad($i, 4, "0", STR_PAD_LEFT);
	$nums = array_map('intval', str_split($num));
	list($result, $steps) = iterate($nums);

	if ($result) {
		// echo $num, ' can make 10 - '.implode(' -> ', array_reverse($steps)), PHP_EOL;
	} 
	else {
		echo $num, ' doesnt work', PHP_EOL;
	}
}


