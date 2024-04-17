import { whilst } from 'async';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let sum = 0;
let index = 0;

function name() {
  whilst(
    () => sum < 10 && index < numbers.length,
    (callback) => {
      sum += numbers[index];
      index++;
      setTimeout(callback, 1000); // Simulando una operación asincronía
    },
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Suma final:', sum);
    }
  );
  
}

name();