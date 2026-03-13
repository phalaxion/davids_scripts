<?php

// https://bigprimes.org/

function isPrime(string $Number) {
	if (in_array($Number, ["0", "1"])) {
		return false;
	}

	// Single digits
	if (in_array($Number, ["2", "3", "5"])) {
		return true;
	}

	$Base = bcdiv($Number, "2");

	for ($i = "1"; bccomp($i, $Base) === -1; $i = bcadd($i, "1")) {
		if (bcmod($Number, $i) === 0) {
			return false;
		}
	}

	return true;
}

$Primes = [
	"349270320430553",
	"401766577006321",
	"823178593114607",
	"938424840100003",
	"442488100216913",
	"855926618436289",
	"791050116996281",
	"150385614786373",
	"878826758028217",
	"398565979262501"
];

foreach ($Primes as $Prime) {
	$time_start = microtime(true);
	echo (isPrime($Prime) ? 'Prime' : 'Not')." - ";
	$time_end = microtime(true);
	echo number_format($time_end - $time_start, 8)." seconds".PHP_EOL;
}

// echo (isPrime("377761") ? 'Prime' : 'Not').PHP_EOL; // 6 Digits
// echo (isPrime("3696968927") ? 'Prime' : 'Not').PHP_EOL; // 10 Digits
// echo (isPrime("145147048753283") ? 'Prime' : 'Not').PHP_EOL; // 15 Digits
// echo (isPrime("38492242079629362889") ? 'Prime' : 'Not').PHP_EOL; // 20 Digits
// echo (isPrime("797190675654377684755998777691") ? 'Prime' : 'Not').PHP_EOL; // 30 Digits



// ------------------

