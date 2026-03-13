<?php

// https://bigprimes.org/

function isPrime(string $Number) {
	if (in_array($Number, ["0", "1"])) {
		echo "0 and 1 are not prime".PHP_EOL;
		return false;
	}

	// Single digits
	if (in_array($Number, ["2", "3", "5"])) {
		echo "Single digit prime".PHP_EOL;
		return true;
	}
	
	// Basic evens and 5s check
	if (in_array(substr($Number, -1), ["0", "2", "4", "5", "6", "8"])) {
		echo "Divisible by 2 or 5".PHP_EOL;
		return false;
	}
	
	// Divisible By 3
	$Digits = str_split($Number);
	if (array_sum($Digits) % 3 === 0) {
		echo "Divisible by 3".PHP_EOL;
		return false;
	}

	// 6n + 1 Rule
	if (bccomp(bcmod($Number, "6"), "1") === 0) {
		return true;
	}

	// If it is not divisible by anything up to it's square root it is prime
	$Root = bcsqrt($Number);

	// We can skip dividing by even numbers otherwise it would not be prime
	for ($i = "7"; bccomp($i, $Root) === -1; $i = bcadd($i, "2")) {
		if (bcmod($Number, $i) === 0) {
			echo "Divisible by $i".PHP_EOL;
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

// Prime - 2.47819901 seconds
// Prime - 0.00001001 seconds
// Prime - 3.80327296 seconds
// Prime - 0.00001001 seconds
// Prime - 2.83387589 seconds
// Prime - 0.00001001 seconds
// Prime - 3.75899577 seconds
// Prime - 0.00000906 seconds
// Prime - 0.00000310 seconds
// Prime - 5.58728290 seconds