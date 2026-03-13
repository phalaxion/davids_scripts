<?php

// https://bigprimes.org/

function isPrime(string $Number) {
	if (in_array($Number, ["0", "1"])) {
		echo "0 and 1 are not prime".PHP_EOL;
		return false;
	}

	// Single digit prime checks
	if (in_array($Number, ["2", "3", "5", "7"])) {
		echo "Single digit prime".PHP_EOL;
		return true;
	}
	
	// If it ends with something divisible by 2 or 5 it can't be prime
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

	// Check the small number before running big boy
	$smallPrimes = ['7', '11', '13', '17', '19', '23', '29'];
	foreach ($smallPrimes as $p) {
		if (bccomp($Number, $p) === 0) return true;
		if (bcmod($Number, $p) === '0') return false;
	}

	// Millar Rabin Time https://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test

	$k = 10; // Number of rounds, more rounds means more accuracy but slower performance

	// Find Multiplier and PowerOfTwo such that Number - 1 = 2^PowerOfTwo * Multiplier
	$Multiplier = bcsub($Number, '1');
	$PowerOfTwo = 0;
	while (bcmod($Multiplier, '2') === '0') {
		$Multiplier = bcdiv($Multiplier, '2');
		$PowerOfTwo++;
	}

	// Saving ourselves a whole clock cycle
	$NumberMinusOne = bcsub($Number, '1');

	for ($i = 0; $i < $k; $i++) {
		// Pick a random base in the range [2, n - 2]
		$Seed = davidsrandom(bcsub($Number, '2'));
		
		// Compute x = Seed^Multiplier mod Number
		$x = bcpowmod($Seed, $Multiplier, $Number);

		if ($x === '1' || $x === $NumberMinusOne) continue;

		$composite = true;
		for ($i = 1; $i < $PowerOfTwo; $i++) {
			$x = bcpowmod($x, '2', $Number);
			if ($x === $NumberMinusOne) {
				$composite = false;
				break;
			}
		}

		if ($composite) return false;
	}

	return true;
}

function davidsrandom(string $upperBound): string {
	$limit = bcsub($upperBound, '2');
	$len = strlen($limit);
	$num = '';

	// Generate a random number digit by digit
	for ($i = 0; $i < $len; $i++) {
		$num .= mt_rand(0, 9);
	}

	// Trim leading zeros
	$num = ltrim($num, '0');
	if ($num === '') $num = '0';

	// If our random number is out of bounds, try again (rare)
	// or simply mod it to stay within range
	if (bccomp($num, $limit) >= 0) {
		return bcadd(bcmod($num, $limit), '2');
	}

	return bccomp($num, '2') < 0 ? '2' : $num;
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

$Primes = [
	"15806908597145411381257560091727792823965344688799073752740128669653976601574251769887737956493509819039285281473513959610971594284740390200065179217621766137456413597329047333015405023005257293036997",
	"15806908597145411381257560091727792823965344688799073752740128669653976601574251769887737956493509819039285281473513959610971594284740390200065179217621766137456413597329047333015405023005257293036997",
	"15806908597145411381257560091727792823965344688799073752740128669653976601574251769887737956493509819039285281473513959610971594284740390200065179217621766137456413597329047333015405023005257293036997",
	"15806908597145411381257560091727792823965344688799073752740128669653976601574251769887737956493509819039285281473513959610971594284740390200065179217621766137456413597329047333015405023005257293036997",
	"15806908597145411381257560091727792823965344688799073752740128669653976601574251769887737956493509819039285281473513959610971594284740390200065179217621766137456413597329047333015405023005257293036997",
	"15806908597145411381257560091727792823965344688799073752740128669653976601574251769887737956493509819039285281473513959610971594284740390200065179217621766137456413597329047333015405023005257293036997",
	"15806908597145411381257560091727792823965344688799073752740128669653976601574251769887737956493509819039285281473513959610971594284740390200065179217621766137456413597329047333015405023005257293036997",
	"15806908597145411381257560091727792823965344688799073752740128669653976601574251769887737956493509819039285281473513959610971594284740390200065179217621766137456413597329047333015405023005257293036997",
	"15806908597145411381257560091727792823965344688799073752740128669653976601574251769887737956493509819039285281473513959610971594284740390200065179217621766137456413597329047333015405023005257293036997",
	"15806908597145411381257560091727792823965344688799073752740128669653976601574251769887737956493509819039285281473513959610971594284740390200065179217621766137456413597329047333015405023005257293036997",
	"15806908597145411381257560091727792823965344688799073752740128669653976601574251769887737956493509819039285281473513959610971594284740390200065179217621766137456413597329047333015405023005257293036997",
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

// Prime - 4.48671389 seconds
// Prime - 0.13954997 seconds
// Prime - 2.05105400 seconds
// Prime - 9.17566013 seconds
// Prime - 2.59119105 seconds
// Prime - 5.16340494 seconds
// Prime - 6.46944189 seconds
// Prime - 2.00703120 seconds
// Prime - 6.31819892 seconds
// Prime - 1.75363493 seconds
// Prime - 6.24513507 seconds